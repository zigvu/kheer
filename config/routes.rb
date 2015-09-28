Kheer::Application.routes.draw do

  namespace :stream do
    resources :sports, :leagues, :event_types, :seasons, :sub_seasons, :teams, :games, :channels do
      member do
        get 'synch'
      end
    end
  end

  namespace :api, :defaults => {:format => :json} do
    namespace :v1 do

      post 'frames/update_annotations'
      get 'frames/localization_data'
      get 'frames/heatmap_data'

      get 'minings/show'
      get 'minings/full_localizations'
      get 'minings/full_annotations'
      get 'minings/color_map'
      get 'minings/cell_map'

      get 'minings/confusion'
      get 'minings/difference'
    end
  end

  namespace :chia_data do
    resources :detectables
    resources :chia_version_detectables, only: [:edit, :update, :destroy]
    resources :chia_versions do
      member do
        get 'all_addable_detectables'
        get 'list_detectables'
        get 'add_detectables'
        get 'show_annotations'
      end
    end
  end

  namespace :khajuri_data do
    resources :videos
    resources :kheer_jobs
  end

  namespace :analysis do
    namespace :mining_setup do
      resources :zdist_finder
      resources :chia_version_comparer
      resources :zdist_differencer
      resources :confusion_finder
      resources :sequence_viewer
    end

    resources :minings do
      member do
        get 'set/:set_id' => 'minings#mine', as: :mine
        get 'progress/:set_id' => 'minings#progress', as: :progress
      end
    end
    get 'metrics/video_details'
  end

  namespace :export do
    resources :cellroti_exports
    namespace :export_setup do
      resources :mongo_export
    end
  end

  namespace :retraining do
    resources :iterations
    resources :iteration_setup
  end

  # look at cellroti routes to see how to authenticate this
  match "/delayed_job" => DelayedJobWeb, :anchor => false, via: [:get, :post]

  devise_for :users
  
  
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end
  
  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
