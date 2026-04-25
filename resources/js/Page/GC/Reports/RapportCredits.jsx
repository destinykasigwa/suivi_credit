import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";

export default function RapportCredits() {
    const [credits, setCredits] = useState([]);
    const [filteredCredits, setFilteredCredits] = useState([]);
    const [displayedCredits, setDisplayedCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [type_recherche, setType_recherche] = useState("");
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Filtres
    const [selectedAgence, setSelectedAgence] = useState("");
    const [selectedGestionnaire, setSelectedGestionnaire] = useState("");
    const [selectedTypeCredit, setSelectedTypeCredit] = useState("");
    const [selectedProduit, setSelectedProduit] = useState("");
    const [selectedMonnaie, setSelectedMonnaie] = useState("");
    const [selectedStatut, setSelectedStatut] = useState("");

    // Informations de l'organisation
    const organisation = {
        nom: "COOPEC AKIBA YETU",
        slogan: "Ensemble pour un avenir prospère",
        adresse:
            "Rue N°13 Avenue Mont-Goma N°23 / Rue NZUMUKA James; Commune de GOMA Nord-Kivu, RDCongo, A côté du bureau de la DGI.",
        telephone: "+243 970 237 272",
        email: "contact@coopecakibayetu.org",
        siteWeb: "www.coopecakibayetu.org",
        logo: "/images/logo/logo.png",
    };

    useEffect(() => {
        fetchCredits();
    }, []);

    const fetchCredits = async () => {
        try {
            setIsLoading(true);
            const response = await axios.get("/gestion_credit/credits/rapport");
            console.log("Réponse API:", response.data);

            let data = [];
            if (response.data.status === 1 && response.data.data) {
                data = response.data.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            } else if (
                response.data.data &&
                Array.isArray(response.data.data)
            ) {
                data = response.data.data;
            }

            setCredits(data);
            setFilteredCredits(data);
            setIsLoading(false);
        } catch (error) {
            console.error("Erreur lors du chargement:", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Impossible de charger les données des crédits",
                confirmButtonColor: "#20c997",
            });
            setCredits([]);
            setFilteredCredits([]);
            setIsLoading(false);
        }
    };

    // Filtrer les données
    useEffect(() => {
        let filtered = [...credits];

        if (type_recherche === "AC") {
            filtered = filtered.filter((credit) =>
                credit.recouvreur
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            );
        } else if (type_recherche === "type_credit") {
            filtered = filtered.filter((credit) =>
                credit.type_credit
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()),
            );
        } else if (type_recherche === "credit_refuse") {
            filtered = filtered.filter(
                (credit) => credit.statutDossier === "Refusé",
            );
        } else if (searchTerm && type_recherche !== "credit_refuse") {
            filtered = filtered.filter(
                (credit) =>
                    credit.NumCompte?.toLowerCase().includes(
                        searchTerm.toLowerCase(),
                    ) ||
                    credit.NomCompte?.toLowerCase().includes(
                        searchTerm.toLowerCase(),
                    ) ||
                    credit.recouvreur
                        ?.toLowerCase()
                        .includes(searchTerm.toLowerCase()),
            );
        }

        if (dateDebut && dateFin) {
            filtered = filtered.filter((credit) => {
                const dateCredit = new Date(credit.date_demande);
                const debut = new Date(dateDebut);
                const fin = new Date(dateFin);
                return dateCredit >= debut && dateCredit <= fin;
            });
        }

        if (selectedAgence) {
            filtered = filtered.filter(
                (credit) => credit.Agence === selectedAgence,
            );
        }
        if (selectedGestionnaire) {
            filtered = filtered.filter(
                (credit) => credit.recouvreur === selectedGestionnaire,
            );
        }
        if (selectedTypeCredit) {
            filtered = filtered.filter(
                (credit) => credit.type_credit === selectedTypeCredit,
            );
        }
        if (selectedProduit) {
            filtered = filtered.filter(
                (credit) => credit.produit_credit === selectedProduit,
            );
        }
        if (selectedMonnaie) {
            filtered = filtered.filter(
                (credit) => credit.monnaie === selectedMonnaie,
            );
        }
        if (selectedStatut) {
            filtered = filtered.filter(
                (credit) => credit.statutDossier === selectedStatut,
            );
        }

        setFilteredCredits(filtered);
        setCurrentPage(1);
    }, [
        searchTerm,
        dateDebut,
        dateFin,
        selectedAgence,
        selectedGestionnaire,
        selectedTypeCredit,
        selectedProduit,
        selectedMonnaie,
        selectedStatut,
        credits,
        type_recherche,
    ]);

    // Pagination
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setDisplayedCredits(
            filteredCredits.slice(indexOfFirstItem, indexOfLastItem),
        );
    }, [filteredCredits, currentPage, itemsPerPage]);

    const totalPages = Math.ceil(filteredCredits.length / itemsPerPage);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
    };

    const resetFilters = () => {
        setSearchTerm("");
        setType_recherche("");
        setDateDebut("");
        setDateFin("");
        setSelectedAgence("");
        setSelectedGestionnaire("");
        setSelectedTypeCredit("");
        setSelectedProduit("");
        setSelectedMonnaie("");
        setSelectedStatut("");
        setFilteredCredits(credits);
        setCurrentPage(1);
    };

    const agencesUniques = [
        ...new Set(credits.map((c) => c.Agence).filter(Boolean)),
    ];
    const gestionnairesUniques = [
        ...new Set(credits.map((c) => c.recouvreur).filter(Boolean)),
    ];
    const typesCreditUniques = [
        ...new Set(credits.map((c) => c.type_credit).filter(Boolean)),
    ];
    const produitsUniques = [
        ...new Set(credits.map((c) => c.produit_credit).filter(Boolean)),
    ];
    const monnaiesUniques = [
        ...new Set(credits.map((c) => c.monnaie).filter(Boolean)),
    ];
    const statutUniques = [
        ...new Set(credits.map((c) => c.statutDossier).filter(Boolean)),
    ];
    const totalMontant = filteredCredits.reduce(
        (sum, credit) => sum + (parseFloat(credit.montant_demande) || 0),
        0,
    );
    const nombreTotal = filteredCredits.length;

    const exportToExcel = () => {
        const exportData = filteredCredits.map((credit) => ({
            "N° Compte": credit.NumCompte,
            "Nom du client": credit.NomCompte,
            Agence: credit.Agence,
            // "Produit crédit": credit.produit_credit,
            "Type crédit": credit.type_credit,
            // "Gestionnaire": credit.recouvreur,
            "Montant demandé": `${numberWithSpaces(credit.montant_demande)}`,
            "Montant Accordé": `${numberWithSpaces(credit.dernier_montant)}`,
            "Date demande": credit.date_demande
                ? new Date(credit.date_demande).toLocaleDateString("fr-FR")
                : "",
                 "Date octroie": credit.date_octroie
                ? new Date(credit.date_octroie).toLocaleDateString("fr-FR")
                : "",
                
            "Devise": credit.monnaie,
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rapport Crédits");
        XLSX.writeFile(
            wb,
            `rapport_credits_${new Date().toISOString().split("T")[0]}.xlsx`,
        );
        Swal.fire({
            icon: "success",
            title: "Export réussi",
            text: "Le fichier Excel a été téléchargé",
            confirmButtonColor: "#20c997",
            timer: 2000,
        });
    };
    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0,00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    const cleanAmount = (val) => {
        if (!val) return 0;

        return (
            Number(
                val
                    .toString()
                    .replace(/\s/g, "") // enlève espaces (10 000 → 10000)
                    .replace(/,/g, "."), // virgule → point
            ) || 0
        );
    };

    const totalDemande = filteredCredits.reduce(
        (sum, c) => sum + cleanAmount(c.montant_demande),
        0,
    );

    const totalAccorde = filteredCredits.reduce(
        (sum, c) => sum + cleanAmount(c.dernier_montant),
        0,
    );

    const getBase64ImageFromURL = async (url) => {
        const res = await fetch(url);
        const blob = await res.blob();

        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    };
    // Exporter en PDF avec logo
    // const exportToPDF = async () => {
    //     if (!filteredCredits || filteredCredits.length === 0) {
    //         Swal.fire(
    //             "Aucune donnée",
    //             "Il n'y a aucun crédit à exporter.",
    //             "info",
    //         );
    //         return;
    //     }

    //     Swal.fire({
    //         title: "Génération du PDF...",
    //         allowOutsideClick: false,
    //         didOpen: () => Swal.showLoading(),
    //     });

    //     try {
    //         const pdf = new jsPDF("l", "mm", "a4");

    //         // ============================
    //         // LOGO
    //         // ============================
    //         let logoBase64 = null;
    //         if (organisation?.logo) {
    //             try {
    //                 logoBase64 = await getBase64ImageFromURL(organisation.logo);
    //             } catch (e) {
    //                 console.warn("Logo non chargé", e);
    //             }
    //         }

    //         // ============================
    //         // DONNÉES
    //         // ============================
    //         const columns = [
    //             "N° Compte",
    //             "Nom client",
    //             "Agence",
    //             "Produit",
    //             "Montant demandé",
    //             "Montant accordé",
    //             "Monnaie",
    //             "Date demande",
    //         ];

    //         const rows = filteredCredits.map((c) => [
    //             c.NumCompte || "",
    //             c.NomCompte || "",
    //             c.Agence || "",
    //             c.type_credit || "",
    //             numberWithSpaces(c.montant_demande ?? 0),
    //             numberWithSpaces(c.dernier_montant ?? 0),
    //             c.monnaie || "",
    //             c.date_demande
    //                 ? new Date(c.date_demande).toLocaleDateString("fr-FR")
    //                 : "-",
    //         ]);

    //         // Calcul des totaux
    //         const totalDemandeFormatted = numberWithSpaces(totalDemande);
    //         const totalAccordeFormatted = numberWithSpaces(totalAccorde);

    //         // ============================
    //         // EN-TÊTE PERSONNALISÉ
    //         // ============================
    //         const addHeader = () => {
    //             // Logo
    //             if (logoBase64) {
    //                 pdf.addImage(logoBase64, "PNG", 14, 10, 35, 18);
    //             }

    //             // Titre principal
    //             pdf.setFontSize(18);
    //             pdf.setFont("helvetica", "bold");
    //             pdf.setTextColor(41, 128, 185); // Bleu élégant
    //             pdf.text(
    //                 "RAPPORT DES CRÉDITS ETUDIES",
    //                 pdf.internal.pageSize.getWidth() / 2,
    //                 18,
    //                 {
    //                     align: "center",
    //                 },
    //             );

    //             // Ligne décorative sous le titre
    //             pdf.setDrawColor(41, 128, 185);
    //             pdf.setLineWidth(0.5);
    //             pdf.line(
    //                 pdf.internal.pageSize.getWidth() / 2 - 60,
    //                 22,
    //                 pdf.internal.pageSize.getWidth() / 2 + 60,
    //                 22,
    //             );

    //             // Infos de génération (gauche)
    //             pdf.setFontSize(9);
    //             pdf.setFont("helvetica", "normal");
    //             pdf.setTextColor(80, 80, 80);
    //             pdf.text(
    //                 `Généré le : ${new Date().toLocaleString("fr-FR")}`,
    //                 14,
    //                 32,
    //             );
    //             pdf.text(`Nombre de crédits : ${filteredCredits.length}`, 14, 38);
    //             pdf.text(`Total demandé : ${totalDemandeFormatted}`, 14, 44);
    //             pdf.text(`Total accordé : ${totalAccordeFormatted}`, 14, 50);

    //             // Informations de l'organisation (droite)
    //             if (organisation) {
    //                 pdf.setFontSize(9);
    //                 pdf.setTextColor(80, 80, 80);
    //                 let yOrg = 32;
    //                 if (organisation.nom) {
    //                     pdf.text(
    //                         organisation.nom,
    //                         pdf.internal.pageSize.getWidth() - 14,
    //                         yOrg,
    //                         { align: "right" },
    //                     );
    //                     yOrg += 6;
    //                 }
    //                 if (organisation.telephone) {
    //                     pdf.text(
    //                         organisation.telephone,
    //                         pdf.internal.pageSize.getWidth() - 14,
    //                         yOrg,
    //                         { align: "right" },
    //                     );
    //                     yOrg += 6;
    //                 }
    //                 if (organisation.email) {
    //                     pdf.text(
    //                         organisation.email,
    //                         pdf.internal.pageSize.getWidth() - 14,
    //                         yOrg,
    //                         { align: "right" },
    //                     );
    //                 }
    //             }
    //         };

    //         // ============================
    //         // PIED DE PAGE
    //         // ============================
    //         const addFooter = () => {
    //             const pageCount = pdf.internal.getNumberOfPages();
    //             for (let i = 1; i <= pageCount; i++) {
    //                 pdf.setPage(i);
    //                 pdf.setFontSize(8);
    //                 pdf.setTextColor(150, 150, 150);
    //                 pdf.text(
    //                     `Page ${i} / ${pageCount}`,
    //                     pdf.internal.pageSize.getWidth() / 2,
    //                     pdf.internal.pageSize.getHeight() - 8,
    //                     { align: "center" },
    //                 );
    //                 // Ligne de séparation
    //                 pdf.setDrawColor(200, 200, 200);
    //                 pdf.line(
    //                     14,
    //                     pdf.internal.pageSize.getHeight() - 12,
    //                     pdf.internal.pageSize.getWidth() - 14,
    //                     pdf.internal.pageSize.getHeight() - 12,
    //                 );
    //             }
    //         };

    //         // ============================
    //         // TABLEAU AVEC DESIGN AMÉLIORÉ
    //         // ============================
    //         autoTable(pdf, {
    //             head: [columns],
    //             body: rows,
    //              showHead: "firstPage",   // ← L'en-tête n'apparaît que sur la première page
    //             startY: 58, // Ajusté pour laisser place à l'en-tête enrichi

    //             // Styles généraux
    //             styles: {
    //                 fontSize: 9,
    //                 font: "helvetica",
    //                 cellPadding: { top: 3, right: 4, bottom: 3, left: 4 },
    //                 lineColor: [220, 220, 220],
    //                 lineWidth: 0.2,
    //                 valign: "middle",
    //             },

    //             // Style des en-têtes
    //             headStyles: {
    //                 fillColor: [41, 128, 185], // Bleu professionnel
    //                 textColor: [255, 255, 255],
    //                 fontStyle: "bold",
    //                 fontSize: 10,
    //                 halign: "center",
    //                 valign: "middle",
    //                 lineWidth: 0,
    //             },

    //             // Alternance des lignes (zebra)
    //             alternateRowStyles: {
    //                 fillColor: [245, 248, 250], // Gris très clair
    //             },

    //             // Alignement des colonnes
    //             columnStyles: {
    //                 0: { halign: "center" }, // N° Compte
    //                 4: { halign: "right" }, // Montant demandé
    //                 5: { halign: "right" }, // Montant accordé
    //                 6: { halign: "center" }, // Monnaie
    //                 7: { halign: "center" }, // Date demande
    //             },

    //             // Bordures : toutes sauf la bordure extérieure pour un look épuré
    //             bodyStyles: {
    //                 lineWidth: 0.1,
    //                 lineColor: [230, 230, 230],
    //             },

    //             // Marge horizontale
    //             margin: { left: 14, right: 14, top: 0, bottom: 20 },

    //             // Événement pour ajouter l'en-tête sur chaque page
    //             didDrawPage: function (data) {
    //                 // Éviter de redessiner l'en-tête sur la première page déjà faite manuellement
    //                 if (data.pageNumber === 1) {
    //                     addHeader();
    //                 } else {
    //                     // Pour les pages suivantes, un en-tête simplifié
    //                     pdf.setFontSize(12);
    //                     pdf.setFont("helvetica", "bold");
    //                     pdf.setTextColor(41, 128, 185);
    //                     pdf.text(
    //                         "RAPPORT DES CRÉDITS ETUDIES (suite)",
    //                         pdf.internal.pageSize.getWidth() / 2,
    //                         15,
    //                         {
    //                             align: "center",
    //                         },
    //                     );
    //                     pdf.setDrawColor(41, 128, 185);
    //                     pdf.line(
    //                         pdf.internal.pageSize.getWidth() / 2 - 40,
    //                         18,
    //                         pdf.internal.pageSize.getWidth() / 2 + 40,
    //                         18,
    //                     );
    //                 }
    //             },
    //         });

    //         // Ajout du pied de page sur toutes les pages
    //         addFooter();

    //         // Sauvegarde du PDF
    //         pdf.save("rapport_credits.pdf");

    //         Swal.fire({
    //             icon: "success",
    //             title: "Export réussi",
    //             timer: 2000,
    //             showConfirmButton: false,
    //         });
    //     } catch (error) {
    //         console.error(error);
    //         Swal.fire("Erreur", "Échec de génération du PDF", "error");
    //     }
    // };

  const exportToPDF = async () => {
    if (!filteredCredits || filteredCredits.length === 0) {
        Swal.fire("Aucune donnée", "Il n'y a aucun crédit à exporter.", "info");
        return;
    }

    Swal.fire({
        title: "Génération du PDF...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
    });

    try {
        const pdf = new jsPDF("l", "mm", "a4");

        let logoBase64 = null;
        if (organisation?.logo) {
            try {
                logoBase64 = await getBase64ImageFromURL(organisation.logo);
            } catch (e) {
                console.warn("Logo non chargé", e);
            }
        }

        const columns = [
            "N° Compte",
            "Nom client",
            "Agence",
            "Produit",
            "Montant demandé",
            "Montant accordé",
            "Monnaie",
            "Date demande",
            "Date octroie"
        ];

        const rows = filteredCredits.map((c) => [
            c.NumCompte || "",
            c.NomCompte || "",
            c.Agence || "",
            c.type_credit || "",
            numberWithSpaces(c.montant_demande ?? 0),
            numberWithSpaces(c.dernier_montant ?? 0),
            c.monnaie || "",
            c.date_demande
                ? new Date(c.date_demande).toLocaleDateString("fr-FR")
                : "-",
                  c.date_octroie
                ? new Date(c.date_octroie).toLocaleDateString("fr-FR")
                : "-",
        ]);

        const totalDemandeFormatted = numberWithSpaces(totalDemande);
        const totalAccordeFormatted = numberWithSpaces(totalAccorde);

        // ============================
        // HEADER (SEULEMENT PAGE 1)
        // ============================
        const addHeader = () => {
            const pageWidth = pdf.internal.pageSize.getWidth();

            if (logoBase64) {
                pdf.addImage(logoBase64, "PNG", 14, 10, 35, 18);
            }

            pdf.setFontSize(16);
            pdf.setFont("helvetica", "bold");
            pdf.setTextColor(41, 128, 185);

            pdf.text(
                "RAPPORT DES CRÉDITS ETUDIÉS",
                pageWidth / 2,
                16,
                { align: "center" }
            );

            pdf.setDrawColor(41, 128, 185);
            pdf.line(pageWidth / 2 - 60, 20, pageWidth / 2 + 60, 20);

            if (organisation) {
                let y = 12;

                pdf.setFontSize(9);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);

                pdf.text(organisation.nom || "", pageWidth - 14, y, {
                    align: "right",
                });

                y += 5;

                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(80, 80, 80);

                if (organisation.slogan) {
                    pdf.text(organisation.slogan, pageWidth - 14, y, {
                        align: "right",
                    });
                    y += 5;
                }

                if (organisation.telephone) {
                    pdf.text(`Tél: ${organisation.telephone}`, pageWidth - 14, y, {
                        align: "right",
                    });
                    y += 5;
                }

                if (organisation.email) {
                    pdf.text(organisation.email, pageWidth - 14, y, {
                        align: "right",
                    });
                }
            }

            return 30;
        };

        // ============================
        // FOOTER (SEULEMENT DERNIÈRE PAGE)
        // ============================
        const addFooter = () => {
            const pageCount = pdf.internal.getNumberOfPages();

            const pageHeight = pdf.internal.pageSize.getHeight();
            const pageWidth = pdf.internal.pageSize.getWidth();

            // Aller à la dernière page uniquement
            pdf.setPage(pageCount);

            pdf.setDrawColor(200, 200, 200);
            pdf.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);

            pdf.setFontSize(10);
            pdf.setTextColor(80, 80, 80);
            pdf.setFont("helvetica", "normal");

            pdf.text(
                `Généré le : ${new Date().toLocaleString("fr-FR")}`,
                14,
                pageHeight - 15
            );

            pdf.text(
                `Nombre de crédits : ${filteredCredits.length}`,
                14,
                pageHeight - 10
            );

            pdf.text(
                `Total demandé : ${totalDemandeFormatted}`,
                100,
                pageHeight - 15
            );

            pdf.text(
                `Total accordé : ${totalAccordeFormatted}`,
                100,
                pageHeight - 10
            );

            // Pagination (dernière page)
            pdf.text(
                `Page ${pageCount} / ${pageCount}`,
                pageWidth - 14,
                pageHeight - 10,
                { align: "right" }
            );
        };

        // ============================
        // TABLE
        // ============================
        const headerHeight = addHeader();

        autoTable(pdf, {
            head: [columns],
            body: rows,
            startY: headerHeight + 15,
            showHead: "firstPage", // ✅ uniquement première pag

            styles: {
                fontSize: 9,
                font: "helvetica",
            },

            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: "bold",
            },

            margin: { left: 14, right: 14, bottom: 25 },

            didDrawPage: function (data) {
                // ✅ Header seulement page 1
                if (data.pageNumber === 1) {
                    addHeader();
                }
            },
        });

        // ✅ Footer seulement dernière page
        addFooter();

        pdf.save("rapport_credits.pdf");

        Swal.fire({
            icon: "success",
            title: "Export réussi",
            timer: 2000,
            showConfirmButton: false,
        });

    } catch (error) {
        console.error(error);
        Swal.fire("Erreur", "Échec de génération du PDF", "error");
    }
};

    // Fonctions utilitaires
    // function getProduitClass(type) {
    //     if (type === "Long terme") return "badge-produit-long";
    //     if (type === "Moyen terme") return "badge-produit-moyen";
    //     return "badge-produit-court";
    // }

    // function createHeaderHTML() {
    //     const div = document.createElement("div");
    //     div.style.marginBottom = "20px";
    //     div.style.borderBottom = "2px solid #20c997";
    //     div.style.paddingBottom = "10px";
    //     div.innerHTML = `
    //         <div style="display: flex; justify-content: space-between; align-items: center;">
    //             <div style="display: flex; align-items: center; gap: 15px;">
    //                 ${organisation.logo ? `<img src="${organisation.logo}" style="height: 60px;" />` : ''}
    //                 <div>
    //                     <h2 style="margin:0; color:#20c997;">${organisation.nom}</h2>
    //                     <p style="margin:0; font-size:12px; color:#666;">${organisation.slogan || ''}</p>
    //                 </div>
    //             </div>
    //             <div style="text-align: right; font-size:11px;">
    //                 <div>${organisation.adresse}</div>
    //                 <div>Tél: ${organisation.telephone}</div>
    //                 <div>Email: ${organisation.email}</div>
    //             </div>
    //         </div>
    //         <div style="text-align: center; margin-top: 15px;">
    //             <h3>RAPPORT DES CRÉDITS</h3>
    //             <p style="font-size:11px; color:#666;">
    //                 Généré le: ${new Date().toLocaleDateString("fr-FR")} |
    //                 Total: ${allCreditsData.length} crédits |
    //                 Montant total: ${numberWithSpaces(totalMontant)}
    //                 ${selectedAgence ? ` | Agence: ${selectedAgence}` : ''}
    //                 ${selectedGestionnaire ? ` | Gestionnaire: ${selectedGestionnaire}` : ''}
    //                 ...
    //             </p>
    //         </div>
    //     `;
    //     return div;
    // }

    // Fonction utilitaire pour charger une image en base64 (gère CORS et redimensionnement)
    // const loadImageAsBase64 = (url) => {
    //     return new Promise((resolve, reject) => {
    //         const img = new Image();
    //         img.crossOrigin = "Anonymous";
    //         img.onload = () => {
    //             const canvas = document.createElement('canvas');
    //             const maxWidth = 180;  // pixels, correspond à ~45mm
    //             const maxHeight = 72;   // pixels, correspond à ~18mm
    //             let width = img.width;
    //             let height = img.height;
    //             if (width > maxWidth) {
    //                 height = (height * maxWidth) / width;
    //                 width = maxWidth;
    //             }
    //             if (height > maxHeight) {
    //                 width = (width * maxHeight) / height;
    //                 height = maxHeight;
    //             }
    //             canvas.width = width;
    //             canvas.height = height;
    //             const ctx = canvas.getContext('2d');
    //             ctx.drawImage(img, 0, 0, width, height);
    //             resolve(canvas.toDataURL('image/png'));
    //         };
    //         img.onerror = () => reject(new Error(`Impossible de charger l'image: ${url}`));
    //         img.src = url;
    //     });
    // };

    if (isLoading) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: "400px" }}
            >
                <div className="text-center">
                    <div
                        className="spinner-border text-primary mb-3"
                        style={{ width: "3rem", height: "3rem" }}
                    />
                    <p className="text-muted">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            className="container-fluid py-4"
            style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
        >
            {/* En-tête avec logo officiel (visible à l'écran) */}
            <div className="no-print mb-4">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div
                        style={{
                            background: "teal",
                            padding: "12px 20px",
                            borderRadius: "8px 8px 0 0",
                            color: "#fff",
                        }}
                    >
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-4">
                                <h3
                                    className="fw-semibold mb-0"
                                    style={{
                                        color: "#1a2632 0%",
                                        letterSpacing: "0.3px",
                                    }}
                                >
                                    <i className="fas fa-file"></i> Rapports
                                </h3>
                            </div>
                            <div
                                className="text-end"
                                style={{
                                    color: "#1a2632 0%",
                                }}
                            >
                                <i className="fas fa-chart-line fa-3x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filtres et boutons */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 no-print">
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-3 align-items-center">
                        <div
                            className="flex-grow-1"
                            style={{ minWidth: "250px" }}
                        >
                            <div className="input-group">
                                <select
                                    className="form-select form-select-sm"
                                    style={{
                                        width: "auto",
                                        maxWidth: "180px",
                                        backgroundColor: "#f8f9fa",
                                        fontWeight: "500",
                                        borderRadius: "8px 0 0 8px",
                                    }}
                                    value={type_recherche}
                                    onChange={(e) => {
                                        setType_recherche(e.target.value);
                                        setSearchTerm("");
                                    }}
                                >
                                    <option value="">🔍 Recherche</option>
                                    <option value="AC">👤 Agent crédit</option>
                                    <option value="type_credit">
                                        📊 Type crédit
                                    </option>
                                    <option value="credit_refuse">
                                        ❌ Crédits refusés
                                    </option>
                                </select>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder={
                                        type_recherche === "AC"
                                            ? "Nom de l'agent crédit..."
                                            : type_recherche === "type_credit"
                                              ? "Type de crédit..."
                                              : "Rechercher par compte, nom..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    disabled={
                                        type_recherche === "credit_refuse"
                                    }
                                    style={{ borderRadius: "0 8px 8px 0" }}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                <i className="fas fa-filter me-1"></i> Filtres
                            </button>
                            <button
                                className="btn btn-sm btn-outline-warning"
                                onClick={resetFilters}
                            >
                                <i className="fas fa-undo-alt me-1"></i>{" "}
                                Réinitialiser
                            </button>
                            <button
                                className="btn btn-sm btn-success"
                                onClick={exportToExcel}
                            >
                                <i className="fas fa-file-excel me-1"></i> Excel
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={exportToPDF}
                            >
                                <i className="fas fa-file-pdf me-1"></i> PDF
                            </button>
                            {/* <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => window.print()}
                            >
                                <i className="fas fa-print me-1"></i> Imprimer
                            </button> */}
                        </div>
                    </div>
                    {showFilters && (
                        <div className="row mt-3 pt-3 border-top">
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Date début
                                </label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={dateDebut}
                                    onChange={(e) =>
                                        setDateDebut(e.target.value)
                                    }
                                />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Date fin
                                </label>
                                <input
                                    type="date"
                                    className="form-control form-control-sm"
                                    value={dateFin}
                                    onChange={(e) => setDateFin(e.target.value)}
                                />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Agence
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedAgence}
                                    onChange={(e) =>
                                        setSelectedAgence(e.target.value)
                                    }
                                >
                                    <option value="">Toutes</option>
                                    {agencesUniques.map((a) => (
                                        <option key={a} value={a}>
                                            {a}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Gestionnaire
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedGestionnaire}
                                    onChange={(e) =>
                                        setSelectedGestionnaire(e.target.value)
                                    }
                                >
                                    <option value="">Tous</option>
                                    {gestionnairesUniques.map((g) => (
                                        <option key={g} value={g}>
                                            {g}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Type crédit
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedTypeCredit}
                                    onChange={(e) =>
                                        setSelectedTypeCredit(e.target.value)
                                    }
                                >
                                    <option value="">Tous</option>
                                    {typesCreditUniques.map((t) => (
                                        <option key={t} value={t}>
                                            {t}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Produit crédit
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedProduit}
                                    onChange={(e) =>
                                        setSelectedProduit(e.target.value)
                                    }
                                >
                                    <option value="">Tous</option>
                                    {produitsUniques.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    Statut crédit
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedStatut}
                                    onChange={(e) =>
                                        setSelectedStatut(e.target.value)
                                    }
                                >
                                    <option value="">Tous</option>
                                    {statutUniques.map((p) => (
                                        <option key={p} value={p}>
                                            {p}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">
                                    <i className="fas fa-coins me-1"></i>{" "}
                                    Monnaie
                                </label>
                                <select
                                    className="form-select form-select-sm"
                                    value={selectedMonnaie}
                                    onChange={(e) =>
                                        setSelectedMonnaie(e.target.value)
                                    }
                                >
                                    <option value="">Toutes</option>
                                    {monnaiesUniques.map((m) => (
                                        <option key={m} value={m}>
                                            {m === "USD"
                                                ? "💵 USD"
                                                : m === "CDF"
                                                  ? "🇨🇩 CDF"
                                                  : m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistiques */}
            <div className="row mb-4 no-print">
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center">
                            <i className="fas fa-chart-simple fa-2x text-primary mb-2"></i>
                            <h3 className="fw-bold text-primary">
                                {nombreTotal}
                            </h3>
                            <p className="text-muted mb-0">Total crédits</p>
                        </div>
                    </div>
                </div>
                {/* <div className="col-md-3 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center">
                            <i className="fas fa-money-bill-wave fa-2x text-success mb-2"></i>
                            <h3 className="fw-bold text-success">
                                {numberWithSpaces(totalMontant)}
                            </h3>
                            <p className="text-muted mb-0">Montant total</p>
                        </div>
                    </div>
                </div> */}
                <div className="col-md-4 mb-4">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center">
                            <i className="fas fa-building fa-2x text-info mb-2"></i>
                            <p className="text-muted mb-0">Agences</p>
                            <h5 className="fw-bold">{agencesUniques.length}</h5>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center">
                            <i className="fas fa-user-tie fa-2x text-warning mb-2"></i>
                            <p className="text-muted mb-0">Gestionnaires</p>
                            <h5 className="fw-bold">
                                {gestionnairesUniques.length}
                            </h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== COMPOSANT TABLEAU =====  */}
            {/* TABLEAU MODERNE AVEC TOTAUX ÉLÉGANTS */}
            <div
                className="card shadow-sm border-0 rounded-3 overflow-hidden"
                id="table-credits"
            >
                <div className="card-body p-0">
                    <div
                        className="table-responsive"
                        style={{ overflowX: "auto" }}
                    >
                        <table className="modern-credit-table table-hover">
                            <thead>
                                <tr>
                                    <th>N° Compte</th>
                                    <th>Nom client</th>
                                    <th>Agence</th>
                                    <th>Produit</th>
                                    <th className="text-end">Montant Demandé</th>
                                    <th className="text-end">
                                        Montant accordé
                                    </th>
                                    <th>Monnaie</th>
                                    <th>Date demande</th>
                                    <th>Date octroie</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedCredits.length > 0 ? (
                                    displayedCredits.map((credit, idx) => (
                                        <tr key={idx}>
                                            <td
                                                className="fw-semibold"
                                                style={{ color: "#1f6e5c" }}
                                            >
                                                {credit.NumCompte}
                                            </td>
                                            <td>{credit.NomCompte}</td>
                                            <td>
                                                <span className="badge-modern badge-agence">
                                                    <i
                                                        className="fas fa-building"
                                                        style={{
                                                            fontSize: "0.7rem",
                                                        }}
                                                    ></i>
                                                    {credit.Agence}
                                                </span>
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge-modern ${credit.type_credit === "Long terme" ? "badge-produit-long" : credit.type_credit === "Moyen terme" ? "badge-produit-moyen" : "badge-produit-court"}`}
                                                >
                                                    {credit.type_credit}
                                                </span>
                                            </td>
                                            <td
                                                className="text-end fw-bold"
                                                style={{ color: "#1f6e5c" }}
                                            >
                                                {numberWithSpaces(
                                                    credit.montant_demande ?? 0,
                                                )}
                                            </td>
                                            <td
                                                className="text-end fw-bold"
                                                style={{ color: "#1f6e5c" }}
                                            >
                                                {numberWithSpaces(
                                                    credit.dernier_montant ?? 0,
                                                )}
                                            </td>
                                            <td>
                                                <span
                                                    className={`badge-modern ${credit.monnaie === "USD" ? "badge-monnaie-usd" : "badge-monnaie-cdf"}`}
                                                >
                                                    {credit.monnaie === "USD"
                                                        ? "💵 USD"
                                                        : "🇨🇩 CDF"}
                                                </span>
                                            </td>
                                            <td
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                <i className="far fa-calendar-alt me-1 text-muted"></i>
                                                {credit.date_demande
                                                    ? new Date(
                                                          credit.date_demande,
                                                      ).toLocaleDateString(
                                                          "fr-FR",
                                                      )
                                                    : "-"}
                                            </td>

                                              <td
                                                style={{ whiteSpace: "nowrap" }}
                                            >
                                                <i className="far fa-calendar-alt me-1 text-muted"></i>
                                                {credit.date_octroie
                                                    ? new Date(
                                                          credit.date_octroie,
                                                      ).toLocaleDateString(
                                                          "fr-FR",
                                                      )
                                                    : "-"}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="text-center py-5 text-muted"
                                        >
                                            <i className="fas fa-inbox fa-3x mb-2 d-block"></i>
                                            <p>Aucune donnée trouvée</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            {/* PIED DE TABLEAU MODERNE */}
                            {/* {displayedCredits.length > 0 && (
                                <tfoot className="table-footer-modern">
                                    <tr>
                                        <td
                                            colSpan="3"
                                            className="footer-label"
                                        >
                                            <i className="fas fa-chart-line me-2"></i>{" "}
                                            TOTAL GÉNÉRAL
                                        </td>
                                        <td></td>
                                        <td className="text-end footer-amount">
                                            {numberWithSpaces(totalDemande)}
                                        </td>
                                        <td className="text-end footer-amount">
                                            {numberWithSpaces(totalAccorde)}
                                        </td>
                                        <td colSpan="2"></td>
                                    </tr>
                                </tfoot>
                            )} */}
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {filteredCredits.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 no-print">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Afficher</span>
                        <select
                            className="form-select form-select-sm"
                            style={{ width: "70px" }}
                            value={itemsPerPage}
                            onChange={handleItemsPerPageChange}
                        >
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-muted small">entrées</span>
                    </div>
                    <div className="d-flex gap-1">
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => paginate(1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => paginate(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <i className="fas fa-angle-left"></i>
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2)
                                pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            return (
                                <button
                                    key={pageNum}
                                    className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-outline-secondary"}`}
                                    onClick={() => paginate(pageNum)}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => paginate(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-angle-right"></i>
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => paginate(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            <i className="fas fa-angle-double-right"></i>
                        </button>
                    </div>
                    <span className="text-muted small">
                        Page {currentPage} sur {totalPages} (
                        {filteredCredits.length} entrées)
                    </span>
                </div>
            )}

            <style>
                {`
                    @media print {
                        body { margin: 0; padding: 0; }
                        .no-print { display: none !important; }
                        .card { border: none !important; box-shadow: none !important; }
                        .table { width: 100%; border-collapse: collapse; }
                        .table th, .table td { border: 1px solid #ddd; padding: 8px; }
                        .badge { border: 1px solid #000; background: transparent !important; color: #000 !important; }
                        @page { size: landscape; margin: 1.5cm; }
                    }
                    .table-hover tbody tr:hover { background-color: #f8f9fa !important; transition: all 0.2s ease; }
                    ::-webkit-scrollbar { width: 8px; height: 8px; }
                    ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
                    ::-webkit-scrollbar-thumb { background: #1a5f4b; border-radius: 10px; }
                    ::-webkit-scrollbar-thumb:hover { background: #0d3d2f; }


                    /* ===== STYLES À PLACER DANS VOTRE CSS GLOBAL (ou en ligne via <style>) ===== */
/* Idéalement dans un fichier .css ou dans un <style> tag pour l'impression */

.modern-credit-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

.modern-credit-table thead th {
  position: sticky;
  top: 0;
  background: #f8fafc;
  color: #1e293b;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 14px 12px;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.modern-credit-table tbody td {
  padding: 12px 12px;
  font-size: 0.85rem;
  border-bottom: 1px solid #eef2f6;
  vertical-align: middle;
  color: #334155;
}

.modern-credit-table tbody tr:hover {
  background-color: #f1f5f9;
  transition: 0.2s;
}

/* Largeurs de colonnes pour éviter le débordement */
.modern-credit-table th:nth-child(1), .modern-credit-table td:nth-child(1) { min-width: 90px; } /* N_Compte */
.modern-credit-table th:nth-child(2), .modern-credit-table td:nth-child(2) { min-width: 160px; } /* Nom_client */
.modern-credit-table th:nth-child(3), .modern-credit-table td:nth-child(3) { min-width: 100px; } /* Agence */
.modern-credit-table th:nth-child(4), .modern-credit-table td:nth-child(4) { min-width: 110px; } /* Produit */
.modern-credit-table th:nth-child(5), .modern-credit-table td:nth-child(5) { min-width: 110px; text-align: right; } /* Montant */
.modern-credit-table th:nth-child(6), .modern-credit-table td:nth-child(6) { min-width: 110px; text-align: right; } /* Montant_Accordé */
.modern-credit-table th:nth-child(7), .modern-credit-table td:nth-child(7) { min-width: 80px; } /* Monnaie */
.modern-credit-table th:nth-child(8), .modern-credit-table td:nth-child(8) { min-width: 105px; } /* Date_demande */

/* Badges modernes */
.badge-modern {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 30px;
  font-weight: 500;
  font-size: 0.75rem;
  background-color: #f1f5f9;
  color: #1e293b;
}

.badge-agence {
  background-color: #eef2ff;
  color: #1e40af;
}

.badge-produit-long {
  background-color: #dcfce7;
  color: #166534;
}
.badge-produit-moyen {
  background-color: #dbeafe;
  color: #1e3a8a;
}
.badge-produit-court {
  background-color: #ffe4e6;
  color: #9f1239;
}

.badge-monnaie-usd {
  background-color: #ccf0eb;
  color: #0f5b4b;
}
.badge-monnaie-cdf {
  background-color: #fff3e3;
  color: #b45309;
}

/* Impression : fond blanc, pas de sticky, tailles adaptées */
@media print {
  .modern-credit-table thead th {
    position: static;
    background: #e9ecef !important;
    color: black !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .modern-credit-table tbody td {
    padding: 8px 6px;
    font-size: 9pt;
  }
  .badge-modern {
    background-color: #f0f0f0 !important;
    border: 1px solid #ccc;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .card, .card-body {
    box-shadow: none !important;
    border: none !important;
    padding: 0 !important;
  }
  .table-responsive {
    overflow: visible !important;
  }
}


/* Pied de tableau élégant */
.table-footer-modern {
  background-color: #f8fafc;
  border-top: 2px solid #20c997;
  font-weight: bold;
}

.table-footer-modern .footer-label {
  padding: 12px 8px;
  font-size: 0.9rem;
  color: #0f5b4b;
}

.table-footer-modern .footer-amount {
  padding: 12px 8px;
  font-size: 0.95rem;
  background-color: #ecfdf5;
  color: #1f6e5c;
  border-radius: 8px;
  font-weight: 700;
}

/* Garantir l'impression du footer */
@media print {
  tfoot {
    display: table-footer-group;
    break-inside: avoid;
    page-break-inside: avoid;
  }
  .table-footer-modern {
    background-color: #f1f5f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .table-footer-modern .footer-amount {
    background-color: #e2e8f0 !important;
    color: #000 !important;
  }
  .card, .card-body, .table-responsive {
    overflow: visible !important;
    box-shadow: none !important;
  }
}
                `}
            </style>
        </div>
    );
}
