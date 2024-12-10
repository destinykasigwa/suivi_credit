<?php

namespace App\Http\Controllers;

use App\Models\ClosedDay;
use App\Rules\TomorrowDate;
use Illuminate\Http\Request;
use App\Models\TauxEtDateSystem;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class PostageController extends Controller
{
    //
    public function __construct()
    {
        $this->middleware("auth");
    }

    //GET CLOTURE HOME PAGE 

    public function getClotureHomePage()
    {
        return view("eco.pages.cloture");
    }


    public function definrDateSysteme(Request $request)
    {
        // Création d'un validateur manuel
        $validator = Validator::make($request->all(), [
            'dateWork' => ['required', 'date', new TomorrowDate],
        ]);

        // Vérification si la validation échoue
        if ($validator->fails() and Auth::user()->admin == 0) {
            return response()->json([
                'status' => 0,
                'msg' => 'La date du sytème doit être la date encours +1 vous avez saisi une date incorecte.',
                'errors' => $validator->errors()
            ]);
        }


        $tauxDuJour =  TauxEtDateSystem::orderBy('id', 'desc')->first();
        $checkIfDateUsed =  TauxEtDateSystem::where('DateSystem', '=', $request->dateWork)->first();
        if ($checkIfDateUsed and Auth::user()->admin == 0) {
            return response()->json(["status" => 0, "msg" => "Impossible d'utiliser une date déjà clotûrée veuillez contacter votre administrateur système merci."]);
        }

        if (!isset($request->dateWork)) {
            return response()->json(["status" => 0, "msg" => "Veuillez definir la date du système pour valider."]);
        }
        if (isset($request->dateWork) and !isset($request->Taux)) {
            //ON RECUPERE LE DERNIER TAUX 
            $tauxDuJour =  TauxEtDateSystem::orderBy('id', 'desc')->first();

            TauxEtDateSystem::create([
                "DateSystem" => $request->dateWork,
                "TauxEnDollar" => $tauxDuJour->Dollar,
                "TauxEnFc" => $tauxDuJour->TauxEnFc,
            ]);
            // RENSEIGNE LA DATE DANS LA TABLE CLOSED DAY

            ClosedDay::create([
                "closed" => 1,
                "DateSysteme" => $request->dateWork,

            ]);
        } else {
            //ON RECUPERE LE DERNIER TAUX 
            $tauxDuJour =  TauxEtDateSystem::orderBy('id', 'desc')->first();
            TauxEtDateSystem::create([
                "DateSystem" => $request->dateWork,
                "TauxEnDollar" => $request->usd,
                "TauxEnFc" => $request->Taux,
            ]);

            // RENSEIGNE LA DATE DANS LA TABLE CLOSED DAY

            ClosedDay::create([
                "closed" => 1,
                "DateSysteme" => $request->dateWork,

            ]);

            // return response()->json(["success" => 0, "msg" => "Vous n'avez pas definie la date ou le taux."]);
        }
        return response()->json(["status" => 1, "msg" => "La date du sytème a été definie avec succès merci."]);
    }

    //PERMET D'OUVRIR LA JOURNE 

    //PERMET D'OUVRIR UNE NOUVELLE JOURNEE
    public function openNewday()
    {
        ClosedDay::where("closed", "=", 1)->update([
            "closed" => 0,
        ]);
        return response()->json(["status" => 1, "msg" => "Vous avez ouvert cette journée avec succès."]);
    }
}
