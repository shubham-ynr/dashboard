<?php

namespace App\Http\Controllers;

use App\Models\Currency;
use App\Models\User;
use Illuminate\Http\Request;

class AdminViews extends Controller
{
    public function UserManager(Request $request)
    {
        if ($request->isMethod("get")) {
            return inertia('admin/UserManager', [
                'stats' => [
                    'total_users' => User::count(),
                    'active_users' => User::where('status', 'active')->count(),
                    'inactive_users' => User::where('status', 'inactive')->count(),
                    'banned_users' => User::where('status', 'banned')->count(),
                ]
            ]);
        }
    }

    public function ProductManager(Request $request)
    {
        if ($request->isMethod("get")) {
            return inertia('admin/ProductManager');
        }
    }

    public function CurrencyManager(Request $request)
    {
        $currencies = Currency::all();
        return inertia('admin/CurrencyManager', [
            'currencies' => $currencies
        ]);
    }

    public function Dashboard(Request $request)
    {
        if ($request->isMethod("get")) {
            return inertia('admin/Dashboard');
        }
    }
}
