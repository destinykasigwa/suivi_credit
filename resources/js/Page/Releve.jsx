import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";
// import { ExportCSV } from "./Print";
import { EnteteRapport } from "./HeaderReport";

const Releve = () => {
    const [loading, setloading] = useState(false);
    const [fetchData, setFetchData] = useState();
    const [fetchDataByName, setFetchDataByName] = useState();
    const [devise, setDevise] = useState("CDF");
    const [fetchData2, setfetchData2] = useState();
    const [searched_account, setsearched_account] = useState();
    const [searched_account_by_name, setsearched_account_by_name] = useState();
    const [dateDebut, setDateDebut] = useState();
    const [dateFin, setDateFin] = useState();
    const [getSelectedAccount, setGetSelectedAccount] = useState();
    const [getReleveData, setGetReleveData] = useState([]);
    const [getSoldeReport, setGetSoldeReport] = useState(0);
    const [getdefaultDateDebut, setGetdefaultDateDebut] = useState();
    const [getdefaultDateFin, setGetdefaultDateFin] = useState();
    const [getDevise, setGetDevise] = useState();
    const [getSoldeInfo, setGetSoldeInfo] = useState();
    const [getOtherInfo, setGetOtherInfo] = useState();
    const [fileName, setfileName] = useState(".xlsx");
    const [loadingData, setloadingData] = useState(false);

    const saveOperation = (e) => {
        e.preventDefault();
        setloading(true);
    };

    // useEffect(() => {}, []);
    const getSeachedData = async (e) => {
        e.preventDefault();
        setloadingData(true);
        const res = await axios.post("/eco/page/depot-espece/get-account", {
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
    const getSeachedDataByName = async (e) => {
        e.preventDefault();

        setloadingData(true);
        const res = await axios.post("/eco/page/releve/get-account-by-name", {
            searched_account_by_name: searched_account_by_name,
        });
        if (res.data.status == 1) {
            setloadingData(false);
            setFetchDataByName(res.data.data);
            console.log(fetchDataByName);
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
                console.log(fetchData2);
                setGetSelectedAccount(event.target.innerHTML);
                setGetdefaultDateDebut(res.data.defaultDateDebut);
                setGetdefaultDateFin(res.data.defaultDateFin);
                setDateDebut(getdefaultDateDebut);
                setDateFin(getdefaultDateFin);
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

    //PERMET D'AFFICHER LE RELEVE
    const AfficherReleve = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post("/eco/page/affichage-releve", {
            NumCompte: getSelectedAccount,
            DateDebut: dateDebut ? dateDebut : getdefaultDateDebut,
            DateFin: dateFin ? dateFin : getdefaultDateFin,
        });
        if (res.data.status == 1) {
            setloading(false);
            setGetReleveData(res.data.dataReleve);
            setGetSoldeReport(
                res.data.dataSoldeReport.soldeReport == undefined
                    ? 0
                    : res.data.dataSoldeReport.soldeReport
            );
            setGetDevise(res.data.devise);
            setGetSoldeInfo(res.data.soldeInfo);
            setGetOtherInfo(res.data.getCompteInfo);
            console.log(res.data.dataSoldeReport.soldeReport);
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
    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

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

    //
    // const exportTableData = (tableId) => {
    //     const s2ab = (s) => {
    //         const buf = new ArrayBuffer(s.length);
    //         const view = new Uint8Array(buf);
    //         for (let i = 0; i !== s.length; ++i)
    //             view[i] = s.charCodeAt(i) & 0xff;
    //         return buf;
    //     };

    //     const table = document.getElementById(tableId);
    //     const wb = XLSX.utils.table_to_book(table);
    //     const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    //     const fileName = `table_${tableId}.xlsx`;
    //     saveAs(
    //         new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
    //         fileName
    //     );
    // };
    const exportTableData = (tableId) => {
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };

        const table = document.getElementById(tableId);

        if (!table) {
            console.error(`Table with id ${tableId} not found`);
            return;
        }

        // Convert table to workbook
        const wb = XLSX.utils.table_to_book(table, { raw: true });

        // Optionally set column widths
        const ws = wb.Sheets[wb.SheetNames[0]];
        const cols = Array.from(
            table.querySelectorAll("tr:first-child th")
        ).map(
            () => ({ wpx: 100 }) // Set default width in pixels
        );
        ws["!cols"] = cols;

        // Write workbook
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });

        // Save file
        const fileName = `table_${tableId}.xlsx`;
        saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            fileName
        );
    };
    const exportToPDFCDF = () => {
        const content = document.getElementById("content-to-download-cdf");

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg", 0.75); // Change to JPEG and set quality to 0.75
                const pdf = new jsPDF("p", "mm", "a4");

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(
                    imgData,
                    "JPEG",
                    0,
                    position,
                    pdfWidth,
                    imgHeight,
                    undefined,
                    "FAST"
                ); // Use 'FAST' compression
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(
                        imgData,
                        "JPEG",
                        0,
                        position,
                        pdfWidth,
                        imgHeight,
                        undefined,
                        "FAST"
                    ); // Use 'FAST' compression
                    heightLeft -= pdfHeight;
                }

                pdf.autoPrint();
                window.open(pdf.output("bloburl"), "_blank");
            })
            .catch((error) => {
                console.error("Error capturing canvas:", error);
            });
    };
    const exportToPDFUSD = () => {
        const content = document.getElementById("content-to-download-usd");

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 2 }).then((canvas) => {
            const paddingTop = 50;
            const paddingRight = 50;
            const paddingBottom = 50;
            const paddingLeft = 50;

            const canvasWidth = canvas.width + paddingLeft + paddingRight;
            const canvasHeight = canvas.height + paddingTop + paddingBottom;

            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvasWidth;
            newCanvas.height = canvasHeight;
            const ctx = newCanvas.getContext("2d");

            if (ctx) {
                ctx.fillStyle = "#ffffff"; // Background color
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(canvas, paddingLeft, paddingTop);
            }
            const pdf = new jsPDF("p", "mm", "a4");
            const imgData = newCanvas.toDataURL("image/jpeg", 0.8); // Use JPEG format and set quality to 0.8
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.autoPrint();
            window.open(pdf.output("bloburl"), "_blank");
        });
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
                                    Relevé de compte
                                </h5>
                            </div>{" "}
                        </div>
                    </div>
                    <div className="row">
                        <div
                            className="col-md-4 card rounded-0 p-1"
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
                                                        marginRight: "2px",
                                                    }}
                                                    onClick={getSeachedData}
                                                >
                                                    Rechercher
                                                </button>
                                            </td>
                                            <td>
                                                <input
                                                    id="compte_to_search_by_name"
                                                    name="compte_to_search_by_name"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "80px",
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
                                                    onClick={
                                                        getSeachedDataByName
                                                    }
                                                >
                                                    Rechercher par nom
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
                                {fetchData ? (
                                    <table className="table">
                                        {fetchData &&
                                            fetchData.map((res, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        style={{
                                                            background:
                                                                "#dcdcdc",
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
                                                            {res.CodeMonnaie ==
                                                            1
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
                                ) : (
                                    <table className="table">
                                        {fetchDataByName &&
                                            fetchDataByName.map(
                                                (res, index) => {
                                                    return (
                                                        <tr
                                                            key={index}
                                                            style={{
                                                                background:
                                                                    "#dcdcdc",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <td
                                                                style={{
                                                                    border: "1px solid #fff",
                                                                    cursor: "pointer",
                                                                }}
                                                                onClick={(
                                                                    event
                                                                ) =>
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
                                                                {res.NomCompte}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    border: "1px solid #fff",
                                                                }}
                                                            >
                                                                {res.CodeMonnaie ==
                                                                1
                                                                    ? "USD"
                                                                    : "CDF"}
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        <tr>
                                            {/* <td>
                                        <button className="btn btn-primary rounded-0">
                                            Afficher le solde
                                        </button>
                                    </td> */}
                                        </tr>
                                    </table>
                                )}
                            </form>
                        </div>
                    </div>

                    <div
                        className="row"
                        // style={{ height: "350px", overflowX: "scroll" }}
                    >
                        <div className="row">
                            <div className="col-md-4">
                                <form action="">
                                    <table>
                                        <tr>
                                            <td>
                                                <label
                                                    htmlFor="dateDebut"
                                                    style={{
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                        marginRight: "3px",
                                                    }}
                                                >
                                                    Date Début
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    id="dateDebut"
                                                    type="date"
                                                    onChange={(e) => {
                                                        setDateDebut(
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={
                                                        dateDebut
                                                            ? dateDebut
                                                            : getdefaultDateDebut
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    htmlFor="dateFin"
                                                    style={{
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Date Fin
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    id="dateFin"
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    type="date"
                                                    onChange={(e) => {
                                                        setDateFin(
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={
                                                        dateFin
                                                            ? dateFin
                                                            : getdefaultDateFin
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <button
                                                    style={{
                                                        padding: "5px",
                                                        width: "90px",
                                                        border: "0px",
                                                    }}
                                                    className="btn btn-primary"
                                                    type="submit"
                                                    onClick={AfficherReleve}
                                                >
                                                    <i
                                                        className={`${
                                                            loading
                                                                ? "spinner-border spinner-border-sm"
                                                                : " fas fa-desktop"
                                                        }`}
                                                    ></i>
                                                    Afficher
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </form>
                            </div>
                        </div>
                        {getReleveData.length !== 0 ? (
                            getDevise == "CDF" ? (
                                <table
                                    id="main-table-releve-CDF"
                                    style={{ border: "0px", width: "100%" }}
                                >
                                    <div
                                        id="content-to-download-cdf"
                                        style={{
                                            width: "90%",
                                            margin: "0px auto",
                                        }}
                                        className="card p-3 mt-2 mb-4"
                                    >
                                        <div className="h-130 d-flex align-items-center justify-content-center">
                                            <EnteteRapport />
                                        </div>
                                        <div className="h-130 d-flex align-items-center justify-content-center">
                                            <h4
                                                style={{
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                    border: "1px solid #000",
                                                    padding: "5px",
                                                }}
                                            >
                                                RELEVE DE COMPTE
                                            </h4>
                                        </div>
                                        <div
                                            className="col-md-5"
                                            style={{
                                                marginLeft: "-2px",
                                                // padding: "0px",
                                            }}
                                        >
                                            <table
                                                class="table table-bordered table-striped"
                                                id="content-releve-table-entete"
                                                style={{
                                                    border: "1px solid #dcdcdc",
                                                    width: "100%",
                                                    marginBottom: "-1px",
                                                    marginLeft: "-4.2px",
                                                }}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                Intitulé de
                                                                compte
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getOtherInfo !==
                                                                    undefined &&
                                                                    getOtherInfo.NomCompte}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                Compte
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getOtherInfo !==
                                                                    undefined &&
                                                                    getOtherInfo.NumCompte}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Devise
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getDevise}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Solde Disponible
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.soldeDispo.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Solde Reporté au{" "}
                                                                {dateParser(
                                                                    dateDebut
                                                                        ? dateDebut
                                                                        : getdefaultDateDebut
                                                                )}
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {numberWithSpaces(
                                                                    getSoldeReport
                                                                )}
                                                            </strong>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Total Débit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.TotalDebit.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Total Crédit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.TotalCredit.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Date Débit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                <strong>
                                                                    {dateParser(
                                                                        dateDebut
                                                                            ? dateDebut
                                                                            : getdefaultDateDebut
                                                                    )}
                                                                </strong>
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Date Fin
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                <strong>
                                                                    {dateParser(
                                                                        dateFin
                                                                            ? dateFin
                                                                            : getdefaultDateFin
                                                                    )}
                                                                </strong>
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="table-responsive">
                                            <table
                                                class="table table-bordered table-striped"
                                                id="content-releve-tableCDF"
                                                style={{
                                                    border: "1px solid #dcdcdc",
                                                    width: "100%",
                                                    // marginLeft: "4px",
                                                }}
                                            >
                                                <thead
                                                    style={{
                                                        padding: "3px",
                                                        background: "teal",
                                                    }}
                                                >
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Réf. Op</th>
                                                        <th>Libellé</th>
                                                        <th>Débit</th>
                                                        <th>Crédit</th>
                                                        <th>Solde</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getReleveData.map(
                                                        (res, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {dateParser(
                                                                            res.DateTransaction
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.NumTransaction
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Libelle
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Debitfc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Creditfc
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {getOtherInfo.RefCadre ==
                                                                            31 ||
                                                                        getOtherInfo.RefCadre ==
                                                                            32
                                                                            ? "(" +
                                                                              parseFloat(
                                                                                  res.solde +
                                                                                      getSoldeReport
                                                                              )
                                                                                  .toFixed(
                                                                                      2
                                                                                  )
                                                                                  .replace(
                                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                                      " "
                                                                                  )
                                                                                  .replace(
                                                                                      ".",
                                                                                      ","
                                                                                  ) +
                                                                              ")"
                                                                            : parseFloat(
                                                                                  res.solde +
                                                                                      getSoldeReport
                                                                              )
                                                                                  .toFixed(
                                                                                      2
                                                                                  )
                                                                                  .replace(
                                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                                      " "
                                                                                  )
                                                                                  .replace(
                                                                                      ".",
                                                                                      ","
                                                                                  )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    <div className="float-end">
                                        <button
                                            onClick={() =>
                                                exportTableData(
                                                    "main-table-releve-CDF"
                                                )
                                            }
                                            className="btn btn-success"
                                            style={{ borderRadius: "0px" }}
                                        >
                                            <i class="fas fa-file-excel"></i>{" "}
                                            Exporter en Excel
                                        </button>{" "}
                                        <button
                                            className="btn btn-primary"
                                            style={{ borderRadius: "0px" }}
                                            onClick={exportToPDFCDF}
                                        >
                                            {" "}
                                            <i class="fas fa-file-pdf"></i>{" "}
                                            Exporter en PDF
                                        </button>
                                    </div>
                                </table>
                            ) : (
                                <table
                                    id="main-table-releve-USD"
                                    style={{ border: "0px" }}
                                >
                                    <div
                                        id="content-to-download-usd"
                                        style={{
                                            width: "90%",
                                            margin: "0px auto",
                                        }}
                                        className="card p-3 mt-2 mb-4"
                                    >
                                        <div className="h-130 d-flex align-items-center justify-content-center">
                                            <EnteteRapport />
                                        </div>
                                        <div className="h-130 d-flex align-items-center justify-content-center">
                                            <h4
                                                style={{
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                    border: "1px solid #000",
                                                    padding: "5px",
                                                }}
                                            >
                                                RELEVE DE COMPTE
                                            </h4>
                                        </div>
                                        <div
                                            className="col-md-5"
                                            style={{
                                                marginLeft: "-2px",
                                                // padding: "0px",
                                            }}
                                        >
                                            <table
                                                class="table table-bordered table-striped"
                                                id="content-releve-table-enteteUSD"
                                                style={{
                                                    border: "1px solid #dcdcdc",
                                                    width: "100%",
                                                    marginBottom: "-1px",
                                                    marginLeft: "-4.2px",
                                                }}
                                            >
                                                <tbody>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                Intitulé de
                                                                compte
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getOtherInfo !==
                                                                    undefined &&
                                                                    getOtherInfo.NomCompte}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                {" "}
                                                                Compte
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getOtherInfo !==
                                                                    undefined &&
                                                                    getOtherInfo.NumCompte}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Devise
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getDevise}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Solde Disponible
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.soldeDispo.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Solde Reporté au{" "}
                                                                {dateParser(
                                                                    dateDebut
                                                                        ? dateDebut
                                                                        : getdefaultDateDebut
                                                                )}
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong
                                                                style={{
                                                                    color: "red",
                                                                }}
                                                            >
                                                                {numberWithSpaces(
                                                                    getSoldeReport.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                            </strong>
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Total Débit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.TotalDebit.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Total Crédit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {getSoldeInfo !==
                                                                    undefined &&
                                                                    numberWithSpaces(
                                                                        getSoldeInfo.TotalCredit.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Date Débit
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {dateParser(
                                                                    dateDebut
                                                                        ? dateDebut
                                                                        : getdefaultDateDebut
                                                                )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                                background:
                                                                    "teal",
                                                            }}
                                                        >
                                                            <strong>
                                                                Date Fin
                                                            </strong>
                                                        </td>
                                                        <td
                                                            style={{
                                                                textAlign:
                                                                    "right",
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            <strong>
                                                                {dateParser(
                                                                    dateFin
                                                                        ? dateFin
                                                                        : getdefaultDateFin
                                                                )}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>

                                        <div class="table-responsive">
                                            <table
                                                class="table table-bordered table-striped"
                                                id="content-releve-tableUSD"
                                                style={{
                                                    border: "1px solid #dcdcdc",
                                                    width: "100%",
                                                    // marginLeft: "4px",
                                                }}
                                            >
                                                <thead
                                                    style={{
                                                        padding: "3px",
                                                        background: "teal",
                                                    }}
                                                >
                                                    <tr>
                                                        <th>Date</th>
                                                        <th>Réf. Op</th>
                                                        <th>Libellé</th>
                                                        <th>Débit</th>
                                                        <th>Crédit</th>
                                                        <th>Solde</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {getReleveData.map(
                                                        (res, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {dateParser(
                                                                            res.DateTransaction
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.NumTransaction
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Libelle
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Debitusd
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {
                                                                            res.Creditusd
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            padding:
                                                                                "2px",
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {getOtherInfo.RefCadre ==
                                                                            31 ||
                                                                        getOtherInfo.RefCadre ==
                                                                            32
                                                                            ? "(" +
                                                                              parseFloat(
                                                                                  res.solde +
                                                                                      getSoldeReport
                                                                              )
                                                                                  .toFixed(
                                                                                      2
                                                                                  )
                                                                                  .replace(
                                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                                      " "
                                                                                  )
                                                                                  .replace(
                                                                                      ".",
                                                                                      ","
                                                                                  ) +
                                                                              ")"
                                                                            : parseFloat(
                                                                                  res.solde +
                                                                                      getSoldeReport
                                                                              )
                                                                                  .toFixed(
                                                                                      2
                                                                                  )
                                                                                  .replace(
                                                                                      /\B(?=(\d{3})+(?!\d))/g,
                                                                                      " "
                                                                                  )
                                                                                  .replace(
                                                                                      ".",
                                                                                      ","
                                                                                  )}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                    <div className="float-end">
                                        <button
                                            onClick={() =>
                                                exportTableData(
                                                    "main-table-releve-USD"
                                                )
                                            }
                                            className="btn btn-success"
                                            style={{ borderRadius: "0px" }}
                                        >
                                            <i class="fas fa-file-excel"></i>{" "}
                                            Exporter en Excel
                                        </button>{" "}
                                        <button
                                            className="btn btn-primary"
                                            style={{ borderRadius: "0px" }}
                                            onClick={exportToPDFUSD}
                                        >
                                            {" "}
                                            <i class="fas fa-file-pdf"></i>{" "}
                                            Exporter en PDF
                                        </button>
                                    </div>
                                </table>
                            )
                        ) : null}
                        {/* <div>
                    <h1>Export Data to Excel</h1>
                    <button onClick={exportToExcel}>Export to Excel</button>
                    <ExportCSV
                        csvData={getReleveData && getReleveData}
                        fileName={"my_data"}
                    /> //important one.
                    <button
                        onClick={() => exportTableData("main-table-releve-CDF")}
                    >
                        Export Table
                    </button>
                </div> */}
                        {/* <ExportCSV
                    csvData={getReleveData && getReleveData}
                    fileName={"my_data"}
                /> */}
                    </div>
                </div>
            )}
        </>
    );
};

export default Releve;
