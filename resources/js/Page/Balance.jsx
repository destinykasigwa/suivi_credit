import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./HeaderReport";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";

const Balance = () => {
    const [loading, setloading] = useState(false);
    const [date_debut_balance, setdate_debut_balance] = useState("");
    const [date_fin_balance, setdate_fin_balance] = useState("");
    const [radioValue, setRadioValue] = useState("type_balance");
    const [radioValue2, setRadioValue2] = useState("");
    const handleRadioChange = (event) => {
        setRadioValue(event.target.value);
    };
    const handleRadioChange2 = (event) => {
        setRadioValue2(event.target.value);
    };
    const [compte_balance_debut, setcompte_balance_debut] = useState("3301");
    const [compte_balance_fin, setcompte_balance_fin] = useState("3301");
    const [devise, setdevise] = useState();
    const [fetchData, setFetchData] = useState();
    const [fetchDataConverti, setFetchDataConverti] = useState();
    const [fetchDataNonConverti, setFetchDataNonConverti] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPage2, setCurrentPage2] = useState(1);

    useEffect(() => {
        //GET CURRENT DATE
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0, donc ajoutez 1
        const day = String(today.getDate()).padStart(2, "0");
        setdate_fin_balance(`${year}-${month}-${day}`);
        //GET FIRST DAY OF THE CURRENT MOTH

        // Obtenir la date actuelle
        const currentDate = new Date();
        const firstDay = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1
        );
        const year2 = firstDay.getFullYear();
        const month2 = String(firstDay.getMonth() + 1).padStart(2, "0"); // Ajout de 1 car les mois sont indexés à partir de 0
        const day2 = String(firstDay.getDate()).padStart(2, "0"); // Cela sera toujours '01' ici
        const formattedDate = `${year2}-${month2}-${day2}`;
        setdate_debut_balance(formattedDate);
        //console.log(date_debut_balance);
    }, []); // Le tableau vide [] signifie que cet effet s'exécute une seule fois après le premier rendu
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

    const AfficherBalance = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post(
            "/eco/pages/rapport/etat-financier/balance",
            {
                radioValue,
                radioValue2,
                date_debut_balance,
                date_fin_balance,
                devise,
                compte_balance_debut,
                compte_balance_fin,
            }
        );
        if (res.data.status == 1) {
            setloading(false);
            setFetchData(res.data.data);
            // setFetchDataConverti(res.data.data_converti);
            // setFetchDataNonConverti(res.data.data_non_converti);
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

    const itemsPerPage = 40;
    const totalPages = Math.ceil(fetchData && fetchData.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems =
        fetchData && fetchData.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= halfMaxPagesToShow) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + halfMaxPagesToShow >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - halfMaxPagesToShow;
            endPage = currentPage + halfMaxPagesToShow;
        }

        if (startPage > 1) {
            pageNumbers.push(
                <li key={1}>
                    <button onClick={() => handlePageChange(1)}>1</button>
                </li>
            );
            if (startPage > 2) {
                pageNumbers.push(<li key="start-ellipsis">...</li>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={i === currentPage ? "active" : ""}>
                    <button
                        style={
                            i === currentPage
                                ? selectedButtonStyle
                                : buttonStyle
                        }
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<li key="end-ellipsis">...</li>);
            }
            pageNumbers.push(
                <li key={totalPages}>
                    <button onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pageNumbers;
    };

    const exportTableData = (tableId) => {
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };

        const table = document.getElementById(tableId);
        const wb = XLSX.utils.table_to_book(table);
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
        const fileName = `table_${tableId}.xlsx`;
        saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            fileName
        );
    };
    const exportToPDF = () => {
        const content = document.getElementById("content-to-download-balance");

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
            // pdf.save("releve-de-compte.pdf");
        });
    };

    // const replaceCurrencyByCDF = (text) => {
    //     return text.replace(/EN USD/g, "EN CDF");
    // };

    // const replaceCurrencyByUSD = (text) => {
    //     return text.replace(/EN USD/g, "EN CDF");
    // };

    const paginationStyle = {
        listStyle: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "",
    };

    const buttonStylePrevNext = {
        padding: "2px 20px",
        backgroundColor: "steelblue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 5px",
    };
    const buttonStyle = {
        padding: "1px 5px",
        backgroundColor: "steelblue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 5px",
    };

    const selectedButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#FFC107", // Change color for selected button
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
                        <h5 className="text-bold p-1">Balance de comptes</h5>
                    </div>{" "}
                </div>
                <div className="row">
                    <div className="col-md-2 card">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Période
                                    </legend>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="date_debut_balance"
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Date Début
                                            </label>
                                            <br />
                                            <input
                                                type="date"
                                                name="date_debut_balance"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setdate_debut_balance(
                                                        e.target.value
                                                    );
                                                }}
                                                value={date_debut_balance}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="date_fin_balance"
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Date Fin
                                            </label>
                                            <br />
                                            <input
                                                type="date"
                                                name="date_fin_balance"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setdate_fin_balance(
                                                        e.target.value
                                                    );
                                                }}
                                                value={date_fin_balance}
                                            />
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-3 card">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Consolidation % à la monnaie
                                    </legend>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="type_balance"
                                                    name="type_balance"
                                                    value="type_balance"
                                                    checked={
                                                        radioValue ===
                                                        "type_balance"
                                                    }
                                                    onChange={handleRadioChange}
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="type_balance"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Balance uniquement en
                                                </label>{" "}
                                                <select
                                                    name="devise"
                                                    id="devise"
                                                    onChange={(e) =>
                                                        setdevise(
                                                            e.target.value
                                                        )
                                                    }
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
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="balance_convertie_cdf"
                                                    name="balance_convertie_cdf"
                                                    value="balance_convertie_cdf"
                                                    disabled
                                                    checked={
                                                        radioValue ===
                                                        "balance_convertie_cdf"
                                                    }
                                                    onChange={handleRadioChange}
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="balance_convertie_cdf"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Balance convertie en CDF
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
                                                    id="balance_convertie_usd"
                                                    name="balance_convertie_usd"
                                                    value="balance_convertie_usd"
                                                    disabled
                                                    checked={
                                                        radioValue ===
                                                        "balance_convertie_usd"
                                                    }
                                                    onChange={handleRadioChange}
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="balance_convertie_usd"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Balance convertie en USD
                                                </label>{" "}
                                            </div>
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-4 card">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Type compte
                                    </legend>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="porte_detaillee"
                                                    name="porte_detaillee"
                                                    value="porte_detaillee"
                                                    checked={
                                                        radioValue2 ===
                                                        "porte_detaillee"
                                                    }
                                                    onChange={
                                                        handleRadioChange2
                                                    }
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="porte_detaillee"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Détaillée
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
                                                    id="porte_groupee"
                                                    name="porte_groupee"
                                                    value="porte_groupee"
                                                    checked={
                                                        radioValue2 ===
                                                        "porte_groupee"
                                                    }
                                                    onChange={
                                                        handleRadioChange2
                                                    }
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="porte_groupee"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Groupée
                                                </label>{" "}
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="type_compte"
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Compte de
                                            </label>
                                            <input
                                                id="type_compte"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                    width: "80px",
                                                    height: "25px",
                                                }}
                                                type="text"
                                                name="compte_balance_debut"
                                                onChange={(e) =>
                                                    setcompte_balance_debut(
                                                        e.target.value
                                                    )
                                                }
                                                value={compte_balance_debut}
                                            />{" "}
                                            <label
                                                class="form-check-label"
                                                for="compte_balance_fin"
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                à
                                            </label>{" "}
                                            <input
                                                id="compte_balance_fin"
                                                name="compte_balance_fin"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                    width: "80px",
                                                    height: "25px",
                                                }}
                                                onChange={(e) =>
                                                    setcompte_balance_fin(
                                                        e.target.value
                                                    )
                                                }
                                                value={compte_balance_fin}
                                                type="text"
                                            />
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-2 card">
                        <table>
                            <tr>
                                <td>
                                    <button
                                        onClick={AfficherBalance}
                                        className="btn btn-primary rounded-10 mt-2"
                                    >
                                        {" "}
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
                    </div>
                </div>
            </div>
            {fetchData && fetchData.length != 0 && (
                <>
                    <table
                        id="main-table-balance"
                        style={{ border: "0px", width: "100%" }}
                    >
                        <div
                            id="content-to-download-balance"
                            style={{
                                width: "90%",
                                margin: "0px auto",
                            }}
                        >
                            <div className="row">
                                <table
                                    id="main-table-balance"
                                    style={{ border: "0px", width: "100%" }}
                                >
                                    <div
                                        id="content-to-download-balance"
                                        style={{
                                            width: "90%",
                                            margin: "0px auto",
                                        }}
                                    >
                                        <div
                                            className="row card"
                                            id="print-tableau-balance"
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
                                                                background:
                                                                    "#000",
                                                                padding: "5px",
                                                                color: "#fff",
                                                                border: "2px solid teal",
                                                            }}
                                                        >
                                                            BALANCE DES COMPTES{" "}
                                                            {radioValue ==
                                                                "type_balance" &&
                                                            devise == "USD"
                                                                ? "UNIQUEEMENT EN USD"
                                                                : radioValue ==
                                                                      "type_balance" &&
                                                                  devise ==
                                                                      "CDF"
                                                                ? "UNIQUEMENT EN CDF"
                                                                : radioValue ==
                                                                  "balance_convertie_cdf"
                                                                ? "CONVERTIE EN CDF"
                                                                : radioValue ==
                                                                  "balance_convertie_usd"
                                                                ? "CONVERTIE EN USD"
                                                                : ""}{" "}
                                                            AU{" "}
                                                            {dateParser(
                                                                new Date()
                                                            )}
                                                        </h4>{" "}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <table
                                            className="table table-bordered p-0"
                                            style={{
                                                background: "#fff",
                                                padding: "0px",
                                                color: "#000",
                                                width: "100%",
                                                fontSize: "14px",
                                            }}
                                        >
                                            <thead
                                                style={{
                                                    background: "#000",
                                                    color: "#fff",
                                                }}
                                            >
                                                <tr>
                                                    <td
                                                        rowspan="2"
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        COMPTE
                                                    </td>
                                                    <td
                                                        colspan="2"
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        REPORT AU{" "}
                                                        {date_debut_balance &&
                                                            dateParser(
                                                                date_debut_balance
                                                            )}
                                                    </td>
                                                    <td
                                                        colspan="2"
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        MVMT DU{" "}
                                                        {date_debut_balance &&
                                                            dateParser(
                                                                date_debut_balance
                                                            )}{" "}
                                                        AU{" "}
                                                        {date_fin_balance &&
                                                            dateParser(
                                                                date_fin_balance
                                                            )}
                                                    </td>
                                                    <td
                                                        colspan="2"
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        TOTAL
                                                    </td>
                                                    <td
                                                        colspan="2"
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        SOLDE AU{" "}
                                                        {date_fin_balance &&
                                                            dateParser(
                                                                date_fin_balance
                                                            )}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        D
                                                    </td>

                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        C
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        D
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        C
                                                    </td>

                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        D
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        C
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        D
                                                    </td>
                                                    <td
                                                        style={{
                                                            textAlign: "center",
                                                        }}
                                                    >
                                                        C
                                                    </td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems &&
                                                    currentItems.map(
                                                        (res, index) => {
                                                            return radioValue ==
                                                                "type_balance" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {" "}
                                                                        {radioValue2 ==
                                                                        "porte_detaillee"
                                                                            ? res.NomCompte +
                                                                              " " +
                                                                              res.NumCompte
                                                                            : res.NomCompte +
                                                                              " " +
                                                                              res.RefSousGroupe}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeDebitReport.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeCreditReport.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeDebitMvmt.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeCreditMvmt.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.TotalDebit.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.TotalCredit.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCredit -
                                                                                res.TotalDebit
                                                                        ) < 0
                                                                            ? numberWithSpaces(
                                                                                  Math.abs(
                                                                                      parseFloat(
                                                                                          res.TotalCredit -
                                                                                              res.TotalDebit
                                                                                      ).toFixed(
                                                                                          2
                                                                                      )
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCredit -
                                                                                res.TotalDebit
                                                                        ) > 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCredit -
                                                                                          res.TotalDebit
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                </tr>
                                                            ) : radioValue ==
                                                              "balance_convertie_cdf" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {" "}
                                                                        {radioValue2 ==
                                                                        "porte_detaillee"
                                                                            ? res.NomCompte +
                                                                              " " +
                                                                              res.Ncompte
                                                                            : res.NomCompte +
                                                                              " " +
                                                                              res.RefSousGroupe}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeDebitReportUSD +
                                                                                    res.SommeDebitReportCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeCreditReportUSD +
                                                                                    res.SommeCreditReportCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeDebitMvmtUSD +
                                                                                    res.SommeDebitMvmtCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeCreditMvmtUSD +
                                                                                    res.SommeCreditMvmtCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.TotalDebitUSD +
                                                                                    res.TotalDebitCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.TotalCreditUSD +
                                                                                    res.TotalCreditCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCreditCDF +
                                                                                res.TotalCreditUSD -
                                                                                (res.TotalDebitCDF +
                                                                                    res.TotalDebitUSD)
                                                                        ) < 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCreditCDF +
                                                                                          res.TotalCreditUSD -
                                                                                          (res.TotalDebitCDF +
                                                                                              res.TotalDebitUSD)
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCreditCDF +
                                                                                res.TotalCreditUSD -
                                                                                (res.TotalDebitCDF +
                                                                                    res.TotalDebitUSD)
                                                                        ) > 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCreditCDF +
                                                                                          res.TotalCreditUSD -
                                                                                          (res.TotalDebitCDF +
                                                                                              res.TotalDebitUSD)
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                </tr>
                                                            ) : radioValue ==
                                                              "balance_convertie_usd" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {" "}
                                                                        {radioValue2 ==
                                                                        "porte_detaillee"
                                                                            ? res.NomCompte +
                                                                              " " +
                                                                              res.Ncompte
                                                                            : res.NomCompte +
                                                                              " " +
                                                                              res.RefSousGroupe}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeDebitReportUSD +
                                                                                    res.SommeDebitReportCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeCreditReportUSD +
                                                                                    res.SommeCreditReportCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeDebitMvmtUSD +
                                                                                    res.SommeDebitMvmtCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.SommeCreditMvmtUSD +
                                                                                    res.SommeCreditMvmtCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.TotalDebitUSD +
                                                                                    res.TotalDebitCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.TotalCreditUSD +
                                                                                    res.TotalCreditCDF
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCreditCDF +
                                                                                res.TotalCreditUSD -
                                                                                (res.TotalDebitCDF +
                                                                                    res.TotalDebitUSD)
                                                                        ) < 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCreditCDF +
                                                                                          res.TotalCreditUSD -
                                                                                          (res.TotalDebitCDF +
                                                                                              res.TotalDebitUSD)
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCreditCDF +
                                                                                res.TotalCreditUSD -
                                                                                (res.TotalDebitCDF +
                                                                                    res.TotalDebitUSD)
                                                                        ) > 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCreditCDF +
                                                                                          res.TotalCreditUSD -
                                                                                          (res.TotalDebitCDF +
                                                                                              res.TotalDebitUSD)
                                                                                  ).toFixed(
                                                                                      2
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {" "}
                                                                        {radioValue2 ==
                                                                        "porte_detaillee"
                                                                            ? res.NomCompte +
                                                                              " " +
                                                                              res.NumCompte
                                                                            : res.NomCompte +
                                                                              " " +
                                                                              res.RefSousGroupe}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeDebitReport.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeCreditReport.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeDebitMvmt.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.SommeCreditMvmt.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.TotalDebit.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {numberWithSpaces(
                                                                            res.TotalCredit.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCredit -
                                                                                res.TotalDebit
                                                                        ) < 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCredit -
                                                                                          res.TotalDebit
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                    <td>
                                                                        {parseFloat(
                                                                            res.TotalCredit -
                                                                                res.TotalDebit
                                                                        ) > 0
                                                                            ? numberWithSpaces(
                                                                                  parseFloat(
                                                                                      res.TotalCredit -
                                                                                          res.TotalDebit
                                                                                  )
                                                                              )
                                                                            : "0,00"}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }
                                                    )}
                                            </tbody>
                                        </table>
                                        <br /> <br /> <br />
                                    </div>
                                </table>
                            </div>
                        </div>
                    </table>
                    <div className="h-130 d-flex align-items-center justify-content-center">
                        <ul style={paginationStyle}>
                            <li>
                                <button
                                    onClick={goToPrevPage}
                                    disabled={currentPage === 1}
                                    style={buttonStylePrevNext}
                                >
                                    Previous
                                </button>
                            </li>
                            {renderPagination()}
                            <li>
                                <button
                                    onClick={goToNextPage}
                                    disabled={currentPage === totalPages}
                                    style={buttonStylePrevNext}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </>
            )}
            <div className="container">
                {fetchData && fetchData.length > 0 && (
                    <div className="float-end mt-2">
                        <button
                            onClick={() =>
                                exportTableData("main-table-balance")
                            }
                            className="btn btn-success"
                            style={{
                                borderRadius: "0px",
                            }}
                        >
                            <i class="fas fa-file-excel"></i> Exporter en Excel
                        </button>{" "}
                        <button
                            className="btn btn-primary"
                            style={{
                                borderRadius: "0px",
                            }}
                            onClick={exportToPDF}
                        >
                            {" "}
                            <i class="fas fa-file-pdf"></i> Exporter en PDF
                        </button>
                    </div>
                )}
                <br /> <br /> <br />
            </div>
        </div>
    );
};

export default Balance;
