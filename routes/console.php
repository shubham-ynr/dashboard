<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('make:component {name}', function ($name) {
    $name = str_replace('\\', '/', $name);
    $segments = explode('/', $name);
    $rawFileName = array_pop($segments);
    $componentName = Str::studly($rawFileName);
    $relativePath = implode('/', $segments);
    $fullDir = resource_path('components/' . $relativePath);
    if (!File::exists($fullDir)) {
        File::makeDirectory($fullDir, 0755, true);
    }
    $filePath = $fullDir . '/' . $componentName . '.jsx';
    if (file_exists($filePath)) {
        $this->warn("Component already exists at {$filePath}.");
        if (!$this->confirm("Do you want to overwrite it?")) {
            $this->info("Operation cancelled.");
            return;
        }
    }
    $componentCode = <<<JSX
export default function {$componentName}() {
    return (
        <div>
            <h1>{$componentName}</h1>
        </div>
    );
}
JSX;
    file_put_contents($filePath, $componentCode);
    $this->info("Component '{$componentName}' created at: resources/components/{$relativePath}/{$componentName}.jsx");
})->describe('Create a new React component under resources/components');

Artisan::command('make:page {name}', function ($name) {
    $name = str_replace('\\', '/', $name);
    $segments = explode('/', $name);
    $rawFileName = array_pop($segments);
    $componentName = Str::studly($rawFileName);
    $relativePath = implode('/', $segments);
    $fullDir = resource_path('pages/' . $relativePath);
    if (!File::exists($fullDir)) {
        File::makeDirectory($fullDir, 0755, true);
    }
    $filePath = $fullDir . '/' . $componentName . '.jsx';
    if (file_exists($filePath)) {
        $this->warn("Page already exists at {$filePath}.");
        if (!$this->confirm("Do you want to overwrite it?")) {
            $this->info("Operation cancelled.");
            return;
        }
    }
    $pageCode = <<<JSX
export default function {$componentName}() {
    return (
        <div>
            <h1>{$componentName}</h1>
        </div>
    );
}
JSX;
    file_put_contents($filePath, $pageCode);
    $this->info("Page '{$componentName}' created at: resources/pages/{$relativePath}/{$componentName}.jsx");
})->describe('Create a new React component under resources/components');
