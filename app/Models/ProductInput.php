<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class ProductInput extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id',
        'name',
        'type',
        'options',
        'required',
        'order',
    ];

    protected $casts = [
        'required' => 'boolean',
        'options' => 'array', // If you're storing JSON in options
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
