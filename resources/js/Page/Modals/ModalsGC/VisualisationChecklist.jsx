import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function VisualisationChecklist({
    dossierId,
    NumDossier,
    onClose,
    checklistData,
}) {
    const [checklist, setChecklist] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const organisation = {
        nom: "COOPEC AKIBA YETU",
        slogan: "Ensemble pour un avenir prospère",
        adresse: "123 Avenue de la Paix, Kinshasa/Gombe, RDC",
        telephone: "+243 812 345 678",
        email: "contact@coopecakibayetu.org",
        siteWeb: "www.coopecakibayetu.org",
        logo: "/images/logo/logo.png",
    };

    useEffect(() => {
        if (checklistData) {
            setChecklist(checklistData);
            setIsLoading(false);
        } else {
            setIsLoading(false);
            setChecklist(null);
        }
    }, [checklistData]);

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
                        <i className="fas fa-arrow-left me-2"></i>Retour
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-2" style={{ backgroundColor: "#f8f9fa" }}>
            {/* Contenu à imprimer */}
            <div className="card shadow-sm border-0" id="print-area-visualisation">
                <div className="card-body p-2">
                    {/* ================= BLOC 1 ================= */}
                    <div className="print-block">
                        {/* EN‑TÊTE compact */}
                        <div className="text-center mb-2">
                            <img
                                src={organisation.logo}
                                alt="Logo"
                                style={{ height: "50px", width: "auto", objectFit: "contain" }}
                                className="print-logo"
                            />
                            <h1 className="fw-bold mb-0" style={{ color: "#1a5f4b", fontSize: "1.4rem" }}>
                                {organisation.nom}
                            </h1>
                            <p className="mb-0 text-muted small">{organisation.slogan}</p>
                            <p className="mb-0 small text-muted">{organisation.adresse}</p>
                            <p className="small text-muted">Tél: {organisation.telephone} | Email: {organisation.email}</p>
                            <hr className="my-1" style={{ borderTop: "2px solid #20c997" }} />
                        </div>

                        <h2 className="text-uppercase fw-bold text-center mb-2" style={{ color: "#20c997", fontSize: "1.2rem" }}>
                            CHECK‑LIST DOSSIER DE CREDIT N° #{checklist.numero_dossier}
                        </h2>
                        <hr className="my-1" style={{ borderTop: "2px solid #20c997" }} />

                        {/* I. Généralités */}
                        <div className="mb-2">
                            <h5 className="fw-bold text-primary mb-1">I — Généralités</h5>
                            <div className="row g-1">
                                <div className="col-6">
                                    <div className="border px-1 py-0 bg-light rounded"><strong>Agence :</strong> {checklist.agence || "_______________"}</div>
                                </div>
                                <div className="col-6">
                                    <div className="border px-1 py-0 bg-light rounded"><strong>Date :</strong> {checklist.date_etablissement ? new Date(checklist.date_etablissement).toLocaleDateString("fr-FR") : "_______________"}</div>
                                </div>
                            </div>
                        </div>

                        {/* II. Références */}
                        <div className="mb-2">
                            <h5 className="fw-bold text-primary mb-1">II — Références du demandeur</h5>
                            <div className="border px-1 py-0 bg-light rounded mb-1"><strong>Nom :</strong> {checklist.nom_demandeur || "_______________"}</div>
                            <div className="border px-1 py-0 bg-light rounded mb-1"><strong>N° Dossier :</strong> {checklist.numero_dossier || "_______________"}</div>
                            <div className="border px-1 py-0 bg-light rounded"><strong>Montant :</strong> {checklist.montant || "_______________"}</div>
                        </div>

                        {/* III. Liste de vérifications */}
                        <h5 className="fw-bold text-primary mb-1">III — Liste de vérifications</h5>

                        {/* 1. INTRODUCTION */}
                        <div className="mb-2">
                            <h6 className="fw-bold mb-0">1. INTRODUCTION DU DOSSIER</h6>
                            <p className="fw-bold mb-0 mt-1">1. Inventaire des documents</p>
                            <p className="text-decoration-underline mb-0 fw-semibold">Pour tous les dossiers :</p>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td className="w-75">- Documents d'identité</td><td className="text-center">{checklist.piece_identite ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Lettre de demande du membre</td><td className="text-center">{checklist.lettre_demande ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Formulaire de demande de prêt</td><td className="text-center">{checklist.formulaire_pret ? "✓" : "☐"}</td></tr>
                                </tbody>
                            </table>

                            <p className="text-decoration-underline mb-0 fw-semibold">Salariés :</p>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- Contrat d'embauche</td><td className="text-center">{checklist.contrat_travail ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Dernière fiche de paye</td><td className="text-center">{checklist.fiche_paye ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Lettre recommandation employeur</td><td className="text-center">{checklist.recommandation ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Caution employeur</td><td className="text-center">{checklist.caution_employeur ? "✓" : "☐"}</td></tr>
                                </tbody>
                            </table>

                            <p className="text-decoration-underline mb-0 fw-semibold">MPME :</p>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- Document de l'activité</td><td className="text-center">{checklist.document_activite ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Bilan et compte d'exploitation</td><td className="text-center">{checklist.bilan ? "✓" : "☐"}</td></tr>
                                </tbody>
                            </table>

                            <p className="fw-bold mb-0 mt-1">2. Synthèse de l'ADC</p>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- j'ai rencontré le demandeur</td><td className="text-center fw-bold">{checklist.rencontre_adc ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- il a la capacité de rembourser</td><td className="text-center fw-bold">{checklist.capacite_remboursement ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- les infos fournies sont fiables</td><td className="text-center fw-bold">{checklist.fiabilite ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- avis positif sur l'octroi</td><td className="text-center fw-bold">{checklist.avis_positif ? "OUI" : "NON"}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 2. AVANT CONTRAT */}
                        <div className="mb-2 print-keep-together">
                            <h6 className="fw-bold mb-0">2. AVANT D'ETABLIR LE CONTRAT DE PRET</h6>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- Décision de CTC avec Délégation</td><td className="text-center fw-bold">{checklist.decision_ctc ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- Décision CC</td><td className="text-center fw-bold">{checklist.decision_cc ? "OUI" : "NON"}</td></tr>
                                </tbody>
                            </table>
                        </div>

                        {/* 3. AVANT DÉBOURSEMENT + GARANTIES */}
                        <div className="mb-2 print-keep-together">
                            <h6 className="fw-bold mb-0">3. AVANT DEBOURSEMENT</h6>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- Contrat de prêt signé</td><td className="text-center fw-bold">{checklist.contrat_signe ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- Garanties constituées</td><td className="text-center fw-bold">{checklist.garanties_constituees ? "OUI" : "NON"}</td></tr>
                                    <tr><td>- Rencontre demandeur</td><td className="text-center fw-bold">{checklist.rencontre_client ? "OUI" : "NON"}</td></tr>
                                </tbody>
                            </table>
                            <p className="fw-bold mb-0">Liste des Garanties</p>
                            <table className="table table-bordered compact-table">
                                <tbody>
                                    <tr><td>- Mandat/Inscription hypothécaire</td><td className="text-center">{checklist.hypothèque ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Lettre de garantie ou caution</td><td className="text-center">{checklist.lettre_garantie ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Domiciliation de salaire</td><td className="text-center">{checklist.domiciliation_salaire ? "✓" : "☐"}</td></tr>
                                    <tr><td>- DAT</td><td className="text-center">{checklist.dat ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Aval/Garant</td><td className="text-center">{checklist.aval ? "✓" : "☐"}</td></tr>
                                    <tr><td>- Nantissement de biens</td><td className="text-center">{checklist.nantissement ? "✓" : "☐"}</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* ================= BLOC 2 (signatures, commentaires, dates) ================= */}
                    <div className="print-block mt-2">
                        {/* Commentaire analyste */}
                        <div className="border p-1 bg-light rounded mb-2">
                            <strong>Commentaire de l’analyste :</strong><br />
                            {checklist.commentaire_analyste || "_________________"}
                        </div>

                        <div className="row g-1 mb-2">
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Date d’analyse :</strong><br />{checklist.date_analyste ? new Date(checklist.date_analyste).toLocaleDateString("fr-FR") : "_______________"}</div>
                            </div>
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Nom de l’analyste :</strong><br />{checklist.nom_analyste || "_______________"}</div>
                            </div>
                        </div>

                       <div className="border p-1 bg-light rounded mb-2 d-flex align-items-center">
    <strong className="me-1">Signature de l’analyste (risque & conformité) :</strong>
    {checklist.signature_analyste ? (
        <span className="d-inline-flex align-items-center">
            <img
                src={`/storage/${checklist.signature_analyste}`}
                alt="signature analyste"
                style={{ height: "25px", width: "auto", marginLeft: "5px" }}
            />
            <span className="small text-muted ms-1">(électronique)</span>
        </span>
    ) : (
        <span className="signature-placeholder d-inline-block" style={{ width: "150px", height: "25px", borderBottom: "1px solid #000", marginLeft: "5px" }}></span>
    )}
</div>

                        <div className="row g-1 mb-2">
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Date validation superviseur :</strong><br />{checklist.date_superviseur ? new Date(checklist.date_superviseur).toLocaleDateString("fr-FR") : "_______________"}</div>
                            </div>
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Nom superviseur :</strong><br />{checklist.nom_superviseur || "_______________"}</div>
                            </div>
                        </div>
<div className="border p-1 bg-light rounded mb-2 d-flex align-items-center">
    <strong className="me-1">Signature superviseur :</strong>
    {checklist.signature ? (
        <span className="d-inline-flex align-items-center">
            <img
                src={`/storage/${checklist.signature}`}
                alt="signature superviseur"
                style={{ height: "25px", width: "auto", marginLeft: "5px" }}
            />
            <span className="small text-muted ms-1">(électronique)</span>
        </span>
    ) : (
        <span className="signature-placeholder d-inline-block" style={{ width: "150px", height: "25px", borderBottom: "1px solid #000", marginLeft: "5px" }}></span>
    )}
</div>

                        <div className="row g-1">
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Date ADC :</strong><br />{checklist.date_adc ? new Date(checklist.date_adc).toLocaleDateString("fr-FR") : "_______________"}</div>
                            </div>
                            <div className="col-6">
                                <div className="border p-1 bg-light rounded"><strong>Nom / Signature ADC :</strong><br />{checklist.nom_adc || "_______________"}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* STYLES D'IMPRESSION – TENIR EXACTEMENT SUR 2 PAGES */}
            <style>{`
                @media print {
                    body {
                        margin: 0;
                        padding: 0;
                        background: white;
                        font-size: 8.5pt !important;
                        line-height: 1.2 !important;
                    }
                    .container-fluid, .card, .card-body {
                        padding: 0 !important;
                        margin: 0 !important;
                    }
                    /* Réduction des espaces */
                    .mb-2, .mb-1, .mt-1, .mt-2, .my-1, .g-1 {
                        margin-bottom: 2px !important;
                        margin-top: 2px !important;
                    }
                    .border {
                        padding: 2px !important;
                    }
                    h1 { font-size: 14pt !important; margin: 0 !important; }
                    h2 { font-size: 12pt !important; margin: 2px 0 !important; }
                    h5 { font-size: 10pt !important; margin: 2px 0 !important; }
                    h6 { font-size: 9pt !important; margin: 2px 0 !important; }
                    p { margin: 1px 0 !important; }
                    .compact-table td, .compact-table th {
                        padding: 1px 2px !important;
                        font-size: 8pt !important;
                    }
                    table {
                        margin-bottom: 2px !important;
                    }
                    .print-logo {
                        height: 35px !important;
                    }
                    .print-signature {
                        max-height: 30px !important;
                        width: auto;
                    }
                    .signature-placeholder {
                        height: 30px;
                        border-bottom: 1px solid #000;
                        width: 150px;
                        margin-top: 4px;
                    }
                    /* Éviter les coupures dans les blocs principaux */
                    .print-block, .print-keep-together, .border, .row {
                        page-break-inside: avoid;
                    }
                    /* Forcer la répartition sur deux pages */
                    .print-block:first-child {
                        page-break-after: avoid;
                    }
                    /* Pas de saut intempestif */
                    .card-body {
                        display: block;
                    }
                    @page {
                        size: A4;
                        margin: 8mm;
                    }

                    .d-flex {
    display: flex !important;
}
.align-items-center {
    align-items: center !important;
}
.border .d-inline-flex {
    line-height: 1 !important;
}
img[alt*="signature"] {
    height: 25px !important;
    width: auto !important;
    margin: 0 !important;
    padding: 0 !important;
}
.signature-placeholder {
    height: 25px !important;
}
                }
            `}</style>
        </div>
    );
}