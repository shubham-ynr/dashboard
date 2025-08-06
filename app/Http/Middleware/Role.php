<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class Role
{
    public function handle($request, Closure $next, $role = null)
    {
        if (!Auth::check() && $role !== "auth") {
            return redirect()->route('login');
        }

        if(Auth::user() && Auth::user()->status !== 'active' && $role !== "auth") {
            $status = Auth::user()->status;
            Auth::logout();
            $request->session()->regenerate();
            $request->session()->regenerateToken();
            
            return back()->withErrors([
                'message' => 'Your account status is ' . $status . '. Please contact support to access your account.',
                'email' => 'Your account status is ' . $status . '. Please contact support to access your account.',
            ]);
        }

        if (Auth::check() && $role === "auth" && $request->path() === 'auth') {
            return Auth::user()->role === 'admin'
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }

        if (Auth::check() && Auth::user()->role !== $role) {
            return Auth::user()->role === 'admin'
                ? redirect()->route('admin.dashboard')
                : redirect()->route('dashboard');
        }

        return $next($request);
    }
}
