<?php

namespace App\Models;

use App\Models\Credits;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CreditsImages extends Model
{
    use HasFactory;
    protected $fillable = ['credit_id', 'file_state', 'path'];

    public function credit()
    {
        return $this->belongsTo(Credits::class);
    }
}
