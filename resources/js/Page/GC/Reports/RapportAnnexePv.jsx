import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as FileSaver from "file-saver";

export default function RapportAnnexePv() {
    const [credits, setCredits] = useState([]);
    const [filteredCredits, setFilteredCredits] = useState([]);
    const [displayedCredits, setDisplayedCredits] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Recherche globale
    const [searchTerm, setSearchTerm] = useState("");
    const [type_recherche, setType_recherche] = useState("");

    // Filtres additionnels
    const [dateDebut, setDateDebut] = useState("");
    const [dateFin, setDateFin] = useState("");
    const [selectedAgence, setSelectedAgence] = useState("");
    const [selectedGestionnaire, setSelectedGestionnaire] = useState("");
    const [selectedTypeCredit, setSelectedTypeCredit] = useState("");
    const [selectedProduit, setSelectedProduit] = useState("");
    const [selectedMonnaie, setSelectedMonnaie] = useState("");
    const [selectedStatut, setSelectedStatut] = useState("");
    const [showFilters, setShowFilters] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Organisation
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
            let data = [];
            if (response.data.status === 1 && response.data.data) {
                data = response.data.data;
            } else if (Array.isArray(response.data)) {
                data = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
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

    // Filtrage
    useEffect(() => {
        let filtered = [...credits];

        // Recherche textuelle selon le type
        if (type_recherche === "AC") {
            filtered = filtered.filter((c) =>
                c.recouvreur?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (type_recherche === "type_credit") {
            filtered = filtered.filter((c) =>
                c.type_credit?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (type_recherche === "credit_refuse") {
            filtered = filtered.filter((c) => c.statutDossier === "Refusé");
        } else if (searchTerm) {
            filtered = filtered.filter(
                (c) =>
                    c.NumCompte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.NomCompte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    c.recouvreur?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Plage de dates
        if (dateDebut && dateFin) {
            filtered = filtered.filter((c) => {
                const dateCredit = new Date(c.date_demande);
                const debut = new Date(dateDebut);
                const fin = new Date(dateFin);
                return dateCredit >= debut && dateCredit <= fin;
            });
        }

        // Filtres sélectifs
        if (selectedAgence) filtered = filtered.filter((c) => c.Agence === selectedAgence);
        if (selectedGestionnaire) filtered = filtered.filter((c) => c.recouvreur === selectedGestionnaire);
        if (selectedTypeCredit) filtered = filtered.filter((c) => c.type_credit === selectedTypeCredit);
        if (selectedProduit) filtered = filtered.filter((c) => c.produit_credit === selectedProduit);
        if (selectedMonnaie) filtered = filtered.filter((c) => c.monnaie === selectedMonnaie);
        if (selectedStatut) filtered = filtered.filter((c) => c.statutDossier === selectedStatut);

        setFilteredCredits(filtered);
        setCurrentPage(1);
    }, [
        searchTerm, type_recherche, dateDebut, dateFin,
        selectedAgence, selectedGestionnaire, selectedTypeCredit,
        selectedProduit, selectedMonnaie, selectedStatut, credits,
    ]);

    // Pagination
    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setDisplayedCredits(filteredCredits.slice(indexOfFirstItem, indexOfLastItem));
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

    // Listes uniques pour les filtres
    const agencesUniques = [...new Set(credits.map((c) => c.Agence).filter(Boolean))];
    const gestionnairesUniques = [...new Set(credits.map((c) => c.recouvreur).filter(Boolean))];
    const typesCreditUniques = [...new Set(credits.map((c) => c.type_credit).filter(Boolean))];
    const produitsUniques = [...new Set(credits.map((c) => c.produit_credit).filter(Boolean))];
    const monnaiesUniques = [...new Set(credits.map((c) => c.monnaie).filter(Boolean))];
    const statutUniques = [...new Set(credits.map((c) => c.statutDossier).filter(Boolean))];

    // Totaux
    const totalDemandeUSD = filteredCredits
        .filter((c) => c.monnaie === "USD")
        .reduce((sum, c) => sum + parseFloat(c.montant_demande || 0), 0);
    const totalOctroiUSD = filteredCredits
        .filter((c) => c.monnaie === "USD")
        .reduce((sum, c) => sum + parseFloat(c.dernier_montant || 0), 0);
    const totalDemandeCDF = filteredCredits
        .filter((c) => c.monnaie === "CDF")
        .reduce((sum, c) => sum + parseFloat(c.montant_demande || 0), 0);
    const totalOctroiCDF = filteredCredits
        .filter((c) => c.monnaie === "CDF")
        .reduce((sum, c) => sum + parseFloat(c.dernier_montant || 0), 0);

    const nombreTotal = filteredCredits.length;

    // Formatage avec espaces
    function numberWithSpaces(x) {
        if (x === null || x === undefined) return "0,00";
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }

    const cleanAmount = (val) => {
        if (!val) return 0;
        return Number(val.toString().replace(/\s/g, "").replace(/,/g, ".")) || 0;
    };
 let compteur=1;
 let compteurPDF=1;
 let compteurEXCEL=1;
    // Export Excel
    const exportToExcel = () => {
        const exportData = filteredCredits.map((credit) => ({
            "N°": compteurEXCEL++,
            NOMS: credit.NomCompte,
            GENRE: credit.genre,
            "N CPTE": credit.NumCompte,
            "MONT. DEMANDE EN USD": credit.monnaie === "USD" ? numberWithSpaces(credit.montant_demande) : "",
            OCTROI: credit.monnaie === "USD" ? numberWithSpaces(credit.dernier_montant) : "",
            "MONTANT DEMANDE FC": credit.monnaie === "CDF" ? numberWithSpaces(credit.montant_demande) : "",
            "OCTROI EN CDF": credit.monnaie === "CDF" ? numberWithSpaces(credit.dernier_montant) : "",
            "DUREE en mois": credit.duree_credit,
            AFFECTATION: credit.objet_credit,
            GARANTIE: credit.type_garantie,
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rapport Crédits");
        XLSX.writeFile(wb, `rapport_credits_${new Date().toISOString().split("T")[0]}.xlsx`);
        Swal.fire({
            icon: "success",
            title: "Export réussi",
            text: "Le fichier Excel a été téléchargé",
            confirmButtonColor: "#20c997",
            timer: 2000,
        });
    };

    // Helper pour charger une image en base64
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

    // Export PDF
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
            const pdf = new jsPDF("l", "mm", "a4"); // paysage

            let logoBase64 = null;
            if (organisation?.logo) {
                try {
                    logoBase64 = await getBase64ImageFromURL(organisation.logo);
                } catch (e) {
                    console.warn("Logo non chargé", e);
                }
            }

            const columns = [
                "N°",
                "NOMS",
                "GENRE",
                "N CPTE",
                "MONT. DEMANDE EN USD",
                "OCTROI",
                "MONTANT DEMANDE FC",
                "OCTROI EN CDF",
                "DUREE (mois)",
                "AFFECTATION",
                "GARANTIE",
            ];

            const rows = filteredCredits.map((c) => [
                compteurPDF++,
                c.NomCompte || "",
                c.genre || "",
                c.NumCompte || "",
                c.monnaie === "USD" ? numberWithSpaces(c.montant_demande) : "",
                c.monnaie === "USD" ? numberWithSpaces(c.dernier_montant) : "",
                c.monnaie === "CDF" ? numberWithSpaces(c.montant_demande) : "",
                c.monnaie === "CDF" ? numberWithSpaces(c.dernier_montant) : "",
                c.duree_credit || "",
                c.objet_credit || "",
                c.type_garantie || "",
            ]);

            const addHeader = () => {
                const pageWidth = pdf.internal.pageSize.getWidth();
                if (logoBase64) {
                    pdf.addImage(logoBase64, "PNG", 14, 10, 35, 18);
                }
                pdf.setFontSize(16);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(41, 128, 185);
                pdf.text("RAPPORT DES CRÉDITS ETUDIÉS", pageWidth / 2, 16, { align: "center" });
                pdf.setDrawColor(41, 128, 185);
                pdf.line(pageWidth / 2 - 60, 20, pageWidth / 2 + 60, 20);

                let y = 12;
                pdf.setFontSize(9);
                pdf.setFont("helvetica", "bold");
                pdf.setTextColor(0, 0, 0);
                pdf.text(organisation.nom || "", pageWidth - 14, y, { align: "right" });
                y += 5;
                pdf.setFont("helvetica", "normal");
                pdf.setTextColor(80, 80, 80);
                if (organisation.slogan) {
                    pdf.text(organisation.slogan, pageWidth - 14, y, { align: "right" });
                    y += 5;
                }
                if (organisation.telephone) {
                    pdf.text(`Tél: ${organisation.telephone}`, pageWidth - 14, y, { align: "right" });
                    y += 5;
                }
                if (organisation.email) {
                    pdf.text(organisation.email, pageWidth - 14, y, { align: "right" });
                }
                return 30;
            };

            const addFooter = () => {
                const pageCount = pdf.internal.getNumberOfPages();
                const pageHeight = pdf.internal.pageSize.getHeight();
                const pageWidth = pdf.internal.pageSize.getWidth();
                pdf.setPage(pageCount);

                pdf.setDrawColor(200, 200, 200);
                pdf.line(14, pageHeight - 20, pageWidth - 14, pageHeight - 20);
                pdf.setFontSize(10);
                pdf.setTextColor(80, 80, 80);
                pdf.setFont("helvetica", "normal");
                pdf.text(`Généré le : ${new Date().toLocaleString("fr-FR")}`, 14, pageHeight - 15);
                pdf.text(`Nombre de crédits : ${filteredCredits.length}`, 14, pageHeight - 10);
                pdf.text(
                    `Total demandé USD : ${numberWithSpaces(totalDemandeUSD)}`,
                    100,
                    pageHeight - 15
                );
                pdf.text(
                    `Total octroyé USD : ${numberWithSpaces(totalOctroiUSD)}`,
                    100,
                    pageHeight - 10
                );
                pdf.text(
                    `Total demandé CDF : ${numberWithSpaces(totalDemandeCDF)}`,
                    180,
                    pageHeight - 15
                );
                pdf.text(
                    `Total octroyé CDF : ${numberWithSpaces(totalOctroiCDF)}`,
                    180,
                    pageHeight - 10
                );
                pdf.text(`Page ${pageCount} / ${pageCount}`, pageWidth - 14, pageHeight - 10, {
                    align: "right",
                });
            };

            const headerHeight = addHeader();
            autoTable(pdf, {
                head: [columns],
                body: rows,
                startY: headerHeight + 15,
                showHead: "firstPage",
                styles: { fontSize: 9, font: "helvetica" },
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: "bold",
                },
                margin: { left: 14, right: 14, bottom: 25 },
                didDrawPage: function (data) {
                    if (data.pageNumber === 1) {
                        addHeader();
                    }
                },
            });

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

  

    if (isLoading) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" style={{ width: "3rem", height: "3rem" }} />
                    <p className="text-muted">Chargement des données...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container-fluid py-4" style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
            {/* En-tête décoratif */}
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
                            <h3 className="fw-semibold mb-0">
                                <i className="fas fa-file"></i> Rapports
                            </h3>
                            <div>
                                <i className="fas fa-chart-line fa-3x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 no-print">
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-3 align-items-center">
                        <div className="flex-grow-1" style={{ minWidth: "250px" }}>
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
                                    <option value="type_credit">📊 Type crédit</option>
                                    <option value="credit_refuse">❌ Crédits refusés</option>
                                </select>
                                <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder={
                                        type_recherche === "AC"
                                            ? "Nom de l'agent..."
                                            : type_recherche === "type_credit"
                                            ? "Type de crédit..."
                                            : "Rechercher par compte, nom..."
                                    }
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    disabled={type_recherche === "credit_refuse"}
                                    style={{ borderRadius: "0 8px 8px 0" }}
                                />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowFilters(!showFilters)}>
                                <i className="fas fa-filter me-1"></i> Filtres
                            </button>
                            <button className="btn btn-sm btn-outline-warning" onClick={resetFilters}>
                                <i className="fas fa-undo-alt me-1"></i> Réinitialiser
                            </button>
                            <button className="btn btn-sm btn-success" onClick={exportToExcel}>
                                <i className="fas fa-file-excel me-1"></i> Excel
                            </button>
                            <button className="btn btn-sm btn-danger" onClick={exportToPDF}>
                                <i className="fas fa-file-pdf me-1"></i> PDF
                            </button>
                        </div>
                    </div>

                    {showFilters && (
                        <div className="row mt-3 pt-3 border-top">
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Date début</label>
                                <input type="date" className="form-control form-control-sm" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Date fin</label>
                                <input type="date" className="form-control form-control-sm" value={dateFin} onChange={(e) => setDateFin(e.target.value)} />
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Agence</label>
                                <select className="form-select form-select-sm" value={selectedAgence} onChange={(e) => setSelectedAgence(e.target.value)}>
                                    <option value="">Toutes</option>
                                    {agencesUniques.map((a) => <option key={a} value={a}>{a}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Gestionnaire</label>
                                <select className="form-select form-select-sm" value={selectedGestionnaire} onChange={(e) => setSelectedGestionnaire(e.target.value)}>
                                    <option value="">Tous</option>
                                    {gestionnairesUniques.map((g) => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Type crédit</label>
                                <select className="form-select form-select-sm" value={selectedTypeCredit} onChange={(e) => setSelectedTypeCredit(e.target.value)}>
                                    <option value="">Tous</option>
                                    {typesCreditUniques.map((t) => <option key={t} value={t}>{t}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Produit crédit</label>
                                <select className="form-select form-select-sm" value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)}>
                                    <option value="">Tous</option>
                                    {produitsUniques.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Statut crédit</label>
                                <select className="form-select form-select-sm" value={selectedStatut} onChange={(e) => setSelectedStatut(e.target.value)}>
                                    <option value="">Tous</option>
                                    {statutUniques.map((p) => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>
                            <div className="col-md-3 mb-2">
                                <label className="form-label small fw-semibold">Monnaie</label>
                                <select className="form-select form-select-sm" value={selectedMonnaie} onChange={(e) => setSelectedMonnaie(e.target.value)}>
                                    <option value="">Toutes</option>
                                    {monnaiesUniques.map((m) => (
                                        <option key={m} value={m}>
                                            {m === "USD" ? "💵 USD" : m === "CDF" ? "🇨🇩 CDF" : m}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Cartes statistiques */}
            <div className="row mb-4 no-print">
                <div className="col-md-4 mb-3">
                    <div className="card border-0 shadow-sm rounded-4">
                        <div className="card-body text-center">
                            <i className="fas fa-chart-simple fa-2x text-primary mb-2"></i>
                            <h3 className="fw-bold text-primary">{nombreTotal}</h3>
                            <p className="text-muted mb-0">Total crédits</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-4 mb-3">
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
                            <h5 className="fw-bold">{gestionnairesUniques.length}</h5>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tableau principal */}
            <div className="card shadow-sm border-0 rounded-3 overflow-hidden" id="table-credits">
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ overflowX: "auto" }}>
                        <table className="modern-credit-table table-hover">
                            <thead>
                                <tr>
                                    <th>N°</th>
                                    <th>NOMS</th>
                                    <th>GENRE</th>
                                    <th>N CPTE</th>
                                    <th className="text-end">MONT. DEMANDE EN USD</th>
                                    <th className="text-end">OCTROI</th>
                                    <th className="text-end">MONTANT DEMANDE FC</th>
                                    <th className="text-end">OCTROI EN CDF</th>
                                    <th>DUREE (mois)</th>
                                    <th>AFFECTATION</th>
                                    <th>GARANTIE</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedCredits.length > 0 ? (
                                    displayedCredits.map((credit, idx) => (
                                        <tr key={idx}>
                                            <td>{compteur++}</td>
                                            <td>{credit.NomCompte}</td>
                                            <td>{credit.genre}</td>
                                            <td className="fw-semibold" style={{ color: "#1f6e5c" }}>{credit.NumCompte}</td>
                                            <td className="text-end fw-bold" style={{ color: "#1f6e5c" }}>
                                                {credit.monnaie === "USD" ? numberWithSpaces(credit.montant_demande ?? 0) : "-"}
                                            </td>
                                            <td className="text-end fw-bold" style={{ color: "#1f6e5c" }}>
                                                {credit.monnaie === "USD" ? numberWithSpaces(credit.dernier_montant ?? 0) : "-"}
                                            </td>
                                            <td className="text-end fw-bold" style={{ color: "#1f6e5c" }}>
                                                {credit.monnaie === "CDF" ? numberWithSpaces(credit.montant_demande ?? 0) : "-"}
                                            </td>
                                            <td className="text-end fw-bold" style={{ color: "#1f6e5c" }}>
                                                {credit.monnaie === "CDF" ? numberWithSpaces(credit.dernier_montant ?? 0) : "-"}
                                            </td>
                                            <td>{credit.duree_credit}</td>
                                            <td>{credit.objet_credit}</td>
                                            <td>{credit.type_garantie}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="11" className="text-center py-5 text-muted">
                                            <i className="fas fa-inbox fa-3x mb-2 d-block"></i>
                                            <p>Aucune donnée trouvée</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                            <tfoot>
                                <tr className="table-footer-modern">
                                    <td colSpan="4" className="footer-label">Totaux</td>
                                    <td className="text-end footer-amount">{numberWithSpaces(totalDemandeUSD)}</td>
                                    <td className="text-end footer-amount">{numberWithSpaces(totalOctroiUSD)}</td>
                                    <td className="text-end footer-amount">{numberWithSpaces(totalDemandeCDF)}</td>
                                    <td className="text-end footer-amount">{numberWithSpaces(totalOctroiCDF)}</td>
                                    <td colSpan="3"></td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {filteredCredits.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 no-print">
                    <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small">Afficher</span>
                        <select className="form-select form-select-sm" style={{ width: "70px" }} value={itemsPerPage} onChange={handleItemsPerPageChange}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                        </select>
                        <span className="text-muted small">entrées</span>
                    </div>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(1)} disabled={currentPage === 1}>
                            <i className="fas fa-angle-double-left"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            <i className="fas fa-angle-left"></i>
                        </button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
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
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                            <i className="fas fa-angle-right"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}>
                            <i className="fas fa-angle-double-right"></i>
                        </button>
                    </div>
                    <span className="text-muted small">
                        Page {currentPage} sur {totalPages} ({filteredCredits.length} entrées)
                    </span>
                </div>
            )}

            <style>{`
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
            `}</style>
        </div>
    );
}