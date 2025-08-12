import React, { useEffect, useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../../../styles/style.css";
import axios from "axios";
import ValidationFile from "../../GC/Reports/ValidationFile";
import Swal from "sweetalert2";
import { FaDownload } from "react-icons/fa";

export default function ModalBootstrapVisualisation({ dossierId, onClose }) {
    const [dossier, setDossier] = useState(null);
    const modalRef = useRef(null);
    const bsModal = useRef(null);

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

    useEffect(() => {
        if (!dossierId) return;
        getDossierCredit();
    }, [dossierId]);

    const getDossierCredit = () => {
        // Charger les données
        axios
            .get(`suivi-credit/dossiers/${dossierId}`)
            .then((res) => {
                const data = res.data.data; // récupère l'objet dossier complet

                setDossier(data); // stocke tout l'objet dossier dans dossier
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
                setGetDossierId(data.id_credit);
            })
            .catch(() => setDossier(null));
    };

    useEffect(() => {
        if (!modalRef.current) return;
        bsModal.current = new window.bootstrap.Modal(modalRef.current);
        bsModal.current.show();

        // À la fermeture du modal
        modalRef.current.addEventListener("hidden.bs.modal", () => {
            onClose();
            setDossier(null);
        });

        return () => {
            // Nettoyage écouteurs si le composant est démonté
            if (modalRef.current)
                modalRef.current.removeEventListener(
                    "hidden.bs.modal",
                    () => {}
                );
        };
    }, [dossierId, onClose]);

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
                    idDossier: getDossierId,
                }
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Modification",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                getDossierCredit();
            }
        }
    };

    const handleSubmitAddFile = async (e) => {
        e.preventDefault();
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
            };

            const url = "gestion_credit/page/validation-dossier/add-file";
            axios
                .post(url, formData, config)
                .then((response) => {
                    if (response.data.status == 1) {
                        Swal.fire({
                            title: "Succès",
                            text: response.data.msg,
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
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

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            ref={modalRef}
            id="modalVisualisation"
        >
            <div className="modal fade" id="modalVisualisationDossier">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">
                                Détails du dossier{" "}
                                <strong> {NumDossier}</strong>
                            </h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                {" "}
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {!dossier && <p>Chargement...</p>}
                            {dossier && (
                                <>
                                    <div className="row">
                                        <form>
                                            <div className="row">
                                                <div className="col-md-4 card rounded-0">
                                                    <p>
                                                        <label className="label-style">
                                                            Num compte :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            value={NumCompte}
                                                            onChange={(e) =>
                                                                setNumCompte(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Num Dossier :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            value={NumDossier}
                                                            onChange={(e) =>
                                                                setNumDossier(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Nom Compte :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            value={NomCompte}
                                                            onChange={(e) =>
                                                                setNomCompte(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Produit de crédit :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "150px",
                                                            }}
                                                            value={
                                                                produit_credit
                                                            }
                                                            onChange={(e) =>
                                                                setproduit_credit(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Type crédit :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            value={type_credit}
                                                            onChange={(e) =>
                                                                settype_credit(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Recouvreur :
                                                        </label>{" "}
                                                        <select
                                                            type="text"
                                                            className="input-style"
                                                            value={recouvreur}
                                                            onChange={(e) =>
                                                                setrecouvreur(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option
                                                                value={
                                                                    recouvreur
                                                                }
                                                            >
                                                                {recouvreur}
                                                            </option>
                                                            <option value="ALAME KUZANWA WILLY">
                                                                ALAME KUZANWA
                                                                WILLY
                                                            </option>
                                                            <option value="AKILI SANGARA JULIEN">
                                                                AKILI SANGARA
                                                                JULIEN
                                                            </option>
                                                            <option value="MAPENDO RUTH">
                                                                MAPENDO RUTH
                                                            </option>
                                                            <option value="LAVIE MATEMBERA">
                                                                LAVIE MATEMBERA
                                                            </option>
                                                            <option value="KANKINSINGI NGADU">
                                                                KANKINSINGI
                                                                NGADU
                                                            </option>
                                                            <option value="NEEMA MULINGA GRACE">
                                                                NEEMA MULINGA
                                                                GRACE
                                                            </option>
                                                            <option value="WIVINE ALISA">
                                                                WIVINE ALISA
                                                            </option>
                                                            <option value="MOSES KATEMBO">
                                                                MOSES KATEMBO
                                                            </option>
                                                            <option value="SAFARI KALEKERA">
                                                                SAFARI KALEKERA
                                                            </option>
                                                        </select>
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Montant demande :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "60px",
                                                            }}
                                                            value={
                                                                montant_demande
                                                            }
                                                            onChange={(e) =>
                                                                setmontant_demande(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Date demande :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={dateParser(
                                                                date_demande
                                                            )}
                                                            onChange={(e) =>
                                                                setdate_demande(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                                <div className="col-md-4 card rounded-0">
                                                    <p>
                                                        <label className="label-style">
                                                            Frequence mens. :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            value={
                                                                frequence_mensualite
                                                            }
                                                            onChange={(e) =>
                                                                setfrequence_mensualite(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Nbre Echnce:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "50px",
                                                            }}
                                                            value={
                                                                nombre_echeance
                                                            }
                                                            onChange={(e) =>
                                                                setnombre_echeance(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Gestionnaire:
                                                        </label>{" "}
                                                        <select
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "150px",
                                                            }}
                                                            value={gestionnaire}
                                                            onChange={(e) =>
                                                                setgestionnaire(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option
                                                                value={
                                                                    gestionnaire
                                                                }
                                                            >
                                                                {gestionnaire}
                                                            </option>
                                                            <option value="ALAME KUZANWA WILLY">
                                                                ALAME KUZANWA
                                                                WILLY
                                                            </option>
                                                            <option value="AKILI SANGARA JULIEN">
                                                                AKILI SANGARA
                                                                JULIEN
                                                            </option>
                                                            <option value="MAPENDO RUTH">
                                                                MAPENDO RUTH
                                                            </option>
                                                            <option value="LAVIE MATEMBERA">
                                                                LAVIE MATEMBERA
                                                            </option>
                                                            <option value="KANKINSINGI NGADU">
                                                                KANKINSINGI
                                                                NGADU
                                                            </option>
                                                            <option value="NEEMA MULINGA GRACE">
                                                                NEEMA MULINGA
                                                                GRACE
                                                            </option>
                                                            <option value="WIVINE ALISA">
                                                                WIVINE ALISA
                                                            </option>
                                                            <option value="MOSES KATEMBO">
                                                                MOSES KATEMBO
                                                            </option>
                                                            <option value="SAFARI KALEKERA">
                                                                SAFARI KALEKERA
                                                            </option>
                                                        </select>
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Source Fonds:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "100px",
                                                            }}
                                                            value={source_fond}
                                                            onChange={(e) =>
                                                                setsource_fond(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Monnaie:
                                                        </label>{" "}
                                                        <select
                                                            type="text"
                                                            className="input-style"
                                                            value={monnaie}
                                                            onChange={(e) =>
                                                                setmonnaie(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            <option
                                                                value={monnaie}
                                                            >
                                                                {monnaie}
                                                            </option>
                                                            <option
                                                                value={monnaie}
                                                            >
                                                                {monnaie ==
                                                                "CDF"
                                                                    ? "USD"
                                                                    : "CDF"}
                                                            </option>
                                                        </select>
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Durée crédit:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={duree_credit}
                                                            onChange={(e) =>
                                                                setduree_credit(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Intervalle jrs:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={
                                                                intervale_jrs
                                                            }
                                                            onChange={(e) =>
                                                                setintervale_jrs(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Taux intérêt:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={taux_interet}
                                                            onChange={(e) =>
                                                                settaux_interet(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                </div>
                                                <div className="col-md-4 card rounded-0">
                                                    <p>
                                                        <label className="label-style">
                                                            Type Garantie:
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={
                                                                type_garantie
                                                            }
                                                            onChange={(e) =>
                                                                settype_credit(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            valeur compt. :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={
                                                                valeur_comptable
                                                            }
                                                            onChange={(e) =>
                                                                setvaleur_comptable(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Num titre :
                                                        </label>
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={num_titre}
                                                            onChange={(e) =>
                                                                setnum_titre(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Va. garantie :
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "80px",
                                                            }}
                                                            value={
                                                                valeur_garantie
                                                            }
                                                            onChange={(e) =>
                                                                setvaleur_garantie(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Date sortie titre
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "120px",
                                                            }}
                                                            value={
                                                                date_sortie_titre
                                                            }
                                                            onChange={(e) =>
                                                                setdate_sortie_titre(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        <label className="label-style">
                                                            Date expiration
                                                            titre
                                                        </label>{" "}
                                                        <input
                                                            type="text"
                                                            className="input-style"
                                                            style={{
                                                                width: "120px",
                                                            }}
                                                            value={
                                                                date_expiration_titre
                                                            }
                                                            onChange={(e) =>
                                                                setdate_expiration_titre(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        />
                                                    </p>
                                                    <p>
                                                        {/* <label className="label-style">
                                                        Descrition :
                                                    </label>{" "} */}
                                                        <textarea
                                                            className="input-style"
                                                            onChange={(e) =>
                                                                setdescription_titre(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                        >
                                                            {description_titre}
                                                        </textarea>
                                                    </p>
                                                    <p>
                                                        <button
                                                            onClick={
                                                                handleSubmitUpadate
                                                            }
                                                            className="btn btn-success mt-1"
                                                            style={{
                                                                borderRadius:
                                                                    "25px",
                                                                padding:
                                                                    "8px 16px",
                                                            }}
                                                        >
                                                            Modifier le dossier
                                                        </button>
                                                    </p>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-7">
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
                                                                            src={`/storage/${img}`}
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
                                                                    href={`/storage/${pdf}`}
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
                                        </div>
                                        {dossier.signatures &&
                                            dossier.signatures.length > 0 && (
                                                <div
                                                    className="col-md-2"
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
                                                            padding: "8px 16px",
                                                        }}
                                                    >
                                                        <FaDownload />
                                                        Télécharger
                                                    </button>
                                                </div>
                                            )}
                                        <div className="col-md-3">
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
                                                                    accept="pdf/*"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setsignature_file(
                                                                            e
                                                                                .target
                                                                                .files[0]
                                                                        )
                                                                    }
                                                                    style={{
                                                                        width: "80%",
                                                                    }}
                                                                />
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
