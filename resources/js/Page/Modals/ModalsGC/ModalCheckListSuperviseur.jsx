import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import VisualisationChecklist from "./VisualisationChecklist";
import ModalEditChecklist from "./ModalEditChecklist";
import "../../../styles/style.css";

export default function ModalCheckListSuperviseur({
    dossierId,
    NumDossier,
    onClose,
}) {
    const [dossier, setDossier] = useState(null);
    const [isLoadingBar, setIsLoadingBar] = useState(false);
    const [progress, setProgress] = useState(0);
    const [signatureImage, setSignatureImage] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null);
    const [showVisualisation, setShowVisualisation] = useState(false);
    const [checklistData, setChecklistData] = useState(null);
    const [isLoadingChecklist, setIsLoadingChecklist] = useState(false);
    const fileInputRef = useRef(null);
    // Dans la section des states, ajoutez :
const [signatureAnalyste, setSignatureAnalyste] = useState(null);
const [signatureAnalystePreview, setSignatureAnalystePreview] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const fileInputRefAnalyste = useRef(null);
    const [form, setForm] = useState({
        agence: "",
        date_etablissement: "",
        nom_demandeur: "",
        numero_dossier: "",
        montant: "",
        type_client: "",

        // Documents
        piece_identite: false,
        lettre_demande: false,
        formulaire_pret: false,

        contrat_travail: false,
        fiche_paye: false,
        recommandation: false,
        caution_employeur: false,

        document_activite: false,
        bilan: false,

        // Analyse
        rencontre_adc: "",
        capacite_remboursement: "",
        fiabilite: "",
        avis_positif: "",
        date_adc: "",
        nom_adc: "",

        // Validation
        decision_ctc: false,
        decision_cc: false,

        // Décaissement
        contrat_signe: false,
        garanties_constituees: false,
        rencontre_client: false,

        // Garanties
        hypothèque: false,
        lettre_garantie: false,
        domiciliation_salaire: false,
        dat: false,
        aval: false,
        nantissement: false,

        // Superviseur
        date_superviseur: "",
        nom_superviseur: "",

        // Analyste
        date_analyste: "",
        nom_analyste: "",
        commentaire_analyste:"",
    });


    useEffect(() => {
     console.log("this is data"+ dossierId)
    }, [])
    
    // Vérifier si la checklist existe déjà pour ce dossier
    const checkExistingChecklist = async () => {
        try {
            setIsLoadingChecklist(true);
            const response = await axios.get(
                `/gestion_credit/dossier/credit-checklists/${dossierId}`,
            );
            console.log(response);

            if (
                response.data &&
                response.data.status === 1 &&
                response.data.data
            ) {
                setChecklistData(response.data.data);
                return true;
            }
            return false;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                return false;
            }
            console.error("Erreur lors de la vérification:", error);
            return false;
        } finally {
            setIsLoadingChecklist(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSignatureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (
                !file.type.match("image/jpeg") &&
                !file.type.match("image/png")
            ) {
                Swal.fire({
                    icon: "error",
                    title: "Format non supporté",
                    text: "Veuillez choisir une image au format JPEG ou PNG",
                    confirmButtonColor: "#20c997",
                });
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                Swal.fire({
                    icon: "error",
                    title: "Fichier trop volumineux",
                    text: "La signature ne doit pas dépasser 5 Mo",
                    confirmButtonColor: "#20c997",
                });
                return;
            }

            setSignatureImage(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setSignaturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };


    // Ajoutez les gestionnaires :
const handleSignatureAnalysteChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
            Swal.fire({
                icon: "error",
                title: "Format non supporté",
                text: "Veuillez choisir une image au format JPEG ou PNG",
                confirmButtonColor: "#20c997",
            });
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: "error",
                title: "Fichier trop volumineux",
                text: "La signature ne doit pas dépasser 5 Mo",
                confirmButtonColor: "#20c997",
            });
            return;
        }
        setSignatureAnalyste(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setSignatureAnalystePreview(reader.result);
        };
        reader.readAsDataURL(file);
    }
};

const handleDeleteSignatureAnalyste = () => {
    setSignatureAnalyste(null);
    setSignatureAnalystePreview(null);
    if (fileInputRefAnalyste.current) {
        fileInputRefAnalyste.current.value = "";
    }
};


//     const handleSubmit = async (e) => {
//          e.preventDefault();
//         try {
//             setIsLoadingBar(true);
//             setProgress(0);

//             const dataToSend = new FormData();

//             Object.keys(form).forEach((key) => {
//                 if (key !== "signature") {
//                     dataToSend.append(key, form[key]);
//                 }
//             });

//             if (signatureImage) {
//                 dataToSend.append("signature", signatureImage);
//             }

//             if (signatureAnalyste) {
//     dataToSend.append("signature_analyste", signatureAnalyste);
// }


//             dataToSend.append("idCredit", dossierId);

//             const interval = setInterval(() => {
//                 setProgress((prev) => {
//                     if (prev >= 90) {
//                         clearInterval(interval);
//                         return 90;
//                     }
//                     return prev + 10;
//                 });
//             }, 200);

//             const response = await axios.post(
//                 "/gestion_credit/dossier/credit-checklists",
//                 dataToSend,
//                 {
//                     headers: {
//                         "Content-Type": "multipart/form-data",
//                     },
//                 },
//             );

//             clearInterval(interval);
//             setProgress(100);

//             setTimeout(() => {
//                 setIsLoadingBar(false);
//                 Swal.fire({
//                     icon: "success",
//                     title: "Succès !",
//                     text: "Checklist enregistrée avec succès",
//                     confirmButtonColor: "#20c997",
//                     timer: 2000,
//                 });

//                 // setTimeout(() => {
//                 //     onClose();
//                 // }, 2000);
//             }, 500);
//         } catch (error) {
//             setIsLoadingBar(false);
//             console.error(error);
//             Swal.fire({
//                 icon: "error",
//                 title: "Erreur",
//                 text: "Erreur lors de l'enregistrement de la checklist",
//                 confirmButtonColor: "#20c997",
//             });
//         }
//     };

const handleSubmit = async (e) => {
    e.preventDefault();
    let interval; // déclarer ici pour y accéder dans catch
    try {
        setIsLoadingBar(true);
        setProgress(0);

        const dataToSend = new FormData();
        // ... remplissage du FormData ...

        interval = setInterval(() => {
            setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 200);

        const response = await axios.post("/gestion_credit/dossier/credit-checklists", dataToSend, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        clearInterval(interval);
        setProgress(100);
        setTimeout(() => {
            setIsLoadingBar(false);
            Swal.fire({
                icon: "success",
                title: "Succès !",
                text: "Checklist enregistrée avec succès",
                confirmButtonColor: "#20c997",
                timer: 2000,
            });
        }, 500);
    } catch (error) {
        if (interval) clearInterval(interval);
        setIsLoadingBar(false);
        console.error(error);

        let errorMessage = "Erreur lors de l'enregistrement de la checklist";
        if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        }

        Swal.fire({
            icon: "error",
            title: "Erreur",
            text: errorMessage,
            confirmButtonColor: "#20c997",
        });
    }
};
    const handleDeleteSignature = () => {
        setSignatureImage(null);
        setSignaturePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleVisualiser = async () => {
        const exists = await checkExistingChecklist();
        if (exists) {
            setShowVisualisation(true);
        } else {
            Swal.fire({
                icon: "warning",
                title: "Checklist non trouvée",
                text: "Veuillez d'abord remplir et enregistrer la checklist avant de la visualiser.",
                confirmButtonColor: "#20c997",
                confirmButtonText: "OK",
            });
        }
    };

    // Fonction pour imprimer/télécharger
    const handlePrint = () => {
        const printContent = document.getElementById(
            "print-area-visualisation",
        );
        if (printContent) {
            const originalTitle = document.title;
            document.title = `Checklist_${checklistData?.numero_dossier || "dossier"}_${dossierId}`;

            const printWindow = window.open("", "_blank");
            printWindow.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Checklist Dossier de Crédit</title>
                    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
                    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
                    <style>
                        @media print {
                            body {
                                margin: 0;
                                padding: 20px;
                            }
                            .no-print {
                                display: none !important;
                            }
                            .card {
                                border: none !important;
                                box-shadow: none !important;
                            }
                            .bg-light {
                                background-color: #f8f9fa !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .text-primary {
                                color: #20c997 !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .text-success {
                                color: #28a745 !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            .text-danger {
                                color: #dc3545 !important;
                                -webkit-print-color-adjust: exact;
                                print-color-adjust: exact;
                            }
                            table {
                                page-break-inside: avoid;
                            }
                            @page {
                                size: auto;
                                margin: 15mm;
                            }
                        }
                    </style>
                </head>
                <body>
                    <div class="container-fluid">
                        ${printContent.innerHTML}
                    </div>
                    <script>
                        window.onload = () => {
                            window.print();
                            setTimeout(() => window.close(), 500);
                        };
                    <\/script>
                </body>
                </html>
            `);
            printWindow.document.close();

            document.title = originalTitle;
        }
    };

    return (
        <>
            {/* Modal principal du formulaire */}
            <div
                className="modal fade show"
                tabIndex="-1"
                aria-hidden="true"
                id="modalCheckListSuperviseur"
                style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
            >
                <div className="modal-dialog modal-xl" style={{ maxHeight: "100vh", display: "flex", flexDirection: "column" }}>
                    <div className="modal-content border-0 shadow-lg rounded-3">
                        {/* Header avec bouton visualiser */}
                        <div
                            className="modal-header bg-gradient-primary text-white rounded-top-3"
                            style={{
                                background:
                                    "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                borderBottom: "none",
                                padding: "1rem 1.5rem",
                            }}
                        >
                            <div className="w-100">
                                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                                    <div className="d-flex align-items-center gap-3 flex-wrap">
                                        <i className="fas fa-folder-open fa-2x"></i>
                                        <h5 className="mb-0 fw-bold" >
                                            Checklist Dossier de Crédit N° 
                                           <span style={{color:"green" }}> #{NumDossier??NumDossier}</span>
                                            {}
                                        </h5>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button className="btn btn-warning" onClick={() => setShowEditModal(true)}>
    <i className="fas fa-edit"></i> Modifier
</button>

{showEditModal && (
    <ModalEditChecklist
        dossierId={dossierId}
        NumDossier={NumDossier??NumDossier}
        onClose={() => setShowEditModal(false)}
        onUpdate={() => {
            // Recharger les données si nécessaire
            checkExistingChecklist();
        }}
    />
)}
                                        <button
                                            type="button"
                                            className="btn btn-light btn-sm"
                                            onClick={handleVisualiser}
                                            disabled={isLoadingChecklist}
                                            style={{
                                                backgroundColor:
                                                    "rgba(255,255,255,0.2)",
                                                border: "1px solid rgba(255,255,255,0.3)",
                                                color: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.target.style.backgroundColor =
                                                    "rgba(255,255,255,0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.backgroundColor =
                                                    "rgba(255,255,255,0.2)";
                                            }}
                                        >
                                            {isLoadingChecklist ? (
                                                <>
                                                    <span
                                                        className="spinner-border spinner-border-sm me-2"
                                                        role="status"
                                                        aria-hidden="true"
                                                    ></span>
                                                    Vérification...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fas fa-eye me-2"></i>
                                                    Visualiser
                                                </>
                                            )}
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-close btn-close-white"
                                            data-dismiss="modal"
                                            aria-label="Close"
                                            onClick={onClose}
                                        ></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Corps du formulaire */}
                        <div
                            className="modal-body p-4"
                            style={{ maxHeight: "80vh", overflowY: "auto" }}
                        >
                            {/* Loader amélioré */}
                            {isLoadingBar && (
                                <div
                                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                                    style={{
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        zIndex: 9999,
                                        backdropFilter: "blur(4px)",
                                    }}
                                >
                                    <div
                                        className="bg-white rounded-4 p-4 text-center shadow-lg"
                                        style={{ minWidth: "250px" }}
                                    >
                                        <div
                                            className="spinner-border text-primary mb-3"
                                            role="status"
                                            style={{
                                                width: "3rem",
                                                height: "3rem",
                                            }}
                                        >
                                            <span className="visually-hidden">
                                                Chargement...
                                            </span>
                                        </div>
                                        <h6 className="mb-2">
                                            Traitement en cours
                                        </h6>
                                        <div
                                            className="progress"
                                            style={{ height: "8px" }}
                                        >
                                            <div
                                                className="progress-bar progress-bar-striped progress-bar-animated"
                                                style={{
                                                    width: `${progress}%`,
                                                    backgroundColor: "#20c997",
                                                }}
                                            ></div>
                                        </div>
                                        <p className="text-muted mt-2 mb-0">
                                            {progress}%
                                        </p>
                                    </div>
                                </div>
                            )}
                            <div className="container mt-4">
                                <div className="card shadow-lg border-0 rounded-4">
                                    <div
                                        className="card-header bg-gradient-primary text-white rounded-top-3"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                        }}
                                    >
                                        <h5 className="mb-0">
                                            Formulaire de vérification
                                        </h5>
                                    </div>

                                    <div className="card-body">
                                        {/* GENERAL */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-info-circle me-2"></i>
                                            I. Généralités
                                        </h6>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold" >
                                                    Agence
                                                </label>
                                                <input
                                                    name="agence"
                                                    className="form-control"
                                                    placeholder="Agence"
                                                    value={form.agence}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Date
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date_etablissement"
                                                    className="form-control"
                                                    value={
                                                        form.date_etablissement
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* DEMANDEUR */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-user me-2"></i>
                                            II. Références du demandeur
                                        </h6>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Nom du demandeur
                                                </label>
                                                <input
                                                    name="nom_demandeur"
                                                    className="form-control"
                                                    placeholder="Nom"
                                                    value={form.nom_demandeur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    N° Dossier
                                                </label>
                                                <input
                                                    name="numero_dossier"
                                                    className="form-control"
                                                    placeholder="N° Dossier"
                                                    value={form.numero_dossier}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label fw-semibold">
                                                    Montant
                                                </label>
                                                <input
                                                    name="montant"
                                                    className="form-control"
                                                    placeholder="Montant"
                                                    value={form.montant}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6 mt-2">
                                                <label className="form-label fw-semibold">
                                                    Type client
                                                </label>
                                                <select
                                                    name="type_client"
                                                    className="form-select"
                                                    value={form.type_client}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">
                                                        Type client
                                                    </option>
                                                    <option value="salarie">
                                                        Salarié
                                                    </option>
                                                    <option value="mpme">
                                                        MPME
                                                    </option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* DOCUMENTS */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-file-alt me-2"></i>
                                            III. Documents
                                        </h6>
                                        <div className="mb-3">
                                            <label className="fw-semibold">
                                                Généraux
                                            </label>
                                            <div className="mt-2">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="piece_identite"
                                                        checked={
                                                            form.piece_identite
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Pièce d'identité
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="lettre_demande"
                                                        checked={
                                                            form.lettre_demande
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Lettre demande
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="formulaire_pret"
                                                        checked={
                                                            form.formulaire_pret
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Formulaire prêt
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {form.type_client === "salarie" && (
                                            <div className="mb-3">
                                                <label className="fw-semibold">
                                                    Salarié
                                                </label>
                                                <div className="mt-2">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="contrat_travail"
                                                            checked={
                                                                form.contrat_travail
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Contrat travail
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="fiche_paye"
                                                            checked={
                                                                form.fiche_paye
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Fiche de paye
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="recommandation"
                                                            checked={
                                                                form.recommandation
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Recommandation
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="caution_employeur"
                                                            checked={
                                                                form.caution_employeur
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Caution employeur
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {form.type_client === "mpme" && (
                                            <div className="mb-3">
                                                <label className="fw-semibold">
                                                    MPME
                                                </label>
                                                <div className="mt-2">
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="document_activite"
                                                            checked={
                                                                form.document_activite
                                                            }
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Document activité
                                                        </label>
                                                    </div>
                                                    <div className="form-check">
                                                        <input
                                                            type="checkbox"
                                                            className="form-check-input"
                                                            name="bilan"
                                                            checked={form.bilan}
                                                            onChange={
                                                                handleChange
                                                            }
                                                        />
                                                        <label className="form-check-label">
                                                            Bilan
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* ANALYSE */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-chart-line me-2"></i>
                                            IV. Analyse ADC
                                        </h6>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <select
                                                    name="rencontre_adc"
                                                    className="form-select mb-2"
                                                    value={form.rencontre_adc}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">
                                                        Rencontré ?
                                                    </option>
                                                    <option value="oui">
                                                        Oui
                                                    </option>
                                                    <option value="non">
                                                        Non
                                                    </option>
                                                </select>
                                                <select
                                                    name="capacite_remboursement"
                                                    className="form-select mb-2"
                                                    value={
                                                        form.capacite_remboursement
                                                    }
                                                    onChange={handleChange}
                                                >
                                                    <option value="">
                                                        Capacité remboursement
                                                    </option>
                                                    <option value="oui">
                                                        Oui
                                                    </option>
                                                    <option value="non">
                                                        Non
                                                    </option>
                                                </select>
                                                <select
                                                    name="fiabilite"
                                                    className="form-select mb-2"
                                                    value={form.fiabilite}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">
                                                        Infos fiables ?
                                                    </option>
                                                    <option value="oui">
                                                        Oui
                                                    </option>
                                                    <option value="non">
                                                        Non
                                                    </option>
                                                </select>
                                            </div>
                                            <div className="col-md-6">
                                                <select
                                                    name="avis_positif"
                                                    className="form-select mb-2"
                                                    value={form.avis_positif}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">
                                                        Avis
                                                    </option>
                                                    <option value="oui">
                                                        Positif
                                                    </option>
                                                    <option value="non">
                                                        Négatif
                                                    </option>
                                                </select>
                                                <input
                                                    type="date"
                                                    name="date_adc"
                                                    className="form-control mb-2"
                                                    value={form.date_adc}
                                                    onChange={handleChange}
                                                    placeholder="Date ADC"
                                                />
                                                <input
                                                    name="nom_adc"
                                                    className="form-control mb-3"
                                                    placeholder="Nom ADC"
                                                    value={form.nom_adc}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* VALIDATION */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-check-circle me-2"></i>
                                            V. Avant Contrat
                                        </h6>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="decision_ctc"
                                                    checked={form.decision_ctc}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Décision CTC
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="decision_cc"
                                                    checked={form.decision_cc}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Décision CC
                                                </label>
                                            </div>
                                        </div>

                                        {/* DECAISSEMENT */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-money-bill-wave me-2"></i>
                                            VI. Avant Décaissement
                                        </h6>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="contrat_signe"
                                                    checked={form.contrat_signe}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Contrat signé
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="garanties_constituees"
                                                    checked={
                                                        form.garanties_constituees
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Garanties constituées
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="rencontre_client"
                                                    checked={
                                                        form.rencontre_client
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Rencontre client
                                                </label>
                                            </div>
                                        </div>

                                        {/* GARANTIES */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-shield-alt me-2"></i>
                                            VII. Garanties
                                        </h6>
                                        <div className="mb-3">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="hypothèque"
                                                    checked={form.hypothèque}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Hypothèque
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="lettre_garantie"
                                                    checked={
                                                        form.lettre_garantie
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Lettre garantie
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="domiciliation_salaire"
                                                    checked={
                                                        form.domiciliation_salaire
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Domiciliation salaire
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="dat"
                                                    checked={form.dat}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    DAT
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="aval"
                                                    checked={form.aval}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Aval
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="nantissement"
                                                    checked={form.nantissement}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Nantissement
                                                </label>
                                            </div>
                                             <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="salaire"
                                                    checked={form.salaire}
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Salaire
                                                </label>
                                            </div>
                                        </div>

                                        {/* SECTION SUPERVISEUR */}
                                        <h6 className="text-primary mb-3">
                                            <i className="fas fa-signature me-2"></i>
                                            VIII. Validation Superviseur
                                        </h6>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Date de validation
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date_superviseur"
                                                    className="form-control"
                                                    value={
                                                        form.date_superviseur
                                                    }
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Nom du superviseur
                                                </label>
                                                <input
                                                    name="nom_superviseur"
                                                    className="form-control"
                                                    placeholder="Superviseur"
                                                    value={form.nom_superviseur}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>

                                        {/* Zone de signature */}
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold">
                                                Signature du superviseur
                                            </label>
                                            <div
                                                className="border rounded-3 p-3"
                                                style={{
                                                    backgroundColor: "#f8f9fa",
                                                }}
                                            >
                                                <div className="text-center mb-3">
                                                    {signaturePreview ? (
                                                        <div className="position-relative d-inline-block">
                                                            <img
                                                                src={
                                                                    signaturePreview
                                                                }
                                                                alt="Signature"
                                                                style={{
                                                                    maxHeight:
                                                                        "150px",
                                                                    maxWidth:
                                                                        "100%",
                                                                }}
                                                                className="border rounded"
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle-y"
                                                                onClick={
                                                                    handleDeleteSignature
                                                                }
                                                                style={{
                                                                    borderRadius:
                                                                        "50%",
                                                                    padding:
                                                                        "0 6px",
                                                                }}
                                                            >
                                                                <i className="fas fa-times"></i>
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="text-muted py-4">
                                                            <i className="fas fa-pen fa-3x mb-2"></i>
                                                            <p>
                                                                Aucune signature
                                                                téléchargée
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="d-flex justify-content-center gap-3">
                                                    <label className="btn btn-outline-primary">
                                                        <i className="fas fa-upload me-2"></i>
                                                        Télécharger la signature
                                                        <input
                                                            type="file"
                                                            ref={fileInputRef}
                                                            accept="image/jpeg,image/png"
                                                            onChange={
                                                                handleSignatureChange
                                                            }
                                                            style={{
                                                                display: "none",
                                                            }}
                                                        />
                                                    </label>
                                                    {signaturePreview && (
                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger"
                                                            onClick={
                                                                handleDeleteSignature
                                                            }
                                                        >
                                                            <i className="fas fa-trash-alt me-2"></i>
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                                <small className="text-muted d-block text-center mt-2">
                                                    Formats acceptés : JPEG, PNG
                                                    (max 5 Mo)
                                                </small>
                                            </div>
                                        </div>

                                        {/* SECTION ANALYSTE */}
                                        {/* <h6 className="text-primary mb-3">
                                            <i className="fas fa-user-check me-2"></i>
                                            IX. Informations Analyste
                                        </h6>
                                        <div className="row mb-3">
                                          <div className="col-md-12">
                                            
                                            <label class="form-label fw-semibold">Commentaire Analyste</label> <br />
                                             <textarea class="modern-textarea" rows="3"  placeholder="Écrivez ici..."
                                                  name="commentaire_analyste"
                                             value={form.commentaire_analyste}
                                                    onChange={handleChange}
                                             
                                             ></textarea>
                                          </div>
                                        </div>
                                        <div className="col-md-12 mb-3">
    <label className="form-label fw-semibold">Signature de l'analyste</label>
    <div className="border rounded-3 p-3" style={{ backgroundColor: "#f8f9fa" }}>
        <div className="text-center mb-3">
            {signatureAnalystePreview ? (
                <div className="position-relative d-inline-block">
                    <img
                        src={signatureAnalystePreview}
                        alt="Signature Analyste"
                        style={{ maxHeight: "150px", maxWidth: "100%" }}
                        className="border rounded"
                    />
                    <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle-y"
                        onClick={handleDeleteSignatureAnalyste}
                        style={{ borderRadius: "50%", padding: "0 6px" }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            ) : (
                <div className="text-muted py-4">
                    <i className="fas fa-pen fa-3x mb-2"></i>
                    <p>Aucune signature téléchargée</p>
                </div>
            )}
        </div>
        <div className="d-flex justify-content-center gap-3">
            <label className="btn btn-outline-primary">
                <i className="fas fa-upload me-2"></i>
                Télécharger la signature
                <input
                    type="file"
                    ref={fileInputRefAnalyste}
                    accept="image/jpeg,image/png"
                    onChange={handleSignatureAnalysteChange}
                    style={{ display: "none" }}
                />
            </label>
            {signatureAnalystePreview && (
                <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={handleDeleteSignatureAnalyste}
                >
                    <i className="fas fa-trash-alt me-2"></i>
                    Supprimer
                </button>
            )}
        </div>
        <small className="text-muted d-block text-center mt-2">
            Formats acceptés : JPEG, PNG (max 5 Mo)
        </small>
    </div>
                                         </div>
                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Date d'analyse
                                                </label>
                                                <input
                                                    type="date"
                                                    name="date_analyste"
                                                    className="form-control"
                                                    value={form.date_analyste}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                            <div className="col-md-6">
                                                <label className="form-label fw-semibold">
                                                    Nom de l'analyste
                                                </label>
                                                <input
                                                    name="nom_analyste"
                                                    className="form-control"
                                                    placeholder="Analyste"
                                                    value={form.nom_analyste}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div> */}

                                        <button
                                            onClick={handleSubmit}
                                            className="btn btn-success w-100 py-2"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                                border: "none",
                                            }}
                                        >
                                            <i className="fas fa-save me-2"></i>
                                            Enregistrer la checklist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal de visualisation */}
            {showVisualisation && (
                <div
                    className="modal fade show"
                    tabIndex="-1"
                    aria-hidden="true"
                    style={{
                        display: "block",
                        backgroundColor: "rgba(0,0,0,0.5)",
                        zIndex: 1050,
                    }}
                >
                    <div className="modal-dialog modal-xl">
                        <div className="modal-content border-0 shadow-lg rounded-3">
                            <div
                                className="modal-header bg-gradient-primary text-white rounded-top-3"
                                style={{
                                    background:
                                        "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                    borderBottom: "none",
                                    padding: "1rem 1.5rem",
                                }}
                            >
                                <div className="w-100">
                                    <div className="d-flex justify-content-between align-items-center">
                                        <h5 className="mb-0 fw-bold">
                                            <i className="fas fa-eye me-2"></i>
                                            Visualisation de la Checklist N°: #<strong>{NumDossier??NumDossier}</strong>
                                        </h5>
                                        <div className="d-flex gap-2">
                                            <button
                                                type="button"
                                                className="btn btn-light btn-sm"
                                                onClick={handlePrint}
                                                style={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.2)",
                                                    border: "1px solid rgba(255,255,255,0.3)",
                                                    color: "white",
                                                }}
                                            >
                                                <i className="fas fa-download me-2"></i>
                                                Télécharger / Imprimer
                                            </button>
                                            <button
                                                type="button"
                                                className="btn-close btn-close-white"
                                                onClick={() =>
                                                    setShowVisualisation(false)
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="modal-body p-0 "
                                style={{ maxHeight: "95vh", overflowY: "auto" }}
                            >
                                <VisualisationChecklist
                                    dossierId={dossierId}
                                    NumDossier={NumDossier??NumDossier}
                                    onClose={() => setShowVisualisation(false)}
                                    checklistData={checklistData}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
