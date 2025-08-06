<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create("currencies", function (Blueprint $table) {
            $table->id();
            $table->string("code", 3)->unique();
            $table->string("prefix", 5)->nullable();
            $table->string("suffix", 5)->nullable();
            $table->enum("format", ['1,234.56', '1.234,56', '1 234.56', '1 234,56'])->default('1,234.56');
            $table->decimal("rate", 10, 4)->default(1);
            $table->boolean("is_default")->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists("currencies");
    }
};
