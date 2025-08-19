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
            $table->string('NumCompte')->nullable();
            $table->string('NomCompte')->nullable();
            $table->string('produit_credit')->nullable();
            $table->string('type_credit')->nullable();
            $table->string('recouvreur')->nullable();
            $table->string('montant_demande')->nullable();
            $table->date('date_demande')->nullable();
            $table->string('frequence_mensualite')->nullable();
            $table->string('nombre_echeance')->nullable();
            $table->string('NumDossier')->nullable();
            $table->string('gestionnaire')->nullable();
            $table->string('source_fond')->nullable();
            $table->string('monnaie')->nullable();
            $table->string('duree_credit')->nullable();
            $table->string('intervale_jrs')->nullable();
            $table->string('taux_interet')->nullable();
            $table->string('type_garantie')->nullable();
            $table->string('valeur_comptable')->nullable();
            $table->string('num_titre')->nullable();
            $table->string('valeur_garantie')->nullable();
            $table->string('date_sortie_titre')->nullable();
            $table->string('date_expiration_titre')->nullable();
            $table->string('description_titre')->nullable();
            $table->string('statutDossier')->nullable();
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
