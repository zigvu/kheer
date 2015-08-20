module Export::ExportSetup
  class MongoExportController < ApplicationController
    include Wicked::Wizard
    before_action :set_steps
    before_action :setup_wizard

    before_action :set_steps_ll, only: [:show, :update]

    def show
      case step
      when :chia_version
        skip_step if settingsHaveBeenConfirmed

        serveChiaVersion
      when :videos
        skip_step if settingsHaveBeenConfirmed

        serveVideos
      when :zdist_threshs
        skip_step if settingsHaveBeenConfirmed

        serveZDistThreshs
      when :event_selection
        skip_step if settingsHaveBeenConfirmed

        serveEventSelection
      when :confirm_settings
        skip_step if settingsHaveBeenConfirmed

        serveConfirmSettings
      when :wait_for_frames
        skip_step if frameIdsHaveBeenReceived

        serveWaitForFrames
      when :send_frames
        skip_step if framesHaveBeenSent

        serveSendFrames
      when :cleanup
        serveCleanup
      end
      render_wizard
    end

    def update
      case step
      when :chia_version
        handleChiaVersion
      when :videos
        handleVideos
      when :zdist_threshs
        handleZDistThreshs
      when :event_selection
        handleEventSelection
      when :confirm_settings
        handleConfirmSettings
      when :wait_for_frames
        handleWaitForFrames
      when :send_frames
        handleSendFrames
      when :cleanup
        handleCleanup
      end
      # for some reason `finish_wizard_path` below not working
      if step == steps.last
        redirect_to export_cellroti_export_path(@cellroti_export)
      else
        render_wizard @cellroti_export
      end
    end

    def finish_wizard_path
      export_cellroti_export_path(@cellroti_export)
    end


    private
      def serveChiaVersion
        @chiaVersionIdLoc = @cellroti_export.chia_version_id_loc
        @chiaVersionIdEvent = @cellroti_export.chia_version_id_event
        @chiaVersions = ::ChiaVersion.all
      end
      def handleChiaVersion
        if params[:chia_version_id_loc] == nil or params[:chia_version_id_event] == nil
          raise "Need to specify both localization and event chia versions"
        end
        chiaVersionIdLoc = params[:chia_version_id_loc].to_i
        chiaVersionIdEvent = params[:chia_version_id_event].to_i
        @cellroti_export.update(
          chia_version_id_loc: chiaVersionIdLoc,
          chia_version_id_event: chiaVersionIdEvent
        )
      end

      def serveVideos
        @chiaVersionIdLoc = @cellroti_export.chia_version_id_loc
        @videoIds = @cellroti_export.video_ids || []

        kjVIds = KheerJob.where(state: States::KheerJobState.new(nil).successProcess)
            .where(chia_version_id: @chiaVersionIdLoc)
            .pluck(:video_id)
        @videos = ::Video.where(id: kjVIds)
      end
      def handleVideos
        if params[:video_ids] == nil
          raise "Need to specify at least 1 video to export"
        end
        videoIds = params[:video_ids].map{ |v| v.to_i }
        @cellroti_export.update(video_ids: videoIds)
      end

      def serveZDistThreshs
        chiaVersionIdLoc = @cellroti_export.chia_version_id_loc
        videoIds = @cellroti_export.video_ids
        @selectedZDistThreshs = @cellroti_export.zdist_threshs || {}

        @chiaVersionLoc = ::ChiaVersion.find(chiaVersionIdLoc)
        allDetIds = @chiaVersionLoc.chia_version_detectables.pluck(:detectable_id)
        @detectables = ::Detectable.where(id: allDetIds)

        cvs = Serializers::ChiaVersionSettingsSerializer.new(@chiaVersionLoc)
        @zdistThreshs = cvs.getSettingsZdistThresh
      end
      def handleZDistThreshs
        zd = params[:det_ids].map{ |d,z| [d.to_i, z.to_f] if z.to_f > -1 } - [nil]
        if zd.count == 0
          raise "Need to specify at least 1 detectable"
        end
        zdistThreshs = Hash[zd]
        @cellroti_export.update(zdist_threshs: zdistThreshs)
      end

      def serveEventSelection
        @chiaVersionIdEvent = @cellroti_export.chia_version_id_event
        @videoIds = @cellroti_export.video_ids
        @selectedEventDetIds = @cellroti_export.event_detectable_ids || {}

        chiaVersionEvent = ::ChiaVersion.find(@chiaVersionIdEvent)
        allDetIds = chiaVersionEvent.chia_version_detectables.pluck(:detectable_id)
        @detectables = ::Detectable.where(id: allDetIds)
      end
      def handleEventSelection
        eventDetectableIds = []
        if params[:event_detectable_ids] != nil
          eventDetectableIds = params[:event_detectable_ids].map{ |e| e.to_i }
        end
        @cellroti_export.update(event_detectable_ids: eventDetectableIds)
      end

      def serveConfirmSettings
        @chiaVersionLoc = ::ChiaVersion.find(@cellroti_export.chia_version_id_loc)
        @chiaVersionEvent = ::ChiaVersion.find(@cellroti_export.chia_version_id_event)
        @videos = ::Video.where(id: @cellroti_export.video_ids)
        @eventDetectables = ::Detectable.where(id: @cellroti_export.event_detectable_ids)
      end
      def handleConfirmSettings
        @cState.setCompleteSetup

        saveData = DataExporters::SaveDataForCellrotiExport.new(@cellroti_export)
        videoIdFileNameMap = saveData.save
        @cellroti_export.update(video_id_filename_map: videoIdFileNameMap)

        cellrotiVideoIdMap = {}
        videoIdFileNameMap.each do |videoId, videoFileNames|
          video = ::Video.find(videoId)
          cellrotiGameId = video.games.first.cellroti_id
          cellrotiChannelId = video.channels.first.cellroti_id

          success, message = CellrotiData::JsonData.sendJsonData(
            videoId, cellrotiGameId, cellrotiChannelId, videoFileNames)

          if not success
            raise "#{message}"
          else
            cellrotiVideoIdMap[videoId] = message
          end
        end
        @cellroti_export.update(cellroti_video_id_map: cellrotiVideoIdMap)
        @cState.setSentData
      end

      def serveWaitForFrames
        @cellrotiVideoIdMap = @cellroti_export.cellroti_video_id_map
        @cState.setWaitingForFrameIds
      end
      def handleWaitForFrames
        # get frame numbers from cellroti
        cellrotiVideoIds = @cellroti_export.cellroti_video_id_map.values.map{ |s| s.to_i }
        frameNumbersMap = CellrotiData::FrameData.getFrameNumbers(cellrotiVideoIds)

        # save frame numbers to file
        saveFrame = DataExporters::SaveFrameForCellrotiExport.new(@cellroti_export)
        newVideoIdFileNameMap = saveFrame.saveFrameNumbers(frameNumbersMap)

        # update filename map
        existigVideoIdFileNameMap = @cellroti_export.video_id_filename_map
        existigVideoIdFileNameMap.each do |videoId, fileNameMap|
          fileNameMap.merge!(newVideoIdFileNameMap[videoId.to_i])
        end
        @cellroti_export.update(video_id_filename_map: existigVideoIdFileNameMap)
        @cState.setReceivedFrameIds
      end

      def serveSendFrames
        @cellrotiVideoIdMap = @cellroti_export.cellroti_video_id_map
      end
      def handleSendFrames
        @cState.setSendingFrames
        # gzip frames
        saveFrame = DataExporters::SaveFrameForCellrotiExport.new(@cellroti_export)
        viFnMap, cellViFnMap = saveFrame.gzipExtractedFrames

        # update filename map
        existigVideoIdFileNameMap = @cellroti_export.video_id_filename_map
        existigVideoIdFileNameMap.each do |videoId, fileNameMap|
          fileNameMap.merge!(viFnMap[videoId.to_i])
        end
        @cellroti_export.update(video_id_filename_map: existigVideoIdFileNameMap)

        # send data to cellroti
        success, message = CellrotiData::FrameData.sendFrameData(cellViFnMap)

        if not success
          raise "#{message}"
        end
        @cState.setSentFrames
      end

      def serveCleanup
      end
      def handleCleanup
        saveData = DataExporters::SaveDataForCellrotiExport.new(@cellroti_export)
        saveData.delete_export_folders

        @cState.setComplete
      end

      # step flow logic
      def settingsHaveBeenConfirmed
        @cState.isCompleteSetup? || @cState.isAfterCompleteSetup?
      end
      def frameIdsHaveBeenReceived
        @cState.isReceivedFrameIds? || @cState.isAfterReceivedFrameIds?
      end
      def framesHaveBeenSent
        @cState.isSentFrames? || @cState.isAfterSentFrames?
      end


      # Use callbacks to share common setup or constraints between actions.
      def set_steps
        session[:cellroti_export_id] ||= params[:cellroti_export_id]
        @cellroti_export = ::CellrotiExport.find(session[:cellroti_export_id])
        @cState = States::CellrotiExportState.new(@cellroti_export)
        
        self.steps = [:chia_version, :videos, :zdist_threshs, :event_selection, 
          :confirm_settings, :wait_for_frames, :send_frames, :cleanup]
      end

      def set_steps_ll
        @current_step = step
        @prev_step = steps.index(step) == 0 ? nil : steps[steps.index(step) - 1]
        @next_step = steps.index(step) == (steps.count - 1) ? nil : steps[steps.index(step) + 1]
      end
  end
end
