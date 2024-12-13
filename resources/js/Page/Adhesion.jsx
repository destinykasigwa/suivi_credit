import styles from "../styles/RegisterForm.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Adhesion = () => {
    const [adhesion, setAdhesion] = useState({
        agence: "",
        code_monnaie: "CDF",
        type_epargne: "",
        type_client: "",
        intitule_compte: "",
        lieu_naissance: "",
        date_naissance: "",
        etat_civile: "",
        nom_condjoint: "",
        nom_pere: "",
        nom_mere: "",
        profession: "",
        lieu_travail: "",
        civilite: "",
        sexe: "",
        email: "",
        telephone: "",
        type_piece: "",
        num_piece: "",
        lieu_devivraison_piece: "",
        province: "",
        territoire_ou_ville: "",
        commune: "",
        quartier: "",
        type_de_gestion: "",
        critere: "",
    });
    const [isLoading1, setIsloading1] = useState(false);
    const [isLoading2, setIsloading2] = useState(false);
    const [error, setError] = useState([]);

    ///UPDATE ATTRIBUTE

    const [agence, setagence] = useState();
    const [code_monnaie, setcode_monnaie] = useState();
    const [type_epargne, settype_epargne] = useState();
    const [type_client, settype_client] = useState();
    const [intitule_compte, setintitule_compte] = useState();
    const [lieu_naissance, setlieu_naissance] = useState();
    const [date_naissance, setdate_naissance] = useState();
    const [etat_civile, setetat_civile] = useState();
    const [nom_condjoint, setnom_condjoint] = useState();
    const [nom_pere, setnom_pere] = useState();
    const [nom_mere, setnom_mere] = useState();
    const [profession, setprofession] = useState();
    const [lieu_travail, setlieu_travail] = useState();
    const [civilite, setcivilite] = useState();
    const [sexe, setsexe] = useState();
    const [email, setemail] = useState();
    const [telephone, settelephone] = useState();
    const [type_piece, settype_piece] = useState();
    const [num_piece, setnum_piece] = useState();
    const [lieu_devivraison_piece, setlieu_devivraison_piece] = useState();
    const [province, setprovince] = useState();
    const [territoire_ou_ville, setterritoire_ou_ville] = useState();
    const [commune, setcommune] = useState();
    const [quartier, setquartier] = useState();
    const [type_de_gestion, settype_de_gestion] = useState();
    const [critere, setcritere] = useState();
    const [compte_to_search, setcompte_to_search] = useState();
    const [signature_image_file, setsignature_image_file] = useState();
    const [signature_file, setsignature_file] = useState();

    //ACTIVATION COMPTE ATTRIBUTE
    const [devise_compte, setdevise_compte] = useState("CDF");
    const [mandataireName, setmandataireName] = useState();
    const [mandatairePhone, setmandatairePhone] = useState();
    const [fetchMandataire, setFetchMandataire] = useState();

    //ENREGISTRE LES DONNEES POUR LE NOUVEAU MEMBRE CREE
    const handleSubmitAdhesion = async (e) => {
        e.preventDefault();
        setIsloading1(true);
        const res = await axios.post("/eco/page/adhesion-membre", adhesion);
        if (res.data.status == 1) {
            setIsloading1(false);
            adhesion.intitule_compte = "";
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                confirmButtonText: "Okay",
            });
        } else if (res.data.status == 0) {
            setIsloading1(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading1(false);
            setError(res.data.validate_error);
            console.log(res.data.validate_error);
        }
    };
    //PERMET DE RECUPERER LE MANDATAIRE ASSOCIE A UN COMPTE

    const getMandataires = async () => {
        // e.preventDefault();
        const res = await axios.post("/eco/pages/adhesion/get-mandaitre", {
            compte_to_search: compte_to_search,
        });
        if (res.data.status == 1) {
            setFetchMandataire(res.data.data);
            console.log(fetchMandataire);
        } else {
            console.log("something went rwong");
        }
    };

    //GET DATA TO UPDATE
    const getSeachedData = async (e) => {
        e.preventDefault();

        //console.log(compte_to_search);
        const res = await axios.post("/eco/page/adhesion/get-searched-item", {
            compte_to_search,
        });
        if (res.data.status == 1) {
            getMandataires(); //AFFICHE LES MANDATAIRES ASSOCIE A UN COMPTE
            setagence(res.data.data.agence);
            setcode_monnaie(res.data.data.code_monnaie);
            settype_epargne(res.data.data.type_epargne);
            settype_client(res.data.data.type_client);
            setintitule_compte(res.data.data.intitule_compte);
            setlieu_naissance(res.data.data.lieu_naissance);
            setdate_naissance(res.data.data.date_naissance);
            setetat_civile(res.data.data.etat_civile);
            setnom_condjoint(res.data.data.nom_condjoint);
            setnom_pere(res.data.data.nom_pere);
            setnom_mere(res.data.data.nom_mere);
            setprofession(res.data.data.profession);
            setlieu_travail(res.data.data.lieu_travail);
            setcivilite(res.data.data.civilite);
            setsexe(res.data.data.sexe);
            setemail(res.data.data.email);
            settelephone(res.data.data.telephone);
            settype_piece(res.data.data.type_piece);
            setnum_piece(res.data.data.num_piece);
            setlieu_devivraison_piece(res.data.data.lieu_devivraison_piece);
            setprovince(res.data.data.province);
            setterritoire_ou_ville(res.data.data.territoire_ou_ville);
            setcommune(res.data.data.commune);
            setquartier(res.data.data.quartier);
            settype_de_gestion(res.data.data.type_de_gestion);
            setcritere(res.data.data.critere);
            // setFetchDataToUpdate(res.data.data);
            setsignature_file(res.data.data.signature_image_file);
        } else if (res.data.status == 0) {
            setIsloading2(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                confirmButtonText: "Okay",
            });
        }
    };

    const handleSubmitAdhesionUpdate = async (e) => {
        e.preventDefault();
        setIsloading2(true);
        const res = await axios.post("/eco/page/adhesion-membre/update", {
            compte_to_search,
            type_epargne,
            type_client,
            intitule_compte,
            lieu_naissance,
            date_naissance,
            etat_civile,
            nom_condjoint,
            nom_pere,
            nom_mere,
            profession,
            lieu_travail,
            civilite,
            sexe,
            email,
            telephone,
            type_piece,
            num_piece,
            lieu_devivraison_piece,
            province,
            territoire_ou_ville,
            commune,
            quartier,
            type_de_gestion,
            critere,
        });
        if (res.data.status == 1) {
            setIsloading2(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                confirmButtonText: "Okay",
            });
        } else if (res.data.status == 0) {
            setIsloading2(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading2(false);
            setError(res.data.validate_error);
        }
    };

    const updateMembreSignature = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("signature_image_file", signature_image_file);
            formData.append("compte_to_search", compte_to_search);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
            };

            const url = "/eco/page/adhesion/edit-signature";
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

    //CREATE NEW ACCOUNT FOR USER
    const createAccount = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/adhesion/creation-compte", {
            compteAbrege: compte_to_search,
            devise_compte: devise_compte,
        });
        console.log(res.data.status);
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    const AjouterMandataire = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/pages/adhesion/ajout-mandataire", {
            compteAbrege: compte_to_search,
            mandataireName,
            mandatairePhone,
        });
        if (res.data.status == 1) {
            getMandataires(); //AFFICHE LES MANDATAIRES ASSOCIE A UN COMPTE
            setmandataireName("");
            setmandatairePhone("");
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };
    //PERMET DE SUPPRIMER UN MANDATAIRE
    const DeleteMandataire = async (id) => {
        Swal.fire({
            title: "Confirmation !",
            text: "Etes vous sûr de supprimer ce mandataire ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui supprimer!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.get(
                        "/eco/pages/adhesion/suppression-mandataire/" + id
                    );
                    if (res.data.status === 1) {
                        getMandataires(); //MET AJOUR LE TABLEAU APRES SUPPRESSION
                        Swal.fire({
                            title: "Succès",
                            text: res.data.msg,
                            icon: "success",
                            timer: 8000,
                            confirmButtonText: "Okay",
                        });
                    } else {
                        Swal.fire({
                            title: "Erreur",
                            text: res.data.msg,
                            icon: "error",
                            timer: 8000,
                            confirmButtonText: "Okay",
                        });
                    }
                } catch (error) {
                    Swal.fire({
                        title: "Erreur",
                        text: "Une erreur est survenue .",
                        icon: "error",
                        timer: 8000,
                        confirmButtonText: "Okay",
                    });
                    console.error(error);
                }
            }
        });
    };
    return (
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
                        <h5 className="text-bold p-1">Adhésion des membres</h5>
                    </div>{" "}
                    <ul
                        className="nav nav-tabs mt-1"
                        id="custom-tabs-one-tab"
                        role="tablist"
                        style={{ background: "teal", borderRadius: "10px" }}
                    >
                        <li className="nav-item">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    fontWeight: "bold",
                                }}
                                className="nav-link active"
                                id="custom-tabs-one-1-tab"
                                data-toggle="pill"
                                href="#custom-tabs-one-1"
                                role="tab"
                                aria-controls="custom-tabs-one-1"
                                aria-selected="false"
                                // style={{ color: "#000", fontSize: "17px" }}
                            >
                                Informations de base
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    fontWeight: "bold",
                                }}
                                className="nav-link"
                                id="custom-tabs-two-2-tab"
                                data-toggle="pill"
                                href="#custom-tabs-two-2"
                                role="tab"
                                aria-controls="custom-tabs-two-2"
                                aria-selected="false"
                                // style={{ color: "#000", fontSize: "17px" }}
                            >
                                Photo et signature
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    fontWeight: "bold",
                                }}
                                className="nav-link"
                                id="custom-tabs-three-3-tab"
                                data-toggle="pill"
                                href="#custom-tabs-three-3"
                                role="tab"
                                aria-controls="custom-tabs-three-3"
                                aria-selected="false"
                                // style={{ color: "#000", fontSize: "17px" }}
                            >
                                Information mendataires
                            </a>
                        </li>
                        <li className="nav-item">
                            <a
                                style={{
                                    textDecoration: "none",
                                    color: "#000",
                                    fontWeight: "bold",
                                }}
                                className="nav-link"
                                id="custom-tabs-four-4-tab"
                                data-toggle="pill"
                                href="#custom-tabs-four-4"
                                role="tab"
                                aria-controls="custom-tabs-four-4"
                                aria-selected="false"
                                // style={{ color: "#000", fontSize: "17px" }}
                            >
                                Création comptes
                            </a>
                        </li>
                    </ul>
                    <div className="card-body">
                        <div
                            className="tab-content"
                            id="custom-tabs-one-tabContent"
                        >
                            <div
                                className="tab-pane fade show active"
                                id="custom-tabs-one-1"
                                role="tabpanel"
                                aria-labelledby="custom-tabs-one-1-tab"
                            >
                                <div className="row">
                                    <div className="col-md-5 card rounded-0 p-3">
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="agence"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Agence
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="agence"
                                                                name="agence"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.agence
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            agence: e
                                                                                .target
                                                                                .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="SIEGE">
                                                                    SIEGE
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="code_monnaie"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Code monaie
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="code_monnaie"
                                                                type="text"
                                                                name="code_monnaie"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            code_monnaie:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                disabled
                                                            >
                                                                {/* <option value="">
                                                                    Sélectionnez
                                                                </option> */}
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
                                                                htmlFor="type_epargne"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type epargne
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_epargne"
                                                                type="text"
                                                                name="type_epargne"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.type_epargne
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            type_epargne:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Epargne à vie">
                                                                    Epargne à
                                                                    vie
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_client"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type client
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_client"
                                                                type="text"
                                                                name="type_client"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.type_client
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            type_client:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Personne pysique">
                                                                    Personne
                                                                    pysique
                                                                </option>
                                                                <option value="Personne morale">
                                                                    Personne
                                                                    morale
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="intitule_compte"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Intitulé de
                                                                compte
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="intitule_compte"
                                                                type="text"
                                                                name="intitule_compte"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.intitule_compte
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            intitule_compte:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.intitule_compte
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                                <p
                                    className="border border-10"
                                    style={{
                                        background: "#dcdcdc",
                                        padding: "1px",
                                    }}
                                ></p>
                                <div
                                    className="row"
                                    // style={{
                                    //     height: "250px",
                                    //     overflowY: "scroll",
                                    // }}
                                >
                                    <div className="col-md-3">
                                        <p className="text-bold">IDENTITE</p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_naissance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Lieu de
                                                                naissance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_naissance"
                                                                type="text"
                                                                name="lieu_naissance"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            lieu_naissance:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.lieu_naissance
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="date_naissance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Date de
                                                                naissance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="date_naissance"
                                                                type="text"
                                                                name="date_naissance"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            date_naissance:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.date_naissance
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="etat_civile"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Etat civile
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="etat_civile"
                                                                name="etat_civile"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            etat_civile:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.etat_civile
                                                                }
                                                            >
                                                                <option value="">
                                                                    Séléctionnez
                                                                </option>
                                                                <option value="Marié(e)">
                                                                    Marié(e)
                                                                </option>
                                                                <option value="Célibateur">
                                                                    Célibateur
                                                                </option>
                                                                <option value="Veuf(ve)">
                                                                    Veuf(ve)
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    {adhesion.nom_condjoint && (
                                                        <tr>
                                                            <td>
                                                                <label
                                                                    htmlFor="nom_condjoint"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Marié(e) à
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    id="nom_condjoint"
                                                                    type="text"
                                                                    name="nom_condjoint"
                                                                    style={{
                                                                        padding:
                                                                            "1px ",
                                                                        border: "1px solid #dcdcdc",
                                                                        marginBottom:
                                                                            "5px",
                                                                        // width: "100px",
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setAdhesion(
                                                                            (
                                                                                p
                                                                            ) => ({
                                                                                ...p,
                                                                                nom_condjoint:
                                                                                    e
                                                                                        .target
                                                                                        .value,
                                                                            })
                                                                        )
                                                                    }
                                                                    value={
                                                                        adhesion.nom_condjoint
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="nom_pere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Nom du père
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="nom_pere"
                                                                type="text"
                                                                name="nom_pere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            nom_pere:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.nom_pere
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="nom_mere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Nom de la mère
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="nom_mere"
                                                                type="text"
                                                                name="nom_mere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            nom_mere:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.nom_mere
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="profession"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Proffession
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="profession"
                                                                type="text"
                                                                name="profession"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            profession:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.profession
                                                                }
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_travail"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Lieu de travail
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_travail"
                                                                type="text"
                                                                name="lieu_travail"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            lieu_travail:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.lieu_travail
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="civilite"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Civilité
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="civilite"
                                                                type="text"
                                                                name="civilite"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            civilite:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Monsieur">
                                                                    Monsieur
                                                                </option>
                                                                <option value="Madame">
                                                                    Madame
                                                                </option>
                                                                <option value="Mademoiselle">
                                                                    Mademoiselle
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="sexe"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Sexe
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="sexe"
                                                                type="text"
                                                                name="sexe"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            sexe: e
                                                                                .target
                                                                                .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Homme">
                                                                    Homme
                                                                </option>
                                                                <option value="Femme">
                                                                    Femme
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="email"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Email
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="email"
                                                                type="text"
                                                                name="email"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            email: e
                                                                                .target
                                                                                .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.email
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="telephone"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Téléphone
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="telephone"
                                                                type="text"
                                                                name="telephone"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            telephone:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.telephone
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type pièce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_piece"
                                                                type="text"
                                                                name="type_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            type_piece:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Carte d'électeur">
                                                                    Carte
                                                                    d'électeur
                                                                </option>
                                                                <option value="pass port">
                                                                    Pass port
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="num_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Num pièce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="num_piece"
                                                                type="text"
                                                                name="num_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            num_piece:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.num_piece
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_delivraison_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Délivée à
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_devivraison_piece"
                                                                type="text"
                                                                name="lieu_devivraison_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            lieu_devivraison_piece:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                                value={
                                                                    adhesion.lieu_devivraison_piece
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="text-bold">ADRESSE</p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="province"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Province
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="province"
                                                                name="province"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            province:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Nord kivu">
                                                                    Nord kivu
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="territoire_ou_ville"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Territoire ou
                                                                ville
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="territoire_ou_ville"
                                                                name="territoire_ou_ville"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            territoire_ou_ville:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="commune"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Secteur chef ou
                                                                com.
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="commune"
                                                                name="commune"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            commune:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="quartier"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Quartier
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="quartier"
                                                                name="quartier"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            quartier:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="text-bold">
                                            AUTRES INFORMATIONS
                                        </p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_de_gestion"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type de gestion
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_de_gestion"
                                                                name="type_de_gestion"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            type_de_gestion:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Individuel">
                                                                    Individuel
                                                                </option>
                                                                <option value="Collectif">
                                                                    Collectif
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="critere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Critère
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="critere"
                                                                name="critere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    marginBottom:
                                                                        "5px",
                                                                    border: `${
                                                                        error.critere
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                }}
                                                                onChange={(e) =>
                                                                    setAdhesion(
                                                                        (
                                                                            p
                                                                        ) => ({
                                                                            ...p,
                                                                            critere:
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="A">
                                                                    A
                                                                </option>
                                                                <option value="B">
                                                                    B
                                                                </option>
                                                                <option value="C">
                                                                    C
                                                                </option>
                                                                <option value="D">
                                                                    D
                                                                </option>
                                                                <option value="Autre">
                                                                    Autre
                                                                </option>
                                                            </select>{" "}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <button
                                                                onClick={
                                                                    handleSubmitAdhesion
                                                                }
                                                                className="btn btn-primary rounded-10"
                                                            >
                                                                {isLoading1 ? (
                                                                    <span class="spinner-border spinner-border-sm visible"></span>
                                                                ) : (
                                                                    "Enregistrer"
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="custom-tabs-two-2"
                                role="tabpanel"
                                aria-labelledby="custom-tabs-two-2-tab"
                            >
                                <div className="row">
                                    <div className="col-md-5 card rounded-0 p-3">
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="agence"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Compte abregé
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="compte_to_search"
                                                                name="compte_to_search"
                                                                type="text"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.agence
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    width: "80px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setcompte_to_search(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                className="btn btn-primary rounded-0"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    marginTop:
                                                                        "-5px",
                                                                }}
                                                                onClick={
                                                                    getSeachedData
                                                                }
                                                            >
                                                                Rechercher
                                                            </button>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="code_monnaie"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Code monaie
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="code_monnaie"
                                                                type="text"
                                                                name="code_monnaie"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                value={
                                                                    code_monnaie
                                                                }
                                                                disabled
                                                            >
                                                                {/* <option value="">
                                                                    Sélectionnez
                                                                </option> */}
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
                                                                htmlFor="type_epargne"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type epargne
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_epargne"
                                                                type="text"
                                                                name="type_epargne"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.type_epargne
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settype_epargne(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        type_epargne
                                                                    }
                                                                >
                                                                    {
                                                                        type_epargne
                                                                    }
                                                                </option>
                                                                <option value="Epargne à vie">
                                                                    Epargne à
                                                                    vie
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_client"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type client
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_client"
                                                                type="text"
                                                                name="type_client"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.type_client
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settype_client(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        type_client
                                                                    }
                                                                >
                                                                    {
                                                                        type_client
                                                                    }
                                                                </option>
                                                                <option value="Personne pysique">
                                                                    Personne
                                                                    pysique
                                                                </option>
                                                                <option value="Personne morale">
                                                                    Personne
                                                                    morale
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="intitule_compte"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Intitulé de
                                                                compte
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="intitule_compte"
                                                                type="text"
                                                                name="intitule_compte"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.intitule_compte
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setintitule_compte(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    intitule_compte
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                </div>
                                <p
                                    className="border border-10"
                                    style={{
                                        background: "#dcdcdc",
                                        padding: "1px",
                                    }}
                                ></p>
                                <div
                                    className="row"
                                    // style={{
                                    //     height: "280px",
                                    //     overflowY: "scroll",
                                    // }}
                                >
                                    <div className="col-md-3">
                                        <p className="text-bold">IDENTITE</p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_naissance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Lieu de
                                                                naissance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_naissance"
                                                                type="text"
                                                                name="lieu_naissance"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setlieu_naissance(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    lieu_naissance
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="date_naissance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Date de
                                                                naissance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="date_naissance"
                                                                type="text"
                                                                name="date_naissance"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setdate_naissance(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    date_naissance
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="etat_civile"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Etat civile
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="etat_civile"
                                                                name="etat_civile"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setetat_civile(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    etat_civile
                                                                }
                                                            >
                                                                <option value="">
                                                                    Séléctionnez
                                                                </option>
                                                                <option value="Marié(e)">
                                                                    Marié(e)
                                                                </option>
                                                                <option value="Célibateur">
                                                                    Célibateur
                                                                </option>
                                                                <option value="Veuf(ve)">
                                                                    Veuf(ve)
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    {adhesion.nom_condjoint && (
                                                        <tr>
                                                            <td>
                                                                <label
                                                                    htmlFor="nom_condjoint"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Marié(e) à
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    id="nom_condjoint"
                                                                    type="text"
                                                                    name="nom_condjoint"
                                                                    style={{
                                                                        padding:
                                                                            "1px ",
                                                                        border: "1px solid #dcdcdc",
                                                                        marginBottom:
                                                                            "5px",
                                                                        // width: "100px",
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setnom_condjoint(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    value={
                                                                        nom_condjoint
                                                                    }
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="nom_pere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Nom du père
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="nom_pere"
                                                                type="text"
                                                                name="nom_pere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setnom_pere(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={nom_pere}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="nom_mere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Nom de la mère
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="nom_mere"
                                                                type="text"
                                                                name="nom_mere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setnom_mere(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={nom_mere}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="profession"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Proffession
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="profession"
                                                                type="text"
                                                                name="profession"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setprofession(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    profession
                                                                }
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_travail"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Lieu de travail
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_travail"
                                                                type="text"
                                                                name="lieu_travail"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setlieu_travail(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    lieu_travail
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="civilite"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Civilité
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="civilite"
                                                                type="text"
                                                                name="civilite"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setcivilite(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        civilite
                                                                    }
                                                                >
                                                                    {civilite}
                                                                </option>
                                                                <option value="Monsieur">
                                                                    Monsieur
                                                                </option>
                                                                <option value="Madame">
                                                                    Madame
                                                                </option>
                                                                <option value="Mademoiselle">
                                                                    Mademoiselle
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="sexe"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Sexe
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="sexe"
                                                                type="text"
                                                                name="sexe"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setsexe(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={sexe}
                                                                >
                                                                    {sexe}
                                                                </option>
                                                                <option value="Homme">
                                                                    Homme
                                                                </option>
                                                                <option value="Femme">
                                                                    Femme
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="email"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Email
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="email"
                                                                type="text"
                                                                name="email"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setemail(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={email}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="telephone"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Téléphone
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="telephone"
                                                                type="text"
                                                                name="telephone"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settelephone(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    telephone
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type pièce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_piece"
                                                                type="text"
                                                                name="type_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settype_piece(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        type_piece
                                                                    }
                                                                >
                                                                    {type_piece}
                                                                </option>
                                                                <option value="Carte d'électeur">
                                                                    Carte
                                                                    d'électeur
                                                                </option>
                                                                <option value="pass port">
                                                                    Pass port
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="num_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Num pièce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="num_piece"
                                                                type="text"
                                                                name="num_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setnum_piece(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    num_piece
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="lieu_delivraison_piece"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Délivée à
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="lieu_devivraison_piece"
                                                                type="text"
                                                                name="lieu_devivraison_piece"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setlieu_devivraison_piece(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    lieu_devivraison_piece
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="text-bold">ADRESSE</p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="province"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Province
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="province"
                                                                name="province"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setprovince(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        province
                                                                    }
                                                                >
                                                                    {province}
                                                                </option>

                                                                <option value="Bas-Uele">
                                                                    Bas-Uele
                                                                </option>

                                                                <option value="Equateur">
                                                                    Equateur
                                                                </option>
                                                                <option value="Haut-katanga">
                                                                    Haut-katanga
                                                                </option>
                                                                <option value="Haut-Lomani">
                                                                    Haut-Lomani
                                                                </option>
                                                                <option value="Haut-Uele">
                                                                    Haut-Uele
                                                                </option>
                                                                <option value="Ituri">
                                                                    Ituri
                                                                </option>
                                                                <option value="Kasai">
                                                                    Kasai
                                                                </option>
                                                                <option value="Kasai-Central">
                                                                    Kasai-Central
                                                                </option>
                                                                <option value="Kasai-Oiental">
                                                                    Kasai-Oriental
                                                                </option>
                                                                <option value="Kinshasa">
                                                                    Kinshasa
                                                                </option>
                                                                <option value="Congo-Central">
                                                                    Congo-Cental
                                                                </option>
                                                                <option value="Kwango">
                                                                    Kwango
                                                                </option>
                                                                <option value="Kwilu">
                                                                    Kwilu
                                                                </option>
                                                                <option value="Lomami">
                                                                    Lomami
                                                                </option>
                                                                <option value="Lualaba">
                                                                    Lualaba
                                                                </option>
                                                                <option value="Mai-Ndombe">
                                                                    Mai-Ndombe
                                                                </option>
                                                                <option value="Maniema">
                                                                    Maniema
                                                                </option>
                                                                <option value="Mongala">
                                                                    Mongala
                                                                </option>
                                                                <option value="Nord-Kivu">
                                                                    Nord-Kivu
                                                                </option>
                                                                <option value="Nord-Ubangi">
                                                                    Nord-Ubangi
                                                                </option>
                                                                <option value="Sankuru">
                                                                    Sankuru
                                                                </option>
                                                                <option value="Sud-Kivu">
                                                                    Sud-Kivu
                                                                </option>
                                                                <option value="Sud-Ubangi">
                                                                    Sud-Ubangi
                                                                </option>
                                                                <option value="Tanganyika">
                                                                    Tanganyika
                                                                </option>
                                                                <option value="Tshopo">
                                                                    Tshopo
                                                                </option>
                                                                <option value="Tshapa">
                                                                    Tshapa
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="territoire_ou_ville"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Territoire ou
                                                                ville
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="territoire_ou_ville"
                                                                name="territoire_ou_ville"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setterritoire_ou_ville(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    territoire_ou_ville
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="commune"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Secteur chef ou
                                                                com.
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="commune"
                                                                name="commune"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setcommune(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={commune}
                                                            />
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="quartier"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Quartier
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="quartier"
                                                                name="quartier"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setquartier(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={quartier}
                                                            />
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="text-bold">
                                            AUTRES INFORMATIONS
                                        </p>
                                        <form action="">
                                            <table>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="type_de_gestion"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Type de gestion
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="type_de_gestion"
                                                                name="type_de_gestion"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: "1px solid #dcdcdc",
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settype_de_gestion(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        type_de_gestion
                                                                    }
                                                                >
                                                                    {
                                                                        type_de_gestion
                                                                    }
                                                                </option>
                                                                <option value="Individuel">
                                                                    Individuel
                                                                </option>
                                                                <option value="Collectif">
                                                                    Collectif
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="critere"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Critère
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                id="critere"
                                                                name="critere"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    marginBottom:
                                                                        "5px",
                                                                    border: `${
                                                                        error.critere
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                }}
                                                                onChange={(e) =>
                                                                    setcritere(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            >
                                                                <option
                                                                    value={
                                                                        critere
                                                                    }
                                                                >
                                                                    {critere}
                                                                </option>
                                                                <option value="A">
                                                                    A
                                                                </option>
                                                                <option value="B">
                                                                    B
                                                                </option>
                                                                <option value="C">
                                                                    C
                                                                </option>
                                                                <option value="D">
                                                                    D
                                                                </option>
                                                                <option value="Autre">
                                                                    Autre
                                                                </option>
                                                            </select>{" "}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <button
                                                                onClick={
                                                                    handleSubmitAdhesionUpdate
                                                                }
                                                                className="btn btn-primary rounded-10"
                                                            >
                                                                {isLoading2 ? (
                                                                    <span class="spinner-border spinner-border-sm visible"></span>
                                                                ) : (
                                                                    "Enregistrer"
                                                                )}
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="col-md-3">
                                        <p className="text-bold">
                                            Photo et signature
                                        </p>
                                        {signature_file ? (
                                            <form action="">
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <iframe
                                                                    src={`uploads/membres/signatures/files/${signature_file}`}
                                                                    style={{
                                                                        width: "120%",
                                                                        height: "200px",
                                                                    }}
                                                                >
                                                                    {" "}
                                                                </iframe>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                                <br />{" "}
                                            </form>
                                        ) : null}
                                        <form action="">
                                            <table>
                                                <tbody>
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
                                                                    name="signature_image_file"
                                                                    accept="pdf/*"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setsignature_image_file(
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
                                                            <button
                                                                onClick={
                                                                    updateMembreSignature
                                                                }
                                                                className="btn btn-primary rounded-10"
                                                            >
                                                                Mettre à jour
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                        {/* <p className="text-bold">Signature</p>
                                        <form action="">
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label
                                                            for="images"
                                                            class="drop-container"
                                                            id="dropcontainer"
                                                        >
                                                            <span class="drop-title">
                                                                Drop files here
                                                            </span>
                                                            or
                                                            <input
                                                                type="file"
                                                                id="images"
                                                                accept="image/*"
                                                                required
                                                            />
                                                        </label>
                                                    </td>
                                                </tr>
                                            </table>
                                        </form> */}
                                    </div>
                                </div>
                            </div>
                            <div
                                className="tab-pane fade"
                                id="custom-tabs-three-3"
                                role="tabpanel"
                                aria-labelledby="custom-tabs-three-3-tab"
                            >
                                {/* <p>
                                    <h4 className="text-bold">Mandataire</h4>
                                </p> */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <form action="">
                                            <fieldset className="border p-2">
                                                <legend
                                                    className="float-none w-auto p-0"
                                                    style={{ fontSize: "15px" }}
                                                >
                                                    <h6 className="text-bold">
                                                        Nouveau mandataire
                                                    </h6>
                                                </legend>
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="agence"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Compte abregé
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                id="compte_to_search"
                                                                name="compte_to_search"
                                                                type="text"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${
                                                                        error.compte_to_search
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    width: "80px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setcompte_to_search(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                            <button
                                                                className="btn btn-primary rounded-0"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    marginTop:
                                                                        "-5px",
                                                                }}
                                                                onClick={
                                                                    getSeachedData
                                                                }
                                                            >
                                                                Rechercher
                                                            </button>
                                                        </td>
                                                        <td>
                                                            <label
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                    fontWeight:
                                                                        "bold",
                                                                }}
                                                            >
                                                                {intitule_compte
                                                                    ? intitule_compte
                                                                    : ""}
                                                            </label>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                htmlFor="mandataireName"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Nom mandataire
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                id="mandataireName"
                                                                type="text"
                                                                name="mandataireName"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${"1px solid #dcdcdc"}`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setmandataireName(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    mandataireName
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                htmlFor="mandatairePhone"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Téléphone
                                                            </label>
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <input
                                                                id="mandatairePhone"
                                                                type="text"
                                                                name="mandatairePhone"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${"1px solid #dcdcdc"}`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    // width: "100px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setmandatairePhone(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    mandatairePhone
                                                                }
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <button
                                                                onClick={
                                                                    AjouterMandataire
                                                                }
                                                                className="btn btn-primary rounded-10 mr-2"
                                                            >
                                                                Ajouter
                                                            </button>
                                                            {/* {compte_to_search && (
                                                                <button
                                                                    onClick={
                                                                        getMandataires
                                                                    }
                                                                    className="btn btn-success rounded-10"
                                                                >
                                                                    Afficher
                                                                    <i className="fa fa-spinner"></i>
                                                                </button>
                                                            )} */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                                {fetchMandataire &&
                                    fetchMandataire.length > 0 && (
                                        <div className="row">
                                            <h4>Liste des mandataire</h4>
                                            <div className="col-md-6">
                                                <table className="table table-bordered table-striped">
                                                    <thead>
                                                        <th>Nom mandataire</th>
                                                        <th>Téléphone</th>
                                                        <th>Action</th>
                                                    </thead>
                                                    <tbody>
                                                        {fetchMandataire.length !=
                                                            0 &&
                                                            fetchMandataire.map(
                                                                (
                                                                    res,
                                                                    index
                                                                ) => {
                                                                    return (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    res.mendataireName
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.telephoneM
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                <button
                                                                                    onClick={() => {
                                                                                        DeleteMandataire(
                                                                                            res.id
                                                                                        );
                                                                                    }}
                                                                                    className="btn btn-danger"
                                                                                >
                                                                                    <i class="fas fa-trash-alt">
                                                                                        {" "}
                                                                                        Supprimer
                                                                                    </i>
                                                                                </button>
                                                                            </td>
                                                                        </tr>
                                                                    );
                                                                }
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                            </div>
                            <div
                                className="tab-pane fade"
                                id="custom-tabs-four-4"
                                role="tabpanel"
                                aria-labelledby="custom-tabs-four-4-tab"
                            >
                                {/* <p>
                                    <h4 className="text-bold">
                                        Activation compte
                                    </h4>
                                </p> */}
                                <div className="row">
                                    <div className="col-md-6">
                                        <form action="">
                                            <fieldset className="border p-2">
                                                <legend
                                                    className="float-none w-auto p-0"
                                                    style={{ fontSize: "15px" }}
                                                >
                                                    <h6 className="text-bold">
                                                        Création compte
                                                    </h6>
                                                </legend>
                                                <table>
                                                    <tbody>
                                                        <tr>
                                                            <td>
                                                                <label
                                                                    htmlFor="agence"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Compte
                                                                    abregé
                                                                </label>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    id="compte_to_search"
                                                                    name="compte_to_search"
                                                                    type="text"
                                                                    style={{
                                                                        padding:
                                                                            "1px ",
                                                                        border: `${
                                                                            error.compte_to_search
                                                                                ? "1px solid red"
                                                                                : "1px solid #dcdcdc"
                                                                        }`,
                                                                        marginBottom:
                                                                            "5px",
                                                                        width: "80px",
                                                                    }}
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setcompte_to_search(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                />
                                                                <button
                                                                    className="btn btn-primary rounded-0"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        marginTop:
                                                                            "-5px",
                                                                    }}
                                                                    onClick={
                                                                        getSeachedData
                                                                    }
                                                                >
                                                                    Rechercher
                                                                </button>
                                                            </td>
                                                            <td>
                                                                <label
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                        fontWeight:
                                                                            "bold",
                                                                    }}
                                                                >
                                                                    {intitule_compte
                                                                        ? intitule_compte
                                                                        : ""}
                                                                </label>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <label
                                                                    htmlFor="devise_compte"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Compte à
                                                                    créer
                                                                </label>
                                                            </td>

                                                            <td>
                                                                <select
                                                                    style={{
                                                                        padding:
                                                                            "1px ",
                                                                        border: `${
                                                                            error.agence
                                                                                ? "1px solid red"
                                                                                : "1px solid #dcdcdc"
                                                                        }`,
                                                                        marginBottom:
                                                                            "5px",
                                                                    }}
                                                                    name="devise_compte"
                                                                    id="devise_compte"
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        setdevise_compte(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                >
                                                                    <option value="CDF">
                                                                        Compte
                                                                        en CDF
                                                                    </option>
                                                                    <option value="USD">
                                                                        Compte
                                                                        en USD
                                                                    </option>
                                                                </select>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td></td>
                                                            <td>
                                                                <button
                                                                    onClick={
                                                                        createAccount
                                                                    }
                                                                    className="btn btn-primary rounded-10"
                                                                >
                                                                    Créer le
                                                                    compte
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </fieldset>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adhesion;
