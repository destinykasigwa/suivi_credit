<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Comptes;
use Barryvdh\DomPDF\Facade\Pdf; // Utilisation de la façade Pdf
use App\Models\Delestages;
use App\Models\Echeancier;
use App\Models\JourRetard;
use App\Models\BilletageCDF;
use App\Models\BilletageUSD;
use App\Models\CompanyModel;
use App\Models\Portefeuille;
use App\Models\Transactions;
use Illuminate\Http\Request;
use App\Services\ReportService;
use App\Models\TauxEtDateSystem;
use App\Models\BilletageAppro_cdf;
use App\Models\BilletageAppro_usd;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;

class ReportsController extends Controller
{
    //
    protected $comptePretAuMembreCDF;
    protected $comptePretAuMembreUSD;
    protected  $compteRetardCDF;
    protected   $compteRetardUSD;
    protected $reportService;
    public function __construct(ReportService $reportService)
    {

        $this->middleware("auth");
        $this->comptePretAuMembreCDF = "3210000000202";
        $this->comptePretAuMembreUSD = "3210000000201";
        $this->compteRetardCDF = "3901000000202";
        $this->compteRetardUSD = "3900000000201";
        $this->reportService = $reportService;
    }
    public function getReportHeaderSection()
    {
        $data = CompanyModel::first();
        return response()->json(["status" => 1, "data" => $data]);
    }

    //GET JOURNAL HOME PAGE 

    public function getJournalHomePage()
    {
        return view("eco.pages.journal");
    }


    //GET REPERTOIRE HOME PAGE 
    public function getRepertoireHomePage()
    {
        return view("eco.pages.repertoire");
    }
    //GET DEFAULT DATE
    //RECUPERE LES DATES PAR DEFAUT   
    public function getDefaultDate()
    {
        //   $date  = date("Y-m-d");
        //   $NewDate1=date('d-m-Y', strtotime($date.' - 1 DAY'));
        $NewDate1 = date("Y-m-d");
        $NewDate2 = date("Y-m-d");
        return response()->json(["status" => 1, "dateDebut" => $NewDate1, "dateFin" => $NewDate2]);
    }

    //GET JOURNAL DROP MENU
    public function getJournalDropMenu()
    {
        $data = DB::select("SELECT * FROM type_journal ORDER BY id");
        $users = User::get();
        return response()->json(["status" => 1, "data" => $data, "users" => $users]);
    }
    //GET SEARCHED JOURNAL

    public function getSearchedJournal(Request $request)
    {
        $checkboxValues = $request->AutresCriteres;
        // $userCheckbox = $checkboxValues['userCheckbox'];
        $SuspensTransactions = $checkboxValues['SuspensTransactions'];
        $givenCurrency = $checkboxValues['givenCurrency'];
        $GivenJournal = $checkboxValues['GivenJournal'];
        if (isset($request->UserName) and $SuspensTransactions == false) {
            $check_dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2 AND t1.NomUtilisateur = "' . $request->UserName . '"');
            $check_dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1 AND t1.NomUtilisateur = "' . $request->UserName . '"');

            if (count($check_dataCDF) != 0 or count($check_dataUSD) != 0) {

                $dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2 AND t1.NomUtilisateur = "' . $request->UserName . '"');
                $dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1 AND t1.NomUtilisateur = "' . $request->UserName . '"');

                $totUSD = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                    SELECT DISTINCT 
                        t1.NumTransaction, 
                        t1.DateTransaction, 
                        t1.CodeMonnaie, 
                        t1.NumCompte, 
                        t1.NumComptecp, 
                        t1.Debitfc, 
                        t1.Debitusd, 
                        t1.Creditfc, 
                        t1.Creditusd
                    FROM transactions t1
                    JOIN transactions t2 
                        ON t1.NumComptecp = t2.NumCompte
                    AND t1.NumCompte = t2.NumComptecp
                    AND t1.CodeMonnaie = t2.CodeMonnaie
                    AND t1.DateTransaction = t2.DateTransaction
                    AND t1.NumTransaction = t2.NumTransaction
                    WHERE t1.Debitfc = t2.Creditfc
                    AND t1.Debitusd = t2.Creditusd
                    AND t1.Creditfc = t2.Debitfc
                    AND t1.Creditusd = t2.Debitusd
                    AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                    AND t1.CodeMonnaie = 1
                    AND t1.NomUtilisateur = "' . $request->UserName . '"
                ) AS subquery')[0];


                $totCDF = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                SELECT DISTINCT 
                    t1.NumTransaction, 
                    t1.DateTransaction, 
                    t1.CodeMonnaie, 
                    t1.NumCompte, 
                    t1.NumComptecp, 
                    t1.Debitfc, 
                    t1.Debitusd, 
                    t1.Creditfc, 
                    t1.Creditusd
                FROM transactions t1
                JOIN transactions t2 
                    ON t1.NumComptecp = t2.NumCompte
                AND t1.NumCompte = t2.NumComptecp
                AND t1.CodeMonnaie = t2.CodeMonnaie
                AND t1.DateTransaction = t2.DateTransaction
                AND t1.NumTransaction = t2.NumTransaction
                WHERE t1.Debitfc = t2.Creditfc
                AND t1.Debitusd = t2.Creditusd
                AND t1.Creditfc = t2.Debitfc
                AND t1.Creditusd = t2.Debitusd
                AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                AND t1.CodeMonnaie = 2
                AND t1.NomUtilisateur = "' . $request->UserName . '"
                ) AS subquery')[0];
                // $totCreditCDF = DB::select('SELECT SUM(transactions.Creditfc) as totCreditCDF FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.CodeMonnaie=2   AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '"AND comptes.RefCadre NOT IN (59,87,85) ')[0];
                // $totDebitUSD = DB::select('SELECT SUM(transactions.Debitusd) as totDebitUSD FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"   AND transactions.CodeMonnaie=1 AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefCadre NOT IN (59,87,85) ')[0];
                // $totCreditUSD = DB::select('SELECT SUM(transactions.Creditusd) as totCreditUSD FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"   AND transactions.CodeMonnaie=1  AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefCadre NOT IN (59,87,85) ')[0];
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Pas de données trouver"
                ]);
            }
            return response()->json([
                "dataCDF" => $dataCDF,
                "dataUSD" => $dataUSD,
                "totCDF" => $totCDF,
                // "totCreditCDF" => $totCreditCDF,
                "totUSD" => $totUSD,
                // "totCreditUSD" => $totCreditUSD,

                "status" => 1
            ]);
        }
        if (isset($request->UserName) and $SuspensTransactions == true) {

            $check_dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle,t1.typeTransaction, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2 AND t1.NomUtilisateur = "' . $request->UserName . '" AND t1.typeTransaction="suspens"');
            $check_dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle,t1.typeTransaction, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1 AND t1.NomUtilisateur = "' . $request->UserName . '" AND t1.typeTransaction="suspens"');

            if (count($check_dataCDF) != 0 or count($check_dataUSD) != 0) {
                $dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle,t1.typeTransaction, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2 AND t1.NomUtilisateur = "' . $request->UserName . '" AND t1.typeTransaction="suspens"');
                $dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle,t1.typeTransaction, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1 AND t1.NomUtilisateur = "' . $request->UserName . '" AND t1.typeTransaction="suspens"');
                $totUSD = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                    SELECT DISTINCT 
                        t1.NumTransaction, 
                        t1.DateTransaction, 
                        t1.CodeMonnaie, 
                        t1.NumCompte, 
                        t1.NumComptecp, 
                        t1.Debitfc, 
                        t1.Debitusd, 
                        t1.Creditfc, 
                        t1.Creditusd
                    FROM transactions t1
                    JOIN transactions t2 
                        ON t1.NumComptecp = t2.NumCompte
                    AND t1.NumCompte = t2.NumComptecp
                    AND t1.CodeMonnaie = t2.CodeMonnaie
                    AND t1.DateTransaction = t2.DateTransaction
                    AND t1.NumTransaction = t2.NumTransaction
                    WHERE t1.Debitfc = t2.Creditfc
                    AND t1.Debitusd = t2.Creditusd
                    AND t1.Creditfc = t2.Debitfc
                    AND t1.Creditusd = t2.Debitusd
                    AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                    AND t1.CodeMonnaie = 1
                    AND t1.NomUtilisateur = "' . $request->UserName . '"
                    AND t1.typeTransaction="suspens"
                ) AS subquery')[0];


                $totCDF = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                SELECT DISTINCT 
                    t1.NumTransaction, 
                    t1.DateTransaction, 
                    t1.CodeMonnaie, 
                    t1.NumCompte, 
                    t1.NumComptecp, 
                    t1.Debitfc, 
                    t1.Debitusd, 
                    t1.Creditfc, 
                    t1.Creditusd
                FROM transactions t1
                JOIN transactions t2 
                    ON t1.NumComptecp = t2.NumCompte
                AND t1.NumCompte = t2.NumComptecp
                AND t1.CodeMonnaie = t2.CodeMonnaie
                AND t1.DateTransaction = t2.DateTransaction
                AND t1.NumTransaction = t2.NumTransaction
                WHERE t1.Debitfc = t2.Creditfc
                AND t1.Debitusd = t2.Creditusd
                AND t1.Creditfc = t2.Debitfc
                AND t1.Creditusd = t2.Debitusd
                AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                AND t1.CodeMonnaie = 2
                AND t1.NomUtilisateur = "' . $request->UserName . '"
                AND t1.typeTransaction="suspens"
                ) AS subquery')[0];
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Pas de données trouver"
                ]);
            }
            return response()->json([
                "dataCDF" => $dataCDF,
                "dataUSD" => $dataUSD,
                "totCDF" => $totCDF,
                // "totCreditCDF" => $totCreditCDF,
                "totUSD" => $totUSD,
                // "totCreditUSD" => $totCreditUSD,

                "status" => 1
            ]);
        }
        $check_dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2');
        $check_dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1');

        if (count($check_dataCDF) != 0 or count($check_dataUSD) != 0) {

            $dataCDF = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 2');
            $dataUSD = DB::select('SELECT DISTINCT t1.NumTransaction, t1.DateTransaction, t1.CodeMonnaie, t1.NumCompte, t1.NumComptecp, t1.Debitfc, t1.Debitusd, t1.Creditfc, t1.Creditusd, t1.Libelle, c1.NomCompte AS NomCompte FROM transactions t1 JOIN transactions t2 ON t1.NumComptecp = t2.NumCompte AND t1.NumCompte = t2.NumComptecp AND t1.CodeMonnaie = t2.CodeMonnaie AND t1.DateTransaction = t2.DateTransaction AND t1.NumTransaction = t2.NumTransaction JOIN comptes c1 ON t1.NumCompte = c1.NumCompte WHERE t1.Debitfc = t2.Creditfc AND t1.Debitusd = t2.Creditusd AND t1.Creditfc = t2.Debitfc AND t1.Creditusd = t2.Debitusd AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND t1.CodeMonnaie = 1');
            $totUSD = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                    SELECT DISTINCT 
                        t1.NumTransaction, 
                        t1.DateTransaction, 
                        t1.CodeMonnaie, 
                        t1.NumCompte, 
                        t1.NumComptecp, 
                        t1.Debitfc, 
                        t1.Debitusd, 
                        t1.Creditfc, 
                        t1.Creditusd
                    FROM transactions t1
                    JOIN transactions t2 
                        ON t1.NumComptecp = t2.NumCompte
                    AND t1.NumCompte = t2.NumComptecp
                    AND t1.CodeMonnaie = t2.CodeMonnaie
                    AND t1.DateTransaction = t2.DateTransaction
                    AND t1.NumTransaction = t2.NumTransaction
                    WHERE t1.Debitfc = t2.Creditfc
                    AND t1.Debitusd = t2.Creditusd
                    AND t1.Creditfc = t2.Debitfc
                    AND t1.Creditusd = t2.Debitusd
                    AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                    AND t1.CodeMonnaie = 1
                ) AS subquery')[0];


            $totCDF = DB::select('SELECT 
                SUM(subquery.Debitfc) AS TotalDebitfc, 
                SUM(subquery.Debitusd) AS TotalDebitusd, 
                SUM(subquery.Creditfc) AS TotalCreditfc, 
                SUM(subquery.Creditusd) AS TotalCreditusd
                FROM (
                SELECT DISTINCT 
                    t1.NumTransaction, 
                    t1.DateTransaction, 
                    t1.CodeMonnaie, 
                    t1.NumCompte, 
                    t1.NumComptecp, 
                    t1.Debitfc, 
                    t1.Debitusd, 
                    t1.Creditfc, 
                    t1.Creditusd
                FROM transactions t1
                JOIN transactions t2 
                    ON t1.NumComptecp = t2.NumCompte
                AND t1.NumCompte = t2.NumComptecp
                AND t1.CodeMonnaie = t2.CodeMonnaie
                AND t1.DateTransaction = t2.DateTransaction
                AND t1.NumTransaction = t2.NumTransaction
                WHERE t1.Debitfc = t2.Creditfc
                AND t1.Debitusd = t2.Creditusd
                AND t1.Creditfc = t2.Debitfc
                AND t1.Creditusd = t2.Debitusd
                AND t1.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"
                AND t1.CodeMonnaie = 2
                ) AS subquery')[0];
            // $totCreditCDF = DB::select('SELECT SUM(transactions.Creditfc) as totCreditCDF FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.CodeMonnaie=2   AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '"AND comptes.RefCadre NOT IN (59,87,85) ')[0];
            // $totDebitUSD = DB::select('SELECT SUM(transactions.Debitusd) as totDebitUSD FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"   AND transactions.CodeMonnaie=1 AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefCadre NOT IN (59,87,85) ')[0];
            // $totCreditUSD = DB::select('SELECT SUM(transactions.Creditusd) as totCreditUSD FROM transactions join comptes on transactions.NumCompte=comptes.NumCompte  WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"   AND transactions.CodeMonnaie=1  AND comptes.isBilanAccount!=1  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefCadre NOT IN (59,87,85) ')[0];
        } else {
            return response()->json([
                "status" => 0,
                "msg" => "Pas de données trouver"
            ]);
        }
        return response()->json([
            "dataCDF" => $dataCDF,
            "dataUSD" => $dataUSD,
            "totCDF" => $totCDF,
            // "totCreditCDF" => $totCreditCDF,
            "totUSD" => $totUSD,
            // "totCreditUSD" => $totCreditUSD,

            "status" => 1
        ]);
    }

    public function getSearchedRepertoire(Request $request)
    {
        //dd($request->all());
        if (isset($request->UserName)) {

            $check_dataCDF = DB::select('SELECT  
            * FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.CodeMonnaie=2 AND comptes.RefSousGroupe=3301 AND transactions.NomUtilisateur="' . $request->UserName . '"  ORDER BY transactions.NomUtilisateur,transactions.NumTransaction,transactions.Debit');
            $check_dataUSD = DB::select('SELECT  
             * FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.CodeMonnaie=1 AND comptes.RefGroupe=3300 AND transactions.NomUtilisateur="' . $request->UserName . '"  ORDER BY transactions.NomUtilisateur,transactions.NumTransaction,transactions.Debit');
            if (count($check_dataCDF) != 0 or count($check_dataUSD) != 0) {
                $dataCDF = DB::select('SELECT transactions.DateTransaction,transactions.NumTransaction,transactions.NumCompte,comptes.NomCompte,transactions.Libelle,transactions.Creditfc,transactions.Debitfc,transactions.Credit,transactions.Debit,transactions.Creditusd,transactions.Debitusd,transactions.CodeMonnaie  FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"  AND comptes.NumCompte NOT IN (871,870,851,850) AND  comptes.RefSousGroupe=3301 AND transactions.Numcompte!=3301 AND  transactions.CodeMonnaie=2 AND transactions.NomUtilisateur="' . $request->UserName . '" ORDER BY transactions.NomUtilisateur,transactions.NumTransaction,transactions.Debit DESC ');
                $dataUSD = DB::select('SELECT  transactions.DateTransaction,transactions.NumTransaction,transactions.NumCompte,comptes.NomCompte,transactions.Libelle,transactions.Credit,transactions.Debit,transactions.Creditusd,transactions.Debitusd,transactions.CodeMonnaie  FROM transactions JOIN comptes ON transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND comptes.NumCompte NOT IN (871,870,851,850) AND comptes.RefSousGroupe=3300 AND transactions.CodeMonnaie=1 AND transactions.Numcompte!=3300 AND transactions.NomUtilisateur="' . $request->UserName . '" ORDER BY transactions.NomUtilisateur,transactions.NumTransaction,transactions.Debit DESC');
                $totDebitCDF = DB::select('SELECT SUM(transactions.Debitfc) as totDebitCDF FROM transactions JOIN comptes  ON  transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.Numcompte!=3301 AND transactions.CodeMonnaie=2  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefSousGroupe=3301 AND comptes.NumCompte NOT IN (871,870,851,850)')[0];
                $totCreditCDF = DB::select('SELECT SUM(transactions.Creditfc) as totCreditCDF FROM transactions JOIN comptes  ON  transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"  AND transactions.Numcompte!=3301 AND transactions.CodeMonnaie=2  AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefSousGroupe=3301 AND comptes.NumCompte NOT IN (871,870,851,850)')[0];
                $totDebitUSD = DB::select('SELECT SUM(transactions.Debitusd) as totDebitUSD FROM transactions JOIN comptes  ON  transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '" AND transactions.Numcompte!=3300  AND transactions.CodeMonnaie=1 AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefSousGroupe=3300 AND comptes.NumCompte NOT IN (871,870,851,850)')[0];
                $totCreditUSD = DB::select('SELECT SUM(transactions.Creditusd) as totCreditUSD FROM transactions JOIN comptes  ON  transactions.NumCompte=comptes.NumCompte WHERE transactions.DateTransaction BETWEEN "' . $request->DateDebut . '" AND "' . $request->DateFin . '"  AND transactions.Numcompte!=3300 AND transactions.CodeMonnaie=1 AND transactions.NomUtilisateur="' . $request->UserName . '" AND comptes.RefSousGroupe=3300 AND comptes.NumCompte NOT IN (871,870,851,850)')[0];
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Pas de données trouver"
                ]);
            }
            return response()->json([
                "dataCDF" => $dataCDF,
                "dataUSD" => $dataUSD,
                "totDebitCDF" => $totDebitCDF,
                "totCreditCDF" => $totCreditCDF,
                "totDebitUSD" => $totDebitUSD,
                "totCreditUSD" => $totCreditUSD,
                "status" => 1
            ]);
        } else {
            return response()->json([
                "status" => 0,
                "msg" => "Veuillez sélectionnez un utilisateur!"
            ]);
        }
    }

    //GET ECHEANCIER HOME PAGE 
    public function getEcheancierCreditHomePage()
    {
        return view("eco.pages.rapport-credit");
    }

    //PERMET D'AFFICHER L'ECHEANCIER ET UN TABLEAU D'AMMORTISSMENT

    public function getEcheancier(Request $request)

    {

        //VERIFIE SI L'UTILISATEUR SOUHAITE AFFICHE QUE TYPE DE RAPPORT
        if (isset($request->radioValue) and $request->radioValue == "echeancier") {
            //VERIFIE SI LE NUMERO DE DOSSIER EXISTE 
            if (isset($request->searched_num_dossier)) {
                $checkNumDossier = Echeancier::where("NumDossier", "=", $request->searched_num_dossier)->first();
                if ($checkNumDossier) {
                    $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->searched_num_dossier)
                        // ->where("echeanciers.CapAmmorti", ">", 0)
                        // ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                        // ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                        ->join('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                        ->join('comptes', 'comptes.NumCompte', '=', 'portefeuilles.NumCompteEpargne')
                        // ->select('echeanciers.*')
                        ->get();

                    //RECUPERE LA SOMME DES INTERET A PAYER
                    $dataSommeInter = Echeancier::select(
                        DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
                    )->where("echeanciers.NumDossier", "=", $request->searched_num_dossier)
                        // ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                        // ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                        ->first();
                    return response()->json(["status" => 1, "data" => $data, "msg" => "Resultat trouvé", "sommeInteret" => $dataSommeInter]);
                } else {
                    return response()->json([
                        "status" => 0,
                        "msg" => "Aucun écheancier n'est associé au numéro de dossier renseigné rassurez vous que vous avez entré un bon numéro de dossier ou que vous avez généré son écheancier merci !"
                    ]);
                }
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Vous devez renseigné le numero de dossier!"
                ]);
            }
        } else if (isset($request->radioValue) and $request->radioValue == "tableau_ammortiss") {
            if (isset($request->searched_num_dossier)) {
                $checkNumDossier = Echeancier::where("NumDossier", "=", $request->searched_num_dossier)->first();
                if ($checkNumDossier) {

                    $data = Portefeuille::where("portefeuilles.NumDossier", "=", $request->searched_num_dossier)
                        ->where("echeanciers.CapAmmorti", ">", 0)

                        // ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                        // ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                        ->leftJoin('echeanciers', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                        ->leftJoin('remboursementcredits', 'remboursementcredits.RefEcheance', '=', 'echeanciers.ReferenceEch')
                        //   ->select('echeanciers.*')
                        ->get();

                    //RECUPERE LA SOMME DES INTERET A PAYER
                    $dataSommeInter = Echeancier::select(
                        DB::raw("SUM(echeanciers.Interet) as sommeInteret"),
                    )->where("echeanciers.NumDossier", "=", $request->searched_num_dossier)
                        // ->orWhere("portefeuilles.NumCompteEpargne", "=", $request->NumCompteEpargne)
                        // ->orWhere("portefeuilles.NumCompteCredit", "=", $request->NumCompteCredit)
                        ->join('portefeuilles', 'portefeuilles.NumDossier', '=', 'echeanciers.NumDossier')
                        ->first();

                    //GET NAME 
                    $NomCompte = Portefeuille::where("NumDossier", $request->searched_num_dossier)->first();

                    //RECUPERE LE SOLDE RESTANT DU CREDIT
                    // $soldeRestant = DB::select('SELECT SUM(echeanciers.CapAmmorti) as soldeRestant from echeanciers where echeanciers.NumDossier="' . $request->searched_num_dossier . '" and echeanciers.posted=!1 and echeanciers.statutPayement=!1 GROUP BY echeanciers.NumDossier')[0];
                    // $SoldeCreditRestant = $soldeRestant->soldeRestant;

                    $soldeRestant =  Echeancier::selectRaw('
                     echeanciers.NumDossier,
                    SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS InteretRetard,
                    SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS soldeRestant
                ')
                        ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
                        ->where('echeanciers.posted', '=!', 1)
                        ->where('echeanciers.statutPayement', '=!', 1)
                        ->where('echeanciers.NumDossier', $request->searched_num_dossier)
                        ->groupBy('echeanciers.NumDossier')
                        ->first();
                    $SoldeCreditRestant = $soldeRestant->soldeRestant;
                    // dd($soldeRestant);
                    //RECUPERE LE CAPITAL REMBOURSE
                    $capitalRembourse = DB::select('SELECT SUM(echeanciers.CapAmmorti) as capitalRembourse from echeanciers where echeanciers.NumDossier="' . $request->searched_num_dossier . '" and echeanciers.posted=1 and echeanciers.statutPayement=1 GROUP BY echeanciers.NumDossier');

                    $capitalRembours = $capitalRembourse[0]->capitalRembourse ?? 0; // Retourne 0 si aucun résultat
                    //RECUPERE LE SOLDE EN RETARD 
                    // $soldeEnRetard = JourRetard::where("NumDossier", $request->searched_num_dossier)->first();
                    // $soldeEnRetard = DB::select('SELECT SUM(echeanciers.MontantRetardInteret) as soldeIntRetard,SUM(echeanciers.MontantRetardCapital) soldeCapRetard from echeanciers where echeanciers.NumDossier="' . $request->searched_num_dossier . '" and echeanciers.RetardPayement=1 GROUP BY echeanciers.NumDossier')[0];

                    $soldeEnRetard =  Echeancier::selectRaw('
                     echeanciers.NumDossier,
                    SUM(echeanciers.Interet) - SUM(COALESCE(remboursementcredits.InteretPaye, 0)) AS sommeInteretRetard,
                    SUM(echeanciers.CapAmmorti) - SUM(COALESCE(remboursementcredits.CapitalPaye, 0)) AS sommeCapitalRetard
                ')
                        ->leftJoin('remboursementcredits', 'echeanciers.ReferenceEch', '=', 'remboursementcredits.RefEcheance')
                        ->where('echeanciers.RetardPayement', 1)
                        ->where('echeanciers.NumDossier', $request->searched_num_dossier)
                        ->groupBy('echeanciers.NumDossier')
                        ->first();
                    // dd($soldeEnRetard);
                    //RECUPERE L'INTERET DEJA REMBOURSE 
                    $InteretRembourse = DB::select('SELECT SUM(echeanciers.Interet) as intereRembourse from echeanciers where echeanciers.NumDossier="' . $request->searched_num_dossier . '" and echeanciers.posted=1 and echeanciers.statutPayement=1 GROUP BY echeanciers.NumDossier');
                    $InteretRembourse = $InteretRembourse[0] ?? 0; // Retourne 0 si aucun résultat
                    //RECUPERE L'INTERET L'INTERET RESTANT 
                    $InteretRestant = DB::select('SELECT SUM(echeanciers.Interet) as intereRestant from echeanciers where echeanciers.NumDossier="' . $request->searched_num_dossier . '" and echeanciers.posted=!1 and echeanciers.statutPayement=!1 GROUP BY echeanciers.NumDossier');
                    $InteretRestant = $InteretRestant[0] ?? 0; // Retourne 0 si aucun résultat
                    return response()->json([
                        "status" => 1,
                        "data_ammortissement" => $data,
                        "msg" => "Resultat trouvé",
                        "sommeInteret_ammort" => $dataSommeInter,
                        "NomCompte" => $NomCompte,
                        "soldeRestant" => $SoldeCreditRestant,
                        "soldeEnRetard" => $soldeEnRetard,
                        "capitalRembourse" => $capitalRembours,
                        "interetRembourse" => $InteretRembourse,
                        "interetRestant" => $InteretRestant
                    ]);
                } else {
                    return response()->json([
                        "status" => 0,
                        "msg" => "Aucun écheancier n'est associé au numéro de dossier renseigné rassurez vous que vous avez entré un bon numéro de dossier ou que vous avez généré son écheancier merci !"
                    ]);
                }
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Vous devez renseigné le numero de dossier!"
                ]);
            }
        } else if (isset($request->radioValue) and $request->radioValue == "balance_agee") {
            //
            if (isset($request->devise) and isset($request->selectedDate)) {

                if ($request->devise == "CDF") {
                    // $dataBalanceAgee = Portefeuille::where("portefeuilles.CodeMonnaie", "=", $request->devise)
                    //     ->join("comptes", "portefeuilles.NumCompteEpargne", "=", "comptes.NumCompte")
                    //     ->leftJoin("jour_retards", "portefeuilles.NumCompteEpargne", "=", "jour_retards.NumcompteEpargne")
                    //     ->orderBy("portefeuilles.NumDossier")->get();
                    $dataBalanceAgee = Portefeuille::where("portefeuilles.CodeMonnaie", "=", $request->devise)
                        ->where("portefeuilles.Octroye", 1)
                        ->where("portefeuilles.Cloture", "!=", 1)
                        ->join("comptes", "portefeuilles.NumCompteEpargne", "=", "comptes.NumCompte")
                        ->leftJoin("jour_retards", "portefeuilles.NumCompteEpargne", "=", "jour_retards.NumcompteEpargne")
                        ->leftJoin("echeanciers", "portefeuilles.NumDossier", "=", "echeanciers.NumDossier")
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where("Gestionnaire", $request->agent_credit_name);
                        })
                        ->selectRaw('
                         portefeuilles.NumDossier,
                         portefeuilles.NumCompteEpargne,
                         portefeuilles.CodeMonnaie,
                         portefeuilles.NumDossier,
                         portefeuilles.NumCompteCredit,
                         portefeuilles.NomCompte,
                         portefeuilles.DateOctroi,
                         portefeuilles.DateEcheance,
                         portefeuilles.MontantAccorde,
                         portefeuilles.Duree,
                         jour_retards.DateRetard,
                         jour_retards.NbrJrRetard,

                         SUM(CASE WHEN echeanciers.statutPayement = 1 AND echeanciers.posted = 1 THEN echeanciers.CapAmmorti ELSE 0 END) AS TotalCapitalRembourse,
                         SUM(CASE WHEN echeanciers.statutPayement = 1 AND echeanciers.posted = 1 THEN echeanciers.Interet ELSE 0 END) AS TotalInteretRembourse,
                         SUM(echeanciers.CapAmmorti) - SUM(CASE WHEN echeanciers.StatutPayement = 1 AND echeanciers.Posted = 1 THEN echeanciers.CapAmmorti ELSE 0 END) AS CapitalRestant,
                         SUM(echeanciers.Interet) - SUM(CASE WHEN echeanciers.StatutPayement = 1 AND echeanciers.Posted = 1 THEN echeanciers.Interet ELSE 0 END) AS InteretRestant
                                 ')
                        ->groupBy(
                            'portefeuilles.NumDossier',
                            'portefeuilles.NumCompteEpargne',
                            'portefeuilles.CodeMonnaie',
                            'portefeuilles.NumCompteCredit',
                            'portefeuilles.NomCompte',
                            'portefeuilles.DateOctroi',
                            'portefeuilles.DateEcheance',
                            'portefeuilles.MontantAccorde',
                            'portefeuilles.Duree',
                            'jour_retards.DateRetard',
                            'jour_retards.NbrJrRetard'
                        )
                        ->orderBy('portefeuilles.DateOctroi', 'desc')
                        ->get();

                    //SELECT p.NumDossier, p.NumCompteEpargne, p.CodeMonnaie, j.DateRetard, SUM(CASE WHEN e.statutPayement = 1 AND e.posted = 1 THEN e.CapAmmorti ELSE 0 END) AS TotalCapitalRembourse, SUM(CASE WHEN e.statutPayement = 1 AND e.posted = 1 THEN e.Interet ELSE 0 END) AS TotalInteretRembourse FROM portefeuilles p JOIN comptes c ON p.NumCompteEpargne = c.NumCompte LEFT JOIN jour_retards j ON p.NumCompteEpargne = j.NumcompteEpargne LEFT JOIN echeanciers e ON p.NumDossier = e.NumDossier WHERE p.CodeMonnaie = "CDF" GROUP BY p.NumDossier, p.NumCompteEpargne, p.CodeMonnaie, j.DateRetard ORDER BY p.NumDossier;
                    // dd($dataBalanceAgee);

                    //RECUPERE L'ENCOURS GLOBAL DE CREDIT

                    //     $getSoldeEncoursCreditCDF = DB::select('SELECT SUM(transactions.Debitfc)-SUM(transactions.Creditfc) As SoldeEncoursCDF FROM  transactions
                    //  WHERE transactions.CodeMonnaie=2 AND Libelle NOT LIKE "%Imputation%" AND transactions.NumCompte="' . $comptePretAuMembreCDF . '" ')[0];

                    $getSoldeEncoursCreditCDF = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitfc) - SUM(transactions.Creditfc) AS SoldeEncoursCDF')
                        ->where('transactions.CodeMonnaie', 2) // Filtre sur la devise (CDF)
                        ->where('transactions.NumCompte', $this->comptePretAuMembreCDF) // Filtre sur le compte spécifique
                        ->where('transactions.Libelle', 'NOT LIKE', '%Imputation%') // Filtre excluant les libellés contenant "Imputation"
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name); // Filtre optionnel
                        })
                        ->first();
                    $getEncoursBrutCreditCDF = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitfc) - SUM(transactions.Creditfc) AS SoldeEncoursCDF')
                        ->where('transactions.CodeMonnaie', 2) // Filtre sur la devise (CDF)
                        ->where('transactions.NumCompte', $this->comptePretAuMembreCDF) // Filtre sur le compte spécifique
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name); // Filtre optionnel
                        })
                        ->first();

                    // RECUPERE LA SOMME DE CAPITAL EN RETARD
                    //     $getSoldeCapRetardCDF = DB::select('SELECT SUM(transactions.Debitfc)-SUM(transactions.Creditfc)  As TotRetard FROM  transactions
                    // WHERE transactions.CodeMonnaie=2 AND transactions.NumCompte="' . $compteRetardCDF . '"')[0];
                    $getSoldeCapRetardCDF = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitfc) - SUM(transactions.Creditfc) AS TotRetard')
                        ->where('transactions.CodeMonnaie', 2) // Filtre sur la devise (CDF)
                        ->where('transactions.NumCompte', $this->compteRetardCDF) // Filtre sur le compte spécifique
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name); // Filtre optionnel sur le gestionnaire
                        })
                        ->first(); // Récupère le solde total

                    // $PAR = ($getSoldeCapRetardCDF->TotRetard) / ($getSoldeEncoursCreditCDF->SoldeEncoursCDF + $getSoldeCapRetardCDF->TotRetard) * 100;

                    $denominator = $getSoldeEncoursCreditCDF->SoldeEncoursCDF + $getSoldeCapRetardCDF->TotRetard;

                    if ($denominator != 0) {
                        $PAR = ($getSoldeCapRetardCDF->TotRetard / $denominator) * 100;
                    } else {
                        $PAR = 0; // Ou une valeur par défaut
                    }

                    return response()->json([
                        "status" => 1,
                        "data_balance_agee" => $dataBalanceAgee,
                        "soldeEncourCDF" => $getEncoursBrutCreditCDF,
                        "totRetardCDF" => $PAR
                    ]);
                } else if ($request->devise == "USD") {
                    $dataBalanceAgee = Portefeuille::where("portefeuilles.CodeMonnaie", "=", $request->devise)
                        ->where("portefeuilles.Octroye", 1)
                        ->where("portefeuilles.Cloture", "!=", 1)
                        ->join("comptes", "portefeuilles.NumCompteEpargne", "=", "comptes.NumCompte")
                        ->leftJoin("jour_retards", "portefeuilles.NumCompteEpargne", "=", "jour_retards.NumcompteEpargne")
                        ->leftJoin("echeanciers", "portefeuilles.NumDossier", "=", "echeanciers.NumDossier")
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where("portefeuilles.Gestionnaire", $request->agent_credit_name);
                        })
                        ->selectRaw('
                     portefeuilles.NumDossier,
                     portefeuilles.NumCompteEpargne,
                     portefeuilles.CodeMonnaie,
                     portefeuilles.NumDossier,
                     portefeuilles.NumCompteCredit,
                     portefeuilles.NomCompte,
                     portefeuilles.DateOctroi,
                     portefeuilles.DateEcheance,
                     portefeuilles.MontantAccorde,
                     portefeuilles.Duree,
                     jour_retards.DateRetard,
                     jour_retards.NbrJrRetard,

                     SUM(CASE WHEN echeanciers.statutPayement = 1 AND echeanciers.posted = 1 THEN echeanciers.CapAmmorti ELSE 0 END) AS TotalCapitalRembourse,
                     SUM(CASE WHEN echeanciers.statutPayement = 1 AND echeanciers.posted = 1 THEN echeanciers.Interet ELSE 0 END) AS TotalInteretRembourse,
                     SUM(echeanciers.CapAmmorti) - SUM(CASE WHEN echeanciers.StatutPayement = 1 AND echeanciers.Posted = 1 THEN echeanciers.CapAmmorti ELSE 0 END) AS CapitalRestant,
                     SUM(echeanciers.Interet) - SUM(CASE WHEN echeanciers.StatutPayement = 1 AND echeanciers.Posted = 1 THEN echeanciers.Interet ELSE 0 END) AS InteretRestant
                             ')
                        ->groupBy(
                            'portefeuilles.NumDossier',
                            'portefeuilles.NumCompteEpargne',
                            'portefeuilles.CodeMonnaie',
                            'portefeuilles.NumCompteCredit',
                            'portefeuilles.NomCompte',
                            'portefeuilles.DateOctroi',
                            'portefeuilles.DateEcheance',
                            'portefeuilles.MontantAccorde',
                            'portefeuilles.Duree',
                            'jour_retards.DateRetard',
                            'jour_retards.NbrJrRetard'
                        )
                        ->orderBy('portefeuilles.DateOctroi', 'desc')
                        ->get();

                    //SELECT p.NumDossier, p.NumCompteEpargne, p.CodeMonnaie, j.DateRetard, SUM(CASE WHEN e.statutPayement = 1 AND e.posted = 1 THEN e.CapAmmorti ELSE 0 END) AS TotalCapitalRembourse, SUM(CASE WHEN e.statutPayement = 1 AND e.posted = 1 THEN e.Interet ELSE 0 END) AS TotalInteretRembourse FROM portefeuilles p JOIN comptes c ON p.NumCompteEpargne = c.NumCompte LEFT JOIN jour_retards j ON p.NumCompteEpargne = j.NumcompteEpargne LEFT JOIN echeanciers e ON p.NumDossier = e.NumDossier WHERE p.CodeMonnaie = "CDF" GROUP BY p.NumDossier, p.NumCompteEpargne, p.CodeMonnaie, j.DateRetard ORDER BY p.NumDossier;
                    // dd($dataBalanceAgee);

                    //RECUPERE L'ENCOURS GLOBAL DE CREDIT

                    //         $getSoldeEncoursCreditUSD = DB::select('SELECT SUM(transactions.Debitusd)-SUM(transactions.Creditusd) As SoldeEncoursUSD FROM  transactions
                    //  WHERE transactions.CodeMonnaie=1 AND Libelle NOT LIKE "%Imputation%" AND transactions.NumCompte="' . $comptePretAuMembreUSD . '"')[0];

                    $getSoldeEncoursCreditUSD = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitusd) - SUM(transactions.Creditusd) AS SoldeEncoursUSD')
                        ->where('transactions.CodeMonnaie', 1)
                        ->where('transactions.NumCompte', $this->comptePretAuMembreUSD)
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name);
                        })
                        ->first();

                    $getEncourBrutCreditUSD = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitusd) - SUM(transactions.Creditusd) AS SoldeEncoursUSD')
                        ->where('transactions.CodeMonnaie', 1)
                        ->where('transactions.NumCompte', $this->comptePretAuMembreUSD)
                        ->where('transactions.Libelle', 'NOT LIKE', '%Imputation%')
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name);
                        })
                        ->first();


                    // RECUPERE LA SOMME DE CAPITAL EN RETARD

                    //         $getSoldeCapRetardUSD = DB::select('SELECT SUM(transactions.Debitusd)-SUM(transactions.Creditusd)  As TotRetard FROM  transactions
                    // WHERE transactions.CodeMonnaie=1 AND transactions.NumCompte="' . $compteRetardUSD . '"')[0];

                    $getSoldeCapRetardUSD = DB::table('transactions')
                        ->selectRaw('SUM(transactions.Debitusd) - SUM(transactions.Creditusd) AS TotRetard')
                        ->where('transactions.CodeMonnaie', 1) // Filtre sur la devise (USD)
                        ->where('transactions.NumCompte', $this->compteRetardUSD) // Filtre sur le compte spécifique
                        ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                            $query->where('transactions.Operant', $request->agent_credit_name); // Filtre optionnel
                        })
                        ->first(); // Récupère le total

                    // dd($getSoldeEncoursCreditUSD->SoldeEncoursUSD . " " . $getSoldeCapRetardUSD->TotRetard);
                    $denominator = $getSoldeEncoursCreditUSD->SoldeEncoursUSD + $getSoldeCapRetardUSD->TotRetard;

                    if ($denominator != 0) {
                        $PAR = ($getSoldeCapRetardUSD->TotRetard / $denominator) * 100;
                    } else {
                        $PAR = 0; // Ou une valeur par défaut
                    }
                    // $PAR = ($getSoldeCapRetardUSD->TotRetard) / ($getSoldeEncoursCreditUSD->SoldeEncoursUSD + $getSoldeCapRetardUSD->TotRetard) * 100;

                    return response()->json([
                        "status" => 1,
                        "data_balance_agee" => $dataBalanceAgee,
                        "soldeEncourUSD" => $getEncourBrutCreditUSD,
                        "totRetardUSD" => $PAR
                    ]);
                }
            } else {
                return response()->json([
                    "status" => 0,
                    "msg" => "Vous devez sélectionner la devise pour affiche la balance"
                ]);
            }
        }
    }

    //GET BALANCE HOME PAGE 
    public function getBalanceHomePage()
    {
        return view("eco.pages.balance");
    }

    //PERMET D'AFFICHER LA BALANCE 

    public function getBalanceCompte(Request $request)
    {
        // radioValue,
        // date_debut_balance,
        // date_fin_balance,
        // devise,
        // compte_balance_debut,
        // compte_balance_fin,
        if (isset($request->radioValue) and $request->radioValue == "type_balance" and !$request->radioValue2) {

            if ($request->devise == "USD") {
                $dateDebut = $request->date_debut_balance;
                $date1 = $request->date_debut_balance;
                $date2 = $request->date_fin_balance;
                $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
                $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné
                $resultUSD = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitusd ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditusd ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitusd ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                        // ->orWhere('c.isResultAccount', 1);
                    })
                    ->when($compteDebut, function ($query) use ($compteDebut) {
                        return $query->where('c.RefCadre', '>=', $compteDebut);
                    })
                    ->when($compteFin, function ($query) use ($compteFin) {
                        return $query->where('c.RefCadre', '<=', $compteFin);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();
                return response()->json(["status" => 1, "data" => $resultUSD]);
            } else if ($request->devise == "CDF") {
                $dateDebut = $request->date_debut_balance;
                $date1 = $request->date_debut_balance;
                $date2 = $request->date_fin_balance;
                $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
                $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné
                $resultFC = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitfc ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditfc ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitfc ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitfc - t.Creditfc < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                        // ->orWhere('c.isResultAccount', 1);
                    })
                    ->when($compteDebut, function ($query) use ($compteDebut) {
                        return $query->where('c.RefCadre', '>=', $compteDebut);
                    })
                    ->when($compteFin, function ($query) use ($compteFin) {
                        return $query->where('c.RefCadre', '<=', $compteFin);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();
                return response()->json(["status" => 1, "data" => $resultFC]);
            }
        }

        if (isset($request->radioValue) and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {

            $dateDebut = $request->date_debut_balance;
            $date1 = $request->date_debut_balance;
            $date2 = $request->date_fin_balance;
            $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné
            if ($request->devise == "USD") {

                $resultUSD = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitusd ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditusd ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitusd ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    // ->where(function ($query) {
                    //     $query->where('c.isBilanAccount', 1)
                    //         ->orWhere('c.isResultAccount', 1);
                    // })
                    ->when($compteDebut, function ($query) use ($compteDebut, $compteFin) {
                        return $query->whereBetween('c.RefCadre', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefTypeCompte', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefGroupe', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefSousGroupe', [$compteDebut, $compteFin]);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultUSD]);
            } else if ($request->devise == "CDF") {
                $resultCDF = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitfc ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditfc ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitfc ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitfc - t.Creditfc < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    // ->where(function ($query) {
                    //     $query->where('c.isBilanAccount', 1)
                    //         ->orWhere('c.isResultAccount', 1);
                    // })
                    ->when($compteDebut, function ($query) use ($compteDebut, $compteFin) {
                        return $query->whereBetween('c.RefCadre', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefTypeCompte', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefGroupe', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefSousGroupe', [$compteDebut, $compteFin]);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();
                return response()->json(["status" => 1, "data" => $resultCDF]);
            }
        }

        if (isset($request->radioValue) and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {

            if ($request->devise == "CDF") {

                $dateDebut = $request->date_debut_balance;
                $date1 = $request->date_debut_balance;
                $date2 = $request->date_fin_balance;
                $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
                $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné  
                $resultCDF = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitfc ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditfc ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitfc ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitfc - t.Creditfc < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1)
                            ->orWhere('c.isResultAccount', 1);
                    })
                    ->when($compteDebut, function ($query) use ($compteDebut, $compteFin) {
                        return $query->whereBetween('c.RefCadre', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefTypeCompte', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefGroupe', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefSousGroupe', [$compteDebut, $compteFin]);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultCDF]);
            } else if ($request->devise == "USD") {
                $dateDebut = $request->date_debut_balance;
                $date1 = $request->date_debut_balance;
                $date2 = $request->date_fin_balance;
                $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
                $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné  
                $resultUSD = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Debitusd ELSE 0 END) AS SommeDebitReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction < '$dateDebut' THEN t.Creditusd ELSE 0 END) AS SommeCreditReport"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction BETWEEN '$date1' AND '$date2' THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmt"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Debitusd ELSE 0 END) AS TotalDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd ELSE 0 END) AS TotalCredit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END ELSE 0 END) AS SoldeDebit"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END ELSE 0 END) AS SoldeCredit"),
                        'c.RefCadre',
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1)
                            ->orWhere('c.isResultAccount', 1);
                    })
                    ->when($compteDebut, function ($query) use ($compteDebut, $compteFin) {
                        return $query->whereBetween('c.RefCadre', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefTypeCompte', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefGroupe', [$compteDebut, $compteFin])
                            ->orWhereBetween('c.RefSousGroupe', [$compteDebut, $compteFin]);
                    })
                    ->groupBy('c.NomCompte', 'c.RefCadre', 'c.RefSousGroupe', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultUSD]);
            }
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf"  and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {
            $dateDebut = $request->date_debut_balance;
            $dateFin = $request->date_fin_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné
            $result = DB::select('SELECT 
            c.NomCompte,
            c.RefCadre,
            c.NumAdherant,
            MAX(c.NumCompte) AS Ncompte,
            MAX(c.RefSousGroupe) As RefSousGroupe,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS TotalDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS TotalCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END 
            ELSE 0 END) AS SoldeDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END 
            ELSE 0 END) AS SoldeCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS TotalDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS TotalCreditCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitfc - t.Creditfc < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END 
            ELSE 0 END) AS SoldeDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END 
            ELSE 0 END) AS SoldeCreditCDF
        FROM 
            comptes AS c
        LEFT JOIN 
            transactions AS t ON c.NumCompte = t.NumCompte
            WHERE 
            (COALESCE("' . $compteDebut . '", "") = "" OR c.RefCadre >= "' . $compteDebut . '")
    AND (COALESCE("' . $compteFin . '", "") = "" OR c.RefCadre <= "' . $compteFin . '")
             AND c.NomCompte IS NOT NULL
        GROUP BY 
            c.NomCompte, c.RefCadre, c.NumAdherant;
        ');



            return response()->json(["status" => 1, "data" => $result]);
        }
        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf"  and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {

            $dateDebut = $request->date_debut_balance;
            $dateFin = $request->date_fin_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné
            $result = DB::select('SELECT 
            c.NomCompte,
            c.RefCadre,
            c.NumAdherant,
            MAX(c.NumCompte) AS Ncompte,
            MAX(c.RefSousGroupe) As RefSousGroupe,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS TotalDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS TotalCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END 
            ELSE 0 END) AS SoldeDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END 
            ELSE 0 END) AS SoldeCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS SommeDebitMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS SommeCreditMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitfc ELSE 0 END) AS TotalDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditfc ELSE 0 END) AS TotalCreditCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitfc - t.Creditfc < 0 THEN 0 ELSE t.Debitfc - t.Creditfc END 
            ELSE 0 END) AS SoldeDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditfc - t.Debitfc < 0 THEN 0 ELSE t.Creditfc - t.Debitfc END 
            ELSE 0 END) AS SoldeCreditCDF
        FROM 
            comptes AS c
        LEFT JOIN 
            transactions AS t ON c.NumCompte = t.NumCompte
            WHERE 
            (COALESCE("' . $compteDebut . '", "") = "" OR c.RefCadre >= "' . $compteDebut . '")
    AND (COALESCE("' . $compteFin . '", "") = "" OR c.RefCadre <= "' . $compteFin . '")
             AND c.NomCompte IS NOT NULL
             AND (c.isBilanAccount=1 or c.isResultAccount=1)
        GROUP BY 
            c.NomCompte, c.RefCadre, c.NumAdherant;
        ');






            return response()->json(["status" => 1, "data" => $result]);
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd"  and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {

            $dateDebut = $request->date_debut_balance;
            $dateFin = $request->date_fin_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné

            // $dateDebut = $request->date_debut_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            // $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            // $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné  

            $result = DB::select('SELECT 
        c.NomCompte,
        c.RefCadre,
        c.NumAdherant,
        MAX(c.NumCompte) AS Ncompte,
        MAX(c.RefSousGroupe) As RefSousGroupe,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitReportUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditReportUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmtUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmtUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS TotalDebitUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS TotalCreditUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
            CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END 
        ELSE 0 END) AS SoldeDebitUSD,
        SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
            CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END 
        ELSE 0 END) AS SoldeCreditUSD,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitReportCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditReportCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmtCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmtCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS TotalDebitCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS TotalCreditCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
            CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END 
        ELSE 0 END) AS SoldeDebitCDF,
        SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
            CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END 
        ELSE 0 END) AS SoldeCreditCDF
    FROM 
        comptes AS c
    LEFT JOIN 
        transactions AS t ON c.NumCompte = t.NumCompte
        WHERE 
        (COALESCE("' . $compteDebut . '", "") = "" OR c.RefCadre >= "' . $compteDebut . '")
AND (COALESCE("' . $compteFin . '", "") = "" OR c.RefCadre <= "' . $compteFin . '")
         AND c.NomCompte IS NOT NULL
         AND (c.isBilanAccount=1 or c.isResultAccount=1)
    GROUP BY 
        c.NomCompte, c.RefCadre, c.NumAdherant;
    ');
            return response()->json(["status" => 1, "data" => $result]);
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd"  and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {

            $dateDebut = $request->date_debut_balance;
            $dateFin = $request->date_fin_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné

            // $dateDebut = $request->date_debut_balance;
            // $date1 = $request->date_debut_balance;
            // $date2 = $request->date_fin_balance;
            // $compteDebut = $request->compte_balance_debut; // Utiliser null si non renseigné
            // $compteFin = $request->compte_balance_fin;   // Utiliser null si non renseigné  

            $result = DB::select('SELECT 
            c.NomCompte,
            c.RefCadre,
            c.NumAdherant,
            MAX(c.NumCompte) AS Ncompte,
            MAX(c.RefSousGroupe) As RefSousGroupe,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditReportUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmtUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS TotalDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS TotalCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END 
            ELSE 0 END) AS SoldeDebitUSD,
            SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END 
            ELSE 0 END) AS SoldeCreditUSD,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction < "' . $dateDebut . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditReportCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS SommeDebitMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction BETWEEN "' . $dateDebut . '" AND "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS SommeCreditMvmtCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Debitusd ELSE 0 END) AS TotalDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN t.Creditusd ELSE 0 END) AS TotalCreditCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Debitusd - t.Creditusd < 0 THEN 0 ELSE t.Debitusd - t.Creditusd END 
            ELSE 0 END) AS SoldeDebitCDF,
            SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $dateFin . '" THEN 
                CASE WHEN t.Creditusd - t.Debitusd < 0 THEN 0 ELSE t.Creditusd - t.Debitusd END 
            ELSE 0 END) AS SoldeCreditCDF
        FROM 
            comptes AS c
        LEFT JOIN 
            transactions AS t ON c.NumCompte = t.NumCompte
            WHERE 
            (COALESCE("' . $compteDebut . '", "") = "" OR c.RefCadre >= "' . $compteDebut . '")
    AND (COALESCE("' . $compteFin . '", "") = "" OR c.RefCadre <= "' . $compteFin . '")
            
             AND c.NomCompte IS NOT NULL
        GROUP BY 
            c.NomCompte, c.RefCadre, c.NumAdherant;
        ');

            return response()->json(["status" => 1, "data" => $result]);
        }
    }

    //PERMET DE D'AFFICHER LA PAGE DE BILAN

    public function getBilanHomePage()
    {
        return view("eco.pages.bilan");
    }

    //GET BILAN DATA 

    public function getBilanCompte(Request $request)
    {
        $date1 = $request->date_debut_balance;
        $date2 = $request->date_fin_balance;
        if (isset($request->radioValue) and $request->radioValue == "type_balance" and !$request->radioValue2) {
            if ($request->devise == "USD") {

                $resultUSDActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultUSDPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultUSDActif, "data2" => $resultUSDPasif]);
            } else if ($request->devise == "CDF") {
                $resultCDFActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultCDFPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
            }
        }

        if (isset($request->radioValue) and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {
            if ($request->devise == "USD") {
                $resultUSDActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultUSDPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultUSDActif, "data2" => $resultUSDPasif]);
            } else if ($request->devise == "CDF") {
                $resultCDFActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultCDFPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
            }
        }

        if (isset($request->radioValue) and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {

            if ($request->devise == "USD") {
                $resultUSDActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultUSDPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultUSDActif, "data2" => $resultUSDPasif]);
            } else if ($request->devise == "CDF") {
                $resultCDFActif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                $resultCDFPasif = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.accountState', "is_passif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isBilanAccount', 1);
                    })
                    ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe')
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
            }
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf"  and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {

            $resultCDFActif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_actif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();

            $resultCDFPasif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_passif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();


            return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
        }
        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf"  and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {
            $resultCDFActif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_actif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();

            $resultCDFPasif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditfc-t.Debitfc ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_passif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();
            return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd"  and isset($request->radioValue2) and $request->radioValue2 == "porte_groupee") {

            $resultCDFActif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_actif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();

            $resultCDFPasif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_passif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();
            return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd"  and isset($request->radioValue2) and $request->radioValue2 == "porte_detaillee") {

            $resultCDFActif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_actif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();

            $resultCDFPasif = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinUSD'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date1 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeDebutCDF'),
                    DB::raw('SUM(CASE WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= "' . $date2 . '" THEN t.Creditusd-t.Debitusd ELSE 0 END) AS soldeFinCDF')
                )
                ->where('c.accountState', 'is_passif')
                ->whereNotIn('c.RefCadre', [38, 59])
                ->where('c.isBilanAccount', 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant')
                ->get();
            return response()->json(["status" => 1, "data" => $resultCDFActif, "data2" => $resultCDFPasif]);
        }
    }

    //GET TFR HOME PAGE
    public function getTfrHomePage()
    {
        return view("eco.pages.tfr");
    }


    //GET TFR REPORT 

    public function getTfrCompte(Request $request)
    {
        $date1 = $request->date_debut_balance;
        $date2 = $request->date_fin_balance;
        if (isset($request->radioValue) and $request->radioValue == "type_balance" and !$request->radioValue2) {
            if ($request->devise == "USD") {

                $result = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.RefTypeCompte',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("
                        SUM(CASE 
                            WHEN t.DateTransaction <= '$date1' THEN 
                                CASE 
                                    WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                    WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                    ELSE t.Creditusd - t.Debitusd
                                END
                            ELSE 0 
                        END) AS soldeDebut
                    "),
                        DB::raw("
                        SUM(CASE 
                            WHEN t.DateTransaction <= '$date2' THEN 
                                CASE 
                                    WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                    WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                    ELSE t.Creditusd - t.Debitusd
                                END
                            ELSE 0 
                        END) AS soldeFin
                    "),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('t.extourner', "!=", 1)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isResultAccount', 1);
                    })
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'c.RefTypeCompte')
                    ->orderByRaw("CASE 
                                WHEN c.RefTypeCompte = 7 THEN 1 
                                WHEN c.RefTypeCompte = 6 THEN 2 
                                ELSE 3 
                              END")
                    ->orderBy('c.NomCompte')
                    ->get();



                return response()->json(["status" => 1, "data" => $result]);
            } else if ($request->devise == "CDF") {
                $result = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.RefTypeCompte',
                        DB::raw('MIN(c.NomCompte) AS NomCompte'), // Sélectionner un seul NomCompte, ici le premier trouvé
                        DB::raw('MIN(c.NumCompte) AS NumCompte'), // Sélectionner un seul NumCompte, ici le premier trouvé
                        DB::raw("
                        SUM(CASE 
                            WHEN t.DateTransaction <= '$date1' THEN 
                                CASE 
                                    WHEN c.RefCadre = 7 THEN t.Creditfc - t.Debitfc
                                    WHEN c.RefCadre = 6 THEN t.Debitfc - t.Creditfc
                                    ELSE t.Creditfc - t.Debitfc
                                END
                            ELSE 0 
                        END) AS soldeDebut
                    "),
                        DB::raw("
                        SUM(CASE 
                            WHEN t.DateTransaction <= '$date2' THEN 
                                CASE 
                                    WHEN c.RefCadre = 7 THEN t.Creditfc - t.Debitfc
                                    WHEN c.RefCadre = 6 THEN t.Debitfc - t.Creditfc
                                    ELSE t.Creditfc - t.Debitfc
                                END
                            ELSE 0 
                        END) AS soldeFin
                    "),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('t.extourner', "!=", 1)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isResultAccount', 1);
                    })
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'c.RefTypeCompte')
                    ->orderByRaw("CASE 
                                WHEN c.RefTypeCompte = 7 THEN 1 
                                WHEN c.RefTypeCompte = 6 THEN 2 
                                ELSE 3 
                              END")
                    ->orderBy('c.NomCompte')
                    ->get();

                return response()->json(["status" => 1, "data" => $result]);
            }
        }

        if (isset($request->radioValue) and isset($request->radioValue2)) {
            if ($request->devise == "USD") {
                $result = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        'c.RefTypeCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('t.extourner', "!=", 1)
                    // ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isResultAccount', 1);
                    })
                    // ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte', 'c.RefTypeCompte')
                    ->orderByRaw("FIELD(c.NomCompte, 'Résultat Avant Impôt', 'Résultat Net de l''exercice')")
                    ->orderBy('c.NomCompte')
                    ->get();


                return response()->json(["status" => 1, "data" => $result]);
            } else if ($request->devise == "CDF") {
                $result = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.NomCompte',
                        'c.NumCompte',
                        'c.RefTypeCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin"),
                        'c.RefSousGroupe'
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('t.extourner', "!=", 1)
                    // ->where('c.accountState', "is_actif")
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->where(function ($query) {
                        $query->where('c.isResultAccount', 1);
                    })
                    // ->whereNotIn('c.RefCadre', [38, 59]) // Utiliser whereNotIn pour exclure plusieurs valeurs
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'NomCompte', 'NumCompte', 'c.RefTypeCompte')
                    ->orderByRaw("FIELD(c.NomCompte, 'Résultat Avant Impôt', 'Résultat Net de l''exercice')")
                    ->orderBy('c.NomCompte')
                    ->get();



                return response()->json(["status" => 1, "data" => $result]);
            }
        }


        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf") {

            $result = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    'c.RefTypeCompte',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw("
            SUM(CASE 
                WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= '$date1' THEN 
                    CASE 
                        WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                        WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                        ELSE t.Creditusd - t.Debitusd
                    END
                ELSE 0 
            END) AS soldeDebutUSD
        "),
                    DB::raw("
            SUM(CASE 
                WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= '$date2' THEN 
                    CASE 
                        WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                        WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                        ELSE t.Creditusd - t.Debitusd
                    END
                ELSE 0 
            END) AS soldeFinUSD
        "),
                    DB::raw("
            SUM(CASE 
                WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= '$date1' THEN 
                    CASE 
                        WHEN c.RefCadre = 7 THEN t.Creditfc - t.Debitfc
                        WHEN c.RefCadre = 6 THEN t.Debitfc - t.Creditfc
                        ELSE t.Creditfc - t.Debitfc
                    END
                ELSE 0 
            END) AS soldeDebutCDF
        "),
                    DB::raw("
            SUM(CASE 
                WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= '$date2' THEN 
                    CASE 
                        WHEN c.RefCadre = 7 THEN t.Creditfc - t.Debitfc
                        WHEN c.RefCadre = 6 THEN t.Debitfc - t.Creditfc
                        ELSE t.Creditfc - t.Debitfc
                    END
                ELSE 0 
            END) AS soldeFinCDF
        ")
                )
                ->where('c.isResultAccount', 1)
                ->where('t.extourner', "!=", 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant', 'c.RefTypeCompte')
                ->orderByRaw("FIELD(c.NomCompte, 'Résultat Avant Impôt', 'Résultat Net de l''exercice')")
                ->get();

            return response()->json(["status" => 1, "data" => $result]);
        }

        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd") {

            $result = DB::table('comptes as c')
                ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                ->select(
                    DB::raw('MIN(c.NomCompte) AS NomCompte'),
                    'c.RefCadre',
                    'c.NumAdherant',
                    'c.RefTypeCompte',
                    DB::raw('MIN(c.NumCompte) AS Ncompte'),
                    DB::raw('MIN(c.RefSousGroupe) AS RefSousGroupe'),
                    DB::raw("
                    SUM(CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= '$date1' THEN 
                            CASE 
                                WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                ELSE t.Creditusd - t.Debitusd
                            END
                        ELSE 0 
                    END) AS soldeDebutUSD
                "),
                    DB::raw("
                    SUM(CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= '$date2' THEN 
                            CASE 
                                WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                ELSE t.Creditusd - t.Debitusd
                            END
                        ELSE 0 
                    END) AS soldeFinUSD
                "),
                    DB::raw("
                    SUM(CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= '$date1' THEN 
                            CASE 
                                WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                ELSE t.Creditusd - t.Debitusd
                            END
                        ELSE 0 
                    END) AS soldeDebutCDF
                "),
                    DB::raw("
                    SUM(CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= '$date2' THEN 
                            CASE 
                                WHEN c.RefCadre = 7 THEN t.Creditusd - t.Debitusd
                                WHEN c.RefCadre = 6 THEN t.Debitusd - t.Creditusd
                                ELSE t.Creditusd - t.Debitusd
                            END
                        ELSE 0 
                    END) AS soldeFinCDF
                ")
                )
                ->where('c.isResultAccount', 1)
                ->where('t.extourner', "!=", 1)
                ->whereNotNull('c.NomCompte')
                ->groupBy('c.RefCadre', 'c.NumAdherant', 'c.RefTypeCompte')
                ->orderByRaw("FIELD(c.NomCompte, 'Résultat Avant Impôt', 'Résultat Net de l''exercice')")
                ->get();



            return response()->json(["status" => 1, "data" => $result]);
        }
    }

    //GET REMBOURSEMENT ATTENDU HOME PAGE

    public function getRemboursementAttenduHomePage()
    {
        return view("eco.pages.remboursement-attendu");
    }

    //PERMET DE RECUPERER LE REMBOURSEMENT ATTENDU

    public function getRemboursAttendu(Request $request)
    {
        // dd($request->all());
        // $nombreSemaine = 1;
        $date1 = $request->dateToSearch1;
        $date2 = $request->dateToSearch2;
        if (isset($date1) and isset($date2)) {
            if ($request->devise == "CDF") {


                $data = DB::table('echeanciers')
                    ->leftJoin('portefeuilles', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                    ->select(
                        'echeanciers.*',
                        'portefeuilles.*',
                        DB::raw('IFNULL((SELECT SUM(transactions.Creditfc) - SUM(transactions.Debitfc) 
          FROM transactions 
          WHERE transactions.NumCompte = portefeuilles.NumCompteEpargne 
          AND transactions.extourner != 1), 0) AS soldeMembreCDF')
                    )
                    ->whereBetween('echeanciers.DateTranch', [$date1, $date2])
                    ->where('portefeuilles.CodeMonnaie', 'CDF')
                    ->where('portefeuilles.Cloture', '!=', 1)
                    ->where('portefeuilles.Accorde', 1)
                    ->where('portefeuilles.Octroye', 1)
                    ->where(function ($query) {
                        $query->where('echeanciers.CapAmmorti', '>', 0)
                            ->orWhere('echeanciers.Interet', '>', 0);
                    })
                    ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                        $query->where('portefeuilles.Gestionnaire', $request->agent_credit_name);
                    })
                    ->orderBy('echeanciers.DateTranch')
                    ->get();






                //RECUPERE LA SOMME
                if (count($data) != 0) {
                    $dataSomme = DB::select('SELECT SUM(CapAmmorti) as sommeCapApayer,SUM(Interet) as sommeInteretApayer FROM echeanciers  WHERE echeanciers.DateTranch BETWEEN "' . $date1 . '" AND "' . $date2 . '"')[0];
                    return response()->json(["status" => 1, "data" => $data, "dataSomme" => $dataSomme]);
                } else {
                    return response()->json(["status" => 0, "msg" => "Pas des données trouvées"]);
                }
            }
            if ($request->devise == "USD") {


                // $data = DB::select('SELECT * FROM echeanciers 
                // LEFT JOIN portefeuilles 
                // ON echeanciers.NumDossier=portefeuilles.NumDossier 
                // WHERE echeanciers.DateTranch 
                // BETWEEN "' . $date1 . '" AND "' . $date2 . '" 
                // AND portefeuilles.CodeMonnaie="USD" AND portefeuilles.Cloture!=1 
                // AND portefeuilles.Accorde=1 AND portefeuilles.Octroye=1  
                // AND (echeanciers.CapAmmorti>0 OR echeanciers.Interet>0) 
                // ORDER BY echeanciers.DateTranch');
                $data = DB::table('echeanciers')
                    ->leftJoin('portefeuilles', 'echeanciers.NumDossier', '=', 'portefeuilles.NumDossier')
                    ->select(
                        'echeanciers.*',
                        'portefeuilles.*',
                        DB::raw('IFNULL((SELECT SUM(transactions.Creditusd) - SUM(transactions.Debitusd) 
                      FROM transactions 
                      WHERE transactions.NumCompte = portefeuilles.NumCompteEpargne AND transactions.extourner != 1), 0) AS soldeMembreUSD')
                    )
                    ->whereBetween('echeanciers.DateTranch', [$date1, $date2])
                    ->where('portefeuilles.CodeMonnaie', 'USD')
                    ->where('portefeuilles.Cloture', '!=', 1)
                    ->where('portefeuilles.Accorde', 1)
                    ->where('portefeuilles.Octroye', 1)
                    ->where(function ($query) {
                        $query->where('echeanciers.CapAmmorti', '>', 0)
                            ->orWhere('echeanciers.Interet', '>', 0);
                    })
                    ->when(!empty($request->agent_credit_name), function ($query) use ($request) {
                        $query->where('portefeuilles.Gestionnaire', $request->agent_credit_name);
                    })
                    ->orderBy('echeanciers.DateTranch')
                    ->get();

                //RECUPERE LA SOMME
                if (count($data) != 0) {
                    $dataSomme = DB::select('SELECT SUM(CapAmmorti) as sommeCapApayer,SUM(Interet) as sommeInteretApayer FROM echeanciers  WHERE echeanciers.DateTranch BETWEEN "' . $date1 . '" AND "' . $date2 . '"')[0];
                    return response()->json(["status" => 1, "data" => $data, "dataSomme" => $dataSomme]);
                } else {
                    return response()->json(["status" => 0, "msg" => "Pas des données trouvées"]);
                }
            }
        } else {
            return response()->json(["status" => 0, "msg" => "Veuillez renseigner la date de début et la date de fin"]);
        }
    }

    public function getSommaireCompteHomePage()
    {
        return view("eco.pages.sommaire-compte");
    }

    //PERMET DE RECUPERER LE NOM D'UN SOUS GROUPE DE COMPTE 

    public function getAccountName(Request $request)
    {
        if (isset($request->sous_groupe_compte)) {
            $accountName = Comptes::where("NumCompte", $request->sous_groupe_compte)
                ->orWhere("RefCadre", $request->sous_groupe_compte)
                ->where("isCompteInterne", 1)
                ->first();
            if ($accountName) {
                $accountName = Comptes::where("NumCompte", $request->sous_groupe_compte)
                    ->orWhere("RefCadre", $request->sous_groupe_compte)
                    ->where("isCompteInterne", 1)
                    ->first()->NomCompte;
                return response()->json(["status" => 1, "accountName" => $accountName]);
            } else {
                return response()->json(["status" => 0, "msg" => "Aucun compte trouvé"]);
            }
        }
    }

    //PERMET D'AFFICHER LE SOMMAIRE DE COMPTES
    public function getSommaireCompte(Request $request)
    {
        $date1 = $request->date_debut_balance;
        $date2 = $request->date_fin_balance;
        $sousGroupeCompte = $request->sous_groupe_compte;
        if (isset($request->radioValue) and $request->radioValue == "rapport_non_converti") {
            $compte = Comptes::where("NumCompte", $sousGroupeCompte)
                ->orWhere("RefTypeCompte", $sousGroupeCompte)
                ->orWhere("RefCadre", $sousGroupeCompte)
                ->orWhere("RefGroupe", $sousGroupeCompte)
                ->orWhere("RefSousGroupe", $sousGroupeCompte)
                ->where("isCompteInterne", $sousGroupeCompte)->first();
            // $getCodeMonnaie = Comptes::where("RefSousGroupe", $sousGroupeCompte)->first();
            if ($compte->CodeMonnaie == 1) {
                $getSoldeCompte = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.RefTypeCompte',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditusd - t.Debitusd ELSE 0 END) AS soldeFin")
                    )
                    ->where('c.CodeMonnaie', 1)
                    ->where('c.RefCadre', $compte->RefCadre)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->whereNotIn('c.NumCompte', [3300, 3301])

                    ->when(
                        $request->has('critereSolde') && $request->has('critereSoldeAmount'),
                        function ($query) use ($request) {
                            $critere = $request->critereSolde;
                            $amount = $request->critereSoldeAmount;
                            switch ($critere) {
                                case '>':
                                    return $query->havingRaw('soldeFin > ?', [$amount]);
                                case '>=':
                                    return $query->havingRaw('soldeFin >= ?', [$amount]);
                                case '<':
                                    return $query->havingRaw('soldeFin < ?', [$amount]);
                                case '<=':
                                    return $query->havingRaw('soldeFin <= ?', [$amount]);
                                case '=':
                                    return $query->havingRaw('soldeFin = ?', [$amount]);
                                case '<>':
                                    return $query->havingRaw('soldeFin <> ?', [$amount]);
                                default:
                                    return $query; // Pas de filtre si le critère ne correspond pas
                            }
                        }
                    )
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'c.RefTypeCompte', 'c.NomCompte', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();





                return response()->json(["status" => 1, "data" => $getSoldeCompte]);
            } else if ($compte->CodeMonnaie == 2) {
                $compte = Comptes::where("NumCompte", $sousGroupeCompte)
                    ->orWhere("RefTypeCompte", $sousGroupeCompte)
                    ->orWhere("RefCadre", $sousGroupeCompte)
                    ->orWhere("RefGroupe", $sousGroupeCompte)
                    ->orWhere("RefSousGroupe", $sousGroupeCompte)
                    ->where("isCompteInterne", $sousGroupeCompte)->first();
                $getSoldeCompte = DB::table('comptes as c')
                    ->leftJoin('transactions as t', 'c.NumCompte', '=', 't.NumCompte')
                    ->select(
                        'c.RefCadre',
                        'c.RefSousGroupe',
                        'c.RefTypeCompte',
                        'c.NomCompte',
                        'c.NumCompte',
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date1' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeDebut"),
                        DB::raw("SUM(CASE WHEN t.DateTransaction <= '$date2' THEN t.Creditfc - t.Debitfc ELSE 0 END) AS soldeFin")
                    )
                    ->where('c.CodeMonnaie', 2)
                    ->where('c.RefCadre', $compte->RefCadre)
                    ->whereNotNull('c.NumCompte') // Exclure les lignes où NumCompte est null
                    ->whereNotNull('c.NomCompte') // Exclure les lignes où NomCompte est null
                    ->whereNotIn('c.NumCompte', [3300, 3301])

                    ->when(
                        $request->has('critereSolde') && $request->has('critereSoldeAmount'),
                        function ($query) use ($request) {
                            $critere = $request->critereSolde;
                            $amount = $request->critereSoldeAmount;
                            switch ($critere) {
                                case '>':
                                    return $query->havingRaw('soldeFin > ?', [$amount]);
                                case '>=':
                                    return $query->havingRaw('soldeFin >= ?', [$amount]);
                                case '<':
                                    return $query->havingRaw('soldeFin < ?', [$amount]);
                                case '<=':
                                    return $query->havingRaw('soldeFin <= ?', [$amount]);
                                case '=':
                                    return $query->havingRaw('soldeFin = ?', [$amount]);
                                case '<>':
                                    return $query->havingRaw('soldeFin <> ?', [$amount]);
                                default:
                                    return $query; // Pas de filtre si le critère ne correspond pas
                            }
                        }
                    )
                    ->groupBy('c.RefCadre', 'c.RefSousGroupe', 'c.RefTypeCompte', 'c.NomCompte', 'c.NumCompte')
                    ->orderBy('c.NomCompte')
                    ->get();
                return response()->json(["status" => 1, "data" => $getSoldeCompte]);
            }
        }
        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_cdf") {
            $getSoldeCompte =  DB::table('transactions as t')
                ->join('comptes as c', 'c.NumAdherant', '=', 't.refCompteMembre')
                ->select(
                    'c.RefSousGroupe',
                    'c.NumCompte',
                    'c.NomCompte',
                    'c.NumAdherant',
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_cdf
                "),
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_usd
                "),
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) 
                    + SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_usd_to_cdf
                "),
                    DB::raw("
                    (SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) 
                    + SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END)) / MAX(t.Taux) AS solde_consolide_cdf_to_usd
                ")
                )
                ->where('t.DateTransaction', '<=', $date2)
                ->where('c.RefSousGroupe', $sousGroupeCompte)
                ->whereNotIn('c.NumCompte', [3300, 3301])
                ->groupBy('c.RefSousGroupe', 'c.NumCompte', 'c.NomCompte', 'c.NumAdherant')
                ->orderBy('c.NomCompte')
                ->when(
                    $request->has('critereSolde') && $request->has('critereSoldeAmount'),
                    function ($query) use ($request) {
                        $critere = $request->critereSolde;
                        $amount = $request->critereSoldeAmount;

                        switch ($critere) {
                            case '>':
                                return $query->havingRaw('solde_consolide_usd_to_cdf > ?', [$amount]);
                            case '>=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf >= ?', [$amount]);
                            case '<':
                                return $query->havingRaw('solde_consolide_usd_to_cdf < ?', [$amount]);
                            case '<=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf <= ?', [$amount]);
                            case '=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf = ?', [$amount]);
                            case '<>':
                                return $query->havingRaw('solde_consolide_usd_to_cdf <> ?', [$amount]);
                            default:
                                return $query;
                        }
                    }
                )
                ->setBindings(
                    array_fill(0, 6, $date2), // Date répétée pour chaque `?`
                    'select'
                )
                ->get();

            // dd($getSoldeCompte);

            return response()->json(["status" => 1, "data" => $getSoldeCompte]);
        }
        if (isset($request->radioValue) and $request->radioValue == "balance_convertie_usd") {
            $getSoldeCompte =  DB::table('transactions as t')
                ->join('comptes as c', 'c.NumAdherant', '=', 't.refCompteMembre')
                ->select(
                    'c.RefSousGroupe',
                    'c.NumCompte',
                    'c.NomCompte',
                    'c.NumAdherant',
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_cdf
                "),
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_usd
                "),
                    DB::raw("
                    SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) 
                    + SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) AS solde_consolide_usd_to_cdf
                "),
                    DB::raw("
                    (SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 2 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END) 
                    + SUM(DISTINCT CASE 
                        WHEN t.CodeMonnaie = 1 AND t.DateTransaction <= ? 
                        THEN (t.Creditfc - t.Debitfc) 
                        ELSE 0 
                    END)) / MAX(t.Taux) AS solde_consolide_cdf_to_usd
                ")
                )
                ->where('t.DateTransaction', '<=', $date2)
                ->where('c.RefSousGroupe', $sousGroupeCompte)
                ->whereNotIn('c.NumCompte', [3300, 3301])
                ->groupBy('c.RefSousGroupe', 'c.NumCompte', 'c.NomCompte', 'c.NumAdherant')
                ->orderBy('c.NomCompte')
                ->when(
                    $request->has('critereSolde') && $request->has('critereSoldeAmount'),
                    function ($query) use ($request) {
                        $critere = $request->critereSolde;
                        $amount = $request->critereSoldeAmount;

                        switch ($critere) {
                            case '>':
                                return $query->havingRaw('solde_consolide_usd_to_cdf > ?', [$amount]);
                            case '>=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf >= ?', [$amount]);
                            case '<':
                                return $query->havingRaw('solde_consolide_usd_to_cdf < ?', [$amount]);
                            case '<=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf <= ?', [$amount]);
                            case '=':
                                return $query->havingRaw('solde_consolide_usd_to_cdf = ?', [$amount]);
                            case '<>':
                                return $query->havingRaw('solde_consolide_usd_to_cdf <> ?', [$amount]);
                            default:
                                return $query;
                        }
                    }
                )
                ->setBindings(
                    array_fill(0, 6, $date2), // Date répétée pour chaque `?`
                    'select'
                )
                ->get();

            // dd($getSoldeCompte);

            return response()->json(["status" => 1, "data" => $getSoldeCompte]);
        }
    }

    //RECUPERE LES APPRO JOURNALIERE 

    public function getDailyAppro()
    {
        $dataSystem = TauxEtDateSystem::latest()->first();
        $dataCDF = BilletageAppro_cdf::where("DateTransaction", $dataSystem->DateSystem)->orderBy("id", "desc")->get();
        $dataUSD = BilletageAppro_usd::where("DateTransaction", $dataSystem->DateSystem)->orderBy("id", "desc")->get();

        return response()->json(["status" => 1, "dataCDF" => $dataCDF, "dataUSD" => $dataUSD]);
    }


    //RECUPERE LE DELESTAGE JOURNALIERE 

    public function getDailyDelestage()
    {
        $checkIsChefCaisse = Comptes::where("isChefCaisse", 1)->where("caissierId", Auth::user()->id)->first();
        $checkIsCaissier = Comptes::where("caissierId", Auth::user()->id)->first();
        $dataSystem = TauxEtDateSystem::latest()->first();
        if ($checkIsChefCaisse) {
            $dataCDF = Delestages::where("DateTransaction", $dataSystem->DateSystem)->where("CodeMonnaie", 2)->orderBy("id", "desc")->get();
            $dataUSD = Delestages::where("DateTransaction", $dataSystem->DateSystem)->where("CodeMonnaie", 1)->orderBy("id", "desc")->get();
            return response()->json(["status" => 1, "dataCDF" => $dataCDF, "dataUSD" => $dataUSD]);
        } else if ($checkIsCaissier) {
            $dataCDF = Delestages::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("CodeMonnaie", 2)->orderBy("id", "desc")->get();
            $dataUSD = Delestages::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("CodeMonnaie", 1)->orderBy("id", "desc")->get();
            return response()->json(["status" => 1, "dataCDF" => $dataCDF, "dataUSD" => $dataUSD]);
        }
    }

    //RECUPERE LES RECU JOURNALIERS POUR LES DEPOTS

    public function getDailyRecuDepot()
    {
        $dataSystem = TauxEtDateSystem::latest()->first();

        $dataCDF = BilletageCDF::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("montantEntre", ">", 0)->orderBy("id", "desc")->limit(20)->get();
        $dataUSD = BilletageUSD::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("montantEntre", ">", 0)->orderBy("id", "desc")->limit(20)->get();
        return response()->json(["status" => 1, "dataCDF" => $dataCDF, "dataUSD" => $dataUSD]);
    }

    //RECUPERE LES RECU JOURNALIERS POUR LE RETRAIT

    public function getDailyRecuRetrait()
    {
        $dataSystem = TauxEtDateSystem::latest()->first();

        $dataCDF = BilletageCDF::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("montantSortie", ">", 0)->orderBy("id", "desc")->limit(20)->get();
        $dataUSD = BilletageUSD::where("DateTransaction", $dataSystem->DateSystem)->where("NomUtilisateur", Auth::user()->name)->where("montantSortie", ">", 0)->orderBy("id", "desc")->limit(20)->get();
        return response()->json(["status" => 1, "dataCDF" => $dataCDF, "dataUSD" => $dataUSD]);
    }



    // $result = DB::table('echeancier')
    //     ->select(
    //         'echeancier.NumDossier',
    //         DB::raw('SUM(echeancier.Interet) AS sommeInteretRetard'),
    //         DB::raw('SUM(echeancier.CapitalAmorti) AS sommeCapitalRetard')
    //     )
    //     ->leftJoin('remboursementcredit', 'echeancier.ReferenceEch', '=', 'remboursementcredit.ReferenceEch')
    //     ->where('echeancier.RetardPayement', 1)
    //     ->whereRaw(
    //         '(COALESCE(remboursementcredit.InteretPaye, 0) + COALESCE(remboursementcredit.CapitalPaye, 0)) < 
    //         (echeancier.Interet + echeancier.CapitalAmorti)'
    //     )
    //     ->groupBy('echeancier.NumDossier')
    //     ->get();


    public function getAgentCredit()
    {
        $getAgentCreditNames = DB::select("
        SELECT DISTINCT users.id, users.name, users.email
        FROM users
        INNER JOIN profils_users ON users.id = profils_users.user_id
        INNER JOIN profiles ON profils_users.profil_id = profiles.id
    ");

        return response()->json([
            "get_agent_credit" => $getAgentCreditNames,
            "status" => 1
        ]);
    }



    public function downloadReportSommaireCompte(Request $request)
    {
        $fetchData = $request->input('fetchData');
        $date_debut_balance = $request->input('date_debut_balance');
        $date_fin_balance = $request->input('date_fin_balance');
        $type = $request->input('type'); // Type du fichier (pdf ou excel)

        // Filtrer les colonnes que vous souhaitez pour Excel et remplacer les nulls par 0


        $view = 'reports.sommaire-compte'; // Vue Blade pour le PDF
        $filename = 'sommaire_de_compte'; // Nom du fichier

        // Générer le PDF si le type est pdf
        if ($type === "pdf") {
            $date_debut_balance = \Carbon\Carbon::parse($date_debut_balance)->format('d-m-Y');
            $date_fin_balance = \Carbon\Carbon::parse($date_fin_balance)->format('d-m-Y');
            $pdf = PDF::loadView('reports.sommaire-compte', compact('fetchData', 'date_debut_balance', 'date_fin_balance'));
            return $pdf->download('sommaire_de_compte.pdf');
        } else if ($type === 'excel') {
            // Définir les colonnes à sélectionner
            $columnsToSelect = ['NumCompte', 'NomCompte', 'soldeFin'];

            // Filtrer et réorganiser les données pour respecter l'ordre attendu
            $filteredData = array_map(function ($row) use ($columnsToSelect) {
                // Filtrer les colonnes pour récupérer les bonnes valeurs
                $filteredRow = array_intersect_key($row, array_flip($columnsToSelect));

                // S'assurer que les valeurs de 'NumCompte' et 'NomCompte' sont correctement assignées
                // Convertir NumCompte en chaîne de caractères pour éviter la notation scientifique
                $filteredRow['NumCompte'] = "'" . (string) $filteredRow['NumCompte']; // Ajout d'une apostrophe pour éviter la notation scientifique

                // Remplacer soldeFin null par 0
                if (isset($filteredRow['soldeFin']) && is_null($filteredRow['soldeFin'])) {
                    $filteredRow['soldeFin'] = 0;
                }

                // Assurez-vous que la colonne NomCompte contient bien les valeurs des noms
                $filteredRow['NomCompte'] = (isset($filteredRow['NomCompte'])) ? $filteredRow['NomCompte'] : '';

                return $filteredRow;
            }, $fetchData);

            // En-têtes pour le fichier Excel
            $headers = ['NumCompte', 'NomCompte', 'Solde Fin'];

            // Réorganiser les colonnes pour garantir que NumCompte, NomCompte et soldeFin sont dans l'ordre correct
            $reorderedData = array_map(function ($row) {
                return [
                    'NumCompte' => $row['NumCompte'],  // La colonne 'NumCompte' doit venir en premier
                    'NomCompte' => $row['NomCompte'],  // La colonne 'NomCompte' doit venir en second
                    'soldeFin' => $row['soldeFin'],    // La colonne 'soldeFin' doit être la troisième
                ];
            }, $filteredData);

            // Définir le nom du fichier Excel
            $sheetName = 'Soldes des Comptes';
            $filename = 'Sommaire_Compte_' . date('Y-m-d'); // Exemple de nom dynamique

            // Appeler la méthode pour générer le fichier Excel
            return $this->reportService->generateExcelWithHeaders($reorderedData, $headers, $sheetName, $filename);
        }
    }

    //PERMET D'EXPORTE LE RAPPORT LISTE DES COMPTES

    public function downloadReportCompteEpargne(Request $request)
    {
        $fetchData = $request->input('fetchData');
        $type = $request->input('type'); // Type du fichier (pdf ou excel)

        // Filtrer les colonnes que vous souhaitez pour Excel et remplacer les nulls par 0


        $view = 'reports.sommaire-compte'; // Vue Blade pour le PDF
        $filename = 'sommaire_de_compte'; // Nom du fichier

        // Générer le PDF si le type est pdf
        if ($type === "pdf") {
            $pdf = PDF::loadView('reports.liste-compte-pargne', compact('fetchData'));
            ini_set('memory_limit', '1024M');
            return $pdf->download('reports.liste-compte-pargne.pdf');
        } else if ($type === 'excel') {
            // Définir les colonnes à sélectionner
            $columnsToSelect = ['NumCompte', 'NomCompte', 'sexe', 'NumAdherant', 'solde', 'CodeMonnaie', 'derniere_date_transaction'];

            // Filtrer et réorganiser les données pour respecter l'ordre attendu
            $filteredData = array_map(function ($row) use ($columnsToSelect) {
                // Filtrer les colonnes pour récupérer les bonnes valeurs
                $filteredRow = array_intersect_key($row, array_flip($columnsToSelect));

                // S'assurer que les valeurs de 'NumCompte' et 'NomCompte' sont correctement assignées
                // Convertir NumCompte en chaîne de caractères pour éviter la notation scientifique
                $filteredRow['NumCompte'] = "'" . (string) $filteredRow['NumCompte']; // Ajout d'une apostrophe pour éviter la notation scientifiqu

                // Assurez-vous que la colonne NomCompte contient bien les valeurs des noms
                $filteredRow['NomCompte'] = (isset($filteredRow['NomCompte'])) ? $filteredRow['NomCompte'] : '';

                return $filteredRow;
            }, $fetchData);

            // En-têtes pour le fichier Excel
            $headers = ['NumCompte', 'NomCompte', 'Genre', 'NumAbregé', 'Solde', 'CodeMonnaie', 'DateDernièreTransaction'];

            // Réorganiser les colonnes pour garantir que NumCompte, NomCompte et soldeFin sont dans l'ordre correct
            $reorderedData = array_map(function ($row) {
                return [
                    'NumCompte' => $row['NumCompte'],               // La colonne 'NumCompte' doit venir en premier
                    'NomCompte' => $row['NomCompte'],               // La colonne 'NomCompte' doit venir en second
                    'Genre' => $row['sexe'],                        // Le genre basé sur 'sexe'
                    'NumAbregé' => $row['NumAdherant'],             // La colonne 'NumAdherant' doit être la troisième
                    'Solde' => $row['solde'],                       // Le solde
                    'CodeMonnaie' => $row['CodeMonnaie'] == 1 ? 'USD' : 'CDF', // Affichage conditionnel
                    'DateDernièreTransaction' => $row['derniere_date_transaction'], // La dernière date de transaction
                ];
            }, $filteredData);

            // Définir le nom du fichier Excel
            $sheetName = 'Liste_des_comptes_epargne';
            $filename = 'Liste_des_comptes' . date('Y-m-d'); // Exemple de nom dynamique
            // Appeler la méthode pour générer le fichier Excel
            return $this->reportService->generateExcelWithHeaders($reorderedData, $headers, $sheetName, $filename);
        }
    }
}
