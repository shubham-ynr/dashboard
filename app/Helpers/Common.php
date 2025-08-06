<?php

use Illuminate\Support\Str;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

if(!function_exists('GenerateUID')){
    function GenerateUID(){
        return Str::uuid();
    }
}

if(!function_exists('GenerateUsername')){
    function GenerateUsername($role = "user"){
        $prefix = ($role == "user") ? "CU" : "AU";
        do {
            $username = $prefix . strtoupper(substr(hash('sha256', Str::random(10)), 0, 8)) . rand(100, 999);
            $user = User::where('username', $username)->first();
        } while ($user);
        return $username;
    }
}