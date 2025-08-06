<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'name',
        'description',
        'image',
        'order',
        'active',
    ];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function inputs()
    {
        return $this->hasMany(ProductInput::class);
    }

    public function prices()
    {
        return $this->hasMany(ProductPrice::class);
    }
}
