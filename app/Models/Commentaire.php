<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Commentaire extends Model
{
    use HasFactory;

    protected $fillable = ['credit_id', 'user_id', 'contenu', "parent_id"];

    public function credit()
    {
        return $this->belongsTo(Credits::class, 'credit_id', 'id_credit');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function replies()
    {
        return $this->hasMany(Commentaire::class, 'parent_id')->with('user', 'replies');
    }

    public function parent()
    {
        return $this->belongsTo(Commentaire::class, 'parent_id');
    }
}
