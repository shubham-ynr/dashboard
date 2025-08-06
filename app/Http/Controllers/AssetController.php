<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;

class AssetController extends Controller
{
    public function public(string $path)
    {
        $filePath = storage_path('app/public/assets/' . $path);

        if (File::exists($filePath)) {
            return Response::file($filePath);
        }

        abort(404, 'File not found');
    }

    public function admin(string $path)
    {
        $filePath = storage_path('app/private/assets/admin/' . $path);

        if (File::exists($filePath)) {
            return Response::file($filePath);
        }

        abort(404, 'File not found');
    }

    public function user(string $path)
    {
        $filePath = storage_path('app/private/assets/user/' . $path);

        if (File::exists($filePath)) {
            return Response::file($filePath);
        }

        abort(404, 'File not found');
    }
}
