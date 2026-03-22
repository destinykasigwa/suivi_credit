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
                    "FAST",
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
                        "FAST",
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
                <div className="position-relative">
                    {/* Zone cachée pour le téléchargement */}
                    <div
                        id="content-to-download"
                        style={{
                            width: "90%",
                            margin: "0 auto",
                            position: "absolute",
                            top: "-9999px",
                            left: "-9999px",
                            backgroundColor: "white",
                            padding: "20px",
                        }}
                        className="card p-4 mt-2 mb-4 shadow-sm"
                    >
                        {/* En-tête du rapport */}
                        <div className="text-center mb-4">
                            <EnteteRapport />
                        </div>

                        {/* Titre principal */}
                        <div className="text-center mb-4">
                            <h4
                                style={{
                                    color: "#20c997",
                                    fontWeight: "bold",
                                    borderBottom: "3px solid #20c997",
                                    borderTop: "3px solid #20c997",
                                    padding: "12px 24px",
                                    display: "inline-block",
                                    backgroundColor: "#f8f9fa",
                                    borderRadius: "8px",
                                    fontSize: "1.2rem",
                                    letterSpacing: "1px",
                                }}
                            >
                                📄 FICHE DE SUIVI DE CREDIT
                            </h4>
                        </div>

                        {/* Informations principales */}
                        <div className="row g-3 mt-2">
                            {/* Colonne 1 */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div
                                        className="card-header bg-teal text-white"
                                        style={{
                                            backgroundColor: "#20c997",
                                            borderRadius: "8px 8px 0 0",
                                        }}
                                    >
                                        <strong>Informations générales</strong>
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            width: "40%",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                            padding: "12px",
                                                        }}
                                                    >
                                                        <i className="fas fa-hashtag me-2 text-teal"></i>
                                                        Num Compte
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.NumCompte}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-user me-2 text-teal"></i>
                                                        Nom Compte
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.NomCompte}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-tag me-2 text-teal"></i>
                                                        Produit de crédit
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                                                            {
                                                                fetchData.produit_credit
                                                            }
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-chart-line me-2 text-teal"></i>
                                                        Type crédit
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.type_credit}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-user-tie me-2 text-teal"></i>
                                                        Recouvreur
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.recouvreur}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-money-bill-wave me-2 text-teal"></i>
                                                        Montant
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        <strong className="text-success">
                                                            {new Intl.NumberFormat(
                                                                "fr-FR",
                                                            ).format(
                                                                fetchData.montant_demande,
                                                            )}{" "}
                                                            FC
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar me-2 text-teal"></i>
                                                        Date Demande
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {new Date(
                                                            fetchData.date_demande,
                                                        ).toLocaleDateString(
                                                            "fr-FR",
                                                        )}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne 2 */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div
                                        className="card-header bg-teal text-white"
                                        style={{
                                            backgroundColor: "#20c997",
                                            borderRadius: "8px 8px 0 0",
                                        }}
                                    >
                                        <strong>Conditions du crédit</strong>
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            width: "40%",
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-clock me-2 text-teal"></i>
                                                        Fréquence
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {
                                                            fetchData.frequence_mensualite
                                                        }
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-calculator me-2 text-teal"></i>
                                                        Nbre Échéances
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {
                                                            fetchData.nombre_echeance
                                                        }
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-coins me-2 text-teal"></i>
                                                        Devise
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        <span className="badge bg-primary bg-opacity-10 text-primary">
                                                            {fetchData.monnaie ||
                                                                "CDF"}
                                                        </span>
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-hourglass-half me-2 text-teal"></i>
                                                        Durée
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.duree_credit}{" "}
                                                        jours
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-chart-simple me-2 text-teal"></i>
                                                        Intervalle
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {
                                                            fetchData.intervale_jrs
                                                        }{" "}
                                                        jours
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-percent me-2 text-teal"></i>
                                                        Taux intérêt
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        <strong className="text-info">
                                                            {
                                                                fetchData.taux_interet
                                                            }
                                                            %
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-building me-2 text-teal"></i>
                                                        Source fonds
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.source_fond}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            {/* Colonne 3 - Garanties */}
                            <div className="col-md-4">
                                <div className="card border-0 shadow-sm rounded-3 h-100">
                                    <div
                                        className="card-header bg-teal text-white"
                                        style={{
                                            backgroundColor: "#20c997",
                                            borderRadius: "8px 8px 0 0",
                                        }}
                                    >
                                        <strong>Garanties</strong>
                                    </div>
                                    <div className="card-body p-0">
                                        <table className="table table-sm table-borderless mb-0">
                                            <tbody>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            width: "40%",
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-shield-alt me-2 text-teal"></i>
                                                        Type Garantie
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {
                                                            fetchData.type_garantie
                                                        }
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-chart-line me-2 text-teal"></i>
                                                        Valeur comptable
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {new Intl.NumberFormat(
                                                            "fr-FR",
                                                        ).format(
                                                            fetchData.valeur_comptable,
                                                        )}{" "}
                                                        FC
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-hashtag me-2 text-teal"></i>
                                                        Num Titre
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.num_titre}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-hand-holding-usd me-2 text-teal"></i>
                                                        Val garantie
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        <strong className="text-success">
                                                            {new Intl.NumberFormat(
                                                                "fr-FR",
                                                            ).format(
                                                                fetchData.valeur_garantie,
                                                            )}{" "}
                                                            FC
                                                        </strong>
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-alt me-2 text-teal"></i>
                                                        Date sortie titre
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.date_sortie_titre ||
                                                            "Non renseigné"}
                                                    </td>
                                                </tr>
                                                <tr
                                                    style={{
                                                        borderBottom:
                                                            "1px solid #e9ecef",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-calendar-times me-2 text-teal"></i>
                                                        Date Expiration
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.date_expiration_titre ||
                                                            "Non renseigné"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-user-check me-2 text-teal"></i>
                                                        Gestionnaire
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.gestionnaire}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Section signatures */}
                        <div className="mt-4">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div
                                    className="card-header bg-teal text-white"
                                    style={{
                                        backgroundColor: "#20c997",
                                        borderRadius: "8px 8px 0 0",
                                    }}
                                >
                                    <strong>
                                        <i className="fas fa-signature me-2"></i>
                                        Signatures et validation
                                    </strong>
                                </div>
                                <div className="card-body">
                                    <div className="row g-3">
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-user-check fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    Agent crédit
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-chart-line fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    Superviseur
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-building fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    C. Agence
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-check-double fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    CTC
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-crown fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    DG
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light">
                                                <i className="fas fa-users fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    CC
                                                </p>
                                                <small className="text-muted">
                                                    Signature
                                                </small>
                                                <div
                                                    className="mt-2"
                                                    style={{
                                                        borderTop:
                                                            "1px dashed #dee2e6",
                                                        paddingTop: "8px",
                                                    }}
                                                >
                                                    <span className="text-muted small">
                                                        _________________
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de téléchargement */}
                    <div className="text-center mt-4">
                        <button
                            className="btn btn-teal btn-lg d-inline-flex align-items-center gap-3"
                            style={{
                                borderRadius: "50px",
                                padding: "12px 32px",
                                backgroundColor: "#20c997",
                                color: "white",
                                border: "none",
                                transition: "all 0.3s ease",
                                boxShadow: "0 4px 12px rgba(32, 201, 151, 0.3)",
                            }}
                            onClick={handleClickPrint}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#198764";
                                e.currentTarget.style.transform =
                                    "translateY(-2px)";
                                e.currentTarget.style.boxShadow =
                                    "0 6px 16px rgba(32, 201, 151, 0.4)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor =
                                    "#20c997";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(32, 201, 151, 0.3)";
                            }}
                        >
                            <i className="fas fa-download fa-lg"></i>
                            <div className="text-start">
                                <small
                                    className="d-block"
                                    style={{ fontSize: "11px" }}
                                >
                                    Pour poser votre signature
                                </small>
                                <span className="fw-semibold">
                                    Télécharger la fiche de suivi
                                </span>
                            </div>
                            <i className="fas fa-file-pdf fa-2x"></i>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
