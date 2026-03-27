import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function VisualisationChecklist({ dossierId, onClose, checklistData }) {
    const [checklist, setChecklist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Informations de l'organisation
    const organisation = {
        nom: "COOPEC AKIBA YETU",
        slogan: "Ensemble pour un avenir prospère",
        adresse: "123 Avenue de la Paix, Kinshasa/Gombe, RDC",
        telephone: "+243 812 345 678",
        email: "contact@coopecakibayetu.org",
        siteWeb: "www.coopecakibayetu.org",
        logo: "/images/logo/logo.png"
    };

    useEffect(() => {
        console.log("VisualisationChecklist - Données reçues:", checklistData);
        
        if (checklistData) {
            console.log("Utilisation des données reçues en prop");
            setChecklist(checklistData);
            setIsLoading(false);
        } else {
            console.log("Aucune donnée reçue, impossible d'afficher");
            setIsLoading(false);
            setChecklist(null);
        }
    }, [checklistData]);

    const handlePrint = () => {
        window.print();
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                    <p className="text-muted">Chargement de la check-list...</p>
                </div>
            </div>
        );
    }

    if (!checklist) {
        return (
            <div className="container mt-5">
                <div className="alert alert-warning text-center">
                    <i className="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h5>Aucune donnée disponible</h5>
                    <p>Veuillez d'abord remplir et enregistrer la checklist.</p>
                    <button onClick={onClose} className="btn btn-primary mt-3">
                        <i className="fas fa-arrow-left me-2"></i>
                        Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* Boutons d'action - visible uniquement à l'écran */}
            {/* <div className="mb-3 no-print">
                <div className="d-flex justify-content-end gap-2">
                    <button onClick={handlePrint} className="btn btn-primary">
                        <i className="fas fa-print me-2"></i>
                        Imprimer / PDF
                    </button>
                    <button onClick={onClose} className="btn btn-secondary">
                        <i className="fas fa-times me-2"></i>
                        Fermer
                    </button>
                </div>
            </div> */}

            {/* Contenu à imprimer */}
            <div className="card shadow-lg border-0" id="print-area-visualisation">
                <div className="card-body p-0">
                    <div className="container-fluid p-4">
                        {/* EN-TÊTE DE L'ORGANISATION - Visible à l'écran et à l'impression */}
                        <div className="text-center mb-4">
                            <img 
                                src={organisation.logo} 
                                alt="Logo COOPEC AKIBA YETU" 
                                style={{ 
                                    height: "70px",
                                    width: "auto",
                                    objectFit: "contain",
                                    marginBottom: "15px"
                                }} 
                            />
                            <h1 className="fw-bold mb-1" style={{ color: "#1a5f4b" }}>{organisation.nom}</h1>
                            <p className="mb-1 text-muted">{organisation.slogan}</p>
                            <p className="mb-0 small text-muted">{organisation.adresse}</p>
                            <p className="small text-muted">Tél: {organisation.telephone} | Email: {organisation.email}</p>
                            <hr className="my-3" style={{ borderTop: "2px solid #20c997" }} />
                        </div>

                        {/* Titre du document */}
                        <div className="text-center mb-4">
                            <h2 className="text-uppercase fw-bold mb-2" style={{ color: "#20c997" }}>
                                CHECK-LIST DOSSIER DE CREDIT N° {checklist.numero_dossier}
                            </h2>
                            <hr className="my-3" style={{ borderTop: "2px solid #20c997" }} />
                        </div>

                        {/* I. Généralités */}
                        <div className="mb-4">
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fas fa-info-circle me-2"></i>
                                I -- Généralités
                            </h5>
                            <div className="row mb-3">
                                <div className="col-md-6">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Agence :</strong> {checklist.agence || "_________________"}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Date d'établissement :</strong> {checklist.date_etablissement ? new Date(checklist.date_etablissement).toLocaleDateString('fr-FR') : "_________________"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* II. Références du demandeur */}
                        <div className="mb-4">
                            <h5 className="fw-bold text-primary mb-3">
                                <i className="fas fa-user me-2"></i>
                                II -- Références du demandeur
                            </h5>
                            <div className="border p-3 rounded bg-light mb-2">
                                <strong>Nom du demandeur de crédit :</strong> {checklist.nom_demandeur || "_________________"}
                            </div>
                            <div className="border p-3 rounded bg-light mb-2">
                                <strong>N° Dossier de crédit :</strong> {checklist.numero_dossier || "_________________"}
                            </div>
                            <div className="border p-3 rounded bg-light">
                                <strong>Montant demandé :</strong> {checklist.montant || "_________________"}
                            </div>
                        </div>

                        {/* III. Liste de vérifications */}
                        <h5 className="fw-bold text-primary mb-3">
                            <i className="fas fa-check-circle me-2"></i>
                            III -- Liste de vérifications
                        </h5>
                        
                        {/* 1. INTRODUCTION DU DOSSIER */}
                        <div className="mb-4">
                            <h6 className="fw-bold text-dark">1. INTRODUCTION DU DOSSIER</h6>
                            
                            {/* Inventaire des documents */}
                            <div className="mb-3">
                                <p className="fw-bold mb-2">1. Inventaire des documents</p>
                                
                                <p className="text-decoration-underline mb-2 fw-semibold">Pour tous les dossiers :</p>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Documents d'identité</td>
                                            <td className="text-center">
                                                {checklist.piece_identite ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Lettre de demande du membre</td>
                                            <td className="text-center">
                                                {checklist.lettre_demande ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Formulaire de demande de prêt</td>
                                            <td className="text-center">
                                                {checklist.formulaire_pret ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="text-decoration-underline mb-2 fw-semibold">Pour les dossiers de crédit des salariés :</p>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Contrat d'embauche</td>
                                            <td className="text-center">
                                                {checklist.contrat_travail ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Dernière fiche de paye ou listing de paye</td>
                                            <td className="text-center">
                                                {checklist.fiche_paye ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Lettre de recommandation de l'employeur</td>
                                            <td className="text-center">
                                                {checklist.recommandation ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Caution de l'employeur</td>
                                            <td className="text-center">
                                                {checklist.caution_employeur ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                <p className="text-decoration-underline mb-2 fw-semibold">Pour les dossiers de crédit des MPME :</p>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Document de l'activité</td>
                                            <td className="text-center">
                                                {checklist.document_activite ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Bilan et compte d'exploitation</td>
                                            <td className="text-center">
                                                {checklist.bilan ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Synthèse de l'ADC */}
                            <div className="mb-3">
                                <p className="fw-bold mb-2">2. Synthèse de l'ADC</p>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- j'ai rencontré le demandeur</td>
                                            <td className="text-center fw-bold">
                                                {checklist.rencontre_adc ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- il a la capacité de rembourser</td>
                                            <td className="text-center fw-bold">
                                                {checklist.capacite_remboursement ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- les informations fournies sont fiables</td>
                                            <td className="text-center fw-bold">
                                                {checklist.fiabilite ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- avis positif sur l'octroi</td>
                                            <td className="text-center fw-bold">
                                                {checklist.avis_positif ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <div className="row mt-3">
                                    <div className="col-md-6 mb-3">
                                        <div className="border p-3 rounded bg-light">
                                            <strong>Date :</strong> {checklist.date_adc ? new Date(checklist.date_adc).toLocaleDateString('fr-FR') : "_________________"}
                                        </div>
                                    </div>
                                    <div className="col-md-6 mb-3">
                                        <div className="border p-3 rounded bg-light">
                                            <strong>Nom et Signature de l'ADC :</strong><br />
                                            {checklist.nom_adc || "_________________"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Superviseur */}
                            <div className="row mb-4">
                                <div className="col-md-6 mb-3">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Date :</strong> {checklist.date_superviseur ? new Date(checklist.date_superviseur).toLocaleDateString('fr-FR') : "_________________"}
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Nom et Signature Superviseur pour contrôle :</strong><br />
                                        {checklist.nom_superviseur || "_________________"}
                                        {checklist.signature && (
                                            <div className="mt-2">
                                                <img 
                                                    src={`/storage/${checklist.signature}`} 
                                                    alt="Signature du superviseur" 
                                                    style={{ maxHeight: "80px", maxWidth: "100%" }}
                                                    className="border p-1 rounded"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/200x80?text=Signature+non+disponible";
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 2. AVANT D'ETABLIR LE CONTRAT DE PRET */}
                            <div className="mb-4">
                                <h6 className="fw-bold text-dark">2. AVANT D'ETABLIR LE CONTRAT DE PRET</h6>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Décision de CTC avec Délégation du pouvoir</td>
                                            <td className="text-center fw-bold">
                                                {checklist.decision_ctc ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Décision CC</td>
                                            <td className="text-center fw-bold">
                                                {checklist.decision_cc ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* 3. AVANT DEBOURSEMENT */}
                            <div className="mb-4">
                                <h6 className="fw-bold text-dark">3. AVANT DEBOURSEMENT</h6>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Contrat de prêt dument rempli et signé</td>
                                            <td className="text-center fw-bold">
                                                {checklist.contrat_signe ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Garantie correctement constituées</td>
                                            <td className="text-center fw-bold">
                                                {checklist.garanties_constituees ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- J'ai rencontré le demandeur</td>
                                            <td className="text-center fw-bold">
                                                {checklist.rencontre_client ? (
                                                    <span className="text-success">OUI</span>
                                                ) : (
                                                    <span className="text-danger">NON</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                
                                <p className="fw-bold mt-3">Liste des Garanties</p>
                                <table className="table table-bordered">
                                    <tbody>
                                        <tr>
                                            <td className="w-75">- Mandat/Inscription hypothécaire</td>
                                            <td className="text-center">
                                                {checklist.hypothèque ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Lettre de garantie ou de caution</td>
                                            <td className="text-center">
                                                {checklist.lettre_garantie ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Domiciliation de salaire</td>
                                            <td className="text-center">
                                                {checklist.domiciliation_salaire ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- DAT</td>
                                            <td className="text-center">
                                                {checklist.dat ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Aval/Garant</td>
                                            <td className="text-center">
                                                {checklist.aval ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="w-75">- Constitution de gage (nantissement de biens)</td>
                                            <td className="text-center">
                                                {checklist.nantissement ? (
                                                    <span className="text-success fw-bold fs-5">✓</span>
                                                ) : (
                                                    <span className="text-muted fs-5">☐</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Analyste */}
                            <div className="row mt-4">
                                <div className="col-md-6">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Date :</strong> {checklist.date_analyste ? new Date(checklist.date_analyste).toLocaleDateString('fr-FR') : "_________________"}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="border p-3 rounded bg-light">
                                        <strong>Nom et Signature de l'analyste de risque et conformité :</strong><br />
                                        {checklist.nom_analyste || "_________________"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Styles d'impression */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                    }
                    .no-print {
                        display: none !important;
                    }
                    #print-area-visualisation {
                        box-shadow: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .card {
                        border: none !important;
                    }
                    .container-fluid {
                        padding: 0 !important;
                    }
                    table {
                        page-break-inside: avoid;
                    }
                    .bg-light {
                        background-color: #f8f9fa !important;
                        -webkit-print-color-adjust: exact;
                        print-color-adjust: exact;
                    }
                    @page {
                        size: auto;
                        margin: 15mm;
                    }
                }
            `}</style>
        </div>
    );
}