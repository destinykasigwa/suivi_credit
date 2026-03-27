<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('proposition_montants', function (Blueprint $table) {
           $table->id();
            
            // Clé étrangère vers la table users
            $table->foreignId('idUser')
                  ->constrained('users')
                  ->onDelete('cascade')
                  ->comment('Utilisateur qui a fait la proposition');
            
            // Clé étrangère vers la table credits (avec id_credit comme clé primaire)
            $table->unsignedBigInteger('idDossier');
            $table->foreign('idDossier')
                  ->references('id_credit')  // ← La clé primaire de la table credits
                  ->on('credits')             // ← Nom de la table
                  ->onDelete('cascade')
                  ->comment('Dossier de crédit concerné');
            
            // Montant proposé
            $table->decimal('montant_propose', 15, 2)
                  ->comment('Montant proposé en Francs Congolais');
            
            $table->timestamps();
            
            // Index pour optimiser les requêtes
            $table->index(['idDossier', 'created_at']);
            $table->index('idUser');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('proposition_montants');
    }
};
