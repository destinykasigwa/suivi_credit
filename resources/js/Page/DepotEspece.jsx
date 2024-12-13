// import styles from "../styles/RegisterForm.module.css";
import { useState, use, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import RecuDepot from "./Modals/RecuDepot";
import { Bars } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";

const DepotEspece = () => {
    //CDF ATTRIBUTE
    const [vightMille, setvightMille] = useState(0);
    const [dixMille, setdixMille] = useState(0);
    const [cinqMille, setcinqMille] = useState(0);
    const [milleFranc, setmilleFranc] = useState(0);
    const [cinqCentFr, setcinqCentFr] = useState(0);
    const [deuxCentFranc, setdeuxCentFranc] = useState(0);
    const [centFranc, setcentFranc] = useState(0);
    const [cinquanteFanc, setcinquanteFanc] = useState(0);

    //USD ATTRIBUTE
    const [hundred, sethundred] = useState(0);
    const [fitfty, setfitfty] = useState(0);
    const [twenty, settwenty] = useState(0);
    const [ten, setten] = useState(0);
    const [five, setfive] = useState(0);
    const [oneDollar, setoneDollar] = useState(0);

    const [searched_account, setsearched_account] = useState();
    const [fetchData, setFetchData] = useState();
    const [devise, setDevise] = useState("CDF");
    const [motifDepot, setMotifDepot] = useState("EPARGNE");
    const [DeposantName, setDeposantName] = useState();
    const [DeposantPhone, setDeposantPhone] = useState();
    const [Montant, setMontant] = useState(0);
    const [loading, setloading] = useState(false);
    const [error, setError] = useState([]);
    const [fetchData2, setfetchData2] = useState();
    const [Commission, setCommission] = useState(0);
    const [GetCommissionConfig, setGetCommissionConfig] = useState("");
    const [getBilletageCDF, setGetBilletageCDF] = useState();
    const [getBilletageUSD, setGetBilletageUSD] = useState();
    const [selectedData, setSelectedData] = useState(null);
    const [loadingData, setloadingData] = useState(false);
    const [getNumCompte, setGetNumCompte] = useState();
    const [isLoadingBar, setIsLoadingBar] = useState();
    //GET SEACHED DATA
    const getSeachedData = async (e) => {
        e.preventDefault();
        setloadingData(true);
        const res = await axios.post("/eco/page/depot-espece/get-account/2", {
            searched_account: searched_account,
        });
        if (res.data.status == 1) {
            setloadingData(false);
            setFetchData(res.data.data);
            console.log(fetchData);
        } else {
            setloadingData(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    useEffect(() => {
        getCommissionConfig();
        getBilletage();
    }, []);

    const getBilletage = async () => {
        const res = await axios.get("/eco/depot/get-recu");
        if (res.data.status == 1) {
            setGetBilletageCDF(res.data.dataCDF);
            setGetBilletageUSD(res.data.dataUSD);
        }
    };

    const getCommissionConfig = async () => {
        const res = await axios.get("/eco/pages/get-commission-setting");
        if (res.data.status == 1) {
            console.log(res.data.data);
            setGetCommissionConfig(res.data.data);
        }
    };
    const saveOperation = async (e) => {
        e.preventDefault();
        setloading(true);
        setIsLoadingBar(true);
        try {
            const res = await axios.post(
                "/eco/page/depot-espece/save-deposit",
                {
                    vightMille,
                    dixMille,
                    cinqMille,
                    milleFranc,
                    cinqCentFr,
                    deuxCentFranc,
                    centFranc,
                    cinquanteFanc,
                    hundred,
                    fitfty,
                    twenty,
                    ten,
                    five,
                    oneDollar,
                    devise: fetchData2.CodeMonnaie == 1 ? "USD" : "CDF",
                    motifDepot,
                    DeposantName,
                    DeposantPhone,
                    Montant,
                    NumAbrege: searched_account,
                    Commission,
                    getNumCompte,
                }
            );
            if (res.data.status == 1) {
                setloading(false);
                setIsLoadingBar(false);
                setDeposantName("");
                setDeposantPhone("");
                setMontant("0");
                setvightMille(0);
                setdixMille(0);
                setcinqMille(0);
                setmilleFranc(0);
                setcinqCentFr(0);
                setdeuxCentFranc(0);
                setcentFranc(0);
                setcinquanteFanc(0);
                sethundred(0);
                setfitfty(0);
                settwenty(0);
                setten(0);
                setfive(0);
                setoneDollar(0);
                setCommission(0);
                Swal.fire({
                    title: "Succès",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                getBilletage();
            } else if (res.data.status == 0) {
                setloading(false);
                setIsLoadingBar(false);
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                setloading(false);
                setError(res.data.validate_error);
            }
        } catch (error) {
            Swal.fire({
                title: "Erreur",
                text: "Erreur de connexion. Tentative de nouvelle connexion...",
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setTimeout(() => {
                saveOperation(e); // Retenter la requête après un délai
            }, 5000); // Retenter après 5 secondes
        } finally {
            setloading(false);
        }
    };
    const getAccountInfo = async (event) => {
        if (event.detail == 2) {
            setloadingData(true);
            const res = await axios.post(
                "/eco/page/depot-espece/get-account/specific",
                {
                    NumCompte: event.target.innerHTML,
                }
            );
            if (res.data.status == 1) {
                setloadingData(false);
                setfetchData2(res.data.data);
                setGetNumCompte(event.target.innerHTML);
                fetchData2 && setDeposantName(fetchData2.NomCompte);
                console.log(DeposantName);
            } else {
                setloadingData(false);
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const handlePrintClick = (data) => {
        setSelectedData(data);
    };
    let myspinner = {
        margin: "5px auto",
        width: "3rem",
        marginTop: "180px",
        border: "0px",
        height: "200px",
    };
    return (
        <>
            {loadingData ? (
                <div className="row" id="rowspinner">
                    <div className="myspinner" style={myspinner}>
                        <span className="spinner-border" role="status"></span>
                        <span style={{ marginLeft: "-20px" }}>
                            Chargement...
                        </span>
                    </div>
                </div>
            ) : (
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
                                <h5 className="text-bold p-1">
                                    Dépot D'Espèce
                                </h5>
                            </div>{" "}
                        </div>
                    </div>
                    <div className="row mt-3">
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
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "3px" }}
                        >
                            <form action="">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input
                                                    id="compte_to_search"
                                                    name="compte_to_search"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "80px",
                                                    }}
                                                    onChange={(e) => {
                                                        setsearched_account(
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
                                                    onClick={getSeachedData}
                                                >
                                                    Rechercher
                                                </button>
                                            </td>
                                        </tr>
                                        <hr />
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="intituleCompte"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Intitulé de compte
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="intituleCompte"
                                                    name="intituleCompte"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.NomCompte
                                                    }
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="NumCompte"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Numéro de compte
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="NumCompte"
                                                    name="NumCompte"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    disabled
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.NumCompte
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="CodeAgence"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Code Agence
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="CodeAgence"
                                                    name="CodeAgence"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "50px",
                                                    }}
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.CodeAgence
                                                    }
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className="col-md-4 card rounded-0 p-3">
                            <p
                                className="text-bold"
                                style={{ color: "steelblue" }}
                            >
                                Liste de comptes
                            </p>
                            <form
                                action=""
                                style={{ overflowX: "scroll", height: "150px" }}
                            >
                                <table className="table">
                                    {fetchData &&
                                        fetchData.map((res, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        background: "#dcdcdc",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            border: "1px solid #fff",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={(event) =>
                                                            getAccountInfo(
                                                                event
                                                            )
                                                        }
                                                    >
                                                        {res.NumCompte}
                                                    </td>
                                                    <td
                                                        style={{
                                                            border: "1px solid #fff",
                                                        }}
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
                        // style={{ height: "340px", overflowX: "scroll" }}
                    >
                        <div
                            className="col-md-3 card rounded-0 p-1"
                            style={{ marginRight: "3px" }}
                        >
                            <form action="">
                                <fieldset>
                                    <legend
                                        style={{
                                            border: "2px solid:#dcdcdc !important",
                                        }}
                                    >
                                        <p style={{ color: "steelblue" }}>
                                            Informations
                                        </p>
                                    </legend>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
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
                                                </td>
                                                <td>
                                                    {" "}
                                                    <select
                                                        id="devise"
                                                        name="devise"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${
                                                                error.devise
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                        }}
                                                        disabled
                                                        onChange={(e) => {
                                                            setDevise(
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option
                                                            value={
                                                                fetchData2 &&
                                                                fetchData2.CodeMonnaie ==
                                                                    1
                                                                    ? "USD"
                                                                    : "CDF"
                                                            }
                                                        >
                                                            {fetchData2 &&
                                                            fetchData2.CodeMonnaie ==
                                                                1
                                                                ? "USD"
                                                                : "CDF"}
                                                        </option>
                                                        {/* <option value="USD">USD</option> */}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="motifDepot"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Motif
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <input
                                                        id="motifDepot"
                                                        name="motifDepot"
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${
                                                                error.motifDepot
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                        onChange={(e) =>
                                                            setMotifDepot(
                                                                e.target.value
                                                            ).toUpperCase()
                                                        }
                                                        value={motifDepot}
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="DeposantName"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Déposant{" "}
                                                        <i
                                                            style={{
                                                                color: "red",
                                                            }}
                                                        >
                                                            *
                                                        </i>
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <input
                                                        id="DeposantName"
                                                        name="DeposantName"
                                                        required
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${
                                                                error.DeposantName
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                            textTransform:
                                                                "uppercase",
                                                        }}
                                                        onChange={(e) =>
                                                            setDeposantName(
                                                                e.target.value
                                                            ).toUpperCase()
                                                        }
                                                        value={DeposantName}
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="DeposantPhone"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Téléphone
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <input
                                                        id="DeposantPhone"
                                                        name="DeposantPhone"
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                        }}
                                                        onChange={(e) =>
                                                            setDeposantPhone(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={DeposantPhone}
                                                    />
                                                </td>
                                            </tr>
                                            {GetCommissionConfig == 1 && (
                                                <tr>
                                                    <td>
                                                        {" "}
                                                        <label
                                                            htmlFor="Commission"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Commission
                                                        </label>
                                                    </td>
                                                    <td>
                                                        {" "}
                                                        <input
                                                            id="Commission"
                                                            name="Commission"
                                                            type="text"
                                                            style={{
                                                                padding: "1px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "70px",
                                                            }}
                                                            onChange={(e) =>
                                                                setCommission(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={Commission}
                                                        />
                                                    </td>
                                                </tr>
                                            )}
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="Montant"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                            textTransform:
                                                                "uppercase",
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
                                                            padding: "1px ",
                                                            border: `${
                                                                error.Montant
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                            width: "70px",
                                                        }}
                                                        onChange={(e) =>
                                                            setMontant(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={Montant}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </form>
                        </div>
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "2px" }}
                        >
                            <form action="">
                                <fieldset>
                                    <legend>
                                        <p style={{ color: "steelblue" }}>
                                            Billetage
                                        </p>
                                    </legend>
                                    {fetchData2 &&
                                    fetchData2.CodeMonnaie == 1 ? (
                                        <form
                                            method="POST"
                                            style={{
                                                height: "auto",
                                            }}
                                        >
                                            <table
                                                className="tableDepotEspece table-bordered p-2"
                                                style={{
                                                    border: "2px solid #dcdcdc",
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th className="col-md-4">
                                                            Coupures
                                                        </th>
                                                        <th className="col-md-4">
                                                            Nbr Billets
                                                        </th>
                                                        <th className="col-md-2">
                                                            Total
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            100
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="hundred"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                value={hundred}
                                                                onChange={(e) =>
                                                                    sethundred(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                            />
                                                        </td>
                                                        <td>{hundred * 100}</td>
                                                    </tr>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            50
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="fitfty"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setfitfty(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={fitfty}
                                                            />
                                                        </td>
                                                        <td>{fitfty * 50}</td>
                                                    </tr>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            20
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="twenty"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                onChange={(e) =>
                                                                    settwenty(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={twenty}
                                                            />
                                                        </td>
                                                        <td>{twenty * 20}</td>
                                                    </tr>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            10
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="ten"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setten(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={ten}
                                                            />
                                                        </td>
                                                        <td>{ten * 10}</td>
                                                    </tr>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            5
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="five"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setfive(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={five}
                                                            />
                                                        </td>
                                                        <td>{five * 5}</td>
                                                    </tr>
                                                    <tr ng-repeat="name in getdrugnameNewArray">
                                                        <td
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            1
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                name="oneDollar"
                                                                style={{
                                                                    boxShadow:
                                                                        "inset 0 0 5px 5px #888",
                                                                    fontSize:
                                                                        "15px",
                                                                }}
                                                                onChange={(e) =>
                                                                    setoneDollar(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                value={
                                                                    oneDollar
                                                                }
                                                            />
                                                        </td>
                                                        <td>{oneDollar * 1}</td>
                                                    </tr>
                                                    <tr
                                                        style={{
                                                            padding: "10px",
                                                        }}
                                                    >
                                                        <th
                                                            style={{
                                                                padding: "4px",
                                                            }}
                                                        >
                                                            Total
                                                        </th>
                                                        <th>
                                                            {" "}
                                                            {parseInt(hundred) +
                                                                parseInt(
                                                                    fitfty
                                                                ) +
                                                                parseInt(
                                                                    twenty
                                                                ) +
                                                                parseInt(ten) +
                                                                parseInt(five) +
                                                                parseInt(
                                                                    oneDollar
                                                                )}{" "}
                                                        </th>
                                                        <th
                                                            style={{
                                                                fontSize:
                                                                    "25px",
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            {" "}
                                                            {hundred * 100 +
                                                                fitfty * 50 +
                                                                twenty * 20 +
                                                                ten * 10 +
                                                                five * 5 +
                                                                oneDollar * 1}
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </form>
                                    ) : (
                                        <table
                                            className="tableDepotEspece table-bordered p-2"
                                            style={{
                                                border: "2px solid #dcdcdc",
                                            }}
                                        >
                                            <thead>
                                                <tr>
                                                    <th className="col-md-4">
                                                        Coupures
                                                    </th>
                                                    <th className="col-md-4">
                                                        Nbr Billets
                                                    </th>
                                                    <th className="col-md-2">
                                                        Total
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        20000
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="vightMille"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setvightMille(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={vightMille}
                                                        />
                                                    </td>
                                                    <td>
                                                        {vightMille * 20000}
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        10000
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="dixMille"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setdixMille(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={dixMille}
                                                        />
                                                    </td>
                                                    <td>{dixMille * 10000}</td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        5000
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="cinqMille"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setcinqMille(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={cinqMille}
                                                        />
                                                    </td>
                                                    <td>{cinqMille * 5000}</td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        1000
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="milleFranc"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setmilleFranc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={milleFranc}
                                                        />
                                                    </td>
                                                    <td>{milleFranc * 1000}</td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        500
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="cinqCentFr"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setcinqCentFr(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={cinqCentFr}
                                                        />
                                                    </td>
                                                    <td>{cinqCentFr * 500}</td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        200
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="deuxCentFranc"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setdeuxCentFranc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                deuxCentFranc
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        {deuxCentFranc * 200}
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        100
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="centFranc"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setcentFranc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={centFranc}
                                                        />
                                                    </td>
                                                    <td>{centFranc * 100}</td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        50
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            name="cinquanteFanc"
                                                            style={{
                                                                boxShadow:
                                                                    "inset 0 0 5px 5px #888",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                            onChange={(e) =>
                                                                setcinquanteFanc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                cinquanteFanc
                                                            }
                                                        />
                                                    </td>
                                                    <td>
                                                        {cinquanteFanc * 50}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        padding: "10px",
                                                    }}
                                                >
                                                    <th
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        Total
                                                    </th>
                                                    <th
                                                        style={{
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        {" "}
                                                        {parseInt(vightMille) +
                                                            parseInt(dixMille) +
                                                            parseInt(
                                                                cinqMille
                                                            ) +
                                                            parseInt(
                                                                milleFranc
                                                            ) +
                                                            parseInt(
                                                                cinqCentFr
                                                            ) +
                                                            parseInt(
                                                                deuxCentFranc
                                                            ) +
                                                            parseInt(
                                                                centFranc
                                                            ) +
                                                            parseInt(
                                                                cinquanteFanc
                                                            )}{" "}
                                                    </th>
                                                    <th
                                                        style={{
                                                            fontSize: "25px",
                                                            background: "green",
                                                            color: "#fff",
                                                            padding: "4px",
                                                        }}
                                                    >
                                                        {" "}
                                                        {vightMille * 20000 +
                                                            dixMille * 10000 +
                                                            cinqMille * 5000 +
                                                            milleFranc * 1000 +
                                                            cinqCentFr * 500 +
                                                            deuxCentFranc *
                                                                200 +
                                                            centFranc * 100 +
                                                            cinquanteFanc *
                                                                50}{" "}
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    )}
                                </fieldset>
                            </form>
                            <form action="" className="mt-2">
                                <table>
                                    <tr>
                                        <td>
                                            {hundred * 100 +
                                                fitfty * 50 +
                                                twenty * 20 +
                                                ten * 10 +
                                                five * 5 +
                                                oneDollar * 1 ===
                                                parseInt(Montant) ||
                                            vightMille * 20000 +
                                                dixMille * 10000 +
                                                cinqMille * 5000 +
                                                milleFranc * 1000 +
                                                cinqCentFr * 500 +
                                                deuxCentFranc * 200 +
                                                centFranc * 100 +
                                                cinquanteFanc * 50 ===
                                                parseInt(Montant) ? (
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
                                            ) : (
                                                <button
                                                    className="btn btn-primary rounded-10"
                                                    disabled
                                                >
                                                    {" "}
                                                    <i className="fas fa-check"></i>{" "}
                                                    Valider
                                                </button>
                                            )}
                                            {/* <button className="btn btn-primary rounded-0">
                                        Valider
                                    </button> */}
                                        </td>

                                        <td>
                                            {/* <button className="btn btn-success rounded-10 mt-1 ml-1">
                                        <i className="fas fa-print"></i>{" "}
                                        Imprimer
                                    </button> */}
                                        </td>
                                    </tr>
                                    {/* <tr>
                               
                            </tr> */}
                                    {/* <tr>
                                <td>
                                    <button className="btn btn-danger rounded-0 mt-1">
                                        Réinitialiser
                                    </button>
                                </td>
                            </tr> */}
                                </table>
                            </form>
                        </div>
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ height: "500px", overflowX: "scroll" }}
                        >
                            <h4 style={{ color: "steelblue" }}>
                                {getBilletageCDF &&
                                    getBilletageCDF.length > 0 &&
                                    "Opérations recentes CDF"}
                            </h4>
                            {getBilletageCDF && getBilletageCDF.length > 0 && (
                                <table
                                    className="table table-bordered table-striped"
                                    style={{ fontSize: "13px" }}
                                >
                                    <thead>
                                        <tr>
                                            <th>Réference</th>
                                            <th>Montant</th>
                                            <th>Déposant</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getBilletageCDF &&
                                            getBilletageCDF.map(
                                                (res, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {
                                                                    res.refOperation
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.montantEntre
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.Beneficiaire
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        handlePrintClick(
                                                                            res
                                                                        )
                                                                    }
                                                                    data-toggle="modal"
                                                                    data-target="#modal-delestage-cdf"
                                                                    className="btn btn-primary rounded-10"
                                                                >
                                                                    Imprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                    {selectedData && (
                                        <RecuDepot data={selectedData} />
                                    )}
                                </table>
                            )}

                            <h4 style={{ color: "steelblue" }}>
                                {getBilletageUSD &&
                                    getBilletageUSD.length > 0 &&
                                    "Opérations recentes USD"}
                            </h4>
                            {getBilletageUSD && getBilletageUSD.length > 0 && (
                                <table
                                    className="table table-bordered table-striped"
                                    style={{ fontSize: "13px" }}
                                >
                                    <thead>
                                        <tr>
                                            <th>Réference</th>
                                            <th>Montant</th>
                                            <th>Déposant</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {getBilletageUSD &&
                                            getBilletageUSD.map(
                                                (res, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {
                                                                    res.refOperation
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.montantEntre
                                                                }
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.Beneficiaire
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        handlePrintClick(
                                                                            res
                                                                        )
                                                                    }
                                                                    data-toggle="modal"
                                                                    data-target="#modal-delestage-cdf"
                                                                    className="btn btn-primary rounded-10"
                                                                >
                                                                    Imprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                    {selectedData && (
                                        <RecuDepot data={selectedData} />
                                    )}
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DepotEspece;
