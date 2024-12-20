import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";

const Debiter = () => {
    const [loading, setloading] = useState(false);
    const [compte_a_debiter, setcompte_a_debiter] = useState();
    const [compte_a_crediter, setcompte_a_crediter] = useState();
    const [Libelle, setLibelle] = useState();
    const [Montant, setMontant] = useState();
    const [FetchDataDebit, setFetchDataDebit] = useState();
    const [FetchDataCredit, setFetchDataCredit] = useState();
    const [FetchSoldeDebit, setFetchSoldeDebit] = useState();
    const [FetchSoldeCredit, setFetchSoldeCredit] = useState();
    const [fetchDayOperation, setfetchDayOperation] = useState();
    const [searchRefOperation, setsearchRefOperation] = useState();
    const [fetchSearchedOperation, setfetchSearchedOperation] = useState();
    const [chargement, setchargement] = useState(false);
    const [searched_account_by_name, setsearched_account_by_name] = useState();
    const [fetchDataByName, setFetchDataByName] = useState();
    const [checkboxValues, setCheckboxValues] = useState({
        RemboursementAnticipative: false,
    });
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };
    const saveOperation = async (e) => {
        e.preventDefault();
        setloading(true);
        setchargement(true);

        let confirmation;
        // Afficher une boîte de dialogue de confirmation
        console.log(checkboxValues.isVirement);
        if (checkboxValues.isVirement === true) {
            confirmation = await Swal.fire({
                title: "Êtes-vous sûr?",
                text: "Il semble que l'opération que vous voulez enregistrer est une operation de virement voulez vous continuer ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Non",
            });
        } else {
            confirmation = await Swal.fire({
                title: "Êtes-vous sûr?",
                text: "Vous êtes sur le point de valider cette opération voulez vous continuer ?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Oui",
                cancelButtonText: "Non",
            });
        }

        // Si l'utilisateur confirme
        if (confirmation.isConfirmed) {
            try {
                const res = await axios.post(
                    "/eco/page/transaction/debiter/save",
                    {
                        compte_a_debiter: compte_a_debiter,
                        compte_a_crediter: compte_a_crediter,
                        Montant,
                        devise: FetchDataDebit.CodeMonnaie,
                        Libelle: Libelle,
                        isVirement: checkboxValues.isVirement,
                    }
                );

                if (res.data.status === 1) {
                    setchargement(false);
                    setloading(false);
                    Swal.fire({
                        title: "Succès",
                        text: res.data.msg,
                        icon: "success",
                        timer: 8000,
                        confirmButtonText: "Okay",
                    });
                    setMontant("");
                    setLibelle("");
                } else if (res.data.status === 0) {
                    setchargement(false);
                    setloading(false);
                    Swal.fire({
                        title: "Erreur",
                        text: res.data.msg,
                        icon: "error",
                        timer: 8000,
                        confirmButtonText: "Okay",
                    });
                } else {
                    setError(res.data.validate_error);
                }
            } catch (error) {
                setchargement(false);
                setloading(false);
                Swal.fire({
                    title: "Erreur",
                    text: "Une erreur s'est produite lors de l'enregistrement de l'opération.",
                    icon: "error",
                    confirmButtonText: "Okay",
                });
            }
        } else {
            setloading(false);
            setchargement(false);
        }
    };

    const getSeachedDataDebit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/debiter/get-data", {
            compte_a_debiter,
        });
        if (res.data.status == 1) {
            setFetchDataDebit(res.data.dataDebit);
            setFetchSoldeDebit(res.data.soldeCompteDebit);
            console.log(FetchSolde);
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
    const getSeachedDataCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/crediter/get-data", {
            compte_a_crediter,
        });
        if (res.data.status == 1) {
            setFetchDataCredit(res.data.dataCredit);
            setFetchSoldeCredit(res.data.soldeCompteCredit);
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

    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    const extourneOperation = async (reference) => {
        setchargement(true);
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Voulez-vous vraiment extourner cette opération ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });
        if (confirmation.isConfirmed) {
            const res = await axios.get(
                "/eco/page/debiteur/extourne-operation/" + reference
            );
            if (res.data.status == 1) {
                setchargement(false);
                Swal.fire({
                    title: "Créditeur",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
            } else if (res.data.status == 0) {
                setchargement(false);
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
            }
        } else {
            setchargement(false);
            Swal.fire({
                title: "Annulation",
                text: "L'extourne n'a pas eu lieu",
                icon: "info",
                button: "OK!",
            });
        }
    };

    useEffect(() => {
        getDayOperation();
    }, []);

    //put focus on given input
    //    const focusTextInput=()=> {
    //         this.textInput.current.focus();
    //     }
    const getDayOperation = async () => {
        const res = await axios.get("/eco/page/debiteur/operation-journaliere");

        setfetchDayOperation(res.data.data);
    };

    const handleSeachOperation = async (ref) => {
        const res = await axios.get(
            "/eco/page/debiteur/extourne-operation/reference/" + ref
        );
        if (res.data.status == 1) {
            setfetchSearchedOperation(res.data.data);
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    //GET DATA FROM INPUT
    function handleChange(event) {
        setsearchRefOperation(
            // Computed property names
            // keys of the objects are computed dynamically
            event.target.value
        );
    }
    const getSeachedDataByName = async (e) => {
        e.preventDefault();
        setchargement(true);
        const res = await axios.post("/eco/page/releve/get-account-by-name", {
            searched_account_by_name: searched_account_by_name,
        });
        if (res.data.status == 1) {
            setFetchDataByName(res.data.data);
            console.log(fetchDataByName);
            setchargement(false);
        } else {
            setchargement(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    let compteur = 1;
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
                        <h5 className="text-bold p-1">Débiter les comptes</h5>
                    </div>{" "}
                </div>
            </div>
            <div className="row mt-3">
                {chargement && (
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
                <div
                    className="col-md-3 card rounded-0 p-3"
                    style={{ marginRight: "3px" }}
                >
                    <form action="">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_a_debiter"
                                            style={{ color: "steelblue" }}
                                        >
                                            Débit sur
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            id="compte_a_debiter"
                                            name="compte_a_debiter"
                                            type="text"
                                            style={{
                                                padding: "1px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "100px",
                                            }}
                                            onChange={(e) => {
                                                setcompte_a_debiter(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                        <button
                                            className="btn btn-primary rounded-0"
                                            style={{
                                                padding: "2px",
                                                marginTop: "-5px",
                                                width: "30px",
                                            }}
                                            onClick={getSeachedDataDebit}
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label
                                            htmlFor="compte_a_crediter"
                                            style={{ color: "steelblue" }}
                                        >
                                            Crédit sur
                                        </label>
                                    </td>
                                    <td>
                                        <input
                                            id="compte_a_crediter"
                                            name="compte_a_crediter"
                                            type="text"
                                            style={{
                                                padding: "1px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                                width: "100px",
                                            }}
                                            onChange={(e) => {
                                                setcompte_a_crediter(
                                                    e.target.value
                                                );
                                            }}
                                        />
                                        <button
                                            className="btn btn-primary rounded-0"
                                            style={{
                                                padding: "2px",
                                                marginTop: "-5px",
                                                width: "30px",
                                            }}
                                            onClick={getSeachedDataCredit}
                                        >
                                            <i className="fas fa-search"></i>
                                        </button>
                                    </td>
                                </tr>

                                <hr />
                            </tbody>
                        </table>
                    </form>
                </div>
                {FetchDataDebit && (
                    <div className="col-md-4 card rounded-0">
                        <p className="text-bold" style={{ color: "steelblue" }}>
                            Informations sur le compte à débiter
                        </p>
                        <table className="table-bordered p-1">
                            <tr>
                                <td style={{ padding: "2px " }}>
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        Nom Compte :
                                    </label>
                                </td>
                                <td style={{ padding: "2px " }}>
                                    {FetchDataDebit && FetchDataDebit.NomCompte}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "2px " }}>
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        NumCompte :
                                    </label>
                                </td>
                                <td style={{ padding: "2px " }}>
                                    {FetchDataDebit && FetchDataDebit.NumCompte}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ padding: "2px " }}>
                                    {" "}
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        Solde compte:
                                    </label>
                                </td>

                                {FetchSoldeDebit && (
                                    <td style={{ padding: "3px " }}>
                                        {numberWithSpaces(
                                            FetchSoldeDebit.soldeCompte.toFixed(
                                                2
                                            )
                                        )}{" "}
                                        {FetchDataDebit &&
                                        FetchDataDebit.CodeMonnaie == 1
                                            ? " USD"
                                            : " CDF"}
                                    </td>
                                )}
                            </tr>
                        </table>
                    </div>
                )}
                {FetchDataCredit && (
                    <div className="col-md-4 card rounded-0">
                        <p className="text-bold" style={{ color: "steelblue" }}>
                            Informations sur le compte à Créditer
                        </p>
                        <table className="table-bordered p-1">
                            <tr>
                                <td style={{ padding: "2px " }}>
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        Nom Compte :
                                    </label>
                                </td>
                                <td style={{ padding: "2px " }}>
                                    {FetchDataCredit &&
                                        FetchDataCredit.NomCompte}
                                </td>
                            </tr>
                            <tr>
                                <td style={{ padding: "2px " }}>
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        NumCompte :
                                    </label>
                                </td>
                                <td style={{ padding: "2px " }}>
                                    {FetchDataCredit &&
                                        FetchDataCredit.NumCompte}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ padding: "2px " }}>
                                    {" "}
                                    <label
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                        }}
                                        htmlFor=""
                                    >
                                        Solde compte:
                                    </label>
                                </td>

                                {FetchSoldeCredit && (
                                    <td style={{ padding: "3px " }}>
                                        {numberWithSpaces(
                                            FetchSoldeCredit.soldeCompte.toFixed(
                                                2
                                            )
                                        )}{" "}
                                        {FetchDataCredit &&
                                        FetchDataCredit.CodeMonnaie == 1
                                            ? " USD"
                                            : " CDF"}
                                    </td>
                                )}
                            </tr>
                        </table>
                    </div>
                )}

                {FetchDataDebit && (
                    <div className="col-md-2 card">
                        <table>
                            <tr>
                                <td>
                                    <div class="form-check">
                                        <input
                                            type="checkbox"
                                            class="form-check-input mt-2"
                                            id="isVirement"
                                            name="isVirement"
                                            checked={checkboxValues.isVirement}
                                            onChange={handleCheckboxChange}
                                        />
                                        <label
                                            class="form-check-label"
                                            for="isVirement"
                                            style={{
                                                color: "steelblue",
                                                fontSize: "20px",
                                            }}
                                        >
                                            Virement ?
                                        </label>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </div>
                )}
                <div className="col-md-2">
                    <form action="">
                        <table>
                            <td>
                                <input
                                    id="compte_to_search_by_name"
                                    name="compte_to_search_by_name"
                                    type="text"
                                    style={{
                                        padding: "1px ",
                                        border: `${"1px solid #dcdcdc"}`,
                                        marginBottom: "5px",
                                        width: "145px",
                                    }}
                                    onChange={(e) => {
                                        setsearched_account_by_name(
                                            e.target.value
                                        );
                                    }}
                                />
                                <button
                                    className="btn btn-primary rounded-0"
                                    style={{
                                        padding: "2px",
                                        marginTop: "-5px",
                                    }}
                                    onClick={getSeachedDataByName}
                                >
                                    Rechercher par nom
                                </button>
                            </td>
                        </table>
                    </form>
                </div>
                {fetchDataByName && (
                    <div
                        className="col-md-4"
                        style={{ height: "150px", overflowY: "scroll" }}
                    >
                        <table className="table table-bordered table-striped">
                            {fetchDataByName &&
                                fetchDataByName.map((res, index) => {
                                    return (
                                        <tr key={index}>
                                            <td
                                                style={
                                                    {
                                                        // border: "1px solid #000",
                                                        // cursor: "pointer",
                                                    }
                                                }
                                                // onClick={(event) =>
                                                //     getAccountInfo(event)
                                                // }
                                            >
                                                {res.NumCompte}
                                            </td>
                                            <td
                                            // style={{
                                            //     border: "1px solid #fff",
                                            // }}
                                            >
                                                {res.NomCompte}
                                            </td>
                                            <td
                                            // style={{
                                            //     border: "1px solid #fff",
                                            // }}
                                            >
                                                {res.CodeMonnaie == 1
                                                    ? "USD"
                                                    : "CDF"}
                                            </td>
                                        </tr>
                                    );
                                })}
                            <tr>
                                {/* <td>
                                        <button className="btn btn-primary rounded-0">
                                            Afficher le solde
                                        </button>
                                    </td> */}
                            </tr>
                        </table>
                    </div>
                )}
            </div>

            <p
                className="border border-10"
                style={{
                    background: "#dcdcdc",
                    padding: "1px",
                }}
            ></p>
            <div className="row">
                <div
                    className="col-md-4 card rounded-0 p-3"
                    style={{ marginRight: "3px" }}
                >
                    <form action="">
                        <fieldset>
                            <legend
                                style={{
                                    border: "2px solid:#dcdcdc !important",
                                }}
                            >
                                {/* <p>Informations</p> */}
                            </legend>
                            <table>
                                <tbody>
                                    <tr>
                                        {/* <td>
                                            {" "}
                                            <label
                                                htmlFor="Devise"
                                                style={{
                                                    padding: "2px",
                                                    color: "steelblue",
                                                }}
                                            >
                                                Devise
                                            </label>
                                        </td> */}
                                        {/* <td>
                                            {" "}
                                            <select
                                                id="devise"
                                                name="devise"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid #dcdcdc"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setDevise(e.target.value);
                                                }}

                                                disabled
                                            >
                                                <option value=""> {FetchDataCredit} </option>
                                            </select>
                                        </td> */}
                                    </tr>
                                    <tr>
                                        <td>
                                            {" "}
                                            <label
                                                htmlFor="Montant"
                                                style={{
                                                    padding: "2px",
                                                    color: "steelblue",
                                                }}
                                            >
                                                Montant
                                            </label>
                                        </td>
                                        <td>
                                            {" "}
                                            <input
                                                id="Montant"
                                                name="Montant"
                                                type="text"
                                                style={{
                                                    padding: "5px ",
                                                    border: `${"1px solid #dcdcdc"}`,
                                                    marginBottom: "5px",
                                                    width: "120px",
                                                    borderRadius: "5px",
                                                }}
                                                onChange={(e) =>
                                                    setMontant(e.target.value)
                                                }
                                                value={Montant}
                                            />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            {" "}
                                            <label
                                                htmlFor="telephone"
                                                style={{
                                                    padding: "2px",
                                                    color: "steelblue",
                                                }}
                                            >
                                                Libellé
                                            </label>
                                        </td>
                                        <td>
                                            {" "}
                                            <input
                                                type="text"
                                                id="Libelle"
                                                name="Libelle"
                                                style={{
                                                    padding: "3px ",
                                                    border: `${"1px solid #dcdcdc"}`,
                                                    marginBottom: "5px",
                                                    width: "300px",
                                                    borderRadius: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setLibelle(e.target.value);
                                                }}
                                                value={Libelle}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td>
                                            <button
                                                className="btn btn-primary rounded-10"
                                                id="validerbtn"
                                                onClick={saveOperation}
                                            >
                                                <i
                                                    className={`${
                                                        loading
                                                            ? "spinner-border spinner-border-sm"
                                                            : " fas fa-check"
                                                    }`}
                                                ></i>
                                                Valider
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div>

                {/* <div className="col-md-3 card rounded-0 p-3">
                    <form action="">
                        <table>
                            <tr>
                                <td>
                                    <button
                                        className="btn btn-primary rounded-0"
                                        id="validerbtn"
                                        onClick={saveOperation}
                                    >
                                        <i
                                            className={`${
                                                loading
                                                    ? "spinner-border spinner-border-sm"
                                                    : " fas fa-check"
                                            }`}
                                        ></i>
                                        Valider
                                    </button>
                                </td>
                            </tr>
                        </table>
                    </form>
                </div>
                <div
                    className="col-md-4 card rounded-0 p-3"
                    style={{ marginRight: "2px" }}
                ></div> */}
            </div>

            <div className="row">
                <p>
                    <strong>Opérations recentes</strong>
                </p>
                <div
                    className="col-md-9"
                    style={{
                        overflowY: "scroll",
                        height: "300px",
                        background: "#fff",
                        padding: "10px",
                        border: "3px solid #dcdcdc",
                    }}
                >
                    <div className="col-md-4 float-end mb-1">
                        <div className="input-group input-group-sm">
                            <input
                                type="text"
                                style={{
                                    borderRadius: "0px",
                                }}
                                // ref={textInput}
                                className="form-control font-weight-bold"
                                placeholder="Rechercher..."
                                name="searchRefOperation"
                                value={searchRefOperation}
                                onChange={handleChange}
                            />
                            <td>
                                <button
                                    type="button"
                                    style={{
                                        borderRadius: "0px",
                                        width: "100%",
                                        height: "auto",
                                        fontSize: "12px",
                                    }}
                                    className="btn btn-primary"
                                    onClick={() => {
                                        handleSeachOperation(
                                            searchRefOperation
                                        );
                                    }}
                                >
                                    <i className="fas fa-search"></i>
                                </button>
                            </td>{" "}
                            <button
                                className="btn btn-success"
                                onClick={() => {
                                    extourneOperation(searchRefOperation);
                                }}
                            >
                                <i class="fas fa-exchange-alt"></i>
                                Extouner
                            </button>
                        </div>
                    </div>
                    <table
                        className="table table-bordered"
                        style={{
                            // background: "#444",
                            padding: "5px",
                            color: "#000",
                        }}
                    >
                        <thead style={{ background: "teal" }}>
                            <th>#</th>
                            <th>Reference</th>
                            <th>NumCompte</th>
                            <th>Montant</th>
                            <th>Devise</th>
                            <th>Opération</th>

                            <th>Libellé</th>
                            <th>Action</th>
                        </thead>
                        {!fetchSearchedOperation && fetchDayOperation
                            ? fetchDayOperation.map((res, index) => {
                                  return (
                                      <tr key={index}>
                                          <td> {compteur++} </td>
                                          <td> {res.NumTransaction} </td>
                                          <td> {res.NumCompte} </td>
                                          <td>
                                              {" "}
                                              {res.CodeMonnaie == 1
                                                  ? parseInt(res.Creditusd) > 0
                                                      ? parseInt(res.Creditusd)
                                                      : parseInt(res.Debitusd)
                                                  : parseInt(res.Creditfc) > 0
                                                  ? parseInt(res.Creditfc)
                                                  : parseInt(res.Debitfc)}
                                          </td>
                                          <td>
                                              {res.CodeMonnaie == 1
                                                  ? "USD"
                                                  : "CDF"}{" "}
                                          </td>
                                          <td>{res.TypeTransaction} </td>
                                          <td>{res.Libelle} </td>
                                          <td>
                                              {" "}
                                              <button
                                                  className="btn btn-success"
                                                  onClick={() => {
                                                      extourneOperation(
                                                          res.NumTransaction
                                                      );
                                                  }}
                                              >
                                                  <i class="fas fa-exchange-alt"></i>
                                                  Extouner
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })
                            : fetchSearchedOperation &&
                              fetchSearchedOperation.map((res, index) => {
                                  return (
                                      <tr key={index}>
                                          <td> {compteur++} </td>
                                          <td> {res.NumTransaction} </td>
                                          <td> {res.NumCompte} </td>
                                          <td>
                                              {" "}
                                              {res.CodeMonnaie == 1
                                                  ? parseInt(res.Creditusd) > 0
                                                      ? parseInt(res.Creditusd)
                                                      : parseInt(res.Debitusd)
                                                  : parseInt(res.Creditfc) > 0
                                                  ? parseInt(res.Creditfc)
                                                  : parseInt(res.Debitfc)}
                                          </td>
                                          <td>
                                              {res.CodeMonnaie == 1
                                                  ? "USD"
                                                  : "CDF"}{" "}
                                          </td>
                                          <td>{res.TypeTransaction} </td>
                                          <td>{res.Libelle} </td>
                                          <td>
                                              {" "}
                                              <button
                                                  className="btn btn-success"
                                                  onClick={() => {
                                                      extourneOperation(
                                                          res.NumTransaction
                                                      );
                                                  }}
                                              >
                                                  <i class="fas fa-exchange-alt"></i>
                                                  Extouner
                                              </button>
                                          </td>
                                      </tr>
                                  );
                              })}
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Debiter;
