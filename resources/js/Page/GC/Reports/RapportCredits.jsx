import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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

   // Informations de l'organisation
    const organisation = {
        nom: "COOPEC AKIBA YETU",
        slogan: "Ensemble pour un avenir prospère",
        adresse: "Rue N°13 Avenue Mont-Goma N°23 / Rue NZUMUKA James; Commune de GOMA Nord-Kivu, RDCongo, A côté du bureau de la DGI.",
        telephone: "+243 970 237 272",
        email: "contact@coopecakibayetu.org",
        siteWeb: "www.coopecakibayetu.org",
        logo: "/images/logo/logo.png"
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

    // Filtrer les données
    useEffect(() => {
        let filtered = [...credits];

        if (type_recherche === "AC") {
            filtered = filtered.filter((credit) => 
                credit.recouvreur?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (type_recherche === "type_credit") {
            filtered = filtered.filter((credit) => 
                credit.type_credit?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        } else if (type_recherche === "credit_refuse") {
            filtered = filtered.filter((credit) => credit.statutDossier === "Refusé");
        } else if (searchTerm && type_recherche !== "credit_refuse") {
            filtered = filtered.filter(
                (credit) =>
                    credit.NumCompte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    credit.NomCompte?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    credit.recouvreur?.toLowerCase().includes(searchTerm.toLowerCase())
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
            filtered = filtered.filter((credit) => credit.Agence === selectedAgence);
        }
        if (selectedGestionnaire) {
            filtered = filtered.filter((credit) => credit.recouvreur === selectedGestionnaire);
        }
        if (selectedTypeCredit) {
            filtered = filtered.filter((credit) => credit.type_credit === selectedTypeCredit);
        }
        if (selectedProduit) {
            filtered = filtered.filter((credit) => credit.produit_credit === selectedProduit);
        }
        if (selectedMonnaie) {
            filtered = filtered.filter((credit) => credit.monnaie === selectedMonnaie);
        }

        setFilteredCredits(filtered);
        setCurrentPage(1);
    }, [searchTerm, dateDebut, dateFin, selectedAgence, selectedGestionnaire, selectedTypeCredit, selectedProduit, selectedMonnaie, credits, type_recherche]);

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
        setFilteredCredits(credits);
        setCurrentPage(1);
    };

    const agencesUniques = [...new Set(credits.map((c) => c.Agence).filter(Boolean))];
    const gestionnairesUniques = [...new Set(credits.map((c) => c.recouvreur).filter(Boolean))];
    const typesCreditUniques = [...new Set(credits.map((c) => c.type_credit).filter(Boolean))];
    const produitsUniques = [...new Set(credits.map((c) => c.produit_credit).filter(Boolean))];
    const monnaiesUniques = [...new Set(credits.map((c) => c.monnaie).filter(Boolean))];

    const totalMontant = filteredCredits.reduce((sum, credit) => sum + (parseFloat(credit.montant_demande) || 0), 0);
    const nombreTotal = filteredCredits.length;

    const exportToExcel = () => {
        const exportData = filteredCredits.map((credit) => ({
            "N° Compte": credit.NumCompte,
            "Nom du client": credit.NomCompte,
            "Agence": credit.Agence,
            "Produit crédit": credit.produit_credit,
            "Type crédit": credit.type_credit,
            "Gestionnaire": credit.recouvreur,
            "Montant demandé": `${numberWithSpaces(credit.montant_demande?.toLocaleString())} ${credit.monnaie}`,
            "Date demande": credit.date_demande ? new Date(credit.date_demande).toLocaleDateString("fr-FR") : "",
            "Statut": credit.statutDossier
        }));
        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Rapport Crédits");
        XLSX.writeFile(wb, `rapport_credits_${new Date().toISOString().split("T")[0]}.xlsx`);
        Swal.fire({ icon: "success", title: "Export réussi", text: "Le fichier Excel a été téléchargé", confirmButtonColor: "#20c997", timer: 2000 });
    };

    // Exporter en PDF avec logo
    const exportToPDF = async () => {
        // Afficher un loader
        Swal.fire({
            title: "Génération du PDF...",
            text: "Veuillez patienter",
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        try {
            // Charger l'image du logo avec une meilleure méthode
            const loadImageAsBase64 = (url) => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.crossOrigin = "Anonymous";
                    img.onload = () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        ctx.drawImage(img, 0, 0);
                        const dataURL = canvas.toDataURL('image/png');
                        resolve(dataURL);
                    };
                    img.onerror = () => reject(new Error(`Impossible de charger l'image: ${url}`));
                    img.src = url;
                });
            };

            let logoBase64 = null;
            try {
                logoBase64 = await loadImageAsBase64(organisation.logo);
                console.log("Logo chargé avec succès");
            } catch (logoError) {
                console.warn("Impossible de charger le logo:", logoError);
            }

            const doc = new jsPDF({ orientation: 'landscape' });
            
            // Positionnement du logo et du texte
            if (logoBase64) {
                try {
                    // Ajouter le logo (position x, y, largeur, hauteur)
                    doc.addImage(logoBase64, 'PNG', 14, 8, 45, 18);
                } catch (imgError) {
                    console.warn("Erreur lors de l'ajout du logo:", imgError);
                }
            }
            
            // Titre de l'organisation
            doc.setFontSize(16);
            doc.setTextColor(32, 201, 151);
            doc.text(organisation.nom, 70, 15);
            
            doc.setFontSize(9);
            doc.setTextColor(100, 100, 100);
            doc.text(organisation.slogan, 70, 22);
            
            // Informations de l'organisation à droite
            doc.setFontSize(8);
            doc.setTextColor(80, 80, 80);
            doc.text(organisation.adresse, 280, 10, { align: "right" });
            doc.text(`Tél: ${organisation.telephone}`, 280, 16, { align: "right" });
            doc.text(`Email: ${organisation.email}`, 280, 22, { align: "right" });
            
            // Ligne séparatrice
            doc.setDrawColor(200, 200, 200);
            doc.line(14, 30, 290, 30);
            
            // Titre du rapport
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text("RAPPORT DES CRÉDITS", 152, 40, { align: "center" });
            
            // Filtres actifs
            doc.setFontSize(8);
            let filterText = `Généré le: ${new Date().toLocaleDateString("fr-FR")} | Total: ${nombreTotal} crédits | Montant total: ${numberWithSpaces(totalMontant)}`;
            if (selectedAgence) filterText += ` | Agence: ${selectedAgence}`;
            if (selectedGestionnaire) filterText += ` | Gestionnaire: ${selectedGestionnaire}`;
            if (selectedTypeCredit) filterText += ` | Type: ${selectedTypeCredit}`;
            if (selectedMonnaie) filterText += ` | Monnaie: ${selectedMonnaie}`;
            if (type_recherche === "credit_refuse") filterText += ` | Filtre: Crédits refusés`;
            doc.text(filterText, 152, 48, { align: "center" });
            
            // Tableau
            const tableData = displayedCredits.map((credit) => [
                credit.NumCompte || "",
                credit.NomCompte || "",
                credit.Agence || "",
                credit.produit_credit || "",
                credit.type_credit || "",
                credit.recouvreur || "",
                `${numberWithSpaces(credit.montant_demande?.toLocaleString()) || 0}`,
                credit.monnaie || "",
                credit.date_demande ? new Date(credit.date_demande).toLocaleDateString("fr-FR") : "",
                credit.statutDossier || ""
            ]);
            
            doc.autoTable({
                startY: 56,
                head: [["N° Compte", "Nom Client", "Agence", "Produit", "Type", "Gestionnaire", "Montant", "Devise", "Date", "Statut"]],
                body: tableData,
                theme: "striped",
                headStyles: { 
                    fillColor: [26, 95, 75], 
                    textColor: 255, 
                    fontStyle: "bold", 
                    halign: "center",
                    fontSize: 9
                },
                alternateRowStyles: { fillColor: [245, 245, 245] },
                margin: { top: 10, left: 10, right: 10 },
                styles: { fontSize: 8, cellPadding: 2 },
                columnStyles: {
                    0: { halign: "center", cellWidth: 25 },
                    1: { cellWidth: 35 },
                    2: { cellWidth: 25 },
                    3: { cellWidth: 30 },
                    4: { cellWidth: 25 },
                    5: { cellWidth: 30 },
                    6: { halign: "right", cellWidth: 30 },
                    7: { halign: "center", cellWidth: 20 },
                    8: { halign: "center", cellWidth: 25 },
                    9: { halign: "center", cellWidth: 25 }
                }
            });
            
            doc.save(`rapport_credits_${new Date().toISOString().split("T")[0]}.pdf`);
            
            Swal.fire({
                icon: "success",
                title: "Export réussi",
                text: "Le fichier PDF a été téléchargé",
                confirmButtonColor: "#20c997",
                timer: 2000
            });
            
        } catch (error) {
            console.error("Erreur lors de la génération du PDF:", error);
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text: "Erreur lors de la génération du PDF. Veuillez réessayer.",
                confirmButtonColor: "#20c997"
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
            {/* En-tête avec logo officiel (visible à l'écran) */}
            <div className="no-print mb-4">
                <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
                    <div style={{ background: "#fff", padding: "20px 30px" }}>
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="d-flex align-items-center gap-4">
                               <h5
                                    className="fw-semibold mb-0"
                                    style={{
                                        color: "#1a2632 0%",
                                        letterSpacing: "0.3px",
                                    }}
                                >
                                    <i className="fas fa-file"></i> {" "}  Rapports
                                       
                                </h5>
                            </div >
                            <div className="text-end" style={{
                                        color: "#1a2632 0%",
                                    }}>
                                <i   className="fas fa-chart-line fa-3x opacity-75"></i>
                            </div>
                        </div>
                    </div>
                   
                </div>
            </div>

            {/* Filtres et boutons */}
            <div className="card shadow-sm border-0 rounded-4 mb-4 no-print">
                <div className="card-body">
                    <div className="d-flex flex-wrap gap-3 align-items-center">
                        <div className="flex-grow-1" style={{ minWidth: "250px" }}>
                            <div className="input-group">
                                <select className="form-select form-select-sm" style={{ width: "auto", maxWidth: "180px", backgroundColor: "#f8f9fa", fontWeight: "500", borderRadius: "8px 0 0 8px" }} value={type_recherche} onChange={(e) => { setType_recherche(e.target.value); setSearchTerm(""); }}>
                                    <option value="">🔍 Recherche</option>
                                    <option value="AC">👤 Agent crédit</option>
                                    <option value="type_credit">📊 Type crédit</option>
                                    <option value="credit_refuse">❌ Crédits refusés</option>
                                </select>
                                <input type="text" className="form-control form-control-sm" placeholder={type_recherche === "AC" ? "Nom de l'agent crédit..." : type_recherche === "type_credit" ? "Type de crédit..." : "Rechercher par compte, nom..."} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} disabled={type_recherche === "credit_refuse"} style={{ borderRadius: "0 8px 8px 0" }} />
                            </div>
                        </div>
                        <div className="d-flex gap-2">
                            <button className="btn btn-sm btn-outline-primary" onClick={() => setShowFilters(!showFilters)}><i className="fas fa-filter me-1"></i> Filtres</button>
                            <button className="btn btn-sm btn-outline-warning" onClick={resetFilters}><i className="fas fa-undo-alt me-1"></i> Réinitialiser</button>
                            <button className="btn btn-sm btn-success" onClick={exportToExcel}><i className="fas fa-file-excel me-1"></i> Excel</button>
                            <button className="btn btn-sm btn-danger" onClick={exportToPDF}><i className="fas fa-file-pdf me-1"></i> PDF</button>
                            <button className="btn btn-sm btn-secondary" onClick={() => window.print()}><i className="fas fa-print me-1"></i> Imprimer</button>
                        </div>
                    </div>
                    {showFilters && (
                        <div className="row mt-3 pt-3 border-top">
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Date début</label><input type="date" className="form-control form-control-sm" value={dateDebut} onChange={(e) => setDateDebut(e.target.value)} /></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Date fin</label><input type="date" className="form-control form-control-sm" value={dateFin} onChange={(e) => setDateFin(e.target.value)} /></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Agence</label><select className="form-select form-select-sm" value={selectedAgence} onChange={(e) => setSelectedAgence(e.target.value)}><option value="">Toutes</option>{agencesUniques.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Gestionnaire</label><select className="form-select form-select-sm" value={selectedGestionnaire} onChange={(e) => setSelectedGestionnaire(e.target.value)}><option value="">Tous</option>{gestionnairesUniques.map(g => <option key={g} value={g}>{g}</option>)}</select></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Type crédit</label><select className="form-select form-select-sm" value={selectedTypeCredit} onChange={(e) => setSelectedTypeCredit(e.target.value)}><option value="">Tous</option>{typesCreditUniques.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold">Produit crédit</label><select className="form-select form-select-sm" value={selectedProduit} onChange={(e) => setSelectedProduit(e.target.value)}><option value="">Tous</option>{produitsUniques.map(p => <option key={p} value={p}>{p}</option>)}</select></div>
                            <div className="col-md-3 mb-2"><label className="form-label small fw-semibold"><i className="fas fa-coins me-1"></i> Monnaie</label><select className="form-select form-select-sm" value={selectedMonnaie} onChange={(e) => setSelectedMonnaie(e.target.value)}><option value="">Toutes</option>{monnaiesUniques.map(m => <option key={m} value={m}>{m === "USD" ? "💵 USD" : m === "CDF" ? "🇨🇩 CDF" : m}</option>)}</select></div>
                        </div>
                    )}
                </div>
            </div>

            {/* Statistiques */}
            <div className="row mb-4 no-print">
                <div className="col-md-3 mb-3"><div className="card border-0 shadow-sm rounded-4"><div className="card-body text-center"><i className="fas fa-chart-simple fa-2x text-primary mb-2"></i><h3 className="fw-bold text-primary">{nombreTotal}</h3><p className="text-muted mb-0">Total crédits</p></div></div></div>
                <div className="col-md-3 mb-3"><div className="card border-0 shadow-sm rounded-4"><div className="card-body text-center"><i className="fas fa-money-bill-wave fa-2x text-success mb-2"></i><h3 className="fw-bold text-success">{numberWithSpaces(totalMontant.toLocaleString())}</h3><p className="text-muted mb-0">Montant total</p></div></div></div>
                <div className="col-md-3 mb-3"><div className="card border-0 shadow-sm rounded-4"><div className="card-body text-center"><i className="fas fa-building fa-2x text-info mb-2"></i><p className="text-muted mb-0">Agences</p><h5 className="fw-bold">{agencesUniques.length}</h5></div></div></div>
                <div className="col-md-3 mb-3"><div className="card border-0 shadow-sm rounded-4"><div className="card-body text-center"><i className="fas fa-user-tie fa-2x text-warning mb-2"></i><p className="text-muted mb-0">Gestionnaires</p><h5 className="fw-bold">{gestionnairesUniques.length}</h5></div></div></div>
            </div>

            {/* TABLEAU */}
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
                <div className="card-body p-0">
                    <div className="table-responsive" style={{ maxHeight: "auto", overflowY: "auto" }}>
                        <table className="table table-hover mb-0">
                            <thead style={{ 
                                position: "sticky", 
                                top: 0, 
                                background:" linear-gradient(180deg, #1a2632 0%",
                                zIndex: 2,
                                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
                            }}>
                                <tr>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>N° Compte</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Nom client</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Agence</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Produit</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Type</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Gestionnaire</th>
                                    <th className="py-3 px-3 text-white text-end" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Montant</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Monnaie</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Date demande</th>
                                    <th className="py-3 px-3 text-white" style={{ fontWeight: "600", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Statut</th>
                                   </tr>
                            </thead>
                            <tbody>
                                {displayedCredits.length > 0 ? (
                                    displayedCredits.map((credit, index) => (
                                        <tr key={index} className="border-bottom" style={{ transition: "all 0.2s ease", cursor: "pointer" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}>
                                            <td className="py-3 px-3 fw-semibold" style={{ color: "#1a5f4b" }}>{credit.NumCompte}</td>
                                            <td className="py-3 px-3">{credit.NomCompte}</td>
                                            <td className="py-3 px-3"><span className="badge bg-light text-dark px-3 py-1 rounded-pill" style={{ fontWeight: "500" }}>{credit.Agence}</span></td>
                                            <td className="py-3 px-3">{credit.produit_credit}</td>
                                            <td className="py-3 px-3">
                                                <span className={`badge rounded-pill px-3 py-1 ${credit.type_credit === "Long terme" ? "bg-primary" : credit.type_credit === "Moyen terme" ? "bg-info" : "bg-secondary"}`}>
                                                    {credit.type_credit}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="fas fa-user-circle text-muted"></i>
                                                    <span>{credit.recouvreur}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3 text-end fw-bold" style={{ color: "#1a5f4b" }}>{numberWithSpaces(credit.montant_demande?.toLocaleString())}</td>
                                            <td className="py-3 px-3">
                                                <span className={`badge rounded-pill px-3 py-1 ${credit.monnaie === "USD" ? "bg-success bg-opacity-10 text-success" : "bg-warning bg-opacity-10 text-warning"}`} style={{ fontWeight: "600" }}>
                                                    {credit.monnaie === "USD" ? "💵 USD" : "🇨🇩 CDF"}
                                                </span>
                                            </td>
                                            <td className="py-3 px-3">
                                                <div className="d-flex align-items-center gap-2">
                                                    <i className="far fa-calendar-alt text-muted"></i>
                                                    <span>{credit.date_demande ? new Date(credit.date_demande).toLocaleDateString("fr-FR") : "-"}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-3">
                                                <span className={`badge rounded-pill px-3 py-1 ${credit.statutDossier === "Approuvé" ? "bg-success" : credit.statutDossier === "Refusé" ? "bg-danger" : "bg-warning"}`}>
                                                    {credit.statutDossier === "Approuvé" ? "✓ Approuvé" : credit.statutDossier === "Refusé" ? "✗ Refusé" : "⏳ En cours"}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="10" className="text-center py-5 text-muted">
                                            <i className="fas fa-inbox fa-3x mb-3 d-block"></i>
                                            <p>Aucune donnée trouvée</p>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Pagination */}
            {filteredCredits.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 no-print">
                    <div className="d-flex align-items-center gap-2"><span className="text-muted small">Afficher</span><select className="form-select form-select-sm" style={{ width: "70px" }} value={itemsPerPage} onChange={handleItemsPerPageChange}><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option><option value={50}>50</option></select><span className="text-muted small">entrées</span></div>
                    <div className="d-flex gap-1">
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(1)} disabled={currentPage === 1}><i className="fas fa-angle-double-left"></i></button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}><i className="fas fa-angle-left"></i></button>
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                            let pageNum;
                            if (totalPages <= 5) pageNum = i + 1;
                            else if (currentPage <= 3) pageNum = i + 1;
                            else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                            else pageNum = currentPage - 2 + i;
                            return <button key={pageNum} className={`btn btn-sm ${currentPage === pageNum ? "btn-primary" : "btn-outline-secondary"}`} onClick={() => paginate(pageNum)}>{pageNum}</button>;
                        })}
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}><i className="fas fa-angle-right"></i></button>
                        <button className="btn btn-sm btn-outline-secondary" onClick={() => paginate(totalPages)} disabled={currentPage === totalPages}><i className="fas fa-angle-double-right"></i></button>
                    </div>
                    <span className="text-muted small">Page {currentPage} sur {totalPages} ({filteredCredits.length} entrées)</span>
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
                `}
            </style>
        </div>
    );
}