import React, { useEffect, useState } from "react";
import {
    MdTimeline,
    MdClose,
    MdDelete,
    MdVisibility,
    MdVisibilityOff,
} from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";
import { Modal } from "bootstrap";

export default function CreditTimeline({ creditId}) {
    const [timeline, setTimeline] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [selectedSignature, setSelectedSignature] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTimeLine();
    }, [creditId]);

    const getTimeLine = () => {
        setLoading(true);
        axios
            .get(`/gestion_credit/modal/${creditId}/timeline`)
            .then((res) => {
                setTimeline(res.data.data || []);
                setCurrentUser(res.data.current_user);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const dateParser = (num) => {
        if (!num) return "";
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        };
        let timestamp = Date.parse(num);
        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);
        return date.toString();
    };

    const deleteSignature = async (id) => {
        const confirmation = await Swal.fire({
            title: "Êtes-vous sûr ?",
            text: "Vous êtes sur le point de supprimer cette signature. Cette action est irréversible.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
        });

        if (confirmation.isConfirmed) {
            try {
                const res = await axios.delete(
                    "/gestion_credit/pages/files/credit/timeline/signature/delete/" +
                        id,
                );
                if (res.data.status == 1) {
                    getTimeLine();
                    Swal.fire({
                        title: "Supprimé !",
                        text: res.data.msg,
                        icon: "success",
                        timer: 3000,
                        showConfirmButton: false,
                        toast: true,
                        position: "top-end",
                    });
                } else {
                    Swal.fire({
                        title: "Erreur",
                        text: res.data.msg,
                        icon: "error",
                        confirmButtonText: "OK",
                    });
                }
            } catch (error) {
                Swal.fire({
                    title: "Erreur",
                    text: "Une erreur est survenue lors de la suppression",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const getDelayText = (delay) => {
        if (delay === 0) return "📅 Le même jour que la signature précédente";
        if (delay === 1) return "📅 1 jour après la signature précédente";
        return `📅 ${delay} jours après la signature précédente`;
    };

    return (
    <div
    className="container-fluid p-0"
    style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
    }}
>
    {/* Header moderne épuré - Fixe en haut
    <div
        className="modal-header border-0"
        style={{
            background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
            borderRadius: 0,
            padding: "1.5rem 2rem",
            flexShrink: 0,
            margin: 0,
        }}
    >
        <div className="d-flex align-items-center justify-content-between w-100">
            <div className="d-flex align-items-center gap-3">
                <div
                    style={{
                        width: "48px",
                        height: "48px",
                        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
                        borderRadius: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(16, 185, 129, 0.2)"
                    }}
                >
                    <MdTimeline size={24} color="#10b981" />
                </div>
                <div>
                    <h4 className="fw-bold mb-1" style={{
                        background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                        letterSpacing: "-0.3px",
                        margin: 0
                    }}>
                        Historique des signatures
                    </h4>
                    <p className="mb-0" style={{
                        fontSize: "0.875rem",
                        color: "rgba(255, 255, 255, 0.7)",
                        fontWeight: "400"
                    }}>
                        Suivi chronologique des signatures du dossier
                    </p>
                </div>
            </div>
        </div>
    </div> */}

    {/* Contenu principal qui prend tout l'espace restant */}
    <div className="modal-body p-0" style={{ flex: 1, overflow: "hidden" }}>
        {/* État de chargement */}
        {loading && (
            <div className="text-center py-5 px-4" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <div className="position-relative d-inline-block mb-4">
                    <div
                        className="spinner-border text-success"
                        role="status"
                        style={{
                            width: "48px",
                            height: "48px",
                            borderWidth: "3px",
                            color: "#10b981"
                        }}
                    >
                        <span className="visually-hidden">Chargement...</span>
                    </div>
                </div>
                <h6 className="fw-semibold mb-2" style={{ color: "#1e293b" }}>
                    Chargement de l'historique
                </h6>
                <p className="text-muted small mb-0">
                    Veuillez patienter quelques instants...
                </p>
            </div>
        )}

        {/* Aucune signature */}
        {!loading && timeline.length === 0 && (
            <div className="text-center py-5 px-4" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                <div
                    className="d-inline-flex align-items-center justify-content-center mb-4"
                    style={{
                        width: "96px",
                        height: "96px",
                        background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
                        borderRadius: "32px",
                    }}
                >
                    <MdTimeline size={40} color="#94a3b8" />
                </div>
                <h6 className="fw-bold mb-2" style={{ color: "#1e293b", fontSize: "1.1rem" }}>
                    Aucune signature
                </h6>
                <p className="text-muted small mb-0" style={{ maxWidth: "280px", margin: "0 auto" }}>
                    Aucune signature n'a été enregistrée pour ce dossier
                </p>
            </div>
        )}

        {/* Timeline avec signatures - Plein écran */}
        {!loading && timeline.length > 0 && (
            <div style={{ height: "100%", background: "#f8fafc", overflow: "hidden" }}>
                <div
                    className="timeline-container"
                    style={{ 
                        position: "relative", 
                        height: "100%", 
                        overflowY: "auto", 
                        padding: "2rem",
                    }}
                >
                    {/* Ligne verticale moderne */}
                    <div
                        style={{
                            position: "absolute",
                            left: "calc(2rem + 28px)",
                            top: "2rem",
                            bottom: "2rem",
                            width: "2px",
                            background: "linear-gradient(180deg, #10b981 0%, #cbd5e1 50%, #e2e8f0 100%)",
                            borderRadius: "2px",
                        }}
                    ></div>

                    <ul className="list-unstyled mb-0" style={{ maxWidth: "1200px", margin: "0 auto" }}>
                        {timeline.map((item, index) => (
                            <li
                                key={index}
                                className="mb-4 position-relative"
                                style={{ paddingLeft: "68px", animation: "fadeInUp 0.4s ease-out" }}
                            >
                                {/* Point de timeline moderne */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "8px",
                                        width: "20px",
                                        height: "20px",
                                        background: index === 0 ? "#10b981" : "#ffffff",
                                        border: `2.5px solid ${index === 0 ? "#10b981" : "#cbd5e1"}`,
                                        borderRadius: "50%",
                                        zIndex: 2,
                                        boxShadow: index === 0
                                            ? "0 0 0 4px rgba(16, 185, 129, 0.2), 0 0 0 8px rgba(16, 185, 129, 0.1)"
                                            : "0 2px 4px rgba(0, 0, 0, 0.05)",
                                        transition: "all 0.2s ease",
                                    }}
                                ></div>

                                {/* Carte de signature modernisée */}
                                <div
                                    className="card border-0 shadow-hover"
                                    style={{
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        backgroundColor: "#ffffff",
                                        borderRadius: "20px",
                                        border: index === 0 ? "1px solid rgba(16, 185, 129, 0.2)" : "1px solid #f1f5f9",
                                        boxShadow: index === 0
                                            ? "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1)"
                                            : "0 2px 8px rgba(0, 0, 0, 0.04)",
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = "translateX(4px)";
                                        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0, 0, 0, 0.08)";
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = "translateX(0)";
                                        e.currentTarget.style.boxShadow = index === 0
                                            ? "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1)"
                                            : "0 2px 8px rgba(0, 0, 0, 0.04)";
                                    }}
                                >
                                    <div className="card-body p-4">
                                        <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center gap-2 mb-2">
                                                    <span className="fw-bold" style={{
                                                        fontSize: "1rem",
                                                        color: "#0f172a",
                                                        letterSpacing: "-0.2px"
                                                    }}>
                                                        {item.signed_by}
                                                    </span>
                                                    {index === 0 && (
                                                        <span className="badge" style={{
                                                            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                                                            color: "white",
                                                            fontSize: "0.7rem",
                                                            padding: "4px 10px",
                                                            borderRadius: "30px",
                                                            fontWeight: "500",
                                                            letterSpacing: "-0.2px"
                                                        }}>
                                                            ✨ Dernière signature
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="d-flex flex-wrap gap-3 mb-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                                            <line x1="16" y1="2" x2="16" y2="6"></line>
                                                            <line x1="8" y1="2" x2="8" y2="6"></line>
                                                            <line x1="3" y1="10" x2="21" y2="10"></line>
                                                        </svg>
                                                        <small className="text-secondary" style={{ color: "#64748b" }}>
                                                            Signé le : {dateParser(item.signed_at)}
                                                        </small>
                                                    </div>

                                                    {item.delay_from_previous !== null && (
                                                        <div className="d-flex align-items-center gap-2">
                                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                                                <circle cx="12" cy="12" r="10"></circle>
                                                                <polyline points="12 6 12 12 16 14"></polyline>
                                                            </svg>
                                                            <small className="text-secondary">
                                                                {getDelayText(item.delay_from_previous)}
                                                            </small>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Boutons d'action modernisés */}
                                            {item.signature_file && (
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn"
                                                        onClick={() => setSelectedSignature(
                                                            selectedSignature === `storage/${item.signature_file}`
                                                                ? null
                                                                : `storage/${item.signature_file}`
                                                        )}
                                                        style={{
                                                            background: selectedSignature === `storage/${item.signature_file}`
                                                                ? "#e2e8f0"
                                                                : "#f1f5f9",
                                                            color: "#334155",
                                                            borderRadius: "12px",
                                                            padding: "8px 16px",
                                                            fontSize: "0.8rem",
                                                            fontWeight: "500",
                                                            transition: "all 0.2s ease",
                                                            border: "none",
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.currentTarget.style.background = "#e2e8f0";
                                                            e.currentTarget.style.transform = "translateY(-1px)";
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.currentTarget.style.background = selectedSignature === `storage/${item.signature_file}`
                                                                ? "#e2e8f0"
                                                                : "#f1f5f9";
                                                            e.currentTarget.style.transform = "translateY(0)";
                                                        }}
                                                    >
                                                        <i className={`fas ${selectedSignature === `storage/${item.signature_file}` ? "fa-eye-slash" : "fa-eye"} me-2`}></i>
                                                        {selectedSignature === `storage/${item.signature_file}` ? "Masquer" : "Voir la signature"}
                                                    </button>

                                                    {currentUser && (item.signed_by === currentUser.role || currentUser.role === "DG") && (
                                                        <button
                                                            className="btn"
                                                            onClick={() => deleteSignature(item.id)}
                                                            style={{
                                                                background: "#fef2f2",
                                                                color: "#dc2626",
                                                                borderRadius: "12px",
                                                                padding: "8px 16px",
                                                                fontSize: "0.8rem",
                                                                fontWeight: "500",
                                                                transition: "all 0.2s ease",
                                                                border: "none",
                                                            }}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.background = "#fee2e2";
                                                                e.currentTarget.style.transform = "translateY(-1px)";
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.background = "#fef2f2";
                                                                e.currentTarget.style.transform = "translateY(0)";
                                                            }}
                                                        >
                                                            <MdDelete size={14} className="me-1" />
                                                            Supprimer
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {/* Aperçu de la signature modernisé */}
                                        {selectedSignature === `storage/${item.signature_file}` && (
                                            <div
                                                className="mt-4 overflow-hidden"
                                                style={{
                                                    background: "#ffffff",
                                                    borderRadius: "16px",
                                                    border: "1px solid #e2e8f0",
                                                }}
                                            >
                                                <div
                                                    className="px-4 py-3"
                                                    style={{
                                                        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
                                                        borderBottom: "1px solid #e2e8f0",
                                                    }}
                                                >
                                                    <div className="d-flex align-items-center gap-2">
                                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2">
                                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                                            <polyline points="14 2 14 8 20 8"></polyline>
                                                            <line x1="16" y1="13" x2="8" y2="13"></line>
                                                            <line x1="16" y1="17" x2="8" y2="17"></line>
                                                            <polyline points="10 9 9 9 8 9"></polyline>
                                                        </svg>
                                                        <small className="fw-semibold" style={{ color: "#475569" }}>
                                                            Aperçu du document signé
                                                        </small>
                                                    </div>
                                                </div>
                                                <div style={{ height: "500px", background: "#f8fafc" }}>
                                                    <iframe
                                                        src={`/pdfjs/web/viewer.html?file=/storage/${item.signature_file}#toolbar=0&navpanes=0`}
                                                        style={{
                                                            width: "100%",
                                                            height: "100%",
                                                            border: "none",
                                                        }}
                                                        title="Aperçu de la signature"
                                                    ></iframe>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )}
    </div>

    <style jsx>{`
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .shadow-hover {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .timeline-container::-webkit-scrollbar {
            width: 8px;
        }
        
        .timeline-container::-webkit-scrollbar-track {
            background: #e2e8f0;
            border-radius: 10px;
        }
        
        .timeline-container::-webkit-scrollbar-thumb {
            background: #cbd5e1;
            border-radius: 10px;
        }
        
        .timeline-container::-webkit-scrollbar-thumb:hover {
            background: #94a3b8;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
    `}</style>
</div>
    );
}

