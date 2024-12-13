<?php

namespace App\Services;


use App\Models\Comptes;
use App\Models\SendedSMS;
use App\Models\SMSBanking;
use App\Models\Transactions;
use App\Mail\TransactionsEmail;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;


class SendNotification
{
    protected $africaTalking;

    public function __construct(AfricaTalkingService $africaTalking)
    {
        $this->africaTalking = $africaTalking;
    }


    //PERMET D'ENVOYER DES NOTIFICATION
    public function sendNotification($NumCompte, $devise, $montant, $typeTransaction)
    {
        // if ($codeMonnaie == 1) {
        //     $devise = "USD"; //USD
        // } else if ($codeMonnaie == 2) {
        //     $devise = "CDF"; //CDF
        // }


        //RECUPERE LES INFORMATIONS DE LA PERSONNE QUI VENAIT D'EFFECTUER UN MOUVEMENT
        $getMembreInfo = SMSBanking::where("NumAbrege", "=", $NumCompte)->orWhere("NumCompte", $NumCompte)->first();
        if ($getMembreInfo) {
            if ($getMembreInfo->Email != null and $getMembreInfo->ActivatedEmail == 1) {
                if ($devise == "CDF") {
                    $getMembreInfo2 = Comptes::where("CodeMonnaie", "=", 2)->where("NumAdherant", "=", $NumCompte)->orWhere("NumCompte", $NumCompte)->first();
                    //RECUPERE LE SOLDE DU MEMBRE EN FC 
                    $compteCDF = $getMembreInfo2->NumCompte;
                    $soldeMembreCDF = Transactions::select(
                        DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                    )->where("NumCompte", '=', $compteCDF)
                        ->groupBy("NumCompte")
                        ->first();


                    $data = ($getMembreInfo2->sexe == "Homme" ? " Bonjour Monsieur " : ($getMembreInfo2->sexe == "Femme" ? " Bonjour Madame " : " Bonjour ")) .
                        $getMembreInfo2->NomCompte . " Votre compte CDF " . $compteCDF . ($typeTransaction == "C" ? " est crédité " : "debité ") . " de " . $montant . " CDF  Votre nouveau solde est de " . $soldeMembreCDF->soldeMembreCDF . " CDF";
                    Mail::to($getMembreInfo->Email)->send(new TransactionsEmail($data));
                    // return view('emails.test');
                } else if ($devise == "USD") {
                    $getMembreInfo2 = Comptes::where("CodeMonnaie", "=", 1)->where("NumAdherant", "=", $NumCompte)->orWhere("NumCompte", $NumCompte)->first();

                    $NumCompteUSD = $getMembreInfo2->NumCompte;

                    //RECUPERE LE SOLDE DU MEMBRE EN USD
                    $soldeMembreUSD = Transactions::select(
                        DB::raw("SUM(Creditusd)-SUM(Debitusd) as soldeMembreUSD"),
                    )->where("NumCompte", '=', $NumCompteUSD)
                        ->groupBy("NumCompte")
                        ->first();

                    // $data = $getMembreInfo2->sexe == "Homme" ? "Bonjour Monsieur" : ($getMembreInfo2->sexe == "Femme"  ? "Bonjour Madame" : "Bonjour") .
                    //     $getMembreInfo2->NomCompte . " Votre compte USD " . $NumCompteUSD . " est crédité de " . $montantDepot . " USD Votre nouveau solde est de  " . $soldeMembreUSD->soldeMembreUSD . "USD";


                    $data = ($getMembreInfo2->sexe == "Homme"
                        ? "Bonjour Monsieur"
                        : ($getMembreInfo2->sexe == "Femme"
                            ? "Bonjour Madame"
                            : "Bonjour"))
                        . " " . $getMembreInfo2->NomCompte
                        . " Votre compte USD " . $NumCompte .
                        ($typeTransaction == "C" ? " est crédité " : "debité " .
                            " est crédité de ") . $montant
                        . " USD. Votre nouveau solde est de " . $soldeMembreUSD->soldeMembreUSD . " USD.";

                    Mail::to($getMembreInfo->Email)->send(new TransactionsEmail($data));
                }
            }
            if ($getMembreInfo->Telephone != null and $getMembreInfo->ActivatedSMS == 1) {

                if ($devise == "CDF") {
                    try {
                        $getMembreInfo2 = Comptes::where("CodeMonnaie", "=", 2)->where("NumAdherant", "=", $NumCompte)->orWhere("NumCompte", $NumCompte)->first();
                        //RECUPERE LE SOLDE DU MEMBRE EN USD
                        $NumCompteCDF = $getMembreInfo2->NumCompte;
                        $soldeMembreCDF = Transactions::select(
                            DB::raw("SUM(Creditfc)-SUM(Debitfc) as soldeMembreCDF"),
                        )->where("NumCompte", '=', $NumCompteCDF)
                            ->groupBy("NumCompte")
                            ->first();

                        $message = ($getMembreInfo2->sexe == "Homme")
                            ? "Bonjour Monsieur "
                            : (($getMembreInfo2->sexe == "Femme")
                                ? "Bonjour Madame "
                                : "Bonjour ");

                        $message .= $getMembreInfo2->NomCompte . " Votre compte CDF " . $NumCompteCDF .
                            ($typeTransaction == "C" ? " est credite " : " est debite ") .
                            "de " . $montant . " . Votre nouveau solde est de " . $soldeMembreCDF->soldeMembreCDF . " CDF";

                        $receiver_number = $getMembreInfo->Telephone;
                        $response = $this->africaTalking->sendSms($receiver_number, $message);
                        //Log::info(json_encode($response));
                        if ($response['status'] == 'success') {
                            // Traiter le succès, par exemple, loguer ou notifier l'utilisateur
                            SendedSMS::create([
                                "numPhone" => $receiver_number,
                                "messageStatus" => 1,
                                "paidStatus" => 0,
                                "dateEnvoie" => date("Y-m-d"),
                            ]);
                        } else {
                            // Traiter l'échec, par exemple, loguer l'erreur
                            SendedSMS::create([
                                "numPhone" => $receiver_number,
                                "messageStatus" => 0,
                                "paidStatus" => 0,
                                "dateEnvoie" => date("Y-m-d"),
                            ]);
                        }
                    } catch (\Throwable $th) {
                        throw $th;
                    }
                } else if ($devise == "USD") {
                    try {
                        $getMembreInfo2 = Comptes::where("CodeMonnaie", "=", 1)->where("NumAdherant", "=", $NumCompte)->orWhere("NumCompte", $NumCompte)->first();
                        //RECUPERE LE SOLDE DU MEMBRE EN USD
                        $NumCompteUSD = $getMembreInfo2->NumCompte;
                        $soldeMembreUSD = Transactions::select(
                            DB::raw("SUM(Creditusd)-SUM(Debitusd) as soldeMembreUSD"),
                        )->where("NumCompte", '=', $NumCompteUSD)
                            ->groupBy("NumCompte")
                            ->first();

                        $receiver_number = $getMembreInfo->Telephone;
                        $message = ($getMembreInfo2->sexe == "Homme")
                            ? "Bonjour Monsieur "
                            : (($getMembreInfo2->sexe == "Femme")
                                ? "Bonjour Madame "
                                : "Bonjour ");

                        $message .= $getMembreInfo2->NomCompte . " Votre compte USD " . $NumCompteUSD .
                            ($typeTransaction == "C" ? " est credite " : " est debite ") .
                            "de " . $montant . ". Votre nouveau solde est de " . $soldeMembreUSD->soldeMembreUSD . " USD";

                        $receiver_number = $getMembreInfo->Telephone;
                        $response = $this->africaTalking->sendSms($receiver_number, $message);

                        if ($response['status'] == 'success') {
                            // Traiter le succès, par exemple, loguer ou notifier l'utilisateur
                            SendedSMS::create([
                                "numPhone" => $receiver_number,
                                "messageStatus" => 1,
                                "paidStatus" => 0,
                                "dateEnvoie" => date("Y-m-d"),
                            ]);
                        } else {
                            // Traiter l'échec, par exemple, loguer l'erreur
                            SendedSMS::create([
                                "numPhone" => $receiver_number,
                                "messageStatus" => 0,
                                "paidStatus" => 0,
                                "dateEnvoie" => date("Y-m-d"),
                            ]);
                        }
                    } catch (\Throwable $th) {
                        throw $th;
                    }
                }
            }
        }
    }
}
