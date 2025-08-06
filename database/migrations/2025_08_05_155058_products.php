<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Categories Table
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('slug')->unique()->index();
            $table->longText('description')->nullable();
            $table->timestamps();
        });

        // Products Table
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')->constrained('categories')->onDelete('cascade')->index();
            $table->string('name');
            $table->longText('description')->nullable();
            $table->string('image')->nullable();
            $table->integer('order')->default(0);
            $table->boolean('active')->default(true);
            $table->timestamps();
        });

        // Product Inputs Table
        Schema::create('product_inputs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade')->index();
            $table->string('name');
            $table->string('type'); // e.g., text, dropdown, checkbox
            $table->text('options')->nullable(); // JSON or serialized options
            $table->boolean('required')->default(false);
            $table->integer('order')->default(0);
            $table->timestamps();
        });

        // Product Prices Table
        Schema::create('product_prices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade')->index();
            $table->string('type')->default('product'); // could be 'product', 'addon', etc.
            $table->string('currency', 10)->default('INR');
            $table->unsignedBigInteger('relid')->nullable()->comment('Related ID for addon/config option');
            
            // Setup fees
            $table->decimal('msetupfee', 10, 2)->default(0);
            $table->decimal('qsetupfee', 10, 2)->default(0);
            $table->decimal('ssetupfee', 10, 2)->default(0);
            $table->decimal('asetupfee', 10, 2)->default(0);
            $table->decimal('bsetupfee', 10, 2)->default(0);
            $table->decimal('tsetupfee', 10, 2)->default(0);
            
            // Recurring amounts
            $table->decimal('monthly', 10, 2)->default(0);
            $table->decimal('quarterly', 10, 2)->default(0);
            $table->decimal('semiannually', 10, 2)->default(0);
            $table->decimal('annually', 10, 2)->default(0);
            $table->decimal('biennially', 10, 2)->default(0);
            $table->decimal('triennially', 10, 2)->default(0);
            
            // Billing cycle
            $table->enum('billing_cycle', [
                'monthly',
                'quarterly',
                'semiannually',
                'annually',
                'biennially',
                'triennially'
            ])->default('monthly');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('product_prices');
        Schema::dropIfExists('product_inputs');
        Schema::dropIfExists('products');
        Schema::dropIfExists('categories');
    }
};
