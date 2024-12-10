import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { EnteteRapport } from "./HeaderReport";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";

const RemboursementAttendu = () => {
    const [loading, setloading] = useState(false);
    const [dateToSearch1, setdateToSearch1] = useState("");
    const [dateToSearch2, setdateToSearch2] = useState("");
    const [devise, setdevise] = useState("CDF");
    const [fetchData, setFetchData] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [total1, setTotal1] = useState(0);
    const [total2, setTotal2] = useState(0);
    const [fetchAgentCredit, setFetchAgentCredit] = useState();
    const [agent_credit_name, setagent_credit_name] = useState();

    useEffect(() => {
        // GET CURRENT DATE
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0, donc ajoutez 1
        const day = String(today.getDate()).padStart(2, "0");
        setdateToSearch2(`${year}-${month}-${day}`);

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
        setdateToSearch1(formattedDate);
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

    const AfficherRemboursementAttendu = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post("/rapport/data/remboursement-attendu", {
            dateToSearch1,
            dateToSearch2,
            devise,
            agent_credit_name,
        });
        if (res.data.status == 1) {
            setloading(false);
            setFetchData(res.data.data);
            const totalAmount1 = res.data.data.reduce(
                (acc, transaction) => acc + transaction.CapAmmorti,
                0
            );
            const totalAmount2 = res.data.data.reduce(
                (acc, transaction) => acc + transaction.Interet,
                0
            );
            setTotal1(totalAmount1 && totalAmount1);
            setTotal2(totalAmount2 && totalAmount2);
            // console.log(total1);
            // console.log(total2);
        } else {
            setloading(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 1000,
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

    // Calculate the index of the first and last item of the current page
    let itemsPerPage = 40;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems =
        fetchData && fetchData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render pagination buttons
    const renderPagination = () => {
        const pageNumbers = [];
        for (
            let i = 1;
            i <= Math.ceil(fetchData && fetchData.length / itemsPerPage);
            i++
        ) {
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
        return pageNumbers;
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) =>
            Math.min(
                prevPage + 1,
                Math.ceil(fetchData && fetchData.length / itemsPerPage)
            )
        );
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
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
                        <h5 className="text-bold p-1">Remboursement Attendu</h5>
                    </div>{" "}
                </div>
                <div
                    className="row"
                    style={{
                        background: "#fff",
                        border: "0px solid #fff",
                        borderStyle: "outset",
                        borderColor: "white",
                        borderRadius: "10px",
                    }}
                >
                    <div className="col-md-2">
                        <form action="">
                            <table>
                                <fieldset className="border p-2">
                                    <legend
                                        className="float-none w-auto p-0"
                                        style={{ fontSize: "15px" }}
                                    >
                                        Période et devise
                                    </legend>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="dateToSearch1"
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
                                                name="dateToSearch1"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setdateToSearch1(
                                                        e.target.value
                                                    );
                                                }}
                                                value={dateToSearch1}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="dateToSearch2"
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
                                                name="dateToSearch2"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setdateToSearch2(
                                                        e.target.value
                                                    );
                                                }}
                                                value={dateToSearch2}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label
                                                class="form-check-label"
                                                for="dateToSearch2"
                                                style={{
                                                    fontSize: "15px",
                                                    color: "steelblue",
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Devise
                                            </label>
                                            <br />
                                            <select
                                                name="devise"
                                                style={{
                                                    padding: "1px ",
                                                    border: `${"1px solid teal"}`,
                                                    marginBottom: "5px",
                                                }}
                                                onChange={(e) => {
                                                    setdevise(e.target.value);
                                                }}
                                            >
                                                <option value="CDF">CDF</option>
                                                <option value="USD">USD</option>
                                            </select>
                                        </td>
                                    </tr>
                                </fieldset>
                                <br />
                            </table>
                        </form>
                    </div>
                    <div className="col-md-2">
                        <table>
                            <fieldset className="border p-2">
                                <legend
                                    className="float-none w-auto p-0"
                                    style={{ fontSize: "15px" }}
                                >
                                    Agent de crédit
                                </legend>

                                <tr>
                                    <td>
                                        <label
                                            class="form-check-label"
                                            for="agent_credit_name"
                                            style={{
                                                fontSize: "15px",
                                                color: "steelblue",
                                                fontWeight: "bold",
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
                                                marginBottom: "5px",
                                                width: "100px",
                                            }}
                                            onChange={(e) => {
                                                setagent_credit_name(
                                                    e.target.value
                                                );
                                            }}
                                        >
                                            <option value="">Tous</option>
                                            {fetchAgentCredit &&
                                                fetchAgentCredit.map(
                                                    (res, index) => {
                                                        return (
                                                            <>
                                                                <option
                                                                    key={index}
                                                                    value={
                                                                        res.name
                                                                    }
                                                                >
                                                                    {res.name}
                                                                </option>
                                                            </>
                                                        );
                                                    }
                                                )}
                                        </select>
                                    </td>
                                </tr>
                            </fieldset>
                            <br />
                        </table>
                    </div>

                    <div className="col-md-2 ">
                        <table>
                            <tr>
                                <td>
                                    <button
                                        onClick={AfficherRemboursementAttendu}
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
                            {devise == "CDF" && (
                                <div className="row mt-2">
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
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h4
                                                                style={{
                                                                    background:
                                                                        "#000",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#fff",
                                                                    border: "2px solid teal",
                                                                }}
                                                            >
                                                                REMBOURSEMENTS
                                                                ATTENDUS DU{" "}
                                                                {dateParser(
                                                                    dateToSearch1
                                                                ) +
                                                                    " au " +
                                                                    dateParser(
                                                                        dateToSearch2
                                                                    )}
                                                            </h4>{" "}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <table
                                                className="table table-bordered table-striped"
                                                style={{
                                                    background: "#fff",
                                                    padding: "0px",
                                                    color: "#000",
                                                    width: "100%",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                <thead
                                                    style={{
                                                        background: "#000",
                                                        color: "white",
                                                    }}
                                                >
                                                    <tr>
                                                        <th>
                                                            Date Tombée
                                                            Echéance.
                                                        </th>
                                                        <th>Num compte</th>
                                                        <th>Dévise</th>
                                                        <th>Num Dossier</th>
                                                        <th>Capital Echu</th>
                                                        <th>Intéret Echu</th>
                                                        <th>Solde Compte</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {currentItems &&
                                                        currentItems.map(
                                                            (res, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {dateParser(
                                                                                res.DateTranch
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumCompteEpargne
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.CodeMonnaie
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumDossier
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.CapAmmorti
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.Interet
                                                                            }
                                                                        </td>

                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.soldeMembreCDF
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                </tbody>
                                                <tfoot>
                                                    <tr
                                                        style={{
                                                            background: "teal",
                                                            fontSize: "20px",
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
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            <br /> <br /> <br />
                                        </div>
                                    </table>
                                </div>
                            )}
                            {devise == "USD" && (
                                <div className="row mt-2">
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
                                                                marginTop:
                                                                    "50px",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h4
                                                                style={{
                                                                    background:
                                                                        "#000",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#fff",
                                                                    border: "2px solid teal",
                                                                }}
                                                            >
                                                                REMBOURSEMENTS
                                                                ATTENDUS DU{" "}
                                                                {dateParser(
                                                                    dateToSearch1
                                                                ) +
                                                                    " au " +
                                                                    dateParser(
                                                                        dateToSearch2
                                                                    )}
                                                            </h4>{" "}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <table
                                                className="table table-bordered table-striped"
                                                style={{
                                                    background: "#fff",
                                                    padding: "0px",
                                                    color: "#000",
                                                    width: "100%",
                                                    fontSize: "16px",
                                                }}
                                            >
                                                <thead
                                                    style={{
                                                        background: "#000",
                                                        color: "white",
                                                    }}
                                                >
                                                    <tr>
                                                        <th>
                                                            Date Tombée
                                                            Echéance.
                                                        </th>
                                                        <th>Num compte</th>
                                                        <th>Dévise</th>
                                                        <th>Num Dossier</th>
                                                        <th>Capital Echu</th>
                                                        <th>Intéret Echu</th>
                                                        <th>Solde Compte</th>
                                                    </tr>
                                                </thead>

                                                <tbody>
                                                    {currentItems &&
                                                        currentItems.map(
                                                            (res, index) => {
                                                                return (
                                                                    <tr
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <td>
                                                                            {dateParser(
                                                                                res.DateTranch
                                                                            )}
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumCompteEpargne
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.CodeMonnaie
                                                                            }
                                                                        </td>
                                                                        <td>
                                                                            {
                                                                                res.NumDossier
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.CapAmmorti
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.Interet
                                                                            }
                                                                        </td>
                                                                        <td
                                                                            style={{
                                                                                textAlign:
                                                                                    "center",
                                                                            }}
                                                                        >
                                                                            {
                                                                                res.soldeMembreUSD
                                                                            }
                                                                        </td>
                                                                    </tr>
                                                                );
                                                            }
                                                        )}
                                                </tbody>
                                                <tfoot>
                                                    <tr
                                                        style={{
                                                            background: "teal",
                                                            fontSize: "20px",
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
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                            <br /> <br /> <br />
                                        </div>
                                    </table>
                                </div>
                            )}
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
                                    disabled={
                                        currentPage ===
                                        Math.ceil(
                                            fetchData &&
                                                fetchData.length / itemsPerPage
                                        )
                                    }
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

export default RemboursementAttendu;
