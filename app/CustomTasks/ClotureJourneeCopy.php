<?php

namespace App\CustomTasks;

use App\Models\Comptes;
use App\Models\Echeancier;
// use App\Models\t_cloture;
use App\Models\JourRetard;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use App\Models\TauxEtDateSystem;
use App\Services\SendNotification;
use Illuminate\Support\Facades\DB;
use App\Models\CompteurTransaction;
use App\Models\PorteFeuilleConfing;
use App\Models\Remboursementcredit;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\TransactionsController;


class ClotureJourneeCopy

{
    // Déclaration des propriétés
    protected $dateSystem;
    protected $tauxDuJour;
    protected $compteCreditAuxMembreCDF;
    protected $compteCreditAuxMembreUSD;
    protected $compteDotationAuProvisionCDF;
    protected $compteDotationAuProvisionUSD;
    protected $compteRepriseDeProvisionCDF;
    protected $compteRepriseDeProvisionUSD;
    protected $compteCreanceLitigeuseUSD;
    protected $compteCreanceLitigeuseCDF;
    protected $compteProvisionCDF;
    protected $compteProvisionUSD;
    protected $montantRemboursementManuel;
    protected $remboursAnticipe;
    protected $numDossier;

    // protected $compteProvisionCDF1A30Jr;
    // protected $compteProvisionCDF31A60Jr;
    // protected $compteProvisionCDF61A90Jr;
    // protected $compteProvisionCDF91A180Jr;
    // protected $compteProvisionCDF180Et180Jr;
    protected $accountsConfig;
    protected $sendNotification;


    public function __construct(Request $request)
    {
        // Inject any necessary dependencies or configurations if needed
        // Récupération des dernières valeurs de la base de données et initialisation des propriétés
        $latestTauxEtDateSystem = TauxEtDateSystem::latest()->first();
        $porteFeuilleConfig = PorteFeuilleConfing::first();
        // $this->dateSystem = $latestTauxEtDateSystem ? $latestTauxEtDateSystem->DateSystem : null;
        $this->dateSystem = date("Y-m-d");
        $this->tauxDuJour = $latestTauxEtDateSystem ? $latestTauxEtDateSystem->TauxEnFc : null;
        $this->accountsConfig = $porteFeuilleConfig;
        $this->compteDotationAuProvisionCDF = "6901000000202";
        $this->compteDotationAuProvisionUSD = "6900000000201";
        $this->compteRepriseDeProvisionCDF = "7901000000202";
        $this->compteRepriseDeProvisionUSD = "7900000000201";
        $this->compteCreanceLitigeuseUSD = "3900000000201";
        $this->compteCreanceLitigeuseCDF = "3901000000202";
        $this->compteCreditAuxMembreCDF = "3210000000202";
        $this->compteCreditAuxMembreUSD = "3210000000201";
        $this->compteProvisionCDF = "3801000000202";
        $this->compteProvisionUSD = "3800000000201";
        $this->montantRemboursementManuel = $request->montantRemboursementManuel;
        $this->remboursAnticipe = $request->remboursAnticipe;
        $this->numDossier = $request->numDossier;
        $this->sendNotification = app(SendNotification::class);
        // $this->compteProvisionCDF1A30Jr = "3800";
        // $this->compteProvisionCDF31A60Jr = "3801";
        // $this->compteProvisionCDF61A90Jr = "3802";
        // $this->compteProvisionCDF91A180Jr = "3803";
        // $this->compteProvisionCDF180Et180Jr = "3804";
    }

    /**
     * Gère la clôture de la journée.
     */
    public function execute()
    {


        $this->traiterRemboursementsAEcheance();
        $this->traiterRemboursementsEnRetard();
        // $this->gererProvisions();
    }
    /**
     * 1. Traiter les remboursements à l'échéance.
     */
    public function traiterRemboursementsAEcheance()
    {
        $creditsAEcheance = $this->recupererCreditsAEcheance();
        foreach ($creditsAEcheance as $credit) {
            //ATTRIBUTES
            $NumCompte = $credit->NumCompteEpargne;
            $CodeMonnaie = $credit->CodeMonnaie == "USD" ? 1 : 2;
            $soldeMembre = $this->checkSoldeMembre($CodeMonnaie, $NumCompte);
            $CapAmmorti = $credit->CapAmmorti;
            $interetApayer = $credit->Interet;
            $MontantTotalApayer = $CapAmmorti + $interetApayer;
            //RETOURNE true SI LE MEMBRE EST EN RETARD false SI SON CREDIT EST SAIN
            $checkRetard = $this->checkRetardMembre(
                $credit->NumDossier,
                $credit->DateTranch
            );
            /*  SI LE SOLDE DU CLIENT EST SUPERIEUR OU EGAL AU MONTANT
            DE CREDIT QUI'IL DOIT REMBOURSER EST QUE IL N'EST PAS A 
            RETARD DE REMBOURSEMENT */
            //SI LE SOLDE DU COMPTE EST SUPERIEUR OU EGAL A L'INTERET QU'IL DOIT PAYER + CAPITAL DONC PAS DE RETARD
            if ($soldeMembre >= $MontantTotalApayer and !$checkRetard) {

                $this->appliquerPaiementInteretPuisCapital($credit);
                //SI LE SOLDE DU COMPTE EST INFERIEUR A L'INTERET QU'IL DOIT PAYER + CAPITAL
            } else {
                $this->gererProvisions();
                $this->constateRetard($credit->ReferenceEch);
                // $this->traiterRemboursementsEnRetard();
            }
        }
    }

    /**
     * 2. Traiter les remboursements en retard.
     */
    public function traiterRemboursementsEnRetard()
    {
        $creditsEnRetard = $this->recupererCreditsEnRetard();

        foreach ($creditsEnRetard as $creditRet) {
            $this->mettreAJourRetard($creditRet);
        }
    }

    /**
     * 3. Gérer les provisions pour les crédits en retard.
     */
    protected function gererProvisions()
    {
        $creditsAvecProvisions = $this->recupererCreditsAvecProvisions();

        foreach ($creditsAvecProvisions as $credit) {
            $this->gererProvisionPourRetard($credit);
        }
    }

    // === Méthodes utilitaires ===
    /**
     * Récupère les crédits à l'échéance.
     */
    protected function recupererCreditsAEcheance()
    {
        info("value " . $this->remboursAnticipe);

        // $dateSystem = date("Y-m-d");
        //REMBOURSEMENT ANTICIPE
        if ($this->remboursAnticipe == true and !is_null($this->numDossier)) {
            //RECUPERE ICI LA DATE D'ECHEANCE DU CREDIT 

            $dateEcheanche = Portefeuille::where("NumDossier", $this->numDossier)->first()->DateEcheance;
            return Portefeuille::where("portefeuilles.Cloture", "=", 0)
                ->where("portefeuilles.Octroye", "=", 1)
                ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                ->where("echeanciers.DateTranch", "<=", $dateEcheanche)
                // ->where("portefeuilles.CodeMonnaie", "=", $codeMonnaie)
                ->where("echeanciers.statutPayement", "=", 0)
                ->where("echeanciers.posted", "=", 0)
                ->where("echeanciers.NumDossier", "=", $this->numDossier)
                ->where("echeanciers.CapAmmorti", ">", 0)->get();
            //REMBOURSEMENT VISANT EN RECUPERER SEULEMENT LE MONTANT SAISIE PAR L'UTILISATEUR
        } else if ($this->remboursAnticipe == false and !is_null($this->numDossier) and !is_null($this->montantRemboursementManuel)) {
            return Portefeuille::where("portefeuilles.Cloture", "=", 0)
                ->where("portefeuilles.Octroye", "=", 1)
                ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                ->where("echeanciers.DateTranch", "<=", $this->dateSystem)
                // ->where("portefeuilles.CodeMonnaie", "=", $codeMonnaie)
                ->where("echeanciers.statutPayement", "=", 0)
                ->where("echeanciers.posted", "=", 0)
                ->where("echeanciers.NumDossier", "=", $this->numDossier)
                ->where("echeanciers.CapAmmorti", ">", 0)->get();
        } else {

            return Portefeuille::where("portefeuilles.Cloture", "=", 0)
                ->where("portefeuilles.Octroye", "=", 1)
                ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                ->where("echeanciers.DateTranch", "<=", $this->dateSystem)
                // ->where("portefeuilles.CodeMonnaie", "=", $codeMonnaie)
                ->where("echeanciers.statutPayement", "=", 0)
                ->where("echeanciers.posted", "=", 0)
                ->where("echeanciers.CapAmmorti", ">", 0)->get();
        }
    }

    /**
     * Applique les paiements sur les intérêts puis sur le capital.
     */
    public function appliquerPaiementInteretPuisCapital($credit)
    {
        // Logique de calcul pour les intérêts
        $this->payerInterets($credit);

        // Logique de calcul pour le capital
        $this->payerCapital($credit);
    }
    public function payerInterets($credit)
    {
        info("ok " . $credit->CodeMonnaie);
        // Implémentez le paiement des intérêts
        //REMBOURSEMENT EN INTERET DEBITE LE COMPTE DU CLIENT
        $libelle = "Remboursement intérêt du crédit de "
            . $credit->MontantAccorde . "  pour la "
            . $credit->NbreJour . "e tranche tombée en date du "
            . $credit->DateTranch . " Numéro dossier "
            . $credit->NumDossier;
        $this->insertInTransactionInteret(
            // $credit->MontantAccorde,
            $credit->Interet,
            $credit->CodeMonnaie,
            $this->dateSystem,
            $credit->CodeAgence,
            $credit->NumCompteEpargne,
            $credit->CompteInteret,
            $this->tauxDuJour,
            $credit->numAdherant,
            // $credit->NbreJour,
            // $credit->DateTranch,
            // $credit->NumDossier,
            $libelle,
            $credit->Gestionnaire,
        );
        $this->CheckTransactionStatus();
        //ENVOIE UN MESSAGE AU CLIENT INTERET COMPLET
        $this->sendNotification->sendNotificationRemboursementCredit($credit->numAdherant, $credit->CodeMonnaie, $credit->Interet, "Interet", "");
    }

    protected function payerCapital($credit)
    {

        // Définition des variables dynamiques
        $libelle = "Remboursement capital du crédit de "
            . $credit->MontantAccorde . "  pour la "
            . $credit->NbreJour . "e tranche tombée en date du "
            . $credit->DateTranch . " Numéro dossier "
            . $credit->NumDossier;
        //REMBOURSEMENT EN CAPITAL
        $this->insertInTransactionCapital(
            $credit->CapAmmorti,
            $credit->CodeMonnaie,
            $this->dateSystem,
            $credit->CodeAgence,
            $credit->NumCompteEpargne,
            $credit->NumCompteCredit,
            $this->tauxDuJour,
            $credit->numAdherant,
            $libelle,
            $credit->Gestionnaire,
        );
        //RENSEIGNE LE PAYEMENT DANS LA TABLE REMBOURSEMENT
        $this->RenseignePayement(
            $credit->ReferenceEch,
            $credit->NumCompteEpargne,
            $credit->NumCompteCredit,
            $credit->NumDossier,
            $credit->RefTypeCredit,
            $credit->NomCompte,
            $credit->DateTranch,
            $credit->Interet,
            $credit->CapAmmorti,
            $credit->CodeAgence,
            $credit->numAdherant,
        );
        //RENSEIGNE LE REMBOURSEMENT 
        $this->ClotureTranche($credit->ReferenceEch);

        //ENVOIE UN MESSAGE AU CLIENT CAPITAL COMPLET
        $this->sendNotification->sendNotificationRemboursementCredit($credit->numAdherant, $credit->CodeMonnaie, $credit->CapAmmorti, "Capital", "");
    }

    /**
     * Récupère les crédits en retard.
     */
    protected function recupererCreditsEnRetard()
    {
        // return Echeancier::join('portefeuilles', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
        //     ->where('echeanciers.RetardPayement', 1)
        //     ->get(['echeanciers.*', 'portefeuilles.*']); // Sélectionnez les colonnes souhaitées

        if (!is_null($this->numDossier) and !is_null($this->montantRemboursementManuel) and $this->montantRemboursementManuel > 0) {
            //RECUPERE ICI LA DATE D'ECHEANCE DU CREDIT 
            return Echeancier::join('portefeuilles', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(portefeuilles.NumDossier)'))
                ->where('portefeuilles.NumDossier', $this->numDossier)
                ->where('echeanciers.RetardPayement', 1)
                ->get(['echeanciers.*', 'portefeuilles.*']);
        } else {
            return Echeancier::join('portefeuilles', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(portefeuilles.NumDossier)'))
                ->where('echeanciers.RetardPayement', 1)
                ->get(['echeanciers.*', 'portefeuilles.*']);
        }
    }
    /**
     * Met à jour les informations pour un crédit en retard.
     */
    protected function mettreAJourRetard($creditRet)
    {
        // Implémentez la gestion des crédits en retard
        $this->RenseignePayementEnRetard(
            $creditRet->ReferenceEch,
            $creditRet->NumCompteEpargne,
            $creditRet->NumCompteCredit,
            $creditRet->NumDossier,
            $creditRet->RefTypeCredit,
            $creditRet->NomCompte,
            $creditRet->DateTranch,
            $creditRet->Interet,
            $creditRet->CapAmmorti,
            $creditRet->CodeAgence,
            $creditRet->numAdherant,
        );

        info($creditRet->NumDossier);
        //CREE LE COMPTE S'IL N'EXISTE PAS 
        $this->createAccountLogic(
            $creditRet->numAdherant,
            $creditRet->CodeMonnaie,
            $creditRet->CodeAgence,
            $creditRet->NomCompte,
            $creditRet->NumCompteCredit
        );
        //REMBOURSEMENT INTERET EN RETARD
        $this->remboursementInteretRetard($creditRet);
        //REMBOURSEMENT CAPITAL EN RETARD
        $this->remboursementCapitalRetard($creditRet);
        //CLOTURE LE SYSTEME
        // $this->clotureSysteme($this->dateSystem);
    }
    //PERMET DE FAIRE LE REMBOURSEMENT D'INTERET EN RETARD
    public function remboursementInteretRetard($creditRet)
    {

        $NumCompte = $creditRet->NumCompteEpargne;
        $CodeMonnaie = $creditRet->CodeMonnaie == "USD" ? 1 : 2;
        $soldeMembre = $this->checkSoldeMembre($CodeMonnaie, $NumCompte);
        // $CapAmmorti = $creditRet->CapAmmorti;
        // $interetApayer = $creditRet->Interet;
        // $CapDejaPaye = $creditRet->CapitalPaye;
        // $interetDejaPaye = $creditRet->InteretPaye;
        // $TotMontantDejaPaye = $CapDejaPaye + $interetDejaPaye;
        // $MontantTotalApayer = $CapAmmorti + $interetApayer;
        // $MontantRestantApayer = $MontantTotalApayer - $TotMontantDejaPaye;
        $checkRetard = $this->checkRetardMembre(
            $creditRet->NumDossier,
            $creditRet->DateTranch
        );

        if ($checkRetard) {
            if ($soldeMembre > 0) {
                //VERIFIE SI LE CLIENT A EU FAIRE UN REMBOURSEMENT PARTIEL OU PAS
                $creditEnRetard = Remboursementcredit::where("RefEcheance", $creditRet->ReferenceEch)->first();
                if ($creditEnRetard->InteretPaye < $creditRet->Interet) { //SI L'INTERET QUE LA PERSONNE DEVRAIT PAYER NE PAS TOUJOURS COMPLET
                    if ($creditEnRetard->InteretPaye > 0) {
                        $interetRestant = $creditRet->Interet - $creditEnRetard->InteretPaye;
                        //VERIFIE LE SOLDE S'IL EST SUPERIEUR AU MONTANT D'INTERET RESTANT 
                        if ($soldeMembre > $interetRestant) {
                            info("interet restant " . $creditRet->Interet);
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            $libelle = "Remboursement complement intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionInteret(
                                round($interetRestant, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );
                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();


                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->InteretPaye + $interetRestant, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );

                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie, round($interetRestant, 2), "Interet", "complement");
                        } else if ($soldeMembre == $interetRestant) { // SI LE SOLDE EST EGALE A L'INTERET RESTANT
                            //PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            $libelle = "Remboursement complement intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionInteret(
                                round($interetRestant, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );
                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->InteretPaye + $interetRestant, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie, round($interetRestant, 2), "Interet", "complement");
                        } else if ($soldeMembre < $interetRestant) { // SI LE SOLDE DU MEMBRE EST INFERIEUR AU SOLDE IL VA RESTER EN RETARD 
                            $libelle = "Remboursement complement intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionInteret(
                                round($soldeMembre, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );

                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->InteretPaye + $soldeMembre, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );

                            //RENSEIGNE LE RETARD EN INTERET
                            // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, $soldeMembre, 0);
                            //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                            $this->IncrementerJourRetard(
                                $creditRet->NumDossier,
                                $this->dateSystem,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit
                            );
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie, round($soldeMembre, 2), "Interet", "complement");
                        }
                    } else if ($creditEnRetard->InteretPaye == 0) {
                        //SI L'INTERET DEJA REMBOURSE EST EGAL ZERO CELA SIGNIFIE QU'AUCUN REMBOURS EN INTERET N'EST ENCORE FAIT
                        $interetApayer = $creditRet->Interet;
                        //VERIFIE LE SOLDE S'IL EST SUPERIEUR AU MONTANT D'INTERET RESTANT 
                        if ($soldeMembre > $interetApayer) {
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            $libelle = "Remboursement intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;

                            $this->insertInTransactionInteret(
                                round($interetApayer, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );
                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();
                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->InteretPaye + $interetApayer, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );

                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie, round($interetApayer, 2), "Interet", "");
                            // PASSE ICI UNE ECRITURE POUR RECUPERER L'INTERET
                        } else if ($soldeMembre == $interetApayer) { // SI LE SOLDE EST EGALE A L'INTERET RESTANT
                            //PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            $libelle = "Remboursement complement intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionInteret(
                                round($interetApayer, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );
                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($interetApayer, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,  round($interetApayer, 2), "Interet", "complement");
                        } else if ($soldeMembre > 0 and $soldeMembre < $interetApayer) { // SI LE SOLDE DU MEMBRE EST INFERIEUR AU SOLDE IL VA RESTER EN RETARD 
                            $libelle = "Remboursement partiel intérêt du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionInteret(
                                round($soldeMembre, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );
                            //PERMET DE METTRE A JOUR LE RESULTAT NET
                            $this->CheckTransactionStatus();

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->InteretPaye + $soldeMembre, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //RENSEIGNE LE RETARD EN INTERET
                            // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, $soldeMembre, 0);
                            //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                            $this->IncrementerJourRetard(
                                $creditRet->NumDossier,
                                $this->dateSystem,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit
                            );

                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,  round($soldeMembre, 2), "Interet", "partiel");
                        }
                    }
                }
            } else {
                info("le solde du crédit interet section " . $creditRet->numAdherant . " est 0 ou meme inferieur à 0");
                //FONCTION D'INCREMENTER LE JOUR RETARD ICI ON POURRAI IMPLEMENTER ICI AUSSI LA LOGIQUE DE PROVISION
                //RENSEIGNE LE RETARD EN INTERET
                // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, $creditRet->Interet, 0);
                //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                // $this->gererProvisionPourRetard($creditRet);
                // $this->IncrementerJourRetard(
                //     $creditRet->NumDossier,
                //     $this->dateSystem,
                //     $creditRet->NumCompteEpargne,
                //     $creditRet->NumCompteCredit
                // );
            }
        }
    }


    //PERMET DE FAIRE LE REMBOURSEMENT DE CAPITAL EN RETARD

    public function remboursementCapitalRetard($creditRet)
    {
        $NumCompte = $creditRet->NumCompteEpargne;
        $CodeMonnaie = $creditRet->CodeMonnaie == "USD" ? 1 : 2;
        $soldeMembre = $this->checkSoldeMembre($CodeMonnaie, $NumCompte);
        $getCapitaRetard =  Echeancier::selectRaw('
            echeanciers.NumDossier,
           SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS sommeInteretRetard,
           SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS sommeCapitalRetard
       ')
            ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
            ->where('echeanciers.RetardPayement', 1)
            ->where('echeanciers.NumDossier', $creditRet->NumDossier)
            ->groupBy('echeanciers.NumDossier')
            ->first();
        $capitalEnRetard = $getCapitaRetard->sommeCapitalRetard;
        if ($soldeMembre >= $capitalEnRetard) {
            $typeRemboursement = "complet";
        } else {
            $typeRemboursement = "partiel";
        }
        // $CapAmmorti = $creditRet->CapAmmorti;
        // $interetApayer = $creditRet->Interet;
        // $CapDejaPaye = $creditRet->CapitalPaye;
        // $interetDejaPaye = $creditRet->InteretPaye;
        // $TotMontantDejaPaye = $CapDejaPaye + $interetDejaPaye;
        // $MontantTotalApayer = $CapAmmorti + $interetApayer;
        // $MontantRestantApayer = $MontantTotalApayer - $TotMontantDejaPaye;
        $checkRetard = $this->checkRetardMembre(
            $creditRet->NumDossier,
            $creditRet->DateTranch
        );
        if ($checkRetard) {
            if ($soldeMembre > 0) {
                //VERIFIE SI LE CLIENT A EU FAIRE UN REMBOURSEMENT PARTIEL OU PAS
                $creditEnRetard = Remboursementcredit::where("RefEcheance", $creditRet->ReferenceEch)->first();
                if ($creditEnRetard->CapitalPaye < $creditRet->CapAmmorti) {
                    if ($creditEnRetard->CapitalPaye > 0) {
                        $CapitalRestant = $creditRet->CapAmmorti - $creditEnRetard->CapitalPaye;
                        //VERIFIE LE SOLDE S'IL EST SUPERIEUR AU MONTANT D'INTERET RESTANT 
                        if ($soldeMembre > $CapitalRestant) {
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            // $libelle = "Remboursement complement capital du crédit de "
                            //     . $creditRet->MontantAccorde . "  pour la "
                            //     . $creditRet->NbreJour . "e tranche tombée en date du "
                            //     . $creditRet->DateTranch . " Numéro dossier "
                            //     . $creditRet->NumDossier;
                            // $this->insertInTransactionCapital(
                            //     round($CapitalRestant, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->CompteInteret,
                            //     $this->tauxDuJour,
                            //     $creditRet->numAdherant,
                            //     $libelle,
                            //     $creditRet->Gestionnaire,
                            // );

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->CapitalPaye + $CapitalRestant, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //PASSE ECRITURE DE REPRISE

                            // $this->insertInTransactionRepriseProvision(
                            //     round($CapitalRestant, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $this->tauxDuJour,
                            //     $typeRemboursement,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->NbreJour,
                            //     $creditRet->DateTranch,
                            //     $creditRet->MontantAccorde,
                            //     $creditRet->NumDossier,
                            //     $creditRet->Gestionnaire,
                            // );
                            $this->gererProvisions();

                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($soldeMembre, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );
                            $this->CheckTransactionStatus();

                            //CLOTURE LA TRANCHE
                            $this->ClotureTranche($creditRet->ReferenceEch);
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,  round($soldeMembre, 2), "Capital", "");
                            // $this->AnnuleMontantRetardEtJourRetard($creditRet->ReferenceEch, $creditRet->NumDossier);
                        } else if ($soldeMembre == $CapitalRestant) { // SI LE SOLDE EST EGALE A L'INTERET RESTANT

                            //PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT D'INTERET
                            // $libelle = "Remboursement complement capital du crédit de "
                            //     . $creditRet->MontantAccorde . "  pour la "
                            //     . $creditRet->NbreJour . "e tranche tombée en date du "
                            //     . $creditRet->DateTranch . " Numéro dossier "
                            //     . $creditRet->NumDossier;

                            // $this->insertInTransactionCapital(
                            //     round($CapitalRestant, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->CompteInteret,
                            //     $this->tauxDuJour,
                            //     $creditRet->numAdherant,
                            //     $libelle,
                            //     $creditRet->Gestionnaire,
                            // );

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->CapitalPaye + $CapitalRestant, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //GERE LES PROVISION
                            $this->gererProvisions();

                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($CapitalRestant, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );
                            $this->CheckTransactionStatus();
                            //CLOTURE LA TRANCHE
                            $this->ClotureTranche($creditRet->ReferenceEch);
                            // $this->AnnuleMontantRetardEtJourRetard($creditRet->ReferenceEch, $creditRet->NumDossier);

                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,   round($CapitalRestant, 2), "Capital", "");
                        } else if ($soldeMembre < $CapitalRestant) { // SI LE SOLDE DU MEMBRE EST INFERIEUR AU SOLDE IL VA RESTER EN RETARD 
                            // $libelle = "Remboursement complement capital du crédit de "
                            //     . $creditRet->MontantAccorde . "  pour la "
                            //     . $creditRet->NbreJour . "e tranche tombée en date du "
                            //     . $creditRet->DateTranch . " Numéro dossier "
                            //     . $creditRet->NumDossier;
                            // $this->insertInTransactionCapital(
                            //     round($soldeMembre, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->CompteInteret,
                            //     $this->tauxDuJour,
                            //     $creditRet->numAdherant,
                            //     $libelle,
                            //     $creditRet->Gestionnaire,
                            // );

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->CapitalPaye + $soldeMembre, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );


                            //RENSEIGNE LE RETARD EN CAPITAL
                            // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, 0, $soldeMembre);

                            //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                            $this->gererProvisions();

                            $this->IncrementerJourRetard(
                                $creditRet->NumDossier,
                                $this->dateSystem,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit
                            );
                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($soldeMembre, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );

                            $this->CheckTransactionStatus();

                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,   round($soldeMembre, 2), "Capital", "");
                        }
                    } else if ($creditEnRetard->CapitalPaye == 0) {
                        //SI LE CAPITAL DEJA REMBOURSE EST EGAL ZERO CELA SIGNIFIE QU'AUCUN REMBOURS EN CAPITAL N'EST ENCORE FAIT
                        $capitalApayer = $creditRet->CapAmmorti;
                        //VERIFIE LE SOLDE S'IL EST SUPERIEUR AU MONTANT D'INTERET RESTANT 
                        if ($soldeMembre > $capitalApayer) {
                            // PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT DE CAPITAL
                            $libelle = "Remboursement capital du crédit de "
                                . $creditRet->MontantAccorde . "  pour la "
                                . $creditRet->NbreJour . "e tranche tombée en date du "
                                . $creditRet->DateTranch . " Numéro dossier "
                                . $creditRet->NumDossier;
                            $this->insertInTransactionCapital(
                                round($capitalApayer, 2), // Arrondir à 2 chiffres après la virgule
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $creditRet->NumCompteEpargne,
                                $creditRet->CompteInteret,
                                $this->tauxDuJour,
                                $creditRet->numAdherant,
                                $libelle,
                                $creditRet->Gestionnaire,
                            );


                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->CapitalPaye + $capitalApayer, 2), // Arrondir à 2 chiffres après la virgule  
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );

                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($capitalApayer, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );
                            $this->CheckTransactionStatus();
                            //CLOTURE LA TRANCHE
                            $this->ClotureTranche($creditRet->ReferenceEch);
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,   round($capitalApayer, 2), "Capital", "");
                        } else if ($soldeMembre == $capitalApayer) { // SI LE SOLDE EST EGALE AU CAPITAL RESTANT
                            //PASSE ICI UNE ECRITURE POUR RECUPERER LE COMPLEMENT DE CAPIAL
                            // $libelle = "Remboursement complement capital du crédit de "
                            //     . $creditRet->MontantAccorde . "  pour la "
                            //     . $creditRet->NbreJour . "e tranche tombée en date du "
                            //     . $creditRet->DateTranch . " Numéro dossier "
                            //     . $creditRet->NumDossier;
                            // $this->insertInTransactionCapital(
                            //     round($capitalApayer, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->CompteInteret,
                            //     $this->tauxDuJour,
                            //     $creditRet->numAdherant,
                            //     $libelle,
                            //     $creditRet->Gestionnaire,
                            // );

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($capitalApayer, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            $this->gererProvisions();
                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($capitalApayer, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );
                            $this->CheckTransactionStatus();
                            //CLOTURE LA TRANCHE
                            $this->ClotureTranche($creditRet->ReferenceEch);


                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,   round($capitalApayer, 2), "Capital", "");
                        } else if ($soldeMembre > 0 and $soldeMembre < $capitalApayer) { // SI LE SOLDE DU MEMBRE EST INFERIEUR AU SOLDE IL VA RESTER EN RETARD 
                            // $libelle = "Remboursement partiel capital du crédit de "
                            //     . $creditRet->MontantAccorde . "  pour la "
                            //     . $creditRet->NbreJour . "e tranche tombée en date du "
                            //     . $creditRet->DateTranch . " Numéro dossier "
                            //     . $creditRet->NumDossier;
                            // $this->insertInTransactionCapital(
                            //     round($soldeMembre, 2),
                            //     $creditRet->CodeMonnaie,
                            //     $this->dateSystem,
                            //     $creditRet->CodeAgence,
                            //     $creditRet->NumCompteEpargne,
                            //     $creditRet->CompteInteret,
                            //     $this->tauxDuJour,
                            //     $creditRet->numAdherant,
                            //     $libelle,
                            //     $creditRet->Gestionnaire,
                            // );

                            // MET A JOUR LA TABLE REMBOURSEMENT
                            $this->RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
                                $creditRet->ReferenceEch,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit,
                                $creditRet->NumDossier,
                                $creditRet->RefTypeCredit,
                                $creditRet->NomCompte,
                                $creditRet->DateTranch,
                                round($creditEnRetard->CapitalPaye + $soldeMembre, 2),
                                $creditRet->CodeAgence,
                                $creditRet->numAdherant,
                            );
                            //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                            //RENSEIGNE LE RETARD EN CAPITAL
                            // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, 0, $soldeMembre);
                            $this->gererProvisions();
                            //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                            $this->IncrementerJourRetard(
                                $creditRet->NumDossier,
                                $this->dateSystem,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NumCompteCredit
                            );
                            //PASSE ECRITURE DE REPRISE
                            $this->insertInTransactionRepriseProvision(
                                round($soldeMembre, 2),
                                $creditRet->CodeMonnaie,
                                $this->dateSystem,
                                $creditRet->CodeAgence,
                                $this->tauxDuJour,
                                $typeRemboursement,
                                $creditRet->NumCompteEpargne,
                                $creditRet->NbreJour,
                                $creditRet->DateTranch,
                                $creditRet->MontantAccorde,
                                $creditRet->NumDossier,
                                $creditRet->Gestionnaire,
                            );
                            $this->CheckTransactionStatus();
                            //ENVOIE UN MESSAGE AU CLIENT
                            $this->sendNotification->sendNotificationRemboursementCredit($creditRet->numAdherant, $creditRet->CodeMonnaie,    round($soldeMembre, 2), "Capital", "");
                        }
                    }
                }
            } else {
                info("le solde du crédit capital section: " . $creditRet->numAdherant . " est 0 ou meme inferieur à 0");
                //FONCTION D'INCREMENTER LE JOUR RETARD ICI ON POURRAI IMPLEMENTER ICI AUSSI LA LOGIQUE DE PROVISION
                //RENSEIGNE LE RETARD EN INTERET
                // $this->renseigneMontantRetard($creditRet->ReferenceEch, $creditRet->NumDossier, 0, $creditRet->CapAmmorti);
                //FONCTION D'INCREMENTER LE JOUR RETARD ICI 
                $this->gererProvisions();
                $this->IncrementerJourRetard(
                    $creditRet->NumDossier,
                    $this->dateSystem,
                    $creditRet->NumCompteEpargne,
                    $creditRet->NumCompteCredit
                );
            }
        }
    }


    /**
     * Récupère les crédits avec provisions.
     */
    protected function recupererCreditsAvecProvisions()
    {
        // return Echeancier::join('portefeuilles', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(portefeuilles.NumDossier)'))
        //     ->join('jour_retards', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(jour_retards.NumDossier)'))
        //     ->where('echeanciers.RetardPayement', 1)
        //     ->get(['echeanciers.*', 'portefeuilles.*', 'jour_retards.*']);

        // return Echeancier::join('portefeuilles', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(portefeuilles.NumDossier)'))
        //     ->join('jour_retards', DB::raw('TRIM(echeanciers.NumDossier)'), '=', DB::raw('TRIM(jour_retards.NumDossier)'))
        //     ->where('echeanciers.RetardPayement', 1)
        //     ->get(['echeanciers.*', 'portefeuilles.*', 'jour_retards.*']);

        return Portefeuille::join('jour_retards', DB::raw('TRIM(jour_retards.NumDossier)'), '=', DB::raw('TRIM(portefeuilles.NumDossier)'))
            ->where('jour_retards.NbrJrRetard', '>', 0)
            ->get(['portefeuilles.*', 'jour_retards.*']);
    }

    /**
     * Gère la provision pour les crédits récemment tombés en retard.
     */
    protected function gererProvisionPourRetard($creditProv)
    {
        // Implémentez la logique pour provisionner ou annuler les provisions
        $record = JourRetard::where("NumDossier", $creditProv->NumDossier)->first();
        //info("record " . $record);
        if ($record) {
            // Vérifie si la DateRetard est différente de la date actuelle
            if ($record->DateRetard !== $this->dateSystem) {
                $this->provisionCreditRetard($creditProv);
            }
        }
        // $this->provision31A60Jours($creditProv);
        // $this->provision61A90Jours($creditProv);
        // $this->provision91A180Jours($creditProv);
        // $this->provisionPlusDe180Jours($creditProv);
    }


    //PROVISION DE CREDIT
    public function provisionCreditRetard($creditProv)
    {
        // $soldeRestant = DB::select('SELECT SUM(echeanciers.CapAmmorti) as soldeRestant from echeanciers where echeanciers.NumDossier="' . $creditProv->NumDossier . '" and echeanciers.posted=!1 and echeanciers.statutPayement=!1 GROUP BY echeanciers.NumDossier')[0];
        // $SoldeCreditRestant = $soldeRestant->soldeRestant;
        $soldeRestant =  Echeancier::selectRaw('
                     echeanciers.NumDossier,
                    SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS InteretRetard,
                    SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS soldeRestant
                ')
            ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
            ->where('echeanciers.posted', '=!', 1)
            ->where('echeanciers.statutPayement', '=!', 1)
            ->where('echeanciers.NumDossier', $creditProv->NumDossier)
            ->groupBy('echeanciers.NumDossier')
            ->first();
        $SoldeCreditRestant = $soldeRestant->soldeRestant;

        $capitaRetard =  Echeancier::selectRaw('
        echeanciers.NumDossier,
       SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS sommeInteretRetard,
       SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS sommeCapitalRetard
   ')
            ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
            ->where('echeanciers.RetardPayement', 1)
            ->where('echeanciers.NumDossier', $creditProv->NumDossier)
            ->groupBy('echeanciers.NumDossier')
            ->first();

        $capitaDejaPaye =  Echeancier::selectRaw('
            echeanciers.NumDossier,
           SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS sommeInteretDejaPaye,
           SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS sommeCapitalDejaPaye
       ')
            ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
            ->where('echeanciers.statutPayement', 1)
            ->where('echeanciers.NumDossier', $creditProv->NumDossier)
            ->groupBy('echeanciers.NumDossier')
            ->first();
        if ($capitaDejaPaye) {
            $sommeCapitalDejaPaye = floor($capitaDejaPaye->sommeCapitalDejaPaye * 100) / 100;
        } else {
            $sommeCapitalDejaPaye = 0;
        }
        $capitalApayer = $capitaRetard->sommeCapitalRetard;
        if ($creditProv->NbrJrRetard <= 30 and $creditProv->provision1 == 0) {
            //
            $this->insertInTransactionProvision(
                $sommeCapitalDejaPaye,
                $creditProv->CodeMonnaie,
                $this->dateSystem,
                $creditProv->CodeAgence,
                $creditProv->NumCompteCredit,
                $creditProv->numAdherant,
                $SoldeCreditRestant,
                $this->tauxDuJour,
                $creditProv->NomCompte,
                $capitalApayer,
                $creditProv->NumDossier,
                "5%",
                5,
                "1 à 30jrs",
                $creditProv->Gestionnaire,
            );
            $this->CheckTransactionStatus();

            JourRetard::where("NumDossier", $creditProv->NumDossier)->update([
                "provision1" => 1,
            ]);
        } else if ($creditProv->NbrJrRetard > 30 and $creditProv->NbrJrRetard <= 60 and $creditProv->provision2 == 0) {
            //ANNULE D'ABORD l'ANCIENNE PROVISION

            $this->annulProvision(
                $creditProv->CodeMonnaie,
                $creditProv->CodeAgence,
                $creditProv->numAdherant,
                1,
                $capitalApayer,
                $this->tauxDuJour,
                $SoldeCreditRestant,
                $creditProv->NumDossier,
                "5%",
                "1 à 30jrs",
                $creditProv->Gestionnaire,
            );

            $this->insertInTransactionProvision(
                $sommeCapitalDejaPaye,
                $creditProv->CodeMonnaie,
                $this->dateSystem,
                $creditProv->CodeAgence,
                $creditProv->NumCompteCredit,
                $creditProv->numAdherant,
                $SoldeCreditRestant,
                $this->tauxDuJour,
                $creditProv->NomCompte,
                $capitalApayer,
                $creditProv->NumDossier,
                "10%",
                10,
                "31 à 60jrs",
                $creditProv->Gestionnaire,
            );

            $this->CheckTransactionStatus();

            JourRetard::where("NumDossier", $creditProv->NumDossier)->update([
                "provision2" => 1,
            ]);
        } else if ($creditProv->NbrJrRetard > 60 and $creditProv->NbrJrRetard <= 90 and $creditProv->provision3 == 0) {
            //ANNULE D'ABORD l'ANCIENNE PROVISION

            $this->annulProvision(
                $creditProv->CodeMonnaie,
                $creditProv->CodeAgence,
                $creditProv->numAdherant,
                2,
                $capitalApayer,
                $this->tauxDuJour,
                $SoldeCreditRestant,
                $creditProv->NumDossier,
                "10%",
                "31 à 60jrs",
                $creditProv->Gestionnaire,
            );

            $this->insertInTransactionProvision(
                $sommeCapitalDejaPaye,
                $creditProv->CodeMonnaie,
                $this->dateSystem,
                $creditProv->CodeAgence,
                $creditProv->NumCompteCredit,
                $creditProv->numAdherant,
                $SoldeCreditRestant,
                $this->tauxDuJour,
                $creditProv->NomCompte,
                $capitalApayer,
                $creditProv->NumDossier,
                "25%",
                25,
                "61 à 90jrs",
                $creditProv->Gestionnaire,
            );

            $this->CheckTransactionStatus();

            JourRetard::where("NumDossier", $creditProv->NumDossier)->update([
                "provision3" => 1,
            ]);
        } else if ($creditProv->NbrJrRetard > 90 and $creditProv->NbrJrRetard <= 180 and $creditProv->provision4 == 0) {
            //ANNULE D'ABORD l'ANCIENNE PROVISION
            $this->annulProvision(
                $creditProv->CodeMonnaie,
                $creditProv->CodeAgence,
                $creditProv->numAdherant,
                3,
                $capitalApayer,
                $this->tauxDuJour,
                $SoldeCreditRestant,
                $creditProv->NumDossier,
                "25%",
                "61 à 90jrs",
                $creditProv->Gestionnaire,
            );


            $this->insertInTransactionProvision(
                $sommeCapitalDejaPaye,
                $creditProv->CodeMonnaie,
                $this->dateSystem,
                $creditProv->CodeAgence,
                $creditProv->NumCompteCredit,
                $creditProv->numAdherant,
                $SoldeCreditRestant,
                $this->tauxDuJour,
                $creditProv->NomCompte,
                $capitalApayer,
                $creditProv->NumDossier,
                "75%",
                75,
                "91 à 180jrs",
                $creditProv->Gestionnaire,
            );

            $this->CheckTransactionStatus();

            JourRetard::where("NumDossier", $creditProv->NumDossier)->update([
                "provision4" => 1,
            ]);
        } else if ($creditProv->NbrJrRetard > 180 and $creditProv->provision5 == 0) {
            // //ANNULE D'ABORD l'ANCIENNE PROVISION

            $this->annulProvision(
                $creditProv->CodeMonnaie,
                $creditProv->CodeAgence,
                $creditProv->numAdherant,
                4,
                $capitalApayer,
                $this->tauxDuJour,
                $SoldeCreditRestant,
                $creditProv->NumDossier,
                "75%",
                "91 à 180jrs",
                $creditProv->Gestionnaire,
            );
            $this->insertInTransactionProvision(
                $sommeCapitalDejaPaye,
                $creditProv->CodeMonnaie,
                $this->dateSystem,
                $creditProv->CodeAgence,
                $creditProv->NumCompteCredit,
                $creditProv->numAdherant,
                $SoldeCreditRestant,
                $this->tauxDuJour,
                $creditProv->NomCompte,
                $capitalApayer,
                $creditProv->NumDossier,
                "100%",
                100,
                "plus de 180jrs",
                $creditProv->Gestionnaire,
            );

            $this->CheckTransactionStatus();

            JourRetard::where("NumDossier", $creditProv->NumDossier)->update([
                "provision5" => 1,
            ]);
        }
    }

    // //PROVISION DE 31 0 A 60 jour 
    // public function provision31A60Jours($creditProv) {}

    // //PROVISION DE 61 0 A 90 jour 
    // public function provision61A90Jours($creditProv) {}

    // //PROVISION DE 91 0 A 180 jour 
    // public function provision91A180Jours($creditProv) {}

    // //PROVISION plus de 180 jour 
    // public function provisionPlusDe180Jours($creditProv) {}

    //CETTE FONCTION PERMET DE FAIRE UNE INSERTION DANS LA TABLE TRANSACTION POUR LE PAIEMENT DES INTERET ET DEBITE LE COMPTE DU CLIENT DES INTERETS
    protected function insertInTransactionInteret(
        // $MontantCapAccorde,
        $montantInteret,
        $codeMonnaie,
        $dateSystem,
        $CodeAgence,
        $NumCompteEpargne,
        $NumCompteInteret,
        $tauxDuJour,
        $refCompteMembre,
        // $NbreTranche,
        // $dateTombeeTranche,
        // $NumDossier,
        $Libelle,
        $Gestionnaire,
    ) {
        //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = "AT00" . $numOperation->id;
        info("code monnaie " . $codeMonnaie);
        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }
        // info($devise);
        //DEBITE LE COMPTE DU CLIENT DE l'INTERET
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => date("Y-m-d"),
            "TypeTransaction" => "D",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $NumCompteEpargne,
            "NumComptecp" => $NumCompteInteret,
            "Debit" =>  $montantInteret,
            "Operant" =>  $Gestionnaire,
            "Debitfc" => $devise == 2 ? $montantInteret : $montantInteret * $tauxDuJour,
            "Debitusd" =>  $devise == 1 ? $montantInteret : $montantInteret / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => $Libelle,

            "refCompteMembre" => $refCompteMembre,
        ]);
        // CREDITE LE COMPTE INTERET
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => date("Y-m-d"),
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" =>   $NumCompteInteret,
            "NumComptecp" => $NumCompteEpargne,
            "Credit" =>  $montantInteret,
            "Operant" =>  $Gestionnaire,
            "Creditfc" => $devise == 2 ? $montantInteret : $montantInteret * $tauxDuJour,
            "Creditusd" =>  $devise == 1 ? $montantInteret : $montantInteret / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => $Libelle,
            "refCompteMembre" => $refCompteMembre,
        ]);
    }



    //CETTE FONCTION PERMET DE FAIRE UNE INSERTION DANS LA TABLE TRANSACTION POUR LE PAIEMENT DU CAPITAL 
    protected function insertInTransactionCapital(
        $montantCapital,
        $codeMonnaie,
        $dateSystem,
        $CodeAgence,
        $NumCompteEpargne,
        $NumCompteCredit,
        $tauxDuJour,
        $refCompteMembre,
        $Libelle,
        $Gestionnaire,
    ) {
        //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = "AT00" . $numOperation->id;
        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }
        //DEBITE LE COMPTE  EPARGNE DU CLIENT
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => date("Y-m-d"),
            "TypeTransaction" => "D",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" =>   $NumCompteEpargne,
            "NumComptecp" => $NumCompteCredit,
            "Debit" =>  $montantCapital,
            "Operant" =>  $Gestionnaire,
            "Debitfc" => $devise == 2 ? $montantCapital : $montantCapital * $tauxDuJour,
            "Debitusd" =>  $devise == 1 ? $montantCapital : $montantCapital / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => $Libelle,
            "refCompteMembre" => $refCompteMembre,
        ]);

        //CREDITE LE COMPTE CREDIT DU MEMBRE 
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => date("Y-m-d"),
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" =>   $NumCompteCredit,
            "NumComptecp" => $NumCompteEpargne,
            "Credit" =>  $montantCapital,
            "Operant" =>  $Gestionnaire,
            "Creditfc" => $devise == 2 ? $montantCapital : $montantCapital * $tauxDuJour,
            "Creditusd" =>  $devise == 1 ? $montantCapital : $montantCapital / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => $Libelle,
            "refCompteMembre" => $refCompteMembre,
        ]);

        //CREDITE LE COMPTE COMPTABILITE 
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => date("Y-m-d"),
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumDossier" => "DOS00" . $numOperation->id,
            "NumDemande" => "V00" . $numOperation->id,
            "NumCompte" => $devise == 1 ?   $this->compteCreditAuxMembreUSD : $this->compteCreditAuxMembreCDF,
            "NumComptecp" => $NumCompteCredit,
            "Credit" =>  $montantCapital,
            "Operant" =>  $Gestionnaire,
            "Creditfc" => $devise == 2 ? $montantCapital : $montantCapital * $tauxDuJour,
            "Creditusd" =>  $devise == 1 ? $montantCapital : $montantCapital / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => $Libelle,
            "refCompteMembre" => $refCompteMembre,
        ]);
    }


    //PROVISION LOGIC FONCTION TO INSERT DATA

    //CETTE FONCTION PERMET DE FAIRE UNE INSERTION DANS LA TABLE TRANSACTION POUR LE PAIEMENT DU CAPITAL 
    protected function insertInTransactionProvision(
        $capitalPaye,
        $codeMonnaie,
        $dateSystem,
        $CodeAgence,
        $NumCompteCreditCustomer,
        $refCompteMembre,
        $SoldeCreditRestant,
        $tauxDuJour,
        $NomCompte,
        $capitalApayer,
        $NumDossier,
        $provisionTranche,
        $provisionPourcentage,
        $provisionRang,
        $Gestionnaire,
    ) {
        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }

        //info("info! " . $SoldeCreditRestant);

        //CREATE ACCOUNT LOGIQUE

        $compteCreanceLitigieuseCDF = "";
        $compteProvisionCDF = "";
        $compteCreanceLitigieuseUSD = "";
        $compteProvisionUSD = "";

        if ($devise == 2) {
            if ($refCompteMembre < 10) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "390100" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionCDF = "38010" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
            } else {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
            }


            $checkCompteProvision = Comptes::where("NumCompte", $compteProvisionCDF)->first();
            if (!$checkCompteProvision && $compteProvisionCDF !== null && $compteProvisionCDF !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteProvisionCDF,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "38",
                    'RefGroupe' => "380",
                    'RefSousGroupe' => "3801",
                    'CodeMonnaie' => 2,
                    'NumAdherant' => $refCompteMembre,
                ]);

                //MET A JOUR LA TABLE JOUR RETARD POUR RENSEIGNER LE COMPTE DE PROVISUON
                $checkCompteProvi = JourRetard::where("CompteProvision", $compteProvisionCDF)->first();
            }

            //VERIFIE SI COMPTE CREDIT DU CLIENT EXISTE SINON LE CREE 
            $checkCompteCreditCustomer = Comptes::where("NumCompte", $NumCompteCreditCustomer)->first();
            if (!$checkCompteCreditCustomer) {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $NumCompteCreditCustomer,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "32",
                    'RefGroupe' => "320",
                    'RefSousGroupe' => $devise == 2 ? "3201" : "3200",
                    'CodeMonnaie' =>  $devise == 1 ? 1 : 2,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }
            //ON CREE LE COMPTE CREANCE LITIGIEUSE
            //verifie d'abord si c comptes créance litigieuse n'existe déjà pas
            $checkCompteCL = Comptes::where("NumCompte", $compteCreanceLitigieuseCDF)->first();
            if (!$checkCompteCL && $compteCreanceLitigieuseCDF !== null && $compteCreanceLitigieuseCDF !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteCreanceLitigieuseCDF,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "39",
                    'RefGroupe' => "390",
                    'RefSousGroupe' => "3901",
                    'CodeMonnaie' => 2,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }
            //MET A JOUR LA TABLE JOUR RETARD POUR RENSEIGNER LE COMPTE DE PROVISUON
            $checkCompteProvi = JourRetard::where("CompteProvision", $compteProvisionCDF)->first();
            if (!$checkCompteProvi) {
                JourRetard::where("NumDossier", $NumDossier)->update([
                    "CompteProvision" => $compteProvisionCDF
                ]);
            }


            //MET A JOUR LA TABLE JOUR RETARD POUR RENSEIGNER LE COMPTE DE CREANCE LITIGIEUSE
            $checkCompteNumCompteCL = JourRetard::where("NumCompteCreanceLitigieuse", $compteCreanceLitigieuseCDF)->first();
            if (!$checkCompteNumCompteCL) {
                JourRetard::where("NumDossier", $NumDossier)->update([
                    "NumCompteCreanceLitigieuse" => $compteCreanceLitigieuseCDF
                ]);
            }
        } else if ($devise == 1) {

            if ($refCompteMembre < 10) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "390000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionUSD = "38000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
            } else {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
            }


            $checkCompteProvision = Comptes::where("NumCompte", $compteProvisionUSD)->first();
            if (!$checkCompteProvision && $compteProvisionUSD !== null && $compteProvisionUSD !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteProvisionUSD,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "38",
                    'RefGroupe' => "380",
                    'RefSousGroupe' => "3800",
                    'CodeMonnaie' => 1,
                    'NumAdherant' => $refCompteMembre,

                ]);
            }

            //ON CREE LE COMPTE CREANCE LITIGIEUSE
            //verifie d'abord si c comptes créance litigieuse n'existe déjà pas
            $checkCompteCL = Comptes::where("NumCompte", $compteCreanceLitigieuseUSD)->first();
            if (!$checkCompteProvision && $compteCreanceLitigieuseCDF !== null && $compteCreanceLitigieuseCDF !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteCreanceLitigieuseCDF,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "39",
                    'RefGroupe' => "390",
                    'RefSousGroupe' => "3900",
                    'CodeMonnaie' => 1,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }

            //MET A JOUR LA TABLE JOUR RETARD POUR RENSEIGNER LE COMPTE DE PROVISUON
            $checkCompteProvi = JourRetard::where("CompteProvision", $compteProvisionUSD)->first();
            if (!$checkCompteProvi) {
                JourRetard::where("NumDossier", $NumDossier)->update([
                    "CompteProvision" => $compteProvisionUSD
                ]);
            }

            //MET A JOUR LA TABLE JOUR RETARD POUR RENSEIGNER LE COMPTE DE CREANCE LITIGIEUSE
            $checkCompteNumCompteCL = JourRetard::where("NumCompteCreanceLitigieuse", $compteCreanceLitigieuseUSD)->first();
            if (!$checkCompteNumCompteCL) {
                JourRetard::where("NumDossier", $NumDossier)->update([
                    "NumCompteCreanceLitigieuse" => $compteCreanceLitigieuseUSD
                ]);
            }
        }
        if ($provisionPourcentage == 5) { // SI C LA PREMIERE FOIS QUE LE COMPTE TOMBE EN RETARD 
            //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION
            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = "AT00" . $numOperation->id;
            /* DEBUT Constatation crédit en retard */
            //DEBITE LE COMPTE  39
            Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $dateSystem,
                "DateSaisie" => date("Y-m-d"),
                "TypeTransaction" => "D",
                "CodeMonnaie" => $devise,
                "CodeAgence" => $CodeAgence,
                "NumDossier" => "DOS00" . $numOperation->id,
                "NumDemande" => "V00" . $numOperation->id,
                "NumCompte" =>   $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                "NumComptecp" =>  $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                "Debit" =>  $SoldeCreditRestant - $capitalPaye,
                "Operant" =>  $Gestionnaire,
                "Debitfc" => $devise == 2 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) * ($tauxDuJour),
                "Debitusd" =>  $devise == 1 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) / ($tauxDuJour),
                "NomUtilisateur" => "AUTO",
                "Libelle" => "Imputation de " . $SoldeCreditRestant - $capitalPaye . "  dans la tranche de crédit en retard de 1 à 30 jrs dossier " . $NumDossier . " pour " . $capitalApayer . " impayé",
                "refCompteMembre" => $refCompteMembre,
            ]);

            //DEBITE SON COMPTE 39
            Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $dateSystem,
                "DateSaisie" => $dateSystem,
                "TypeTransaction" => "D",
                "CodeMonnaie" => $devise,
                "CodeAgence" => $CodeAgence,
                "NumCompte" =>   $devise == 2 ? $compteCreanceLitigieuseCDF : $compteCreanceLitigieuseUSD,
                "NumComptecp" => $NumCompteCreditCustomer,
                "Debit" =>  $SoldeCreditRestant - $capitalPaye,
                "Operant" =>  $Gestionnaire,
                "Debitfc" => $devise == 2 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) * ($tauxDuJour),
                "Debitusd" =>  $devise == 1 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) / ($tauxDuJour),
                "NomUtilisateur" => "AUTO",
                "Libelle" => "Imputation de " . $SoldeCreditRestant - $capitalPaye . "  dans la tranche de crédit en retard de 1 à 30 jrs dossier " . $NumDossier . " pour " . $capitalApayer . " impayé",
                "refCompteMembre" => $refCompteMembre,
            ]);

            CompteurTransaction::create([
                'fakevalue' => "0000",
            ]);
            $numOperation = [];
            $numOperation = CompteurTransaction::latest()->first();
            $NumTransaction = "AT00" . $numOperation->id;


            //CREDITE LE COMPTE CREDIT COMPTABLE
            Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $dateSystem,
                "DateSaisie" => $dateSystem,
                "TypeTransaction" => "C",
                "CodeMonnaie" => $devise,
                "CodeAgence" => $CodeAgence,
                "NumCompte" => $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                "NumComptecp" => $devise == 2 ? $compteCreanceLitigieuseCDF : $compteCreanceLitigieuseUSD,
                "Credit" =>  $devise == 1 ? $SoldeCreditRestant - $capitalPaye : $SoldeCreditRestant - $capitalPaye,
                "Operant" =>  $Gestionnaire,
                "Creditfc" =>  $devise == 2 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) * ($tauxDuJour),
                "Creditusd" => $devise == 1 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) / $tauxDuJour,
                "NomUtilisateur" => "AUTO",
                "Libelle" => "Imputation de " . $SoldeCreditRestant - $capitalPaye . "  dans la tranche de crédit en retard de 1 à 30 jrs dossier " . $NumDossier . " pour " . $capitalApayer . " impayé",
                "refCompteMembre" => $refCompteMembre,
            ]);

            //CREDITE LE COMPTE CREDIT DU CLIENT
            Transactions::create([
                "NumTransaction" => $NumTransaction,
                "DateTransaction" => $dateSystem,
                "DateSaisie" => $dateSystem,
                "TypeTransaction" => "C",
                "CodeMonnaie" => $devise,
                "CodeAgence" => $CodeAgence,
                "NumCompte" => $NumCompteCreditCustomer,
                "NumComptecp" => $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                "Credit" =>  $devise == 1 ? $SoldeCreditRestant - $capitalPaye : $SoldeCreditRestant - $capitalPaye,
                "Operant" =>  $Gestionnaire,
                "Creditfc" =>  $devise == 2 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) * ($tauxDuJour),
                "Creditusd" => $devise == 1 ? $SoldeCreditRestant - $capitalPaye : ($SoldeCreditRestant - $capitalPaye) / ($tauxDuJour),
                "NomUtilisateur" => "AUTO",
                "Libelle" => "Imputation de " . $SoldeCreditRestant - $capitalPaye . "  dans la tranche de crédit en retard de 1 à 30 jrs dossier " . $NumDossier . " pour " . $capitalApayer . " impayé",
                "refCompteMembre" => $refCompteMembre,
            ]);
            /* FIN Constatation crédit en retard */
        }


        /* DEBUT Constatation PROVISION */
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = "AT00" . $numOperation->id;

        //DEBITE 69 POUR DOTATION AUX PROVISION
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => $dateSystem,
            "TypeTransaction" => "D",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteDotationAuProvisionUSD,
            "NumComptecp" => $compteProvisionCDF,
            "Debit" =>  $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100,
            "Operant" =>  $Gestionnaire,
            "Debitfc" =>  $devise == 2 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 * ($tauxDuJour),
            "Debitusd" => $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 / ($tauxDuJour),
            "NomUtilisateur" => "AUTO",
            "Libelle" => ($provisionPourcentage == 5 ? "Provision" : "Complement provision")
                . " de " . $provisionTranche
                . " sur l'encours de " . $SoldeCreditRestant
                . " en retard de " . $provisionRang
                . " dossier " . $NumDossier
                . " pour " . $capitalApayer . " impayé",
            "refCompteMembre" => $refCompteMembre,
        ]);

        //FAIT LA PROVISION  CREDITE 38 COMPTABILITE
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => $dateSystem,
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 2 ? $this->compteProvisionCDF : $this->compteProvisionUSD,
            "NumComptecp" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteDotationAuProvisionUSD,
            "Credit" =>  $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100,
            "Operant" =>  $Gestionnaire,
            "Creditfc" =>  $devise == 2 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 * ($tauxDuJour),
            "Creditusd" => $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 / ($tauxDuJour),
            "NomUtilisateur" => "AUTO",
            "Libelle" => ($provisionPourcentage == 5 ? "Provision" : "Complement provision")
                . " de " . $provisionTranche
                . " sur l'encours de " . $SoldeCreditRestant
                . " en retard de " . $provisionRang
                . " dossier " . $NumDossier
                . " pour " . $capitalApayer . " impayé",
            "refCompteMembre" => $refCompteMembre,
            "refCompteMembre" => $refCompteMembre,
        ]);

        //FAIT LA PROVISION  CREDITE 38 DU CLIENT
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $dateSystem,
            "DateSaisie" => $dateSystem,
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 2 ? $compteProvisionCDF : $compteProvisionUSD,
            "NumComptecp" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteDotationAuProvisionUSD,
            "Credit" =>  $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100,
            "Operant" =>  $Gestionnaire,
            "Creditfc" =>  $devise == 2 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 * ($tauxDuJour),
            "Creditusd" => $devise == 1 ? ($SoldeCreditRestant) * $provisionPourcentage / 100 : ($SoldeCreditRestant) * $provisionPourcentage / 100 / ($tauxDuJour),
            "NomUtilisateur" => "AUTO",
            "Libelle" => ($provisionPourcentage == 5 ? "Provision" : "Complement provision")
                . " de " . $provisionTranche
                . " sur l'encours de " . $SoldeCreditRestant
                . " en retard de " . $provisionRang
                . " dossier " . $NumDossier
                . " pour " . $capitalApayer . " impayé",
            "refCompteMembre" => $refCompteMembre,
            "refCompteMembre" => $refCompteMembre,
        ]);


        /* FIN Constatation PROVISION */
    }
    //CETE FONCTION PERMET D'ANNUELER UN PROVISION POUR PASSER LA NOUVELLE 

    protected function annulProvision(
        $codeMonnaie,
        $CodeAgence,
        $refCompteMembre,
        $provisionTranche,
        $montantRetard,
        $tauxDuJour,
        $SoldeCreditRestant,
        $NumDossier,
        $ProvisionPourcentage,
        $ProvisionDuree,
        $Gestionnaire,
    ) {

        if ($provisionTranche == 1) {
            $montantProvision = $SoldeCreditRestant * 5 / 100;
        } else if ($provisionTranche == 2) {
            $montantProvision = $SoldeCreditRestant * 10 / 100;
        } else if ($provisionTranche == 3) {
            $montantProvision = $SoldeCreditRestant * 25 / 100;
        } else if ($provisionTranche == 4) {
            $montantProvision = $SoldeCreditRestant * 75 / 100;
        } else if ($provisionTranche == 5) {
            $montantProvision = $SoldeCreditRestant * 100 / 100;
        }

        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }
        if ($devise == 2) {

            if ($refCompteMembre < 10) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionCDF = "38010" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
            } else {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
            }
        } else if ($devise == 1) {

            if ($refCompteMembre < 10) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionUSD = "38000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
            } else {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
            }
        }
        //ANNULE L'ANCIENNE PROVISION 38
        CompteurTransaction::create([
            'fakevalue' => "0000",
        ]);
        $numOperation = [];
        $numOperation = CompteurTransaction::latest()->first();
        $NumTransaction = "AT00" . $numOperation->id;
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $this->dateSystem,
            "DateSaisie" => $this->dateSystem,
            "TypeTransaction" => "D",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 1 ? $compteProvisionUSD : $compteProvisionCDF,
            "NumComptecp" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteDotationAuProvisionUSD,
            "Debit" =>  $montantProvision,
            "Operant" =>  $Gestionnaire,
            "Debitfc" =>  $devise == 2 ? $montantProvision : $montantProvision * $tauxDuJour,
            "Debitusd" => $devise == 1 ? $montantProvision  : $montantProvision / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => "Reprise sur provision de " . $ProvisionPourcentage . " sur l'encours de " . $SoldeCreditRestant . "  en retard de " . $ProvisionDuree . " dossier " . $NumDossier . " pour " . $montantRetard . " impayé",
            "refCompteMembre" =>  $devise == 2 ? $compteProvisionCDF : $compteProvisionUSD,
        ]);

        //POUR LE COMPTE DE LA COMPTABILITE

        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $this->dateSystem,
            "DateSaisie" => $this->dateSystem,
            "TypeTransaction" => "D",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 1 ? $this->compteProvisionUSD : $this->compteProvisionCDF,
            "NumComptecp" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteDotationAuProvisionUSD,
            "Debit" =>  $montantProvision,
            "Operant" =>  $Gestionnaire,
            "Debitfc" =>  $devise == 2 ? $montantProvision : $montantProvision * $tauxDuJour,
            "Debitusd" => $devise == 1 ? $montantProvision  : $montantProvision / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => "Reprise sur provision de " . $ProvisionPourcentage . " sur l'encours de " . $SoldeCreditRestant . "  en retard de " . $ProvisionDuree . "  dossier " . $NumDossier . " pour " . $montantRetard . " impayé",
            "refCompteMembre" =>  $devise == 2 ? $compteProvisionCDF : $compteProvisionUSD,
        ]);

        //CREDIT UN COMPTE DE PRODUIT POUR REPRISE SUR PROVISION
        Transactions::create([
            "NumTransaction" => $NumTransaction,
            "DateTransaction" => $this->dateSystem,
            "DateSaisie" => $this->dateSystem,
            "TypeTransaction" => "C",
            "CodeMonnaie" => $devise,
            "CodeAgence" => $CodeAgence,
            "NumCompte" => $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
            "NumComptecp" => $devise == 2 ? $compteProvisionCDF : $compteProvisionUSD,
            "Credit" =>  $montantProvision,
            "Operant" =>  $Gestionnaire,
            "Creditfc" =>  $devise == 2 ? $montantProvision : $montantProvision * $tauxDuJour,
            "Creditusd" => $devise == 1 ? $montantProvision : $montantProvision / $tauxDuJour,
            "NomUtilisateur" => "AUTO",
            "Libelle" => "Reprise sur provision de " . $ProvisionPourcentage . " sur l'encours de " . $SoldeCreditRestant . " en retard de " . $ProvisionDuree . " dossier " . $NumDossier . " pour " . $montantRetard . " impayé",
            "refCompteMembre" => $devise == 2 ? $this->compteDotationAuProvisionCDF : $this->compteRepriseDeProvisionUSD,
        ]);
    }

    //CETTE FONCTION PERMET DE FAIRE UNE INSERTION DANS LA TABLE TRANSACTION POUR LE PAIEMENT DU CAPITAL 
    protected function insertInTransactionRepriseProvision(
        $capitalPaye,
        $codeMonnaie,
        $dateSystem,
        $CodeAgence,
        $tauxDuJour,
        $typeRemboursement,
        $compteEpargneCustomer,
        $trancheNumber,
        $dateTranche,
        $MontantAccorde,
        $NumDossier,
        $Gestionnaire,
    ) {
        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }

        $getCompteJourRetard = JourRetard::where("NumDossier", $NumDossier)->where("provision1", "!=", 0)->first();
        if ($getCompteJourRetard) {
            $compteProvisionCustomer = $getCompteJourRetard->CompteProvision;
            $compteCreanceLitigieuseCustomer = $getCompteJourRetard->NumCompteCreanceLitigieuse;
            $NumCompteCreditCustomer = $getCompteJourRetard->NumcompteCredit;
            // info("voici le num dossier". $NumDossier);
            if ($getCompteJourRetard->NbrJrRetard > 0) {
                $provisionMatirute = 0;
                if (
                    $getCompteJourRetard->provision1 == 1
                    and $getCompteJourRetard->provision2 == 0
                    and $getCompteJourRetard->provision3 == 0
                    and $getCompteJourRetard->provision4 == 0
                    and $getCompteJourRetard->provision5 == 0
                ) {
                    $provisionMatirute = 5;
                } else if (
                    $getCompteJourRetard->provision1 == 1
                    and $getCompteJourRetard->provision2 == 1
                    and $getCompteJourRetard->provision3 == 0
                    and $getCompteJourRetard->provision4 == 0
                    and $getCompteJourRetard->provision5 == 0
                ) {
                    $provisionMatirute = 10;
                } else if (
                    $getCompteJourRetard->provision1 == 1
                    and $getCompteJourRetard->provision2 == 1
                    and $getCompteJourRetard->provision3 == 1
                    and $getCompteJourRetard->provision4 == 0
                    and $getCompteJourRetard->provision5 == 0
                ) {
                    $provisionMatirute = 25;
                } else if (
                    $getCompteJourRetard->provision1 == 1
                    and $getCompteJourRetard->provision2 == 1
                    and $getCompteJourRetard->provision3 == 1
                    and $getCompteJourRetard->provision4 == 1
                    and $getCompteJourRetard->provision5 == 0
                ) {
                    $provisionMatirute = 75;
                } else if (
                    $getCompteJourRetard->provision1 == 1
                    and $getCompteJourRetard->provision2 == 1
                    and $getCompteJourRetard->provision3 == 1
                    and $getCompteJourRetard->provision4 == 1
                    and $getCompteJourRetard->provision5 == 1
                ) {
                    $provisionMatirute = 100;
                }
                //RECUPERE LA SOMME DU CREDIT EN RETARD
                // info("check1..." . $capitalPaye);
                if (round($capitalPaye, 2) > 0) {
                    // info("check2..." . $capitalPaye);
                    // info("maturité..." . $getCompteJourRetard->provision1);

                    if ($typeRemboursement == "partiel") {
                        //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION
                        CompteurTransaction::create([
                            'fakevalue' => "0000",
                        ]);
                        $numOperation = [];
                        $numOperation = CompteurTransaction::latest()->first();
                        $NumTransaction = "AT00" . $numOperation->id;
                        $montantReprise = $capitalPaye * $provisionMatirute / 100;
                        info("montantReprise :" . $montantReprise);
                        info("provisionMatirute :" . $provisionMatirute);
                        /* Remboursement en moitié ou en totalité 38 à 79 */
                        //DEBITE LE COMPTE  38  DE LA COMPTABILITE
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => date("Y-m-d"),
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumDossier" => "DOS00" . $numOperation->id,
                            "NumDemande" => "V00" . $numOperation->id,
                            "NumCompte" =>  $devise == 2 ? $this->compteProvisionCDF : $this->compteProvisionUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "Debit" => $montantReprise,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $montantReprise : $montantReprise * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $montantReprise : $montantReprise / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision dossier " . $NumDossier,
                        ]);

                        //DEBITE LE COMPTE  38 DU CLIENT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => date("Y-m-d"),
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumDossier" => "DOS00" . $numOperation->id,
                            "NumDemande" => "V00" . $numOperation->id,
                            "NumCompte" =>   $compteProvisionCustomer,
                            "NumComptecp" => $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "Debit" => $montantReprise,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $montantReprise : $montantReprise * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $montantReprise : $montantReprise / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision dossier " . $NumDossier,
                        ]);

                        //CREDITE LE COMPTE 79
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteProvisionCDF : $this->compteProvisionUSD,
                            "Credit" => $montantReprise,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $montantReprise : $montantReprise * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $montantReprise : $montantReprise / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision dossier " . $NumDossier,
                        ]);

                        CompteurTransaction::create([
                            'fakevalue' => "0000",
                        ]);
                        $numOperation = [];
                        $numOperation = CompteurTransaction::latest()->first();
                        $NumTransaction = "AT00" . $numOperation->id;

                        //CREDITE 39 DU MONTANT PARTIEL REMBOURSEMENT

                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                            "NumComptecp" => $compteEpargneCustomer,
                            "Credit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement partiel de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);

                        //CREDITE 39 DU CLIENT MONTANT PARTIEL REMBOURSEMENT

                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" => $compteCreanceLitigieuseCustomer,
                            "NumComptecp" => $compteEpargneCustomer,
                            "Credit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement partiel de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);
                        //DEBITE LE COMPTE DU CLIENT DE CE MONTANT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" => $compteEpargneCustomer,
                            "NumComptecp" => $compteCreanceLitigieuseCustomer,
                            "Debit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement partiel capital de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);

                        //CREDITE LE COMPTE LE COMPTE CREDIT DU CLIENT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" => $NumCompteCreditCustomer,
                            "NumComptecp" => $compteCreanceLitigieuseCustomer,
                            "Credit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement partiel capital de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);
                    } else if ($typeRemboursement == "complet") {

                        //SI LE MONTANT A REMBOURSER COUVRE LE MONTANT EN RETARD
                        $checkCompteExist = Transactions::where("NumCompte", $compteProvisionCustomer)->first();
                        if (!$checkCompteExist) {
                            Transactions::create([
                                "DateTransaction" => $this->dateSystem,
                                "CodeMonnaie" => $devise == 1 ? 1 : 2,
                                "NumCompte" => $compteProvisionCustomer,
                                "Debit"  => 0,
                                "Debit$"  => 0,
                                "Debitfc" => 0,
                            ]);
                        }
                        $soldeMembreProv = Transactions::select(
                            DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                            DB::raw("SUM(Creditusd)-SUM(Debitusd) as soldeMembreUSD"),
                        )->where("NumCompte", '=', $compteProvisionCustomer)
                            ->groupBy("NumCompte")
                            ->first();

                        if ($devise == 1) {
                            $soldeProvision = $soldeMembreProv->soldeMembreUSD;
                        } else {
                            $soldeProvision = $soldeMembreProv->soldeMembreCDF;
                        }

                        //GENERE LE NUMERO AUTOMATIQUE DE L'OPERATION
                        CompteurTransaction::create([
                            'fakevalue' => "0000",
                        ]);
                        $numOperation = [];
                        $numOperation = CompteurTransaction::latest()->first();
                        $NumTransaction = "AT00" . $numOperation->id;

                        /* Remboursement en moitié ou en totalité 38 à 79 */
                        //DEBITE LE COMPTE  38  DE LA COMPTABILITE
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => date("Y-m-d"),
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumDossier" => "DOS00" . $numOperation->id,
                            "NumDemande" => "V00" . $numOperation->id,
                            "NumCompte" =>  $devise == 2 ? $this->compteProvisionCDF : $this->compteProvisionUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "Debit" => $soldeProvision,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $soldeProvision : $soldeProvision * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $soldeProvision : $soldeProvision / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision crédit sain dossier " . $NumDossier,

                        ]);

                        //DEBITE LE COMPTE  38 DU CLIENT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => date("Y-m-d"),
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumDossier" => "DOS00" . $numOperation->id,
                            "NumDemande" => "V00" . $numOperation->id,
                            "NumCompte" =>   $compteProvisionCustomer,
                            "NumComptecp" => $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "Debit" => $soldeProvision,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $soldeProvision : $soldeProvision * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $soldeProvision : $soldeProvision / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision crédit sain dossier " . $NumDossier,
                        ]);

                        //CREDITE LE COMPTE 79
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteRepriseDeProvisionCDF : $this->compteRepriseDeProvisionUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteProvisionCDF : $this->compteProvisionUSD,
                            "Credit" => $soldeProvision,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $soldeProvision : $soldeProvision * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $soldeProvision : $soldeProvision / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Reprise sur provision crédit sain dossier " . $NumDossier,
                        ]);

                        CompteurTransaction::create([
                            'fakevalue' => "0000",
                        ]);
                        $numOperation = [];
                        $numOperation = CompteurTransaction::latest()->first();
                        $NumTransaction = "AT00" . $numOperation->id;
                        //CREDITE 39 DU MONTANT  REMBOURSE
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                            "NumComptecp" => $compteEpargneCustomer,
                            "Credit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement  de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);

                        //DEBITE LE COMPTE DU CLIENT DE CE MONTANT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" => $compteEpargneCustomer,
                            "NumComptecp" => $compteCreanceLitigieuseCustomer,
                            "Debit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);

                        //CREDITE LE COMPTE LE COMPTE CREDIT DU CLIENT
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" => $NumCompteCreditCustomer,
                            "NumComptecp" => $compteCreanceLitigieuseCustomer,
                            "Credit" => $capitalPaye,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $capitalPaye : $capitalPaye * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $capitalPaye : $capitalPaye / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Remboursement de " . $capitalPaye . ($devise == 1 ? "USD " : "CDF ") . $trancheNumber . " e tranche tombée le " . $dateTranche . " sur votre crédit de " . $MontantAccorde . " dossier " . $NumDossier,
                        ]);

                        //FAIT L'IMPUTATION  POUR REMETTRE LE CREDIT DANS LE CREDIT SAIN
                        //SI LE MONTANT A REMBOURSER COUVRE LE MONTANT EN RETARD
                        $checkCompteExist = Transactions::where("NumCompte", $compteCreanceLitigieuseCustomer)->first();
                        if (!$checkCompteExist) {
                            if (!$checkCompteExist) {
                                Transactions::create([
                                    "DateTransaction" => $this->dateSystem,
                                    "CodeMonnaie" => $devise == 1 ? 1 : 2,
                                    "NumCompte" => $compteCreanceLitigieuseCustomer,
                                    "Debit"  => 0,
                                    "Debit$"  => 0,
                                    "Debitfc" => 0,
                                ]);
                            }
                        }
                        $soldeMembreProv = Transactions::select(
                            DB::raw("SUM(Debitfc)-SUM(Creditfc) as soldeMembreCDF"),
                            DB::raw("SUM(Debitusd)-SUM(Creditusd) as soldeMembreUSD"),
                        )->where("NumCompte", '=', $compteCreanceLitigieuseCustomer)
                            ->groupBy("NumCompte")
                            ->first();

                        if ($devise == 1) {
                            $soldeCreanceL = $soldeMembreProv->soldeMembreUSD;
                        } else {
                            $soldeCreanceL = $soldeMembreProv->soldeMembreCDF;
                        }


                        CompteurTransaction::create([
                            'fakevalue' => "0000",
                        ]);
                        $numOperation = [];
                        $numOperation = CompteurTransaction::latest()->first();
                        $NumTransaction = "AT00" . $numOperation->id;
                        //DEBITE LE COMPTE CREDIT COMPTABILITE 
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                            "Debit" => $soldeCreanceL,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $soldeCreanceL : $soldeCreanceL * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $soldeCreanceL : $soldeCreanceL / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Imputation de " . $soldeCreanceL . ($devise == 1 ? "USD" : "CDF") . " dans la tranche des crédits sain dossier " . $NumDossier,
                        ]);

                        //DEBITE LE COMPTE CREDIT DU CLIENT

                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "D",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $NumCompteCreditCustomer,
                            "NumComptecp" => $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                            "Debit" => $soldeCreanceL,
                            "Operant" =>  $Gestionnaire,
                            "Debitfc" => $devise == 2 ? $soldeCreanceL : $soldeCreanceL * ($tauxDuJour),
                            "Debitusd" =>  $devise == 1 ? $soldeCreanceL : $soldeCreanceL / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Imputation de " . $soldeCreanceL . ($devise == 1 ? "USD" : "CDF") . " dans la tranche des crédits sain dossier " . $NumDossier,
                        ]);



                        //CREDITE 39 DE LA COMPTABILITE
                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $devise == 2 ? $this->compteCreanceLitigeuseCDF : $this->compteCreanceLitigeuseUSD,
                            "NumComptecp" => $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                            "Credit" => $soldeCreanceL,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $soldeCreanceL : $soldeCreanceL * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $soldeCreanceL : $soldeCreanceL / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Imputation de " . $soldeCreanceL . ($devise == 1 ? "USD" : "CDF") . " dans la tranche des crédits sain dossier " . $NumDossier,
                        ]);

                        //CREDITE 39 CLIENT

                        Transactions::create([
                            "NumTransaction" => $NumTransaction,
                            "DateTransaction" => $dateSystem,
                            "DateSaisie" => $dateSystem,
                            "TypeTransaction" => "C",
                            "CodeMonnaie" => $devise,
                            "CodeAgence" => $CodeAgence,
                            "NumCompte" =>   $compteCreanceLitigieuseCustomer,
                            "NumComptecp" => $devise == 2 ? $this->compteCreditAuxMembreCDF : $this->compteCreditAuxMembreUSD,
                            "Credit" => $soldeCreanceL,
                            "Operant" =>  $Gestionnaire,
                            "Creditfc" => $devise == 2 ? $soldeCreanceL : $soldeCreanceL * ($tauxDuJour),
                            "Creditusd" =>  $devise == 1 ? $soldeCreanceL : $soldeCreanceL / ($tauxDuJour),
                            "NomUtilisateur" => "AUTO",
                            "Libelle" => "Imputation de " . $soldeCreanceL . ($devise == 1 ? "USD" : "CDF") . " dans la tranche des crédits sain dossier " . $NumDossier,
                        ]);

                        //ANNULE JOUR RETARD 

                        $this->AnnuleJourRetard($NumDossier);
                    }
                }
            }
        }
    }






    //CETE FONCTION VA PERMETTRE A SELECTIONNEE LE SOLDE DU MEMBRE
    public function checkSoldeMembre($codeMonnaie, $NumCompte)
    {
        // Si le montant manuel est défini et supérieur à 0, on l'utilise
        if (!is_null($this->montantRemboursementManuel) && $this->montantRemboursementManuel > 0 && !$this->remboursAnticipe) {
            return $this->montantRemboursementManuel;
        }
        // dd($this->montantRemboursementManuel);

        $soldeMembre = Transactions::select(
            DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
            DB::raw("SUM(Creditusd)-SUM(Debitusd) as soldeMembreUSD"),
        )->where("NumCompte", '=', $NumCompte)
            ->groupBy("NumCompte")
            ->first();
        if ($codeMonnaie == 1) {
            $solde = $soldeMembre->soldeMembreUSD;
            return $solde;
        } else {
            $solde = $soldeMembre->soldeMembreCDF;
            return $solde;
        }
    }

    //PERMET DE VERIFIER SI LE CLIENT N'EST PAS EN RETARD POUR LA TRANCHE EN COURS
    public function checkRetardMembre($NumDossier, $dateTombeeTranche)
    {
        $data = Echeancier::where("NumDossier", $NumDossier)
            ->where("DateTranch", $dateTombeeTranche)->first();
        if ($data->RetardPayement == 1) {
            return true;
        } else {
            return false;
        }
    }


    //CETTE FONCTION PERMET D'ENREGISTRER DANS LA TABLE REMBOURSEMENT POUR SIGNALE LE PAIEMENT 
    public function RenseignePayement(
        $ReferenceEch,
        $NumCompteEpargne,
        $NumCompteCredit,
        $NumDossier,
        $RefTypeCredit,
        $NomCompte,
        $DateTranch,
        $InteretAmmorti,
        $CapAmmorti,
        $CodeAgence,
        $numAdherant
    ) {

        Remboursementcredit::create([
            "RefEcheance" => $ReferenceEch,
            "NumCompte" => $NumCompteEpargne,
            "NumCompteCredit" => $NumCompteCredit,
            "NumDossie" => $NumDossier,
            "RefTypCredit" => $RefTypeCredit,
            "NomCompte" => $NomCompte,
            "DateTranche" => $DateTranch,
            "InteretAmmorti" => $InteretAmmorti,
            "InteretPaye" => $InteretAmmorti,
            "CapitalAmmortie" => $CapAmmorti,
            "CapitalPaye"  =>  $CapAmmorti,
            "CodeGuichet" => $CodeAgence,
            "NumAdherent" => $numAdherant,
        ]);
    }


    //CETTE FONCTION PERMET DE METTRE A JOUR LA TABLE REMBOURSEMENT POUR UN PAIEMENT QUI C'ETAIT FAIT EN MOTIE
    public function RenseignePayementPourPaiementQuiEtaitEnMoitieInteret(
        $ReferenceEch,
        $NumCompteEpargne,
        $NumCompteCredit,
        $NumDossier,
        $RefTypeCredit,
        $NomCompte,
        $DateTranch,
        $InteretAmmorti,
        $CodeAgence,
        $numAdherant
    ) {

        Remboursementcredit::where("RefEcheance", $ReferenceEch)->update([
            "RefEcheance" => $ReferenceEch,
            "NumCompte" => $NumCompteEpargne,
            "NumCompteCredit" => $NumCompteCredit,
            "NumDossie" => $NumDossier,
            "RefTypCredit" => $RefTypeCredit,
            "NomCompte" => $NomCompte,
            "DateTranche" => $DateTranch,
            "InteretAmmorti" => $InteretAmmorti,
            "InteretPaye" => $InteretAmmorti,
            "CodeGuichet" => $CodeAgence,
            "NumAdherent" => $numAdherant,
        ]);
    }



    public function RenseignePayementPourPaiementQuiEtaitEnMoitieCapital(
        $ReferenceEch,
        $NumCompteEpargne,
        $NumCompteCredit,
        $NumDossier,
        $RefTypeCredit,
        $NomCompte,
        $DateTranch,
        $CapAmmorti,
        $CodeAgence,
        $numAdherant
    ) {

        Remboursementcredit::where("RefEcheance", $ReferenceEch)->update([
            "RefEcheance" => $ReferenceEch,
            "NumCompte" => $NumCompteEpargne,
            "NumCompteCredit" => $NumCompteCredit,
            "NumDossie" => $NumDossier,
            "RefTypCredit" => $RefTypeCredit,
            "NomCompte" => $NomCompte,
            "DateTranche" => $DateTranch,
            "CapitalAmmortie" => $CapAmmorti,
            "CapitalPaye"  =>  $CapAmmorti,
            "CodeGuichet" => $CodeAgence,
            "NumAdherent" => $numAdherant,
        ]);
    }


    //CETTE FONCTION PERMET D'ENREGISTRER DANS LA TABLE REMBOURSEMENT POUR SIGNALE QUE LE CREDIT VIENT DE TOMBER EN RETARD
    public function RenseignePayementEnRetard(
        $ReferenceEch,
        $NumCompteEpargne,
        $NumCompteCredit,
        $NumDossier,
        $RefTypeCredit,
        $NomCompte,
        $DateTranch,
        $InteretAmmorti,
        $CapAmmorti,
        $CodeAgence,
        $numAdherant
    ) {
        $checkRowExist = Remboursementcredit::where("RefEcheance", $ReferenceEch)->first();
        if (!$checkRowExist) {
            Remboursementcredit::create([
                "RefEcheance" => $ReferenceEch,
                "NumCompte" => $NumCompteEpargne,
                "NumCompteCredit" => $NumCompteCredit,
                "NumDossie" => $NumDossier,
                "RefTypCredit" => $RefTypeCredit,
                "NomCompte" => $NomCompte,
                "DateTranche" => $DateTranch,
                "InteretAmmorti" => $InteretAmmorti,
                // "InteretPaye" => $InteretAmmorti,
                "CapitalAmmortie" => $CapAmmorti,
                // "CapitalPaye"  =>  $CapAmmorti,
                "CodeGuichet" => $CodeAgence,
                "NumAdherent" => $numAdherant,
            ]);
        }
    }


    //CETTE FONCTION PERMET DE CONSTATER LE REMBOURSEMENT ET CLOTURER LA TRANCHE

    private function ClotureTranche($ReferenceEch)
    {
        Echeancier::where("echeanciers.ReferenceEch", "=", $ReferenceEch)
            ->update([
                "statutPayement" => "1",
                "posted" => "1",
                "RetardPayement" => 0
            ]);
    }


    //PERMET DE CONSTATER QUE LE CREDIT VIENT D'ETRE EN RETARD 


    private function constateRetard($ReferenceEch)
    {
        Echeancier::where("echeanciers.ReferenceEch", "=", $ReferenceEch)
            ->update([
                "RetardPayement" => "1",
            ]);
    }

    //PERMET D'ANNULLER LES JOUR DE RETARD
    public function AnnuleJourRetard($NumDossier)
    {
        JourRetard::where("NumDossier", $NumDossier)->update([
            "NbrJrRetard" => 0,
        ]);
    }

    //CETTE FONCTION PERMET D'INCREMENTER LE JOURS DE RETARD
    private function IncrementerJourRetard($NumDossier, $dateSystem, $NumCompteEpargne, $NumCompteCredit)
    {
        try {
            $record = JourRetard::where("NumDossier", $NumDossier)->first();
            $getMonnaie = Portefeuille::where("NumDossier", $NumDossier)->first();
            $CodeMonnaie = $getMonnaie->CodeMonnaie;
            $refCompteMembre = $getMonnaie->numAdherant;
            if ($record) {
                // Vérifie si la DateRetard est différente de la date actuelle
                if ($record->DateRetard !== $dateSystem) {
                    // Incrémente uniquement si la date est différente
                    $record->update([
                        "NumcompteEpargne" => $NumCompteEpargne,
                        "NumcompteCredit" => $NumCompteCredit,
                        "NbrJrRetard" => $record->NbrJrRetard + 1,
                        "DateRetard" => $dateSystem,
                    ]);
                }
            } else {

                if ($CodeMonnaie == "USD") {
                    $devise = 1; //USD
                } else if ($CodeMonnaie == "CDF") {
                    $devise = 2; //CDF
                }

                //info("info! " . $SoldeCreditRestant);

                //CREATE ACCOUNT LOGIQUE

                $compteCreanceLitigieuseCDF = "";
                $compteProvisionCDF = "";
                $compteCreanceLitigieuseUSD = "";
                $compteProvisionUSD = "";

                if ($devise == 2) {
                    if ($refCompteMembre < 10) {
                        $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
                    } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                        $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
                    } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                        $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "3901000" . $refCompteMembre . "202";
                    } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                        $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "390100" . $refCompteMembre . "202";
                    } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                        $compteProvisionCDF = "38010" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "39010" . $refCompteMembre . "202";
                    } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                        $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
                    } else {
                        $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                        $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
                    }
                } else if ($devise == 1) {

                    if ($refCompteMembre < 10) {
                        $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
                    } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                        $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
                    } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                        $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "3900000" . $refCompteMembre . "201";
                    } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                        $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "390000" . $refCompteMembre . "201";
                    } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                        $compteProvisionUSD = "38000" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "39000" . $refCompteMembre . "201";
                    } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                        $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
                    } else {
                        $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                        $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
                    }
                }
                $dateMinusOneDay = Carbon::parse($dateSystem)->subDay();
                $dateMinusOneday = $dateMinusOneDay->toDateString();
                // Crée un nouvel enregistrement si aucun n'existe
                JourRetard::create([
                    "NumcompteEpargne" => $NumCompteEpargne,
                    "NumcompteCredit" => $NumCompteCredit,
                    "CompteProvision" => $devise == 2 ? $compteProvisionCDF : $compteProvisionUSD,
                    "NumCompteCreanceLitigieuse" => $devise == 2 ? $compteCreanceLitigieuseCDF : $compteCreanceLitigieuseUSD,
                    "NumDossier" => $NumDossier,
                    "NbrJrRetard" => 1,
                    "DateRetard" => $dateMinusOneday,
                    //"provision1" => 1
                ]);


                //VERIFIE SI LE Compte CREDIT EXISTE SINON LE CREE
                $checkIfAccountExist = Comptes::where("NumCompte", $NumCompteCredit)->first();
                if (!$checkIfAccountExist) {
                    Comptes::create([
                        'CodeAgence' => $getMonnaie->CodeAgence,
                        'NumCompte' => $NumCompteCredit,
                        'NomCompte' => $getMonnaie->NomCompte,
                        'RefTypeCompte' => "3",
                        'RefCadre' => "32",
                        'RefGroupe' =>  "320",
                        'RefSousGroupe' => $devise == 2 ? "3201" : "3200",
                        'CodeMonnaie' => $devise == 2 ?  2 : 1,
                        'NumAdherant' => $refCompteMembre,
                    ]);
                }
            }
        } catch (\Illuminate\Database\QueryException $e) {
            // Gestion de l'exception
            dd($e->getMessage());
        }
    }


    //PERMET DE RENSEIGNER LA CLOTURE POUR TOUT LE SYSTEME
    // public function clotureSysteme($dateSystem)
    // {
    //     $rowExist = t_cloture::latest()->first();
    //     if ($rowExist->date_cloture !== $dateSystem) {
    //         t_cloture::create([
    //             "cloture_state" => 1,
    //             "date_cloture" => $dateSystem
    //         ]);
    //     }
    // }



    public function RemboursementManuel(Request $request)
    {

        //VERIFIE SI LE CREDIT N'EST PAS EN RETARD

        $checkRetard = JourRetard::where("NumDossier", $this->numDossier)->where("NbrJrRetard", ">", 0)->first();

        if (!$checkRetard) {
            $data = Portefeuille::where("NumDossier", $this->numDossier)->first();
            $CodeMonnaie = $data->CodeMonnaie;
            $NumCompteEpargne = $data->NumCompteEpargne;

            // Passer les données directement à la méthode checkSoldeMembre
            $this->checkSoldeMembre($CodeMonnaie, $NumCompteEpargne);

            $soldeMembreCompteEpargn = Transactions::select(
                DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                DB::raw("SUM(Creditusd)-SUM(Debitusd) as soldeMembreUSD"),
            )->where("NumCompte", '=', $NumCompteEpargne)
                ->groupBy("NumCompte")
                ->first();
            if ($CodeMonnaie == "USD") {
                $soldeCE = $soldeMembreCompteEpargn->soldeMembreUSD;
            } else {
                $soldeCE = $soldeMembreCompteEpargn->soldeMembreCDF;
            }
            info("solde compte" . $soldeCE);
            if (!is_null(($this->montantRemboursementManuel) && $this->montantRemboursementManuel > 0) or ($this->remboursAnticipe == true)) {
                if ($soldeCE > 0 and $soldeCE >=  $this->montantRemboursementManuel) {
                    info("Remboursement manuel en cours...");
                    $clotureJournee = new ClotureJourneeCopy($request);
                    $clotureJournee->execute();
                    return response()->json([
                        'status' => 1,
                        'msg' => 'Remboursement manuel traité avec succès',
                    ]);
                } else {
                    return response()->json([
                        'status' => 0,
                        'msg' => 'Le solde du compte est insuffisant le solde est de : ' .  ($soldeCE . $CodeMonnaie == "USD" ? " USD" : " CDF"),
                    ]);
                }
            } else {
                return response()->json([
                    'status' => 0,
                    'msg' => 'Certaines informations requises ne sont pas rensignées!',
                ]);
            }
        } else {
            return response()->json([
                'status' => 0,
                'msg' => "Le remboursement manuel n'est pas autorisé pour les crédits en retard",
            ]);
        }
    }


    //CREATE ACCOUNT LOGIC
    public function createAccountLogic(
        $refCompteMembre,
        $codeMonnaie,
        $CodeAgence,
        $NomCompte,
        $NumCompteCreditCustomer
    ) {
        if ($codeMonnaie == "USD") {
            $devise = 1; //USD
        } else if ($codeMonnaie == "CDF") {
            $devise = 2; //CDF
        }

        //info("info! " . $SoldeCreditRestant);

        //CREATE ACCOUNT LOGIQUE

        $compteCreanceLitigieuseCDF = "";
        $compteProvisionCDF = "";
        $compteCreanceLitigieuseUSD = "";
        $compteProvisionUSD = "";

        if ($devise == 2) {
            if ($refCompteMembre < 10) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionCDF = "38010000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901000" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionCDF = "3801000" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "390100" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionCDF = "38010" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "39010" . $refCompteMembre . "202";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
            } else {
                $compteProvisionCDF = "3801" . $refCompteMembre . "202";
                $compteCreanceLitigieuseCDF = "3901" . $refCompteMembre . "202";
            }


            $checkCompteProvision = Comptes::where("NumCompte", $compteProvisionCDF)->first();
            if (!$checkCompteProvision && $compteProvisionCDF !== null && $compteProvisionCDF !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteProvisionCDF,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "38",
                    'RefGroupe' => "380",
                    'RefSousGroupe' => "3801",
                    'CodeMonnaie' => 2,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }

            //VERIFIE SI COMPTE CREDIT DU CLIENT EXISTE SINON LE CREE 
            $checkCompteCreditCustomer = Comptes::where("NumCompte", $NumCompteCreditCustomer)->first();
            if (!$checkCompteCreditCustomer) {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $NumCompteCreditCustomer,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "32",
                    'RefGroupe' => "320",
                    'RefSousGroupe' => "3201",
                    'CodeMonnaie' =>  2,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }
            //ON CREE LE COMPTE CREANCE LITIGIEUSE
            //verifie d'abord si c comptes créance litigieuse n'existe déjà pas
            $checkCompteCL = Comptes::where("NumCompte", $compteCreanceLitigieuseCDF)->first();
            if (!$checkCompteCL && $compteCreanceLitigieuseCDF !== null && $compteCreanceLitigieuseCDF !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteCreanceLitigieuseCDF,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "39",
                    'RefGroupe' => "390",
                    'RefSousGroupe' => "3901",
                    'CodeMonnaie' => 2,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }
        } else if ($devise == 1) {

            if ($refCompteMembre < 10) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10 && $refCompteMembre < 100) {
                $compteProvisionUSD = "38000000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100 && $refCompteMembre < 1000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 1000 && $refCompteMembre < 10000) {
                $compteProvisionUSD = "3800000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "390000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 10000 && $refCompteMembre < 100000) {
                $compteProvisionUSD = "38000" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "39000" . $refCompteMembre . "201";
            } else if ($refCompteMembre >= 100000 && $refCompteMembre < 1000000) {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
            } else {
                $compteProvisionUSD = "3800" . $refCompteMembre . "201";
                $compteCreanceLitigieuseUSD = "3900" . $refCompteMembre . "201";
            }


            $checkCompteProvision = Comptes::where("NumCompte", $compteProvisionUSD)->first();
            if (!$checkCompteProvision && $compteProvisionUSD !== null && $compteProvisionUSD !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteProvisionUSD,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "38",
                    'RefGroupe' => "380",
                    'RefSousGroupe' => "3800",
                    'CodeMonnaie' => 1,
                    'NumAdherant' => $refCompteMembre,

                ]);
            }

            //ON CREE LE COMPTE CREANCE LITIGIEUSE
            //verifie d'abord si c comptes créance litigieuse n'existe déjà pas
            $checkCompteCL = Comptes::where("NumCompte", $compteCreanceLitigieuseUSD)->first();
            if (!$checkCompteCL && $compteCreanceLitigieuseUSD !== null && $compteCreanceLitigieuseUSD !== '') {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $compteCreanceLitigieuseUSD,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "39",
                    'RefGroupe' => "390",
                    'RefSousGroupe' => "3900",
                    'CodeMonnaie' => 1,
                    'NumAdherant' => $refCompteMembre,

                ]);
            }

            //VERIFIE SI COMPTE CREDIT DU CLIENT EXISTE SINON LE CREE 
            $checkCompteCreditCustomer = Comptes::where("NumCompte", $NumCompteCreditCustomer)->first();
            if (!$checkCompteCreditCustomer) {
                Comptes::create([
                    'CodeAgence' => $CodeAgence,
                    'NumCompte' => $NumCompteCreditCustomer,
                    'NomCompte' => $NomCompte,
                    'RefTypeCompte' => "3",
                    'RefCadre' => "32",
                    'RefGroupe' => "320",
                    'RefSousGroupe' => "3200",
                    'CodeMonnaie' =>  1,
                    'NumAdherant' => $refCompteMembre,
                ]);
            }
        }
    }








    //CETE FONCTION PERMET DE DIMPLIQUER UNE OPERATION POUR INCREMENTER OU DECREMENTER LE RESULTAT A CHAQUE FOIS QU'UN COMPTE DE RESULTAT EST TOUCHE
    public function CheckTransactionStatus()
    {
        $numcompte = "";
        // Récupérer la dernière ligne insérée dans la table transactions
        $lastTransaction = Transactions::join('comptes', 'transactions.NumCompte', '=', 'comptes.NumCompte')
            ->whereBetween('comptes.RefTypeCompte', [6, 7])
            ->orderBy('transactions.RefTransaction', 'desc')
            ->select('transactions.*') // Select only the columns from transactions
            ->first();
        if ($lastTransaction->CodeMonnaie == 2) {
            $numcompte = "871";
        } else {
            $numcompte = "870";
        }
        // Vérifier si une transaction a été trouvée
        if ($lastTransaction) {
            // Récupérer le compte associé
            $account = Comptes::where('NumCompte', $lastTransaction->NumCompte)->first();

            // Log fetched account data
            Log::info('Fetched account data', ['account' => $account]);

            // Vérifier si le compte existe et que RefTypeCompte est 6 ou 7
            if ($account && in_array($account->RefTypeCompte, [6, 7])) {
                Log::info('Account exists and RefTypeCompte is in [6, 7]', ['RefTypeCompte' => $account->RefTypeCompte]);

                // Répliquer la transaction sans l'ID pour le premier compte
                $newTransaction = $lastTransaction->replicate(['RefTransaction']); // Ne pas répliquer l'ID
                $newTransaction->NumCompte = $numcompte; // S'assurer que c'est le bon format pour NumCompte

                // Appliquer la logique pour CodeMonnaie
                if ($lastTransaction->CodeMonnaie == 1) {
                    $newTransaction->Debitusd = $lastTransaction->Debitusd;
                    $newTransaction->Creditusd = $lastTransaction->Creditusd;
                } elseif ($lastTransaction->CodeMonnaie == 2) {
                    $newTransaction->Debitfc = $lastTransaction->Debitfc;
                    $newTransaction->Creditfc = $lastTransaction->Creditfc;
                }

                // Sauvegarder la nouvelle transaction
                $newTransaction->save();

                Log::info('Transaction duplicated successfully', ['transaction_id' => $newTransaction->id]);
                // return 'Transaction duplicated successfully.';
                //$this->CheckTransactionStatus(871, 851);
            } else {
                Log::error('Account not found or RefTypeCompte not in [6, 7]', ['transaction_id' => $lastTransaction->id, 'NumCompte' => $lastTransaction->NumCompte]);
                return 'Account not found or RefTypeCompte not in [6, 7].';
            }
        } else {
            Log::error('No transaction found');
            return 'No transaction found.';
        }
    }
}
