<?php

namespace App\Http\Controllers;

use App\Models\Credits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AGestionCreditController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware("auth");
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



    public function store(Request $request)
    {
        $validator = validator::make($request->all(), [
            'NumCompte'  => 'required|string',
            'NomCompte'  => 'required|string',
            'produit_credit'  => 'required|string',
            'type_credit'  => 'required|string',
            'recouvreur'  => 'required|string',
            'montant_demande'  => 'required|string',
            'date_demande'  => 'required|string',
            'frequence_mensualite' => 'required|string',
            'nombre_echeance' => 'required|string',
            // 'NumDossier' => 'required|string',
            'gestionnaire' => 'required|string',
            'source_fond' => 'required|string',
            'monnaie' => 'required|string',
            'duree_credit' => 'required|string',
            'intervale_jrs' => 'required|string',
            'taux_interet' => 'required|string',
            // 'type_garantie' => 'required|string',
            // 'valeur_comptable' => 'required|string',
            // 'num_titre' => 'required|string',
            // 'valeur_garantie' => 'required|string',
            // 'description_titre' => 'required|string',
            // 'images.*' => 'image|mimes:jpg,jpeg,png|max:2048',
            'images.*' => 'mimes:jpg,jpeg,png,pdf|max:5048',
        ]);
        if ($validator->fails()) {
            return response()->json([
                'status' => 0,
                'msg' => "Certains champs obligatoire n'est sont pas renseignés",
                'validate_error' => $validator->messages()
            ]);
        }
        if ($request->hasFile('images')) {
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
                'description_titre' => $request->description_titre,
            ]);

            foreach ($request->file('images') as $image) {
                // Conserver le nom original mais ajouter un timestamp devant
                $filename = date('Ymd_His') . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('credits', $filename, 'public'); // Stocke dans storage/app/public/credits
                $credit->images()->create([
                    'path' => $path
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'msg' => 'Aucune image séléctionnée',
                // 'credit' => $credit->load('images'),
            ]);
        }

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
            ->orderBy('id_credit', 'desc') // tri décroissant sur la colonne id
            ->limit(10)
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

    public function getSearchedCredit($ref)
    {
        // Recherche des crédits par NumCompte
        // $credits = DB::table('credits')
        //     ->where(function ($query) use ($ref) {
        //         $query->whereRaw('LOWER(NumCompte) = ?', [strtolower($ref)])
        //             ->orWhereRaw('LOWER(NomCompte) LIKE ?', ['%' . strtolower($ref) . '%']);
        //     })
        //     ->limit(10)
        //     ->get();
        $credits = DB::table('credits')
            ->where(function ($query) use ($ref) {
                $query->where('NumCompte', $ref)
                    ->orWhere('NomCompte', 'LIKE', '%' . $ref . '%');
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


    public function getSearchedCreditDecaisse($ref)
    {

        $credits = DB::table('credits')
            ->where(function ($query) use ($ref) {
                $query->where('NumCompte', $ref)
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

        if (!$dossier) {
            return response()->json(['message' => 'Dossier non trouvé'], 404);
        }

        // Récupère les fichiers liés (images + pdfs)
        $fichiers = DB::table('credits_images')
            ->where('credits_id', $id)
            ->pluck('path');

        // Sépare images et pdfs
        $images = [];
        $pdfs = [];

        foreach ($fichiers as $fichier) {
            $ext = strtolower(pathinfo($fichier, PATHINFO_EXTENSION));
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif'])) {
                $images[] = $fichier;
            } elseif ($ext === 'pdf') {
                $pdfs[] = $fichier;
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

        // Ajoute images, pdfs et signatures
        $dossierArray['images'] = $images;
        $dossierArray['pdfs'] = $pdfs;
        $dossierArray['signatures'] = $signatures;
        $dossierArray['lastSignature'] = $lastSignature;

        return response()->json(['data' => $dossierArray]);
    }

    //UPDATE DOSSIER
    public function updateDossier(Request $request)
    {

        $checkStatus = Credits::where("id_credit", $request->idDossier)->first();

        if ($checkStatus->statutDossier == "Décaissé") {
            return response()->json([
                "status" => 0,
                "msg" => "Impossible de modifier un dossier déjà décaissé ! "
            ]);
        } else {
            Credits::where("id_credit", $request->idDossier)->update([
                "NumCompte" => $request->NumCompte,
                "NomCompte" => $request->NomCompte,
                "produit_credit" => $request->produit_credit,
                "type_credit" => $request->type_credit,
                "recouvreur" => $request->recouvreur,
                "montant_demande" => $request->montant_demande,
                "date_demande" => $request->date_demande,
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
                "statutDossier" => $request->statutDossier
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
            ->orderBy('created_at', 'asc')
            ->get();

        $timeline = [];
        $previousDate = null;

        foreach ($signatures as $sig) {
            $delay = null;
            if ($previousDate) {
                $delay = \Carbon\Carbon::parse($previousDate)->diffInDays($sig->created_at);
            }

            $timeline[] = [
                'signed_by' => $sig->signed_by,
                'signature_file' => $sig->signature_file,
                'signed_at' => $sig->created_at,
                'delay_from_previous' => $delay
            ];

            $previousDate = $sig->created_at;
        }

        return response()->json($timeline);
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
    //PERMET D'AJOUTER UNE NOUVEAU FICHIER AU DOSSIER 
    public function addNewFile(Request $request)
    {

        // Vérifier l'extension
        $file = $request->file('newFile');

        $allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png'];
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

                $checkStatus->images()->create([
                    'path' => $path
                ]);

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
}
