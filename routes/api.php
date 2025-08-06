<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CurrencyManager;
use App\Http\Controllers\UserManager;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Currency Management API Routes
Route::prefix('admin/currencies')->name('currencies.')->group(function () {
    Route::post('/handle', [CurrencyManager::class, 'handleCurrency'])->name('handle');
    Route::get('/', [CurrencyManager::class, 'getCurrencies'])->name('get');
    Route::post('/update-rates', [CurrencyManager::class, 'updateExchangeRates'])->name('update-rates');
    Route::post('/update-single-rate', [CurrencyManager::class, 'updateSingleRate'])->name('update-single-rate');
    Route::post('/set-default', [CurrencyManager::class, 'setDefaultCurrency'])->name('set-default');
});

// User Management API Routes - Protected by admin middleware
Route::prefix('admin/users')->name('users.')->group(function () {
    Route::get('/', [UserManager::class, 'getUsers'])->name('get');
    Route::get('/stats', [UserManager::class, 'getUserStats'])->name('stats');
    Route::post('/', [UserManager::class, 'createUser'])->name('create');
    Route::get('/{id}', [UserManager::class, 'getUser'])->name('show');
    Route::put('/{id}', [UserManager::class, 'updateUser'])->name('update');
    Route::delete('/{id}', [UserManager::class, 'deleteUser'])->name('delete');
    Route::patch('/{id}/status', [UserManager::class, 'updateUserStatus'])->name('status');
    Route::patch('/{id}/verify', [UserManager::class, 'verifyUser'])->name('verify');
});
