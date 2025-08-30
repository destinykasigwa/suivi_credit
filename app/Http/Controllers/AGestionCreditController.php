<?php

namespace App\Http\Controllers;

use App\Models\Commentaire;
use App\Models\Credits;
use App\Models\CreditsImages;
use App\Models\Signature;
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
                // 'description_titre' => $request->description_titre,
                'nombre_membre_groupe' => $request->nombre_membre_groupe,
                'nombre_homme_groupe' => $request->nombre_homme_groupe,
                'nombre_femme_groupe' => $request->nombre_femme_groupe,
                'objet_credit' => $request->objetCredit,
            ]);

            if (isset($request->description_titre)) {
                $idCredit = Credits::latest()->first()->id_credit;
                Commentaire::create([
                    'credit_id' => $idCredit,
                    'user_id' => auth()->id(),
                    'contenu' => $request->description_titre,
                ]);
            }

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
        $fichiers = DB::table('credits_images')
            ->where('credits_id', $id)
            ->where('file_state', "ia")
            ->select('id', 'path')
            ->get();

        // Récupère les images de l'activité du membre
        $imageMembres = DB::table('credits_images')
            ->where('credits_id', $id)
            ->where('file_state', "im")
            ->select('id', 'path')
            ->get();
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
        //dd($excels);
        // Ajoute images, pdfs et signatures
        $dossierArray['images'] = $images;
        $dossierArray['pdfs'] = $pdfs;
        $dossierArray['excels'] = $excels;
        $dossierArray['signatures'] = $signatures;
        $dossierArray['lastSignature'] = $lastSignature;
        $dossierArray['commentaires'] = $commentaires;
        $dossierArray['current_user'] = auth()->user();
        $dossierArray['imageMembre'] = $imageMembres;



        return response()->json([
            'data' => $dossierArray
        ]);
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
            //dd($request->all());
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
                'nombre_membre_groupe' => $request->nombre_membre_groupe,
                'nombre_homme_groupe' => $request->nombre_homme_groupe,
                'nombre_femme_groupe' => $request->nombre_femme_groupe,
                'objet_credit' => $request->objetCredit,
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
                        'path' => "credit/" . $filename
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
            "Chef Agence",
            "CTC",
            "DG",
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
        ];

        // 2. Répartition des signatures par acteur (signed_by)
        // 2. Répartition des signatures par acteur (signed_by)
        // $signatures = Signature::select('signed_by', DB::raw('count(*) as total'))
        //     ->groupBy('signed_by')
        //     ->orderByRaw('MIN(id) ASC') // ou created_at si tu veux l’ordre chronologique
        //     ->get();
        $signatures = Signature::select('signed_by', DB::raw('count(*) as total'))
            ->groupBy('signed_by')
            ->get();


        // 3. Temps moyen de signature par acteur (en jours)
        $delaiSignatures = Signature::select(
            'signed_by',
            DB::raw('AVG(TIMESTAMPDIFF(DAY, credits.created_at, signatures.created_at)) as delai_moyen')
        )
            ->join('credits', 'credits.id_credit', '=', 'signatures.credit_id')
            ->groupBy('signed_by')
            ->orderByRaw('MIN(id) ASC') // ou created_at si tu veux l’ordre chronologique
            //->orderBy(DB::raw('MIN(signatures.created_at)'))
            ->get();

        // 4. Timeline globale : temps moyen par mois
        $timeline = Signature::select(
            DB::raw("DATE_FORMAT(signatures.created_at, '%Y-%m') as mois"),
            DB::raw('AVG(TIMESTAMPDIFF(DAY, credits.created_at, signatures.created_at)) as delai_moyen')
        )
            ->join('credits', 'credits.id_credit', '=', 'signatures.credit_id')
            ->groupBy('mois')
            ->orderBy('mois')
            ->get();

        return response()->json([
            'stats' => $stats,
            'signatures' => $signatures,
            'delaiSignatures' => $delaiSignatures,
            'timeline' => $timeline,
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

    public function addImageMembre(Request $request)
    {
        if ($request->hasFile('images')) {
            $credit = Credits::findOrFail($request->creditId);
            foreach ($request->file('images') as $image) {
                // Conserver le nom original mais ajouter un timestamp devant
                $filename = date('Ymd_His') . '_' . $image->getClientOriginalName();
                $path = $image->storeAs('credits/images-membre', $filename, 'public'); // Stocke dans storage/app/public/credits/images-membre
                $credit->images()->create([
                    'file_state' => "im",
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
            'msg' => 'Image supprimée avec succès',
        ]);
    }
}
