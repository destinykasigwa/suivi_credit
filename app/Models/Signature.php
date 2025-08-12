<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Signature extends Model
{
    use HasFactory;
    protected $fillable = ['credit_id', 'signature_file', 'signed_by'];

    public function credit()
    {
        return $this->belongsTo(Credits::class, 'credit_id');
    }
}
