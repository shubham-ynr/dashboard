<?php

use App\Http\Controllers\AdminViews;
use App\Http\Controllers\AssetController;
use App\Http\Controllers\AuthController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('RcLicense/Index');
});

Route::prefix('auth')->middleware('role:auth')->group(function () {
    Route::match(['get', 'post'], '/login', [AuthController::class, 'login'])->name('login');
    Route::match(['get', 'post'], '/register', [AuthController::class, 'register'])->name('register');
    Route::match(['get', 'post'], '/reset-password', [AuthController::class, 'resetPassword'])->name('reset-password');
});
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
    foreach (glob(base_path('modules/*/routes/admin.php')) as $moduleRoute) {
        require $moduleRoute;
    }
    Route::get('/', [AdminViews::class, 'Dashboard'])->name('dashboard');
    Route::get('/users', [AdminViews::class, 'UserManager'])->name('users');
    Route::get('/products', [AdminViews::class, 'ProductManager'])->name('products');
    Route::get('/currencies', [AdminViews::class, 'CurrencyManager'])->name('currencies');
});
Route::middleware(['auth', 'role:user'])->prefix('dashboard')->group(function () {
    foreach (glob(base_path('modules/*/routes/user.php')) as $moduleRoute) {
        require $moduleRoute;
    }
    Route::get('/', function () {
        return Inertia::render('user/Dashboard');
    })->name('dashboard');
});


// Asset serving routes
Route::prefix('assets')->name('assets.')->group(function () {
Route::get('/public/{path}', [AssetController::class, 'public'])->where('path', '.*')->name('public');
Route::get('/admin/{path}', [AssetController::class, 'admin'])->where('path', '.*')->name('admin');
Route::get('/user/{path}', [AssetController::class, 'user'])->where('path', '.*')->name('user');
});


Route::fallback(function () {
    return Inertia::render('errors.404');
});