// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Bars } from "react-loader-spinner";
import "../../styles/style.css";

const MontageCreditA = () => {
    const inputRef = useRef(null);
    const [error, setError] = useState([]);
    const [images, setImages] = useState([]);
    const [NumCompte, setNumCompte] = useState("");
    const [NomCompte, setNomCompte] = useState("");
    const [produit_credit, setproduit_credit] = useState("");
    const [type_credit, settype_credit] = useState("");
    const [recouvreur, setrecouvreur] = useState("");
    const [montant_demande, setmontant_demande] = useState("");
    const [date_demande, setdate_demande] = useState(new Date());
    const formattedDate = date_demande.toISOString().split("T")[0];
    const [frequence_mensualite, setfrequence_mensualite] = useState("");
    const [nombre_echeance, setnombre_echeance] = useState("");
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
    const [date_sortie_titre, setdate_sortie_titre] = useState("");
    const [date_expiration_titre, setdate_expiration_titre] = useState("");
    const [nombre_membre_groupe, setnombre_membre_groupe] = useState("");
    const [nombre_homme_groupe, setnombre_homme_groupe] = useState("");
    const [nombre_femme_groupe, setnombre_femme_groupe] = useState("");

    const [objetCredit, setObjetCredit] = useState("");
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [progress, setProgress] = useState(0);
    const [Agence,setAgence]=useState("");
    // const handleImageChange = (e) => {
    //     const files = Array.from(e.target.files);
    //     setImages(files);
    // };
    useEffect(() => {
        // Place automatiquement le curseur dans le champ à l'ouverture de la page
        inputRef.current?.focus();
    }, []);

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/"),
        );
        setImages((prev) => [...prev, ...validFiles]);
    };
    // const handleInputChange = (e) => {
    //     handleFiles(e.target.files);
    // };
    const handleInputChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            (file) =>
                file.type.startsWith("image/") ||
                file.type === "application/pdf",
        );
        setImages((prev) => [...prev, ...selectedFiles]);
    };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("NumCompte", NumCompte);
        formData.append("NomCompte", NomCompte);
        formData.append("produit_credit", produit_credit);
        formData.append("type_credit", type_credit);
        formData.append("recouvreur", recouvreur);
        formData.append("montant_demande", montant_demande);
        formData.append("date_demande", formattedDate);
        formData.append("frequence_mensualite", frequence_mensualite);
        formData.append("nombre_echeance", nombre_echeance);
        formData.append("NumDossier", NumDossier);
        formData.append("gestionnaire", gestionnaire);
        formData.append("source_fond", source_fond);
        formData.append("monnaie", monnaie);
        formData.append("duree_credit", duree_credit);
        formData.append("intervale_jrs", intervale_jrs);
        formData.append("taux_interet", taux_interet);
        formData.append("type_garantie", type_garantie);
        formData.append("valeur_comptable", valeur_comptable);
        formData.append("num_titre", num_titre);
        formData.append("valeur_garantie", valeur_garantie);
        formData.append("date_sortie_titre", date_sortie_titre);
        formData.append("date_expiration_titre", date_expiration_titre);
        formData.append("description_titre", description_titre);
        formData.append("nombre_membre_groupe", nombre_membre_groupe);
        formData.append("nombre_homme_groupe", nombre_homme_groupe);
        formData.append("nombre_femme_groupe", nombre_femme_groupe);
         formData.append("Agence", Agence);
        formData.append("objet_credit", objetCredit);

        images.forEach((img) => {
            formData.append("images[]", img); // Laravel s’attend à un tableau ici
        });

        try {
            const response = await axios.post(
                "/eco/pages/montage-credit/addnew",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total,
                        );
                        setProgress(percentCompleted);
                    },
                },
            );

            if (response.data.status == 1) {
                setIsLoadingBar(false);
                // console.log("Succès :", response.data);
                setObjetCredit("");
                setNumCompte("");
                setNomCompte("");
                setproduit_credit("");
                settype_credit("");
                setrecouvreur("");
                setmontant_demande("");
                setfrequence_mensualite("");
                setnombre_echeance("");
                setNumDossier("");
                setgestionnaire("");
                setsource_fond("");
                setmonnaie("");
                setduree_credit("");
                setintervale_jrs("");
                settaux_interet("");
                settype_garantie("");
                setvaleur_comptable("");
                setnum_titre("");
                setvaleur_garantie("");
                setdescription_titre("");
                setImages([]);
                Swal.fire({
                    title: "Montage de crédit",
                    text: response.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                //alert("Crédit enregistré avec succès !");

                // Réinitialiser les champs si besoin
            } else {
                setIsLoadingBar(false);
                Swal.fire({
                    title: "Erreur",
                    text: response.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        } catch (error) {
            console.error("Erreur :", error.response?.data || error.message);
            Swal.fire({
                title: "Erreur",
                text: error.response.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            // alert("Erreur lors de l’envoi du formulaire.");
        }
    };

    document.addEventListener("DOMContentLoaded", function () {
        let select = document.querySelector("#type_credit");
        let options = Array.from(select.options);

        options.sort((a, b) => a.text.localeCompare(b.text));

        select.innerHTML = "";

        options.forEach((option) => select.add(option));
    });
    return (
        <>
            <div className="container-fluid" style={{ marginTop: "10px" }}>
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                            <div
                                style={{
                                    background:
                                        "teal",
                                    padding: "12px 20px",
                                    borderRadius: "8px 8px 0 0",
                                }}
                            >
                                <h5
                                    className="fw-semibold mb-0"
                                    style={{
                                        color: "white",
                                        letterSpacing: "0.3px",
                                    }}
                                >
                                    <i className="fas fa-tools me-2"></i>
                                    Montage crédit
                                </h5>
                                <small
                                    className="text-white-50"
                                    style={{ fontSize: "12px" }}
                                >
                                    <i className="fas fa-hourglass-half me-1"></i>
                                    Formulaire de mise en place des crédits
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
                <form>
                    <div className="row mt-3 card rounded-0 p-3">
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
                                    style={{ color: "#fff", marginTop: "10px" }}
                                >
                                    Patientez... {progress}%
                                </h5>
                            </div>
                        )}
                        <div
                            className="container-fluid px-0"
                            style={{ marginRight: "3px" }}
                        >
                            <fieldset className="border rounded-3 p-3 bg-light shadow-sm">
                                <legend className="float-none w-auto px-2 mb-0">
                                    <h6
                                        className="text-bold mb-0"
                                        style={{
                                            fontSize: "1rem",
                                            color: "#4682b4",
                                            borderLeft: "4px solid #4682b4",
                                            paddingLeft: "10px",
                                        }}
                                    >
                                        <i className="fas fa-info-circle me-2"></i>
                                        Informations du crédit
                                    </h6>
                                </legend>

                                <div className="row g-3 mt-1">
                                    {/* Colonne 1 - Informations principales */}
                                    <div className="col-md-4">
                                        <div className="border rounded-3 p-2 bg-white h-100">
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
                                                                htmlFor="NumCompte"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i
                                                                    className="fas fa-hashtag me-1"
                                                                    style={{
                                                                        fontSize:
                                                                            "10px",
                                                                    }}
                                                                ></i>
                                                                Num Compte
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
                                                                ref={inputRef}
                                                                name="NumCompte"
                                                                id="NumCompte"
                                                                onChange={(e) =>
                                                                    setNumCompte(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    NumCompte
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
                                                                htmlFor="NomCompte"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-user me-1"></i>
                                                                Nom Compte
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
                                                                name="NomCompte"
                                                                id="NomCompte"
                                                                onChange={(e) =>
                                                                    setNomCompte(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    NomCompte
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
                                                                htmlFor="produit_credit"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-tag me-1"></i>
                                                                Produit de
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
                                                                name="produit_credit"
                                                                id="produit_credit_select"
                                                                onChange={(e) =>
                                                                    setproduit_credit(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    produit_credit
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Crédit aux MPME">
                                                                    Crédit aux
                                                                    MPME
                                                                </option>
                                                                <option value="Crédit à la consommation">
                                                                    Crédit à la
                                                                    consommation
                                                                </option>
                                                                <option value="Crédit à l'habitat">
                                                                    Crédit à
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
                                                                    Crédit Staff
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
                                                                    Crédit JIKO
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
                                                                        htmlFor="nombre_membre_groupe"
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
                                                                        name="nombre_membre_groupe"
                                                                        id="nombre_membre_groupe"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setnombre_membre_groupe(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        value={
                                                                            nombre_membre_groupe
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
                                                                        htmlFor="nombre_homme_groupe"
                                                                        className="fw-semibold small mb-0"
                                                                        style={{
                                                                            color: "#4682b4",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-mars me-1"></i>
                                                                        Nbre
                                                                        Hommes
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
                                                                        name="nombre_homme_groupe"
                                                                        id="nombre_homme_groupe"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setnombre_homme_groupe(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        value={
                                                                            nombre_homme_groupe
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
                                                                        htmlFor="nombre_femme_groupe"
                                                                        className="fw-semibold small mb-0"
                                                                        style={{
                                                                            color: "#4682b4",
                                                                        }}
                                                                    >
                                                                        <i className="fas fa-venus me-1"></i>
                                                                        Nbre
                                                                        Femmes
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
                                                                        name="nombre_femme_groupe"
                                                                        id="nombre_femme_groupe"
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            setnombre_femme_groupe(
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        value={
                                                                            nombre_femme_groupe
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                        </>
                                                    )}

                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    "6px 8px",
                                                            }}
                                                        >
                                                            <label
                                                                htmlFor="type_credit"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-chart-line me-1"></i>
                                                                Type crédit
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
                                                                name="type_credit"
                                                                id="type_credit"
                                                                onChange={(e) =>
                                                                    settype_credit(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    type_credit
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Crédit Express à CT">
                                                                    Crédit
                                                                    Express à CT
                                                                </option>
                                                                <option value="Crédits à la consommation à CT">
                                                                    Crédits à la
                                                                    consommation
                                                                    à CT
                                                                </option>
                                                                <option value="Crédit aux MPME à CT ">
                                                                    Crédit aux
                                                                    MPME à CT
                                                                </option>
                                                                <option value="Crédit Staff à MT ">
                                                                    Crédit Staff
                                                                    à MT
                                                                </option>
                                                                <option value="Crédit aux Groupes Solidaires USD ">
                                                                    Crédit aux
                                                                    Groupes
                                                                    Solidaires
                                                                    USD
                                                                </option>
                                                                <option value="Crédit Salaire à CT ">
                                                                    Crédit
                                                                    Salaire à CT
                                                                </option>
                                                                <option value="Crédit Salaire à MT">
                                                                    Crédit
                                                                    Salaire à MT
                                                                </option>
                                                                <option value="Crédit à l'habitat CT ">
                                                                    Crédit à
                                                                    l'habitat CT
                                                                </option>
                                                                <option value="Crédits à la consommation à MT ">
                                                                    Crédits à la
                                                                    consommation
                                                                    à MT
                                                                </option>
                                                                <option value="Crédit aux MPME à MT ">
                                                                    Crédit aux
                                                                    MPME à MT
                                                                </option>
                                                                <option value="Crédit aux MPME à CT en FC  ">
                                                                    Crédit aux
                                                                    MPME à CT en
                                                                    FC
                                                                </option>
                                                                <option value="Crédit aux MPME à CT en FC   ">
                                                                    Crédit aux
                                                                    MPME à CT en
                                                                    FC
                                                                </option>
                                                                <option value="Crédit aux Groupes Solidaires FC   ">
                                                                    Crédit aux
                                                                    Groupes
                                                                    Solidaires
                                                                    FC
                                                                </option>
                                                                <option value="Crédit Agro-Pastoral à CT   ">
                                                                    Crédit
                                                                    Agro-Pastoral
                                                                    à CT
                                                                </option>
                                                                <option value="Crédit MWANGAZA   ">
                                                                    Crédit
                                                                    MWANGAZA
                                                                </option>
                                                                <option value="Crédit Salaire à MT en FC   ">
                                                                    Crédit
                                                                    Salaire à MT
                                                                    en FC
                                                                </option>
                                                                <option value="Crédits JIKO BORA Menage (CT)   ">
                                                                    Crédits JIKO
                                                                    BORA Menage
                                                                    (CT)
                                                                </option>
                                                                <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                                                    Crédits JIKO
                                                                    BORA Grand
                                                                    Cons (CT)
                                                                </option>
                                                                <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                                                    Crédits
                                                                    TUFAIDIKE
                                                                    WOTE en USD
                                                                </option>
                                                                <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                                                    Crédits
                                                                    TUFAIDIKE
                                                                    WOTE en FC
                                                                </option>
                                                                <option value="Crédit aux salariés domiciliés à MT   ">
                                                                    Crédit aux
                                                                    salariés
                                                                    domiciliés à
                                                                    MT
                                                                </option>
                                                                <option value="Crédit aux MPME à MT en FC    ">
                                                                    Crédit aux
                                                                    MPME à MT en
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
                                                                htmlFor="recouvreur"
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
                                                                name="recouvreur"
                                                                id="recouvreur"
                                                                onChange={(e) =>
                                                                    setrecouvreur(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    recouvreur
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
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
                                                                    MAPENDO RUTH
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
                                                                    WIVINE ALISA
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
                                                                htmlFor="montant_demande"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-money-bill-wave me-1"></i>
                                                                Montant demandé
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
                                                                name="montant_demande"
                                                                id="montant_demande"
                                                                onChange={(e) =>
                                                                    setmontant_demande(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    montant_demande
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
                                                                htmlFor="frequence_mensualite"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-calendar-week me-1"></i>
                                                                Fréquence Mens.
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
                                                                name="frequence_mensualite"
                                                                id="frequence_mensualite"
                                                                onChange={(e) =>
                                                                    setfrequence_mensualite(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    frequence_mensualite
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Mensuelle">
                                                                    Mensuelle
                                                                </option>
                                                                <option value="Bimensuelle">
                                                                    Bimensuelle
                                                                </option>
                                                                <option value="Trimensuelle">
                                                                    Trimensuelle
                                                                </option>
                                                                <option value="Echéance">
                                                                    Echéance
                                                                </option>
                                                                <option value="Semestriel">
                                                                    Semestriel
                                                                </option>
                                                                <option value="Quatrimestriel">
                                                                    Quatrimestriel
                                                                </option>
                                                                <option value="Quintemestriel">
                                                                    Quintemestriel
                                                                </option>
                                                                <option value="Hebdomadaire">
                                                                    Hebdomadaire
                                                                </option>
                                                                <option value="Bihebdomadaire">
                                                                    Bihebdomadaire
                                                                </option>
                                                                <option value="Trihebdomadaire">
                                                                    Trihebdomadaire
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
                                                                htmlFor="nombre_echeance"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-calculator me-1"></i>
                                                                Nombre Échéances
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
                                                                name="nombre_echeance"
                                                                id="nombre_echeance"
                                                                onChange={(e) =>
                                                                    setnombre_echeance(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    nombre_echeance
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
                                                                <i className="fas fa-calculator me-1"></i>
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
                                                                onChange={(e) =>
                                                                    setAgence(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    Agence
                                                                }
                                                            >
                                                                <option value="GOMA">GOMA</option>
                                                                <option value="KATINDO">KATINDO</option>
                                                                <option value="BUNIA">BUNIA</option>
                                                          </select>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Colonne 2 - Informations complémentaires */}
                                    <div className="col-md-4">
                                        <div className="border rounded-3 p-2 bg-white h-100">
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
                                                                htmlFor="NumDossier"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-folder-open me-1"></i>
                                                                Num Dossier
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
                                                                name="NumDossier"
                                                                id="NumDossier"
                                                                onChange={(e) =>
                                                                    setNumDossier(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    NumDossier
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
                                                                htmlFor="ObjetCredit"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-bullseye me-1"></i>
                                                                Objet crédit
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
                                                                name="ObjetCredit"
                                                                id="ObjetCredit"
                                                                onChange={(e) =>
                                                                    setObjetCredit(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    objetCredit
                                                                }
                                                            >
                                                                <option value="">
                                                                    Séléctionnez
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
                                                                    ménage et
                                                                    équipement
                                                                    en mobilier
                                                                </option>
                                                                <option value="Avance sur salaire">
                                                                    Avance sur
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
                                                                    matériel de
                                                                    construction
                                                                </option>
                                                                <option value="Commerce">
                                                                    Commerce
                                                                </option>
                                                                <option value="Préfinancement de marché">
                                                                    Préfinancement
                                                                    de marché
                                                                </option>
                                                                <option value="Amélioration champ, plantation/agriculture">
                                                                    Amélioration
                                                                    champ,
                                                                    plantation/agriculture
                                                                </option>
                                                                <option value="Achat moto, voiture">
                                                                    Achat moto,
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
                                                                htmlFor="gestionnaire"
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
                                                                name="gestionnaire"
                                                                id="gestionnaire"
                                                                onChange={(e) =>
                                                                    setgestionnaire(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    gestionnaire
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
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
                                                                    MAPENDO RUTH
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
                                                                    WIVINE ALISA
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
                                                                htmlFor="source_fond"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-building me-1"></i>
                                                                Source fonds
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
                                                                name="source_fond"
                                                                id="source_fond"
                                                                onChange={(e) =>
                                                                    setsource_fond(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    source_fond
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="AKIBA YETU">
                                                                    AKIBA YETU
                                                                </option>
                                                                <option value="FPM">
                                                                    FPM
                                                                </option>
                                                                <option value="BQUE MONDIALE">
                                                                    BQUE
                                                                    MONDIALE
                                                                </option>
                                                                <option value="UNCDF">
                                                                    UNCDF
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
                                                                htmlFor="monnaie"
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
                                                                name="monnaie"
                                                                id="monnaie"
                                                                onChange={(e) =>
                                                                    setmonnaie(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={monnaie}
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="CDF">
                                                                    CDF
                                                                </option>
                                                                <option value="USD">
                                                                    USD
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
                                                                htmlFor="duree_credit"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-hourglass-half me-1"></i>
                                                                Durée crédit
                                                                (jrs)
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
                                                                name="duree_credit"
                                                                id="duree_credit"
                                                                onChange={(e) =>
                                                                    setduree_credit(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    duree_credit
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
                                                                htmlFor="intervale_jrs"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-chart-simple me-1"></i>
                                                                Intervalle (jrs)
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
                                                                name="intervale_jrs"
                                                                id="intervale_jrs"
                                                                onChange={(e) =>
                                                                    setintervale_jrs(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    intervale_jrs
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
                                                                htmlFor="taux_interet"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-percent me-1"></i>
                                                                Taux intérêt
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
                                                                name="taux_interet"
                                                                id="taux_interet"
                                                                onChange={(e) =>
                                                                    settaux_interet(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    taux_interet
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
                                                                htmlFor="date_demande"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-calendar-alt me-1"></i>
                                                                Date Demande
                                                            </label>
                                                        </td>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    "6px 8px",
                                                            }}
                                                        >
                                                            <DatePicker
                                                                selected={
                                                                    date_demande
                                                                }
                                                                onChange={(
                                                                    date,
                                                                ) =>
                                                                    setdate_demande(
                                                                        date,
                                                                    )
                                                                }
                                                                dateFormat="dd/MM/yyyy"
                                                                className="form-control form-control-sm"
                                                                name="date_demande"
                                                                id="date_demande"
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Colonne 3 - Garantie */}
                                    <div className="col-md-4">
                                        <div className="border rounded-3 p-2 bg-white h-100">
                                            <h6
                                                className="fw-semibold mb-2 pb-1"
                                                style={{
                                                    fontSize: "0.85rem",
                                                    color: "#4682b4",
                                                    borderBottom:
                                                        "2px solid #4682b4",
                                                    display: "inline-block",
                                                }}
                                            >
                                                <i className="fas fa-shield-alt me-2"></i>
                                                Garantie du crédit
                                            </h6>
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
                                                                htmlFor="type_garantie"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-shield me-1"></i>
                                                                Type garantie
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
                                                                name="type_garantie"
                                                                id="type_garantie"
                                                                onChange={(e) =>
                                                                    settype_garantie(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    type_garantie
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Certificat">
                                                                    Certificat
                                                                </option>
                                                                <option value="Fiche parcellaire">
                                                                    Fiche
                                                                    parcellaire
                                                                </option>
                                                                <option value="Salaire">
                                                                    Salaire
                                                                </option>
                                                                <option value="Caution Financière">
                                                                    Caution
                                                                    Financière
                                                                </option>
                                                                <option value="Contrat de location">
                                                                    Contrat de
                                                                    location
                                                                </option>
                                                                <option value="Acte de vente">
                                                                    Acte de
                                                                    vente
                                                                </option>
                                                                <option value="PV de mésurage et de bornage">
                                                                    PV de
                                                                    mésurage et
                                                                    de bornage
                                                                </option>
                                                                <option value="Contrat perpétuel">
                                                                    Contrat
                                                                    perpétuel
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
                                                                htmlFor="valeur_comptable"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-chart-line me-1"></i>
                                                                Valeur comptable
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
                                                                name="valeur_comptable"
                                                                id="valeur_comptable"
                                                                onChange={(e) =>
                                                                    setvaleur_comptable(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    valeur_comptable
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
                                                                htmlFor="num_titre"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-hashtag me-1"></i>
                                                                Numéro titre
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
                                                                name="num_titre"
                                                                id="num_titre"
                                                                onChange={(e) =>
                                                                    setnum_titre(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    num_titre
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
                                                                htmlFor="valeur_garantie"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                Valeur garantie
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
                                                                name="valeur_garantie"
                                                                id="valeur_garantie"
                                                                onChange={(e) =>
                                                                    setvaleur_garantie(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    valeur_garantie
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
                                                                htmlFor="date_sortie_titre"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-calendar-plus me-1"></i>
                                                                Date sortie
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
                                                                name="date_sortie_titre"
                                                                id="date_sortie_titre"
                                                                onChange={(e) =>
                                                                    setdate_sortie_titre(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    date_sortie_titre
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
                                                                htmlFor="date_expiration_titre"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-calendar-times me-1"></i>
                                                                Date Expiration
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
                                                                name="date_expiration_titre"
                                                                id="date_expiration_titre"
                                                                onChange={(e) =>
                                                                    setdate_expiration_titre(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    date_expiration_titre
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding:
                                                                    "6px 8px",
                                                                verticalAlign:
                                                                    "top",
                                                            }}
                                                        >
                                                            <label
                                                                htmlFor="description_titre"
                                                                className="fw-semibold small mb-0"
                                                                style={{
                                                                    color: "#4682b4",
                                                                }}
                                                            >
                                                                <i className="fas fa-comment me-1"></i>
                                                                Commentaire
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
                                                                name="description_titre"
                                                                id="description_titre"
                                                                onChange={(e) =>
                                                                    setdescription_titre(
                                                                        e.target
                                                                            .value,
                                                                    )
                                                                }
                                                                value={
                                                                    description_titre
                                                                }
                                                            ></textarea>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <fieldset className="border rounded-3 p-3 mt-3 bg-light shadow-sm">
                            <legend className="float-none w-auto px-2 mb-0">
                                <h6
                                    className="fw-semibold mb-0"
                                    style={{
                                        fontSize: "1rem",
                                        color: "steelblue",
                                        borderLeft: "4px solid steelblue",
                                        paddingLeft: "10px",
                                    }}
                                >
                                    Images activités (Optionnelles)
                                </h6>
                            </legend>

                            <div className="row mt-3">
                                <div className="col-md-12">
                                    {/* Zone de drop améliorée */}
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={handleClick}
                                        style={{
                                            border: "2px dashed steelblue",
                                            background:
                                                "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                                            padding: "40px 20px",
                                            textAlign: "center",
                                            borderRadius: "12px",
                                            marginBottom: "20px",
                                            cursor: "pointer",
                                            color: "#495057",
                                            position: "relative",
                                            transition: "all 0.3s ease",
                                            boxShadow:
                                                "0 2px 4px rgba(0,0,0,0.02)",
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.borderColor =
                                                "steelblue";
                                            e.currentTarget.style.background =
                                                "linear-gradient(135deg, #e9ecef 0%, #dee2e6 100%)";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.borderColor =
                                                "steelblue";
                                            e.currentTarget.style.background =
                                                "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)";
                                        }}
                                    >
                                        <div style={{ pointerEvents: "none" }}>
                                            <div
                                                style={{
                                                    fontSize: "48px",
                                                    marginBottom: "10px",
                                                }}
                                            >
                                                📸
                                            </div>
                                            <p
                                                className="mb-1 fw-semibold"
                                                style={{ color: "steelblue" }}
                                            >
                                                Glissez-déposez vos images ici
                                            </p>
                                            <p className="small text-muted mb-0">
                                                ou cliquez pour sélectionner
                                            </p>
                                            <p className="small text-muted mt-2 mb-0">
                                                Formats acceptés : JPG, PNG,
                                                GIF, PDF
                                            </p>
                                        </div>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*,application/pdf"
                                            ref={fileInputRef}
                                            onChange={handleInputChange}
                                            style={{
                                                position: "absolute",
                                                top: 0,
                                                left: 0,
                                                width: "100%",
                                                height: "100%",
                                                opacity: 0,
                                                cursor: "pointer",
                                            }}
                                        />
                                    </div>

                                    {/* Grille de prévisualisation améliorée */}
                                    {images.length > 0 && (
                                        <>
                                            <div className="d-flex justify-content-between align-items-center mb-3">
                                                <h6
                                                    className="fw-semibold mb-0"
                                                    style={{
                                                        fontSize: "0.9rem",
                                                        color: "#495057",
                                                    }}
                                                >
                                                    Fichiers sélectionnés (
                                                    {images.length})
                                                </h6>
                                                <small className="text-muted">
                                                    Cliquez sur un PDF pour
                                                    l'ouvrir
                                                </small>
                                            </div>

                                            <div
                                                style={{
                                                    display: "grid",
                                                    gridTemplateColumns:
                                                        "repeat(auto-fill, minmax(120px, 1fr))",
                                                    gap: "15px",
                                                    marginBottom: "20px",
                                                }}
                                            >
                                                {images.map((file, index) => (
                                                    <div
                                                        key={index}
                                                        style={{
                                                            position:
                                                                "relative",
                                                            display: "flex",
                                                            flexDirection:
                                                                "column",
                                                            alignItems:
                                                                "center",
                                                            background: "#fff",
                                                            borderRadius: "8px",
                                                            padding: "8px",
                                                            boxShadow:
                                                                "0 2px 8px rgba(0,0,0,0.08)",
                                                            transition:
                                                                "transform 0.2s ease, box-shadow 0.2s ease",
                                                            cursor:
                                                                file.type ===
                                                                "application/pdf"
                                                                    ? "pointer"
                                                                    : "default",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.transform =
                                                                "translateY(-2px)";
                                                            e.currentTarget.style.boxShadow =
                                                                "0 4px 12px rgba(0,0,0,0.12)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.transform =
                                                                "translateY(0)";
                                                            e.currentTarget.style.boxShadow =
                                                                "0 2px 8px rgba(0,0,0,0.08)";
                                                        }}
                                                        onClick={() => {
                                                            if (
                                                                file.type ===
                                                                "application/pdf"
                                                            ) {
                                                                window.open(
                                                                    URL.createObjectURL(
                                                                        file,
                                                                    ),
                                                                    "_blank",
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {/* Aperçu du fichier */}
                                                        {file.type.startsWith(
                                                            "image/",
                                                        ) ? (
                                                            <img
                                                                src={URL.createObjectURL(
                                                                    file,
                                                                )}
                                                                alt={`preview-${index}`}
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100px",
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius:
                                                                        "6px",
                                                                    backgroundColor:
                                                                        "#f8f9fa",
                                                                }}
                                                            />
                                                        ) : file.type ===
                                                          "application/pdf" ? (
                                                            <div
                                                                style={{
                                                                    width: "100%",
                                                                    height: "100px",
                                                                    background:
                                                                        "linear-gradient(135deg, #dc3545 0%, #c82333 100%)",
                                                                    color: "white",
                                                                    display:
                                                                        "flex",
                                                                    flexDirection:
                                                                        "column",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                    borderRadius:
                                                                        "6px",
                                                                    fontSize:
                                                                        "12px",
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                <span
                                                                    style={{
                                                                        fontSize:
                                                                            "32px",
                                                                        marginBottom:
                                                                            "4px",
                                                                    }}
                                                                >
                                                                    📄
                                                                </span>
                                                                <span>PDF</span>
                                                            </div>
                                                        ) : null}

                                                        {/* Nom du fichier */}
                                                        <small
                                                            style={{
                                                                marginTop:
                                                                    "8px",
                                                                textAlign:
                                                                    "center",
                                                                fontSize:
                                                                    "11px",
                                                                color: "#6c757d",
                                                                wordBreak:
                                                                    "break-word",
                                                                width: "100%",
                                                                overflow:
                                                                    "hidden",
                                                                textOverflow:
                                                                    "ellipsis",
                                                                whiteSpace:
                                                                    "nowrap",
                                                            }}
                                                            title={file.name}
                                                        >
                                                            {file.name.length >
                                                            20
                                                                ? file.name.substring(
                                                                      0,
                                                                      17,
                                                                  ) + "..."
                                                                : file.name}
                                                        </small>

                                                        {/* Bouton supprimer stylisé */}
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveImage(
                                                                    index,
                                                                );
                                                            }}
                                                            style={{
                                                                position:
                                                                    "absolute",
                                                                top: "-8px",
                                                                right: "-8px",
                                                                background:
                                                                    "#dc3545",
                                                                color: "white",
                                                                border: "2px solid white",
                                                                borderRadius:
                                                                    "50%",
                                                                width: "24px",
                                                                height: "24px",
                                                                cursor: "pointer",
                                                                fontSize:
                                                                    "14px",
                                                                fontWeight:
                                                                    "bold",
                                                                display: "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                transition:
                                                                    "all 0.2s ease",
                                                                boxShadow:
                                                                    "0 2px 4px rgba(0,0,0,0.2)",
                                                            }}
                                                            onMouseEnter={(
                                                                e,
                                                            ) => {
                                                                e.currentTarget.style.background =
                                                                    "#c82333";
                                                                e.currentTarget.style.transform =
                                                                    "scale(1.1)";
                                                            }}
                                                            onMouseLeave={(
                                                                e,
                                                            ) => {
                                                                e.currentTarget.style.background =
                                                                    "#dc3545";
                                                                e.currentTarget.style.transform =
                                                                    "scale(1)";
                                                            }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}

                                    {/* Bouton d'enregistrement stylisé */}
                                    <div className="d-flex justify-content-end mt-3">
                                        <button
                                            onClick={handleSubmit}
                                            className="btn btn-primary px-4 py-2"
                                            style={{
                                                borderRadius: "8px",
                                                fontWeight: "500",
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "8px",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(-1px)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 4px 12px rgba(13,110,253,0.3)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(0)";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                        >
                                            <span>💾</span>
                                            Enregistrer
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </fieldset>
                    </div>
                </form>
            </div>
        </>
    );
};

export default MontageCreditA;
