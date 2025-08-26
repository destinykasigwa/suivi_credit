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
        <div className="container my-4">
            <h2 className="mb-4">Tableau de bord - Gestion Crédit</h2>

            {/* KPI Cards */}
            <div className="row mb-4">
                <div className="col-md-4">
                    <a href="/gestion_credit/pages/validation-credit">
                        <div className="card text-white bg-primary mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">Crédits en cours</h5>
                                <p className="card-text display-6">
                                    {stats.credits_encours}
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
                <div className="col-md-4">
                    <a href="/gestion_credit/pages/credit-decaisse">
                        <div className="card text-white bg-success mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">
                                    Crédits décaissés
                                </h5>
                                <p className="card-text display-6">
                                    {stats.credits_decaisse}
                                </p>
                            </div>
                        </div>
                    </a>
                </div>

                <div className="col-md-4">
                    <a href="/gestion_credit/pages/validation-credit">
                        <div className="card text-white bg-danger mb-3">
                            <div className="card-body text-center">
                                <h5 className="card-title">Crédits rejetés</h5>
                                <p className="card-text display-6">
                                    {" "}
                                    {stats.credits_rejetes}{" "}
                                </p>
                            </div>
                        </div>
                    </a>
                </div>
            </div>

            {/* Bar Chart - Signatures par acteur */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        Signatures par acteur & délai moyen
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={signatures}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="signed_by" />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Bar
                                dataKey="total"
                                fill="#007bff"
                                name="Nombre de signatures"
                            >
                                <LabelList dataKey="total" position="top" />
                            </Bar>
                            <Bar
                                dataKey="delai_moyen"
                                fill="#28a745"
                                name="Délai moyen (jours)"
                            >
                                <LabelList
                                    dataKey="delai_moyen"
                                    position="top"
                                />
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Timeline - Délai moyen par mois */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title mb-3">
                        Évolution du délai moyen de signature (par mois)
                    </h5>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={timeline}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="mois" />
                            <YAxis />
                            <Tooltip />
                            <Legend verticalAlign="top" height={36} />
                            <Line
                                type="monotone"
                                dataKey="delai_moyen"
                                stroke="#007bff"
                                strokeWidth={3}
                                name="Délai moyen (jours)"
                                label={{ position: "top" }} // valeurs affichées sur les points
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
