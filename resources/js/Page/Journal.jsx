// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";
// import { ExportCSV } from "./Print";
import { EnteteRapport } from "./HeaderReport";
// import { useNavigate } from "react-router-dom";

const Journal = () => {
    const [loading, setloading] = useState(false);
    const [devise, setDevise] = useState("CDF");

    const [getDataCDF, setGetdataCDF] = useState();
    const [getDataUSD, setGetdataUSD] = useState();
    const [getdefaultDateDebut, setGetdefaultDateDebut] = useState();
    const [getdefaultDateFin, setGetdefaultDateFin] = useState();
    const [dateDebut, setDateDebut] = useState();
    const [dateFin, setDateFin] = useState();
    const [getTypeJournal, setGetTypeJournal] = useState();
    // const [checkboxValue, setCheckboxValue] = useState(false);
    const [radioValue, setRadioValue] = useState("");
    const [radioValue2, setRadioValue2] = useState("");
    const [checkboxValues, setCheckboxValues] = useState({
        userCheckbox: false,
        SuspensTransactions: false,
        givenCurrency: false,
        GivenJournal: false,
    });
    const [AgenceFrom, setAgenceFrom] = useState("GOMA");
    // const [fetchUsers, setFetchUsers] = useState();
    const [MonnaieDonnee, setMonnaieDonnee] = useState();
    const [JournalDonne, setJournalDonne] = useState();
    const [getAllUsers, setgetAllUsers] = useState();
    const [UserName, setUserName] = useState();
    const [getTot, setGetTot] = useState({
        totCDF: "",
        totUSD: "",
    });

    useEffect(() => {
        GetInformation();
        getDefaultDate();
        getJournalDropMenu();
    }, []);

    // const handleCheckboxChange = (event) => {
    //     setCheckboxValue(event.target.checked);
    // };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        setCheckboxValues((prevValues) => ({
            ...prevValues,
            [name]: checked,
        }));
    };

    const handleRadioChange = (event) => {
        setRadioValue(event.target.value);
    };

    const handleRadioChange2 = (event) => {
        setRadioValue2(event.target.value);
    };

    const GetInformation = async () => {};

    const getDefaultDate = async () => {
        const res = await axios.get("/eco/page/report/get-default-page");
        if (res.data.status == 1) {
            setGetdefaultDateDebut(res.data.dateDebut);
            setGetdefaultDateFin(res.data.dateFin);
        }
    };
    const getJournalDropMenu = async () => {
        const res = await axios.get("/eco/page/report/get-journal-drop-menu");
        if (res.data.status == 1) {
            setGetTypeJournal(res.data.data);
            setgetAllUsers(res.data.users);
            // setFetchUsers(getAllUsers);
            // console.log(UserName);
        }
    };
    const GetJournal = async (e) => {
        e.preventDefault();
        setloading(true);
        const res = await axios.post("/eco/page/report/get-searched-journal", {
            DateDebut: dateDebut ? dateDebut : getdefaultDateDebut,
            DateFin: dateFin ? dateFin : getdefaultDateFin,
            TypeAgence: radioValue,
            TypeJournal: radioValue2,
            AutresCriteres: checkboxValues,
            AgenceFrom: AgenceFrom,
            UserName: UserName,
            MonnaieDonnee: MonnaieDonnee,
            JournalDonne: JournalDonne,
        });
        if (res.data.status == 1) {
            setloading(false);
            setGetdataCDF(res.data.dataCDF);
            setGetdataUSD(res.data.dataUSD);
            setGetTot({
                totCDF: res.data.totCDF,
                totUSD: res.data.totUSD,
            });
            //console.log(getTot.totCDF.TotalDebitfc);
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
    // const exportToPDFCDF = () => {
    //     const content = document.getElementById("content-to-download-cdf");

    //     if (!content) {
    //         console.error("Element not found!");
    //         return;
    //     }

    //     html2canvas(content, { scale: 3 }).then((canvas) => {
    //         const paddingTop = 50;
    //         const paddingRight = 50;
    //         const paddingBottom = 50;
    //         const paddingLeft = 50;

    //         const canvasWidth = canvas.width + paddingLeft + paddingRight;
    //         const canvasHeight = canvas.height + paddingTop + paddingBottom;

    //         const newCanvas = document.createElement("canvas");
    //         newCanvas.width = canvasWidth;
    //         newCanvas.height = canvasHeight;
    //         const ctx = newCanvas.getContext("2d");

    //         if (ctx) {
    //             ctx.fillStyle = "#ffffff"; // Background color
    //             ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    //             ctx.drawImage(canvas, paddingLeft, paddingTop);
    //         }

    //         const pdf = new jsPDF("p", "mm", "a4");
    //         const imgData = newCanvas.toDataURL("image/png");
    //         const imgProps = pdf.getImageProperties(imgData);
    //         const pdfWidth = pdf.internal.pageSize.getWidth();
    //         const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    //         pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    //         pdf.autoPrint();
    //         window.open(pdf.output("bloburl"), "_blank");
    //         // pdf.save("releve-de-compte.pdf");
    //     });
    // };
    const exportToPDF = () => {
        const content = document.getElementById("content-to-download-usd");

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
    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }
    let compteur = 1;
    let compteur2 = 1;
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
                        <h5 className="text-bold p-1">
                            Journal des opérations
                        </h5>
                    </div>{" "}
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-md-3 card rounded-0">
                    <form action="">
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                Période
                            </legend>
                            <table>
                                <tbody>
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
                                                    setDateFin(e.target.value);
                                                }}
                                                value={
                                                    dateFin
                                                        ? dateFin
                                                        : getdefaultDateFin
                                                }
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div>
                <div className="col-md-3 card rounded-0">
                    <form action="">
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                Agence
                            </legend>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="allAgence"
                                                    name="agence"
                                                    value="allagence"
                                                    checked={
                                                        radioValue ===
                                                        "allagence"
                                                    }
                                                    onChange={handleRadioChange}
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="allAgence"
                                                >
                                                    Toutes les agences
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
                                                    id="AgenceFrom"
                                                    name="agence"
                                                    value="givenAgence"
                                                    checked={
                                                        radioValue ===
                                                        "givenAgence"
                                                    }
                                                    onChange={handleRadioChange}
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="AgenceFrom"
                                                >
                                                    Agence de
                                                </label>{" "}
                                                <select
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    id="Agence"
                                                    onChange={(e) => {
                                                        setAgenceFrom(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <option value="GOMA">
                                                        GOMA
                                                    </option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                {/* <input
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    id="user"
                                                    name="userCheckbox"
                                                    checked={
                                                        checkboxValues.userCheckbox
                                                    }
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                /> */}
                                                <label
                                                    class="form-check-label"
                                                    for="user"
                                                >
                                                    Utilisateur
                                                </label>{" "}
                                                <select
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    id="user"
                                                    onChange={(e) => {
                                                        setUserName(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        Sélectionnez
                                                    </option>
                                                    {getAllUsers &&
                                                        getAllUsers.map(
                                                            (res, index) => {
                                                                return (
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
                                                                );
                                                            }
                                                        )}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div>
                {/* <div className="col-md-2 card rounded-0">
                    <form action="">
                        <fieldset>
                            <legend
                                className="font-weight-light"
                                style={{ fontSize: "15px" }}
                            >
                                Type journal
                            </legend>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="radio"
                                                    class="form-check-input"
                                                    id="Jverification"
                                                    name="Jverification"
                                                    value="Jverification"
                                                    checked={
                                                        radioValue2 ===
                                                        "Jverification"
                                                    }
                                                    onChange={
                                                        handleRadioChange2
                                                    }
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="Jverification"
                                                >
                                                    Journal de vérification
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div> */}
                <div
                    className="col-md-4 card rounded-0 "
                    // style={{ overflowY: "scroll" }}
                >
                    <form action="">
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                Autres critères
                            </legend>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    id="TransSuspen"
                                                    name="SuspensTransactions"
                                                    checked={
                                                        checkboxValues.SuspensTransactions
                                                    }
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="TransSuspen"
                                                >
                                                    Transactions en suspens
                                                </label>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div class="form-check">
                                                <input
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    id="GivenM"
                                                    name="givenCurrency"
                                                    checked={
                                                        checkboxValues.givenCurrency
                                                    }
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="GivenM"
                                                >
                                                    D'une monnaie donnée
                                                </label>{" "}
                                                <select
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    onChange={(e) => {
                                                        setMonnaieDonnee(
                                                            e.target.value
                                                        );
                                                    }}
                                                    value={MonnaieDonnee}
                                                >
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
                                                    type="checkbox"
                                                    class="form-check-input"
                                                    id="GivenJ"
                                                    name="GivenJournal"
                                                    checked={
                                                        checkboxValues.GivenJournal
                                                    }
                                                    onChange={
                                                        handleCheckboxChange
                                                    }
                                                />
                                                <label
                                                    class="form-check-label"
                                                    for="GivenJ"
                                                >
                                                    D'un journal donné
                                                </label>{" "}
                                                <select
                                                    style={{
                                                        border: "1px solid #dcdcdc",
                                                        padding: "1px",
                                                    }}
                                                    onChange={(e) => {
                                                        setJournalDonne(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    {getTypeJournal !==
                                                        undefined &&
                                                        getTypeJournal.map(
                                                            (res, index) => {
                                                                return (
                                                                    <option
                                                                        key={
                                                                            index
                                                                        }
                                                                        value={
                                                                            res.code_journal
                                                                        }
                                                                    >
                                                                        {
                                                                            res.nom_journal
                                                                        }
                                                                    </option>
                                                                );
                                                            }
                                                        )}
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </fieldset>
                    </form>
                </div>
                <div className="col-md-1 card rounded-0 ">
                    <form action="">
                        <fieldset className="border p-2">
                            <legend
                                className="float-none w-auto p-0"
                                style={{ fontSize: "15px" }}
                            >
                                Action
                            </legend>
                            <table>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button
                                            className="btn btn-primary rounded-10 mt-1 p-1"
                                            onClick={GetJournal}
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
                        </fieldset>
                    </form>
                </div>
            </div>

            <div className="row">
                {/* <div>
                    <pre>{JSON.stringify(checkboxValues, null, 2)}</pre>
                    <p>Radio Value: {radioValue}</p>
                    <p>Radio Value2: {radioValue2}</p>
                </div> */}
                {(getDataCDF && getDataCDF.length > 0) ||
                (getDataUSD && getDataUSD.length > 0) ? (
                    <table id="main-table-journal" style={{ border: "0px" }}>
                        <div
                            id="content-to-download-usd"
                            className="card p-3 mt-2 mb-2"
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
                                    JOURNAL DES OPERATIONS AFFICHE EN DATE DU{" "}
                                    {dateDebut
                                        ? dateParser(dateDebut)
                                        : dateParser(getdefaultDateDebut)}{" "}
                                    au{" "}
                                    {dateFin
                                        ? dateParser(dateFin)
                                        : dateParser(getdefaultDateDebut)}
                                </h4>
                            </div>
                            <div className="h-130 d-flex align-items-center justify-content-center">
                                <div className="table-responsive">
                                    <table
                                        class="table table-bordered table-striped"
                                        id="content-releve-tableCDF"
                                        style={{
                                            // border: "1px solid #dcdcdc",
                                            width: "100%",
                                            marginLeft: "4px",
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
                                                <th>Num cpte</th>
                                                <th>Nom compte</th>
                                                <th>Libellé</th>
                                                <th>Débit</th>
                                                <th>Crédit</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <h4
                                                    style={{
                                                        color: "steelblue",
                                                        padding: "3px",
                                                    }}
                                                >
                                                    {" "}
                                                    <strong>CDF</strong>{" "}
                                                </h4>
                                            </tr>
                                            {getDataCDF &&
                                                getDataCDF.map((res, index) => {
                                                    return (
                                                        <>
                                                            <tr
                                                                key={index}
                                                                // style={{
                                                                //     background: `${
                                                                //         parseInt(
                                                                //             res.Creditfc
                                                                //         ) == 0
                                                                //             ? "#7abcd9"
                                                                //             : "#dcdcdc"
                                                                //     }`,
                                                                // }}
                                                            >
                                                                <td>
                                                                    {dateParser(
                                                                        res.DateTransaction
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.NumTransaction
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
                                                                <td>
                                                                    {
                                                                        res.Libelle
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {res.Debitfc.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {res.Creditfc.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    );
                                                })}

                                            <tr>
                                                <td
                                                    style={{
                                                        border: "0px",
                                                    }}
                                                >
                                                    <strong>TOT</strong>
                                                </td>
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
                                                        border: "0px",
                                                    }}
                                                ></td>
                                                <td
                                                    style={{
                                                        background: "green",
                                                        fontSize: "20px",
                                                    }}
                                                >
                                                    {getTot.totCDF &&
                                                        getTot.totCDF
                                                            .TotalDebitfc !=
                                                            null &&
                                                        numberWithSpaces(
                                                            getTot.totCDF.TotalDebitfc.toFixed(
                                                                2
                                                            )
                                                        )}
                                                </td>
                                                <td
                                                    style={{
                                                        background: "green",
                                                        fontSize: "20px",
                                                    }}
                                                >
                                                    {" "}
                                                    {getTot.totCDF
                                                        ?.TotalCreditfc !=
                                                        null &&
                                                        numberWithSpaces(
                                                            getTot.totCDF.TotalCreditfc.toFixed(
                                                                2
                                                            )
                                                        )}
                                                </td>
                                            </tr>

                                            <tr>
                                                <h4
                                                    style={{
                                                        color: "steelblue",
                                                        padding: "3px",
                                                    }}
                                                >
                                                    {" "}
                                                    <strong>USD</strong>{" "}
                                                </h4>
                                            </tr>
                                            {getDataUSD &&
                                                getDataUSD.map((res, index) => {
                                                    return (
                                                        <>
                                                            <tr
                                                                key={index}
                                                                // style={{
                                                                //     background: `${
                                                                //         parseInt(
                                                                //             res.Creditusd
                                                                //         ) == 0
                                                                //             ? "#7abcd9"
                                                                //             : "#dcdcdc"
                                                                //     }`,
                                                                // }}
                                                            >
                                                                <td>
                                                                    {dateParser(
                                                                        res.DateTransaction
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {
                                                                        res.NumTransaction
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
                                                                <td>
                                                                    {
                                                                        res.Libelle
                                                                    }
                                                                </td>
                                                                <td>
                                                                    {res.Debitusd.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {res.Creditusd.toFixed(
                                                                        2
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        </>
                                                    );
                                                })}
                                        </tbody>
                                        <tfoot>
                                            <tr>
                                                <th style={{ border: "0px" }}>
                                                    {" "}
                                                    <strong>TOT</strong>
                                                </th>
                                                <th
                                                    style={{ border: "0px" }}
                                                ></th>
                                                <th
                                                    style={{ border: "0px" }}
                                                ></th>
                                                <th
                                                    style={{ border: "0px" }}
                                                ></th>
                                                <th
                                                    style={{ border: "0px" }}
                                                ></th>
                                                <th
                                                    style={{
                                                        background: "green",
                                                        fontSize: "20px",
                                                    }}
                                                >
                                                    {getTot.totUSD &&
                                                        getTot.totUSD
                                                            .TotalDebitusd !=
                                                            null &&
                                                        numberWithSpaces(
                                                            getTot.totUSD.TotalDebitusd.toFixed(
                                                                2
                                                            )
                                                        )}
                                                </th>
                                                <th
                                                    style={{
                                                        background: "green",
                                                        fontSize: "20px",
                                                    }}
                                                >
                                                    {" "}
                                                    {getTot.totUSD &&
                                                        getTot.totUSD
                                                            .TotalCreditusd !=
                                                            null &&
                                                        numberWithSpaces(
                                                            getTot.totUSD.TotalCreditusd.toFixed(
                                                                2
                                                            )
                                                        )}
                                                </th>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </table>
                ) : null}
            </div>
            {getDataCDF || getDataUSD ? (
                <div className="float-end">
                    <button
                        onClick={() => exportTableData("main-table-journal")}
                        className="btn btn-success"
                        style={{ borderRadius: "0px" }}
                    >
                        <i class="fas fa-file-excel"></i> Exporter en Excel
                    </button>{" "}
                    <button
                        className="btn btn-primary"
                        style={{ borderRadius: "0px" }}
                        onClick={exportToPDF}
                    >
                        {" "}
                        <i class="fas fa-file-pdf"></i> Exporter en PDF
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default Journal;
