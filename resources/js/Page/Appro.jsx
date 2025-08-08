// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import RecuApproCDF from "./Modals/RecuApproCDF";
import RecuApproUSD from "./Modals/RecuApproUSD";
// import { useNavigate } from "react-router-dom";

const Appro = () => {
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
    const [devise, setDevise] = useState("CDF");
    const [CaissierId, setCaissierId] = useState();
    const [fetchData, setFetchData] = useState();
    const [Montant, setMontant] = useState(0);
    const [loading, setloading] = useState(false);
    const [getBilletageCDF, setGetBilletageCDF] = useState();
    const [getBilletageUSD, setGetBilletageUSD] = useState();
    const [getchefcaisse, setgetChefcaisse] = useState();
    const [fetchDailyOperationCDF, setFetchDailyOperationCDF] = useState();
    const [fetchDailyOperationUSD, setFetchDailyOperationUSD] = useState();
    const [selectedData, setSelectedData] = useState(null);
    useEffect(() => {
        getAllCaissier();
        GetUserInformation();
        getLastestOperation();
    }, []);

    const getAllCaissier = async () => {
        const res = await axios.get("/eco/page/appro/get-all-caissiers");
        if (res.data.status == 1) {
            setFetchData(res.data.data);
            setgetChefcaisse(res.data.chefcaisse);
            // console.log(fetchData[0].NomCompte);
        }
    };
    //PERMET AU CHEF CAISSE D'APPPROVISIONNER UN CAISSIER
    const saveOperation = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post("/eco/page/save-appro", {
            devise,
            Montant,
            CaissierId,
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
        });
        if (res.data.status == 1) {
            setloading(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });

            setDevise("");
            setMontant("");
            setvightMille("0");
            setdixMille("0");
            setcinqMille("0");
            setmilleFranc("0");
            setcinqCentFr("0");
            setdeuxCentFranc("0");
            setcentFranc("0");
            setcinquanteFanc("0");
            sethundred("0");
            setfitfty("0");
            settwenty("0");
            setten("0");
            setfive("0");
            setoneDollar("0");
            getLastestOperation();
        } else {
            setloading(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    //PERMET DE RECUPERER LES OPERATIONS RECENTES POUR EDITER LES RECU

    const getLastestOperation = async () => {
        const res = await axios.get("/eco/pages/appro/get-daily-operations");
        if (res.data.status == 1) {
            setFetchDailyOperationCDF(res.data.dataCDF);
            setFetchDailyOperationUSD(res.data.dataUSD);
        }
        console.log(fetchDailyOperationCDF);
    };

    const GetUserInformation = async () => {
        const res = await axios.get("/eco/page/appro/get-billetage-caissier");
        if (res.data.status == 1) {
            setGetBilletageCDF(res.data.billetageCDF);
            setGetBilletageUSD(res.data.billetageUSD);
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

    //PERMET A L'UTILISATEUR D'ACCEPTER L'APPRO LUI ENVOYE PAR LE CHEF CAISSE
    const AcceptAppro = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/appro/accept-appro", {
            devise,
        });

        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            // setTimeout(function () {
            //     window.location.reload();
            // }, 2000);
            getLastestOperation();
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

    function removeLastWord(sentence) {
        const words = sentence.split(" "); // Divise la chaîne en mots
        const wordsWithoutLast = words.slice(0, -1); // Prend tous les mots sauf le dernier
        return wordsWithoutLast.join(" "); // Recompose la chaîne sans le dernier mot
    }

    const handlePrintClick = (data) => {
        setSelectedData(data);
    };

    return (
        <>
            {fetchData !== undefined &&
            getchefcaisse &&
            getchefcaisse.isChefCaisse == 1 ? (
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
                                    Approvisionnement
                                </h5>
                            </div>{" "}
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "3px" }}
                        >
                            <form action="">
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
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    onChange={(e) => {
                                                        setDevise(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
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
                                                {" "}
                                                <label
                                                    htmlFor="CaissierId"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Caissier(ère)
                                                </label>
                                            </td>
                                            <td>
                                                <select
                                                    id="CaissierId"
                                                    name="CaissierId"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "150px",
                                                    }}
                                                    onChange={(e) => {
                                                        setCaissierId(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        Sélectionnez
                                                    </option>
                                                    {fetchData &&
                                                        fetchData.map(
                                                            (res, index) => {
                                                                return (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            res.caissierId
                                                                        }
                                                                    >
                                                                        {removeLastWord(
                                                                            res.NomCompte
                                                                        )}
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                </select>
                                            </td>
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
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
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

                                        <hr />
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
                    <div className="row">
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "2px" }}
                        >
                            <form action="">
                                <fieldset>
                                    <legend>
                                        <p>Billetage</p>
                                    </legend>
                                    {devise == "USD" ? (
                                        <form
                                            method="POST"
                                            style={{
                                                height: "auto",
                                            }}
                                        >
                                            <table
                                                className="tableDepotEspece"
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
                                            className="tableDepotEspece"
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
                        </div>
                        <div className="col-md-2 card rounded-0 p-3">
                            <form action="">
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
                                    </tr>
                                    {/* <tr>
                                        <td>
                                            <button className="btn btn-success rounded-10 mt-1">
                                                <i className="fas fa-print"></i>{" "}
                                                Imprimer
                                            </button>
                                        </td>
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
                            className="col-md-5"
                            style={{ overflowX: "scroll", height: "500px" }}
                        >
                            {fetchDailyOperationCDF &&
                                fetchDailyOperationCDF.length > 0 && (
                                    <>
                                        <p>
                                            <h4>Appro recents</h4>
                                        </p>
                                        <br />
                                        <h3
                                            style={{
                                                color: "steelblue",
                                                fontWeight: "bold",
                                                background: "#fff",
                                                padding: "2px",
                                            }}
                                        >
                                            CDF
                                        </h3>
                                    </>
                                )}

                            {fetchDailyOperationCDF &&
                                fetchDailyOperationCDF.length > 0 && (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Réference</th>
                                                <th>Montant</th>
                                                <th>Caissier</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchDailyOperationCDF &&
                                                fetchDailyOperationCDF.map(
                                                    (res, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    {
                                                                        res.Reference
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.montant
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.NomUtilisateur
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
                                                                        data-target="#modal-appro-cdf"
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
                                            <RecuApproCDF data={selectedData} />
                                        )}
                                    </table>
                                )}

                            <br />
                            {fetchDailyOperationUSD &&
                                fetchDailyOperationUSD.length > 0 && (
                                    <>
                                        <h3
                                            style={{
                                                color: "steelblue",
                                                fontWeight: "bold",
                                                background: "#fff",
                                                padding: "2px",
                                            }}
                                        >
                                            {" "}
                                            USD
                                        </h3>
                                    </>
                                )}

                            {fetchDailyOperationUSD &&
                                fetchDailyOperationUSD.length > 0 && (
                                    <table className="table table-bordered table-striped">
                                        <thead>
                                            <tr>
                                                <th>Réference</th>
                                                <th>Montant</th>
                                                <th>Caissier</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {fetchDailyOperationUSD &&
                                                fetchDailyOperationUSD.map(
                                                    (res, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>
                                                                    {
                                                                        res.Reference
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.montant
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.NomUtilisateur
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
                                                                        data-target="#modal-appro-usd"
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
                                            <RecuApproUSD data={selectedData} />
                                        )}
                                    </table>
                                )}
                        </div>
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
                                    Approvisionnement
                                </h5>
                            </div>{" "}
                        </div>
                    </div>

                    <div className="row mt-3">
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "3px" }}
                        >
                            <form action="">
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
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    onChange={(e) => {
                                                        setDevise(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    {/* <option value="">
                                                        Séléctionnez
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
                                        <hr />
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
                    <div className="row">
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "2px" }}
                        >
                            <form action="">
                                <p className="text-bold">
                                    BILLETAGE DISPONIBLE
                                </p>
                                {devise == "USD"
                                    ? getBilletageUSD && (
                                          <table
                                              className="table-dark"
                                              style={{
                                                  padding: "10px",
                                                  border: "1px solid #dcdcdc",
                                                  width: "100%",
                                              }}
                                          >
                                              <thead
                                                  style={{
                                                      border: "1px solid #dcdcdc",
                                                      padding: "3px solid",
                                                  }}
                                              >
                                                  <tr>
                                                      <th
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          Coupure
                                                      </th>
                                                      <th>Nbr Billets</th>
                                                      <th>Montant</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          100 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.centDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.centDollars *
                                                                  100
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          50 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {" "}
                                                          {parseInt(
                                                              getBilletageUSD.cinquanteDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.cinquanteDollars *
                                                                  50
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          20 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.vightDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.vightDollars *
                                                                  20
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          10 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.dixDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.dixDollars *
                                                                  10
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          5 X{" "}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.cinqDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.cinqDollars *
                                                                  5
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          1 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.unDollars
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageUSD.unDollars *
                                                                  1
                                                          )}
                                                      </td>
                                                  </tr>
                                              </tbody>
                                              <tfoot>
                                                  <th></th>
                                                  <th></th>
                                                  <th
                                                      style={{
                                                          padding: "5px",
                                                          background: "green",
                                                      }}
                                                  >
                                                      {getBilletageUSD.montant !==
                                                          undefined &&
                                                          numberWithSpaces(
                                                              parseInt(
                                                                  getBilletageUSD.montant
                                                              )
                                                          )}
                                                  </th>
                                              </tfoot>
                                          </table>
                                      )
                                    : getBilletageCDF && (
                                          <table
                                              className="table-dark"
                                              style={{
                                                  padding: "10px",
                                                  border: "1px solid #dcdcdc",
                                                  width: "100%",
                                              }}
                                          >
                                              <thead
                                                  style={{
                                                      border: "1px solid #dcdcdc",
                                                      padding: "3px solid",
                                                  }}
                                              >
                                                  <tr>
                                                      <th
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          Coupure
                                                      </th>
                                                      <th>Nbr Billets</th>
                                                      <th>Montant</th>
                                                  </tr>
                                              </thead>
                                              <tbody>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          20 000 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.vightMilleFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.vightMilleFranc *
                                                                  20000
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          10 000 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.dixMilleFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.dixMilleFranc *
                                                                  10000
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          5 000 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinqMilleFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinqMilleFranc *
                                                                  5000
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          1 000 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.milleFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.milleFranc *
                                                                  1000
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          500 X{" "}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinqCentFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinqCentFranc *
                                                                  500
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          200 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.deuxCentFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.deuxCentFranc *
                                                                  200
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          100 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.centFranc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.centFranc *
                                                                  100
                                                          )}
                                                      </td>
                                                  </tr>
                                                  <tr
                                                      style={{
                                                          border: "1px solid #dcdcdc",
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          50 X
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinquanteFanc
                                                          )}
                                                      </td>
                                                      <td
                                                          style={{
                                                              padding: "2px",
                                                          }}
                                                      >
                                                          {parseInt(
                                                              getBilletageCDF.cinquanteFanc *
                                                                  50
                                                          )}
                                                      </td>
                                                  </tr>
                                              </tbody>
                                              <tfoot>
                                                  <th></th>
                                                  <th></th>
                                                  <th
                                                      style={{
                                                          padding: "5px",
                                                          background: "green",
                                                      }}
                                                  >
                                                      {getBilletageCDF.montant !==
                                                          undefined &&
                                                          numberWithSpaces(
                                                              parseInt(
                                                                  getBilletageCDF.montant
                                                              )
                                                          )}
                                                  </th>
                                              </tfoot>
                                          </table>
                                      )}
                            </form>
                        </div>
                        <div className="col-md-2 card rounded-0 p-3">
                            <form action="">
                                <table>
                                    <tr>
                                        <td>
                                            <button
                                                className="btn btn-primary rounded-10"
                                                id="validerbtn"
                                                onClick={AcceptAppro}
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

                                            {/* <button className="btn btn-primary rounded-0">
                                    Valider
                                </button> */}
                                        </td>
                                    </tr>
                                    {/* <tr>
                                        <td>
                                            <button className="btn btn-success rounded-10 mt-1">
                                                <i className="fas fa-print"></i>{" "}
                                                Imprimer
                                            </button>
                                        </td>
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
                    </div>
                </div>
            )}
        </>
    );
};

export default Appro;
