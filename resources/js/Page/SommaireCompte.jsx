import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./HeaderReport";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";

const SommaireCompte = () => {
    const [loading, setloading] = useState(false);
    const [date_debut_balance, setdate_debut_balance] = useState("");
    const [date_fin_balance, setdate_fin_balance] = useState("");
    const [radioValue, setRadioValue] = useState("rapport_non_converti");
    const [radioValue2, setRadioValue2] = useState("");
    const handleRadioChange = (event) => {
        setRadioValue(event.target.value);
    };
    const handleRadioChange2 = (event) => {
        setRadioValue2(event.target.value);
    };
    const [sous_groupe_compte, setsous_groupe_compte] = useState(3300);
    // const [compte_balance_fin, setcompte_balance_fin] = useState();
    // const [devise, setdevise] = useState();
    const [fetchData, setFetchData] = useState();
    const [fetchData2, setFetchData2] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [fetchAccountName, setFetchAccountName] = useState();
    const [total1, setTotal1] = useState(0);
    const [total2, setTotal2] = useState(0);
    const [critereSolde, setCritereSolde] = useState(">");
    const [critereSoldeAmount, setCritereSoldeAmount] = useState(0);

    useEffect(() => {
        // GET CURRENT DATE
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0, donc ajoutez 1
        const day = String(today.getDate()).padStart(2, "0");
        setdate_fin_balance(`${year}-${month}-${day}`);

        // GET LAST DAY OF THE PREVIOUS MONTH
        const lastDayPrevMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
        ); // 0th day of the current month gives the last day of the previous month
        const year2 = lastDayPrevMonth.getFullYear();
        const month2 = String(lastDayPrevMonth.getMonth() + 1).padStart(2, "0"); // Ajout de 1 car les mois sont indexés à partir de 0
        const day2 = String(lastDayPrevMonth.getDate()).padStart(2, "0");
        const formattedDate = `${year2}-${month2}-${day2}`;
        setdate_debut_balance(formattedDate);
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

    const downloadReport = (type) => {
        // Générer le nom du fichier avec la date du jour
        const filename = `Sommaire_Compte_${
            new Date().toISOString().split("T")[0]
        }`; // "YYYY-MM-DD"
        axios
            .post(
                "/download-report",
                {
                    fetchData: fetchData, // Assurez-vous que fetchData contient vos données
                    date_debut_balance: date_debut_balance,
                    date_fin_balance: date_fin_balance,
                    type: type, // Ajouter le paramètre type à la requête
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"), // Ajouter le token CSRF
                    },
                    responseType: "blob", // Définir le type de réponse comme un blob (pour le fichier)
                }
            )
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = `${filename}.${type === "pdf" ? "pdf" : "xlsx"}`; // Utiliser le nom dynamique du fichier
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => console.error("Error:", error));
    };

    // const downloadReport = async (
    //     type,
    //     date_debut_balance,
    //     date_fin_balance,
    //     fetchData
    // ) => {
    //     try {
    //         console.log(date_debut_balance, date_fin_balance, fetchData); // Vérifiez ici
    //         const response = await axios.post(`/download-report`, {
    //             params: {
    //                 type,
    //                 date_debut_balance,
    //                 date_fin_balance,
    //                 fetchData, // Passer la variable fetchData ici
    //             },
    //             responseType: "blob", // Important pour les fichiers
    //         });

    //         // Créer un lien pour télécharger le fichier
    //         const url = window.URL.createObjectURL(new Blob([response.data]));
    //         const link = document.createElement("a");
    //         link.href = url;
    //         link.setAttribute(
    //             "download",
    //             `rapport.${type === "pdf" ? "pdf" : "xlsx"}`
    //         ); // Nom du fichier
    //         document.body.appendChild(link);
    //         link.click();
    //         document.body.removeChild(link);
    //     } catch (error) {
    //         console.error("Erreur lors du téléchargement du rapport:", error);
    //     }
    // };

    // Exemple d'appel de la fonction avec les variables
    //downloadReport("pdf", date_debut_balance, date_fin_balance, fetchData);

    const AfficherSommaire = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post(
            "/eco/pages/rapport/sommaire-compte/affichage",
            {
                radioValue,
                radioValue2,
                sous_groupe_compte,
                date_debut_balance,
                date_fin_balance,
                critereSolde,
                critereSoldeAmount,
            }
        );
        if (res.data.status == 1) {
            setloading(false);
            setFetchData(res.data.data);
            //setFetchData2(res.data.data);
            // setFetchDataConverti(res.data.data_converti);
            // setFetchDataNonConverti(res.data.data_non_converti);
            const totalAmount1 = res.data.data.reduce(
                (acc, transaction) => acc + transaction.soldeDebut,
                0
            );
            const totalAmount2 = res.data.data.reduce(
                (acc, transaction) => acc + transaction.soldeFin,
                0
            );
            setTotal1(totalAmount1 && totalAmount1);
            setTotal2(totalAmount2 && totalAmount2);
        }
    };

    function numberWithSpaces(x = 0) {
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
    // const exportToPDF = () => {
    //     const content = document.getElementById("content-to-download-balance");

    //     if (!content) {
    //         console.error("Element not found!");
    //         return;
    //     }

    //     html2canvas(content, { scale: 2 })
    //         .then((canvas) => {
    //             const imgData = canvas.toDataURL("image/jpeg", 0.75); // Change to JPEG and set quality to 0.75
    //             const pdf = new jsPDF("p", "mm", "a4");

    //             const pdfWidth = pdf.internal.pageSize.getWidth();
    //             const pdfHeight = pdf.internal.pageSize.getHeight();
    //             const imgProps = pdf.getImageProperties(imgData);
    //             const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    //             let heightLeft = imgHeight;
    //             let position = 0;

    //             pdf.addImage(
    //                 imgData,
    //                 "JPEG",
    //                 0,
    //                 position,
    //                 pdfWidth,
    //                 imgHeight,
    //                 undefined,
    //                 "FAST"
    //             ); // Use 'FAST' compression
    //             heightLeft -= pdfHeight;

    //             while (heightLeft >= 0) {
    //                 position = heightLeft - imgHeight;
    //                 pdf.addPage();
    //                 pdf.addImage(
    //                     imgData,
    //                     "JPEG",
    //                     0,
    //                     position,
    //                     pdfWidth,
    //                     imgHeight,
    //                     undefined,
    //                     "FAST"
    //                 ); // Use 'FAST' compression
    //                 heightLeft -= pdfHeight;
    //             }

    //             pdf.autoPrint();
    //             window.open(pdf.output("bloburl"), "_blank");
    //         })
    //         .catch((error) => {
    //             console.error("Error capturing canvas:", error);
    //         });
    // };
    const exportToPDF = () => {
        axios
            .post(
                "/sommaire-compte",
                {
                    fetchData: fetchData, // Assurez-vous que fetchData contient vos données
                    date_debut_balance: date_debut_balance,
                    date_fin_balance: date_fin_balance,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"), // Ajouter le token CSRF
                    },
                    responseType: "blob", // Définir le type de réponse comme un blob (pour le fichier PDF)
                }
            )
            .then((response) => {
                const url = window.URL.createObjectURL(
                    new Blob([response.data])
                );
                const a = document.createElement("a");
                a.href = url;
                a.download = "sommaire_de_compte.pdf";
                document.body.appendChild(a);
                a.click();
                a.remove();
            })
            .catch((error) => console.error("Error:", error));
    };

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

    const inputRef = useRef(null);
    useEffect(() => {
        const handleKeyDown = async (event) => {
            if (event.key === "Tab") {
                const res = await axios.post(
                    "/eco/pages/sommaire-compte/getcompte",
                    {
                        sous_groupe_compte,
                    }
                );
                if (res.data.status == 1) {
                    setFetchAccountName(res.data.accountName);
                } else {
                    Swal.fire({
                        title: "Erreur",
                        text: res.data.msg,
                        icon: "error",
                        timer: 3000,
                        confirmButtonText: "Okay",
                    });
                }
                // console.log("Tab key pressed on input");
                // Ajoutez ici votre logique personnalisée
            }
        };

        // Vérifiez si la référence est définie et ajoutez l'écouteur d'événements à l'élément d'entrée
        const inputElement = inputRef.current;
        if (inputElement) {
            inputElement.addEventListener("keydown", handleKeyDown);
        }

        // Nettoyez l'écouteur d'événements lorsque le composant est démonté
        return () => {
            if (inputElement) {
                inputElement.removeEventListener("keydown", handleKeyDown);
            }
        };
    }, [sous_groupe_compte]); // Ajoutez `sous_groupe_compte` dans les dépendances si nécessaire
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
                        <h5 className="text-bold p-1">Sommaire des comptes </h5>
                    </div>{" "}
                </div>
                <div
                    className="row mb-2"
                    style={{ background: "#fff", padding: "1px" }}
                >
                    <div className="col-md-2">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Sous Groupe de compte
                                    </legend>

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
                                                SG/Compte
                                            </label>
                                            <input
                                                ref={inputRef}
                                                id="type_compte"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                    width: "80px",
                                                    height: "25px",
                                                }}
                                                type="text"
                                                name="sous_groupe_compte"
                                                value={sous_groupe_compte}
                                                onChange={(e) =>
                                                    setsous_groupe_compte(
                                                        e.target.value
                                                    )
                                                }
                                            />{" "}
                                            <br />
                                            <label
                                                htmlFor=""
                                                style={{
                                                    fontSize: "15px",
                                                    color: "green",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                SG/Compte USD: 3300 <br />
                                                SG/Compte CDF: 3301
                                            </label>
                                            {fetchAccountName && (
                                                <label
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "green",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    {fetchAccountName}
                                                </label>
                                            )}
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-2">
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
                                                Période N-1
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
                    <div className="col-md-2">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Convertion{" "}
                                    </legend>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="rapport_non_converti"
                                                    name="rapport_non_converti"
                                                    value="rapport_non_converti"
                                                    checked={
                                                        radioValue ===
                                                        "rapport_non_converti"
                                                    }
                                                    onChange={handleRadioChange}
                                                />{" "}
                                                <label
                                                    class="form-check-label"
                                                    for="rapport_non_converti"
                                                    style={{
                                                        fontSize: "15px",
                                                        color: "steelblue",
                                                        fontWeight: "bold",
                                                    }}
                                                >
                                                    Non Converti
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
                                                    id="balance_convertie_cdf"
                                                    name="balance_convertie_cdf"
                                                    value="balance_convertie_cdf"
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
                                                    ConvertiEnCDF
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
                                                    Convertie en USD
                                                </label>{" "}
                                            </div>
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-3">
                        <form>
                            <fieldset className="border p-2">
                                <legend
                                    className="float-none w-auto p-0"
                                    style={{ fontSize: "15px" }}
                                >
                                    Critère solde
                                </legend>

                                <table>
                                    <tr>
                                        <td>
                                            {" "}
                                            <label
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Solde{"  "}
                                            </label>
                                        </td>
                                        <td>
                                            <select
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "0px",
                                                }}
                                                name="Critere"
                                                onChange={(e) => {
                                                    setCritereSolde(
                                                        e.target.value
                                                    );
                                                }}
                                            >
                                                {/* <option value="">
                                                    Sélectionnez
                                                </option> */}
                                                <option value="=">{"="}</option>
                                                <option selected value=">">
                                                    {">"}
                                                </option>
                                                <option value="<">{"<"}</option>

                                                <option value="<=">
                                                    {"<="}
                                                </option>
                                                <option value=">=">
                                                    {">="}
                                                </option>
                                                <option value="<>">
                                                    {"<>"}
                                                </option>
                                            </select>
                                        </td>{" "}
                                        <td>
                                            {" "}
                                            à
                                            <input
                                                style={{
                                                    height: "25px",
                                                    width: "100px",
                                                    border: "1px solid steelblue",
                                                    marginLeft: "2px",
                                                }}
                                                value={critereSoldeAmount}
                                                onChange={(e) => {
                                                    setCritereSoldeAmount(
                                                        e.target.value
                                                    );
                                                }}
                                            />
                                        </td>
                                    </tr>
                                </table>
                            </fieldset>
                        </form>
                    </div>

                    <div className="col-md-2">
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                Action
                            </legend>

                            <table>
                                <tr>
                                    <td>
                                        <button
                                            onClick={AfficherSommaire}
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
                        </fieldset>
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
                                                            SOMMAIRE DE COMPTES{" "}
                                                            {radioValue ==
                                                                "rapport_non_converti" &&
                                                            sous_groupe_compte ==
                                                                3300
                                                                ? "UNIQUEEMENT EN USD"
                                                                : radioValue ==
                                                                      "rapport_non_converti" &&
                                                                  sous_groupe_compte ==
                                                                      3301
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
                                                fontSize: "17px",
                                            }}
                                        >
                                            <thead
                                                style={{
                                                    background: "#000",
                                                    color: "#fff",
                                                }}
                                            >
                                                {radioValue ==
                                                "rapport_non_converti" ? (
                                                    <tr>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                            className="col-1"
                                                        >
                                                            N°
                                                        </th>

                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            NumCompte
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            NomCompte
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            Solde au{" "}
                                                            {dateParser(
                                                                date_debut_balance
                                                            )}
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            Solde au{" "}
                                                            {dateParser(
                                                                date_fin_balance
                                                            )}
                                                        </th>
                                                    </tr>
                                                ) : (
                                                    <tr>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                            className="col-1"
                                                        >
                                                            N°
                                                        </th>

                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            NumCompte
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            NomCompte
                                                        </th>
                                                        {/* <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            SoldeEnCDF
                                                        </th>
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            USD_Converti_En_CDF
                                                        </th> */}
                                                        <th
                                                            style={{
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {radioValue ==
                                                            "balance_convertie_cdf"
                                                                ? "Convertie en CDF"
                                                                : "Convertie en USD"}
                                                        </th>
                                                    </tr>
                                                )}
                                            </thead>
                                            <tbody>
                                                {currentItems &&
                                                    currentItems.map(
                                                        (res, index) => {
                                                            return radioValue ==
                                                                "rapport_non_converti" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {
                                                                            compteur++
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            res.NumCompte
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            res.NomCompte
                                                                        }
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            res.soldeDebut.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            res.soldeFin.toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : radioValue ==
                                                              "balance_convertie_cdf" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {
                                                                            compteur++
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            res.NumCompte
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            res.NomCompte
                                                                        }
                                                                    </td>
                                                                    {/* <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_cdf
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_usd
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td> */}
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_usd_to_cdf
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : radioValue ==
                                                              "balance_convertie_usd" ? (
                                                                <tr key={index}>
                                                                    <td>
                                                                        {
                                                                            compteur++
                                                                        }
                                                                    </td>
                                                                    <td>
                                                                        {
                                                                            res.NumCompte
                                                                        }
                                                                    </td>

                                                                    <td>
                                                                        {
                                                                            res.NomCompte
                                                                        }
                                                                    </td>
                                                                    {/* <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_cdf
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_usd
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td> */}
                                                                    <td
                                                                        style={{
                                                                            textAlign:
                                                                                "center",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        {numberWithSpaces(
                                                                            parseFloat(
                                                                                res.solde_consolide_cdf_to_usd
                                                                            ).toFixed(
                                                                                2
                                                                            )
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ) : (
                                                                ""
                                                            );
                                                        }
                                                    )}
                                            </tbody>
                                            {fetchData &&
                                                radioValue !=
                                                    "balance_convertie_usd" &&
                                                radioValue !=
                                                    "balance_convertie_cdf" && (
                                                    <tfoot>
                                                        <tr
                                                            style={{
                                                                background:
                                                                    "teal",
                                                                fontSize:
                                                                    "20px",
                                                            }}
                                                        >
                                                            <td>Total</td>
                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>

                                                            <td
                                                                style={{
                                                                    border: "0px",
                                                                }}
                                                            ></td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {total1 &&
                                                                    numberWithSpaces(
                                                                        total1.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </td>
                                                            <td
                                                                style={{
                                                                    textAlign:
                                                                        "center",
                                                                }}
                                                            >
                                                                {total2 &&
                                                                    numberWithSpaces(
                                                                        total2.toFixed(
                                                                            2
                                                                        )
                                                                    )}
                                                            </td>
                                                        </tr>
                                                    </tfoot>
                                                )}
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
                {fetchData && (
                    <div className="float-end mt-2">
                        <button
                            // onClick={() =>
                            //     exportTableData("main-table-balance")
                            // }
                            onClick={() => downloadReport("excel")}
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
                            // onClick={exportToPDF}
                            onClick={() => downloadReport("pdf")}
                        >
                            {" "}
                            <i class="fas fa-file-pdf"></i> Exporter en PDF
                        </button>
                    </div>
                )}
                <br /> <br /> <br />
                {/* <button onClick={() => downloadReport("pdf")}>
                    Télécharger PDF
                </button>
                <button onClick={() => downloadReport("excel")}>
                    Télécharger Excel
                </button> */}
            </div>
        </div>
    );
};

export default SommaireCompte;
