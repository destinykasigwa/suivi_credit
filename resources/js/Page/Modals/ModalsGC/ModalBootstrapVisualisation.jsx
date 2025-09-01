import React, { useEffect, useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../../../styles/style.css";
import axios from "axios";
import ValidationFile from "../../GC/Reports/ValidationFile";
import Swal from "sweetalert2";
import ModalVisualisationGPS from "../ModalVisualisationGPS";
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
                    handleShown
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
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer ce dossier voulez vous continuer ?",
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
                }
            );
            if (res.data.status == 1) {
                setIsLoadingBar(false);
                Swal.fire({
                    title: "Modification",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
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
                        (progressEvent.loaded * 100) / progressEvent.total
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

            // 2. Télécharger le fichier
            const link = document.createElement("a");
            link.href = fileUrl;
            link.download = filePath.split("/").pop(); // juste le nom du fichier
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // 3. Rediriger vers la page de signature
            // setTimeout(() => {
            //     window.location.href = `/signature/${dossier.id}`;
            // }, 1000);
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
                payload
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

    // Dans ton composant (avant le return)
    const nbCommentaires = countAllComments(dossier?.commentaires || []);

    return (
        <>
            <div
                className="modal fade"
                tabIndex="-1"
                aria-hidden="true"
                // ref={modalRef}
                id="modalVisualisationDossier"
            >
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <div className="row">
                                <div className="col-md-12 card rounded-10 p-1">
                                    <div
                                        style={{
                                            color: "black",
                                            display: "flex", // Utilisation de Flexbox
                                            justifyContent: "space-between", // Distribution des éléments aux extrémités
                                            alignItems: "center", // Alignement vertical des éléments
                                        }}
                                    >
                                        <h5
                                            className="text-bold p-1"
                                            style={{ margin: 0 }}
                                        >
                                            Détails du dossier
                                            <strong> {NumDossier}</strong>{" "}
                                            {" | "}
                                            <label className="label-style">
                                                Statut
                                            </label>
                                            {statutDossier == "Décaissé" ? (
                                                <select
                                                    type="text"
                                                    className="input-style"
                                                    style={{
                                                        width: "100px",
                                                    }}
                                                    value={statutDossier}
                                                    onChange={(e) =>
                                                        setstatutDossier(
                                                            e.target.value
                                                        )
                                                    }
                                                    disabled
                                                >
                                                    <option
                                                        value={statutDossier}
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
                                                </select>
                                            ) : (
                                                <select
                                                    type="text"
                                                    className="input-style"
                                                    style={{
                                                        width: "100px",
                                                    }}
                                                    value={statutDossier}
                                                    onChange={(e) =>
                                                        setstatutDossier(
                                                            e.target.value
                                                        )
                                                    }
                                                >
                                                    <option
                                                        value={statutDossier}
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
                                                </select>
                                            )}
                                        </h5>
                                        <h5
                                            className="text-bold p-1"
                                            style={{ margin: 0 }}
                                        >
                                            {dossier &&
                                                dossier.signatures &&
                                                dossier.signatures.length >
                                                    0 && (
                                                    <div
                                                        className="col-md-12"
                                                        style={{
                                                            border: "2px solid #dcdcdc",
                                                            padding: "10px",
                                                            height: "70px",
                                                        }}
                                                    >
                                                        <button
                                                            onClick={
                                                                handleSignatureClick
                                                            }
                                                            className="btn btn-primary d-flex align-items-center gap-2"
                                                            style={{
                                                                borderRadius:
                                                                    "25px",
                                                                padding:
                                                                    "8px 16px",
                                                            }}
                                                        >
                                                            <FaDownload />
                                                            Télécharger la fiche
                                                            et signer
                                                        </button>
                                                    </div>
                                                )}
                                        </h5>
                                        <h5>
                                            <button
                                                className="btn btn-outline-primary d-flex align-items-center gap-2"
                                                type="button"
                                                data-bs-toggle="offcanvas"
                                                data-bs-target="#offcanvasCommentaires"
                                                aria-controls="offcanvasCommentaires"
                                            >
                                                Commentaires
                                                <FaCommentDots />
                                                {nbCommentaires}
                                                {/* {dossier && dossier.commentaires
                                                    ? dossier.commentaires
                                                          .length
                                                    : 0} */}
                                            </button>
                                        </h5>
                                        <h5>
                                            <button
                                                className="btn btn-outline-primary d-flex align-items-center gap-2 ml-1"
                                                type="button"
                                                data-toggle="modal"
                                                data-target="#modalVisualisationGPS"
                                                onClick={() =>
                                                    setDossierIdSelected(
                                                        dossierId
                                                    )
                                                }
                                            >
                                                GPS 📍
                                            </button>
                                        </h5>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                onClick={onClose}
                            >
                                {" "}
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
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
                                    <h5
                                        style={{
                                            color: "#fff",
                                            marginTop: "10px",
                                        }}
                                    >
                                        Patientez... {progress}%
                                    </h5>
                                </div>
                            )}
                            {!dossier && <p>Chargement...</p>}
                            {dossier && (
                                <>
                                    <div className="row">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-4 card rounded-0">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Num compte :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "100px",
                                                                    }}
                                                                    value={
                                                                        NumCompte
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setNumCompte(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label className="label-style">
                                                                    Num Dossier
                                                                    :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "100px",
                                                                    }}
                                                                    value={
                                                                        NumDossier
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setNumDossier(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>

                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Nom Compte :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                {" "}
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    value={
                                                                        NomCompte
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setNomCompte(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Produit de
                                                                    crédit :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "150px",
                                                                    }}
                                                                    value={
                                                                        produit_credit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setproduit_credit(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Type crédit
                                                                    :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    value={
                                                                        type_credit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        settype_credit(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label className="label-style">
                                                                    Recouvreur :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    type="text"
                                                                    className="input-style"
                                                                    value={
                                                                        recouvreur
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setrecouvreur(
                                                                            e
                                                                                .target
                                                                                .value
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
                                                            <td>
                                                                <label className="label-style">
                                                                    Montant
                                                                    dmnde :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "60px",
                                                                    }}
                                                                    value={
                                                                        montant_demande
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setmontant_demande(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                {" "}
                                                                <label className="label-style">
                                                                    Date demande
                                                                    :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={dateParser(
                                                                        date_demande
                                                                    )}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setdate_demande(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>

                                                        {produit_credit ===
                                                            "Crédit Groupe Solidaire" && (
                                                            <>
                                                                <tr>
                                                                    <td>
                                                                        <label className="label-style">
                                                                            Nbre
                                                                            mbre
                                                                            grpe
                                                                            :
                                                                        </label>{" "}
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="input-style"
                                                                            style={{
                                                                                width: "60px",
                                                                            }}
                                                                            value={
                                                                                nombre_membre_groupe
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setnombre_membre_groupe(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        <label className="label-style">
                                                                            Nbre
                                                                            mbre
                                                                            homme
                                                                            :
                                                                        </label>{" "}
                                                                    </td>
                                                                    <td>
                                                                        <input
                                                                            type="text"
                                                                            className="input-style"
                                                                            style={{
                                                                                width: "60px",
                                                                            }}
                                                                            value={
                                                                                nombre_homme_groupe
                                                                            }
                                                                            onChange={(
                                                                                e
                                                                            ) =>
                                                                                setnombre_homme_groupe(
                                                                                    e
                                                                                        .target
                                                                                        .value
                                                                                )
                                                                            }
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </>
                                                        )}
                                                    </table>
                                                </div>
                                                <div className="col-md-4 card rounded-0">
                                                    <table>
                                                        {produit_credit ===
                                                            "Crédit Groupe Solidaire" && (
                                                            <tr>
                                                                <td>
                                                                    <label className="label-style">
                                                                        Nbre
                                                                        mbre
                                                                        femme :
                                                                    </label>{" "}
                                                                </td>
                                                                <td>
                                                                    <input
                                                                        type="text"
                                                                        className="input-style"
                                                                        style={{
                                                                            width: "60px",
                                                                        }}
                                                                        value={
                                                                            nombre_femme_groupe
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setnombre_femme_groupe(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        )}

                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Objet crédit
                                                                    :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    type="text"
                                                                    className="input-style"
                                                                    name="objetCredit"
                                                                    style={{
                                                                        width: "150px",
                                                                    }}
                                                                    value={
                                                                        objetCredit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setObjetCredit(
                                                                            e
                                                                                .target
                                                                                .value
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
                                                                        Frais de
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
                                                                        Frais de
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
                                                                        bâtie ou
                                                                        bâtie
                                                                    </option>
                                                                    <option value="Construcion et achat matériel de construction">
                                                                        Construcion
                                                                        et achat
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
                                                            <td>
                                                                <label className="label-style">
                                                                    Frequence
                                                                    mens. :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "100px",
                                                                    }}
                                                                    value={
                                                                        frequence_mensualite
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setfrequence_mensualite(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Nbre Echnce:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "50px",
                                                                    }}
                                                                    value={
                                                                        nombre_echeance
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setnombre_echeance(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Gestionnaire:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "150px",
                                                                    }}
                                                                    value={
                                                                        gestionnaire
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setgestionnaire(
                                                                            e
                                                                                .target
                                                                                .value
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
                                                            <td>
                                                                <label className="label-style">
                                                                    Source
                                                                    Fonds:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "100px",
                                                                    }}
                                                                    value={
                                                                        source_fond
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setsource_fond(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Monnaie:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <select
                                                                    type="text"
                                                                    className="input-style"
                                                                    value={
                                                                        monnaie
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setmonnaie(
                                                                            e
                                                                                .target
                                                                                .value
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
                                                                            monnaie
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
                                                            <td>
                                                                <label className="label-style">
                                                                    Durée
                                                                    crédit:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        duree_credit
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setduree_credit(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Intervalle
                                                                    jrs:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        intervale_jrs
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setintervale_jrs(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Taux
                                                                    intérêt:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        taux_interet
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        settaux_interet(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                                <div className="col-md-4 card rounded-0">
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Type
                                                                    Garantie:
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        type_garantie
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        settype_credit(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    valeur
                                                                    compt. :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        valeur_comptable
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setvaleur_comptable(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Num titre :
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        num_titre
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setnum_titre(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Va. garantie
                                                                    :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "80px",
                                                                    }}
                                                                    value={
                                                                        valeur_garantie
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setvaleur_garantie(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Date sortie
                                                                    titre
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "120px",
                                                                    }}
                                                                    value={
                                                                        date_sortie_titre
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setdate_sortie_titre(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Date
                                                                    expiration
                                                                    titre
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="input-style"
                                                                    style={{
                                                                        width: "120px",
                                                                    }}
                                                                    value={
                                                                        date_expiration_titre
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setdate_expiration_titre(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label className="label-style">
                                                                    Descrition :
                                                                </label>{" "}
                                                            </td>
                                                            <td>
                                                                <textarea
                                                                    className="input-style"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setdescription_titre(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                >
                                                                    {
                                                                        description_titre
                                                                    }
                                                                </textarea>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td>
                                                                <button
                                                                    onClick={
                                                                        handleSubmitUpadate
                                                                    }
                                                                    className="btn btn-success m-2"
                                                                    style={{
                                                                        borderRadius:
                                                                            "25px",
                                                                        padding:
                                                                            "8px 16px",
                                                                    }}
                                                                >
                                                                    Modifier le
                                                                    dossier
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="row">
                                        {/* <div className="col-md-3">
                                            {dossier.images &&
                                                dossier.images.length > 0 && (
                                                    <div>
                                                        <h6>Images :</h6>
                                                        <div
                                                            style={{
                                                                display: "flex",
                                                                flexWrap:
                                                                    "wrap",
                                                                gap: "10px",
                                                            }}
                                                        >
                                                            {dossier.images.map(
                                                                (img, i) => (
                                                                    <Zoom
                                                                        key={i}
                                                                    >
                                                                        <img
                                                                            src={`/storage/${img.path}`}
                                                                            alt={`Image ${i}`}
                                                                            style={{
                                                                                maxWidth:
                                                                                    "150px",
                                                                                maxHeight:
                                                                                    "150px",
                                                                                objectFit:
                                                                                    "cover",
                                                                                borderRadius:
                                                                                    "8px",
                                                                                cursor: "zoom-in",
                                                                                boxShadow:
                                                                                    "0 0 5px rgba(0,0,0,0.3)",
                                                                            }}
                                                                        />
                                                                    </Zoom>
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                            {dossier.pdfs &&
                                                dossier.pdfs.length > 0 && (
                                                    <div className="mt-3">
                                                        <h6>Documents PDF :</h6>
                                                        {dossier.pdfs.map(
                                                            (pdf, i) => (
                                                                <a
                                                                    key={i}
                                                                    href={`/storage/${pdf.path}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                                >
                                                                    Voir PDF{" "}
                                                                    {i + 1}
                                                                </a>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                        </div> */}

                                        <div className="col-md-12">
                                            <form>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                for="images"
                                                                class="drop-container"
                                                                id="dropcontainer"
                                                            >
                                                                <span class="drop-title">
                                                                    Drop files
                                                                    here
                                                                </span>
                                                                or
                                                                <input
                                                                    type="file"
                                                                    id="images"
                                                                    name="signature_file"
                                                                    accept="application/pdf"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setsignature_file(
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        )
                                                                    }
                                                                    // style={{
                                                                    //     width: "100%",
                                                                    // }}
                                                                />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            {signature_file && (
                                                                <button
                                                                    onClick={
                                                                        handleSubmitAddFile
                                                                    }
                                                                    className="btn btn-success mt-2"
                                                                    style={{
                                                                        borderRadius:
                                                                            "25px",
                                                                        padding:
                                                                            "8px 16px",
                                                                    }}
                                                                >
                                                                    Joindre le
                                                                    fichier
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            {getDossierId && (
                                                <ValidationFile
                                                    dossierId={getDossierId}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </>
                            )}

                            <div>
                                {/* Bouton pour ouvrir le offcanvas */}

                                {/* Offcanvas Bootstrap */}
                                <div
                                    className="offcanvas offcanvas-end shadow "
                                    tabIndex="-1"
                                    style={{ width: "600px" }} // largeur en px ou %
                                    ref={offcanvasRef} // <-- ajout
                                    id="offcanvasCommentaires"
                                    aria-labelledby="offcanvasCommentairesLabel"
                                >
                                    <div className="offcanvas-header">
                                        <h5
                                            className="offcanvas-title d-flex align-items-center gap-2"
                                            id="offcanvasCommentairesLabel"
                                        >
                                            <FaCommentDots /> Commentaires{" "}
                                            {nbCommentaires}
                                        </h5>
                                        <button
                                            type="button"
                                            className="btn-close text-reset"
                                            data-bs-dismiss="offcanvas"
                                            aria-label="Close"
                                            // onClick={() =>
                                            //     setShowCommentaires(false)
                                            // }
                                        ></button>
                                    </div>
                                    <div className="offcanvas-body">
                                        {dossier &&
                                        dossier.commentaires.length > 0 ? (
                                            <ul className="list-group">
                                                {dossier.commentaires.map(
                                                    (commentaire) => (
                                                        <CommentaireItem
                                                            key={commentaire.id}
                                                            commentaire={
                                                                commentaire
                                                            }
                                                            currentUserId={
                                                                currentUserId
                                                            } // <-- on passe en prop
                                                            handleReply={
                                                                handleReply
                                                            }
                                                            onDeleteComment={
                                                                getDossierCredit
                                                            } // passe la fonction ici
                                                        />
                                                    )
                                                )}
                                            </ul>
                                        ) : (
                                            <p className="text-muted text-center mt-3">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Aucun commentaire pour ce
                                                dossier.
                                            </p>
                                        )}
                                        {/* 🔽 marqueur pour scroller jusqu’ici */}
                                        {/* <div ref={endOfCommentsRef}></div> */}
                                    </div>

                                    {replyTo && (
                                        <div
                                            className="alert alert-info p-2 rounded-0"
                                            style={{ marginBottom: "-15px" }}
                                        >
                                            En réponse à{" "}
                                            <strong>
                                                {replyTo.user?.name ||
                                                    "Utilisateur inconnu"}
                                            </strong>
                                            <button
                                                type="button"
                                                className="btn-close float-end"
                                                aria-label="Close"
                                                onClick={() => setReplyTo(null)}
                                            ></button>
                                        </div>
                                    )}

                                    <form
                                        className="mt-3 d-flex gap-2"
                                        onSubmit={saveComment}
                                    >
                                        <div className="input-group">
                                            <span className="input-group-text">
                                                <FaPencilAlt />
                                            </span>
                                            <input
                                                type="text"
                                                ref={inputRef}
                                                className="form-control"
                                                placeholder={
                                                    replyTo
                                                        ? `Répondre à ${
                                                              replyTo.user
                                                                  ?.name ||
                                                              "Utilisateur"
                                                          }...`
                                                        : "Écrire un commentaire..."
                                                }
                                                value={contenu}
                                                onChange={(e) =>
                                                    setContenu(e.target.value)
                                                }
                                            />
                                            <button
                                                type="submit"
                                                className="btn btn-success d-flex align-items-center gap-1 rounded-0"
                                            >
                                                <FaPaperPlane /> Envoyer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {dossierIdSelected && (
                <ModalVisualisationGPS
                    dossierId={dossierIdSelected}
                    onClose={() => setDossierIdSelected(null)}
                />
            )}
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
            `/gestion_credit/page/credit/commentaire/${id}`
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
                                commentaire.created_at
                            ).toLocaleDateString("fr-FR")}{" "}
                            à{" "}
                            {new Date(
                                commentaire.created_at
                            ).toLocaleTimeString("fr-FR", {
                                hour: "2-digit",
                                minute: "2-digit",
                            })}
                        </span>
                    </small>
                </div>

                <p className="mb-1" style={{ fontSize: "14px" }}>
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
