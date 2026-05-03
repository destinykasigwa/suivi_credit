<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, DB, Log, Storage, Validator};
use App\Models\{Commentaire, CreditChecklist, Credits, CreditsImages, PropositionMontant, Signature, User};
use App\Services\SendNotification;

class AGestionCreditController extends Controller
{
    //
    protected $sendNotification;
    public function __construct()
    {
        $this->middleware("auth");
        $this->sendNotification = app(SendNotification::class);
    }

    public function AMontangeCreditHomePage()
    {
        return view("gestion_credit.pages.montage-credit");
    }

    public function  ValidatioCreditHomePage()
    {
        return view("gestion_credit.pages.validation-credit");
    }


    public function  CreditDecaisseHomePage()
    {
        return view("gestion_credit.pages.credit-decaisse");
    }

    public function getCreditEncoursDecaisseHomePage(){
       return view("gestion_credit.pages.credit-encours-decaisss");  
    }



    public function store(Request $request)
    {
        $validator = validator::make($request->all(), [
            'NumCompte'  => 'required|string',
            'NomCompte'  => 'required|string',
            'produit_credit'  => 'required|string',
            'type_credit'  => 'required|string',
            //'recouvreur'  => 'required|string',
            'montant_demande'  => 'required|string',
            'date_demande'  => 'required|string',
            'frequence_mensualite' => 'required|string',
            'nombre_echeance' => 'required|string',
            // 'NumDossier' => 'required|string',
            //'gestionnaire' => 'required|string',
            //'source_fond' => 'required|string',
            'monnaie' => 'required|string',
            'duree_credit' => 'required|string',
            'intervale_jrs' => 'required|string',
            'taux_interet' => 'required|string',
            'objet_credit' => 'required|string',

            // 'type_garantie' => 'required|string',
            // 'valeur_comptable' => 'required|string',
            // 'num_titre' => 'required|string',
            // 'valeur_garantie' => 'required|string',
            // 'description_titre' => 'required|string',
            // 'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'images.*' => 'mimes:jpg,jpeg,png,pdf,xlsx,xls|max:5048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'msg' => "Certains champs obligatoire n'est sont pas renseignés",
                'validate_error' => $validator->messages()
            ]);
        }

        $credit = Credits::create([
            'NumCompte' => $request->NumCompte,
            'NomCompte' => $request->NomCompte,
            'produit_credit' => $request->produit_credit,
            'type_credit' => $request->type_credit,
            'type_credit' => $request->type_credit,
            'recouvreur' => $request->recouvreur,
            'montant_demande' => $request->montant_demande,
            'date_demande' => $request->date_demande,
            'frequence_mensualite' => $request->frequence_mensualite,
            'nombre_echeance' => $request->nombre_echeance,
            'NumDossier' => $request->NumDossier,
            'gestionnaire' => $request->gestionnaire,
            'source_fond' => $request->source_fond,
            'monnaie' => $request->monnaie,
            'duree_credit' => $request->duree_credit,
            'intervale_jrs' => $request->intervale_jrs,
            'taux_interet' => $request->taux_interet,
            'type_garantie' => $request->type_garantie,
            'valeur_comptable' => $request->valeur_comptable,
            'num_titre' => $request->num_titre,
            'valeur_garantie' => $request->valeur_garantie,
            'date_sortie_titre' => $request->date_sortie_titre,
            'date_expiration_titre' => $request->date_expiration_titre,
            // 'description_titre' => $request->description_titre,
            'nombre_membre_groupe' => $request->nombre_membre_groupe,
            'nombre_homme_groupe' => $request->nombre_homme_groupe,
            'nombre_femme_groupe' => $request->nombre_femme_groupe,
            'objet_credit' => $request->objet_credit,
            'Agence' => $request->Agence,

        ]);

        if (isset($request->description_titre)) {
            $idCredit = Credits::latest()->first()->id_credit;
            Commentaire::create([
                'credit_id' => $idCredit,
                'user_id' => auth()->id(),
                'contenu' => $request->description_titre,
            ]);
        }
        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $image) {
                // Conserver le nom original mais ajouter un timestamp devant
                $filename = date('Ymd_His') . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('credits', $filename, 'public'); // Stocke dans storage/app/public/credits
                // Copier seulement si c'est un fichier Excel
                $extension = strtolower($image->getClientOriginalExtension());
                if (in_array($extension, ['xlsx', 'xls'])) {
                    $image->move(public_path('credit'), $filename);
                    $credit->images()->create([
                        'file_state' => 'ia',
                        'path' => "credit/" . $filename
                    ]);
                } else {
                    $credit->images()->create([
                        'file_state' => 'ia',
                        'path' => $path
                    ]);
                }
            }
        }
        //  else {
        //     return response()->json([
        //         'status' => 0,
        //         'msg' => 'Aucune image séléctionnée',
        //         // 'credit' => $credit->load('images'),
        //     ]);
        // }
        // PropositionMontant::create([
        //     'idUser' => Auth::id(),
        //     'idDossier' => $idCredit,
        //     'montant_propose' => $request->montant_demande
        // ]);

        return response()->json([
            'status' => 1,
            'msg' => 'Crédit enregistré avec succès',
            'credit' => $credit->load('images'),
        ]);
    }

    //RECUPERE LA LISTE DE CREDIT MONTES

    public function getCreditValidation()
    {
        $credits = DB::table('credits')
            ->where("statutDossier", "!=", "Décaissé")
             ->where("statutDossier", "!=", "Encours de Décaissement")
            ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
            ->limit(100)
            ->get();

        foreach ($credits as $credit) {
            $credit->images = DB::table('credits_images')
                ->where('credits_id', $credit->id_credit)
                ->pluck('path'); // retourne un tableau
        }
        return response()->json([
            "status" => 1,
            "data" => $credits
        ]);
    }

    public function getSearchedCredit(Request $request)
    {

        if ($request->type_recherche == "AC") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('statutDossier', '!=', 'Décaissé')
                        ->where(function ($q) use ($ref) {
                            $q->where('gestionnaire', $ref);
                            // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                        });
                })
                ->limit(10)
                ->get();
            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else if ($request->type_recherche == "type_credit") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('statutDossier', '!=', 'Décaissé')
                        ->where(function ($q) use ($ref) {
                            $q->where('type_credit', $ref);
                            // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                        });
                })
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else if ($request->type_recherche == "credit_refuse") {

            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('statutDossier', '=', 'Refusé');
                })
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('statutDossier', '!=', 'Décaissé')
                        ->where(function ($q) use ($ref) {
                            $q->where('NumCompte', $ref)
                                ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                        });
                })
                ->limit(10)
                ->get();
            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        }
    }


    public function getSearchedCreditDecaisse(Request $request)
    {

        if ($request->type_recherche == "AC") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('gestionnaire', $ref);
                    // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Décaissé")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else if ($request->type_recherche == "type_credit") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('type_credit', $ref);
                    // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Décaissé")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('gestionnaire', $ref)
                        ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Décaissé")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        }
    }

     public function getSearchedCreditAtente(Request $request)
    {

        if ($request->type_recherche == "AC") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('gestionnaire', $ref);
                    // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Encours de Décaissement")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else if ($request->type_recherche == "type_credit") {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('type_credit', $ref);
                    // ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Encours de Décaissement")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        } else {
            $ref = $request->ref;
            $credits = DB::table('credits')
                ->where(function ($query) use ($ref) {
                    $query->where('gestionnaire', $ref)
                        ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
                })
                ->where("statutDossier", "Encours de Décaissement")
                ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
                ->limit(10)
                ->get();

            // Ajout des images pour chaque crédit trouvé
            foreach ($credits as $credit) {
                $credit->images = DB::table('credits_images')
                    ->where('credits_id', $credit->id_credit)
                    ->pluck('path'); // Retourne un tableau simple
            }
            return response()->json([
                "status" => 1,
                "data" => $credits
            ]);
        }
    }

    public function getCreditToDelete($id)
    {
        if (Auth::user()->role == "DG") {
            Credits::where("id_credit", $id)->delete();
            return response()->json([
                "status" => 1,
                "msg" => "Dossier de crédit supprimé avec succès"
            ]);
        } else {
            return response()->json([
                "status" => 0,
                "msg" => "Vous n'avez pas une autorisation requise pour supprimer un dossier de crédit"
            ]);
        }
    }


    public function showDossier($id)
    {
        // Récupère le dossier
        $dossier = DB::table('credits')->where('id_credit', $id)->first();
        // Récupérer les propositions de montant pour ce dossier
        // Récupérer les propositions avec la dernière par acteur
        $propositions = DB::table('proposition_montants')
            ->join('users', 'proposition_montants.idUser', '=', 'users.id')
            ->where('proposition_montants.idDossier', $id)
            ->select(
                'users.name as nom',
                'users.role as role',
                'users.id as userId',
                'proposition_montants.montant_propose as montant',
                'proposition_montants.created_at as date',
                'proposition_montants.idUser',
                'proposition_montants.commentaire'
            )
            ->orderBy('proposition_montants.created_at', 'desc')
            ->get()
            ->unique('userId') // Prend la dernière proposition par utilisateur (car orderBy desc)
            ->values();





        if (!$dossier) {
            return response()->json(['message' => 'Dossier non trouvé'], 404);
        }
        //RECUPERE LES COMMENTAIRES LIES AU DOSSIER
        // $commentaires = Commentaire::with('user')
        //     ->where('credit_id', $id)
        //     ->orderBy('created_at', 'desc')
        //     ->get();
        // Récupérer les commentaires liés au dossier avec leurs réponses et l’auteur
        $commentaires = Commentaire::with(['user', 'replies.user'])
            ->where('credit_id', $id)
            ->whereNull('parent_id') // uniquement les commentaires racine
            ->orderBy('created_at', 'desc')
            ->get();

        // Récupère les fichiers liés (images + pdfs) fichier lié à l'activité 
        // $fichiers = DB::table('credits_images')
        //     ->where('credits_id', $id)
        //     ->where('file_state', "ia")
        //     ->pluck('id', 'path');
        // $fichiers = DB::table('credits_images')
        //     ->where('credits_id', $id)
        //     ->where('file_state', "ia")
        //     ->select('id', 'path')
        //     ->get();
        $fichiers = DB::table('credits_images')
            ->where('credits_id', $id)
            ->select('id', 'path', 'file_state')
            ->get();



        // Récupère les images de l'activité du membre
        // $imageMembres = DB::table('credits_images')
        //     ->where('credits_id', $id)
        //     //->where('file_state', "im")
        //     ->select('id', 'path')
        //     ->get();
        //dd($imageActivite);

        // Sépare images et pdfs
        $images = [];
        $pdfs = [];
        $excels = [];

        foreach ($fichiers as $fichier) {
            $ext = strtolower(pathinfo($fichier->path, PATHINFO_EXTENSION));

            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                $images[] = $fichier;
            } elseif ($ext === 'pdf') {
                $pdfs[] = $fichier;
            } elseif (in_array($ext, ['xlsx', 'xls'])) {
                $excels[] = $fichier;
            }
        }


        // 🔹 Récupère les fichiers de signatures liés
        // $signatures = DB::table('signatures')
        //     ->where('credit_id', $id) // correspond à id_credit dans credits
        //     ->pluck('signature_file');
        // Historique (liste complète)
        $signatures = DB::table('signatures')
            ->where('credit_id', $id)
            ->pluck('signature_file');

        // Dernier fichier uniquement
        $lastSignature = DB::table('signatures')
            ->where('credit_id', $id)
            ->orderBy('created_at', 'desc')
            ->value('signature_file');

        // Convertis l'objet $dossier (stdClass) en tableau associatif
        $dossierArray = (array) $dossier;
        $dossierArray['propositions'] = $propositions;
        //dd($excels);
        // Ajoute images, pdfs et signatures
        $dossierArray['images'] = $images;
        $dossierArray['pdfs'] = $pdfs;
        $dossierArray['excels'] = $excels;
        $dossierArray['signatures'] = $signatures;
        $dossierArray['lastSignature'] = $lastSignature;
        $dossierArray['commentaires'] = $commentaires;
        $dossierArray['current_user'] = auth()->user();
        // $dossierArray['imageMembre'] = $imageMembres;



        return response()->json([
            'data' => $dossierArray
        ]);
    }

    //UPDATE DOSSIER
    public function updateDossier(Request $request)
    {
        //dd($request->all());

        $checkStatus = Credits::where("id_credit", $request->idDossier)->first();

        if ($checkStatus->statutDossier == "Décaissé") {
            return response()->json([
                "status" => 0,
                "msg" => "Impossible de modifier un dossier déjà décaissé ! "
            ]);
        } else {
            //dd($request->all());


    $dateOctroie = date("Y-m-d");

$dateOctroiFromDb = Credits::where("id_credit", $request->idDossier)
    ->value('date_octroie');

if ($request->statutDossier == "Décaissé" && $dateOctroiFromDb == null) {
    $finalDateOctroie = $dateOctroie;
} else {
    $finalDateOctroie = $dateOctroiFromDb;
}
            
            Credits::where("id_credit", $request->idDossier)->update([
                "NumCompte" => $request->NumCompte,
                "NomCompte" => $request->NomCompte,
                "produit_credit" => $request->produit_credit,
                "type_credit" => $request->type_credit,
                "recouvreur" => $request->recouvreur,
                "montant_demande" => $request->montant_demande,
                "date_demande" => $request->date_demande,
                "date_octroie" => $finalDateOctroie,
                "frequence_mensualite" => $request->frequence_mensualite,
                "nombre_echeance" => $request->nombre_echeance,
                "NumDossier" => $request->NumDossier,
                "gestionnaire" => $request->gestionnaire,
                "source_fond" => $request->source_fond,
                "monnaie" => $request->monnaie,
                "duree_credit" => $request->duree_credit,
                "intervale_jrs" => $request->intervale_jrs,
                "taux_interet" => $request->taux_interet,
                "type_garantie" => $request->type_garantie,
                "valeur_comptable" => $request->valeur_comptable,
                "num_titre" => $request->num_titre,
                "valeur_garantie" => $request->valeur_garantie,
                "date_sortie_titre" => $request->date_sortie_titre,
                "date_expiration_titre" => $request->date_expiration_titre,
                "description_titre" => $request->description_titre,
                'nombre_membre_groupe' => $request->nombre_membre_groupe,
                'nombre_homme_groupe' => $request->nombre_homme_groupe,
                'nombre_femme_groupe' => $request->nombre_femme_groupe,
                'objet_credit' => $request->objetCredit,
                "statutDossier" => $request->statutDossier,
                "Agence" => $request->Agence
            ]);

            return response()->json([
                "status" => 1,
                "msg" => "Mise à jour effectuée avec succès ! "
            ]);
        }
    }

    //PERMET D'AJOUTER LE FICHIER DE SIGNATURE AU DOSSIER

    public function addFileDossier(Request $request)
    {
        $request->validate([
            'signature_file' => 'required|mimes:jpg,jpeg,png,pdf|max:2048',
            // 'signed_by' => 'nullable|string|max:255'
        ]);
        try {
            $this->signerDossier($request->idDossier);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'msg' => $e->getMessage()
            ]);
        }

        $credit = Credits::findOrFail($request->idDossier);
        // $credit = Credits::where("id_credit", $request->idDossier)->first();
        $path = $request->file('signature_file')->store('signatures', 'public');

        $credit->signatures()->create([
            'signature_file' => $path,
            'signed_by' => Auth::user()->role,
        ]);

        return response()->json([
            'status' => 1,
            'msg' => 'Signature ajoutée avec succès.',
            'signature_file' => $path
        ]);
    }

    public function showTimeLine($creditId)
    {
        $signatures = DB::table('signatures')
            ->where('credit_id', $creditId)
            ->orderBy('created_at', 'asc') // ordre chronologique
            ->get();

        $timeline = [];
        $previousDate = null;

        foreach ($signatures as $sig) {
            $delay = null;
            if ($previousDate) {
                // Comparer uniquement les jours (sans heures)
                $delay = \Carbon\Carbon::parse($sig->created_at)->startOfDay()
                    ->diffInDays(\Carbon\Carbon::parse($previousDate)->startOfDay());
            }

            $timeline[] = [
                'signed_by' => $sig->signed_by,
                'signature_file' => $sig->signature_file,
                'signed_at' => $sig->created_at,
                'delay_from_previous' => $delay,
                'id' => $sig->id,
            ];

            $previousDate = $sig->created_at;
        }

        return response()->json([
            "data" => $timeline,
            'current_user' => auth()->user(),
        ]);
    }


    public function getCreditDecaisse()
    {
        $credits = DB::table('credits')->where('statutDossier', 'Décaissé')->limit(10)->get();

        foreach ($credits as $credit) {
            $credit->images = DB::table('credits_images')
                ->where('credits_id', $credit->id_credit)
                ->pluck('path'); // retourne un tableau
        }
        return response()->json([
            "status" => 1,
            "data" => $credits
        ]);
    }


    public function getCreditEncoursDecaisse(){
      $credits = DB::table('credits')->where('statutDossier', 'Encours de Décaissement')->limit(10)->get();

        foreach ($credits as $credit) {
            $credit->images = DB::table('credits_images')
                ->where('credits_id', $credit->id_credit)
                ->pluck('path'); // retourne un tableau
        }
        return response()->json([
            "status" => 1,
            "data" => $credits
        ]);  
    }
    //PERMET D'AJOUTER UNE NOUVEAU FICHIER AU DOSSIER 
    public function addNewFile(Request $request)
    {

        // Vérifier l'extension
        $file = $request->file('newFile');

        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'xlsx', 'xls'];
        $extension = strtolower($file->getClientOriginalExtension());

        if (!in_array($extension, $allowedExtensions)) {
            return response()->json([
                "status" => 0,
                "msg" => "Format de fichier non autorisé. Seuls les PDF et les images (jpg, jpeg, png) sont acceptés."
            ]);
        }

        $checkStatus = Credits::where("id_credit", $request->creditId)->first();

        if ($checkStatus->statutDossier == "Décaissé") {
            return response()->json([
                "status" => 0,
                "msg" => "Impossible de modifier un dossier déjà décaissé ! "
            ]);
        } else {


            if ($request->hasFile('newFile')) {
                $file = $request->file('newFile');

                // Conserver le nom original mais ajouter un timestamp devant
                $filename = date('Ymd_His') . '_' . $file->getClientOriginalName();

                // Sauvegarder le fichier
                $path = $file->storeAs('credits', $filename, 'public');

                $extension = strtolower($file->getClientOriginalExtension());
                if (in_array($extension, ['xlsx', 'xls'])) {
                    $file->move(public_path('credit'), $filename);
                    $checkStatus->images()->create([
                        'file_state' => 'ia',
                        'path' => "credits/" . $filename
                    ]);
                } else {
                    $checkStatus->images()->create([
                        'file_state' => 'ia',
                        'path' => $path
                    ]);
                }


                return response()->json([
                    "status" => 1,
                    "msg" => "Nouveau fichier ajouté avec succès",
                    "path" => $path
                ]);
            }

            return response()->json([
                "status" => 0,
                "msg" => "Aucun fichier reçu"
            ]);
        }
    }

    //CETE FONCTION PERMET D'EMPCEHER UN ACTEUR DE POSER LA SIGNATURE AVANT L'ACTEUR CONCERNE
    public function signerDossier($refDossier)
    {
        // Rôles dans l’ordre chronologique
        $roles = [
            "AC",
            "Superviseur",
            // "Chef Agence",
            "CTC",
            // "DG",
            "CC"
        ];

        // Rôle de l’utilisateur courant
        $currentRole = auth()->user()->role;

        // Index du rôle courant
        $currentIndex = array_search($currentRole, $roles);

        if ($currentIndex === false) {
            throw new \Exception("Rôle non autorisé");
        }

        // On récupère la signature du dossier
        // $dossier = DB::table('signatures')
        //     ->where('credit_id', $refDossier)
        //     ->first();

        // if (! $dossier) {
        //     throw new \Exception("Dossier introuvable");
        // }

        // Vérifier si le rôle précédent a signé
        if ($currentIndex > 0) {
            $previousRole = $roles[$currentIndex - 1];

            // Vérifier que le champ signed_by contient déjà le rôle précédent
            $hasPreviousSigned = DB::table('signatures')
                ->where('credit_id', $refDossier)
                ->where('signed_by', $previousRole)
                ->exists();


            if (!$hasPreviousSigned) {

                throw new \Exception("Le rôle $previousRole doit signer avant vous.");
            }
        }

        // Vérifier que le rôle courant n’a pas déjà signé
        $alreadySigned = DB::table('signatures')
            ->where('credit_id', $refDossier)
            ->where('signed_by', $currentRole)
            ->exists();

        if ($alreadySigned) {
            throw new \Exception("Vous avez déjà signé ce dossier.");
        }
    }




    public function DashBoardStat()
    {
        // 1. Statistiques sur les crédits
        $stats = [
            'credits_encours'   => Credits::where('statutDossier', 'Encours')->count(),
            'credits_decaisse'  => Credits::where('statutDossier', 'Décaissé')->count(),
            'credits_rejetes'   => Credits::where('statutDossier', 'Refusé')->count(),
            'credits_encours_decaissement'   => Credits::where('statutDossier', 'Encours de Décaissement')->count(),
        ];

        // 2. Total des dossiers (TOUS les statuts confondus)
        $totalDossiers = Credits::count();

        // 3. Répartition des signatures par acteur
        $signatures = Signature::select('signed_by', DB::raw('count(*) as total'))
            ->groupBy('signed_by')
            ->orderBy(DB::raw('MIN(signatures.created_at)'))
            ->get();

        // 4. Délai moyen de signature par acteur (en jours)
        $delaiSignatures = Signature::select(
            'signed_by',
            DB::raw('AVG(TIMESTAMPDIFF(DAY, credits.created_at, signatures.created_at)) as delai_moyen')
        )
            ->join('credits', 'credits.id_credit', '=', 'signatures.credit_id')
            ->groupBy('signed_by')
            ->orderBy(DB::raw('MIN(signatures.created_at)'))
            ->get();

        // 5. Timeline globale : délai moyen par mois
        $timeline = Signature::select(
            DB::raw("DATE_FORMAT(signatures.created_at, '%Y-%m') as mois"),
            DB::raw('AVG(TIMESTAMPDIFF(DAY, credits.created_at, signatures.created_at)) as delai_moyen')
        )
            ->join('credits', 'credits.id_credit', '=', 'signatures.credit_id')
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        // 6. Intervalles entre signatures par acteur
        $intervals = DB::select("
        SELECT 
            s1.signed_by as etape,
            AVG(TIMESTAMPDIFF(DAY, s1.created_at, s2.created_at)) as interval_jours
        FROM signatures s1
        JOIN signatures s2 ON s1.credit_id = s2.credit_id 
            AND s1.id < s2.id
        GROUP BY s1.signed_by
        ORDER BY MIN(s1.created_at)
    ");

        return response()->json([
            'stats' => $stats,
            'total_dossiers' => $totalDossiers,
            'signatures' => $signatures,
            'delaiSignatures' => $delaiSignatures,
            'timeline' => $timeline,
            'intervals' => $intervals,
        ]);
    }

    //PERMET DE POSTER UN NOUVEAU COMMENTAIRE



    public function NewComment(Request $request)
    {

        if (isset($request->contenu)) {
            Commentaire::create([
                'credit_id' => $request->getDossierId,
                'user_id' => auth()->id(),
                'contenu' => $request->contenu,
                'parent_id' => $request->parent_id,
            ]);
            if ($request->user_id) {
                $this->sendNotification->SendNotificationWhenReplyAcomment($request->user_id, $request->getDossierId);
            }

            return response()->json([
                "status" => 1,
                "msg" => "Commentaire posté avec fixé"
            ]);
        } else {
            return response()->json([
                "status" => 0,
                "msg" => "Votre commentaire n'est peut pas être vide"
            ]);
        }
    }


    public function deleteComment($id)
    {


        $commentaire = Commentaire::find($id);
        // dd($commentaire); // Vérifie tous les IDs existants
        if (!$commentaire) {
            return response()->json([
                'status' => 0,
                'msg' => 'Commentaire introuvable.'
            ]);
        }

        // Supprimer aussi les réponses liées (cascade)
        $commentaire->replies()->delete();
        $commentaire->delete();

        return response()->json([
            'status' => 1,
            'msg' => 'Commentaire supprimé avec succès.'
        ]);
    }

    //PERMET DE SUPPRIME UN FICHIER PDF

    public function deletePDFFile($id)
    {
        $file = CreditsImages::find($id);
        $file->delete();

        return response()->json([
            'status' => 1,
            'msg' => 'Fichier supprimé avec succès.'
        ]);
    }

    public function deleteExcelFile($id)
    {
        $fileName = CreditsImages::where("id", $id)->first();
        $fileName->delete();

        return response()->json([
            'status' => 1,
            'msg' => 'Fichier supprimé avec succès.'
        ]);
    }

    // public function addImageMembre(Request $request)
    // {
      
    //     if ($request->filled('type_image')) {
    //         if ($request->hasFile('images')) {
    //             $credit = Credits::findOrFail($request->creditId);
    //             foreach ($request->file('images') as $image) {
    //                 // Conserver le nom original mais ajouter un timestamp devant
    //                 $filename = date('Ymd_His') . '_' . $image->getClientOriginalName();
    //                 $path = $image->storeAs('credits/images-membre', $filename, 'public'); // Stocke dans storage/app/public/credits/images-membre
    //                 if ($request->type_image == "im") {
    //                     $credit->images()->create([
    //                         'file_state' => "im",
    //                         'path' => $path
    //                     ]);
    //                     return response()->json([
    //                         'status' => 1,
    //                         'msg' => 'Image enregistrée avec succès',
    //                         'credit' => $credit->load('images'),
    //                     ]);
    //                 } else if ($request->type_image == "ia") {
    //                     $credit->images()->create([
    //                         'file_state' => "ia",
    //                         'path' => $path
    //                     ]);
    //                     return response()->json([
    //                         'status' => 1,
    //                         'msg' => 'Image enregistrée avec succès',
    //                         'credit' => $credit->load('images'),
    //                     ]);
    //                 } else if ($request->type_image == "it") {
    //                     $credit->images()->create([
    //                         'file_state' => "it",
    //                         'path' => $path
    //                     ]);
    //                     return response()->json([
    //                         'status' => 1,
    //                         'msg' => 'Image enregistrée avec succès',
    //                         'credit' => $credit->load('images'),
    //                     ]);
    //                 } else if ($request->type_image == "ig") {
    //                     $credit->images()->create([
    //                         'file_state' => "ig",
    //                         'path' => $path
    //                     ]);
    //                     return response()->json([
    //                         'status' => 1,
    //                         'msg' => 'Image enregistrée avec succès',
    //                         'credit' => $credit->load('images'),
    //                     ]);
    //                 }
    //             }
    //         } else {
    //             return response()->json([
    //                 'status' => 0,
    //                 'msg' => 'Aucune image séléctionnée',
    //                 // 'credit' => $credit->load('images'),
    //             ]);
    //         }
    //     } else {
    //         return response()->json([
    //             'status' => 0,
    //             'msg' => "Vous devez sélectionnez le type d'image ...",

    //         ]);
    //     }
    // }

    public function addImageMembre(Request $request)
{
    // ✅ Validation
    // $request->validate([
    //     'creditId'   => 'required|exists:credits,id_credit ',
    //     'type_image' => 'required|in:im,ia,it,ig',
    //     'images'     => 'required',
    //     'images.*'   => 'image|mimes:jpeg,png,jpg|max:2048'
    // ]);

    if ($request->filled('type_image')) {

    // ✅ Vérifier présence des fichiers
    if (!$request->hasFile('images')) {
        return response()->json([
            'status' => 0,
            'msg' => 'Aucune image sélectionnée'
        ]);
    }

    $credit = Credits::findOrFail($request->creditId);

    // ✅ Parcours de toutes les images
    foreach ($request->file('images') as $image) {

        // 🔒 Nom unique pour éviter collision
        $filename = uniqid() . '_' . $image->getClientOriginalName();

        // 📁 Enregistrement fichier
        $path = $image->storeAs('credits/images-membre', $filename, 'public');

        // 💾 Enregistrement en base
        $credit->images()->create([
            'file_state' => $request->type_image,
            'path'       => $path
        ]);
    }

    // ✅ Retour après traitement de toutes les images
    return response()->json([
        'status' => 1,
        'msg' => 'Toutes les images ont été enregistrées avec succès',
        'credit' => $credit->load('images'),
    ]);

    } else {
            return response()->json([
               'status' => 0,
              'msg' => "Vous devez sélectionnez le type d'image ...",

         ]);
     }
}

    //PERMET DE SUPPRIMER UNE IMAGE 
    public function deleteImageMembre($id)
    {

        $image = CreditsImages::find($id);
        $image->delete();
        return response()->json([
            'status' => 1,
            'msg' => 'Image supprimée avec succès',
        ]);
    }

    //PERMET DE SUPPRIMER UNE IMAGE 
    public function deleteImageActivite($id)
    {
        $image = CreditsImages::find($id);
        $image->delete();
        return response()->json([
            'status' => 1,
            'msg' => 'Image supprimée avec succès',
        ]);
    }


    public function deleteSignature($id)
    {

        $signature = Signature::find($id);
        $signature->delete();

        return response()->json([
            'status' => 1,
            'msg' => 'Signature supprimée avec succès',
        ]);
    }

    public function addGPS(Request $request)
    {

        try {
            Credits::where("id_credit", $request->creditId)->update([
                "latitude" => $request->latitude,
                "longitude" => $request->longitude,
            ]);
            return response()->json([
                'status' => 1,
                'msg' => 'Le lacolisation a été bien enregistrée',
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getGPS($dossierId)
    {
        $data = Credits::where("id_credit", $dossierId)->first();
        return response()->json([
            'status' => 1,
            'data' => $data
        ]);
    }

    public function getAllTitreCredit()
    {

        try {
            $fichiers = DB::table('credits')
                ->join('credits_images', 'credits.id_credit', '=', 'credits_images.credits_id')
                ->where('file_state', 'it')
                ->limit(100)
                ->get();

            // Sépare images et pdfs
            $images = [];
            $pdfs = [];


            foreach ($fichiers as $fichier) {
                $ext = strtolower(pathinfo($fichier->path, PATHINFO_EXTENSION));

                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                    $images[] = $fichier;
                } elseif ($ext === 'pdf') {
                    $pdfs[] = $fichier;
                }
            }

            // Convertis l'objet $dossier (stdClass) en tableau associatif
            $dossierArray = (array) $fichiers;
            //dd($excels);
            // Ajoute images, pdfs et signatures
            $dossierArray['images'] = $images;
            $dossierArray['pdfs'] = $pdfs;
            $dossierArray['current_user'] = auth()->user();
            // $dossierArray['imageMembre'] = $imageMembres;

            return response()->json([
                'data' => $dossierArray,
                'status' => 1
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }

    public function getSeachedTitreCredit($ref)
    {
        try {
            $fichiers = DB::table('credits')
                ->join('credits_images', 'credits.id_credit', '=', 'credits_images.credits_id')
                ->where('credits_images.file_state', 'it')
                ->where('credits.NomCompte', 'LIKE', '%' . $ref . '%')
                ->get();

            // Sépare images et pdfs
            $images = [];
            $pdfs = [];


            foreach ($fichiers as $fichier) {
                $ext = strtolower(pathinfo($fichier->path, PATHINFO_EXTENSION));

                if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                    $images[] = $fichier;
                } elseif ($ext === 'pdf') {
                    $pdfs[] = $fichier;
                }
            }

            // Convertis l'objet $dossier (stdClass) en tableau associatif
            $dossierArray = (array) $fichiers;
            //dd($excels);
            // Ajoute images, pdfs et signatures
            $dossierArray['images'] = $images;
            $dossierArray['pdfs'] = $pdfs;
            $dossierArray['current_user'] = auth()->user();
            // $dossierArray['imageMembre'] = $imageMembres;

            return response()->json([
                'data' => $dossierArray,
                'status' => 1
            ]);
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    /**
     * Récupérer l'historique des propositions pour un dossier
     */
    public function getHistorique($dossierId)
    {
        $propositions = PropositionMontant::with('user')
            ->where('idDossier', $dossierId)
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json($propositions);
    }

    //CETTE FONCTION PERMET DE PROPOSER UN MONTANT

    public function storeProposeMontant(Request $request)
    {
        $request->validate([
            'idDossier' => 'required|exists:credits,id_credit',
            'montantPropose' => 'required|numeric|min:0'
        ]);

        $proposition = PropositionMontant::create([
            'idUser' => Auth::id(),
            'idDossier' => $request->idDossier,
            'montant_propose' => $request->montantPropose,
            'commentaire' => $request->commentaire
        ]);

        //ENREGISTRE LE COMMENTAIRE DE SA PROPOSITION POUR QU'IL SOIT VISIBLE DANS LA CHAT

        Commentaire::create([
            'credit_id' => $request->idDossier,
            'user_id' => auth()->id(),
            'contenu' => $request->commentaire,
        ]);


        // Charger la relation user pour la réponse
        $proposition->load('user');

        return response()->json(["status" => 1, "msg" => "Votre proposition a bien été publiée."]);
    }

    /**
     * Récupérer la dernière proposition pour un dossier
     */
    public function getLastProposition($dossierId)
    {
        $lastProposition = PropositionMontant::with('user')
            ->where('idDossier', $dossierId)
            ->orderBy('created_at', 'desc')
            ->first();

        return response()->json($lastProposition);
    }

    public function destroy($id)
    {
        try {
            $proposition = PropositionMontant::findOrFail($id);

            // Vérifier que l'utilisateur est le propriétaire de la proposition
            if ($proposition->idUser !== Auth::id()) {
                return response()->json([
                    'msg' => 'Vous n\'êtes pas autorisé à supprimer cette proposition',
                    'status' => 0
                ], 403);
            }

            $proposition->delete();

            return response()->json([
                'msg' => 'Proposition supprimée avec succès',
                'status' => 1,
                'id' => $id
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'msg' => 'Erreur lors de la suppression',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    //PERMET DE RECUPERER LES PROPOSITION DES MONTANTS POUR LES AFFICHER A L'UTILISATEUR

    public function getPropositions($id)
    {
        try {
            // Récupérer les propositions avec le rôle directement depuis users
            $propositions = DB::table('proposition_montants')
                ->join("credits", "proposition_montants.idDossier", "credits.id_credit")
                ->join("users", "proposition_montants.idUser", "users.id")
                ->where('proposition_montants.idDossier', $id)
                ->whereNotNull('proposition_montants.montant_propose')
                ->select(
                    'proposition_montants.*',
                    'users.name as nom',
                    'users.role',                    // ← Le rôle directement depuis users !
                    'credits.monnaie as devise'
                )
                ->orderBy('proposition_montants.created_at', 'asc')
                ->get();

            // Statistiques des signatures (toujours depuis la table signatures)
            $signatures = DB::table('signatures')
                ->where('credit_id', $id)
                ->select('signed_by', 'created_at')
                ->orderBy('created_at', 'asc')
                ->get();

            $ordreIntervenants = ['Commercial', 'Chef de département', 'Directrice financière', 'Directeur Général'];
            $totalSignatures = $signatures->count();
            $totalIntervenants = count($ordreIntervenants);
            $pourcentageAvancement = $totalIntervenants > 0 ? ($totalSignatures / $totalIntervenants) * 100 : 0;

            $rolesExistants = $signatures->pluck('signed_by')->toArray();
            $prochaineSignature = null;
            foreach ($ordreIntervenants as $role) {
                if (!in_array($role, $rolesExistants)) {
                    $prochaineSignature = $role;
                    break;
                }
            }

            return response()->json([
                'status' => 1,
                'data' => $propositions,
                'signatures_stats' => [
                    'total_signatures' => $totalSignatures,
                    'total_intervenants' => $totalIntervenants,
                    'pourcentage_avancement' => round($pourcentageAvancement, 1),
                    'signataires' => $signatures,
                    'reste_a_signer' => max(0, $totalIntervenants - $totalSignatures),
                    'prochaine_signature' => $prochaineSignature
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 0,
                'msg' => 'Erreur: ' . $e->getMessage(),
                'data' => []
            ]);
        }
    }

    // public function storeCreditChecklist(Request $request)
    // {
    //     try {
    //         // Validation minimale
    //         $validated = $request->validate([
    //             'nom_demandeur' => 'required|string|max:255',
    //             'numero_dossier' => 'required|string|max:100',
    //             'montant' => 'nullable|numeric',
    //             'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
    //         ]);

    //         // Récupérer toutes les données
    //         $data = $request->except(['signature']);
    //         // Ajouter l'ID de l'utilisateur authentifié
    //         $data['idUser'] = auth()->id();

    //         // Fonction pour convertir en booléen
    //         $toBoolean = function ($value) {
    //             if (is_bool($value)) return $value;
    //             if (is_null($value)) return false;
    //             if (is_string($value)) {
    //                 $value = strtolower(trim($value));
    //                 // Convertir 'oui'/'non' en booléen
    //                 if ($value === 'oui') return true;
    //                 if ($value === 'non') return false;
    //                 return in_array($value, ['true', 'on', '1', 'yes']);
    //             }
    //             return (bool) $value;
    //         };

    //         // Liste des champs checkbox
    //         $checkboxFields = [
    //             'piece_identite',
    //             'lettre_demande',
    //             'formulaire_pret',
    //             'contrat_travail',
    //             'fiche_paye',
    //             'recommandation',
    //             'caution_employeur',
    //             'document_activite',
    //             'bilan',
    //             'decision_ctc',
    //             'decision_cc',
    //             'contrat_signe',
    //             'garanties_constituees',
    //             'rencontre_client',
    //             'hypothèque',
    //             'lettre_garantie',
    //             'domiciliation_salaire',
    //             'dat',
    //             'aval',
    //             'salaire',
    //             'nantissement'
    //         ];

    //         // Convertir les checkboxes en booléen
    //         foreach ($checkboxFields as $field) {
    //             if (isset($data[$field])) {
    //                 $data[$field] = $toBoolean($data[$field]);
    //             } else {
    //                 $data[$field] = false;
    //             }
    //         }

    //         // Convertir les champs 'oui'/'non' en booléen pour la base de données
    //         $ouiNonFields = ['rencontre_adc', 'capacite_remboursement', 'fiabilite', 'avis_positif'];
    //         foreach ($ouiNonFields as $field) {
    //             if (isset($data[$field])) {
    //                 // Convertir 'oui' en true, 'non' en false
    //                 $data[$field] = $toBoolean($data[$field]);
    //             } else {
    //                 $data[$field] = false;
    //             }
    //         }

    //         // Traiter la signature
    //         if ($request->hasFile('signature') && $request->file('signature')->isValid()) {
    //             $signature = $request->file('signature');
    //             $signatureName = time() . '_' . uniqid() . '.' . $signature->getClientOriginalExtension();
    //             $signaturePath = $signature->storeAs('signatures', $signatureName, 'public');
    //             $data['signature'] = $signaturePath;
    //         }

    //         // Créer la checklist
    //         $checklist = CreditChecklist::create($data);

    //         return response()->json([
    //             'success' => true,
    //             'message' => 'Checklist enregistrée avec succès',
    //             'data' => $checklist
    //         ], 201);
    //     } catch (\Illuminate\Validation\ValidationException $e) {
    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur de validation',
    //             'errors' => $e->errors()
    //         ], 422);
    //     } catch (\Exception $e) {
    //         Log::error('Erreur: ' . $e->getMessage());

    //         return response()->json([
    //             'success' => false,
    //             'message' => 'Erreur lors de l\'enregistrement',
    //             'error' => $e->getMessage()
    //         ], 500);
    //     }
    // }

//     public function storeCreditChecklist(Request $request)
// {
//     try {
//         // Validation minimale, ajout de la signature_analyste
//         $validated = $request->validate([
//             'nom_demandeur' => 'required|string|max:255',
//             'numero_dossier' => 'required|string|max:100',
//             'montant' => 'nullable|numeric',
//             'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
//             'signature_analyste' => 'nullable|image|mimes:jpeg,png,jpg|max:5120', // nouvelle ligne
//         ]);

//         $data = $request->except(['signature', 'signature_analyste']);
//         $data['idUser'] = auth()->id();

//         // Fonction booléenne (inchangée)
//         $toBoolean = function ($value) {
//             if (is_bool($value)) return $value;
//             if (is_null($value)) return false;
//             if (is_string($value)) {
//                 $value = strtolower(trim($value));
//                 if ($value === 'oui') return true;
//                 if ($value === 'non') return false;
//                 return in_array($value, ['true', 'on', '1', 'yes']);
//             }
//             return (bool) $value;
//         };

//         // Liste des checkbox (ajoutez 'salaire' si manquant)
//         $checkboxFields = [
//             'piece_identite', 'lettre_demande', 'formulaire_pret',
//             'contrat_travail', 'fiche_paye', 'recommandation', 'caution_employeur',
//             'document_activite', 'bilan',
//             'decision_ctc', 'decision_cc',
//             'contrat_signe', 'garanties_constituees', 'rencontre_client',
//             'hypothèque', 'lettre_garantie', 'domiciliation_salaire', 'dat', 'aval', 'salaire', 'nantissement'
//         ];

//         foreach ($checkboxFields as $field) {
//             $data[$field] = $toBoolean($data[$field] ?? false);
//         }

//         // Champs oui/non
//         $ouiNonFields = ['rencontre_adc', 'capacite_remboursement', 'fiabilite', 'avis_positif'];
//         foreach ($ouiNonFields as $field) {
//             $data[$field] = $toBoolean($data[$field] ?? false);
//         }

//         // Traiter la signature du superviseur
//         if ($request->hasFile('signature') && $request->file('signature')->isValid()) {
//             $signature = $request->file('signature');
//             $signatureName = time() . '_' . uniqid() . '.' . $signature->getClientOriginalExtension();
//             $signaturePath = $signature->storeAs('signatures', $signatureName, 'public');
//             $data['signature'] = $signaturePath;
//         }

//         // Traiter la signature de l'analyste
//         if ($request->hasFile('signature_analyste') && $request->file('signature_analyste')->isValid()) {
//             $signatureAnalyste = $request->file('signature_analyste');
//             $signatureAnalysteName = time() . '_analyste_' . uniqid() . '.' . $signatureAnalyste->getClientOriginalExtension();
//             $signatureAnalystePath = $signatureAnalyste->storeAs('signatures', $signatureAnalysteName, 'public');
//             $data['signature_analyste'] = $signatureAnalystePath;
//         }

//         $checklist = CreditChecklist::create($data);

//         return response()->json([
//             'success' => true,
//             'message' => 'Checklist enregistrée avec succès',
//             'data' => $checklist
//         ], 201);

//     } catch (\Illuminate\Validation\ValidationException $e) {
//         return response()->json([
//             'success' => false,
//             'message' => 'Erreur de validation',
//             'errors' => $e->errors()
//         ], 422);
//     } catch (\Exception $e) {
//         Log::error('Erreur: ' . $e->getMessage());
//         return response()->json([
//             'success' => false,
//             'message' => 'Erreur lors de l\'enregistrement',
//             'error' => $e->getMessage()
//         ], 500);
//     }
// }

public function storeCreditChecklist(Request $request)
{
   $user = Auth::user();
$allowedRoles = ['Superviseur', 'Analyste Risques'];

if (!in_array($user->role, $allowedRoles)) {
    return response()->json([
        'success' => false,
        'message' => "Vous n'êtes pas autorisé à completer cette checkliste. Seuls le superviseur et l'analyste des risques sont autorisés. Votre rôle actuel est : {$user->role}",
    ], 422);
}
    try {
        // Validation
        $validated = $request->validate([
            'nom_demandeur' => 'required|string|max:255',
            'numero_dossier' => 'required|string|max:100',
            'montant' => 'nullable|numeric',
            'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'signature_analyste' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $data = $request->except(['signature', 'signature_analyste']);
        $data['idUser'] = auth()->id();

        // 1. Vérifier si une checklist existe déjà pour cet idCredit
        $idCredit = $request->input('idCredit');
        if ($idCredit) {
            $existing = CreditChecklist::where('idCredit', $idCredit)->first();
            if ($existing) {
                // Supprimer les fichiers signatures du disque
                if ($existing->signature && Storage::disk('public')->exists($existing->signature)) {
                    Storage::disk('public')->delete($existing->signature);
                }
                if ($existing->signature_analyste && Storage::disk('public')->exists($existing->signature_analyste)) {
                    Storage::disk('public')->delete($existing->signature_analyste);
                }
                // Supprimer l'enregistrement
                $existing->delete();
            }
        }

        // 2. Conversion des booléens (champs checkbox et oui/non)
        $toBoolean = function ($value) {
            if (is_bool($value)) return $value;
            if (is_null($value)) return false;
            if (is_string($value)) {
                $value = strtolower(trim($value));
                if ($value === 'oui') return true;
                if ($value === 'non') return false;
                return in_array($value, ['true', 'on', '1', 'yes']);
            }
            return (bool) $value;
        };

        $checkboxFields = [
            'piece_identite', 'lettre_demande', 'formulaire_pret',
            'contrat_travail', 'fiche_paye', 'recommandation', 'caution_employeur',
            'document_activite', 'bilan',
            'decision_ctc', 'decision_cc',
            'contrat_signe', 'garanties_constituees', 'rencontre_client',
            'hypothèque', 'lettre_garantie', 'domiciliation_salaire', 'dat', 'aval', 'salaire', 'nantissement'
        ];

        foreach ($checkboxFields as $field) {
            $data[$field] = $toBoolean($data[$field] ?? false);
        }

        $ouiNonFields = ['rencontre_adc', 'capacite_remboursement', 'fiabilite', 'avis_positif'];
        foreach ($ouiNonFields as $field) {
            $data[$field] = $toBoolean($data[$field] ?? false);
        }

        // 3. Traitement des nouvelles signatures
        if ($request->hasFile('signature') && $request->file('signature')->isValid()) {
            $signature = $request->file('signature');
            $signatureName = time() . '_' . uniqid() . '.' . $signature->getClientOriginalExtension();
            $signaturePath = $signature->storeAs('signatures', $signatureName, 'public');
            $data['signature'] = $signaturePath;
        }

        if ($request->hasFile('signature_analyste') && $request->file('signature_analyste')->isValid()) {
            $signatureAnalyste = $request->file('signature_analyste');
            $signatureAnalysteName = time() . '_analyste_' . uniqid() . '.' . $signatureAnalyste->getClientOriginalExtension();
            $signatureAnalystePath = $signatureAnalyste->storeAs('signatures', $signatureAnalysteName, 'public');
            $data['signature_analyste'] = $signatureAnalystePath;
        }

        // 4. Création de la nouvelle checklist
        $checklist = CreditChecklist::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Checklist enregistrée avec succès',
            'data' => $checklist
        ], 201);

    } catch (\Illuminate\Validation\ValidationException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur de validation',
            'errors' => $e->errors()
        ], 422);
    } catch (\Exception $e) {
        Log::error('Erreur: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de l\'enregistrement',
            'error' => $e->getMessage()
        ], 500);
    }
}

public function updateCreditChecklist(Request $request, $idCredit)
{

    try {

       $user = Auth::user();
$allowedRoles = ['Superviseur', 'Analyste Risques'];

if (!in_array($user->role, $allowedRoles)) {
    return response()->json([
        'success' => false,
        'message' => "Vous n'êtes pas autorisé à modifier cette checkliste. Seuls le superviseur et l'analyste des risques sont autorisés. Votre rôle actuel est : {$user->role}",
    ], 422);
}
        $checklist = CreditChecklist::where('idCredit', $idCredit)->firstOrFail();

        // Validation inchangée
        $validated = $request->validate([
            'nom_demandeur' => 'required|string|max:255',
            'numero_dossier' => 'required|string|max:100',
            'montant' => 'nullable|numeric',
            'signature' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
            'signature_analyste' => 'nullable|image|mimes:jpeg,png,jpg|max:5120',
        ]);

        $data = $request->except(['signature', 'signature_analyste', '_method']);

        // Conversion en entier (0/1) au lieu de booléen
        $toInteger = function ($value) {
            if (is_bool($value)) return $value ? 1 : 0;
            if (is_null($value)) return 0;
            if (is_string($value)) {
                $value = strtolower(trim($value));
                if ($value === 'oui') return 1;
                if ($value === 'non') return 0;
                return in_array($value, ['true', 'on', '1', 'yes']) ? 1 : 0;
            }
            return (int) $value;
        };

        $checkboxFields = [
            'piece_identite', 'lettre_demande', 'formulaire_pret',
            'contrat_travail', 'fiche_paye', 'recommandation', 'caution_employeur',
            'document_activite', 'bilan',
            'decision_ctc', 'decision_cc',
            'contrat_signe', 'garanties_constituees', 'rencontre_client',
            'hypothèque', 'lettre_garantie', 'domiciliation_salaire', 'dat', 'aval', 'salaire', 'nantissement'
        ];

        foreach ($checkboxFields as $field) {
            $data[$field] = $toInteger($data[$field] ?? 0);
        }

        $ouiNonFields = ['rencontre_adc', 'capacite_remboursement', 'fiabilite', 'avis_positif'];
        foreach ($ouiNonFields as $field) {
            $data[$field] = $toInteger($data[$field] ?? 0);
        }

        // Gestion des signatures (identique à votre code)
        if ($request->hasFile('signature')) {
            if ($checklist->signature && Storage::disk('public')->exists($checklist->signature)) {
                Storage::disk('public')->delete($checklist->signature);
            }
            $path = $request->file('signature')->store('signatures', 'public');
            $data['signature'] = $path;
        }

        if ($request->hasFile('signature_analyste')) {
            if ($checklist->signature_analyste && Storage::disk('public')->exists($checklist->signature_analyste)) {
                Storage::disk('public')->delete($checklist->signature_analyste);
            }
            $path = $request->file('signature_analyste')->store('signatures', 'public');
            $data['signature_analyste'] = $path;
        }

        $checklist->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Checklist mise à jour',
            'data' => $checklist
        ]);
    } catch (\Exception $e) {
        Log::error('Update error: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Erreur mise à jour',
            'error' => $e->getMessage()
        ], 500);
    }
}

    //PERMET DE RECUPERER UN CHECK LISTE SPECIFIQUE

    public function getCreditChecklist($dossierId)
    {

        try {
            if ($dossierId) {
                $data = CreditChecklist::where("idCredit", $dossierId)->latest()->first();
                if ($data) {
                    return response()->json([
                        'status' => 1,
                        'data' => $data,
                    ], 200);
                } else {
                    return response()->json([
                        'status' => 0,
                    ], 500);
                }
            } else {
                return response()->json([
                    'status' => 0,
                ], 500);
            }
        } catch (\Throwable $th) {
            throw $th;
        }
    }


    public function RapportCreditHomePage()
    {
        return view("gestion_credit.pages.rapport-credit");
    }

    public function getRapportCredit()
    {
        // $data = Credits::join("proposition_montants","credits.credit_id","=","proposition_montants.idDossier")
        // ->join("users","proposition_montants.idUser","=","users.id")->get();

$lastPropositions = DB::table('proposition_montants')
    ->select('idDossier', DB::raw('MAX(id) as last_id'))
    ->groupBy('idDossier');

$data = Credits::leftJoinSub($lastPropositions, 'pm_max', function ($join) {
        $join->on('credits.id_credit', '=', 'pm_max.idDossier');
    })
    ->leftJoin('proposition_montants as pm', 'pm.id', '=', 'pm_max.last_id')
    ->leftJoin('users', 'pm.idUser', '=', 'users.id')
    ->select(
        'credits.*',
        'pm.montant_propose	 as dernier_montant',
        'users.role as role_user'
    )
    ->get();



        return response()->json([
            'status' => 1,
            'data' => $data
        ], 200);
    }
}
