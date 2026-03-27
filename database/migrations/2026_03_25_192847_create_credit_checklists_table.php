<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
     /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('credit_checklists', function (Blueprint $table) {
            $table->id();

            // Relations
            $table->foreignId('idUser')->constrained('users')->cascadeOnDelete();
            // Clé étrangère vers la table credits (avec id_credit comme clé primaire)
            $table->unsignedBigInteger('idCredit');
            $table->foreign('idCredit')
                  ->references('id_credit')
                    ->on('credits')
                    ->onDelete('cascade');
            $table->string('agence')->nullable();
            $table->date('date_etablissement')->nullable();

            // Demandeur
            $table->string('nom_demandeur')->nullable();
            $table->string('numero_dossier')->nullable();
            $table->decimal('montant', 15, 2)->nullable();
            $table->string('type_client')->nullable();

            // Documents généraux
            $table->boolean('piece_identite')->default(false);
            $table->boolean('lettre_demande')->default(false);
            $table->boolean('formulaire_pret')->default(false);

            // Salarié
            $table->boolean('contrat_travail')->default(false);
            $table->boolean('fiche_paye')->default(false);
            $table->boolean('recommandation')->default(false);
            $table->boolean('caution_employeur')->default(false);

            // MPME
            $table->boolean('document_activite')->default(false);
            $table->boolean('bilan')->default(false);

            // Analyse ADC
            $table->boolean('rencontre_adc')->nullable();
            $table->boolean('capacite_remboursement')->nullable();
            $table->boolean('fiabilite')->nullable();
            $table->boolean('avis_positif')->nullable();

            $table->date('date_adc')->nullable();
            $table->string('nom_adc')->nullable();

            // Superviseur
            $table->date('date_superviseur')->nullable();
            $table->string('nom_superviseur')->nullable();

            // Avant contrat
            $table->boolean('decision_ctc')->default(false);
            $table->boolean('decision_cc')->default(false);

            // Avant décaissement
            $table->boolean('contrat_signe')->default(false);
            $table->boolean('garanties_constituees')->default(false);
            $table->boolean('rencontre_client')->default(false);

            // Garanties
            $table->boolean('hypothèque')->default(false);
            $table->boolean('lettre_garantie')->default(false);
            $table->boolean('domiciliation_salaire')->default(false);
            $table->boolean('dat')->default(false);
            $table->boolean('aval')->default(false);
            $table->boolean('nantissement')->default(false);

            // Analyste
            $table->date('date_analyste')->nullable();
            $table->string('nom_analyste')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('credit_checklists');
    }
};