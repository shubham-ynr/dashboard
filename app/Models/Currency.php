<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Currency extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'prefix',
        'suffix',
        'format',
        'rate',
        'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'rate' => 'decimal:4',
    ];
}
