import React, { useEffect, useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../../../styles/style.css";
import axios from "axios";
import ValidationFile from "../../GC/Reports/ValidationFile";
import Swal from "sweetalert2";
import ModalVisualisationGPS from "../ModalVisualisationGPS";
import PropositionMontant from "./PropositionMontant";
import ModalCheckListSuperviseur from "./ModalCheckListSuperviseur";
import PropositionsHistory from "../../GC/Reports/PropositionsHistory";
// import { PrintPropositionsHistory } from "../../GC/Reports/PropositionsHistory";
import {
    FaDownload,
    FaUserCircle,
    FaClock,
    FaPencilAlt,
    FaPaperPlane,
    FaComments,
    FaInfoCircle,
    FaCommentDots,
} from "react-icons/fa";
// import { FaDownload } from "react-icons/fa";
import { Bars } from "react-loader-spinner";

export default function ModalBootstrapVisualisation({ dossierId, onClose }) {
    const [dossier, setDossier] = useState(null);
    const inputRef = useRef(null);
    const offcanvasRef = useRef(null);

    const [NumCompte, setNumCompte] = useState();
    const [NomCompte, setNomCompte] = useState();
    const [produit_credit, setproduit_credit] = useState();
    const [type_credit, settype_credit] = useState();
    const [recouvreur, setrecouvreur] = useState();
    const [montant_demande, setmontant_demande] = useState();
    const [date_demande, setdate_demande] = useState();
    // const formattedDate = date_demande.toISOString().split("T")[0];
    const [frequence_mensualite, setfrequence_mensualite] = useState();
    const [nombre_echeance, setnombre_echeance] = useState();
    const [NumDossier, setNumDossier] = useState("");
    const [gestionnaire, setgestionnaire] = useState("");
    const [source_fond, setsource_fond] = useState("");
    const [monnaie, setmonnaie] = useState("");
    const [duree_credit, setduree_credit] = useState("");
    const [intervale_jrs, setintervale_jrs] = useState("");
    const [taux_interet, settaux_interet] = useState("");
    const [type_garantie, settype_garantie] = useState("");
    const [valeur_comptable, setvaleur_comptable] = useState("");
    const [num_titre, setnum_titre] = useState("");
    const [valeur_garantie, setvaleur_garantie] = useState("");
    const [description_titre, setdescription_titre] = useState("");
    const [getDossierId, setGetDossierId] = useState();
    const [date_sortie_titre, setdate_sortie_titre] = useState("");
    const [date_expiration_titre, setdate_expiration_titre] = useState("");
    const [signature_file, setsignature_file] = useState();
    const [nombre_membre_groupe, setnombre_membre_groupe] = useState("");
    const [nombre_homme_groupe, setnombre_homme_groupe] = useState("");
    const [nombre_femme_groupe, setnombre_femme_groupe] = useState("");
    const [objetCredit, setObjetCredit] = useState("");
    const [statutDossier, setstatutDossier] = useState("");
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [progress, setProgress] = useState(0);
    const [contenu, setContenu] = useState("");
    const endOfCommentsRef = useRef(null);
    const [replyTo, setReplyTo] = useState(null);
    const [dossierIdSelected, setDossierIdSelected] = useState(null);
    const [Agence, setAgence] = useState("");

    const [showPropositions, setShowPropositions] = useState(false);

    const handleReply = (comment) => {
        setReplyTo(comment);
        // Mettre le focus dans l'input dès qu'on clique sur Répondre
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // 🔽 Scroll automatique quand la liste change
    useEffect(() => {
        // inputRef.current?.focus();
        if (endOfCommentsRef.current) {
            endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, []);

    //  useEffect(() => {
    //     // inputRef.current?.focus();
    //     if (endOfCommentsRef.current) {
    //         endOfCommentsRef.current.scrollIntoView({ behavior: "smooth" });
    //     }
    // }, [dossier && dossier.commentaires]);

    useEffect(() => {
        if (offcanvasRef.current) {
            const offcanvasEl = offcanvasRef.current;

            const handleShown = () => {
                if (inputRef.current) inputRef.current.focus();
            };

            offcanvasEl.addEventListener("shown.bs.offcanvas", handleShown);

            // nettoyage à la destruction du composant
            return () => {
                offcanvasEl.removeEventListener(
                    "shown.bs.offcanvas",
                    handleShown,
                );
            };
        }
    }, []);

    const getDossierCredit = async () => {
        // Charger les données
        axios
            .get(`suivi-credit/dossiers/${dossierId}`)
            .then((res) => {
                const data = res.data.data; // récupère l'objet dossier complet
                setDossier(data); // stocke tout l'objet dossier dans dossier
                //console.log(data);
                setNumCompte(data.NumCompte);
                setNomCompte(data.NomCompte);
                setproduit_credit(data.produit_credit);
                settype_credit(data.type_credit);
                setrecouvreur(data.recouvreur);
                setmontant_demande(data.montant_demande);
                setfrequence_mensualite(data.frequence_mensualite);
                setnombre_echeance(data.nombre_echeance);
                setNumDossier(data.NumDossier);
                setgestionnaire(data.gestionnaire);
                setsource_fond(data.source_fond);
                setmonnaie(data.monnaie);
                setduree_credit(data.duree_credit);
                setintervale_jrs(data.intervale_jrs);
                settaux_interet(data.taux_interet);
                settype_garantie(data.type_garantie);
                setvaleur_comptable(data.valeur_comptable);
                setnum_titre(data.num_titre);
                setvaleur_garantie(data.valeur_garantie);
                setdescription_titre(data.description_titre);
                setdate_demande(data.date_demande);
                setdate_sortie_titre(data.date_sortie_titre);
                setdate_expiration_titre(data.date_expiration_titre);
                setnombre_membre_groupe(data.nombre_membre_groupe);
                setnombre_homme_groupe(data.nombre_homme_groupe);
                setnombre_femme_groupe(data.nombre_femme_groupe);
                setObjetCredit(data.objet_credit);
                setstatutDossier(data.statutDossier);
                setGetDossierId(data.id_credit);
                setAgence(data.Agence);
            })
            .catch(() => setDossier(null));
    };

    useEffect(() => {
        if (!dossierId) return;
        getDossierCredit();
    }, [dossierId]);

    if (!dossierId) return null;

    const dateParser = (num) => {
        const options = {
            // weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };

        let timestamp = Date.parse(num);

        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

        return date.toString();
    };
    //PERMET DE MODIFIER UN DOSSIER
    const handleSubmitUpadate = async (e) => {
        e.preventDefault();
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de modifier ce dossier voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            setIsLoadingBar(true);
            const res = await axios.post(
                "gestion_credit/dossier-credit/upadate",
                {
                    NumCompte,
                    NomCompte,
                    produit_credit,
                    type_credit,
                    recouvreur,
                    montant_demande,
                    frequence_mensualite,
                    nombre_echeance,
                    NumDossier,
                    gestionnaire,
                    source_fond,
                    monnaie,
                    duree_credit,
                    intervale_jrs,
                    taux_interet,
                    type_garantie,
                    valeur_comptable,
                    num_titre,
                    valeur_garantie,
                    description_titre,
                    date_demande,
                    statutDossier,
                    nombre_membre_groupe,
                    nombre_homme_groupe,
                    nombre_femme_groupe,
                    objetCredit,
                    idDossier: getDossierId,
                    Agence,
                    date_expiration_titre,
                    date_sortie_titre,
                },
            );
            if (res.data.status == 1) {
                setIsLoadingBar(false);

                Swal.fire({
                    icon: "success",
                    title: "Modification du dossier !",
                    text: res.data.msg,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                getDossierCredit();
            } else {
                setIsLoadingBar(false);
                Swal.fire({
                    title: "Modification",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const handleSubmitAddFile = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);
        setProgress(0);
        try {
            const formData = new FormData();
            formData.append("signature_file", signature_file);
            formData.append("idDossier", getDossierId);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total,
                    );
                    setProgress(percentCompleted);
                },
            };

            const url = "gestion_credit/page/validation-dossier/add-file";
            axios
                .post(url, formData, config)
                .then((response) => {
                    if (response.data.status == 1) {
                        setIsLoadingBar(false);
                        Swal.fire({
                            title: "Succès",
                            text: response.data.msg,
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
                        setIsLoadingBar(false);
                        Swal.fire({
                            title: "Erreur",
                            text: response.data.msg,
                            icon: "error",
                            button: "OK!",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    };

    const handleSignatureClick = () => {
        if (dossier.signatures && dossier.signatures.length > 0) {
            const filePath = dossier.lastSignature; // ex: "signatures/monfichier.pdf"
            const fileUrl = `/storage/${filePath}`;

            // 1. Ouvrir en prévisualisation
            window.open(fileUrl, "_blank");

            // 2. Générer le nom du fichier
            const today = new Date();
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            const formattedDate = `${day}${month}${year}`; // ex: 02092025

            // Récupérer le NomCompte depuis ton state
            const nomClient = NomCompte || "Client";

            const fileName = `${formattedDate}_FICHE_SUIVI_CREDIT_DE_${nomClient}.pdf`;

            // 3. Télécharger le fichier avec le nom personnalisé
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    const saveComment = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);

        if (contenu.trim() === "") {
            setIsLoadingBar(false);
            return;
        }

        try {
            // construire les données à envoyer
            const payload = {
                getDossierId,
                contenu,
            };

            // si on est en train de répondre à un commentaire
            if (replyTo) {
                payload.parent_id = replyTo.id; // ⚡ c’est le commentaire auquel on répond
                payload.user_id = replyTo.user?.id;
            }

            // envoyer la requête
            const res = await axios.post(
                "/gestion_credit/page/credit/commentaire/new",
                payload,
            );

            if (res.data.status == 1) {
                // recharge la liste
                getDossierCredit();

                // vider le champ texte
                setContenu("");

                // sortir du mode réponse
                setReplyTo(null);

                setIsLoadingBar(false);
            } else {
                Swal.fire({
                    title: "Commentaire",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                setIsLoadingBar(false);
            }
        } catch (error) {
            console.error("Erreur lors de l’enregistrement :", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue lors de l’enregistrement du commentaire.",
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setIsLoadingBar(false);
        }
    };

    // Fonction format date
    // const formatDateTime = (dateString) => {
    //     const date = new Date(dateString);
    //     const jour = String(date.getDate()).padStart(2, "0");
    //     const mois = String(date.getMonth() + 1).padStart(2, "0");
    //     const annee = date.getFullYear();
    //     const heures = date.getHours();
    //     const minutes = String(date.getMinutes()).padStart(2, "0");
    //     return `${jour}/${mois}/${annee} à ${heures}h${minutes}`;
    // };

    const currentUserId = dossier && dossier.current_user?.id;
    // Helper robuste : compte parents + réponses (à n niveaux)
    const countAllComments = (list) => {
        if (!Array.isArray(list)) return 0;
        return list.reduce((total, c) => {
            const children = Array.isArray(c.replies)
                ? countAllComments(c.replies)
                : 0;
            return total + 1 + children;
        }, 0);
    };

    // Quand vous voulez afficher les propositions
    const handleViewPropositions = () => {
        setShowPropositions(true);
    };
    // Dans ton composant (avant le return)
    const nbCommentaires = countAllComments(dossier?.commentaires || []);

    return (
        <>
        {/* <style>
            {`
            .modal.full-height .modal-dialog {
    margin-bottom: 5 !important;
    height: 100vh !important;
    max-height: 100vh !important;
    display: flex !important;
    align-items: stretch !important;
}
            `}
        </style> */}
            <div
                 className="modal fade full-height"
                tabIndex="-1"
                aria-hidden="true"
                id="modalVisualisationDossier"
                style={{ height: "100vh !important"}}
            >
                <div className="modal-dialog modal-xl modal-full-height">
                    <div className="modal-content border-0 shadow-lg rounded-3">
                        {/* Header modernisé */}
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
                                        <div>
                                            <h5 className="fw-semibold mb-0 text-white">
                                                Détails du dossier{" "}
                                                <strong className="text-white-50">
                                                    {NumDossier}
                                                </strong>
                                            </h5>
                                            <div className="d-flex align-items-center gap-2 mt-1">
                                                <span className="text-white-50 small">
                                                    Statut :
                                                </span>
                                                {statutDossier == "Décaissé" ? (
                                                    <select
                                                        type="text"
                                                        className="form-select form-select-sm bg-white bg-opacity-25 text-white border-0"
                                                        style={{
                                                            width: "120px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                        }}
                                                        value={statutDossier}
                                                        onChange={(e) =>
                                                            setstatutDossier(
                                                                e.target.value,
                                                            )
                                                        }
                                                        disabled
                                                    >
                                                        <option
                                                            value={
                                                                statutDossier
                                                            }
                                                            className="text-dark"
                                                        >
                                                            {statutDossier}
                                                        </option>
                                                        <option value="Refusé">
                                                            Refusé
                                                        </option>
                                                        <option value="Encours">
                                                            Encours
                                                        </option>
                                                        <option value="Décaissé">
                                                            Décaissé
                                                        </option>
                                                        <option value="Encours de Décaissement">Encours de Décaissement</option>
                                                    </select>
                                                ) : (
                                                    <select
                                                        type="text"
                                                        className="form-select form-select-sm bg-white bg-opacity-25 text-white border-0"
                                                        style={{
                                                            width: "120px",
                                                            fontWeight: "500",
                                                            cursor: "pointer",
                                                        }}
                                                        value={statutDossier}
                                                        onChange={(e) =>
                                                            setstatutDossier(
                                                                e.target.value,
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            value={
                                                                statutDossier
                                                            }
                                                            className="text-dark"
                                                        >
                                                            {statutDossier}
                                                        </option>
                                                        <option value="Refusé">
                                                            Refusé
                                                        </option>
                                                        <option value="Encours">
                                                            Encours
                                                        </option>
                                                        <option value="Décaissé">
                                                            Décaissé
                                                        </option>
                                                        <option value="Encours de Décaissement">Encours de Décaissement</option>

                                                    </select>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex gap-2 flex-wrap">
                                        {dossier &&
                                            dossier.signatures &&
                                            dossier.signatures.length > 0 && (
                                                <button
                                                    onClick={
                                                        handleSignatureClick
                                                    }
                                                    className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                                    style={{
                                                        borderRadius: "20px",
                                                        padding: "6px 16px",
                                                    }}
                                                >
                                                    <FaDownload />
                                                    Télécharger & signer
                                                </button>
                                            )}

                                        <button
                                            className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                            type="button"
                                            data-bs-toggle="offcanvas"
                                            data-bs-target="#offcanvasCommentaires"
                                            aria-controls="offcanvasCommentaires"
                                            style={{
                                                borderRadius: "20px",
                                                padding: "6px 16px",
                                            }}
                                        >
                                            <FaCommentDots />
                                            Commentaires{" "}
                                            {nbCommentaires > 0 && (
                                                <span className="badge bg-primary ms-1">
                                                    {nbCommentaires}
                                                </span>
                                            )}
                                        </button>

                                        <button
                                            className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                            type="button"
                                            data-toggle="modal"
                                            data-target="#modalCheckListSuperviseur"
                                            style={{
                                                borderRadius: "20px",
                                                padding: "6px 16px",
                                            }}
                                            onClick={() =>
                                                setDossierIdSelected(dossierId)
                                            }
                                        >
                                            <i className="fas fa-user"></i>
                                            Superviseur{" "}
                                        </button>

                                        <button
                                            className="btn btn-light btn-sm d-flex align-items-center gap-2"
                                            type="button"
                                            data-toggle="modal"
                                            data-target="#modalVisualisationGPS"
                                            onClick={() =>
                                                setDossierIdSelected(dossierId)
                                            }
                                            style={{
                                                borderRadius: "20px",
                                                padding: "6px 16px",
                                            }}
                                        >
                                            📍 GPS
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={onClose}
                            ></button>
                        </div>

                        <div
                            className="modal-body p-4"
                            style={{ maxHeight: "70vh", overflowY: "auto" }}
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

                            {!dossier && (
                                <div className="text-center py-5">
                                    <div
                                        className="spinner-border text-teal"
                                        role="status"
                                    >
                                        <span className="visually-hidden">
                                            Chargement...
                                        </span>
                                    </div>
                                    <p className="mt-3 text-muted">
                                        Chargement des données...
                                    </p>
                                </div>
                            )}

                            {dossier && (
                                <>
                                    {/* Formulaire d'informations */}
                                    {/* Formulaire d'informations */}
                                    <form>
                                        <div className="row g-3">
                                            {/* Colonne 1 */}
                                            <div className="col-md-4">
                                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                                    <div className="card-body p-3">
                                                        <table className="table table-sm table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            width: "40%",
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-hashtag me-1"></i>
                                                                            Num
                                                                            compte
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    "#f8f9fa",
                                                                            }}
                                                                            value={
                                                                                NumCompte
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setNumCompte(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-folder-open me-1"></i>
                                                                            Num
                                                                            Dossier
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    "#f8f9fa",
                                                                            }}
                                                                            value={
                                                                                NumDossier
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setNumDossier(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-user me-1"></i>
                                                                            Nom
                                                                            Compte
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            style={{
                                                                                backgroundColor:
                                                                                    "#f8f9fa",
                                                                            }}
                                                                            value={
                                                                                NomCompte
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setNomCompte(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-tag me-1"></i>
                                                                            Produit
                                                                            de
                                                                            crédit
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                produit_credit
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setproduit_credit(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    produit_credit
                                                                                }
                                                                            >
                                                                                {
                                                                                    produit_credit
                                                                                }
                                                                            </option>
                                                                            <option value="Crédit aux MPME">
                                                                                Crédit
                                                                                aux
                                                                                MPME
                                                                            </option>
                                                                            <option value="Crédit à la consommation">
                                                                                Crédit
                                                                                à
                                                                                la
                                                                                consommation
                                                                            </option>
                                                                            <option value="Crédit à l'habitat">
                                                                                Crédit
                                                                                à
                                                                                l'habitat
                                                                            </option>
                                                                            <option value="Crédit Groupe Solidaire">
                                                                                Crédit
                                                                                Groupe
                                                                                Solidaire
                                                                            </option>
                                                                            <option value="Crédit Salaire">
                                                                                Crédit
                                                                                Salaire
                                                                            </option>
                                                                            <option value="Crédit Staff">
                                                                                Crédit
                                                                                Staff
                                                                            </option>
                                                                            <option value="Crédit Express">
                                                                                Crédit
                                                                                Express
                                                                            </option>
                                                                            <option value="Crédit Agro-Pastoral">
                                                                                Crédit
                                                                                Agro-Pastoral
                                                                            </option>
                                                                            <option value="Crédit MWANGAZA">
                                                                                Crédit
                                                                                MWANGAZA
                                                                            </option>
                                                                            <option value="Crédit JIKO BORA">
                                                                                Crédit
                                                                                JIKO
                                                                                BORA
                                                                            </option>
                                                                            <option value="Crédits TUFAIDIKE WOTE">
                                                                                Crédits
                                                                                TUFAIDIKE
                                                                                WOTE
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-chart-line me-1"></i>
                                                                            Type
                                                                            crédit
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                type_credit
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                settype_credit(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    type_credit
                                                                                }
                                                                            >
                                                                                {
                                                                                    type_credit
                                                                                }
                                                                            </option>
                                                                            <option value="Crédit Express à CT">
                                                                                Crédit
                                                                                Express
                                                                                à
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédits à la consommation à CT">
                                                                                Crédits
                                                                                à
                                                                                la
                                                                                consommation
                                                                                à
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédit aux MPME à CT ">
                                                                                Crédit
                                                                                aux
                                                                                MPME
                                                                                à
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédit Staff à MT ">
                                                                                Crédit
                                                                                Staff
                                                                                à
                                                                                MT
                                                                            </option>
                                                                            <option value="Crédit aux Groupes Solidaires USD ">
                                                                                Crédit
                                                                                aux
                                                                                Groupes
                                                                                Solidaires
                                                                                USD
                                                                            </option>
                                                                            <option value="Crédit Salaire à CT ">
                                                                                Crédit
                                                                                Salaire
                                                                                à
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédit à l'habitat CT ">
                                                                                Crédit
                                                                                à
                                                                                l'habitat
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédits à la consommation à MT ">
                                                                                Crédits
                                                                                à
                                                                                la
                                                                                consommation
                                                                                à
                                                                                MT
                                                                            </option>
                                                                            <option value="Crédit aux MPME à MT ">
                                                                                Crédit
                                                                                aux
                                                                                MPME
                                                                                à
                                                                                MT
                                                                            </option>
                                                                            <option value="Crédit aux MPME à CT en FC  ">
                                                                                Crédit
                                                                                aux
                                                                                MPME
                                                                                à
                                                                                CT
                                                                                en
                                                                                FC
                                                                            </option>
                                                                            <option value="Crédit aux Groupes Solidaires FC   ">
                                                                                Crédit
                                                                                aux
                                                                                Groupes
                                                                                Solidaires
                                                                                FC
                                                                            </option>
                                                                            <option value="Crédit Agro-Pastoral à CT   ">
                                                                                Crédit
                                                                                Agro-Pastoral
                                                                                à
                                                                                CT
                                                                            </option>
                                                                            <option value="Crédit MWANGAZA   ">
                                                                                Crédit
                                                                                MWANGAZA
                                                                            </option>
                                                                            <option value="Crédit Salaire à MT en FC   ">
                                                                                Crédit
                                                                                Salaire
                                                                                à
                                                                                MT
                                                                                en
                                                                                FC
                                                                            </option>
                                                                            <option value="Crédits JIKO BORA Menage (CT)   ">
                                                                                Crédits
                                                                                JIKO
                                                                                BORA
                                                                                Menage
                                                                                (CT)
                                                                            </option>
                                                                            <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                                                                Crédits
                                                                                JIKO
                                                                                BORA
                                                                                Grand
                                                                                Cons
                                                                                (CT)
                                                                            </option>
                                                                            <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                                                                Crédits
                                                                                TUFAIDIKE
                                                                                WOTE
                                                                                en
                                                                                USD
                                                                            </option>
                                                                            <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                                                                Crédits
                                                                                TUFAIDIKE
                                                                                WOTE
                                                                                en
                                                                                FC
                                                                            </option>
                                                                            <option value="Crédit aux salariés domiciliés à MT   ">
                                                                                Crédit
                                                                                aux
                                                                                salariés
                                                                                domiciliés
                                                                                à
                                                                                MT
                                                                            </option>
                                                                            <option value="Crédit aux MPME à MT en FC    ">
                                                                                Crédit
                                                                                aux
                                                                                MPME
                                                                                à
                                                                                MT
                                                                                en
                                                                                FC
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-user-tie me-1"></i>
                                                                            Recouvreur
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                recouvreur
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setrecouvreur(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    recouvreur
                                                                                }
                                                                            >
                                                                                {
                                                                                    recouvreur
                                                                                }
                                                                            </option>
                                                                            <option value="ALAME KUZANWA WILLY">
                                                                                ALAME
                                                                                KUZANWA
                                                                                WILLY
                                                                            </option>
                                                                            <option value="AKILI SANGARA JULIEN">
                                                                                AKILI
                                                                                SANGARA
                                                                                JULIEN
                                                                            </option>
                                                                            <option value="MAPENDO RUTH">
                                                                                MAPENDO
                                                                                RUTH
                                                                            </option>
                                                                            <option value="LAVIE MATEMBERA">
                                                                                LAVIE
                                                                                MATEMBERA
                                                                            </option>
                                                                            <option value="KANKINSINGI NGADU">
                                                                                KANKINSINGI
                                                                                NGADU
                                                                            </option>
                                                                            <option value="NEEMA MULINGA GRACE">
                                                                                NEEMA
                                                                                MULINGA
                                                                                GRACE
                                                                            </option>
                                                                            <option value="WIVINE ALISA">
                                                                                WIVINE
                                                                                ALISA
                                                                            </option>
                                                                            <option value="MOSES KATEMBO">
                                                                                MOSES
                                                                                KATEMBO
                                                                            </option>
                                                                            <option value="SAFARI KALEKERA">
                                                                                SAFARI
                                                                                KALEKERA
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-money-bill-wave me-1"></i>
                                                                            Montant
                                                                            demandé
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                montant_demande
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setmontant_demande(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-calendar-alt me-1"></i>
                                                                            Date
                                                                            demande
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={dateParser(
                                                                                date_demande,
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setdate_demande(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            htmlFor="Agence"
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-building"></i>{" "}
                                                                            Agence
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            name="Agence"
                                                                            id="Agence"
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setAgence(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                            value={
                                                                                Agence
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    Agence
                                                                                }
                                                                            >
                                                                                {
                                                                                    Agence
                                                                                }
                                                                            </option>
                                                                            <option value="GOMA">
                                                                                GOMA
                                                                            </option>
                                                                            <option value="KATINDO">
                                                                                KATINDO
                                                                            </option>
                                                                            <option value="BUNIA">
                                                                                BUNIA
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>

                                                                {/* Groupe Solidaire - conditionnel */}
                                                                {produit_credit ===
                                                                    "Crédit Groupe Solidaire" && (
                                                                    <>
                                                                        <tr>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <label
                                                                                    className="fw-semibold small mb-0"
                                                                                    style={{
                                                                                        color: "#4682b4",
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-users me-1"></i>
                                                                                    Nbre
                                                                                    membres
                                                                                </label>
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={
                                                                                        nombre_membre_groupe
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        setnombre_membre_groupe(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <label
                                                                                    className="fw-semibold small mb-0"
                                                                                    style={{
                                                                                        color: "#4682b4",
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-mars me-1"></i>
                                                                                    Nbre
                                                                                    hommes
                                                                                </label>
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={
                                                                                        nombre_homme_groupe
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        setnombre_homme_groupe(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <label
                                                                                    className="fw-semibold small mb-0"
                                                                                    style={{
                                                                                        color: "#4682b4",
                                                                                    }}
                                                                                >
                                                                                    <i className="fas fa-venus me-1"></i>
                                                                                    Nbre
                                                                                    femmes
                                                                                </label>
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    padding:
                                                                                        "6px 8px",
                                                                                }}
                                                                            >
                                                                                <input
                                                                                    type="text"
                                                                                    className="form-control form-control-sm"
                                                                                    value={
                                                                                        nombre_femme_groupe
                                                                                    }
                                                                                    onChange={(
                                                                                        e,
                                                                                    ) =>
                                                                                        setnombre_femme_groupe(
                                                                                            e
                                                                                                .target
                                                                                                .value,
                                                                                        )
                                                                                    }
                                                                                />
                                                                            </td>
                                                                        </tr>
                                                                    </>
                                                                )}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Colonne 2 */}
                                            <div className="col-md-4">
                                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                                    <div className="card-body p-3">
                                                        <table className="table table-sm table-borderless mb-0">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            width: "40%",
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-bullseye me-1"></i>
                                                                            Objet
                                                                            crédit
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                objetCredit
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setObjetCredit(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    objetCredit
                                                                                }
                                                                            >
                                                                                {
                                                                                    objetCredit
                                                                                }
                                                                            </option>
                                                                            <option value="Frais de scolarité,académique,soins médicaux">
                                                                                Frais
                                                                                de
                                                                                scolarité,académique,soins
                                                                                médicaux
                                                                            </option>
                                                                            <option value="Dot, mariage, anniversaire, baptême, funéraille">
                                                                                Dot,
                                                                                mariage,
                                                                                anniversaire,
                                                                                baptême,
                                                                                funéraille
                                                                            </option>
                                                                            <option value="Frais de justice, loyer, paiement dette">
                                                                                Frais
                                                                                de
                                                                                justice,
                                                                                loyer,
                                                                                paiement
                                                                                dette
                                                                            </option>
                                                                            <option value="Entretien ménage et équipement en mobilier">
                                                                                Entretien
                                                                                ménage
                                                                                et
                                                                                équipement
                                                                                en
                                                                                mobilier
                                                                            </option>
                                                                            <option value="Avance sur salaire">
                                                                                Avance
                                                                                sur
                                                                                salaire
                                                                            </option>
                                                                            <option value="Achat parcelle bâtie ou bâtie">
                                                                                Achat
                                                                                parcelle
                                                                                bâtie
                                                                                ou
                                                                                bâtie
                                                                            </option>
                                                                            <option value="Construcion et achat matériel de construction">
                                                                                Construcion
                                                                                et
                                                                                achat
                                                                                matériel
                                                                                de
                                                                                construction
                                                                            </option>
                                                                            <option value="Commerce">
                                                                                Commerce
                                                                            </option>
                                                                            <option value="Préfinancement de marché">
                                                                                Préfinancement
                                                                                de
                                                                                marché
                                                                            </option>
                                                                            <option value="Amélioration champ, plantation/agriculture">
                                                                                Amélioration
                                                                                champ,
                                                                                plantation/agriculture
                                                                            </option>
                                                                            <option value="Achat moto, voiture">
                                                                                Achat
                                                                                moto,
                                                                                voiture
                                                                            </option>
                                                                            <option value="Autres">
                                                                                Autres
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-calendar-week me-1"></i>
                                                                            Fréquence
                                                                            mens.
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                frequence_mensualite
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setfrequence_mensualite(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-calculator me-1"></i>
                                                                            Nbre
                                                                            Échéance
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                nombre_echeance
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setnombre_echeance(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-user-check me-1"></i>
                                                                            Gestionnaire
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                gestionnaire
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setgestionnaire(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    gestionnaire
                                                                                }
                                                                            >
                                                                                {
                                                                                    gestionnaire
                                                                                }
                                                                            </option>
                                                                            <option value="ALAME KUZANWA WILLY">
                                                                                ALAME
                                                                                KUZANWA
                                                                                WILLY
                                                                            </option>
                                                                            <option value="AKILI SANGARA JULIEN">
                                                                                AKILI
                                                                                SANGARA
                                                                                JULIEN
                                                                            </option>
                                                                            <option value="MAPENDO RUTH">
                                                                                MAPENDO
                                                                                RUTH
                                                                            </option>
                                                                            <option value="LAVIE MATEMBERA">
                                                                                LAVIE
                                                                                MATEMBERA
                                                                            </option>
                                                                            <option value="KANKINSINGI NGADU">
                                                                                KANKINSINGI
                                                                                NGADU
                                                                            </option>
                                                                            <option value="NEEMA MULINGA GRACE">
                                                                                NEEMA
                                                                                MULINGA
                                                                                GRACE
                                                                            </option>
                                                                            <option value="NGASHANI ALBERT">
                                                                                NGASHANI
                                                                                ALBERT
                                                                            </option>

                                                                            <option value="WIVINE ALISA">
                                                                                WIVINE
                                                                                ALISA
                                                                            </option>
                                                                            <option value="MOSES KATEMBO">
                                                                                MOSES
                                                                                KATEMBO
                                                                            </option>
                                                                            <option value="SAFARI KALEKERA">
                                                                                SAFARI
                                                                                KALEKERA
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-building me-1"></i>
                                                                            Source
                                                                            Fonds
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                source_fond
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setsource_fond(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-coins me-1"></i>
                                                                            Monnaie
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <select
                                                                            className="form-select form-select-sm"
                                                                            value={
                                                                                monnaie
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setmonnaie(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        >
                                                                            <option
                                                                                value={
                                                                                    monnaie
                                                                                }
                                                                            >
                                                                                {
                                                                                    monnaie
                                                                                }
                                                                            </option>
                                                                            <option
                                                                                value={
                                                                                    monnaie ==
                                                                                    "CDF"
                                                                                        ? "USD"
                                                                                        : "CDF"
                                                                                }
                                                                            >
                                                                                {monnaie ==
                                                                                "CDF"
                                                                                    ? "USD"
                                                                                    : "CDF"}
                                                                            </option>
                                                                        </select>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-hourglass-half me-1"></i>
                                                                            Durée
                                                                            crédit
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                duree_credit
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setduree_credit(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-chart-simple me-1"></i>
                                                                            Intervalle
                                                                            jrs
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                intervale_jrs
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setintervale_jrs(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-percent me-1"></i>
                                                                            Taux
                                                                            intérêt
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                taux_interet
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                settaux_interet(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Colonne 3 - Garantie */}
                                            <div className="col-md-4">
                                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                                    <div className="card-body p-3">
                                                        <h6
                                                            className="fw-semibold mb-2 pb-1"
                                                            style={{
                                                                fontSize:
                                                                    "0.85rem",
                                                                color: "#4682b4",
                                                                borderBottom:
                                                                    "2px solid #4682b4",
                                                                display:
                                                                    "inline-block",
                                                            }}
                                                        >
                                                            <i className="fas fa-shield-alt me-2"></i>
                                                            Garantie du crédit
                                                        </h6>
                                                        <table className="table table-sm table-borderless mb-0 mt-2">
                                                            <tbody>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            width: "40%",
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-shield me-1"></i>
                                                                            Type
                                                                            Garantie
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                type_garantie
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                settype_credit(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-chart-line me-1"></i>
                                                                            Valeur
                                                                            comptable
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                valeur_comptable
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setvaleur_comptable(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-hashtag me-1"></i>
                                                                            Num
                                                                            titre
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                num_titre
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setnum_titre(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-hand-holding-usd me-1"></i>
                                                                            Valeur
                                                                            garantie
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                valeur_garantie
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setvaleur_garantie(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-calendar-plus me-1"></i>
                                                                            Date
                                                                            sortie
                                                                            titre
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                date_sortie_titre
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setdate_sortie_titre(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-calendar-times me-1"></i>
                                                                            Date
                                                                            expiration
                                                                            titre
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <input
                                                                            type="text"
                                                                            className="form-control form-control-sm"
                                                                            value={
                                                                                date_expiration_titre
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setdate_expiration_titre(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                            verticalAlign:
                                                                                "top",
                                                                        }}
                                                                    >
                                                                        <label
                                                                            className="fw-semibold small mb-0"
                                                                            style={{
                                                                                color: "#4682b4",
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-comment me-1"></i>
                                                                            Description
                                                                        </label>
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "6px 8px",
                                                                        }}
                                                                    >
                                                                        <textarea
                                                                            className="form-control form-control-sm"
                                                                            rows="3"
                                                                            value={
                                                                                description_titre
                                                                            }
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                setdescription_titre(
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                                )
                                                                            }
                                                                        ></textarea>
                                                                    </td>
                                                                </tr> */}
                                                                <tr>
                                                                    <td></td>
                                                                    <td>
                                                                        <button
                                                                            onClick={
                                                                                handleSubmitUpadate
                                                                            }
                                                                            className="btn w-100 mt-3  bg-gradient-primary text-white"
                                                                            style={{
                                                                                color: "white",
                                                                                transition:
                                                                                    "all 0.2s ease",
                                                                                borderRadius:
                                                                                    "10px",
                                                                            }}
                                                                            onMouseEnter={(
                                                                                e,
                                                                            ) => {
                                                                                e.currentTarget.style.backgroundColor =
                                                                                    "#198764";
                                                                                e.currentTarget.style.transform =
                                                                                    "translateY(-1px)";
                                                                            }}
                                                                            onMouseLeave={(
                                                                                e,
                                                                            ) => {
                                                                                e.currentTarget.style.backgroundColor =
                                                                                    "#20c997";
                                                                                e.currentTarget.style.transform =
                                                                                    "translateY(0)";
                                                                            }}
                                                                        >
                                                                            <i className="fas fa-save me-2"></i>
                                                                            Modifier
                                                                            le
                                                                            dossier
                                                                        </button>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </form>

                                    {/* Dans votre modal-body, entourez le composant avec une colonne */}
                                    <div className="row">
                                        <div className="col-md-8">
                                            {/* 👇 AJOUTEZ ICI 👇 */}

                                            {getDossierId && (
                                                <PropositionMontant
                                                    dossierId={getDossierId}
                                                    currentUserId={
                                                        currentUserId
                                                    } // Ajoutez cette prop avec l'ID de l'utilisateur connecté
                                                    onMontantPropose={(
                                                        newProposition,
                                                    ) => {
                                                        console.log(
                                                            "Nouvelle proposition:",
                                                            newProposition,
                                                        );
                                                    }}
                                                />
                                            )}
                                            <button
                                                onClick={() =>
                                                    handleViewPropositions()
                                                }
                                                style={{
                                                    background:
                                                        "linear-gradient(98deg, #006892 0%, #0085af 100%)",
                                                    border: "none",
                                                    padding: "12px 28px",
                                                    borderRadius: "40px",
                                                    color: "white",
                                                    fontWeight: "600",
                                                    fontSize: "14px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    cursor: "pointer",
                                                    transition:
                                                        "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                                    boxShadow:
                                                        "0 4px 12px rgba(0, 104, 146, 0.3)",
                                                    letterSpacing: "0.3px",
                                                    fontFamily:
                                                        "'Inter', sans-serif",
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(-2px)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 8px 20px rgba(0, 104, 146, 0.4)";
                                                    e.currentTarget.style.background =
                                                        "linear-gradient(98deg, #005a7c 0%, #006d91 100%)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 4px 12px rgba(0, 104, 146, 0.3)";
                                                    e.currentTarget.style.background =
                                                        "linear-gradient(98deg, #006892 0%, #0085af 100%)";
                                                }}
                                            >
                                                <svg
                                                    width="18"
                                                    height="18"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                    <path
                                                        d="M2.45801 12C3.73201 7.943 7.52301 5 12 5C16.477 5 20.268 7.943 21.542 12C20.268 16.057 16.477 19 12 19C7.52301 19 3.73201 16.057 2.45801 12Z"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                                Voir les propositions
                                                <svg
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path
                                                        d="M5 12H19M19 12L13 6M19 12L13 18"
                                                        stroke="white"
                                                        strokeWidth="2"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />
                                                </svg>
                                            </button>

                                            {/* Modal ou Offcanvas pour afficher le composant */}
                                            {showPropositions && (
                                                <div
                                                    className="modal show d-block"
                                                    style={{
                                                        backgroundColor:
                                                            "rgba(0,0,0,0.5)",
                                                    }}
                                                >
                                                    <div className="modal-dialog modal-xl">
                                                        <div className="modal-content">
                                                            <PropositionsHistory
                                                                propositionId={
                                                                    getDossierId
                                                                }
                                                                NumDossier={dossier.NumDossier}
                                                                onClose={() =>
                                                                    setShowPropositions(
                                                                        false,
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Section signature améliorée - Sans drag & drop */}
                                    <div className="card border-0 shadow-sm rounded-3 mt-4 overflow-hidden">
                                        <div className="card-header bg-white border-0 pt-3 pb-2">
                                            <div className="d-flex align-items-center gap-2">
                                                <div
                                                    style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        backgroundColor:
                                                            "rgba(32, 201, 151, 0.1)",
                                                        borderRadius: "10px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent:
                                                            "center",
                                                    }}
                                                >
                                                    <i
                                                        className="fas fa-signature text-teal"
                                                        style={{
                                                            fontSize: "16px",
                                                            color: "#20c997",
                                                        }}
                                                    ></i>
                                                </div>
                                                <h6
                                                    className="fw-semibold mb-0"
                                                    style={{
                                                        fontSize: "0.95rem",
                                                    }}
                                                >
                                                    Joindre votre signature
                                                </h6>
                                                <span
                                                    className="badge bg-teal bg-opacity-10 text-teal ms-2"
                                                    style={{
                                                        fontSize: "11px",
                                                        padding: "4px 8px",
                                                    }}
                                                >
                                                    <i className="fas fa-lock me-1"></i>
                                                    Sécurisé
                                                </span>
                                            </div>
                                        </div>

                                        <div className="card-body pt-2">
                                            <div className="row g-3 align-items-end">
                                                <div className="col-md-8">
                                                    {/* Zone de téléchargement simplifiée */}
                                                    <div
                                                        style={{
                                                            border: signature_file
                                                                ? "2px solid #20c997"
                                                                : "2px solid #dee2e6",
                                                            borderRadius:
                                                                "12px",
                                                            padding: "16px",
                                                            backgroundColor:
                                                                signature_file
                                                                    ? "rgba(32, 201, 151, 0.05)"
                                                                    : "#f8f9fa",
                                                            transition:
                                                                "all 0.2s ease",
                                                        }}
                                                    >
                                                        {signature_file ? (
                                                            <div className="d-flex align-items-center justify-content-between gap-3">
                                                                <div className="d-flex align-items-center gap-3">
                                                                    <div
                                                                        style={{
                                                                            width: "40px",
                                                                            height: "40px",
                                                                            backgroundColor:
                                                                                "#20c997",
                                                                            borderRadius:
                                                                                "10px",
                                                                            display:
                                                                                "flex",
                                                                            alignItems:
                                                                                "center",
                                                                            justifyContent:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-file-pdf text-white"></i>
                                                                    </div>
                                                                    <div>
                                                                        <p
                                                                            className="mb-0 fw-semibold small"
                                                                            style={{
                                                                                color: "#20c997",
                                                                            }}
                                                                        >
                                                                            {
                                                                                signature_file.name
                                                                            }
                                                                        </p>
                                                                        <small className="text-muted">
                                                                            {(
                                                                                signature_file.size /
                                                                                1024
                                                                            ).toFixed(
                                                                                1,
                                                                            )}{" "}
                                                                            KB
                                                                        </small>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        setsignature_file(
                                                                            null,
                                                                        )
                                                                    }
                                                                    className="btn btn-sm btn-outline-danger"
                                                                    style={{
                                                                        borderRadius:
                                                                            "8px",
                                                                        padding:
                                                                            "4px 8px",
                                                                    }}
                                                                    title="Supprimer"
                                                                >
                                                                    <i className="fas fa-times"></i>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="text-center">
                                                                <i className="fas fa-file-pdf fa-2x text-muted mb-2"></i>
                                                                <p className="mb-1 fw-semibold small">
                                                                    Sélectionnez
                                                                    votre
                                                                    fichier de
                                                                    signature
                                                                </p>
                                                                <label className="btn btn-outline-primary btn-sm mt-2">
                                                                    <i className="fas fa-folder-open me-1"></i>
                                                                    Choisir un
                                                                    fichier
                                                                    <input
                                                                        type="file"
                                                                        className="d-none"
                                                                        name="signature_file"
                                                                        accept="application/pdf"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setsignature_file(
                                                                                e
                                                                                    .target
                                                                                    .files[0],
                                                                            )
                                                                        }
                                                                    />
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Indications supplémentaires */}
                                                    <div className="d-flex gap-3 mt-2">
                                                        <small className="text-muted d-flex align-items-center gap-1">
                                                            <i
                                                                className="fas fa-info-circle"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                }}
                                                            ></i>
                                                            Format accepté : PDF
                                                        </small>
                                                        <small className="text-muted d-flex align-items-center gap-1">
                                                            <i
                                                                className="fas fa-weight-hanging"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                }}
                                                            ></i>
                                                            Max 5 MB
                                                        </small>
                                                        <small className="text-muted d-flex align-items-center gap-1">
                                                            <i
                                                                className="fas fa-shield-alt"
                                                                style={{
                                                                    fontSize:
                                                                        "10px",
                                                                }}
                                                            ></i>
                                                            Document sécurisé
                                                        </small>
                                                    </div>
                                                </div>

                                                <div className="col-md-4">
                                                    {signature_file ? (
                                                        <button
                                                            onClick={
                                                                handleSubmitAddFile
                                                            }
                                                            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "10px",
                                                                fontWeight:
                                                                    "500",
                                                                transition:
                                                                    "all 0.2s ease",
                                                                backgroundColor:
                                                                    "#20c997",
                                                                color: "white",
                                                                border: "none",
                                                            }}
                                                            onMouseEnter={(
                                                                e,
                                                            ) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "#198764";
                                                                e.currentTarget.style.transform =
                                                                    "translateY(-1px)";
                                                            }}
                                                            onMouseLeave={(
                                                                e,
                                                            ) => {
                                                                e.currentTarget.style.backgroundColor =
                                                                    "#20c997";
                                                                e.currentTarget.style.transform =
                                                                    "translateY(0)";
                                                            }}
                                                        >
                                                            <i className="fas fa-paper-plane"></i>
                                                            <span>
                                                                Joindre la
                                                                signature
                                                            </span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            disabled
                                                            className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "10px",
                                                                fontWeight:
                                                                    "500",
                                                                backgroundColor:
                                                                    "#e9ecef",
                                                                color: "#adb5bd",
                                                                border: "none",
                                                                cursor: "not-allowed",
                                                            }}
                                                        >
                                                            <i className="fas fa-upload"></i>
                                                            <span>
                                                                Sélectionner un
                                                                fichier
                                                            </span>
                                                        </button>
                                                    )}

                                                    {/* Aperçu rapide si fichier sélectionné */}
                                                    {signature_file && (
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const url =
                                                                    URL.createObjectURL(
                                                                        signature_file,
                                                                    );
                                                                window.open(
                                                                    url,
                                                                    "_blank",
                                                                );
                                                            }}
                                                            className="btn btn-outline-secondary w-100 mt-2 d-flex align-items-center justify-content-center gap-2"
                                                            style={{
                                                                borderRadius:
                                                                    "10px",
                                                                padding: "8px",
                                                                fontSize:
                                                                    "13px",
                                                            }}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                            <span>
                                                                Aperçu rapide
                                                            </span>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Message d'information */}
                                            <div
                                                className="alert alert-info mt-3 mb-0 py-2"
                                                style={{
                                                    backgroundColor:
                                                        "rgba(13, 202, 240, 0.05)",
                                                    border: "1px solid rgba(13, 202, 240, 0.2)",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="fas fa-info-circle text-info"></i>
                                                    <small className="text-muted">
                                                        La signature sera
                                                        ajoutée au dossier et
                                                        sera visible par
                                                        l'équipe de
                                                        validation...
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {dossier &&
                                        dossier.signatures &&
                                        !dossier.signatures.length && (
                                            <div className="mt-3">
                                                <ValidationFile
                                                    dossierId={getDossierId}
                                                />
                                            </div>
                                        )}

                                    {/* Validation File */}
                                    {/* {getDossierId && (
                                        <div className="mt-3">
                                            <ValidationFile
                                                dossierId={getDossierId}
                                            />
                                        </div>
                                    )} */}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Offcanvas Commentaires */}
                <div
                    className="offcanvas offcanvas-end shadow-lg"
                    tabIndex="-1"
                    style={{ width: "500px" }}
                    ref={offcanvasRef}
                    id="offcanvasCommentaires"
                    aria-labelledby="offcanvasCommentairesLabel"
                >
                    <div
                        className="offcanvas-header"
                        style={{
                            background:
                                "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                            padding: "1.2rem 1.5rem",
                            position: "sticky",
                            top: 0,
                            zIndex: 1020,
                            backdropFilter: "blur(10px)",
                            flexShrink: 0,
                            borderBottom: "1px solid rgba(255,255,255,0.3)",
                        }}
                    >
                        <div className="d-flex align-items-center w-100">
                            {/* Avatar avec initiales */}
                            <div
                                style={{
                                    width: "48px",
                                    height: "48px",
                                    background: "rgba(255,255,255,0.2)",
                                    borderRadius: "16px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginRight: "12px",
                                    position: "relative",
                                }}
                            >
                                <i className="fas fa-comment-dots fa-xl text-white"></i>

                                {/* Badge en direct */}
                                <div
                                    style={{
                                        position: "absolute",
                                        bottom: "-4px",
                                        right: "-4px",
                                        width: "16px",
                                        height: "16px",
                                        backgroundColor: "#4caf50",
                                        borderRadius: "50%",
                                        border: "2px solid #20c997",
                                        animation: "pulse 2s infinite",
                                    }}
                                ></div>
                            </div>

                            {/* Infos */}
                            <div className="flex-grow-1">
                                <h5
                                    className="fw-bold mb-0 text-white"
                                    style={{ fontSize: "1.1rem" }}
                                >
                                    Discussions
                                </h5>
                                <div className="d-flex align-items-center gap-2 mt-1">
                                    <span className="text-white-50 small">
                                        <i className="fas fa-users me-1"></i>
                                        Équipe de crédit
                                    </span>
                                    <span className="text-white-50">•</span>
                                    <span className="text-white-50 small">
                                        <i className="fas fa-clock me-1"></i>
                                        En direct
                                    </span>
                                </div>
                            </div>

                            {/* Compteur de messages */}
                            {nbCommentaires > 0 && (
                                <div
                                    style={{
                                        background: "rgba(255,255,255,0.25)",
                                        borderRadius: "30px",
                                        padding: "6px 14px",
                                        marginRight: "12px",
                                        backdropFilter: "blur(4px)",
                                    }}
                                >
                                    <span
                                        className="text-white fw-bold"
                                        style={{ fontSize: "14px" }}
                                    >
                                        {nbCommentaires}
                                    </span>
                                    <span
                                        className="text-white-50 ms-1"
                                        style={{ fontSize: "12px" }}
                                    >
                                        msg
                                    </span>
                                </div>
                            )}

                            {/* Bouton fermeture */}
                            <button
                                type="button"
                                className="btn-close btn-close-white"
                                data-bs-dismiss="offcanvas"
                                aria-label="Close"
                                style={{
                                    opacity: 0.8,
                                    transition: "all 0.2s ease",
                                    padding: "10px",
                                    borderRadius: "12px",
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.opacity = "1";
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.2)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.opacity = "0.8";
                                    e.currentTarget.style.backgroundColor =
                                        "rgba(0,0,0,0.1)";
                                }}
                            ></button>
                        </div>
                    </div>

                    <style>
                        {`
                        @keyframes pulse {
                        0% {
                            transform: scale(0.95);
                            opacity: 0.5;
                        }
                        100% {
                            transform: scale(1.2);
                            opacity: 1;
                        }
                        }

                        
                    `}
                    </style>

                    <div
                        className="offcanvas-body"
                        style={{
                            maxHeight: "calc(100vh - 200px)",
                            overflowY: "auto",
                        }}
                    >
                        {dossier &&
                        dossier.commentaires &&
                        dossier.commentaires.length > 0 ? (
                            <ul className="list-group list-group-flush">
                                {dossier.commentaires.map((commentaire) => (
                                    <CommentaireItem
                                        key={commentaire.id}
                                        commentaire={commentaire}
                                        currentUserId={currentUserId}
                                        handleReply={handleReply}
                                        onDeleteComment={getDossierCredit}
                                    />
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-5">
                                <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                                <p className="text-muted">
                                    Aucun commentaire pour ce dossier
                                </p>
                            </div>
                        )}
                    </div>

                    {replyTo && (
                        <div
                            className="alert alert-info p-2 rounded-0 m-0"
                            style={{ borderLeft: "4px solid #20c997" }}
                        >
                            <i className="fas fa-reply me-1"></i>
                            En réponse à{" "}
                            <strong>
                                {replyTo.user?.name || "Utilisateur inconnu"}
                            </strong>
                            <button
                                type="button"
                                className="btn-close float-end"
                                aria-label="Close"
                                onClick={() => setReplyTo(null)}
                            ></button>
                        </div>
                    )}
                    {/* Formulaire de commentaire collé en bas avec flexbox */}
                    <div
                        style={{
                            marginTop: "auto",
                            position: "sticky",
                            bottom: 0,
                            backgroundColor: "white",
                            borderTop: "1px solid #e9ecef",
                            boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
                        }}
                    >
                        <form onSubmit={saveComment} className="p-3">
                            <div className="d-flex gap-2">
                                <div className="flex-grow-1">
                                    <div className="position-relative">
                                        <span className="position-absolute start-0 top-50 translate-middle-y ms-3 text-teal">
                                            <FaPencilAlt size={14} />
                                        </span>
                                        <input
                                            type="text"
                                            ref={inputRef}
                                            className="form-control"
                                            style={{
                                                borderRadius: "25px",
                                                padding: "12px 20px 12px 45px",
                                                fontSize: "14px",
                                                border: "1px solid #e9ecef",
                                                backgroundColor: "#f8f9fa",
                                                transition: "all 0.2s ease",
                                            }}
                                            placeholder={
                                                replyTo
                                                    ? `✏️ Répondre à ${replyTo.user?.name || "Utilisateur"}...`
                                                    : "💬 Écrire un commentaire..."
                                            }
                                            value={contenu}
                                            onChange={(e) =>
                                                setContenu(e.target.value)
                                            }
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#20c997";
                                                e.currentTarget.style.boxShadow =
                                                    "0 0 0 3px rgba(32,201,151,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#e9ecef";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="btn d-flex align-items-center gap-2"
                                    style={{
                                        borderRadius: "25px",
                                        padding: "10px 28px",
                                        fontWeight: "600",
                                        transition: "all 0.2s ease",
                                        backgroundColor: contenu.trim()
                                            ? "#20c997"
                                            : "#e9ecef",
                                        color: contenu.trim()
                                            ? "white"
                                            : "#adb5bd",
                                        border: "none",
                                        cursor: contenu.trim()
                                            ? "pointer"
                                            : "not-allowed",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (contenu.trim()) {
                                            e.currentTarget.style.backgroundColor =
                                                "#198764";
                                            e.currentTarget.style.transform =
                                                "translateY(-1px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 4px 12px rgba(32,201,151,0.3)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (contenu.trim()) {
                                            e.currentTarget.style.backgroundColor =
                                                "#20c997";
                                            e.currentTarget.style.transform =
                                                "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                        }
                                    }}
                                    disabled={!contenu.trim()}
                                >
                                    <FaPaperPlane size={14} />
                                    <span>Envoyer</span>
                                </button>
                            </div>

                            {/* Indicateur de réponse */}
                            {replyTo && (
                                <div className="mt-2 small text-muted d-flex align-items-center gap-2">
                                    <i className="fas fa-reply text-teal"></i>
                                    <span>
                                        Réponse à{" "}
                                        <strong>
                                            {replyTo.user?.name ||
                                                "Utilisateur"}
                                        </strong>
                                    </span>
                                    <button
                                        type="button"
                                        className="btn btn-sm btn-link text-danger p-0 ms-auto"
                                        onClick={() => setReplyTo(null)}
                                        style={{ textDecoration: "none" }}
                                    >
                                        <i className="fas fa-times"></i> Annuler
                                    </button>
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>

            {dossierIdSelected && (
                <ModalCheckListSuperviseur
                    dossierId={dossierIdSelected}
                    NumDossier={dossier?.NumDossier}
                    onClose={() => setDossierIdSelected(null)}
                />
            )}

            {dossierIdSelected && (
                <ModalVisualisationGPS
                    dossierId={dossierIdSelected}
                    onClose={() => setDossierIdSelected(null)}
                />
            )}

            {/* Dans la section du modal body, après la signature ou avant les commentaires */}
            {/* Ajoutez ceci après la section signature */}
            {/* {getDossierId && (
                <>
                    <div className="mt-3">
                        <ValidationFile dossierId={getDossierId} />
                    </div>
                </>
            )} */}
        </>
    );


}

const CommentaireItem = ({
    commentaire,
    handleReply,
    level = 0,
    currentUserId,
    onDeleteComment,
}) => {
    const [showReplies, setShowReplies] = useState(false);
    const [isLoadingBar, setIsLoadingBar] = useState();

    const deleteComment = async (id) => {
        // try {
        setIsLoadingBar(true);
        const res = await axios.delete(
            `/gestion_credit/page/credit/commentaire/${id}`,
        );
        if (res.data.status === 1) {
            // Recharger les commentaires après suppression
            setIsLoadingBar(false);
            Swal.fire({
                icon: "success",
                title: "Supprimé !",
                text: res.data.msg,
                timer: 2000,
                showConfirmButton: false,
            });

            onDeleteComment(id); // rafraîchit la liste

            //onDeleteComment();
        } else {
            Swal.fire("Erreur", res.data.msg, "error");
            setIsLoadingBar(false);
        }
        // } catch (error) {
        //     Swal.fire(
        //         "Erreur",
        //         "Impossible de supprimer le commentaire",
        //         "error"
        //     );
        // }
    };
    return (
        <li
            className="list-group-item d-flex align-items-start"
            style={{ marginLeft: level * 20 }}
        >
            {isLoadingBar && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        zIndex: 1000,
                        flexDirection: "column",
                    }}
                >
                    <Bars
                        height="80"
                        width="80"
                        color="#4fa94d"
                        ariaLabel="loading"
                    />
                </div>
            )}
            {/* Cercle avec deux lettres du rôle */}
            <div
                className="me-3 d-flex align-items-center justify-content-center rounded-circle bg-primary text-white"
                style={{
                    width: "35px",
                    height: "35px",
                    fontSize: "14px",
                    fontWeight: "bold",
                }}
            >
                {commentaire.user?.role
                    ? commentaire.user.role ===
                      commentaire.user.role.toUpperCase()
                        ? commentaire.user.role
                        : commentaire.user.role
                              .split(" ")
                              .map((word) => word[0])
                              .join("")
                              .toUpperCase()
                    : ""}
            </div>

            <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <strong style={{ fontSize: "13px" }}>
                        {commentaire.user.name}
                    </strong>
                    <small className="text-muted">
                        <span>
                            {new Date(
                                commentaire.created_at,
                            ).toLocaleDateString("fr-FR")}{" "}
                            à{" "}
                            {new Date(
                                commentaire.created_at,
                            ).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </small>
                </div>

                <p
                    className="mb-1"
                    style={{
                        fontSize: "14px",
                        wordBreak: "break-word", // Force la coupure des mots longs
                        whiteSpace: "normal", // Empêche le texte de rester sur une ligne
                        overflowWrap: "break-word", // Alternative moderne
                    }}
                >
                    {commentaire.contenu}
                </p>
                <button
                    onClick={() => handleReply(commentaire)}
                    className="btn btn-sm btn-link"
                >
                    Répondre
                </button>
                {commentaire.user_id === currentUserId && ( // Seulement si c'est le propriétaire
                    <button
                        className="btn btn-sm btn-link text-danger"
                        onClick={() => deleteComment(commentaire.id)}
                    >
                        Supprimer
                    </button>
                )}

                {/* Afficher le bouton pour les réponses */}
                {commentaire.replies && commentaire.replies.length > 0 && (
                    <button
                        className="btn btn-sm btn-outline-secondary mt-1"
                        onClick={() => setShowReplies(!showReplies)}
                    >
                        {showReplies
                            ? "Masquer les réponses"
                            : `${commentaire.replies.length} réponse(s) ⬇`}
                    </button>
                )}

                {/* Conteneur des réponses */}
                {showReplies &&
                    commentaire.replies &&
                    commentaire.replies.length > 0 && (
                        <ul className="list-group mt-2 reponses rounded-10">
                            {commentaire.replies.map((reply) => (
                                <CommentaireItem
                                    key={reply.id}
                                    commentaire={reply}
                                    handleReply={handleReply}
                                    level={level + 1}
                                    currentUserId={currentUserId} // <-- on passe en prop
                                    onDeleteComment={onDeleteComment} // 🔑 propagation vers les enfants
                                />
                            ))}
                        </ul>
                    )}
            </div>
        </li>
    );
};
