<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CreditChecklist extends Model
{
    use HasFactory;

    // protected $fillable = [
    //     'idUser','idCredit','agence','date_etablissement',
    //     'nom_demandeur','numero_dossier','montant','type_client',

    //     'piece_identite','lettre_demande','formulaire_pret',
    //     'contrat_travail','fiche_paye','recommandation','caution_employeur',
    //     'document_activite','bilan',

    //     'rencontre_adc','capacite_remboursement','fiabilite','avis_positif',
    //     'date_adc','nom_adc',

    //     'date_superviseur','nom_superviseur',

    //     'decision_ctc','decision_cc',

    //     'contrat_signe','garanties_constituees','rencontre_client',

    //     'hypothèque','lettre_garantie','domiciliation_salaire',
    //     'dat','aval','nantissement',

    //     'date_analyste','nom_analyste'
    // ];

    protected $table = 'credit_checklists';
    
    protected $fillable = [
        'idUser',
        'idCredit',
        'agence',
        'date_etablissement',
        'nom_demandeur',
        'numero_dossier',
        'montant',
        'type_client',
        'piece_identite',
        'lettre_demande',
        'formulaire_pret',
        'contrat_travail',
        'fiche_paye',
        'recommandation',
        'caution_employeur',
        'document_activite',
        'bilan',
        'rencontre_adc',
        'capacite_remboursement',
        'fiabilite',
        'avis_positif',
        'date_adc',
        'nom_adc',
        'decision_ctc',
        'decision_cc',
        'contrat_signe',
        'garanties_constituees',
        'rencontre_client',
        'hypothèque',
        'lettre_garantie',
        'domiciliation_salaire',
        'dat',
        'aval',
        'nantissement',
        'date_superviseur',
        'nom_superviseur',
        'signature',
        'date_analyste',
        'nom_analyste',
        'signature',
        'commentaire_analyste',
        'signature_analyste'
    ];
    
    protected $casts = [
        'piece_identite' => 'boolean',
        'lettre_demande' => 'boolean',
        'formulaire_pret' => 'boolean',
        'contrat_travail' => 'boolean',
        'fiche_paye' => 'boolean',
        'recommandation' => 'boolean',
        'caution_employeur' => 'boolean',
        'document_activite' => 'boolean',
        'bilan' => 'boolean',
        'decision_ctc' => 'boolean',
        'decision_cc' => 'boolean',
        'contrat_signe' => 'boolean',
        'garanties_constituees' => 'boolean',
        'rencontre_client' => 'boolean',
        'hypothèque' => 'boolean',
        'lettre_garantie' => 'boolean',
        'domiciliation_salaire' => 'boolean',
        'dat' => 'boolean',
        'aval' => 'boolean',
        'nantissement' => 'boolean',
        'montant' => 'decimal:2',
        'date_etablissement' => 'date',
        'date_adc' => 'date',
        'date_superviseur' => 'date',
        'date_analyste' => 'date',
    ];

    // Relations
    public function user()
    {
        return $this->belongsTo(User::class, 'idUser');
    }

    public function credit()
    {
        return $this->belongsTo(Credits::class, 'idCredit','id_credit');
    }

    public function checklists()
{
    return $this->hasMany(CreditChecklist::class, 'idCredit');
}
}
