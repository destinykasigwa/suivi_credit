// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/style.css";

const MontageCreditA = () => {
    const inputRef = useRef(null);
    const [error, setError] = useState([]);
    const [images, setImages] = useState([]);
    const [NumCompte, setNumCompte] = useState();
    const [NomCompte, setNomCompte] = useState();
    const [produit_credit, setproduit_credit] = useState();
    const [type_credit, settype_credit] = useState();
    const [recouvreur, setrecouvreur] = useState();
    const [montant_demande, setmontant_demande] = useState();
    const [date_demande, setdate_demande] = useState(new Date());
    const formattedDate = date_demande.toISOString().split("T")[0];
    const [frequence_mensualite, setfrequence_mensualite] = useState();
    const [nombre_echeance, setnombre_echeance] = useState();
    const [NumDossier, setNumDossier] = useState();
    const [gestionnaire, setgestionnaire] = useState();
    const [source_fond, setsource_fond] = useState();
    const [monnaie, setmonnaie] = useState();
    const [duree_credit, setduree_credit] = useState();
    const [intervale_jrs, setintervale_jrs] = useState();
    const [taux_interet, settaux_interet] = useState();
    const [type_garantie, settype_garantie] = useState();
    const [valeur_comptable, setvaleur_comptable] = useState();
    const [num_titre, setnum_titre] = useState();
    const [valeur_garantie, setvaleur_garantie] = useState();
    const [description_titre, setdescription_titre] = useState();
    const [objetCredit, setObjetCredit] = useState("");
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
            file.type.startsWith("image/")
        );
        setImages((prev) => [...prev, ...validFiles]);
    };
    const handleInputChange = (e) => {
        handleFiles(e.target.files);
    };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
        formData.append("description_titre", description_titre);
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
                }
            );

            if (response.data.status == 1) {
                console.log("Succès :", response.data);
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
                //setError(response.data.validate_error);
                // Concaténer tous les messages d'erreur dans un seul texte
                // const errors = response.data.validate_error;
                // const errorMessages = Object.values(errors)
                //     .flat() // pour aplatir les tableaux
                //     .join("\n"); // pour chaque erreur sur une ligne
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

    return (
        <>
            <div className="container-fluid" style={{ marginTop: "10px" }}>
                <div className="row">
                    <div className="col-md-12 card rounded-10 p-1">
                        <div
                            style={{
                                background: "teal",
                                borderRadius: "10px",
                                height: "10",
                                padding: "2px",
                                color: "white",
                            }}
                        >
                            <h5 className="text-bold p-1">Montage crédit</h5>
                        </div>{" "}
                    </div>
                </div>
                <form>
                    <div className="row mt-3 card rounded-0 p-3">
                        <div
                            className="container"
                            style={{ marginRight: "3px" }}
                        >
                            <fieldset className="border p-2">
                                <legend
                                    className="float-none w-auto p-0"
                                    style={{ fontSize: "15px" }}
                                >
                                    <h6 className="text-bold unclear-text">
                                        Informations du crédit
                                    </h6>
                                </legend>

                                <div className="row">
                                    <div className="col-md-4">
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="NumCompte"
                                                        className="label-style"
                                                    >
                                                        Num Compte
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        ref={inputRef}
                                                        name="NumCompte"
                                                        id="NumCompte"
                                                        onChange={(e) => {
                                                            setNumCompte(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={NumCompte}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="NomCompte"
                                                        className="label-style"
                                                    >
                                                        Nom Compte
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        name="NomCompte"
                                                        id="NomCompte"
                                                        onChange={(e) => {
                                                            setNomCompte(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={NomCompte}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="produit_credit"
                                                        className="label-style"
                                                    >
                                                        Produit de crédit
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "140px",
                                                        }}
                                                        name="produit_credit"
                                                        id="produit_credit"
                                                        onChange={(e) => {
                                                            setproduit_credit(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={produit_credit}
                                                    >
                                                        <option value="">
                                                            Sélectionnez
                                                        </option>
                                                        <option value="Crédit aux MPME">
                                                            Crédit aux MPME
                                                        </option>
                                                        <option value="Crédit à la consommation">
                                                            Crédit à la
                                                            consommation
                                                        </option>
                                                        <option value="Crédit à l'habitat">
                                                            Crédit à l'habitat
                                                        </option>
                                                        <option value="Crédit Groupe Solidaire">
                                                            Crédit Groupe
                                                            Solidaire
                                                        </option>
                                                        <option value="Crédit Salaire">
                                                            Crédit Salaire
                                                        </option>
                                                        <option value="Crédit Staff">
                                                            Crédit Staff
                                                        </option>
                                                        <option value="Crédit Express">
                                                            Crédit Express
                                                        </option>
                                                        <option value="Crédit Agro-Pastoral">
                                                            Crédit Agro-Pastoral
                                                        </option>
                                                        <option value="Crédit MWANGAZA">
                                                            Crédit MWANGAZA
                                                        </option>
                                                        <option value="Crédit JIKO BORA">
                                                            Crédit JIKO BORA
                                                        </option>
                                                        <option value="Crédits TUFAIDIKE WOTE">
                                                            Crédits TUFAIDIKE
                                                            WOTE
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="type_credit"
                                                        className="label-style"
                                                    >
                                                        Type crédit
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                        name="type_credit"
                                                        id="type_credit"
                                                        onChange={(e) => {
                                                            settype_credit(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={type_credit}
                                                    >
                                                        <option value="">
                                                            Sélectionnez
                                                        </option>
                                                        <option value="Crédit Express à CT">
                                                            Crédit Express à CT
                                                        </option>
                                                        <option value="Crédits à la consommation à CT">
                                                            Crédits à la
                                                            consommation à CT
                                                        </option>
                                                        <option value="Crédit aux MPME à CT ">
                                                            Crédit aux MPME à CT
                                                        </option>
                                                        <option value="Crédit Staff à MT ">
                                                            Crédit Staff à MT
                                                        </option>
                                                        <option value="Crédit aux Groupes Solidaires USD ">
                                                            Crédit aux Groupes
                                                            Solidaires USD
                                                        </option>
                                                        <option value="Crédit Salaire à CT ">
                                                            Crédit Salaire à CT
                                                        </option>
                                                        <option value="Crédit à l'habitat CT ">
                                                            Crédit à l'habitat
                                                            CT
                                                        </option>
                                                        <option value="Crédits à la consommation à MT ">
                                                            Crédits à la
                                                            consommation à MT
                                                        </option>
                                                        <option value="Crédit aux MPME à MT ">
                                                            Crédit aux MPME à MT
                                                        </option>
                                                        <option value="Crédit aux MPME à CT en FC  ">
                                                            Crédit aux MPME à CT
                                                            en FC
                                                        </option>
                                                        <option value="Crédit aux MPME à CT en FC   ">
                                                            Crédit aux MPME à CT
                                                            en FC
                                                        </option>
                                                        <option value="Crédit aux Groupes Solidaires FC   ">
                                                            Crédit aux Groupes
                                                            Solidaires FC
                                                        </option>
                                                        <option value="Crédit Agro-Pastoral à CT   ">
                                                            Crédit Agro-Pastoral
                                                            à CT
                                                        </option>
                                                        <option value="Crédit Agro-Pastoral à CT   ">
                                                            Crédit Agro-Pastoral
                                                            à CT
                                                        </option>
                                                        <option value="Crédit Agro-Pastoral à CT   ">
                                                            Crédit Agro-Pastoral
                                                            à CT
                                                        </option>
                                                        <option value="Crédit MWANGAZA   ">
                                                            Crédit MWANGAZA
                                                        </option>
                                                        <option value="Crédit Salaire à MT en FC   ">
                                                            Crédit Salaire à MT
                                                            en FC
                                                        </option>
                                                        <option value="Crédits JIKO BORA Menage (CT)   ">
                                                            Crédits JIKO BORA
                                                            Menage (CT)
                                                        </option>
                                                        <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                                            Crédits JIKO BORA
                                                            Grand Cons (CT)
                                                        </option>
                                                        <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                                            Crédits TUFAIDIKE
                                                            WOTE en USD
                                                        </option>
                                                        <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                                            Crédits TUFAIDIKE
                                                            WOTE en FC
                                                        </option>
                                                        <option value="Crédit aux salariés domiciliés à MT   ">
                                                            Crédit aux salariés
                                                            domiciliés à MT
                                                        </option>
                                                        <option value="Crédit aux MPME à MT en FC    ">
                                                            Crédit aux MPME à MT
                                                            en FC
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="recouvreur"
                                                        className="label-style"
                                                    >
                                                        Recouvreur
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                        name="recouvreur"
                                                        id="recouvreur"
                                                        onChange={(e) => {
                                                            setrecouvreur(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={recouvreur}
                                                    >
                                                        <option value="">
                                                            Sélectionnez
                                                        </option>
                                                        <option value="ALAME KUZANWA WILLY">
                                                            ALAME KUZANWA WILLY
                                                        </option>
                                                        <option value="AKILI SANGARA JULIEN">
                                                            AKILI SANGARA JULIEN
                                                        </option>
                                                        <option value="MAPENDO RUTH">
                                                            MAPENDO RUTH
                                                        </option>
                                                        <option value="LAVIE MATEMBERA">
                                                            LAVIE MATEMBERA
                                                        </option>
                                                        <option value="KANKINSINGI NGADU">
                                                            KANKINSINGI NGADU
                                                        </option>
                                                        <option value="NEEMA MULINGA GRACE">
                                                            NEEMA MULINGA GRACE
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
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="montant_demande"
                                                        className="label-style"
                                                    >
                                                        Montant D.
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        name="montant_demande"
                                                        id="montant_demande"
                                                        onChange={(e) => {
                                                            setmontant_demande(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={montant_demande}
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="frequence_mensualite"
                                                        className="label-style"
                                                    >
                                                        Frequence Mens.
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        name="frequence_mensualite"
                                                        id="frequence_mensualite"
                                                        onChange={(e) => {
                                                            setfrequence_mensualite(
                                                                e.target.value
                                                            );
                                                        }}
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
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="nombre_echeance"
                                                        className="label-style"
                                                    >
                                                        Nombre Echnce
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        name="nombre_echeance"
                                                        id="nombre_echeance"
                                                        onChange={(e) => {
                                                            setnombre_echeance(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={nombre_echeance}
                                                    />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div className="col-md-4">
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="NumDossier"
                                                        className="label-style"
                                                    >
                                                        Num Dossier
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        name="NumDossier"
                                                        id="NumDossier"
                                                        onChange={(e) => {
                                                            setNumDossier(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={NumDossier}
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="gestionnaire"
                                                        className="label-style"
                                                    >
                                                        Gestionnaire
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                        name="gestionnaire"
                                                        id="gestionnaire"
                                                        onChange={(e) => {
                                                            setgestionnaire(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={gestionnaire}
                                                    >
                                                        <option value="">
                                                            Sélectionnez
                                                        </option>
                                                        <option value="ALAME KUZANWA WILLY">
                                                            ALAME KUZANWA WILLY
                                                        </option>
                                                        <option value="AKILI SANGARA JULIEN">
                                                            AKILI SANGARA JULIEN
                                                        </option>
                                                        <option value="MAPENDO RUTH">
                                                            MAPENDO RUTH
                                                        </option>
                                                        <option value="LAVIE MATEMBERA">
                                                            LAVIE MATEMBERA
                                                        </option>
                                                        <option value="KANKINSINGI NGADU">
                                                            KANKINSINGI NGADU
                                                        </option>
                                                        <option value="NEEMA MULINGA GRACE">
                                                            NEEMA MULINGA GRACE
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
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="source_fond"
                                                        className="label-style"
                                                    >
                                                        Source fond
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        name="source_fond"
                                                        id="source_fond"
                                                        onChange={(e) => {
                                                            setsource_fond(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={source_fond}
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
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="monnaie"
                                                        className="label-style"
                                                    >
                                                        Monnaie
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        name="monnaie"
                                                        id="monnaie"
                                                        onChange={(e) => {
                                                            setmonnaie(
                                                                e.target.value
                                                            );
                                                        }}
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
                                                <td>
                                                    <label
                                                        htmlFor="duree_credit"
                                                        className="label-style"
                                                    >
                                                        Durée crédit
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        name="duree_credit"
                                                        id="duree_credit"
                                                        onChange={(e) => {
                                                            setduree_credit(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={duree_credit}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="intervale_jrs"
                                                        className="label-style"
                                                    >
                                                        Intervale(jrs)
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        name="intervale_jrs"
                                                        id="intervale_jrs"
                                                        onChange={(e) => {
                                                            setintervale_jrs(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={intervale_jrs}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="taux_interet"
                                                        className="label-style"
                                                    >
                                                        Taux intérêt
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        name="taux_interet"
                                                        id="taux_interet"
                                                        onChange={(e) => {
                                                            settaux_interet(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={taux_interet}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="date_demande"
                                                        className="label-style"
                                                    >
                                                        Date Demande
                                                    </label>
                                                </td>
                                                <td>
                                                    <DatePicker
                                                        selected={date_demande}
                                                        onChange={(date) =>
                                                            setdate_demande(
                                                                date
                                                            )
                                                        }
                                                        dateFormat="dd/MM/yyyy"
                                                        className="form-control custom-date"
                                                        name="date_demande"
                                                        id="date_demande"
                                                    />
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                    <div
                                        className="col-md-4"
                                        style={{
                                            border: "1px solid #dcdcdc",
                                            padding: "2px",
                                        }}
                                    >
                                        <legend
                                            className="float-none w-auto p-0"
                                            style={{ fontSize: "15px" }}
                                        >
                                            <p className="text-bold unclear-text">
                                                Garantie du crédit
                                            </p>
                                        </legend>
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="type_garantie"
                                                        className="label-style"
                                                    >
                                                        Type garantie
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "170px",
                                                        }}
                                                        name="type_garantie"
                                                        id="type_garantie"
                                                        onChange={(e) => {
                                                            settype_garantie(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={type_garantie}
                                                    >
                                                        <option value="">
                                                            Sélectionnez
                                                        </option>
                                                        <option value="Certificat">
                                                            Certificat
                                                        </option>
                                                        <option value="Fiche parcellaire">
                                                            Fiche parcellaire
                                                        </option>
                                                        <option value="Salaire">
                                                            Salaire
                                                        </option>
                                                        <option value="Caution Financière">
                                                            Caution Financière
                                                        </option>
                                                        <option value="Contrat de location">
                                                            Contrat de location
                                                        </option>
                                                        <option value="Acte de vente">
                                                            Acte de vente
                                                        </option>
                                                        <option value="PV de mésurage et de bornage">
                                                            PV de mésurage et de
                                                            bornage
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="valeur_comptable"
                                                        className="label-style"
                                                    >
                                                        Valeur comptable
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        name="valeur_comptable"
                                                        id="valeur_comptable"
                                                        onChange={(e) => {
                                                            setvaleur_comptable(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={valeur_comptable}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="num_titre"
                                                        className="label-style"
                                                    >
                                                        Numero titre
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        name="num_titre"
                                                        id="num_titre"
                                                        onChange={(e) => {
                                                            setnum_titre(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={num_titre}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="valeur_garantie"
                                                        className="label-style"
                                                    >
                                                        Valeur garantie
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        name="valeur_garantie"
                                                        id="valeur_garantie"
                                                        onChange={(e) => {
                                                            setvaleur_garantie(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={valeur_garantie}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="description_titre"
                                                        className="label-style"
                                                    >
                                                        Description
                                                    </label>
                                                </td>
                                                <td>
                                                    <textarea
                                                        type="text"
                                                        className="input-style"
                                                        name="description_titre"
                                                        id="description_titre"
                                                        onChange={(e) => {
                                                            setdescription_titre(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            description_titre
                                                        }
                                                    ></textarea>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </fieldset>
                        </div>

                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                <h6 className="text-bold unclear-text">
                                    Pièces jointes
                                </h6>
                            </legend>

                            <div className="row">
                                <div className="col-md-12">
                                    <div
                                        onDrop={handleDrop}
                                        onDragOver={handleDragOver}
                                        onClick={handleClick}
                                        style={{
                                            border: "2px dashed #aaa",
                                            padding: "30px",
                                            textAlign: "center",
                                            borderRadius: "10px",
                                            marginBottom: "15px",
                                            cursor: "pointer",
                                            color: "#555",
                                            position: "relative",
                                        }}
                                    >
                                        <p>
                                            Glissez-déposez vos images ici ou
                                            cliquez pour sélectionner
                                        </p>

                                        <input
                                            type="file"
                                            multiple
                                            accept="image/*"
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

                                    {/* ✅ Prévisualisation avec bouton supprimer */}
                                    <div
                                        style={{
                                            display: "flex",
                                            flexWrap: "wrap",
                                            gap: "10px",
                                        }}
                                    >
                                        {images.map((img, index) => (
                                            <div
                                                key={index}
                                                style={{
                                                    position: "relative",
                                                }}
                                            >
                                                <img
                                                    src={URL.createObjectURL(
                                                        img
                                                    )}
                                                    alt={`preview-${index}`}
                                                    width="100"
                                                    height="100"
                                                    style={{
                                                        objectFit: "cover",
                                                        borderRadius: "5px",
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleRemoveImage(index)
                                                    }
                                                    style={{
                                                        position: "absolute",
                                                        top: "-8px",
                                                        right: "-8px",
                                                        background: "red",
                                                        color: "white",
                                                        border: "none",
                                                        borderRadius: "50%",
                                                        width: "20px",
                                                        height: "20px",
                                                        cursor: "pointer",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    ×
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <tr>
                                        <td></td>
                                        <td>
                                            <button
                                                onClick={handleSubmit}
                                                className="btn btn-primary rounded-10 mt-1"
                                            >
                                                Enregistrer
                                            </button>
                                        </td>
                                    </tr>
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
