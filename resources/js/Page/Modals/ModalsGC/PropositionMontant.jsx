// src/components/PropositionMontant.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import 'sweetalert2/dist/sweetalert2.css';
// import '../../../styles/style.css';

const PropositionMontant = ({
    dossierId,
    onMontantPropose,
    currentUserId = null,
}) => {
    const [montantPropose, setMontantPropose] = useState("");
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [message, setMessage] = useState(null);
    const [historique, setHistorique] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [commentaire, setCommentaire] = useState('');

    // Récupérer l'historique des propositions depuis l'API
    const fetchHistorique = async () => {
        if (!dossierId) return;

        try {
            const response = await axios.get(
                `/gestion_credit/dossier/montant-propose/${dossierId}`,
            );
            setHistorique(response.data);
        } catch (error) {
            console.error("Erreur lors du chargement de l'historique", error);
            setMessage({
                type: "error",
                text: "Impossible de charger l'historique des propositions",
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    useEffect(() => {
        if (dossierId) {
            fetchHistorique();
        }
    }, [dossierId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const montantValue = parseFloat(montantPropose.replace(/\s/g, ""));

        if (!montantValue || montantValue <= 0) {
            setMessage({
                type: "error",
                text: "Veuillez entrer un montant valide",
            });
            setTimeout(() => setMessage(null), 3000);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "/gestion_credit/dossier/montant-propose",
                {
                    idDossier: dossierId,
                    montantPropose: montantValue,
                    commentaire: commentaire.trim() // Ajout du commentaire
                },
            );

            console.log(response.data.status);
            if (response.data.status == 1) {
                Swal.fire({
                icon: 'success',
                title: 'Proposition envoyée !',
                text: `Montant de ${new Intl.NumberFormat('fr-FR').format(montantValue)}  proposé avec succès`,
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
               
                setMontantPropose("");
                setShowForm(false);
                // Recharger l'historique complet
                await fetchHistorique();
            }

            // Notifier le parent
            if (onMontantPropose) {
                onMontantPropose(response.data);
            }

            setTimeout(() => setMessage(null), 3000);
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Erreur',
                text: error.response?.data?.message || 'Erreur lors de la proposition',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
            });
            setMessage({ type: "error", text: errorMessage });
            setTimeout(() => setMessage(null), 3000);
        } finally {
            setLoading(false);
        }
    };

    // Formater le montant avec espaces
    const formatMontant = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    // Gérer le changement de montant
    const handleMontantChange = (e) => {
        const rawValue = e.target.value.replace(/\s/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            setMontantPropose(rawValue);
        }
    };

   // Supprimer une proposition avec SweetAlert2
    const handleDelete = async (id, montant, userName) => {
        const result = await Swal.fire({
            title: 'Confirmation de suppression',
            html: `Êtes-vous sûr de vouloir supprimer la proposition de <strong>${userName}</strong> ?<br/>
                   Montant: <strong class="text-danger">${new Intl.NumberFormat('fr-FR').format(montant)} </strong>`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc3545',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Oui, supprimer',
            cancelButtonText: 'Annuler',
            reverseButtons: true,
            customClass: {
                confirmButton: 'btn btn-danger',
                cancelButton: 'btn btn-secondary'
            }
        });

        if (result.isConfirmed) {
            setDeleteLoading(id);
            
            try {
                await axios.delete(`/gestion_credit/dossier/montant-propose/${id}`);
                
                Swal.fire({
                    icon: 'success',
                    title: 'Supprimé !',
                    text: 'La proposition a été supprimée avec succès',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
                
                fetchHistorique(); // Recharger l'historique
                
            } catch (error) {
                console.error('Erreur lors de la suppression', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Erreur',
                    text: error.response?.data?.message || 'Erreur lors de la suppression',
                    toast: true,
                    position: 'top-end',
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true
                });
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    return (
        <>
            <style>{`
                /* Timeline container */
                .pm-timeline-container {
                    position: relative;
                    padding: 0;
                    max-height: 350px;
                    overflow-y: auto;
                }
                
                .pm-timeline-container::-webkit-scrollbar {
                    width: 3px;
                }
                
                .pm-timeline-container::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 5px;
                }
                
                .pm-timeline-container::-webkit-scrollbar-thumb {
                    background: #20c997;
                    border-radius: 5px;
                }
                
                @keyframes pm-slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .pm-timeline-item-last {
                    animation: pm-slideIn 0.2s ease-out;
                }
                
                .pm-input-group:focus-within {
                    box-shadow: 0 0 0 2px rgba(32, 201, 151, 0.2);
                    border-radius: 8px;
                }
                
                .pm-input-group:focus-within .pm-input-group-text,
                .pm-input-group:focus-within .pm-input {
                    border-color: #20c997 !important;
                }
                
                .pm-input-group-text {
                    font-size: 12px;
                    border: 1px solid #dee2e6;
                    border-right: none;
                    border-radius: 8px 0 0 8px;
                    display: flex;
                    align-items: center;
                    background-color: #f8f9fa;
                    padding: 0 10px;
                }
                
                .pm-input {
                    font-size: 14px;
                    font-weight: 500;
                    text-align: right;
                    padding: 6px 12px;
                    border: 1px solid #dee2e6;
                    border-left: none;
                    border-radius: 0 8px 8px 0;
                    width: 100%;
                }
                
                .pm-input:focus {
                    outline: none;
                    border-color: #20c997;
                }
                
                @keyframes pm-pulse {
                    0% {
                        transform: scale(0.95);
                        opacity: 0.7;
                    }
                    100% {
                        transform: scale(1.05);
                        opacity: 1;
                    }
                }
                
                .pm-badge-last {
                    animation: pm-pulse 0.5s ease-out;
                }
                
                .pm-btn-custom {
                    transition: all 0.2s ease !important;
                }
                
                .pm-btn-custom:hover:not(:disabled) {
                    transform: translateY(-1px);
                }
                
                .pm-message-success {
                    background-color: #28a745;
                    color: white;
                }
                
                .pm-message-error {
                    background-color: #dc3545;
                    color: white;
                }
                
                .pm-message {
                    font-size: 12px;
                    padding: 4px 8px;
                    border-radius: 6px;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                }
                
                .pm-delete-btn {
                    background: none;
                    border: none;
                    color: #dc3545;
                    cursor: pointer;
                    padding: 0 4px;
                    font-size: 12px;
                    transition: all 0.2s ease;
                }
                
                .pm-delete-btn:hover:not(:disabled) {
                    color: #b02a37;
                    transform: scale(1.1);
                }
                
                .pm-delete-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
<div className="card border-0 shadow-sm rounded-3 mt-3">
    <div className="card-header bg-white border-0 px-4 py-3">
        <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
                <div
                    style={{
                        width: "36px",
                        height: "36px",
                        backgroundColor: "rgba(32, 201, 151, 0.12)",
                        borderRadius: "10px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <i
                        className="fas fa-hand-holding-usd"
                        style={{
                            fontSize: "18px",
                            color: "#20c997",
                        }}
                    ></i>
                </div>
                <div>
                    <h6
                        className="fw-semibold mb-0"
                        style={{ fontSize: "1rem" }}
                    >
                        Propositions de montant
                    </h6>
                    <small className="text-muted" style={{ fontSize: "11px" }}>
                        Suivez l'historique des propositions des montants 
                    </small>
                </div>
                <span
                    className="badge"
                    style={{
                        fontSize: "11px",
                        padding: "4px 10px",
                        backgroundColor: "#20c997",
                        color: "white",
                        borderRadius: "20px",
                    }}
                >
                    <i className="fas fa-chart-line me-1"></i>
                    Propositions...
                </span>
            </div>
            <button
                onClick={() => setShowForm(!showForm)}
                className="btn pm-btn-custom"
                style={{
                    backgroundColor: showForm ? "#dc3545" : "#20c997",
                    color: "white",
                    borderRadius: "24px",
                    padding: "8px 20px",
                    fontSize: "13px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    border: "none",
                }}
            >
                <i
                    className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}
                    style={{ fontSize: "12px" }}
                ></i>
                {showForm ? "Annuler" : "Proposer un montant"}
            </button>
        </div>
    </div>

    <div className="card-body pt-0 px-4 pb-4">
        {/* Timeline des propositions */}
        {historique.length > 0 ? (
            <div className="pm-timeline-container" style={{ maxHeight: "400px", overflowY: "auto" }}>
                {historique.map((item, index) => {
                    const isOwner = currentUserId && item.idUser === currentUserId;

                    return (
                        <div
                            key={item.id}
                            className={`d-flex gap-3 mb-3 position-relative ${index === historique.length - 1 ? "pm-timeline-item-last" : ""}`}
                        >
                            {/* Icône timeline */}
                            <div
                                className="flex-shrink-0"
                                style={{
                                    position: "relative",
                                    zIndex: 2,
                                }}
                            >
                                <div
                                    style={{
                                        width: "40px",
                                        height: "40px",
                                        backgroundColor:
                                            index === historique.length - 1
                                                ? "#20c997"
                                                : "#f0f2f5",
                                        borderRadius: "50%",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow:
                                            index === historique.length - 1
                                                ? "0 0 0 3px rgba(32, 201, 151, 0.2)"
                                                : "none",
                                    }}
                                >
                                    <i
                                        className={`fas ${index === historique.length - 1 ? "fa-star text-white" : "fa-user text-secondary"}`}
                                        style={{ fontSize: "16px" }}
                                    ></i>
                                </div>
                                {index < historique.length - 1 && (
                                    <div
                                        style={{
                                            width: "2px",
                                            height: "calc(100% + 12px)",
                                            backgroundColor: "#e9ecef",
                                            marginLeft: "19px",
                                            marginTop: "4px",
                                            position: "absolute",
                                            top: "40px",
                                            left: "0",
                                        }}
                                    ></div>
                                )}
                            </div>

                            {/* Contenu */}
                            <div
                                className="flex-grow-1"
                                style={{ paddingBottom: "6px" }}
                            >
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <div className="d-flex align-items-center gap-2">
                                        <span
                                            className="fw-semibold"
                                            style={{
                                                fontSize: "14px",
                                                color: "#1a2632",
                                            }}
                                        >
                                            {item.user?.role || "Utilisateur"}
                                        </span>
                                        {isOwner && (
                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id, item.montant_propose, item.user?.name)
                                                }
                                                disabled={deleteLoading === item.id}
                                                className="pm-delete-btn"
                                                title="Supprimer ma proposition"
                                                style={{
                                                    background: "none",
                                                    border: "none",
                                                    color: "#dc3545",
                                                    cursor: "pointer",
                                                    padding: "4px",
                                                    fontSize: "12px",
                                                    transition: "all 0.2s ease",
                                                }}
                                            >
                                                {deleteLoading === item.id ? (
                                                    <span
                                                        className="spinner-border spinner-border-sm"
                                                        style={{
                                                            width: "12px",
                                                            height: "12px",
                                                        }}
                                                    ></span>
                                                ) : (
                                                    <i className="fas fa-trash-alt"></i>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                    <small
                                        className="text-muted"
                                        style={{ fontSize: "11px" }}
                                    >
                                        <i className="fas fa-calendar-alt me-1"></i>
                                        {new Date(item.created_at).toLocaleDateString("fr-FR", {
                                            day: "2-digit",
                                            month: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </small>
                                </div>
                                <div
                                    className="bg-light px-3 py-2 rounded-3 d-flex justify-content-between align-items-center"
                                    style={{
                                        backgroundColor: "#f8f9fa !important",
                                        borderRadius: "12px",
                                    }}
                                >
                                    <span
                                        className="text-muted"
                                        style={{ fontSize: "12px" }}
                                    >
                                        Montant proposé
                                    </span>
                                    <span
                                        className="fw-bold"
                                        style={{
                                            color: "#20c997",
                                            fontSize: "18px",
                                        }}
                                    >
                                        {new Intl.NumberFormat("fr-FR").format(item.montant_propose)} 
                                    </span>
                                </div>

    
                                {/* Affichage du commentaire si présent */}
                                {item.commentaire && (
                                    <div className="mt-2 p-2 bg-light rounded-3" style={{ backgroundColor: "#fff3cd !important", borderLeft: "4px solid #ffc107" }}>
                                        <div className="d-flex gap-2">
                                            <i className="fas fa-comment-dots" style={{ color: "#ffc107", fontSize: "12px" }}></i>
                                            <div>
                                                <small className="fw-semibold" style={{ fontSize: "11px", color: "#856404" }}>
                                                    Justification:
                                                </small>
                                                <p className="mb-0 small" style={{ fontSize: "11px", color: "#856404" }}>
                                                    {item.commentaire}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {index === historique.length - 1 && (
                                    <div className="mt-2 text-end">
                                        <span
                                            className="badge"
                                            style={{
                                                backgroundColor: "#20c997",
                                                fontSize: "10px",
                                                padding: "4px 10px",
                                                borderRadius: "20px",
                                            }}
                                        >
                                            <i className="fas fa-clock me-1"></i>
                                            Dernière proposition
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-5">
                <i
                    className="fas fa-chart-line fa-3x mb-3 opacity-50"
                    style={{ color: "#adb5bd", fontSize: "32px" }}
                ></i>
                <p
                    className="mb-1 fw-semibold"
                    style={{ fontSize: "14px", color: "#6c757d" }}
                >
                    Aucune proposition de montant
                </p>
                <small
                    className="text-muted"
                    style={{ fontSize: "12px" }}
                >
                    Soyez le premier à proposer un montant pour ce dossier
                </small>
            </div>
        )}

        {/* Formulaire compact amélioré avec champ commentaire */}
        {showForm && (
            <form onSubmit={handleSubmit} className="mt-4 pt-3 border-top">
                <div className="mb-3">
                    <label
                        className="form-label fw-semibold mb-2"
                        style={{
                            color: "#4682b4",
                            fontSize: "13px",
                        }}
                    >
                        <i className="fas fa-money-bill-wave me-2"></i>
                        Montant proposé
                    </label>
                    <div
                        className="pm-input-group d-flex"
                        style={{ height: "48px" }}
                    >
                        <span
                            className="pm-input-group-text"
                            style={{
                                fontSize: "14px",
                                border: "1px solid #dee2e6",
                                borderRight: "none",
                                borderRadius: "12px 0 0 12px",
                                display: "flex",
                                alignItems: "center",
                                backgroundColor: "#f8f9fa",
                                padding: "0 16px",
                                fontWeight: "500",
                                color: "#495057",
                            }}
                        >
                            <i className="fas fa-money-bill-wave me-2" style={{ color: "#20c997" }}></i>
                            Montant
                        </span>
                        <input
                            type="text"
                            className="pm-input"
                            placeholder="0"
                            value={formatMontant(montantPropose)}
                            onChange={handleMontantChange}
                            disabled={loading}
                            autoFocus
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                textAlign: "right",
                                padding: "12px 16px",
                                border: "1px solid #dee2e6",
                                borderLeft: "none",
                                borderRadius: "0 12px 12px 0",
                                width: "100%",
                                outline: "none",
                                transition: "all 0.2s ease",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#20c997";
                                e.target.style.boxShadow = "0 0 0 3px rgba(32, 201, 151, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#dee2e6";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                    </div>
                    <small className="text-muted d-block mt-2" style={{ fontSize: "11px" }}>
                        <i className="fas fa-info-circle me-1"></i>
                        Saisissez le montant 
                    </small>
                </div>

                {/* Nouveau champ commentaire */}
                <div className="mb-3">
                    <label
                        className="form-label fw-semibold mb-2"
                        style={{
                            color: "#4682b4",
                            fontSize: "13px",
                        }}
                    >
                        <i className="fas fa-comment-dots me-2"></i>
                        Justification / Commentaire
                        <span className="text-muted ms-1" style={{ fontSize: "11px", fontWeight: "normal" }}>
                            (optionnel)
                        </span>
                    </label>
                    <div className="position-relative">
                        <textarea
                            className="form-control"
                            rows="3"
                            placeholder="Expliquez les raisons de votre proposition..."
                            value={commentaire}
                            onChange={(e) => setCommentaire(e.target.value)}
                            disabled={loading}
                            style={{
                                borderRadius: "12px",
                                border: "1px solid #dee2e6",
                                padding: "12px 16px",
                                fontSize: "14px",
                                resize: "vertical",
                                transition: "all 0.2s ease",
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = "#20c997";
                                e.target.style.boxShadow = "0 0 0 3px rgba(32, 201, 151, 0.1)";
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = "#dee2e6";
                                e.target.style.boxShadow = "none";
                            }}
                        />
                        <div className="position-absolute bottom-0 end-0 p-2">
                            <small className="text-muted" style={{ fontSize: "10px" }}>
                                <i className="fas fa-info-circle me-1"></i>
                                {commentaire.length}/<i className="fas fa-infinity" style={{ color: "#20c997", fontSize: "9px" }}></i>
                            </small>
                        </div>
                    </div>
                    <div className="d-flex gap-3 mt-1">
                        <small className="text-muted" style={{ fontSize: "10px" }}>
                            <i className="fas fa-lightbulb me-1"></i>
                            Exemples: "Conforme aux directives", "Nécessite approbation", etc.
                        </small>
                    </div>
                </div>

                {/* Indicateur de caractères restants (optionnel) */}
                {commentaire.length > 400 && (
                    <div className="alert alert-warning py-1 px-2 mb-2" style={{ fontSize: "10px", borderRadius: "9px" }}>
                        <i className="fas fa-exclamation-triangle me-1"></i>
                        Vous avez tapé {commentaire.length} / <i className="fas fa-infinity" style={{ color: "#20c997", fontSize: "16px" }}></i>
                    </div>
                )}

                <button
                    type="submit"
                    className="btn w-100 py-3 fw-bold pm-btn-custom"
                    style={{
                        background: loading
                            ? "#adb5bd"
                            : "linear-gradient(135deg, #20c997, #198764)",
                        color: "white",
                        borderRadius: "12px",
                        border: "none",
                        fontSize: "15px",
                        fontWeight: "600",
                        transition: "all 0.3s ease",
                        cursor: loading ? "not-allowed" : "pointer",
                    }}
                    disabled={loading}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = "translateY(-2px)";
                            e.currentTarget.style.boxShadow = "0 6px 16px rgba(32, 201, 151, 0.3)";
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (!loading) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                        }
                    }}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Envoi en cours...
                        </>
                    ) : (
                        <>
                            <i className="fas fa-paper-plane me-2"></i>
                            Proposer ce montant
                        </>
                    )}
                </button>
            </form>
        )}
    </div>
</div>
        </>
    );
};

export default PropositionMontant;
