import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart,
    Bar,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    LabelList,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
} from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [actorsDelay, setActorsDelay] = useState([]);
    const [intervalData, setIntervalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalDossiers, setTotalDossiers] = useState(0);

    useEffect(() => {
        axios
            .get("/gestion_credit/dashboard/stats")
            .then((res) => {
                setStats(res.data.stats);
                setSignatures(res.data.signatures);
                setActorsDelay(res.data.delaiSignatures);
                setTimeline(res.data.timeline);
                setIntervalData(res.data.intervals || []);
                setTotalDossiers(res.data.total_dossiers || 0);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Erreur lors du chargement du dashboard :", err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div className="text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
            </div>
        );
    }

    // Calcul du taux de conversion (décaissés / total général)
    const tauxConversion = stats?.credits_decaisse && totalDossiers 
        ? ((stats.credits_decaisse / totalDossiers) * 100).toFixed(1)
        : 0;

    // Taux de rejet (rejetés / total général)
    const tauxRejet = stats?.credits_rejetes && totalDossiers
        ? ((stats.credits_rejetes / totalDossiers) * 100).toFixed(1)
        : 0;

    // Taux d'encours (encours / total général)
    const tauxEncours = stats?.credits_encours && totalDossiers
        ? ((stats.credits_encours / totalDossiers) * 100).toFixed(1)
        : 0;

           const tauxEncoursD = stats?.credits_encours_decaissement && totalDossiers
        ? ((stats.credits_encours_decaissement / totalDossiers) * 100).toFixed(1)
        : 0;

        

    // Données pour le graphique circulaire
    const pieData = [
        { name: "En cours", value: stats?.credits_encours || 0, color: "#20c997", taux: tauxEncours },
        { name: "Décaissés", value: stats?.credits_decaisse || 0, color: "#28a745", taux: tauxConversion },
        { name: "Rejetés", value: stats?.credits_rejetes || 0, color: "#dc3545", taux: tauxRejet },
        { name: "En ettente décaiss.", value: stats?.credits_encours_decaissement || 0, color: "#29ae", taux: tauxEncoursD },
    ];

    const COLORS = ["#20c997", "#28a745", "#dc3545","#29ae"];

    // Statistiques sur les intervalles entre signatures
    const avgInterval = intervalData.length > 0
        ? (intervalData.reduce((sum, item) => sum + item.interval_jours, 0) / intervalData.length).toFixed(1)
        : 0;

    const maxInterval = intervalData.length > 0
        ? Math.max(...intervalData.map(item => item.interval_jours))
        : 0;

    return (
        <div className="container-fluid px-4 py-4" style={{ background: "#e6f2f9" }}>
            {/* En-tête */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
                <div>
                    <h2 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
                        <i className="fas fa-chart-line me-2" style={{ color: "#20c997" }}></i>
                        Tableau de bord analytique
                    </h2>
                    <p className="text-muted small mb-0">
                        Vue d'ensemble de l'activité crédit et performance des signatures
                    </p>
                </div>
                <div className="d-flex gap-2">
                    <button 
                        className="btn btn-sm btn-outline-secondary" 
                        onClick={() => window.location.reload()}
                        style={{ borderRadius: "10px" }}
                    >
                        <i className="fas fa-sync-alt me-1"></i>
                        Actualiser
                    </button>
                    {/* <button 
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => window.print()}
                        style={{ borderRadius: "10px" }}
                    >
                        <i className="fas fa-print me-1"></i>
                        Exporter
                    </button> */}
                </div>
            </div>

            {/* KPI Cards */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
    </div>

    {/* Ligne des KPI Cards - 5 cartes alignées avec flex */}
    <div className="d-flex flex-wrap gap-4 mb-5" style={{ rowGap: "1.5rem" }}>
        {/* Total dossiers */}
        <div className="flex-grow-1" style={{ flex: "1 1 180px", minWidth: "180px" }}>
            <div className="card border-0 shadow-sm rounded-3 h-100">
                <div className="card-body p-4">
                    <div className="d-flex justify-content-between align-items-start">
                        <div>
                            <div className="d-flex align-items-center gap-2 mb-2">
                                <div style={{ width: "35px", height: "35px", backgroundColor: "rgba(108,117,125,0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="fas fa-folder-open" style={{ color: "#6c757d", fontSize: "18px" }}></i>
                                </div>
                                <span className="text-muted small fw-semibold">TOTAL DOSSIERS</span>
                            </div>
                            <h3 className="fw-bold mb-0" style={{ fontSize: "2rem", color: "#2c3e50" }}>{totalDossiers}</h3>
                            <p className="text-muted small mb-0">Tous statuts confondus</p>
                        </div>
                        <div className="text-end">
                            <i className="fas fa-chart-simple text-muted opacity-50 fa-lg"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Crédits en cours */}
        <div className="flex-grow-1" style={{ flex: "1 1 180px", minWidth: "180px" }}>
            <a href="/gestion_credit/pages/validation-credit" className="text-decoration-none">
                <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}>
                    <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #20c997 0%, #198764 100%)" }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="fas fa-clock fa-2x text-white opacity-75"></i>
                                    <span className="badge bg-white text-teal rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>En étude</span>
                                </div>
                                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2rem" }}>{stats?.credits_encours || 0}</h3>
                                <p className="text-white-50 mb-0 small">{tauxEncours}% du total</p>
                            </div>
                            <div className="text-end">
                                <i className="fas fa-arrow-right text-white opacity-50 fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        {/* Crédits décaissés */}
        <div className="flex-grow-1" style={{ flex: "1 1 180px", minWidth: "180px" }}>
            <a href="/gestion_credit/pages/credit-decaisse" className="text-decoration-none">
                <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}>
                    <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)" }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="fas fa-check-circle fa-2x text-white opacity-75"></i>
                                    <span className="badge bg-white text-success rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>Décaissés</span>
                                </div>
                                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2rem" }}>{stats?.credits_decaisse || 0}</h3>
                                <p className="text-white-50 mb-0 small">{tauxConversion}% du total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        {/* Crédits rejetés */}
        <div className="flex-grow-1" style={{ flex: "1 1 180px", minWidth: "180px" }}>
            <a href="/gestion_credit/pages/validation-credit" className="text-decoration-none">
                <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}>
                    <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)" }}>
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="fas fa-times-circle fa-2x text-white opacity-75"></i>
                                    <span className="badge bg-white text-danger rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>Rejetés</span>
                                </div>
                                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2rem" }}>{stats?.credits_rejetes || 0}</h3>
                                <p className="text-white-50 mb-0 small">{tauxRejet}% du total</p>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>

        {/* NOUVELLE CARTE : Crédit encours de décaissement */}
        <div className="flex-grow-1" style={{ flex: "1 1 180px", minWidth: "180px" }}>
            <a href="/gestion_credit/pages/credit-encours-decaisss" className="text-decoration-none">
                <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-5px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)"; }}>
                    <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #fd7e14 0%, #e8590c 100%)" }}> {/* Dégradé orange */}
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <div className="d-flex align-items-center gap-2 mb-2">
                                    <i className="fas fa-hand-holding-usd fa-2x text-white opacity-75"></i>
                                    <span className="badge bg-white text-orange rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "#fd7e14" }}>En entente de décaissement</span>
                                </div>
                                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2rem" }}>{stats?.credits_encours_decaissement || 0}</h3>
                                {/* <p className="text-white-50 mb-0 small">Dossiers en attente de décaissement</p> */}
                                <p className="text-white-50 mb-0 small">{tauxEncoursD}% du total</p>
                            </div>
                            <div className="text-end">
                                <i className="fas fa-arrow-right text-white opacity-50 fa-lg"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>


            {/* Ligne de métriques supplémentaires */}
            <div className="row g-4 mb-5">
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 text-center">
                            <i className="fas fa-percent" style={{ color: "#20c997", fontSize: "24px" }}></i>
                            <h5 className="fw-bold mt-2 mb-0">{tauxConversion}%</h5>
                            <small className="text-muted">Taux de conversion (Décaissés/Total)</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 text-center">
                            <i className="fas fa-chart-line" style={{ color: "#ffc107", fontSize: "24px" }}></i>
                            <h5 className="fw-bold mt-2 mb-0">{tauxEncours}%</h5>
                            <small className="text-muted">Taux d'encours (En cours/Total)</small>
                        </div>
                    </div>
                </div>
                <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 text-center">
                            <i className="fas fa-chart-line" style={{ color: "#dc3545", fontSize: "24px" }}></i>
                            <h5 className="fw-bold mt-2 mb-0">{tauxRejet}%</h5>
                            <small className="text-muted">Taux de rejet (Rejetés/Total)</small>
                        </div>
                    </div>
                </div>

                     <div className="col-md-3">
                    <div className="card border-0 shadow-sm rounded-3">
                        <div className="card-body p-3 text-center">
                            <i className="fas fa-chart-line" style={{ color: "#dc3545", fontSize: "24px" }}></i>
                            <h5 className="fw-bold mt-2 mb-0">{tauxEncoursD}%</h5>
                            <small className="text-muted">Taux en entente de décaissement </small>
                        </div>
                    </div>
                </div>
            </div>

            {/* Graphiques principaux */}
            <div className="row g-4 mb-4">
                {/* Bar Chart - Signatures par acteur */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(32, 201, 151, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="fas fa-signature" style={{ color: "#20c997", fontSize: "18px" }}></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">Signatures par acteur</h5>
                                    <small className="text-muted">Nombre total de signatures</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={signatures} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                    <XAxis dataKey="signed_by" tick={{ fill: "#6c757d", fontSize: 11 }} angle={-15} textAnchor="end" height={60} />
                                    <YAxis tick={{ fill: "#6c757d", fontSize: 11 }} />
                                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
                                    <Bar dataKey="total" fill="#20c997" name="Nombre de signatures" radius={[8, 8, 0, 0]}>
                                        <LabelList dataKey="total" position="top" style={{ fill: "#20c997", fontWeight: "bold", fontSize: "11px" }} />
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Pie Chart - Répartition des dossiers */}
                <div className="col-lg-6">
                    <div className="card border-0 shadow-sm rounded-3 h-100 overflow-hidden">
                        <div className="card-header bg-white border-0 pt-4 pb-0">
                            <div className="d-flex align-items-center gap-2">
                                <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(32, 201, 151, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <i className="fas fa-chart-pie" style={{ color: "#20c997", fontSize: "18px" }}></i>
                                </div>
                                <div>
                                    <h5 className="fw-bold mb-0">Répartition des dossiers</h5>
                                    <small className="text-muted">État des traitements</small>
                                </div>
                            </div>
                        </div>
                        <div className="card-body p-4">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, taux }) => `${name}: ${taux}%`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value, name, props) => [`${value} dossiers (${props.payload.taux}%)`, name]} />
                                    <Legend verticalAlign="bottom" height={36} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>

            {/* Délai moyen par acteur */}
            <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(255, 193, 7, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="fas fa-hourglass-half" style={{ color: "#ffc107", fontSize: "18px" }}></i>
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0">Délai moyen de signature par acteur</h5>
                            <small className="text-muted">Performance individuelle (en jours)</small>
                        </div>
                    </div>
                </div>
                <div className="card-body p-4">
                    <ResponsiveContainer width="100%" height={350}>
                        <BarChart data={actorsDelay} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                            <XAxis dataKey="signed_by" tick={{ fill: "#6c757d", fontSize: 12 }} />
                            <YAxis tick={{ fill: "#6c757d", fontSize: 12 }} />
                            <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)} jours`, "Délai moyen"]} />
                            <Bar dataKey="delai_moyen" fill="#ffc107" name="Délai moyen (jours)" radius={[8, 8, 0, 0]}>
                                <LabelList dataKey="delai_moyen" position="top" formatter={(value) => `${parseFloat(value).toFixed(1)}j`} style={{ fill: "#ffc107", fontWeight: "bold", fontSize: "11px" }} />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Timeline - Évolution des délais */}
            {/* <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                <div className="card-header bg-white border-0 pt-4 pb-0">
                    <div className="d-flex align-items-center gap-2">
                        <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(32, 201, 151, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <i className="fas fa-chart-line" style={{ color: "#20c997", fontSize: "18px" }}></i>
                        </div>
                        <div>
                            <h5 className="fw-bold mb-0">Évolution du délai moyen de signature</h5>
                            <small className="text-muted">Tendance mensuelle des délais de traitement</small>
                        </div>
                    </div>
                </div>
                <div className="card-body p-4">
                    <ResponsiveContainer width="100%" height={350}>
                        <AreaChart data={timeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                            <XAxis dataKey="mois" tick={{ fill: "#6c757d", fontSize: 11 }} />
                            <YAxis tick={{ fill: "#6c757d", fontSize: 11 }} />
                            <Tooltip formatter={(value) => [`${parseFloat(value).toFixed(1)} jours`, "Délai moyen"]} />
                            <Area type="monotone" dataKey="delai_moyen" stroke="#20c997" strokeWidth={3} fill="#20c997" fillOpacity={0.1} name="Délai moyen (jours)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div> */}

            {/* Intervalles entre signatures */}
            {/* {intervalData.length > 0 && (
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden mb-4">
                    <div className="card-header bg-white border-0 pt-4 pb-0">
                        <div className="d-flex align-items-center gap-2">
                            <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(220, 53, 69, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <i className="fas fa-calendar-week" style={{ color: "#dc3545", fontSize: "18px" }}></i>
                            </div>
                            <div>
                                <h5 className="fw-bold mb-0">Intervalles entre signatures</h5>
                                <small className="text-muted">Écart en jours entre les acteurs</small>
                            </div>
                        </div>
                    </div>
                    <div className="card-body p-4">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={intervalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
                                <XAxis dataKey="etape" tick={{ fill: "#6c757d", fontSize: 11 }} />
                                <YAxis tick={{ fill: "#6c757d", fontSize: 11 }} />
                                <Tooltip formatter={(value) => [`${value} jours`, "Intervalle"]} />
                                <Bar dataKey="interval_jours" fill="#dc3545" name="Intervalle (jours)" radius={[8, 8, 0, 0]}>
                                    <LabelList dataKey="interval_jours" position="top" formatter={(value) => `${value}j`} style={{ fill: "#dc3545", fontWeight: "bold", fontSize: "11px" }} />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )} */}

            {/* Footer */}
            <div className="row g-4 mt-2">
                <div className="col-md-12">
                    <div className="card border-0 bg-light rounded-3">
                        <div className="card-body p-3 text-center">
                            <small className="text-muted">
                                <i className="fas fa-chart-simple me-1"></i>
                                Dernière mise à jour : {new Date().toLocaleString()}
                            </small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}