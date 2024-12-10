import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./HeaderReport";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";

const Echeancier = () => {
    const [loading, setloading] = useState(false);
    const [error, setError] = useState([]);
    const [fetchEcheancier, setfetchEcheancier] = useState();
    const [fetchTableauAmortiss, setfetchTableauAmortiss] = useState();
    const [fetchSommeInteret, setfetchSommeInteret] = useState();
    const [fetchSommeInteretAmmo, setfetchSommeInteretAmmo] = useState();
    const [fetchSoldeEncourCDF, setfetchSoldeEncourCDF] = useState();
    const [fetchSoldeEncourUSD, setfetchSoldeEncourUSD] = useState();
    const [fetchTotCapRetardCDF, setfetchTotCapRetardCDF] = useState();
    const [fetchTotCapRetardUSD, setfetchTotCapRetardUSD] = useState();
    const [fetchBalanceAgee, setfetchBalanceAgee] = useState();
    const [searched_num_dossier, setsearched_num_dossier] = useState();

    const [accountName, setAccountName] = useState();
    const [fetchCapitalRestant, setfetchCapitalRestant] = useState();
    const [fetchCapitalRetard, setfetchCapitalRetard] = useState();
    const [fetchInteretRetard, setfetchInteretRetard] = useState();
    const [fetchCapitalRembourse, setfetchCapitalRembourse] = useState();
    const [fetchInteretRembourse, setfetchInteretRembourse] = useState();
    const [fetchInteretRestant, setfetchInteretRestant] = useState();
    const [radioValue, setRadioValue] = useState("");
    const [selectedDate, setSelectedDate] = useState("");
    const [devise, setdevise] = useState();
    const [fetchAgentCredit, setFetchAgentCredit] = useState();
    const [agent_credit_name, setagent_credit_name] = useState();

    useEffect(() => {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0, donc ajoutez 1
        const day = String(today.getDate()).padStart(2, "0");
        setSelectedDate(`${year}-${month}-${day}`);
        setTimeout(() => {
            getAgentCredit();
        }, 2000);
    }, []); // Le tableau vide [] signifie que cet effet s'exécute une seule fois après le premier rendu

    const getAgentCredit = async () => {
        const res = await axios.get(
            "/eco/page/rapport/get-echeancier/agent-credit"
        );
        if (res.data.status == 1) {
            setFetchAgentCredit(res.data.get_agent_credit);
            console.log(fetchAgentCredit);
        }
    };

    //GET SEACHED DATA
    const getSeachedData = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post(
            "/eco/page/montage-credit/get-echeancier",
            {
                searched_num_dossier: searched_num_dossier,
                radioValue,
                selectedDate,
                devise,
                agent_credit_name,
            }
        );
        if (res.data.status == 1) {
            setloading(false);
            setfetchEcheancier(res.data.data);
            setfetchSommeInteret(res.data.sommeInteret);
            setfetchTableauAmortiss(res.data.data_ammortissement);
            setfetchSommeInteretAmmo(res.data.sommeInteret_ammort);
            setAccountName(res.data.NomCompte);
            setfetchCapitalRestant(res.data.soldeRestant);
            setfetchCapitalRetard(res.data.soldeEnRetard);
            setfetchInteretRetard(res.data.soldeEnRetard);
            setfetchCapitalRembourse(res.data.capitalRembourse);
            setfetchInteretRembourse(res.data.interetRembourse);
            setfetchInteretRestant(res.data.interetRestant);

            //BALANCE AGEE

            setfetchBalanceAgee(res.data.data_balance_agee);
            setfetchSoldeEncourCDF(res.data.soldeEncourCDF);
            setfetchSoldeEncourUSD(res.data.soldeEncourUSD);
            setfetchTotCapRetardCDF(res.data.totRetardCDF);
            setfetchTotCapRetardUSD(res.data.totRetardUSD);
            //console.log(fetchSoldeEncourUSD.SoldeEncoursUSD);
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
    const handleRadioChange = (event) => {
        setRadioValue(event.target.value);
    };
    let compteur = 1;
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
    //PERMET DE FORMATER LES CHIFFRES
    const numberFormat = (number = 0) => {
        let locales = [
            //undefined,  // Your own browser
            "en-US", // United States
            //'de-DE',    // Germany
            //'ru-RU',    // Russia
            //'hi-IN',    // India
        ];
        let opts = { minimumFractionDigits: 2 };
        let index = 3;
        let nombre = number.toLocaleString(locales[index], opts);
        if (nombre === isNaN) {
            nombre = 0.0;
        } else {
            return nombre;
        }
    };

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

    const exportToPDFEcheancier = () => {
        const content = document.getElementById(
            "content-to-download-echeancier"
        );

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 3 }).then((canvas) => {
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
            const imgData = newCanvas.toDataURL("image/png");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.autoPrint();
            window.open(pdf.output("bloburl"), "_blank");
            // pdf.save("releve-de-compte.pdf");
        });
    };

    const exportToPDFBalanceAgee = () => {
        const content = document.getElementById(
            "content-to-download-balance_agee"
        );

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

    const exportToPDFAmmortiss = () => {
        const content = document.getElementById(
            "content-to-download-ammortissemment"
        );

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 3 }).then((canvas) => {
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
            const imgData = newCanvas.toDataURL("image/png");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.autoPrint();
            window.open(pdf.output("bloburl"), "_blank");
            // pdf.save("releve-de-compte.pdf");
        });
    };

    function numberWithSpaces(x = 0) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    const groupByTranches = (data) => {
        const groupedData = {
            "Crédits sains": [],
            "En retard de 1 à 30 jrs": [],
            "En retard de 31 à 60 jours": [],
            "En retard de 61 à 90 jours": [],
            "En retard de 91 à 180 jours": [],
            "En retard de plus de 180 jours": [],
        };

        fetchBalanceAgee &&
            fetchBalanceAgee.forEach((item) => {
                if (item.NbrJrRetard <= 0 || item.NbrJrRetard === null) {
                    groupedData["Crédits sains"].push(item);
                } else if (item.NbrJrRetard >= 1 && item.NbrJrRetard <= 30) {
                    groupedData["En retard de 1 à 30 jrs"].push(item);
                } else if (item.NbrJrRetard >= 31 && item.NbrJrRetard <= 60) {
                    groupedData["En retard de 31 à 60 jours"].push(item);
                } else if (item.NbrJrRetard >= 61 && item.NbrJrRetard <= 90) {
                    groupedData["En retard de 61 à 90 jours"].push(item);
                } else if (item.NbrJrRetard >= 91 && item.NbrJrRetard <= 180) {
                    groupedData["En retard de 91 à 180 jours"].push(item);
                } else if (item.NbrJrRetard > 180) {
                    groupedData["En retard de plus de 180 jours"].push(item);
                }
            });

        return groupedData;
    };
    const groupedData = groupByTranches(fetchBalanceAgee);
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
                        <h5 className="text-bold p-1">Echeancier</h5>
                    </div>{" "}
                </div>
            </div>
            <div className="row mt-3">
                <div
                    className="col-md-8 card rounded-0 p-3"
                    style={{ marginRight: "3px" }}
                >
                    <div className="col-md-6">
                        <form action="">
                            <fieldset className="border p-2">
                                <legend
                                    className="float-none w-auto p-0"
                                    style={{ fontSize: "15px" }}
                                >
                                    Type rapport
                                </legend>
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <label
                                                    class="form-check-label mr-1"
                                                    for="compte_to_search"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Num dossier{" "}
                                                </label>{" "}
                                                <br />
                                                <input
                                                    id="compte_to_search"
                                                    name="compte_to_search"
                                                    type="text"
                                                    placeholder="Num Dossier"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid teal"}`,
                                                        marginBottom: "5px",
                                                        width: "100px",
                                                    }}
                                                    onChange={(e) => {
                                                        setsearched_num_dossier(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        type="radio"
                                                        class="form-check-input"
                                                        id="echeancier_"
                                                        name="echeancier"
                                                        value="echeancier"
                                                        checked={
                                                            radioValue ===
                                                            "echeancier"
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="echeancier_"
                                                        style={{
                                                            fontSize: "15px",
                                                            color: "steelblue",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Echéancier
                                                    </label>
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        type="radio"
                                                        class="form-check-input"
                                                        id="tableau_ammortiss"
                                                        name="tableau_ammortiss"
                                                        value="tableau_ammortiss"
                                                        checked={
                                                            radioValue ===
                                                            "tableau_ammortiss"
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="tableau_ammortiss"
                                                        style={{
                                                            fontSize: "15px",
                                                            color: "steelblue",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Tableau d'amortisemment
                                                    </label>{" "}
                                                </div>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <div class="form-check">
                                                    <input
                                                        type="radio"
                                                        class="form-check-input"
                                                        id="balance_agee"
                                                        name="balance_agee"
                                                        value="balance_agee"
                                                        checked={
                                                            radioValue ===
                                                            "balance_agee"
                                                        }
                                                        onChange={
                                                            handleRadioChange
                                                        }
                                                    />
                                                    <label
                                                        class="form-check-label"
                                                        for="balance_agee"
                                                        style={{
                                                            fontSize: "15px",
                                                            color: "steelblue",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        Balance agée
                                                    </label>{" "}
                                                </div>
                                            </td>
                                        </tr>
                                        {radioValue == "balance_agee" && (
                                            <>
                                                <tr>
                                                    <td>
                                                        <label
                                                            class="form-check-label"
                                                            for="date_balance_agee"
                                                            style={{
                                                                fontSize:
                                                                    "15px",
                                                                color: "steelblue",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Date
                                                        </label>
                                                        <br />
                                                        <input
                                                            type="date"
                                                            name="date_balance_agee"
                                                            style={{
                                                                padding: "1px ",
                                                                border: `${"1px solid teal"}`,
                                                                marginBottom:
                                                                    "5px",
                                                            }}
                                                            onChange={(e) => {
                                                                setdate_balance_agee(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={selectedDate}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <select
                                                            name="devise"
                                                            id="devise"
                                                            style={{
                                                                padding: "1px ",
                                                                border: `${"1px solid teal"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "100px",
                                                            }}
                                                            onChange={(e) => {
                                                                setdevise(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Dévise
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
                                                            class="form-check-label"
                                                            for="agent_credit_name"
                                                            style={{
                                                                fontSize:
                                                                    "15px",
                                                                color: "steelblue",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                        >
                                                            Agent de crédit
                                                        </label>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <select
                                                            name="agent_credit_name"
                                                            id="agent_credit_name"
                                                            style={{
                                                                padding: "1px ",
                                                                border: `${"1px solid teal"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "100px",
                                                            }}
                                                            onChange={(e) => {
                                                                setagent_credit_name(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        >
                                                            <option value="">
                                                                Tous
                                                            </option>
                                                            {fetchAgentCredit &&
                                                                fetchAgentCredit.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <>
                                                                                <option
                                                                                    key={
                                                                                        index
                                                                                    }
                                                                                    value={
                                                                                        res.name
                                                                                    }
                                                                                >
                                                                                    {
                                                                                        res.name
                                                                                    }
                                                                                </option>
                                                                            </>
                                                                        );
                                                                    }
                                                                )}
                                                        </select>
                                                    </td>
                                                </tr>
                                            </>
                                        )}
                                        <tr>
                                            <td>
                                                {radioValue && (
                                                    <button
                                                        className="btn btn-primary rounded-10 mt-1 p-1 "
                                                        style={{
                                                            padding: "2px",
                                                            marginTop: "-5px",
                                                        }}
                                                        onClick={getSeachedData}
                                                    >
                                                        <i
                                                            className={`${
                                                                loading
                                                                    ? "spinner-border spinner-border-sm"
                                                                    : " fas fa-desktop"
                                                            }`}
                                                        ></i>
                                                        Afficher{" "}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>
            <p
                className="border border-10"
                style={{
                    background: "#dcdcdc",
                    padding: "1px",
                }}
            ></p>
            {fetchEcheancier &&
                radioValue == "echeancier" &&
                fetchEcheancier.length != 0 && (
                    <table
                        id="main-table-echeancier"
                        style={{ border: "0px", width: "100%" }}
                    >
                        <div
                            id="content-to-download-echeancier"
                            style={{
                                width: "90%",
                                margin: "0px auto",
                            }}
                        >
                            <div className="row">
                                <div className="row" id="printmeEcheancier">
                                    <div
                                        className="card"
                                        style={{
                                            margin: "0 auto",
                                            width: "90%",
                                        }}
                                    >
                                        <div
                                            style={{
                                                margin: "0 auto",
                                                width: "90%",
                                            }}
                                        >
                                            {" "}
                                            <br />
                                            <br />
                                            <EnteteRapport />
                                        </div>
                                        <div
                                            className="row title-echeancier"
                                            style={{
                                                margin: "0px auto",
                                                marginTop: "50px",
                                            }}
                                        >
                                            {" "}
                                            <h4
                                                style={{
                                                    background: "#000",
                                                    padding: "5px",
                                                    color: "#fff",
                                                    border: "2px solid teal",
                                                }}
                                            >
                                                ECHEANCIER DE REMBOURSEMENT N°{" "}
                                                {searched_num_dossier}
                                            </h4>{" "}
                                        </div>
                                        <div
                                            class="card-body"
                                            style={{
                                                marginLeft: "50px",
                                                marginRight: "50px",
                                                marginTop: "50px",
                                            }}
                                        >
                                            <div
                                                className="row entente-container"
                                                style={{
                                                    width: "100%",
                                                    margin: "0px auto",
                                                    background: "#fff",
                                                    padding: "5px",
                                                    color: "#000",
                                                    border: "3px solid teal",
                                                    borderRadius: "10px",
                                                }}
                                            >
                                                <div className="col-md-4">
                                                    <table
                                                    // className="myhead-table"
                                                    >
                                                        <tr>
                                                            <td>Intitulé :</td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .NomCompte
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                C. epargne :
                                                            </td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .NumCompteEpargne
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                Type crédit :
                                                            </td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .RefProduitCredit
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Durée :</td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .Duree
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>Montant :</td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .MontantAccorde
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                N° Dossier :
                                                            </td>
                                                            <td>
                                                                {
                                                                    searched_num_dossier
                                                                }
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </div>

                                                <div className="col-md-4">
                                                    <table
                                                    // className="myhead-table"
                                                    >
                                                        {/* <tr>
                                                <td>N° Crédit :</td>
                                                <td>
                                                    {
                                                        fetchEcheancier[0]
                                                            .NumDemande
                                                    }
                                                </td>
                                            </tr> */}
                                                        <tr>
                                                            <td>
                                                                Date octroi :
                                                            </td>

                                                            <td>
                                                                {dateParser(
                                                                    fetchEcheancier[0]
                                                                        .DateOctroi
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>C. crédit :</td>
                                                            <td>
                                                                {
                                                                    fetchEcheancier[0]
                                                                        .NumCompteCredit
                                                                }
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                Total intérêt :
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    parseInt(
                                                                        fetchSommeInteret.sommeInteret
                                                                    )
                                                                    // +
                                                                    //     parseInt(
                                                                    //         this
                                                                    //             .state
                                                                    //             .fetchEcheancier[0]
                                                                    //             .InteretPrecompte
                                                                    //     )
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                Total Capital :
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    fetchEcheancier[0]
                                                                        .MontantAccorde
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                Total à payer :
                                                            </td>
                                                            <td
                                                                style={{
                                                                    background:
                                                                        "green",
                                                                    fontSize:
                                                                        "20px",
                                                                }}
                                                            >
                                                                {numberFormat(
                                                                    // parseInt(
                                                                    //     this
                                                                    //         .state
                                                                    //         .fetchEcheancier[0]
                                                                    //         .InteretPrecompte
                                                                    // ) +
                                                                    parseFloat(
                                                                        fetchEcheancier[0]
                                                                            .MontantAccorde
                                                                    ) +
                                                                        parseFloat(
                                                                            fetchSommeInteret.sommeInteret
                                                                        )
                                                                )}
                                                            </td>
                                                        </tr>

                                                        {/* <tr>
                                                                    <td>
                                                                        Intérêt
                                                                        prec.
                                                                    </td>
                                                                    <td>
                                                                        {parseInt(
                                                                            fetchEcheancier[0]
                                                                                .InteretPrecompte
                                                                        )}
                                                                    </td>
                                                                </tr> */}
                                                    </table>
                                                </div>
                                            </div>

                                            <table
                                                className="table tableStyle table-bordered table-striped"
                                                style={{
                                                    padding: "5px",
                                                    width: "100%",
                                                    color: "#000",
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th scope="col">N°</th>
                                                        <th scope="col">
                                                            Date D'échéance
                                                        </th>
                                                        <th scope="col">
                                                            Capital
                                                        </th>
                                                        <th scope="col">
                                                            Intêret
                                                        </th>
                                                        <th scope="col">
                                                            C. Ammorti
                                                        </th>
                                                        <th scope="col">
                                                            Tot à payer
                                                        </th>
                                                        <th scope="col">
                                                            C. restant dû
                                                        </th>
                                                        <th scope="col">
                                                            Epargne
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {fetchEcheancier.map(
                                                        (res, index) => {
                                                            return (
                                                                <tr key={index}>
                                                                    {/* <th scope="row">1</th> */}
                                                                    <td>
                                                                        {
                                                                            compteur++
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {dateParser(
                                                                            res.DateTranch
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.Capital
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.Interet
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.CapAmmorti
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.TotalAp
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.Cumul
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                    <td>
                                                                        {" "}
                                                                        {numberFormat(
                                                                            parseInt(
                                                                                res.Epargne
                                                                            )
                                                                        )}{" "}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div
                                            className="row signature-container"
                                            style={{
                                                margin: "0 auto",
                                                width: "90%",
                                                marginTop: "100px",
                                            }}
                                        >
                                            <div className="col-md-8">
                                                <p>Signature client</p>
                                            </div>
                                            <div className="col-md-4 signature-container">
                                                <p
                                                    style={{
                                                        float: "right",
                                                    }}
                                                >
                                                    Signature agent de crédit
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="float-end mt-2"
                            style={{ marginRight: "130px" }}
                        >
                            <button
                                onClick={() =>
                                    exportTableData("main-table-echeancier")
                                }
                                className="btn btn-success"
                                style={{
                                    borderRadius: "0px",
                                }}
                            >
                                <i class="fas fa-file-excel"></i> Exporter en
                                Excel
                            </button>{" "}
                            <button
                                className="btn btn-primary"
                                style={{
                                    borderRadius: "0px",
                                }}
                                onClick={exportToPDFEcheancier}
                            >
                                {" "}
                                <i class="fas fa-file-pdf"></i> Exporter en PDF
                            </button>
                        </div>
                    </table>
                )}
            <br />
            {fetchTableauAmortiss &&
                radioValue == "tableau_ammortiss" &&
                fetchTableauAmortiss.length != 0 && (
                    <table
                        id="main-table-ammortissemment"
                        style={{ border: "0px", width: "100%" }}
                    >
                        <div
                            id="content-to-download-ammortissemment"
                            style={{
                                width: "90%",
                                margin: "0px auto",
                            }}
                        >
                            <div className="row" id="print-tableau-ammortis">
                                <div
                                    className="card"
                                    style={{
                                        margin: "5px",
                                        width: "100%",
                                    }}
                                >
                                    <div
                                        style={{
                                            margin: "0 auto",
                                            width: "90%",
                                        }}
                                    >
                                        {" "}
                                        <br />
                                        <br />
                                        <EnteteRapport />
                                    </div>
                                    <div
                                        className="row title-echeancier"
                                        style={{
                                            margin: "0px auto",
                                            marginTop: "50px",
                                        }}
                                    >
                                        {" "}
                                        <h4
                                            style={{
                                                background: "#000",
                                                padding: "5px",
                                                color: "#fff",
                                                border: "2px solid teal",
                                            }}
                                        >
                                            TABLEAU D'AMMORTISSEMENT DE CREDIT
                                            N° {searched_num_dossier}
                                        </h4>
                                    </div>

                                    <div
                                        class="card-body"
                                        style={{
                                            marginLeft: "1px",
                                            marginRight: "5px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        <div
                                            className="row m-0 entente-container"
                                            style={{
                                                width: "100%",
                                                margin: "0px auto",
                                                background: "#fff",
                                                padding: "5px",
                                                color: "#000",
                                                border: "3px solid teal",
                                                borderRadius: "10px",
                                            }}
                                        >
                                            <div className="col-md-3">
                                                <table>
                                                    <tr>
                                                        <td>Type crédit :</td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .RefProduitCredit
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>N° COMPTE :</td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .NumCompteEpargne
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Intutilé :</td>
                                                        <td>
                                                            {accountName &&
                                                                accountName.NomCompte}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Mode remb. : </td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .ModeRemboursement
                                                            }
                                                        </td>
                                                    </tr>

                                                    <tr>
                                                        <td>Mode remb. : </td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .ModeRemboursement
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Gestionnaire :</td>
                                                        <td>
                                                            {accountName &&
                                                                accountName.Gestionnaire}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div className="col-md-3">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            Durée en jour :{" "}
                                                        </td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .Duree
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Nbre tranche : </td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .NbrTranche
                                                            }
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Date Octroi :</td>
                                                        <td>
                                                            {" "}
                                                            {dateParser(
                                                                fetchTableauAmortiss[0]
                                                                    .DateOctroi
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>Date Echéance :</td>
                                                        <td>
                                                            {" "}
                                                            {dateParser(
                                                                fetchTableauAmortiss[0]
                                                                    .DateTombeEcheance
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>NumDossier :</td>
                                                        <td>
                                                            {
                                                                fetchTableauAmortiss[0]
                                                                    .NumDossier
                                                            }
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                            <div className="col-md-3">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            Type Mensualité :
                                                        </td>
                                                        <td>
                                                            <td>
                                                                {" "}
                                                                {
                                                                    fetchTableauAmortiss[0]
                                                                        .ModeRemboursement
                                                                }
                                                            </td>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Taux d'intérêt :
                                                        </td>
                                                        <td>
                                                            <td>
                                                                {" "}
                                                                {
                                                                    fetchTableauAmortiss[0]
                                                                        .TauxInteret
                                                                }
                                                            </td>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Intérêt remboursé :
                                                        </td>
                                                        <td>
                                                            <td>
                                                                {" "}
                                                                {fetchInteretRembourse &&
                                                                    numberFormat(
                                                                        fetchInteretRembourse.intereRembourse.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </td>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Intérêt Restant :
                                                        </td>
                                                        {
                                                            <td>
                                                                {fetchInteretRestant &&
                                                                    fetchInteretRestant.intereRestant.toFixed(
                                                                        2
                                                                    )}
                                                            </td>
                                                        }
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Intérêt en Retard :
                                                        </td>
                                                        {numberFormat(
                                                            fetchInteretRetard &&
                                                                fetchInteretRetard
                                                                ? fetchInteretRetard.sommeInteretRetard.toFixed(
                                                                      2
                                                                  )
                                                                : "0.00"
                                                        )}
                                                    </tr>
                                                </table>
                                            </div>
                                            <div className="col-md-3">
                                                <table>
                                                    <tr>
                                                        <td>
                                                            Montant Accordé :
                                                        </td>

                                                        <td>
                                                            {numberFormat(
                                                                parseInt(
                                                                    fetchTableauAmortiss[0]
                                                                        .MontantAccorde
                                                                )
                                                            )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Capital Remboursé :
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            {isNaN(
                                                                parseInt(
                                                                    fetchCapitalRembourse
                                                                )
                                                            )
                                                                ? "0.00"
                                                                : numberFormat(
                                                                      fetchCapitalRembourse.toFixed(
                                                                          2
                                                                      )
                                                                  )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Capital Restant dû :
                                                        </td>
                                                        <td>
                                                            {isNaN(
                                                                parseInt(
                                                                    fetchCapitalRestant
                                                                )
                                                            )
                                                                ? "0.00"
                                                                : numberFormat(
                                                                      fetchCapitalRestant
                                                                  )}
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td>
                                                            Capital en Retard :
                                                        </td>
                                                        {numberFormat(
                                                            fetchCapitalRetard &&
                                                                fetchCapitalRetard
                                                                ? fetchCapitalRetard.sommeCapitalRetard.toFixed(
                                                                      2
                                                                  )
                                                                : "0.00"
                                                        )}
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>
                                        <table
                                            className="table tableStyle table-bordered"
                                            style={{
                                                padding: "5px",
                                                color: "#000",
                                            }}
                                        >
                                            <tr>
                                                <td rowspan="2">N°</td>
                                                <td rowspan="2">
                                                    Date Tranche
                                                </td>
                                                <td colspan="4">
                                                    ECHEANCIER PREVISIONNEL
                                                </td>
                                                <td colspan="3">
                                                    REMBOURS. EFFECTIFS
                                                </td>
                                                <td colspan="3">
                                                    REMBOURS. EN RETARD
                                                </td>
                                                <td rowspan="2">
                                                    TOT. EN RETARD
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>Capital</td>
                                                <td>Intérêt</td>
                                                <td>Epargne</td>
                                                <td>Pénalités</td>
                                                <td>Capital</td>
                                                <td>Intérêt</td>
                                                <td>Epargne</td>
                                                <td>Capital</td>
                                                <td>Intérêt</td>
                                                <td>Epargne</td>
                                            </tr>

                                            {fetchTableauAmortiss.map(
                                                (res, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {compteur++}
                                                            </td>
                                                            <td>
                                                                {" "}
                                                                {dateParser(
                                                                    res.DateTranch
                                                                )}{" "}
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    parseInt(
                                                                        res.CapAmmorti
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    parseInt(
                                                                        res.Interet
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    parseInt(
                                                                        res.Epargne
                                                                    )
                                                                )}
                                                            </td>
                                                            <td>
                                                                {numberFormat(
                                                                    parseInt(
                                                                        res.Penalite
                                                                    )
                                                                )}
                                                            </td>

                                                            {parseInt(
                                                                res.CapitalPaye
                                                            ) > 0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "green",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.CapitalPaye
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.CapitalPaye
                                                                              )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {isNaN(
                                                                        numberFormat(
                                                                            parseInt(
                                                                                res.CapitalPaye
                                                                            )
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.CapitalPaye
                                                                              )
                                                                          )}
                                                                </td>
                                                            )}
                                                            {parseInt(
                                                                res.InteretPaye
                                                            ) > 0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "green",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.InteretPaye
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.InteretPaye
                                                                              )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.InteretPaye
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : parseInt(
                                                                              res.InteretPaye
                                                                          )}
                                                                </td>
                                                            )}
                                                            {parseInt(
                                                                res.EpargnePaye
                                                            ) > 0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "green",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.EpargnePaye
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.EpargnePaye
                                                                              )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.EpargnePaye
                                                                        )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.EpargnePaye
                                                                              )
                                                                          )}
                                                                </td>
                                                            )}
                                                            {parseInt(
                                                                res.CapAmmorti
                                                            ) -
                                                                parseInt(
                                                                    res.CapitalPaye
                                                                ) >
                                                            0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "red",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.CapAmmorti
                                                                        ) -
                                                                            parseInt(
                                                                                res.CapitalPaye
                                                                            )
                                                                    )
                                                                        ? " 0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.CapAmmorti
                                                                              ) -
                                                                                  parseInt(
                                                                                      res.CapitalPaye
                                                                                  )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {"0.00"}
                                                                </td>
                                                            )}
                                                            {parseInt(
                                                                res.Interet
                                                            ) -
                                                                parseInt(
                                                                    res.InteretPaye
                                                                ) >
                                                            0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "red",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.Interet
                                                                        ) -
                                                                            parseInt(
                                                                                res.InteretPaye
                                                                            )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.Interet
                                                                              ) -
                                                                                  parseInt(
                                                                                      res.InteretPaye
                                                                                  )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {"0.00"}
                                                                </td>
                                                            )}

                                                            {parseInt(
                                                                res.Epargne
                                                            ) -
                                                                parseInt(
                                                                    res.EpargnePaye
                                                                ) >
                                                            0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "red",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.Epargne
                                                                        ) -
                                                                            parseInt(
                                                                                res.EpargnePaye
                                                                            )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.Epargne
                                                                              ) -
                                                                                  parseInt(
                                                                                      res.EpargnePaye
                                                                                  )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {"0.00"}
                                                                </td>
                                                            )}

                                                            {parseInt(
                                                                res.CapAmmorti
                                                            ) -
                                                                parseInt(
                                                                    res.CapitalPaye
                                                                ) +
                                                                parseInt(
                                                                    res.Interet
                                                                ) -
                                                                parseInt(
                                                                    res.InteretPaye
                                                                ) +
                                                                parseInt(
                                                                    res.Epargne
                                                                ) -
                                                                parseInt(
                                                                    res.EpargnePaye
                                                                ) >
                                                            0 ? (
                                                                <td
                                                                    style={{
                                                                        background:
                                                                            "red",
                                                                        color: "#fff",
                                                                    }}
                                                                >
                                                                    {isNaN(
                                                                        parseInt(
                                                                            res.CapAmmorti
                                                                        ) -
                                                                            parseInt(
                                                                                res.CapitalPaye
                                                                            ) +
                                                                            parseInt(
                                                                                res.Interet
                                                                            ) -
                                                                            parseInt(
                                                                                res.InteretPaye
                                                                            ) +
                                                                            parseInt(
                                                                                res.Epargne
                                                                            ) -
                                                                            parseInt(
                                                                                res.EpargnePaye
                                                                            )
                                                                    )
                                                                        ? "0.00"
                                                                        : numberFormat(
                                                                              parseInt(
                                                                                  res.CapAmmorti
                                                                              ) -
                                                                                  parseInt(
                                                                                      res.CapitalPaye
                                                                                  ) +
                                                                                  parseInt(
                                                                                      res.Interet
                                                                                  ) -
                                                                                  parseInt(
                                                                                      res.InteretPaye
                                                                                  ) +
                                                                                  parseInt(
                                                                                      res.Epargne
                                                                                  ) -
                                                                                  parseInt(
                                                                                      res.EpargnePaye
                                                                                  )
                                                                          )}
                                                                </td>
                                                            ) : (
                                                                <td>
                                                                    {"0.00"}
                                                                </td>
                                                            )}
                                                        </tr>
                                                    );
                                                }
                                            )}
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="float-end mt-2">
                            <button
                                onClick={() =>
                                    exportTableData(
                                        "main-table-ammortissemment"
                                    )
                                }
                                className="btn btn-success"
                                style={{ borderRadius: "0px" }}
                            >
                                <i class="fas fa-file-excel"></i> Exporter en
                                Excel
                            </button>{" "}
                            <button
                                className="btn btn-primary"
                                style={{ borderRadius: "0px" }}
                                onClick={exportToPDFAmmortiss}
                            >
                                {" "}
                                <i class="fas fa-file-pdf"></i> Exporter en PDF
                            </button>
                        </div>
                    </table>
                )}
            <br /> <br /> <br />
            {/* BALANCE AGEE */}
            {fetchBalanceAgee &&
                fetchBalanceAgee.length != 0 &&
                radioValue == "balance_agee" && (
                    <>
                        <table
                            id="main-table-balance_agee"
                            style={{ border: "0px", width: "100%" }}
                        >
                            <div
                                id="content-to-download-balance_agee"
                                style={{
                                    width: "90%",
                                    margin: "0px auto",
                                }}
                            >
                                <div
                                    className="row card"
                                    id="print-tableau-ammortis"
                                >
                                    <div
                                        class="card-body"
                                        style={{
                                            marginLeft: "1px",
                                            marginRight: "5px",
                                            marginTop: "5px",
                                        }}
                                    >
                                        <div
                                            className="card"
                                            style={{
                                                margin: "5px",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    margin: "0 auto",
                                                    width: "90%",
                                                }}
                                            >
                                                {" "}
                                                <br />
                                                <br />
                                                <EnteteRapport />
                                            </div>
                                            <div
                                                className="row title-echeancier"
                                                style={{
                                                    margin: "0px auto",
                                                    marginTop: "50px",
                                                }}
                                            >
                                                {" "}
                                                <h4
                                                    style={{
                                                        background: "#000",
                                                        padding: "5px",
                                                        color: "#fff",
                                                        border: "2px solid teal",
                                                    }}
                                                >
                                                    BALANCE AGEE EN {devise}{" "}
                                                    AFFICHEE EN DATE DU{" "}
                                                    {dateParser(new Date())}
                                                </h4>{" "}
                                            </div>
                                        </div>
                                        <table
                                            className="table-dark table-bordered table-stipped"
                                            style={{
                                                background: "#fff",
                                                padding: "5px",
                                                color: "#000",
                                                width: "100%",
                                            }}
                                        >
                                            <thead
                                                style={{
                                                    background: "#000",
                                                    color: "#fff",
                                                }}
                                            >
                                                <tr>
                                                    <td rowspan="2">N°</td>
                                                    <td rowspan="2">
                                                        NumDossier
                                                    </td>
                                                    <td rowspan="2">Num</td>
                                                    <td rowspan="2">
                                                        NomCompte
                                                    </td>
                                                    <td rowspan="2">Durée</td>
                                                    <td rowspan="2">
                                                        DateOctroi
                                                    </td>
                                                    <td rowspan="2">
                                                        Echéance
                                                    </td>
                                                    <td rowspan="2">Accordé</td>
                                                    <td colspan="2">
                                                        Remboursé
                                                    </td>
                                                    <td colspan="2">
                                                        Restant dû
                                                    </td>
                                                    <td colspan="5">
                                                        En retard En Jours
                                                    </td>
                                                    {/* <td rowspan="2">
                                                            Epargne
                                                        </td>
                                                        <td rowspan="2">
                                                            Date Retard
                                                        </td> */}
                                                    <td rowspan="2">
                                                        Jour de Retard
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>Capital</td>
                                                    {/* <td>Intérêt</td> */}
                                                    <td>Intérêt</td>
                                                    <td>Capital</td>
                                                    <td>Intérêt</td>
                                                    {/* <td>Intéret</td> */}
                                                    <td>1 à 30</td>
                                                    <td>31 à 60</td>
                                                    <td>61 à 90</td>
                                                    <td>91 à 180</td>
                                                    <td>Plus de 180</td>
                                                </tr>
                                            </thead>

                                            <tbody>
                                                {Object.entries(
                                                    groupedData
                                                ).map(([tranche, items]) => (
                                                    <React.Fragment
                                                        key={tranche}
                                                    >
                                                        {items.length > 0 && (
                                                            <>
                                                                <tr>
                                                                    <td
                                                                        style={{
                                                                            background:
                                                                                "#444",
                                                                            color: "#fff",
                                                                        }}
                                                                        colSpan="20"
                                                                    >
                                                                        <strong>
                                                                            {
                                                                                tranche
                                                                            }
                                                                        </strong>
                                                                    </td>
                                                                </tr>
                                                                {items.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => (
                                                                        <tr
                                                                            key={
                                                                                index
                                                                            }
                                                                        >
                                                                            <td>
                                                                                {
                                                                                    compteur++
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NumDossier
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NumCompteCredit
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.NomCompte
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.Duree
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {dateParser(
                                                                                    res.DateOctroi
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {dateParser(
                                                                                    res.DateEcheance
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {
                                                                                    res.MontantAccorde
                                                                                }
                                                                            </td>
                                                                            <td>
                                                                                {numberWithSpaces(
                                                                                    res.TotalCapitalRembourse.toFixed(
                                                                                        2
                                                                                    )
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {numberWithSpaces(
                                                                                    res.TotalInteretRembourse.toFixed(
                                                                                        2
                                                                                    )
                                                                                )}
                                                                            </td>
                                                                            <td>
                                                                                {res.CapitalRestant &&
                                                                                    numberWithSpaces(
                                                                                        res.CapitalRestant.toFixed(
                                                                                            2
                                                                                        )
                                                                                    )}
                                                                            </td>
                                                                            <td>
                                                                                {res.InteretRestant &&
                                                                                    numberWithSpaces(
                                                                                        res.InteretRestant.toFixed(
                                                                                            2
                                                                                        )
                                                                                    )}
                                                                            </td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td></td>
                                                                            <td>
                                                                                {
                                                                                    res.NbrJrRetard
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                    )
                                                                )}
                                                            </>
                                                        )}
                                                    </React.Fragment>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <br />
                                    <br />

                                    <div className="row">
                                        <div className="col-md-6">
                                            <p>
                                                {devise == "CDF" && (
                                                    <h4>
                                                        Encours global de crédit
                                                        CDF{" "}
                                                        <strong
                                                            style={{
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            {" "}
                                                            {fetchSoldeEncourCDF &&
                                                                fetchSoldeEncourCDF.SoldeEncoursCDF !==
                                                                    null &&
                                                                fetchSoldeEncourCDF &&
                                                                numberWithSpaces(
                                                                    fetchSoldeEncourCDF.SoldeEncoursCDF.toFixed(
                                                                        2
                                                                    )
                                                                )}{" "}
                                                        </strong>
                                                    </h4>
                                                )}

                                                {devise == "USD" && (
                                                    <h4>
                                                        Encours global de crédit
                                                        USD{" "}
                                                        <strong
                                                            style={{
                                                                background:
                                                                    "green",
                                                                color: "#fff",
                                                                padding: "5px",
                                                            }}
                                                        >
                                                            {" "}
                                                            {fetchSoldeEncourUSD &&
                                                            fetchSoldeEncourUSD.SoldeEncoursUSD !==
                                                                null &&
                                                            fetchSoldeEncourUSD
                                                                ? numberWithSpaces(
                                                                      fetchSoldeEncourUSD.SoldeEncoursUSD.toFixed(
                                                                          2
                                                                      )
                                                                  )
                                                                : "0.00"}
                                                        </strong>
                                                    </h4>
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    {devise === "CDF" && (
                                        <div className="row">
                                            <div className="col-md-3">
                                                <p
                                                    style={{
                                                        marginLeft: "20px",
                                                    }}
                                                >
                                                    <h4>
                                                        {" "}
                                                        Taux déliquence (PAR) ={" "}
                                                    </h4>
                                                </p>
                                            </div>
                                            <div className="col-md-5">
                                                <p>
                                                    <h4>
                                                        <span>
                                                            Restant dû de crédit
                                                            avec aumoins un
                                                            remboursement en
                                                            retard (39)
                                                            <br />{" "}
                                                            <hr
                                                                style={{
                                                                    border: "1px solid #000",
                                                                }}
                                                            />
                                                            <span>
                                                                Crédit
                                                                sain(30,31,32) +
                                                                Restant dû de
                                                                crédit avec
                                                                aumoins un
                                                                remboursement en
                                                                retard (39)
                                                            </span>
                                                        </span>
                                                    </h4>
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <p>
                                                    <h4>
                                                        x 100 ( {"<=5%"}) =
                                                        <span
                                                            style={{
                                                                background:
                                                                    "black",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            {numberWithSpaces(
                                                                fetchTotCapRetardCDF &&
                                                                    Math.abs(
                                                                        fetchTotCapRetardCDF.toFixed(
                                                                            2
                                                                        )
                                                                    )
                                                            )}
                                                            {" %"}
                                                        </span>
                                                    </h4>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {devise == "USD" && (
                                        <div className="row">
                                            <div className="col-md-3">
                                                <p
                                                    style={{
                                                        marginLeft: "20px",
                                                    }}
                                                >
                                                    <h4>
                                                        {" "}
                                                        Taux déliquence (PAR) ={" "}
                                                    </h4>
                                                </p>
                                            </div>
                                            <div className="col-md-5">
                                                <p>
                                                    <h4>
                                                        <span>
                                                            Restant dû de crédit
                                                            avec aumoins un
                                                            remboursement en
                                                            retard (39)
                                                            <br />{" "}
                                                            <hr
                                                                style={{
                                                                    border: "1px solid #000",
                                                                }}
                                                            />
                                                            <span>
                                                                Crédit
                                                                sain(30,31,32) +
                                                                Restant dû de
                                                                crédit avec
                                                                aumoins un
                                                                remboursement en
                                                                retard (39)
                                                            </span>
                                                        </span>
                                                    </h4>
                                                </p>
                                            </div>
                                            <div className="col-md-4">
                                                <p>
                                                    <h4>
                                                        x 100 ( {"<=5%"}) =
                                                        <span
                                                            style={{
                                                                background:
                                                                    "black",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            {numberWithSpaces(
                                                                fetchTotCapRetardUSD &&
                                                                    Math.abs(
                                                                        fetchTotCapRetardUSD.toFixed(
                                                                            2
                                                                        )
                                                                    )
                                                            )}

                                                            {" %"}
                                                        </span>
                                                    </h4>
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </table>

                        <div
                            className="float-end mt-2"
                            style={{ marginRight: "130px" }}
                        >
                            <button
                                onClick={() =>
                                    exportTableData("main-table-balance_agee")
                                }
                                className="btn btn-success"
                                style={{
                                    borderRadius: "0px",
                                }}
                            >
                                <i class="fas fa-file-excel"></i> Exporter en
                                Excel
                            </button>{" "}
                            <button
                                className="btn btn-primary"
                                style={{
                                    borderRadius: "0px",
                                }}
                                onClick={exportToPDFBalanceAgee}
                            >
                                {" "}
                                <i class="fas fa-file-pdf"></i> Exporter en PDF
                            </button>
                        </div>
                    </>
                )}
            <br />
            <br />
            <br />
        </div>
    );
};

export default Echeancier;
