<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductInput;
use App\Models\ProductPrice;
use App\Models\Currency;

class SampleProductSeeder extends Seeder
{
    public function run(): void
    {
        // Create INR currency
        $currency = Currency::create([
            'code' => 'INR',
            'prefix' => '₹',
            'suffix' => '',
            'format' => '1,234.56',
            'rate' => 1.0000,
            'is_default' => true,
        ]);

        Currency::create([
            'code' => 'USD',
            'prefix' => '$',
            'suffix' => '',
            'format' => '1,234.56',
            'rate' => 1.0000,
            'is_default' => false,
        ]);
        Currency::create([
            'code' => 'EUR',
            'prefix' => '€',
            'suffix' => '',
            'format' => '1,234.56',
            'rate' => 1.0000,
            'is_default' => false,
        ]);

        // Create a category
        $category = Category::create([
            'name' => 'Hosting',
            'slug' => 'hosting',
            'description' => 'Web hosting services',
        ]);

        // Create a product
        $product = Product::create([
            'category_id' => $category->id,
            'name' => 'Basic Hosting Plan',
            'description' => 'Perfect for small websites and blogs.',
            'image' => null,
            'order' => 1,
            'active' => true,
        ]);

        // Create inputs
        ProductInput::create([
            'product_id' => $product->id,
            'name' => 'Operating System',
            'type' => 'select',
            'options' => json_encode(['Linux', 'Windows']),
            'required' => true,
            'order' => 1,
        ]);

        ProductInput::create([
            'product_id' => $product->id,
            'name' => 'Control Panel',
            'type' => 'radio',
            'options' => json_encode(['cPanel', 'Plesk']),
            'required' => false,
            'order' => 2,
        ]);

        // Create pricing
        ProductPrice::create([
            'product_id' => $product->id,
            'type' => 'product',
            'currency' => 'INR',
            'relid' => null,
            'msetupfee' => 0,
            'qsetupfee' => 0,
            'ssetupfee' => 0,
            'asetupfee' => 0,
            'bsetupfee' => 0,
            'tsetupfee' => 0,
            'monthly' => 199.00,
            'quarterly' => 549.00,
            'semiannually' => 999.00,
            'annually' => 1899.00,
            'biennially' => 3499.00,
            'triennially' => 4999.00,
            'billing_cycle' => 'monthly',
        ]);
    }
}
