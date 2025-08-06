<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        foreach (glob(app_path('Helpers') . '/*.php') as $file) {
            require_once $file;
        }

        $modulesPath = base_path('modules');
        foreach (glob($modulesPath . '/*') as $modulePath) {
            $controllerPath = "{$modulePath}/Controllers";
            if (is_dir($controllerPath)) {
                foreach (glob("{$controllerPath}/*.php") as $controllerFile) {
                    require_once $controllerFile;
                }
            }
        }
        
        // $modulesPath = base_path('modules');
        foreach (glob($modulesPath . '/*') as $modulePath) {
            $middlewarePath = "{$modulePath}/middleware";
            if (is_dir($middlewarePath)) {
                foreach (glob("{$middlewarePath}/*.php") as $middlewareFile) {
                    require_once $middlewareFile;
                }
            }
        }
    }
}
