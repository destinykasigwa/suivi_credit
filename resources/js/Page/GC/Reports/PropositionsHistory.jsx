import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "jspdf-autotable";
import {
    MdHistory,
    MdPerson,
    MdAttachMoney,
    MdComment,
    MdStar,
    MdTrendingUp,
    MdDownload,
    MdPrint,
    MdPictureAsPdf,
    MdGridOn,
    MdImage,
} from "react-icons/md";

// Informations de l'organisation
const organisation = {
    nom: "COOPEC AKIBA YETU",
    slogan: "Ensemble pour un avenir prospère",
    adresse:
        "Rue N°13 Avenue Mont-Goma N°23 / Rue NZUMUKA James; Commune de GOMA Nord-Kivu, RDCongo, A côté du bureau de la DGI.",
    telephone: "+243 970 237 272",
    email: "contact@coopecakibayetu.org",
    siteWeb: "www.coopecakibayetu.org",
    logo: "https://www.coopecakibayetu.org/wp-content/uploads/2022/08/AKIBA-YETU-transparent-PNG-02-1536x432.png",
};

const PropositionsHistory = ({ propositionId, NumDossier, onClose = null }) => {
    const [loading, setLoading] = useState(true);
    const [propositions, setPropositions] = useState([]);
    const [signaturesStats, setSignaturesStats] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (propositionId) {
            fetchPropositions();
        }
    }, [propositionId]);

    const fetchPropositions = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(
                `/gestion_credit/propositions/${propositionId}/commentaires`,
            );

            if (response.data.status === 1) {
                setPropositions(response.data.data || []);
                const stats = response.data.signatures_stats || null;

                // ✅ Forcer le total d'intervenants à 5 (même si le backend envoie 4)
                if (stats && stats.total_intervenants === 4) {
                    stats.total_intervenants = 5;
                    stats.reste_a_signer =
                        stats.total_intervenants - stats.total_signatures;
                    stats.pourcentage_avancement = Math.round(
                        (stats.total_signatures / stats.total_intervenants) *
                            100,
                    );
                }
                setSignaturesStats(stats);
            } else {
                setError(response.data.msg || "Erreur lors du chargement");
            }
        } catch (err) {
            console.error("Erreur:", err);
            setError("Impossible de charger les propositions");
        } finally {
            setLoading(false);
        }
    };

    function formatCurrency(x) {
        if (x === null || x === undefined) {
            return "0.00";
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    const getCurrencySymbol = (deviseCode) => {
        const symbols = { CDF: "FC", USD: "$", EUR: "€", GBP: "£" };
        return symbols[deviseCode] || deviseCode;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getRoleColor = (role) => {
        const roleColors = {
            Commercial: "#3b82f6",
            "Chef de département": "#8b5cf6",
            "Directrice financière": "#ec489a",
            "Directeur Général": "#10b981",
            "Chef de service": "#f59e0b",
            Responsable: "#06b6d4",
        };
        return roleColors[role] || "#6b7280";
    };

    // ✅ Export XLSX
    const handleExportXLSX = () => {
        const excelData = propositions.map((prop, index) => ({
            "#": index + 1,
            Signataire: prop.nom || prop.signed_by || "",
            Rôle: prop.role || "",
            Montant: prop.montant_propose || prop.montant || 0,
            Devise: prop.devise || "CDF",
            Commentaire: prop.commentaire || "",
            Date: formatDate(prop.created_at || prop.date),
            Signature: prop.signature_path ? "Oui" : "Non",
        }));

        const ws = XLSX.utils.json_to_sheet(excelData);
        ws["!cols"] = [
            { wch: 6 }, // #
            { wch: 25 }, // Signataire
            { wch: 25 }, // Rôle
            { wch: 15 }, // Montant
            { wch: 8 }, // Devise
            { wch: 50 }, // Commentaire
            { wch: 20 }, // Date
            { wch: 12 }, // Signature
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            wb,
            ws,
            `Propositions_Dossier_${NumDossier}`,
        );
        XLSX.writeFile(wb, `Propositions_Dossier_${NumDossier}.xlsx`);
    };

    // ✅ Export PDF
    // const handleExportPDF = async () => {
    //     const doc = new jsPDF("p", "mm", "a4");
    //     const pageWidth = doc.internal.pageSize.getWidth();

    //     // -------- EN-TÊTE (inchangé) --------
    //     doc.setFillColor(16, 185, 129);
    //     doc.rect(0, 0, pageWidth, 45, "F");
    //     doc.setTextColor(255, 255, 255);
    //     doc.setFontSize(18);
    //     doc.setFont("helvetica", "bold");
    //     doc.text(organisation.nom, pageWidth / 2, 15, { align: "center" });
    //     doc.setFontSize(10);
    //     doc.setFont("helvetica", "normal");
    //     doc.text(organisation.slogan, pageWidth / 2, 23, { align: "center" });
    //     doc.setFontSize(8);
    //     doc.setTextColor(240, 240, 240);
    //     doc.text(organisation.adresse, pageWidth / 2, 30, {
    //         align: "center",
    //         maxWidth: 170,
    //     });
    //     doc.text(
    //         `${organisation.telephone} | ${organisation.email}`,
    //         pageWidth / 2,
    //         36,
    //         { align: "center" },
    //     );
    //     doc.text(organisation.siteWeb, pageWidth / 2, 41, { align: "center" });
    //     doc.setDrawColor(16, 185, 129);
    //     doc.setLineWidth(0.5);
    //     doc.line(10, 48, pageWidth - 10, 48);
    //     doc.setTextColor(0, 0, 0);
    //     doc.setFontSize(14);
    //     doc.setFont("helvetica", "bold");
    //     doc.text("Historique des propositions de montant", pageWidth / 2, 58, {
    //         align: "center",
    //     });
    //     doc.setFontSize(10);
    //     doc.setFont("helvetica", "normal");
    //     doc.setTextColor(100, 100, 100);
    //     doc.text(
    //         `Dossier N°: ${NumDossier || propositionId}`,
    //         pageWidth / 2,
    //         66,
    //         { align: "center" },
    //     );
    //     doc.setFontSize(8);
    //     doc.setTextColor(150, 150, 150);
    //     doc.text(
    //         `Exporté le: ${new Date().toLocaleString("fr-FR")}`,
    //         pageWidth - 20,
    //         75,
    //         { align: "right" },
    //     );

    //     // -------- CHARGEMENT DES IMAGES --------
    //     const rows = [];
    //     const imagesData = [];

    //     for (const prop of propositions) {
    //         let signatureText = "Non signé";
    //         let imageBase64 = null;
    //         if (prop.signature_path) {
    //             try {
    //                 const response = await fetch(
    //                     `/storage/${prop.signature_path}`,
    //                 );
    //                 if (!response.ok) throw new Error("Erreur chargement");
    //                 const blob = await response.blob();
    //                 const base64 = await new Promise((resolve) => {
    //                     const reader = new FileReader();
    //                     reader.onloadend = () => resolve(reader.result);
    //                     reader.readAsDataURL(blob);
    //                 });
    //                 imageBase64 = base64;
    //                 signatureText = "Oui";
    //             } catch (e) {
    //                 console.error("Erreur signature", e);
    //                 signatureText = "Erreur";
    //             }
    //         }
    //         rows.push({
    //             index: rows.length + 1,
    //             nom: prop.nom || prop.signed_by || "",
    //             role: prop.role || "",
    //             montant: `${formatCurrency(prop.montant_propose || prop.montant || 0)} ${getCurrencySymbol(prop.devise || "CDF")}`,
    //             commentaire: prop.commentaire || "Aucun commentaire",
    //             date: formatDate(prop.created_at || prop.date),
    //             signature: signatureText,
    //             image: imageBase64,
    //         });
    //         imagesData.push({
    //             nom: prop.nom || prop.signed_by || "",
    //             image: imageBase64,
    //         });
    //     }

    //     // -------- TABLEAU PRINCIPAL --------
    //     const tableData = rows.map((r) => [
    //         r.index,
    //         r.nom,
    //         r.role,
    //         r.montant,
    //         r.commentaire,
    //         r.date,
    //         r.signature,
    //     ]);

    //     doc.autoTable({
    //         startY: 80,
    //         head: [
    //             [
    //                 "#",
    //                 "Signataire",
    //                 "Rôle",
    //                 "Montant",
    //                 "Commentaire",
    //                 "Date",
    //                 "Signature",
    //             ],
    //         ],
    //         body: tableData,
    //         theme: "striped",
    //         headStyles: {
    //             fillColor: [16, 185, 129],
    //             textColor: [255, 255, 255],
    //             fontStyle: "bold",
    //             halign: "center",
    //         },
    //         styles: {
    //             fontSize: 8,
    //             cellPadding: 2,
    //             lineColor: [200, 200, 200],
    //             lineWidth: 0.1,
    //         },
    //         columnStyles: {
    //             0: { cellWidth: 8, halign: "center" },
    //             1: { cellWidth: 30 },
    //             2: { cellWidth: 25 },
    //             3: { cellWidth: 25, halign: "right" },
    //             4: { cellWidth: 50 },
    //             5: { cellWidth: 28, halign: "center" },
    //             6: { cellWidth: 25, halign: "center" },
    //         },
    //         alternateRowStyles: { fillColor: [245, 245, 245] },
    //         margin: { left: 10, right: 10 },
    //     });

    //     const finalY = doc.lastAutoTable.finalY + 10;

    //     // -------- SECTION SIGNATURES EN IMAGES --------
    //     if (imagesData.some((item) => item.image)) {
    //         doc.addPage();
    //         doc.setFontSize(14);
    //         doc.setFont("helvetica", "bold");
    //         doc.text("Signatures des intervenants", pageWidth / 2, 20, {
    //             align: "center",
    //         });

    //         let y = 30;
    //         const imgWidth = 60;
    //         const imgHeight = 30;
    //         const xStart = (pageWidth - imgWidth) / 2;

    //         for (const item of imagesData) {
    //             if (item.image) {
    //                 doc.setFontSize(10);
    //                 doc.setFont("helvetica", "normal");
    //                 doc.text(item.nom, pageWidth / 2, y, { align: "center" });
    //                 y += 5;
    //                 doc.addImage(
    //                     item.image,
    //                     "JPEG",
    //                     xStart,
    //                     y,
    //                     imgWidth,
    //                     imgHeight,
    //                     undefined,
    //                     "FAST",
    //                 );
    //                 y += imgHeight + 10;
    //                 if (y > 270) {
    //                     doc.addPage();
    //                     y = 20;
    //                 }
    //             }
    //         }
    //     }

    //     // -------- STATISTIQUES --------
    //     if (signaturesStats) {
    //         doc.setFontSize(10);
    //         doc.setFont("helvetica", "bold");
    //         doc.setTextColor(0, 0, 0);
    //         doc.text("Récapitulatif des signatures:", 14, finalY);
    //         doc.setFontSize(9);
    //         doc.setFont("helvetica", "normal");
    //         doc.text(
    //             `• Signatures effectuées: ${signaturesStats.total_signatures}/${signaturesStats.total_intervenants}`,
    //             20,
    //             finalY + 7,
    //         );
    //         doc.text(
    //             `• Pourcentage d'avancement: ${signaturesStats.pourcentage_avancement}%`,
    //             20,
    //             finalY + 14,
    //         );
    //         doc.text(
    //             `• Reste à signer: ${signaturesStats.reste_a_signer} signature(s)`,
    //             20,
    //             finalY + 21,
    //         );
    //     }

    //     // -------- PIED DE PAGE --------
    //     const pageCount = doc.internal.getNumberOfPages();
    //     for (let i = 1; i <= pageCount; i++) {
    //         doc.setPage(i);
    //         doc.setFontSize(8);
    //         doc.setTextColor(150, 150, 150);
    //         doc.text(
    //             `COOPEC AKIBA YETU - Document officiel - Page ${i} sur ${pageCount}`,
    //             pageWidth / 2,
    //             doc.internal.pageSize.getHeight() - 10,
    //             { align: "center" },
    //         );
    //     }

    //     doc.save(
    //         `Historique_Propositions_Dossier_${NumDossier || propositionId}.pdf`,
    //     );
    // };

    const handleExportPDF = async () => {
    const doc = new jsPDF("p", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    // -------- EN-TÊTE (inchangé) --------
    doc.setFillColor(16, 185, 129);
    doc.rect(0, 0, pageWidth, 45, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text(organisation.nom, pageWidth / 2, 15, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(organisation.slogan, pageWidth / 2, 23, { align: "center" });
    doc.setFontSize(8);
    doc.setTextColor(240, 240, 240);
    doc.text(organisation.adresse, pageWidth / 2, 30, {
        align: "center",
        maxWidth: 170,
    });
    doc.text(
        `${organisation.telephone} | ${organisation.email}`,
        pageWidth / 2,
        36,
        { align: "center" },
    );
    doc.text(organisation.siteWeb, pageWidth / 2, 41, { align: "center" });
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(10, 48, pageWidth - 10, 48);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Historique des propositions de montant", pageWidth / 2, 58, {
        align: "center",
    });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(
        `Dossier N°: ${NumDossier || propositionId}`,
        pageWidth / 2,
        66,
        { align: "center" },
    );
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
        `Exporté le: ${new Date().toLocaleString("fr-FR")}`,
        pageWidth - 20,
        75,
        { align: "right" },
    );

    // -------- PRÉPARATION DES DONNÉES AVEC IMAGES --------
    const rows = [];
    const imageMap = []; // index 0 correspond à la ligne 0 du tableau

    for (const prop of propositions) {
        let imageBase64 = null;
        if (prop.signature_path) {
            try {
                const response = await fetch(`/storage/${prop.signature_path}`);
                if (!response.ok) throw new Error("Erreur chargement");
                const blob = await response.blob();
                const base64 = await new Promise((resolve) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.readAsDataURL(blob);
                });
                imageBase64 = base64;
            } catch (e) {
                console.error("Erreur signature", e);
            }
        }
        // On garde l'image pour l'ajouter dans la cellule
        imageMap.push(imageBase64);

        // Données du tableau (sans l'image dans le texte)
        rows.push([
            (rows.length + 1).toString(),
            prop.nom || prop.signed_by || "",
            prop.role || "",
            `${formatCurrency(prop.montant_propose || prop.montant || 0)} ${getCurrencySymbol(prop.devise || "CDF")}`,
            prop.commentaire || "Aucun commentaire",
            formatDate(prop.created_at || prop.date),
            prop.signature_path ? "" : "Aucune", // texte de remplacement (sera masqué si image)
        ]);
    }

    // -------- GÉNÉRATION DU TABLEAU --------
    doc.autoTable({
        startY: 80,
        head: [
            [
                "#",
                "Signataire",
                "Rôle",
                "Montant",
                "Commentaire",
                "Date",
                "Signature",
            ],
        ],
        body: rows,
        theme: "striped",
        headStyles: {
            fillColor: [16, 185, 129],
            textColor: [255, 255, 255],
            fontStyle: "bold",
            halign: "center",
        },
        styles: {
            fontSize: 8,
            cellPadding: 2,
            lineColor: [200, 200, 200],
            lineWidth: 0.1,
        },
        columnStyles: {
            0: { cellWidth: 8, halign: "center" },
            1: { cellWidth: 30 },
            2: { cellWidth: 25 },
            3: { cellWidth: 25, halign: "right" },
            4: { cellWidth: 50 },
            5: { cellWidth: 28, halign: "center" },
            6: { cellWidth: 30, halign: "center" }, // colonne signature plus large
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 10, right: 10 },

        // -------- AJOUT DES IMAGES DANS LA COLONNE SIGNATURE --------
        didDrawCell: function (data) {
            // Vérifier si c'est la colonne Signature (index 6)
            if (data.column.index === 6) {
                const rowIndex = data.row.index;
                const image = imageMap[rowIndex];
                if (image) {
                    // Récupérer les coordonnées de la cellule
                    const x = data.cell.x + 1; // petit padding
                    const y = data.cell.y + 1;
                    const cellWidth = data.cell.width - 2;
                    const cellHeight = data.cell.height - 2;
                    // Calculer la taille pour que l'image s'adapte à la cellule
                    const imgWidth = Math.min(cellWidth, 20); // max 20mm
                    const imgHeight = (imgWidth * 0.75); // ratio 4:3
                    // Centrer l'image
                    const offsetX = (cellWidth - imgWidth) / 2;
                    const offsetY = (cellHeight - imgHeight) / 2;
                    doc.addImage(
                        image,
                        "JPEG",
                        x + offsetX,
                        y + offsetY,
                        imgWidth,
                        imgHeight,
                        undefined,
                        "FAST"
                    );
                }
            }
        },
    });

    const finalY = doc.lastAutoTable.finalY + 10;

    // -------- STATISTIQUES --------
    if (signaturesStats) {
        doc.setFontSize(10);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.text("Récapitulatif des signatures:", 14, finalY);
        doc.setFontSize(9);
        doc.setFont("helvetica", "normal");
        doc.text(
            `• Signatures effectuées: ${signaturesStats.total_signatures}/${signaturesStats.total_intervenants}`,
            20,
            finalY + 7,
        );
        doc.text(
            `• Pourcentage d'avancement: ${signaturesStats.pourcentage_avancement}%`,
            20,
            finalY + 14,
        );
        doc.text(
            `• Reste à signer: ${signaturesStats.reste_a_signer} signature(s)`,
            20,
            finalY + 21,
        );
    }

    // -------- PIED DE PAGE --------
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(
            `COOPEC AKIBA YETU - Document officiel - Page ${i} sur ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" },
        );
    }

    doc.save(
        `Historique_Propositions_Dossier_${NumDossier || propositionId}.pdf`,
    );
};
    const dataToShow = propositions;

    if (loading) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "400px",
                }}
            >
                <div className="spinner-border text-success" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div
                style={{
                    padding: "40px",
                    textAlign: "center",
                    backgroundColor: "#fef2f2",
                    borderRadius: "16px",
                }}
            >
                <p style={{ color: "#dc2626" }}>{error}</p>
                <button
                    onClick={fetchPropositions}
                    style={{
                        marginTop: "16px",
                        padding: "8px 20px",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                    }}
                >
                    Réessayer
                </button>
            </div>
        );
    }

    return (
        <div
            className="propositions-history-container"
            style={{
                padding: "24px",
                backgroundColor: "#ffffff",
                borderRadius: "16px",
                fontFamily: "'Inter', system-ui, sans-serif",
                maxWidth: "1400px",
                margin: "0 auto",
                overflowY: "auto",
                maxHeight: "100vh",
            }}
        >
            {/* En-tête */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "24px",
                    flexWrap: "wrap",
                    gap: "16px",
                    borderBottom: "2px solid #e5e7eb",
                    paddingBottom: "16px",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            width: "48px",
                            height: "48px",
                            background:
                                "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                            borderRadius: "14px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <MdHistory size={24} color="#ffffff" />
                    </div>
                    <div>
                        <h2
                            style={{
                                fontSize: "20px",
                                fontWeight: "700",
                                margin: 0,
                                color: "#1f2937",
                            }}
                        >
                            Historique des propositions
                        </h2>
                        <p
                            style={{
                                fontSize: "13px",
                                color: "#6b7280",
                                margin: "4px 0 0 0",
                            }}
                        >
                            Dossier N° : {NumDossier || propositionId}
                        </p>
                    </div>
                </div>

                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                    <button
                        onClick={handleExportXLSX}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#217346",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#1a5c38")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#217346")
                        }
                    >
                        <MdGridOn size={16} />
                        Excel
                    </button>

                    <button
                        onClick={handleExportPDF}
                        style={{
                            padding: "8px 16px",
                            backgroundColor: "#dc2626",
                            color: "white",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "13px",
                            fontWeight: "500",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#b91c1c")
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor = "#dc2626")
                        }
                    >
                        <MdPictureAsPdf size={16} />
                        PDF
                    </button>

                    {onClose && (
                        <button
                            onClick={onClose}
                            style={{
                                padding: "8px 16px",
                                backgroundColor: "#ef4444",
                                color: "white",
                                border: "none",
                                borderRadius: "10px",
                                fontSize: "13px",
                                fontWeight: "500",
                                cursor: "pointer",
                            }}
                            onMouseEnter={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "#dc2626")
                            }
                            onMouseLeave={(e) =>
                                (e.currentTarget.style.backgroundColor =
                                    "#ef4444")
                            }
                        >
                            Fermer
                        </button>
                    )}
                </div>
            </div>

            {/* Barre de progression (forcée à 5 intervenants) */}
            {signaturesStats && (
                <div
                    style={{
                        marginBottom: "24px",
                        padding: "16px",
                        backgroundColor: "#f8fafc",
                        borderRadius: "16px",
                        border: "1px solid #e5e7eb",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            marginBottom: "8px",
                        }}
                    >
                        <div>
                            <span
                                style={{
                                    fontSize: "13px",
                                    fontWeight: "600",
                                    color: "#1f2937",
                                }}
                            >
                                Avancement des signatures
                            </span>
                            <span
                                style={{
                                    fontSize: "12px",
                                    color: "#6b7280",
                                    marginLeft: "8px",
                                }}
                            >
                                ({signaturesStats.total_signatures}/
                                {signaturesStats.total_intervenants}{" "}
                                intervenants)
                            </span>
                        </div>
                        <span
                            style={{
                                fontSize: "18px",
                                fontWeight: "700",
                                color: "#10b981",
                            }}
                        >
                            {signaturesStats.pourcentage_avancement}%
                        </span>
                    </div>
                    <div
                        style={{
                            width: "100%",
                            height: "8px",
                            backgroundColor: "#e5e7eb",
                            borderRadius: "4px",
                            overflow: "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${signaturesStats.pourcentage_avancement}%`,
                                height: "100%",
                                background:
                                    "linear-gradient(90deg, #10b981 0%, #059669 100%)",
                                borderRadius: "4px",
                                transition: "width 0.5s ease",
                            }}
                        />
                    </div>
                    {signaturesStats.reste_a_signer > 0 && (
                        <p
                            style={{
                                fontSize: "11px",
                                color: "#f59e0b",
                                marginTop: "8px",
                                marginBottom: 0,
                            }}
                        >
                            <i className="fas fa-info-circle me-1"></i>
                            En attente de {signaturesStats.reste_a_signer}{" "}
                            intervenants
                            {signaturesStats.reste_a_signer > 1 ? "s" : ""}
                        </p>
                    )}
                </div>
            )}

            {/* Tableau des propositions avec colonne Signature */}
            {dataToShow.length > 0 ? (
                <>
                    <div
                        style={{
                            overflowX: "auto", // ← seul scroll horizontal
                            borderRadius: "12px",
                            border: "1px solid #f3f4f6",
                        }}
                    >
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "collapse",
                                fontSize: "13px",
                            }}
                        >
                            <thead>
                                <tr
                                    style={{
                                        backgroundColor: "#f9fafb",
                                        borderBottom: "2px solid #e5e7eb",
                                    }}
                                >
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px 12px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <MdPerson
                                            size={14}
                                            style={{ marginRight: "6px" }}
                                        />
                                        Signataire
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "right",
                                            padding: "14px 12px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <MdAttachMoney
                                            size={14}
                                            style={{ marginRight: "6px" }}
                                        />
                                        Montant proposé
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "left",
                                            padding: "14px 12px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <MdComment
                                            size={14}
                                            style={{ marginRight: "6px" }}
                                        />
                                        Commentaire
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            padding: "14px 12px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        Date
                                    </th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                            padding: "14px 12px",
                                            fontWeight: "600",
                                        }}
                                    >
                                        <MdImage
                                            size={14}
                                            style={{ marginRight: "6px" }}
                                        />
                                        Signature
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {dataToShow.map((proposition, index) => {
                                    const isLatest =
                                        index === dataToShow.length - 1;
                                    const roleColor = getRoleColor(
                                        proposition.role,
                                    );
                                    const montant =
                                        proposition.montant_propose ||
                                        proposition.montant ||
                                        0;
                                    const currencySymbol = getCurrencySymbol(
                                        proposition.devise || "CDF",
                                    );
                                    const signaturePath =
                                        proposition.signature_path;

                                    return (
                                        <tr
                                            key={proposition.id || index}
                                            style={{
                                                borderBottom:
                                                    "1px solid #f3f4f6",
                                                backgroundColor: isLatest
                                                    ? "#f0fdf4"
                                                    : "transparent",
                                            }}
                                        >
                                            <td
                                                style={{
                                                    padding: "14px 12px",
                                                    verticalAlign: "top",
                                                }}
                                            >
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        gap: "4px",
                                                    }}
                                                >
                                                    <span
                                                        style={{
                                                            fontWeight: "600",
                                                            color: "#1f2937",
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: "6px",
                                                        }}
                                                    >
                                                        {proposition.nom ||
                                                            proposition.signed_by}
                                                        {isLatest && (
                                                            <span
                                                                style={{
                                                                    backgroundColor:
                                                                        "#10b981",
                                                                    color: "white",
                                                                    fontSize:
                                                                        "9px",
                                                                    padding:
                                                                        "2px 8px",
                                                                    borderRadius:
                                                                        "20px",
                                                                }}
                                                            >
                                                                <MdStar
                                                                    size={10}
                                                                />
                                                                {/* Dernière */}
                                                            </span>
                                                        )}
                                                    </span>
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: roleColor,
                                                            backgroundColor: `${roleColor}10`,
                                                            padding: "2px 8px",
                                                            borderRadius:
                                                                "20px",
                                                            display:
                                                                "inline-block",
                                                            width: "fit-content",
                                                        }}
                                                    >
                                                        {proposition.role}
                                                    </span>
                                                </div>
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 12px",
                                                    textAlign: "right",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                <span
                                                    style={{
                                                        fontWeight: "700",
                                                        fontSize: "15px",
                                                        color: isLatest
                                                            ? "#10b981"
                                                            : "#1f2937",
                                                    }}
                                                >
                                                    {formatCurrency(montant)}{" "}
                                                    {currencySymbol}
                                                </span>
                                            </td>
                                            {/* <td style={{ padding: "14px 12px", verticalAlign: "middle" }}>
                                                {proposition.commentaire ? (
                                                    <div style={{ backgroundColor: "#fffbeb", padding: "8px 12px", borderRadius: "10px", borderLeft: `3px solid ${isLatest ? "#10b981" : "#f59e0b"}`, maxWidth: "350px" }}>
                                                        <span style={{ fontSize: "12px", color: "#92400e" }}>{proposition.commentaire}</span>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: "12px", color: "#9ca3af", fontStyle: "italic" }}>Aucun commentaire</span>
                                                )}
                                            </td> */}
                                            <td
                                                style={{
                                                    padding: "14px 12px",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {proposition.commentaire ? (
                                                    <div
                                                        style={{
                                                            backgroundColor:
                                                                "#fffbeb",
                                                            padding: "8px 12px",
                                                            borderRadius:
                                                                "10px",
                                                            borderLeft: `3px solid ${isLatest ? "#10b981" : "#f59e0b"}`,
                                                            wordBreak:
                                                                "break-word",
                                                            overflowWrap:
                                                                "break-word",
                                                            whiteSpace:
                                                                "normal",
                                                            maxWidth: "100%",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                fontSize:
                                                                    "12px",
                                                                color: "#92400e",
                                                            }}
                                                        >
                                                            {
                                                                proposition.commentaire
                                                            }
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontSize: "12px",
                                                            color: "#9ca3af",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        Aucun commentaire
                                                    </span>
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 12px",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {formatDate(
                                                    proposition.created_at ||
                                                        proposition.date,
                                                )}
                                            </td>
                                            <td
                                                style={{
                                                    padding: "14px 12px",
                                                    textAlign: "center",
                                                    verticalAlign: "middle",
                                                }}
                                            >
                                                {signaturePath ? (
                                                    <div
                                                        style={{
                                                            display: "flex",
                                                            justifyContent:
                                                                "center",
                                                        }}
                                                    >
                                                        {signaturePath ? (
                                                            <Zoom
                                                                zoomMargin={40}
                                                            >
                                                                <img
                                                                    src={`/storage/${signaturePath}`}
                                                                    alt="Signature"
                                                                    style={{
                                                                        width: "50px",
                                                                        height: "50px",
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            "6px",
                                                                        border: "1px solid #e5e7eb",
                                                                        boxShadow:
                                                                            "0 1px 3px rgba(0,0,0,0.05)",
                                                                        cursor: "pointer",
                                                                    }}
                                                                />
                                                            </Zoom>
                                                        ) : (
                                                            <span
                                                                style={{
                                                                    fontSize:
                                                                        "11px",
                                                                    color: "#9ca3af",
                                                                    fontStyle:
                                                                        "italic",
                                                                }}
                                                            >
                                                                Non renseignée
                                                            </span>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span
                                                        style={{
                                                            fontSize: "11px",
                                                            color: "#9ca3af",
                                                            fontStyle: "italic",
                                                        }}
                                                    >
                                                        Non renseignée
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Pied de tableau */}
                    <div
                        style={{
                            marginTop: "20px",
                            padding: "16px",
                            backgroundColor: "#f9fafb",
                            borderRadius: "12px",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "12px",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                gap: "24px",
                                flexWrap: "wrap",
                            }}
                        >
                            <div>
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#6b7280",
                                    }}
                                >
                                    Nombre de propositions
                                </span>
                                <div
                                    style={{
                                        fontWeight: "700",
                                        fontSize: "18px",
                                        color: "#1f2937",
                                    }}
                                >
                                    {dataToShow.length}
                                </div>
                            </div>
                            <div>
                                <span
                                    style={{
                                        fontSize: "11px",
                                        color: "#6b7280",
                                    }}
                                >
                                    Montant final proposé
                                </span>
                                <div
                                    style={{
                                        fontWeight: "700",
                                        fontSize: "18px",
                                        color: "#10b981",
                                    }}
                                >
                                    {formatCurrency(
                                        dataToShow[dataToShow.length - 1]
                                            ?.montant_propose || 0,
                                    )}{" "}
                                    {getCurrencySymbol(
                                        dataToShow[dataToShow.length - 1]
                                            ?.devise || "CDF",
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            backgroundColor: "#f3f4f6",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 20px",
                        }}
                    >
                        <MdHistory size={40} color="#9ca3af" />
                    </div>
                    <h3
                        style={{
                            fontSize: "18px",
                            color: "#374151",
                            marginBottom: "8px",
                        }}
                    >
                        Aucune proposition
                    </h3>
                    <p style={{ fontSize: "14px", color: "#6b7280" }}>
                        Aucune proposition n'a été trouvée pour ce dossier
                    </p>
                </div>
            )}
        </div>
    );
};

export default PropositionsHistory;
