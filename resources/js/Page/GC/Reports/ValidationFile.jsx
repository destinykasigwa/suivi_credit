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
    const [propositions, setPropositions] = useState([]);

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
                setPropositions(data.propositions || []);
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
                        <div className="row g-3 mt-1">
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
                                                            {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
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
                                                <tr>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "600",
                                                            color: "#495057",
                                                        }}
                                                    >
                                                        <i className="fas fa-building me-2 text-teal"></i>
                                                        Agence
                                                    </td>
                                                    <td
                                                        style={{
                                                            padding: "12px",
                                                            fontWeight: "500",
                                                            color: "#2c3e50",
                                                        }}
                                                    >
                                                        {fetchData.Agence}
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
                                                        {fetchData.monnaie ==
                                                        "CDF"
                                                            ? "FC "
                                                            : " USD"}
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
                                                            {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
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


                          {/* Section récapitulative des propositions */}
                                    {propositions &&
                                        propositions.length > 0 && (
                                            <div
                                                className="mt-1 p-3"
                                                style={{
                                                    borderRadius: "12px",
                                                    backgroundColor: "#f8f9fa",
                                                    pageBreakBefore: "always", // Force une nouvelle page avant cet élément
                                                    breakBefore: "page", // Alternative moderne
                                                    marginTop: "0", // Ajuste la marge pour éviter l'espace blanc

                                                }}
                                            >
                                                <h6
                                                    className="fw-bold mb-3"
                                                    style={{ color: "#20c997" }}
                                                >
                                                    <i className="fas fa-chart-line me-2"></i>
                                                    Historique des propositions
                                                    de montant
                                                </h6>
                                               <div className="row g-3">
    {propositions.map((prop, index) => (
        <div key={index} className="col-md-6 col-lg-4">
            <div className="card h-100 border-0 shadow-sm" style={{
                borderRadius: "14px",
                transition: "all 0.2s ease",
                borderTop: `3px solid ${index === propositions.length - 1 ? "#20c997" : "#ffc107"}`,
                overflow: "hidden"
            }}>
                <div className="card-body p-3">
                    {/* En-tête */}
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div>
                            <i className="fas fa-user-circle me-1" style={{ color: "#20c997", fontSize: "14px" }}></i>
                            <span className="fw-semibold" style={{ fontSize: "13px" }}>
                                {prop.role || prop.nom}
                            </span>
                            {index === propositions.length - 1 && (
                                <span className="badge ms-2" style={{
                                    backgroundColor: "#20c997",
                                    fontSize: "8px",
                                    padding: "2px 6px"
                                }}>
                                    <i className="fas fa-star"></i>
                                </span>
                            )}
                        </div>
                        <small className="text-muted" style={{ fontSize: "9px" }}>
                            {new Date(prop.date).toLocaleDateString("fr-FR", {
                                day: "2-digit",
                                month: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit"
                            })}
                        </small>
                    </div>

                    {/* Contenu principal : Montant + Commentaire côte à côte */}
                    <div className="d-flex gap-2 mt-2">
                        {/* Montant */}
                        <div className="flex-shrink-0 text-center" style={{ width: "100px" }}>
                            <div className="p-2 rounded-3" style={{
                                backgroundColor: "rgba(32, 201, 151, 0.1)",
                                borderRadius: "10px"
                            }}>
                                <span className="text-muted d-block" style={{ fontSize: "9px" }}>Montant</span>
                                <span className="fw-bold" style={{ fontSize: "14px", color: "#20c997" }}>
                                    {new Intl.NumberFormat("fr-FR").format(prop.montant)}
                                </span>
                                <span className="text-muted" style={{ fontSize: "8px" }}>
                                    {fetchData?.monnaie === "CDF" ? "FC" : "USD"}
                                </span>
                            </div>
                        </div>

                        {/* Commentaire */}
                        <div className="flex-grow-1">
                            {prop.commentaire ? (
                                <div className="p-2 rounded-3 h-100" style={{
                                    backgroundColor: "#fff9e6",
                                    borderLeft: "3px solid #ffc107"
                                }}>
                                    <div className="d-flex gap-1">
                                        <i className="fas fa-comment-dots" style={{ fontSize: "10px", color: "#ffc107" }}></i>
                                        <small style={{ fontSize: "11px", color: "#856404", lineHeight: "1.3" }}>
                                            {prop.commentaire.length > 100 
                                                ? prop.commentaire.substring(0, 500) + "..." 
                                                : prop.commentaire}
                                        </small>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-2 text-center rounded-3" style={{
                                    backgroundColor: "#f8f9fa"
                                }}>
                                    <i className="fas fa-comment-slash" style={{ fontSize: "12px", color: "#adb5bd" }}></i>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ))}
</div>
                                            </div>
                                        )}


                        {/* Section signatures avec montants proposés */}
                        <div className="mt-1">
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
                                        {/* Agent crédit */}
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
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
                                                {/* Montant proposé par l'agent crédit */}
                                                {propositions &&
                                                    propositions.find(
                                                        (p) =>
                                                            p.nom ===
                                                            fetchData.recouvreur,
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            fetchData.recouvreur,
                                                                    ).montant,
                                                                )}{" "}
                                                               {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Superviseur */}
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
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
                                                {/* Montant proposé par le superviseur */}
                                                {propositions &&
                                                    propositions.find(
                                                        (p) =>
                                                            p.nom ===
                                                            "Superviseur",
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            "Superviseur",
                                                                    ).montant,
                                                                )}{" "}
                                                                {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* Chef Agence */}
                                        {/* <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
                                                <i className="fas fa-building fa-2x text-teal mb-2"></i>
                                                <p className="mb-0 fw-semibold">
                                                    Chef Agence
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
                                            
                                                {propositions &&
                                                    propositions.find(
                                                        (p) =>
                                                            p.nom ===
                                                            "Chef Agence",
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            "Chef Agence",
                                                                    ).montant,
                                                                )}{" "}
                                                                {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div> */}

                                        {/* CTC */}
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
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
                                                {/* Montant proposé par le CTC */}
                                                {propositions &&
                                                    propositions.find(
                                                        (p) => p.nom === "CTC",
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            "CTC",
                                                                    ).montant,
                                                                )}{" "}
                                                               {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>

                                        {/* DG */}
                                        {/* <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
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
                                                 Montant proposé par le DG *
                                                {propositions &&
                                                    propositions.find(
                                                        (p) => p.nom === "DG",
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            "DG",
                                                                    ).montant,
                                                                )}{" "}
                                                                {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div> */}

                                        {/* CC */}
                                        <div className="col-md-2">
                                            <div className="text-center p-3 border rounded-3 bg-light h-100">
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
                                                {/* Montant proposé par le CC */}
                                                {propositions &&
                                                    propositions.find(
                                                        (p) => p.nom === "CC",
                                                    ) && (
                                                        <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
                                                            <small className="text-success fw-semibold">
                                                                <i className="fas fa-hand-holding-usd me-1"></i>
                                                                {new Intl.NumberFormat(
                                                                    "fr-FR",
                                                                ).format(
                                                                    propositions.find(
                                                                        (p) =>
                                                                            p.nom ===
                                                                            "CC",
                                                                    ).montant,
                                                                )}{" "}
                                                               {fetchData.monnaie ==
                                                            "CDF"
                                                                ? "FC "
                                                                : " USD"}
                                                            </small>
                                                        </div>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                  
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bouton de téléchargement */}
                    <div className="text-center mt-1">
                        <button
                            className="btn  bg-gradient-primary text-white btn-lg d-inline-flex align-items-center gap-3"
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
