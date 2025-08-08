<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class GestionCreditHomePage extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    //
    public function GestionCreditHomePage()
    {
        return view("gestion_credit.home");
    }
}
