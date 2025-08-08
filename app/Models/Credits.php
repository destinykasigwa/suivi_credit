<?php

namespace App\Models;

use App\Models\CreditsImages;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;


class Credits extends Model
{
    use HasFactory;

    protected $fillable =
    [
        'NumCompte',
        'NomCompte',
        'produit_credit',
        'type_credit',
        'recouvreur',
        'montant_demande',
        'date_demande',
        'frequence_mensualite',
        'nombre_echeance',
        'NumDossier',
        'gestionnaire',
        'source_fond',
        'monnaie',
        'duree_credit',
        'intervale_jrs',
        'taux_interet',
        'type_garantie',
        'valeur_comptable',
        'num_titre',
        'valeur_garantie',
        'description_titre'
    ];

    public function images()
    {
        return $this->hasMany(CreditsImages::class);
    }
}
