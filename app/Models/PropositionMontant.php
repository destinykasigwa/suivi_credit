<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropositionMontant extends Model
{
     use HasFactory;

    protected $fillable = [
        'idUser',
        'idDossier',
        'montant_propose',
        'commentaire'
    ];


    // Relations
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

      // Relation avec le crédit/dossier (table credits, clé primaire id_credit)
    public function dossier()
    {
        return $this->belongsTo(Credits::class, 'idDossier', 'id_credit');
    }
      // Accesseur pour formater le montant
    public function getMontantFormattedAttribute()
    {
        return number_format($this->montant_propose, 0, ',', ' ');
    }
}
