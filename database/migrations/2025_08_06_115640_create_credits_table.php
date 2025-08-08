<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**.
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credits', function (Blueprint $table) {
            $table->id();
            $table->string('NumCompte');
            $table->string('NomCompte');
            $table->string('produit_credit');
            $table->string('type_credit');
            $table->string('recouvreur');
            $table->string('montant_demande');
            $table->date('date_demande');
            $table->string('frequence_mensualite');
            $table->string('nombre_echeance');
            $table->string('NumDossier');
            $table->string('gestionnaire');
            $table->string('source_fond');
            $table->string('monnaie');
            $table->string('duree_credit');
            $table->string('intervale_jrs');
            $table->string('taux_interet');
            $table->string('type_garantie');
            $table->string('valeur_comptable');
            $table->string('num_titre');
            $table->string('valeur_garantie');
            $table->string('description_titre');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('credits');
    }
};
