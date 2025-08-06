<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class MakeModule extends Command
{
    protected $signature = 'make:module {name}';
    protected $description = 'Scaffold a new module with routes, controller, and Inertia view';

    public function handle()
    {
        $name = Str::studly($this->argument('name'));
        $basePath = base_path("modules/{$name}");

        if (File::exists($basePath)) {
            $this->error("Module '{$name}' already exists!");
            return;
        }

        // Create directories
        File::makeDirectory("{$basePath}/Controllers", 0755, true);
        File::makeDirectory("{$basePath}/routes", 0755, true);
        File::makeDirectory("{$basePath}/Views", 0755, true);

        // Create web.php
        File::put("{$basePath}/routes/web.php", $this->routeTemplate($name));

        // Create controller
        File::put("{$basePath}/Controllers/{$name}Controller.php", $this->controllerTemplate($name));

        // Create basic React view
        File::put("{$basePath}/Views/Index.jsx", $this->viewTemplate($name));

        $this->info("Module '{$name}' created successfully!");
    }

    protected function routeTemplate($name)
    {
        return <<<PHP
<?php

use Illuminate\Support\Facades\Route;
use Modules\\{$name}\\Controllers\\{$name}Controller;

Route::prefix(strtolower('{$name}'))->middleware(['auth'])->group(function () {
    Route::get('/', [{$name}Controller::class, 'index'])->name(strtolower('{$name}').'.index');
});
PHP;
    }

    protected function controllerTemplate($name)
    {
        return <<<PHP
<?php

namespace Modules\\{$name}\\Controllers;

use Inertia\\Inertia;
use Illuminate\\Routing\\Controller;

class {$name}Controller extends Controller
{
    public function index()
    {
        return Inertia::render('{$name}/Index');
    }
}
PHP;
    }

    protected function viewTemplate($name)
    {
        return <<<JSX
import React from 'react';

export default function Index() {
    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">{$name} Module</h1>
            <p>Welcome to the {$name} index page.</p>
        </div>
    );
}
JSX;
    }
}
