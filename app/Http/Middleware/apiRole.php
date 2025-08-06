<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class ApiRole
{
    public function handle($request, Closure $next, $role = null)
    {
        if (!Auth::check() && $role !== "auth") {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 401);
        }

        if(Auth::user() && Auth::user()->status !== 'active' && $role !== "auth") {
            $status = Auth::user()->status;
            Auth::logout();
            $request->session()->regenerate();
            $request->session()->regenerateToken();
            
            return response()->json([
                'success' => false,
                'message' => 'Your account status is ' . $status . '. Please contact support to access your account.',
            ], 401);
        }

        if (Auth::check() && $role === "auth" && $request->path() === 'auth') {
            return Auth::user()->role === 'admin'
                ? response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401)
                : response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
        }

        if (Auth::check() && Auth::user()->role !== $role) {
            return Auth::user()->role === 'admin'
                ? response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401)
                : response()->json([
                    'success' => false,
                    'message' => 'Unauthorized'
                ], 401);
        }

        return $next($request);
    }
}
