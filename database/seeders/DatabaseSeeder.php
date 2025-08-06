<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'first_name' => 'Panel',
            'last_name' => 'Master',
            'email' => 'panelmaster.in@gmail.com',
            'password' => Hash::make('Panelmaster.in@gmail.com1'),
            'role' => 'user',
            'status' => 'active',
            'isVerified' => true,
        ]);
        User::factory()->create([
            'first_name' => 'Panel',
            'last_name' => 'Master',
            'email' => 'panelmaster.dev@gmail.com',
            'password' => Hash::make('Panelmaster.dev@gmail.com1'),
            'role' => 'admin',
            'status' => 'active',
            'isVerified' => true,
        ]);
        User::factory(10000)->create();
        $this->call(SampleProductSeeder::class);
    }
}
