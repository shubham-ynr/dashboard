<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Rules\StrongPassword;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class AuthController extends Controller
{
    public function login(Request $request){
        if($request->isMethod('get')){
            return inertia('auth/login');
        }

        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if(Auth::attempt($request->only('email', 'password'))){
            
            if(Auth::user()->status !== 'active'){
                $status = Auth::user()->status;
                Auth::logout();
                $request->session()->regenerate();
                $request->session()->regenerateToken();
                return back()->withErrors([
                    'message' => 'Your account status is ' . $status . '. Please contact support to access your account.',
                    'email' => 'Your account status is ' . $status . '. Please contact support to access your account.',
                ]);
            }

            if(Auth::user()->role === 'admin'){
                return redirect()->intended(route('admin.dashboard'));
            } else {
                return redirect()->intended(route('dashboard'));
            }
        }
    }

    public function register(Request $request)
    {
        if ($request->isMethod('get')) {
            return inertia('auth/register');
        }
    
        $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                new StrongPassword([
                    $request->first_name,
                    $request->last_name,
                    $request->email,
                ]),
            ],
            'password_confirmation' => 'required|string|same:password',
        ]);
    
        DB::beginTransaction();
    
        try {
            $user = User::create([
                "first_name" => $request->first_name,
                "last_name" => $request->last_name,
                "email" => $request->email,
                "password" => Hash::make($request->password),
            ]);
    
            Auth::login($user);
    
            DB::commit();

            $request->session()->regenerate();
    
            return redirect()->intended(route('dashboard'));
    
        } catch (\Exception $e) {
            DB::rollBack();
    
            return back()->withInput()->withErrors([
                'message' => $e->getMessage(),
            ]);
        }
    }

    public function logout(Request $request){
        if(Auth::check()){
        Auth::logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('login');
        }
        return redirect()->route('login');
    }

    public function resetPassword(Request $request){
        if($request->isMethod('get')){
            return inertia('auth/reset-password');
        }

        // $request->validate([
        //     'username' => ['required']
        //     'email'=> 'required|email',
        // ]);
    }
}
