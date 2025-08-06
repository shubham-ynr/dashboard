<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductPrice extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'type',
        'currency',
        'relid',
        'msetupfee',
        'qsetupfee',
        'ssetupfee',
        'asetupfee',
        'bsetupfee',
        'tsetupfee',
        'monthly',
        'quarterly',
        'semiannually',
        'annually',
        'biennially',
        'triennially',
        'billing_cycle',
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
