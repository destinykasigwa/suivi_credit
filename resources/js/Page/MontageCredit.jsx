import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";

const MontageCredit = () => {
    const [loading, setloading] = useState(false);
    const [isLoadingRemb, setisLoadingRemb] = useState(false);
    const [fetchData, setFetchData] = useState({
        data: null,
        compteCredit: null,
        epargneCaution: null,
    });
    const [fetchDataToUpdate, setFetchDataToUpdate] = useState();
    const [fetchTypeCredit, setFetchTypeCredit] = useState();
    const [fetchAgentCredit, setFetchAgentCredit] = useState();
    const [fetchObjetCredit, setFetchObjetCredit] = useState();
    const [fetchFrequenceRembours, setFetchFrequenceRembours] = useState();
    const [fetchUserName, setFetchUserName] = useState();
    const [Search_field, setSearch_field] = useState();
    //ADD NEW CREDIT ATTRIBUTE

    const [type_credit, settype_credit] = useState();
    const [recouvreur, setrecouvreur] = useState();
    const [montant_demande, setmontant_demande] = useState();
    const [frequence_rembours, setfrequence_rembours] = useState();
    const [nbr_echeance, setnbr_echeance] = useState();
    const [monnaie, setmonnaie] = useState();
    const [duree, setduree] = useState();
    const [interval, setinterval] = useState();
    const [periode_grace, setperiode_grace] = useState();
    const [NomCompte, setNomCompte] = useState();
    const [compte_epargne, setcompte_epargne] = useState();
    const [compte_credit, setcompte_credit] = useState();
    const [objet_credit, setobjet_credit] = useState();
    const [gestionnaire, setgestionnaire] = useState();
    const [source_fond, setsource_fond] = useState();
    const [taux_interet, settaux_interet] = useState();
    const [taux_retard, settaux_retard] = useState();
    const [echnce_differee, setechnce_differee] = useState();
    const [cycle, setcycle] = useState();
    const [solde_cap, setsolde_cap] = useState();
    const [utilisateur, setutilisateur] = useState();
    const [agence, setagence] = useState();
    const [tot_interet, settot_interet] = useState();
    const [tot_general, settot_general] = useState();
    const [date_demande, setdate_demande] = useState();
    const [epargne_caution, setepargne_caution] = useState();

    //ATTRIBUTE TO UPDATE
    const [type_credit_up, settype_credit_up] = useState();
    const [recouvreur_up, setrecouvreur_up] = useState();
    const [montant_demande_up, setmontant_demande_up] = useState();
    const [frequence_rembours_up, setfrequence_rembours_up] = useState();
    const [date_demande_up, setdate_demande_up] = useState();
    const [nbr_echeance_up, setnbr_echeance_up] = useState();
    const [monnaie_up, setmonnaie_up] = useState();
    const [duree_up, setduree_up] = useState();
    const [interval_up, setinterval_up] = useState();
    const [periode_grace_up, setperiode_grace_up] = useState();
    const [NomCompte_up, setNomCompte_up] = useState();
    const [compte_epargne_up, setcompte_epargne_up] = useState();
    const [compte_credit_up, setcompte_credit_up] = useState();
    const [objet_credit_up, setobjet_credit_up] = useState();
    const [gestionnaire_up, setgestionnaire_up] = useState();
    const [source_fond_up, setsource_fond_up] = useState();
    const [taux_interet_up, settaux_interet_up] = useState();
    const [taux_retard_up, settaux_retard_up] = useState();
    const [echnce_differee_up, setechnce_differee_up] = useState();
    const [numDossier_up, setNumDossier_up] = useState();
    const [cycle_up, setcycle_up] = useState();
    const [solde_cap_up, setsolde_cap_up] = useState();
    const [utilisateur_up, setutilisateur_up] = useState();
    const [agence_up, setagence_up] = useState();
    const [tot_interet_up, settot_interet_up] = useState();
    const [tot_general_up, settot_general_up] = useState();
    const [epargne_caution_up, setepargne_caution_up] = useState();
    const [addNew, setAddNew] = useState(false);
    const [getNumDossier, setGetNumDossier] = useState();
    const [error, setError] = useState([]);
    //ECHEANCIER ATTRIBUTE
    const [desicion, setdecision] = useState();
    const [ModeCalcul, setModeCalcul] = useState();
    const [DateOctroi, setDateOctroi] = useState();
    const [dateEcheance, setdateEcheance] = useState();
    const [DateTombeEcheance, setDateTombeEcheance] = useState();
    const [MontantAccorde, setMontantAccorde] = useState();
    const [garantie, setgarantie] = useState();
    const [hypotheque_name, sethypotheque_name] = useState();
    const [montantRemboursementManuel, setmontantRemboursementManuel] =
        useState();

    const [checkboxValues, setCheckboxValues] = useState({
        RemboursementAnticipative: false,
    });

    const [ReechelonnerCheckboxValues, setReechelonnerCheckboxValues] =
        useState({
            Reechelonner: false,
        });

    //PERMET DE MODIFIER UN CREDIT
    const upDateCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            "/eco/pages/montage-credit/get-credit-to-update",
            {
                seachedAccount: Search_field,
            }
        );
        if (res.data.status == 1) {
            setAddNew(false);
            getDataToDisplayOnFormLoad();
            setFetchDataToUpdate(res.data.data);
            console.log(res.data.data);
            settype_credit_up(res.data.data.RefProduitCredit);
            setrecouvreur_up(res.data.data.Recouvreur);
            setmontant_demande_up(res.data.data.MontantDemande);
            setdate_demande_up(res.data.data.DateDemande);
            setfrequence_rembours_up(res.data.data.ModeRemboursement);
            setnbr_echeance_up(res.data.data.NbrTranche);
            setmonnaie_up(res.data.data.CodeMonnaie);
            setduree_up(res.data.data.Duree);
            setinterval_up(res.data.data.Interval);
            setperiode_grace_up(res.data.data.Grace);
            setNomCompte_up(res.data.data.NomCompte);
            setcompte_epargne_up(res.data.data.NumCompteEpargne);
            setcompte_credit_up(res.data.data.NumCompteCredit);
            setobjet_credit_up(res.data.data.ObjeFinance);
            setgestionnaire_up(res.data.data.Gestionnaire);
            setsource_fond_up(res.data.data.SourceFinancement);
            settaux_interet_up(res.data.data.TauxInteret);
            settaux_retard_up(res.data.data.TauxInteretRetard);
            //setechnce_differee_up(res.data.data.TauxInteretRetard)
            setcycle_up(res.data.data.Cycle);
            setsolde_cap_up(res.data.data.CapitalRestant);
            setutilisateur_up(res.data.data.NomUtilisateur);
            setagence_up(res.data.data.CodeAgence);
            settot_interet_up(res.data.data.InteretDu);
            settot_general_up(
                parseInt(res.data.data.CapitalRestant + res.data.data.InteretDu)
            );
            setepargne_caution_up(res.data.data.NumCompteEpargneGarantie);
            setNumDossier_up(res.data.data.NumDossier);
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };
    const getDataToDisplayOnFormLoad = async () => {
        const res = await axios.get("/eco/page/montage-credit-data-to-dispaly");
        if (res.data.status == 1) {
            setFetchTypeCredit(res.data.type_credit);
            setFetchObjetCredit(res.data.objet_credit);
            setFetchAgentCredit(res.data.agent_credit);
            setFetchUserName(res.data.userName);
            setFetchFrequenceRembours(res.data.frequence_rembours);
        }
    };

    useEffect(() => {
        getDataToDisplayOnFormLoad();
    }, []);

    const saveNewCredit = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post("/eco/page/montage-credit/save-new", {
            type_credit,
            recouvreur,
            montant_demande,
            frequence_rembours,
            nbr_echeance,
            monnaie,
            duree,
            interval,
            periode_grace,
            NomCompte: fetchData.data.NomCompte,
            compte_epargne: fetchData.data.NumCompte,
            compte_credit: fetchData.compteCredit,
            objet_credit,
            gestionnaire,
            source_fond,
            taux_interet,
            taux_retard,
            echnce_differee,
            cycle,
            solde_cap,
            utilisateur,
            agence,
            tot_interet,
            tot_general,
            date_demande,
            epargne_caution: fetchData.epargneCaution,
            NumDossier: "ND000" + getNumDossier.id,
            seachedAccount: Search_field,
            NumAdherant: fetchData.data.NumAdherant,
        });

        if (res.data.status == 1) {
            setloading(false);
            Swal.fire({
                title: "Montage crédit",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        } else if (res.data.status == 0) {
            setloading(false);
            Swal.fire({
                title: "Montage crédit",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        } else {
            setloading(false);
            setError(res.data.validate_error);
        }
    };

    // PERMET D'AJOUTER UN NOUVEAU CREDIT
    const AddNewCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            "/eco/page/montage-credit/get-seached-account",
            {
                seachedAccount: Search_field,
            }
        );
        if (res.data.status == 1) {
            setFetchData({
                data: res.data.data,
                compteCredit: res.data.compteCredit,
                epargneCaution: res.data.EpargneCaution,
            });
            setAddNew(true);
            setGetNumDossier(res.data.data_numdossier);
            // console.log(fetchData);
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    const saveUpdateCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/montage-credit/update", {
            type_credit_up,
            recouvreur_up,
            montant_demande_up,
            frequence_rembours_up,
            nbr_echeance_up,
            monnaie_up,
            duree_up,
            interval_up,
            periode_grace_up,
            objet_credit_up,
            gestionnaire_up,
            source_fond_up,
            taux_interet_up,
            taux_retard_up,
            echnce_differee_up,
            date_demande_up,
            NumDossier_up: numDossier_up,
            seachedAccount: Search_field,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Modication de crédit",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Modification de crédit",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    const saveEcheancier = async (e) => {
        e.preventDefault();
        const res = await axios.post(
            "/eco/page/montage-credit/save-echeancier",
            {
                NumDossier: numDossier_up,
                desicion,
                ModeCalcul,
                DateOctroi,
                dateEcheance,
                DateTombeEcheance,
                MontantAccorde,
                garantie,
                hypotheque_name,
                reechelonne: ReechelonnerCheckboxValues.Reechelonner,
            }
        );

        if (res.data.status == 1) {
            Swal.fire({
                title: "Echéancier",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setError(res.data.validate_error);
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Echéancier",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setError(res.data.validate_error);
        } else {
            setError(res.data.validate_error);
        }
    };

    const AccordeCredit = async (e) => {
        e.preventDefault();
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Voulez-vous vraiment Accorder ce crédit ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });
        if (confirmation.isConfirmed) {
            const res = await axios.post(
                "/eco/page/montage-credit/accord-credit",
                {
                    NumDossier: numDossier_up,
                }
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Accord crédit",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Accord crédit",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    //PERMET DE CLOTURER UN CREDIT

    const ClotureCredit = async (e) => {
        e.preventDefault();
        // Afficher une boîte de dialogue de confirmation
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Voulez-vous vraiment clôturer ce crédit ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        // Si l'utilisateur confirme
        if (confirmation.isConfirmed) {
            const res = await axios.post(
                "/eco/page/montage-credit/cloture-credit",
                {
                    NumDossier: numDossier_up,
                }
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Clôture crédit",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Clôture crédit",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    //PERMET DE DECAISSER LE CREDIT

    const DeccaissementCredit = async (e) => {
        e.preventDefault();
        // Afficher une boîte de dialogue de confirmation
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Voulez-vous vraiment Décaisser ce crédit ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        // Si l'utilisateur confirme
        if (confirmation.isConfirmed) {
            const res = await axios.post(
                "/eco/page/montage-credit/decaissement-credit",
                {
                    NumDossier: numDossier_up,
                }
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Déboursement crédit",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Déboursement crédit",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };

    const handleCheckboxChangeReechelonne = (event) => {
        const { name, checked } = event.target;
        setReechelonnerCheckboxValues((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };

    //PERMET DE FAIRE UN REMBOURSEMENT MANUEL EN CAPITAL
    const RemboursementManuel = async (e) => {
        e.preventDefault();
        setisLoadingRemb(true);
        // Afficher une boîte de dialogue de confirmation
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Voulez-vous vraiment Effectuer le remboursement ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        // Si l'utilisateur confirme
        if (confirmation.isConfirmed) {
            const res = await axios.post(
                "/eco/page/montage-credit/remboursement-manuel",
                {
                    numDossier: numDossier_up,
                    remboursAnticipe: checkboxValues.RemboursementAnticipative,
                    montantRemboursementManuel: montantRemboursementManuel,
                }
            );

            if (res.data.status == 1) {
                setisLoadingRemb(false);
                Swal.fire({
                    title: "Remboursement crédit",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                setisLoadingRemb(false);
                Swal.fire({
                    // Le remboursement est entrain de s'effectuer en arrière-plan...😎
                    title: "Erreur!",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }
    return (
        <div className="container-fluid" style={{ marginTop: "10px" }}>
            {isLoadingRemb && (
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
                    }}
                >
                    <div>
                        <Bars
                            height="80"
                            width="80"
                            color="#4fa94d"
                            ariaLabel="loading"
                        />
                        <h5
                            style={{
                                color: "#fff",
                            }}
                        >
                            Patientez...
                        </h5>
                    </div>
                </div>
            )}
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
                        <h5 className="text-bold p-1">
                            Porte Feuille de Crédit
                        </h5>
                    </div>{" "}
                </div>
            </div>
            {/* // */}
            <div className="row">
                <div className="col-md-5 card p-2">
                    <form>
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ margin: "-15px", marginLeft: "7px" }}
                            >
                                <p style={{ fontSize: "15px" }}>Recherche</p>
                            </legend>
                            <tr>
                                <td>
                                    <label
                                        htmlFor="Search_field"
                                        style={{
                                            padding: "2px",
                                            color: "steelblue",
                                        }}
                                    >
                                        NumCompte
                                    </label>
                                </td>
                                <td>
                                    <input
                                        type="text"
                                        style={{
                                            padding: "3px ",
                                            border: `${"1px solid #dcdcdc"}`,
                                            marginBottom: "5px",
                                            width: "130px",
                                        }}
                                        name="Search_field"
                                        id="Search_field"
                                        onChange={(e) => {
                                            setSearch_field(e.target.value);
                                        }}
                                    />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-primary rounded-0"
                                        style={{
                                            padding: "2px",
                                            marginTop: "-5px",
                                            // width: "30px",
                                        }}
                                        onClick={AddNewCredit}
                                    >
                                        <i className="fas fa-pen"></i>Nouveau
                                    </button>
                                    <button
                                        className="btn btn-success rounded-0"
                                        style={{
                                            padding: "2px",
                                            marginTop: "-5px",
                                        }}
                                        onClick={upDateCredit}
                                    >
                                        Modifier
                                    </button>
                                </td>
                            </tr>
                        </fieldset>
                    </form>
                </div>
                {/* <div className="col-md-2 card p-2">
                    <form>
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{
                                    margin: "-15px",
                                    marginLeft: "6px",
                                }}
                            >
                                <p style={{ fontSize: "15px" }}>
                                    Nouveau crédit
                                </p>
                            </legend>
                            <tr>
                                <td>
                                    <button
                                        className="btn btn-primary rounded-0"
                                        style={{
                                            padding: "2px",
                                            marginTop: "-5px",
                                            // width: "30px",
                                        }}
                                        onClick={upDateCredit}
                                    >
                                        <i className="fas fa-pen"></i>Ajouter
                                    </button>
                                </td>
                            </tr>
                        </fieldset>
                    </form>
                </div> */}
                <div className="col-md-2 card p-2">
                    <form>
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ margin: "-20px", marginLeft: "5px" }}
                            >
                                <p style={{ fontSize: "15px" }}>Etat crédit</p>
                            </legend>
                            <table className="ml-3">
                                {fetchDataToUpdate &&
                                fetchDataToUpdate.Accorde == 1 ? (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                    checked
                                                />
                                            </div>
                                        </td>
                                        <td>Accordé</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>Accorder</td>
                                    </tr>
                                )}
                                {fetchDataToUpdate &&
                                fetchDataToUpdate.Octroye == 1 ? (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                    checked
                                                />
                                            </div>
                                        </td>
                                        <td>Débours.</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>Débours.</td>
                                    </tr>
                                )}
                                {fetchDataToUpdate &&
                                fetchDataToUpdate.Cloture == 1 ? (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                    checked
                                                />
                                            </div>
                                        </td>
                                        <td>Cloturé</td>
                                    </tr>
                                ) : (
                                    <tr>
                                        <td>
                                            <div className="form-check form-switch">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexSwitchCheckDefault"
                                                    disabled
                                                />
                                            </div>
                                        </td>
                                        <td>Cloturer</td>
                                    </tr>
                                )}
                            </table>
                        </fieldset>
                    </form>
                </div>
            </div>
            {addNew ? (
                <div className="row p-2" style={{ background: "#fff" }}>
                    <div className="col-md-4 card p-1">
                        <form action="">
                            <table>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="NumDossier"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            NumDossier
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="NumDossier"
                                            id="NumDossier"
                                            value={
                                                getNumDossier &&
                                                "ND000" + getNumDossier.id
                                            }
                                            disabled
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label
                                            htmlFor="type_credit"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Type de crédit
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.type_credit
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="type_credit"
                                            id="type_credit"
                                            onChange={(e) => {
                                                settype_credit(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            {fetchTypeCredit.length > 0 &&
                                                fetchTypeCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={res.id}
                                                            >
                                                                {
                                                                    res.type_credit
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="recouvreur"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Récouvreur
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.recouvreur
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="recouvreur"
                                            id="recouvreur"
                                            onChange={(e) => {
                                                setrecouvreur(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            {fetchAgentCredit.length > 0 &&
                                                fetchAgentCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={res.name}
                                                            >
                                                                {res.name}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="montant_demande"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Montant demande
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.montant_demande
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="montant_demande"
                                            id="montant_demande"
                                            onChange={(e) => {
                                                setmontant_demande(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="date_demande"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Date demande
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.date_demande
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="date_demande"
                                            id="date_demande"
                                            onChange={(e) => {
                                                setdate_demande(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="frequence_rembours"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Fréquence de..
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.frequence_rembours
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="frequence_rembours"
                                            id="frequence_rembours"
                                            onChange={(e) => {
                                                setfrequence_rembours(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            {fetchFrequenceRembours &&
                                                fetchFrequenceRembours.length >
                                                    0 &&
                                                fetchFrequenceRembours.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    res.frequence_rembours
                                                                }
                                                            >
                                                                {
                                                                    res.frequence_rembours
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="nbr_echeance"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Nombre écheance
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.nbr_echeance
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="nbr_echeance"
                                            id="nbr_echeance"
                                            onChange={(e) => {
                                                setnbr_echeance(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="monnaie"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Monnaie
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.monnaie
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="monnaie"
                                            id="monnaie"
                                            onChange={(e) => {
                                                setmonnaie(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            <option value="CDF">CDF</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="duree"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Durée
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.duree
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="duree"
                                            id="duree"
                                            onChange={(e) => {
                                                setduree(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="interval"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            interval (jrs)
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.interval
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="interval"
                                            id="interval"
                                            onChange={(e) => {
                                                setinterval(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="periode_grace"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Période grace (jrs)
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="periode_grace"
                                            id="periode_grace"
                                            onChange={(e) => {
                                                setperiode_grace(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div className="col-md-4 card p-2">
                        <form action="">
                            <table>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="NomCompte"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Nom compte
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: "1px solid #dcdcdc",
                                                marginBottom: "5px",
                                            }}
                                            name="NomCompte"
                                            id="NomCompte"
                                            disabled
                                            onChange={(e) => {
                                                setNomCompte(e.target.value);
                                            }}
                                            value={
                                                fetchData.data &&
                                                fetchData.data.NomCompte
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_epargne"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Numcpte Epargne
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="compte_epargne"
                                            id="compte_epargne"
                                            onChange={(e) => {
                                                setcompte_epargne(
                                                    e.target.value
                                                );
                                            }}
                                            value={
                                                fetchData.data &&
                                                fetchData.data.NumCompte
                                            }
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_credit"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Numcpte crédit
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="compte_credit"
                                            id="compte_credit"
                                            onChange={(e) => {
                                                setcompte_credit(
                                                    e.target.value
                                                );
                                            }}
                                            value={
                                                fetchData.compteCredit &&
                                                fetchData.compteCredit
                                            }
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="epargne_caution"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Epargne garantie
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="epargne_caution"
                                            id="epargne_caution"
                                            onChange={(e) => {
                                                setepargne_caution(
                                                    e.target.value
                                                );
                                            }}
                                            value={
                                                fetchData.epargneCaution &&
                                                fetchData.epargneCaution
                                            }
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="objet_credit"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Object
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.objet_credit
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="objet_credit"
                                            id="objet_credit"
                                            onChange={(e) => {
                                                setobjet_credit(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            {fetchObjetCredit.length > 0 &&
                                                fetchObjetCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    res.objet
                                                                }
                                                            >
                                                                {res.objet}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="gestionnaire"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Gestionnaire
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.gestionnaire
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="gestionnaire"
                                            id="gestionnaire"
                                            onChange={(e) => {
                                                setgestionnaire(e.target.value);
                                            }}
                                        >
                                            <option value="">
                                                Sélectionnez
                                            </option>
                                            {fetchAgentCredit.length > 0 &&
                                                fetchAgentCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={res.name}
                                                            >
                                                                {res.name}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="source_fond"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Source de fonds
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.source_fond
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="source_fond"
                                            id="source_fond"
                                            onChange={(e) => {
                                                setsource_fond(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="taux_interet"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Taux d'intérêt
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${
                                                    error.taux_interet
                                                        ? "1px solid red"
                                                        : "1px solid #dcdcdc"
                                                }`,
                                                marginBottom: "5px",
                                            }}
                                            name="taux_interet"
                                            id="taux_interet"
                                            onChange={(e) => {
                                                settaux_interet(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="taux_retard"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Taux retard
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="taux_retard"
                                            id="taux_retard"
                                            onChange={(e) => {
                                                settaux_retard(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="echnce_differee"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Enchces dif.
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="echnce_differee"
                                            id="echnce_differee"
                                            onChange={(e) => {
                                                setechnce_differee(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="cycle"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Cycle
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="cycle"
                                            id="cycle"
                                            disabled
                                            onChange={(e) => {
                                                setcycle(e.target.value);
                                            }}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div className="col-md-3 card p-2">
                        <form action="">
                            <table>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button
                                            onClick={saveNewCredit}
                                            className="btn btn-primary rounded-10"
                                        >
                                            <i
                                                className={`${
                                                    loading
                                                        ? "spinner-border spinner-border-sm"
                                                        : " fas fa-save"
                                                }`}
                                            ></i>{" "}
                                            Enregistrer
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="row p-2" style={{ background: "#fff" }}>
                    <div className="col-md-4 card p-2">
                        <form action="">
                            <table>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="numDossier_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            NumDossier
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="numDossier_up"
                                            id="numDossier_up"
                                            value={numDossier_up}
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="type_credit_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Type de crédit
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="type_credit_up"
                                            id="type_credit_up"
                                            onChange={(e) => {
                                                settype_credit_up(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option
                                                value={
                                                    fetchDataToUpdate &&
                                                    fetchDataToUpdate.RefTypeCredit
                                                }
                                            >
                                                {fetchDataToUpdate &&
                                                    fetchDataToUpdate.RefProduitCredit}
                                            </option>
                                            {fetchTypeCredit &&
                                                fetchTypeCredit.length > 0 &&
                                                fetchTypeCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <>
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        res.id
                                                                    }
                                                                >
                                                                    {
                                                                        res.type_credit
                                                                    }
                                                                </option>
                                                            </>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="recouvreur_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Récouvreur
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="recouvreur_up"
                                            id="recouvreur_up"
                                            onChange={(e) => {
                                                setrecouvreur_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={recouvreur_up}
                                        >
                                            {/* <option value="">
                                                Sélectionnez
                                            </option> */}
                                            {fetchAgentCredit &&
                                                fetchAgentCredit.length > 0 &&
                                                fetchAgentCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={res.name}
                                                            >
                                                                {res.name}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="montant_demande_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Montant demande
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="montant_demande_up"
                                            id="montant_demande_up"
                                            onChange={(e) => {
                                                setmontant_demande_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={montant_demande_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="date_demande_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Date demande
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="date_demande_up"
                                            id="date_demande_up"
                                            onChange={(e) => {
                                                setdate_demande_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={date_demande_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="frequence_rembours_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Fréquence de..
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="frequence_rembours_up"
                                            id="frequence_rembours_up"
                                            onChange={(e) => {
                                                setfrequence_rembours_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={frequence_rembours_up}
                                        >
                                            {fetchFrequenceRembours &&
                                                fetchFrequenceRembours.length >
                                                    0 &&
                                                fetchFrequenceRembours.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    res.frequence_rembours
                                                                }
                                                            >
                                                                {
                                                                    res.frequence_rembours
                                                                }
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="nbr_echeance_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Nombre écheance
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="nbr_echeance_up"
                                            id="nbr_echeance_up"
                                            onChange={(e) => {
                                                setnbr_echeance_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={nbr_echeance_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="monnaie_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Monnaie
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="monnaie_up"
                                            id="monnaie_up"
                                            onChange={(e) => {
                                                setmonnaie_up(e.target.value);
                                            }}
                                            value={monnaie_up}
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="duree_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Durée
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="duree_up"
                                            id="duree_up"
                                            onChange={(e) => {
                                                setduree_up(e.target.value);
                                            }}
                                            value={duree_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="interval_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            interval (jrs)
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="interval_up"
                                            id="interval_up"
                                            onChange={(e) => {
                                                setinterval_up(e.target.value);
                                            }}
                                            value={interval_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="periode_grace_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Période grace (jrs)
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="periode_grace_up"
                                            id="periode_grace_up"
                                            onChange={(e) => {
                                                setperiode_grace_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={periode_grace_up}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div className="col-md-4 card p-2">
                        <form action="">
                            <table>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="NomCompte_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Nom compte
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="NomCompte_up"
                                            id="NomCompte_up"
                                            disabled
                                            onChange={(e) => {
                                                setNomCompte_up(e.target.value);
                                            }}
                                            value={NomCompte_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_epargne_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Numcpte Epargne
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="compte_epargne_up"
                                            id="compte_epargne_up"
                                            onChange={(e) => {
                                                setcompte_epargne_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={compte_epargne_up}
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_credit_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Numcpte crédit
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="compte_credit_up"
                                            id="compte_credit_up"
                                            onChange={(e) => {
                                                setcompte_credit_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={compte_credit_up}
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="epargne_caution_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Epargne garantie
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="epargne_caution_up"
                                            id="epargne_caution_up"
                                            onChange={(e) => {
                                                setepargne_caution_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={epargne_caution_up}
                                            disabled
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="objet_credit_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Object
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="objet_credit_up"
                                            id="objet_credit_up"
                                            onChange={(e) => {
                                                setobjet_credit_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={objet_credit_up}
                                        >
                                            {/* <option value="">
                                                Sélectionnez
                                            </option> */}
                                            {fetchObjetCredit &&
                                                fetchObjetCredit.length > 0 &&
                                                fetchObjetCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={
                                                                    res.objet
                                                                }
                                                            >
                                                                {res.objet}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="gestionnaire_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Gestionnaire
                                        </label>
                                    </td>
                                    <td>
                                        <select
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="gestionnaire_up"
                                            id="gestionnaire_up"
                                            onChange={(e) => {
                                                setgestionnaire_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={gestionnaire_up}
                                        >
                                            {/* <option value="">
                                                Sélectionnez
                                            </option> */}
                                            {fetchAgentCredit &&
                                                fetchAgentCredit.length > 0 &&
                                                fetchAgentCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <option
                                                                key={index}
                                                                value={res.name}
                                                            >
                                                                {res.name}
                                                            </option>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="source_fond_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Source de fonds
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="source_fond_up"
                                            id="source_fond_up"
                                            onChange={(e) => {
                                                setsource_fond_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={source_fond_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="taux_interet_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Taux d'intérêt
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="taux_interet_up"
                                            id="taux_interet_up"
                                            onChange={(e) => {
                                                settaux_interet_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={taux_interet_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="taux_retard_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Taux retard
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="taux_retard_up"
                                            id="taux_retard_up"
                                            onChange={(e) => {
                                                settaux_retard_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={taux_retard_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="echnce_differee_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Enchces dif.
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="echnce_differee_up"
                                            id="echnce_differee_up"
                                            onChange={(e) => {
                                                setechnce_differee_up(
                                                    e.target.value
                                                );
                                            }}
                                            value={echnce_differee_up}
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="cycle_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Cycle
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            name="cycle_up"
                                            id="cycle_up"
                                            disabled
                                            onChange={(e) => {
                                                setcycle(e.target.value);
                                            }}
                                            value={cycle_up}
                                        />
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                    <div className="col-md-3 card p-2">
                        <form action="">
                            <table>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="solde_cap_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Solde capital
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "100px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="solde_cap_up"
                                            id="solde_cap_up"
                                            disabled
                                            // onChange={(e) => {
                                            //     setsolde_cap(e.target.value);
                                            // }}
                                            value={
                                                fetchDataToUpdate &&
                                                numberWithSpaces(
                                                    fetchDataToUpdate.MontantAccorde
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                                {/* <tr>
                                    <td>
                                        <label
                                            htmlFor="utilisateur"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Utilisateur
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "160px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="utilisateur"
                                            id="utilisateur"
                                            disabled
                                            onChange={(e) => {
                                                setutilisateur(e.target.value);
                                            }}
                                            value={
                                                fetchUserName && fetchUserName
                                            }
                                        />
                                    </td>
                                </tr> */}
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="agence_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Agence
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "100px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="agence_up"
                                            id="agence_up"
                                            disabled
                                            // onChange={(e) => {
                                            //     setagence(e.target.value);
                                            // }}
                                            value={
                                                fetchDataToUpdate &&
                                                fetchDataToUpdate.CodeAgence
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="tot_interet_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Total interêt
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "100px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="tot_interet_up"
                                            id="tot_interet_up"
                                            disabled
                                            // onChange={(e) => {
                                            //     settot_interet(e.target.value);
                                            // }}
                                            value={
                                                fetchDataToUpdate &&
                                                numberWithSpaces(
                                                    fetchDataToUpdate.InteretDu
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="tot_general_up"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Total Général
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            style={{
                                                padding: "3px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "120px",
                                                background: "teal",
                                                color: "#fff",
                                            }}
                                            name="tot_general_up"
                                            id="tot_general_up"
                                            disabled
                                            // onChange={(e) => {
                                            //     settot_general(e.target.value);
                                            // }}
                                            value={
                                                fetchDataToUpdate &&
                                                numberWithSpaces(
                                                    parseInt(
                                                        fetchDataToUpdate.MontantAccorde +
                                                            fetchDataToUpdate.InteretDu
                                                    )
                                                )
                                            }
                                        />
                                    </td>
                                </tr>

                                <tr>
                                    <td></td>
                                    <td>
                                        <button
                                            onClick={saveUpdateCredit}
                                            className="btn btn-primary rounded-10"
                                        >
                                            Mettre à jour{" "}
                                            <i class="fas fa-database"></i>
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        </form>
                    </div>
                </div>
            )}
            <div className="row">
                <ul
                    className="nav nav-tabs"
                    id="custom-tabs-one-tab"
                    role="tablist"
                    style={{ background: "teal", border: "0px" }}
                >
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link active"
                            id="custom-tabs-one-echeancier-tab"
                            data-toggle="pill"
                            href="#custom-tabs-one-echeancier"
                            role="tab"
                            aria-controls="custom-tabs-one-echeancier"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Echéancier
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
                            id="custom-tabs-two-remboursement-cap-tab"
                            data-toggle="pill"
                            href="#custom-tabs-two-remboursement-cap"
                            role="tab"
                            aria-controls="custom-tabs-two-remboursement-cap"
                            aria-selected="false"
                        >
                            Remboursement Manuel
                        </a>
                    </li>
                    {/* <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link"
                            id="custom-tabs-three-interet-tab"
                            data-toggle="pill"
                            href="#custom-tabs-three-interet"
                            role="tab"
                            aria-controls="custom-tabs-three-interet"
                            aria-selected="false"
                        >
                            Intérêt
                        </a>
                    </li> */}
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link"
                            id="custom-tabs-four-action-tab"
                            data-toggle="pill"
                            href="#custom-tabs-four-action"
                            role="tab"
                            aria-controls="custom-tabs-four-action"
                            aria-selected="false"
                        >
                            Action
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
                            id="custom-tabs-one-echeancier"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-one-echeancier-tab"
                        >
                            {/* <h4 className="fw-bold">ECHEANCIER</h4> */}
                            <div className="row">
                                <div className="col-md-8 card rounded-0 p-3">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <form action="">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="desicion"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Décision
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${"1px solid #dcdcdc"}`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="decision"
                                                                id="decision"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setdecision(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Accepté">
                                                                    Accepté
                                                                </option>
                                                                <option value="Refusé">
                                                                    Refusé
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="ModeCalcul"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Calcul
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${
                                                                        error &&
                                                                        error.ModeCalcul
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="ModeCalcul"
                                                                id="ModeCalcul"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setModeCalcul(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    Sélectionnez
                                                                </option>
                                                                <option value="Degressif">
                                                                    Dégressif
                                                                </option>
                                                                <option value="Constant">
                                                                    Constant
                                                                </option>
                                                                <option value="Degressif__">
                                                                    Degressif M
                                                                    --
                                                                </option>
                                                            </select>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="DateOctroi"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Date octroie
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${
                                                                        error &&
                                                                        error.DateOctroi
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="DateOctroi"
                                                                id="DateOctroi"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setDateOctroi(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="garantie"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Garantie
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <select
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${"1px solid #dcdcdc"}`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="garantie"
                                                                id="garantie"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setgarantie(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            >
                                                                <option value="">
                                                                    Séléctionnez
                                                                </option>
                                                                <option value="Caution solidaire">
                                                                    Caution
                                                                    solidaire
                                                                </option>
                                                                <option value="Salaire">
                                                                    Salaire
                                                                </option>
                                                                <option value="Hypothèque">
                                                                    Hypothèque
                                                                </option>
                                                                <option value="Autre">
                                                                    Autre
                                                                </option>
                                                            </select>
                                                            {garantie ==
                                                                "Hypothèque" && (
                                                                <input
                                                                    type="text"
                                                                    placeholder="Nom hypothèque"
                                                                    style={{
                                                                        padding:
                                                                            "3px ",
                                                                        border: `${"1px solid #dcdcdc"}`,
                                                                        marginBottom:
                                                                            "5px",
                                                                    }}
                                                                    name="hypotheque_name"
                                                                    id="hypotheque_name"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        sethypotheque_name(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div className="col-md-4">
                                            <form action="">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="DateTombeEcheance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Tombée
                                                                d'Echéance
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${
                                                                        error &&
                                                                        error.DateTombeEcheance
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="DateTombeEcheance"
                                                                id="DateTombeEcheance"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setDateTombeEcheance(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            <label
                                                                htmlFor="dateEcheance"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Date Dernière
                                                                Echnce
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="date"
                                                                style={{
                                                                    padding:
                                                                        "3px ",
                                                                    border: `${
                                                                        error &&
                                                                        error.dateEcheance
                                                                            ? "1px solid red"
                                                                            : "1px solid #dcdcdc"
                                                                    }`,
                                                                    marginBottom:
                                                                        "5px",
                                                                }}
                                                                name="dateEcheance"
                                                                id="dateEcheance"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setdateEcheance(
                                                                        e.target
                                                                            .value
                                                                    );
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                    {ReechelonnerCheckboxValues.Reechelonner ==
                                                        false && (
                                                        <tr>
                                                            <td>
                                                                <label
                                                                    htmlFor="MontantAccorde"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                ></label>
                                                            </td>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    style={{
                                                                        padding:
                                                                            "3px ",
                                                                        border: `${
                                                                            error &&
                                                                            error.MontantAccorde
                                                                                ? "1px solid red"
                                                                                : "1px solid #dcdcdc"
                                                                        }`,
                                                                        marginBottom:
                                                                            "5px",
                                                                        color: "#fff",
                                                                        fontSize:
                                                                            "15px",
                                                                        fontWeight:
                                                                            "bold",
                                                                        width: "105px",
                                                                        backgroundColor: `${
                                                                            error &&
                                                                            error.MontantAccorde
                                                                                ? "red"
                                                                                : "teal"
                                                                        }`,
                                                                    }}
                                                                    name="MontantAccorde"
                                                                    id="MontantAccorde"
                                                                    onChange={(
                                                                        e
                                                                    ) => {
                                                                        setMontantAccorde(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        );
                                                                    }}
                                                                />
                                                            </td>
                                                        </tr>
                                                    )}
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <button
                                                                onClick={
                                                                    saveEcheancier
                                                                }
                                                                className="btn btn-primary rounded-10"
                                                            >
                                                                Enregistrer{" "}
                                                                <i class="fas fa-save"></i>
                                                            </button>
                                                            {/* <button className="btn btn-success rounded-0 mt-1">
                                                                Modifier
                                                            </button> */}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                        <div
                                            className="col-md-3"
                                            style={{
                                                background: "#dcdcdc",
                                                borderRadius: "10px",
                                                textAlign: "center",
                                            }}
                                        >
                                            <div
                                                class="form-check"
                                                style={{ marginTop: "80px" }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    id="Reechelonner"
                                                    name="Reechelonner"
                                                    checked={
                                                        ReechelonnerCheckboxValues.Reechelonner
                                                    }
                                                    onChange={
                                                        handleCheckboxChangeReechelonne
                                                    }
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="Reechelonner"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Réechelonner ?
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="custom-tabs-two-remboursement-cap"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-two-remboursement-cap-tab"
                        >
                            {/* <h4 className="fw-bold">ECHEANCIER</h4> */}
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-8 card rounded-0 p-3">
                                            <form action="">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            <div class="form-check">
                                                                <input
                                                                    type="checkbox"
                                                                    class="form-check-input"
                                                                    id="RemboursementAnticipative"
                                                                    name="RemboursementAnticipative"
                                                                    checked={
                                                                        checkboxValues.RemboursementAnticipative
                                                                    }
                                                                    onChange={
                                                                        handleCheckboxChange
                                                                    }
                                                                />
                                                                <label
                                                                    class="form-check-label"
                                                                    for="RemboursementAnticipative"
                                                                    style={{
                                                                        padding:
                                                                            "2px",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Remboursement
                                                                    Anticipé ?
                                                                </label>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                htmlFor="montantRemboursementManuel"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "steelblue",
                                                                }}
                                                            >
                                                                Montant à Remb.
                                                            </label>
                                                        </td>

                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "100px",
                                                            }}
                                                            name="montantRemboursementManuel"
                                                            id="montantRemboursementManuel"
                                                            onChange={(e) => {
                                                                setmontantRemboursementManuel(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </tr>
                                                    <tr>
                                                        <td></td>
                                                        <td>
                                                            <button
                                                                onClick={
                                                                    RemboursementManuel
                                                                }
                                                                className="btn btn-primary rounded-10"
                                                            >
                                                                Rembourser{" "}
                                                                <i className="fas fa-database"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="custom-tabs-three-interet"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-three-interet-tab"
                        >
                            {/* <h4 className="fw-bold">ECHEANCIER</h4> */}
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-4"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade show"
                            id="custom-tabs-four-action"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-four-action-tab"
                        >
                            {/* <h4 className="fw-bold">ECHEANCIER</h4> */}
                            <div className="row">
                                <div className="col-md-8">
                                    <div className="row">
                                        <div className="col-md-4">
                                            <form action="">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            {fetchDataToUpdate &&
                                                            fetchDataToUpdate.Accorde ==
                                                                1 ? (
                                                                <button
                                                                    disabled
                                                                    className="btn btn-danger rounded-15"
                                                                >
                                                                    Déjà Accordé{" "}
                                                                    <i className="fas fa-thumbs-up"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={
                                                                        AccordeCredit
                                                                    }
                                                                    className="btn btn-primary rounded-15"
                                                                >
                                                                    Accorder{" "}
                                                                    <i className="fas fa-thumbs-up"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {fetchDataToUpdate &&
                                                            fetchDataToUpdate.Octroye ==
                                                                1 ? (
                                                                <button
                                                                    className="btn btn-danger rounded-15 mt-2"
                                                                    disabled
                                                                >
                                                                    Déjà
                                                                    Déboursé{" "}
                                                                    <i class="fas fa-hand-holding-usd"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={
                                                                        DeccaissementCredit
                                                                    }
                                                                    className="btn btn-info rounded-15 mt-2"
                                                                >
                                                                    Débourser{" "}
                                                                    <i class="fas fa-hand-holding-usd"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            {fetchDataToUpdate &&
                                                            fetchDataToUpdate.Cloture ==
                                                                1 ? (
                                                                <button
                                                                    className="btn btn-danger rounded-15 mt-2"
                                                                    disabled
                                                                >
                                                                    Déjà Clôturé{" "}
                                                                    <i class="fas fa-user-lock"></i>
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={
                                                                        ClotureCredit
                                                                    }
                                                                    className="btn btn-success rounded-15 mt-2"
                                                                >
                                                                    Clôturer{" "}
                                                                    <i class="fas fa-unlock"></i>
                                                                </button>
                                                            )}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default MontageCredit;
