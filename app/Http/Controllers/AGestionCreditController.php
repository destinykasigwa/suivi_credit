<?php

namespace App\Http\Controllers;

use App\Models\Credits;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
            'images.*' => 'mimes:jpg,jpeg,png,pdf|max:2048',
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
                'description_titre' => $request->description_titre,

            ]);

            foreach ($request->file('images') as $image) {
                $path = $image->store('credits', 'public'); // Stocke dans storage/app/public/credits
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
        $credits = DB::table('credits')->limit(10)->get();

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

    public function getCreditToDelete($id)
    {
        Credits::where("id_credit", $id)->delete();
        return response()->json([
            "status" => 1,
            "msg" => "Dossier de crédit supprimé avec succès"
        ]);
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
            ->pluck('path'); // ou 'fichier_url' selon ta table

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

        // Retourne la réponse JSON
        // Convertis l'objet $dossier (stdClass) en tableau associatif
        $dossierArray = (array) $dossier;

        // Ajoute images et pdfs dans ce tableau
        $dossierArray['images'] = $images;
        $dossierArray['pdfs'] = $pdfs;

        return response()->json(['data' => $dossierArray]);
    }
}
