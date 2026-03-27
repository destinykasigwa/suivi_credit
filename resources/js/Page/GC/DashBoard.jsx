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
} from "recharts";

export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [signatures, setSignatures] = useState([]);
    const [timeline, setTimeline] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios
            .get("/gestion_credit/dashboard/stats")
            .then((res) => {
                setStats(res.data.stats);
                setSignatures(res.data.delaiSignatures); // signed_by + delai_moyen
                setTimeline(res.data.timeline); // mois + delai_moyen
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

    return (
       <div className="container-fluid px-4 py-4" style={{background:"#e6f2f9"}}>
  {/* En-tête */}
  <div className="d-flex justify-content-between align-items-center mb-4">
    <div>
      <h2 className="fw-bold mb-1" style={{ color: "#2c3e50" }}>
        <i className="fas fa-chart-line me-2" style={{ color: "#20c997" }}></i>
        Tableau de bord
      </h2>
      <p className="text-muted small mb-0">
        Vue d'ensemble de l'activité crédit
      </p>
    </div>
    <div className="d-flex gap-2">
      <button className="btn btn-sm btn-outline-secondary" onClick={() => window.location.reload()}>
        <i className="fas fa-sync-alt me-1"></i>
        Actualiser
      </button>
    </div>
  </div>

  {/* KPI Cards */}
  <div className="row g-4 mb-5">
    {/* Crédits en cours */}
    <div className="col-md-4">
      <a href="/gestion_credit/pages/validation-credit" className="text-decoration-none">
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = "translateY(-5px)";
               e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = "translateY(0)";
               e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
             }}>
          <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #20c997 0%, #198764 100%)" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-clock fa-2x text-white opacity-75"></i>
                  <span className="badge bg-white text-teal rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    En cours
                  </span>
                </div>
                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
                  {stats.credits_encours || 0}
                </h3>
                <p className="text-white-50 mb-0 small">dossiers en attente</p>
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
    <div className="col-md-4">
      <a href="/gestion_credit/pages/credit-decaisse" className="text-decoration-none">
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = "translateY(-5px)";
               e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = "translateY(0)";
               e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
             }}>
          <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #28a745 0%, #1e7e34 100%)" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-check-circle fa-2x text-white opacity-75"></i>
                  <span className="badge bg-white text-success rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    Décaissés
                  </span>
                </div>
                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
                  {stats.credits_decaisse || 0}
                </h3>
                <p className="text-white-50 mb-0 small">crédits décaissés</p>
              </div>
              <div className="text-end">
                <i className="fas fa-arrow-right text-white opacity-50 fa-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </a>
    </div>

    {/* Crédits rejetés */}
    <div className="col-md-4">
      <a href="/gestion_credit/pages/validation-credit" className="text-decoration-none">
        <div className="card border-0 shadow-sm rounded-3 overflow-hidden" style={{ transition: "all 0.3s ease", cursor: "pointer" }}
             onMouseEnter={(e) => {
               e.currentTarget.style.transform = "translateY(-5px)";
               e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.15)";
             }}
             onMouseLeave={(e) => {
               e.currentTarget.style.transform = "translateY(0)";
               e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.08)";
             }}>
          <div className="card-body p-4" style={{ background: "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)" }}>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="d-flex align-items-center gap-2 mb-2">
                  <i className="fas fa-times-circle fa-2x text-white opacity-75"></i>
                  <span className="badge bg-white text-danger rounded-pill px-3 py-1" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
                    Rejetés
                  </span>
                </div>
                <h3 className="text-white fw-bold mb-0" style={{ fontSize: "2.5rem" }}>
                  {stats.credits_rejetes || 0}
                </h3>
                <p className="text-white-50 mb-0 small">dossiers rejetés</p>
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

  {/* Bar Chart - Signatures par acteur */}
  <div className="card border-0 shadow-sm rounded-3 mb-4 overflow-hidden">
    <div className="card-header bg-white border-0 pt-4 pb-0">
      <div className="d-flex align-items-center gap-2">
        <div style={{ width: "40px", height: "40px", backgroundColor: "rgba(32, 201, 151, 0.1)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <i className="fas fa-signature" style={{ color: "#20c997", fontSize: "18px" }}></i>
        </div>
        <div>
          <h5 className="fw-bold mb-0">Signatures par acteur & délai moyen</h5>
          <small className="text-muted">Analyse des performances de signature</small>
        </div>
      </div>
    </div>
    <div className="card-body p-4">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={signatures} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis dataKey="signed_by" tick={{ fill: "#6c757d", fontSize: 12 }} axisLine={{ stroke: "#dee2e6" }} />
          <YAxis yAxisId="left" tick={{ fill: "#6c757d", fontSize: 12 }} axisLine={{ stroke: "#dee2e6" }} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: "#6c757d", fontSize: 12 }} axisLine={{ stroke: "#dee2e6" }} />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            cursor={{ fill: "rgba(32, 201, 151, 0.05)" }}
          />
          <Legend 
            verticalAlign="top" 
            height={40}
            wrapperStyle={{ paddingBottom: "10px" }}
            formatter={(value) => <span style={{ fontSize: "12px", fontWeight: "500" }}>{value}</span>}
          />
          <Bar yAxisId="left" dataKey="total" fill="#20c997" name="Nombre de signatures" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="total" position="top" style={{ fill: "#20c997", fontWeight: "bold", fontSize: "11px" }} />
          </Bar>
          <Bar yAxisId="right" dataKey="delai_moyen" fill="#ffc107" name="Délai moyen (jours)" radius={[8, 8, 0, 0]}>
            <LabelList dataKey="delai_moyen" position="top" style={{ fill: "#ffc107", fontWeight: "bold", fontSize: "11px" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Timeline - Délai moyen par mois */}
  <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
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
        <LineChart data={timeline} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e9ecef" />
          <XAxis dataKey="mois" tick={{ fill: "#6c757d", fontSize: 12 }} axisLine={{ stroke: "#dee2e6" }} />
          <YAxis tick={{ fill: "#6c757d", fontSize: 12 }} axisLine={{ stroke: "#dee2e6" }} />
          <Tooltip 
            contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
            labelStyle={{ fontWeight: "bold", color: "#2c3e50" }}
          />
          <Legend 
            verticalAlign="top" 
            height={40}
            wrapperStyle={{ paddingBottom: "10px" }}
          />
          <Line
            type="monotone"
            dataKey="delai_moyen"
            stroke="#20c997"
            strokeWidth={3}
            name="Délai moyen (jours)"
            dot={{ fill: "#20c997", strokeWidth: 2, r: 5, stroke: "white" }}
            activeDot={{ r: 7, fill: "#198764" }}
          >
            <LabelList 
              dataKey="delai_moyen" 
              position="top" 
              style={{ fill: "#20c997", fontWeight: "bold", fontSize: "11px" }}
            />
          </Line>
        </LineChart>
      </ResponsiveContainer>
    </div>
  </div>

  {/* Résumé des statistiques (optionnel) */}
  <div className="row g-4 mt-4">
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
