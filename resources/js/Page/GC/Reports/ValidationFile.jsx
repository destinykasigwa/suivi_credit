import axios from "axios";
import { useState, useEffect } from "react";
import { EnteteRapport } from "./HeaderReport";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";
import { FaDownload } from "react-icons/fa";

export default function ValidationFile({ dossierId }) {
    const [fetchData, setFetchData] = useState();
    const [showFile, setShowFile] = useState(false);

    useEffect(() => {
        getDossierCredit();
    }, [dossierId]);

    const getDossierCredit = () => {
        // Charger les données
        axios
            .get(`suivi-credit/dossiers/${dossierId}`)
            .then((res) => {
                const data = res.data.data; // récupère l'objet dossier complet
                setFetchData(data); // stocke tout l'objet dossier dans dossier
                // console.log(fetchData);
            })
            .catch(() => setFetchData(null));
    };

    // const getData = async () => {
    //     const res = await axios.get("gestion_credit/rapport/validation-file");
    //     if (res.data.status == 1) {
    //         setFetchData(res.data.data);
    //     }
    // };

    // const exportToPDF = () => {
    //     const content = document.getElementById("content-to-download");

    //     if (!content) {
    //         console.error("Element not found!");
    //         return;
    //     }

    //     html2canvas(content, { scale: 2 })
    //         .then((canvas) => {
    //             const imgData = canvas.toDataURL("image/jpeg", 0.75);
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
    //             );
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
    //                 );
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
        const content = document.getElementById("content-to-download");

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 2 })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/jpeg", 0.75);
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
                );
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
                    );
                    heightLeft -= pdfHeight;
                }

                // Générer la date du jour
                const today = new Date();
                const day = String(today.getDate()).padStart(2, "0");
                const month = String(today.getMonth() + 1).padStart(2, "0");
                const year = today.getFullYear();

                // Construire le nom du fichier avec NomCompte
                const fileName = `${fetchData.NomCompte}_${day}-${month}-${year}.pdf`;

                // Télécharger directement le PDF avec le bon nom
                pdf.save(fileName);
            })
            .catch((error) => {
                console.error("Error capturing canvas:", error);
            });
    };

    const handleClickPrint = () => {
        // Affiche temporairement le contenu hors écran
        setShowFile(true);

        // Laisse le DOM rendre avant capture
        setTimeout(() => {
            exportToPDF();
            setShowFile(false); // Cache à nouveau après impression
        }, 300);
    };
    return (
        <>
            {fetchData && (
                <div>
                    <table
                        id="main-table-validation-file"
                        style={{
                            border: "0px",
                            width: "100%",
                        }}
                    >
                        <div
                            id="content-to-download"
                            style={{
                                width: "90%",
                                margin: "0px auto",
                                position: "absolute",
                                top: "-9999px",
                                left: "-9999px",
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
                                    FICHE DE SUIVI DE CREDIT
                                </h4>
                            </div>
                            <div className="row mt-2">
                                <div className="col-md-4">
                                    <table className="table table-bordered table-striped">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>Num Compte</strong>
                                                </td>
                                                <td> {fetchData.NumCompte} </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Nom Compte</strong>
                                                </td>
                                                <td>{fetchData.NomCompte}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Produit de crédit
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.produit_credit}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Type crédit</strong>
                                                </td>
                                                <td>{fetchData.type_credit}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Recouvreur</strong>
                                                </td>
                                                <td>{fetchData.recouvreur}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Montant</strong>
                                                </td>
                                                <td>
                                                    {fetchData.montant_demande}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Date Demande
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.date_demande}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-bordered table-striped">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>Frequence.</strong>
                                                </td>

                                                <td>
                                                    {
                                                        fetchData.frequence_mensualite
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Date Demande
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.date_demande}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Nbre Echnce</strong>
                                                </td>
                                                <td>
                                                    {
                                                        fetchData.frequence_mensualite
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Devise</strong>
                                                </td>
                                                <td>
                                                    {fetchData.nombre_echeance}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Durée</strong>
                                                </td>
                                                <td>
                                                    {fetchData.duree_credit}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Intervalle</strong>{" "}
                                                </td>
                                                <td>
                                                    {fetchData.intervale_jrs}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Source fonds
                                                    </strong>{" "}
                                                </td>
                                                <td>{fetchData.source_fond}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Taux intérêt
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.taux_interet}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4">
                                    <table className="table table-bordered table-striped">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Type Garantie
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.type_garantie}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Valeur compt.
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.valeur_comptable}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Num Titre</strong>
                                                </td>
                                                <td>{fetchData.num_titre}</td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Val garantie
                                                    </strong>
                                                </td>
                                                <td>
                                                    {fetchData.valeur_garantie}
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Date sortie titre
                                                    </strong>
                                                </td>
                                                <td>
                                                    {
                                                        fetchData.date_sortie_titre
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>
                                                        Date Expiration titre
                                                    </strong>
                                                </td>
                                                <td>
                                                    {
                                                        fetchData.date_expiration_titre
                                                    }
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <strong>Gestionn.</strong>
                                                </td>
                                                <td>
                                                    {fetchData.gestionnaire}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className="row align-items-center justify-content-center">
                                <p>Liste des signatures</p>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    AC
                                </div>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    Superviseur
                                </div>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    C. Agence
                                </div>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    CTC
                                </div>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    DG
                                </div>
                                <div
                                    className="col-md-2"
                                    style={{
                                        border: "1px solid black",
                                        padding: "35px",
                                    }}
                                >
                                    CC
                                </div>
                            </div>
                        </div>
                    </table>
                    <button
                        className="btn btn-secondary mt-2"
                        style={{ borderRadius: "25px", padding: "8px 16px" }}
                        onClick={handleClickPrint}
                    >
                        {" "}
                        <FaDownload /> <i class="fas fa-file-pdf"></i> Fichier
                        vierge
                    </button>
                </div>
            )}
        </>
    );
}
