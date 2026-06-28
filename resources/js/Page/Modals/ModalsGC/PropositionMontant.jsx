// src/components/PropositionMontant.jsx
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.css";

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
    const [commentaire, setCommentaire] = useState("");
    const [signatureFile, setSignatureFile] = useState(null);
    const [signaturePreview, setSignaturePreview] = useState(null); // URL objet pour l'aperçu
    const fileInputRef = useRef(null);

    // Nettoyer l'URL de l'objet quand le fichier change ou démontage
    useEffect(() => {
        return () => {
            if (signaturePreview) {
                URL.revokeObjectURL(signaturePreview);
            }
        };
    }, [signaturePreview]);

    // Mettre à jour l'aperçu lorsqu'un fichier est sélectionné
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Vérifier le type et la taille (5MB max)
        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "application/pdf",
        ];
        if (!validTypes.includes(file.type)) {
            Swal.fire({
                icon: "error",
                title: "Format non supporté",
                text: "Veuillez choisir une image (JPEG, PNG, GIF) ou un PDF.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            e.target.value = ""; // réinitialiser
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            Swal.fire({
                icon: "error",
                title: "Fichier trop volumineux",
                text: "La taille maximale autorisée est de 5 Mo.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            e.target.value = "";
            return;
        }

        // Supprimer l'ancien aperçu
        if (signaturePreview) {
            URL.revokeObjectURL(signaturePreview);
        }

        setSignatureFile(file);
        const previewUrl = URL.createObjectURL(file);
        setSignaturePreview(previewUrl);
    };

    // Supprimer le fichier sélectionné
    const removeFile = () => {
        if (signaturePreview) {
            URL.revokeObjectURL(signaturePreview);
        }
        setSignatureFile(null);
        setSignaturePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Récupérer l'historique
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
                text: "Impossible de charger l'historique",
            });
            setTimeout(() => setMessage(null), 3000);
        }
    };

    useEffect(() => {
        if (dossierId) fetchHistorique();
    }, [dossierId]);

    // Soumission du formulaire avec signature
    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Vérification du montant
        const montantValue = parseFloat(montantPropose.replace(/\s/g, ""));
        if (!montantValue || montantValue <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Montant requis",
                text: "Veuillez saisir un montant valide (supérieur à 0).",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        // 2. Vérification du commentaire
        if (!commentaire.trim()) {
            Swal.fire({
                icon: "warning",
                title: "Justification requise",
                text: "Veuillez ajouter une justification pour votre proposition.",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        // 3. Vérification de la signature
        if (!signatureFile) {
            Swal.fire({
                icon: "warning",
                title: "Signature manquante",
                text: "Veuillez joindre votre signature (fichier PDF ou image).",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
            return;
        }

        // Tous les champs sont remplis → envoi
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append("idDossier", dossierId);
            formData.append("montantPropose", montantValue);
            formData.append("commentaire", commentaire.trim());
            formData.append("signature_file", signatureFile);

            const response = await axios.post(
                "/gestion_credit/dossier/montant-propose",
                formData,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );

            if (response.data.status === 1) {
                Swal.fire({
                    icon: "success",
                    title: "Proposition envoyée !",
                    text: `Montant de ${new Intl.NumberFormat("fr-FR").format(montantValue)} proposé avec succès`,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                setMontantPropose("");
                setCommentaire("");
                removeFile();
                setShowForm(false);
                await fetchHistorique();
                if (onMontantPropose) onMontantPropose(response.data);
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Erreur lors de l'envoie de la proposition",
                    text: response.data.msg,
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 5000,
                    timerProgressBar: true,
                });
                // throw new Error(response.data.msg || "Erreur inconnue");
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Erreur",
                text:
                    error.response?.data?.msg ||
                    error.message ||
                    "Erreur lors de la proposition",
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
            });
        } finally {
            setLoading(false);
        }
    };

    // Formattage du montant
    const formatMontant = (value) => {
        if (!value) return "";
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    };

    const handleMontantChange = (e) => {
        const rawValue = e.target.value.replace(/\s/g, "");
        if (rawValue === "" || /^\d+$/.test(rawValue)) {
            setMontantPropose(rawValue);
        }
    };

    // Suppression d'une proposition
    const handleDelete = async (id, montant, userName) => {
        const result = await Swal.fire({
            title: "Confirmation de suppression",
            html: `Êtes-vous sûr de vouloir supprimer la proposition de <strong>${userName}</strong> ?<br/>
                   Montant: <strong class="text-danger">${new Intl.NumberFormat("fr-FR").format(montant)} </strong>`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#dc3545",
            cancelButtonColor: "#6c757d",
            confirmButtonText: "Oui, supprimer",
            cancelButtonText: "Annuler",
            reverseButtons: true,
            customClass: {
                confirmButton: "btn btn-danger",
                cancelButton: "btn btn-secondary",
            },
        });

        if (result.isConfirmed) {
            setDeleteLoading(id);
            try {
                await axios.delete(
                    `/gestion_credit/dossier/montant-propose/${id}`,
                );
                Swal.fire({
                    icon: "success",
                    title: "Supprimé !",
                    text: "La proposition a été supprimée avec succès",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
                fetchHistorique();
            } catch (error) {
                Swal.fire({
                    icon: "error",
                    title: "Erreur",
                    text:
                        error.response?.data?.message ||
                        "Erreur lors de la suppression",
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                });
            } finally {
                setDeleteLoading(null);
            }
        }
    };

    return (
        <>
            <style>{`
                .pm-container {
                    background: #ffffff;
                    border-radius: 16px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.04);
                    transition: all 0.3s ease;
                }
                .pm-header {
                    border-bottom: 1px solid rgba(0,0,0,0.05);
                    padding: 1.25rem 1.5rem;
                }
                .pm-timeline {
                    max-height: 400px;
                    overflow-y: auto;
                    padding: 0.5rem 0.25rem;
                }
                .pm-timeline::-webkit-scrollbar {
                    width: 4px;
                }
                .pm-timeline::-webkit-scrollbar-track {
                    background: #f1f1f1;
                    border-radius: 8px;
                }
                .pm-timeline::-webkit-scrollbar-thumb {
                    background: #20c997;
                    border-radius: 8px;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .pm-item-last {
                    animation: slideIn 0.3s ease-out;
                }
                .pm-badge-last {
                    animation: pulse 0.8s ease-out;
                }
                @keyframes pulse {
                    0% { transform: scale(0.9); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .pm-input-group {
                    border-radius: 12px;
                    overflow: hidden;
                    border: 1px solid #dee2e6;
                    transition: all 0.2s;
                    background: #f8f9fa;
                }
                .pm-input-group:focus-within {
                    border-color: #20c997;
                    box-shadow: 0 0 0 3px rgba(32,201,151,0.15);
                }
                .pm-input-group-text {
                    background: transparent;
                    border: none;
                    padding: 0.625rem 1rem;
                    font-weight: 600;
                    color: #495057;
                }
                .pm-input {
                    border: none;
                    background: transparent;
                    padding: 0.625rem 1rem;
                    font-size: 1.25rem;
                    font-weight: 600;
                    text-align: right;
                    width: 100%;
                    outline: none;
                }
                .pm-input::placeholder {
                    font-weight: 400;
                    color: #adb5bd;
                }
                .pm-file-upload {
                    border: 2px dashed #dee2e6;
                    border-radius: 12px;
                    padding: 0.75rem;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.2s;
                    background: #fafafa;
                }
                .pm-file-upload:hover {
                    border-color: #20c997;
                    background: rgba(32,201,151,0.03);
                }
                .pm-file-upload.has-file {
                    border-color: #20c997;
                    background: rgba(32,201,151,0.06);
                }
                .pm-preview-image {
                    max-width: 100%;
                    max-height: 120px;
                    border-radius: 8px;
                    object-fit: contain;
                }
                .pm-preview-pdf {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 1rem;
                    padding: 0.5rem;
                    background: #f8f9fa;
                    border-radius: 8px;
                }
                .pm-btn-primary {
                    background: linear-gradient(135deg, #20c997 0%, #198764 100%);
                    border: none;
                    color: white;
                    border-radius: 12px;
                    padding: 0.75rem 1.5rem;
                    font-weight: 600;
                    transition: all 0.25s ease;
                }
                .pm-btn-primary:hover:not(:disabled) {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(32,201,151,0.3);
                }
                .pm-btn-primary:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .pm-btn-outline {
                    background: transparent;
                    border: 1px solid #dee2e6;
                    border-radius: 40px;
                    padding: 0.5rem 1.25rem;
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .pm-btn-outline:hover {
                    background: #f1f3f5;
                    border-color: #adb5bd;
                }
                .pm-text-teal {
                    color: #20c997;
                }
                .pm-bg-teal-soft {
                    background: rgba(32,201,151,0.08);
                }
            `}</style>

            <div className="pm-container mt-3">
                {/* En-tête */}
                <div className="pm-header d-flex align-items-center justify-content-between flex-wrap gap-2">
                    <div className="d-flex align-items-center gap-3">
                        <div className="pm-bg-teal-soft p-2 rounded-3">
                            <i className="fas fa-hand-holding-usd text-teal fs-4"></i>
                        </div>
                        <div>
                            <h6
                                className="fw-bold mb-0"
                                style={{ fontSize: "1.05rem" }}
                            >
                                Propositions de montant
                            </h6>
                            <small
                                className="text-muted"
                                style={{ fontSize: "0.75rem" }}
                            >
                                Historique et nouvelle proposition
                            </small>
                        </div>
                        <span className="badge bg-teal rounded-pill px-3 py-1">
                            <i className="fas fa-chart-line me-1"></i>
                            {historique.length} proposition(s)
                        </span>
                    </div>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="btn pm-btn-toggle"
                        style={{
                            fontSize: "0.85rem",
                            borderRadius: "40px",
                            padding: "0.5rem 1.25rem",
                            fontWeight: "500",
                            transition: "all 0.25s ease",
                            border: "1px solid",
                            // Styles conditionnels selon showForm
                            backgroundColor: showForm
                                ? "#dc3545"
                                : "transparent",
                            color: showForm ? "white" : "#20c997",
                            borderColor: showForm ? "#dc3545" : "#20c997",
                            cursor: "pointer",
                            boxShadow: showForm
                                ? "0 4px 12px rgba(220, 53, 69, 0.3)"
                                : "none",
                        }}
                        onMouseEnter={(e) => {
                            if (showForm) {
                                e.currentTarget.style.backgroundColor =
                                    "#c82333";
                                e.currentTarget.style.boxShadow =
                                    "0 6px 18px rgba(220, 53, 69, 0.4)";
                            } else {
                                e.currentTarget.style.backgroundColor =
                                    "#20c997";
                                e.currentTarget.style.color = "white";
                                e.currentTarget.style.borderColor = "#20c997";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (showForm) {
                                e.currentTarget.style.backgroundColor =
                                    "#dc3545";
                                e.currentTarget.style.boxShadow =
                                    "0 4px 12px rgba(220, 53, 69, 0.3)";
                            } else {
                                e.currentTarget.style.backgroundColor =
                                    "transparent";
                                e.currentTarget.style.color = "#20c997";
                                e.currentTarget.style.borderColor = "#20c997";
                            }
                        }}
                    >
                        <i
                            className={`fas ${showForm ? "fa-times" : "fa-plus"} me-2`}
                        ></i>
                        {showForm ? "Annuler" : "Nouvelle proposition"}
                    </button>
                </div>

                {/* Corps */}
                <div className="p-3">
                    {/* Timeline */}
                    {historique.length > 0 ? (
                        <div className="pm-timeline">
                            {historique.map((item, index) => {
                                const isOwner =
                                    currentUserId &&
                                    item.idUser === currentUserId;
                                const isLast = index === historique.length - 1;

                                return (
                                    <div
                                        key={item.id}
                                        className={`d-flex gap-3 mb-3 position-relative ${isLast ? "pm-item-last" : ""}`}
                                    >
                                        {/* Icône */}
                                        <div
                                            className="flex-shrink-0"
                                            style={{
                                                position: "relative",
                                                zIndex: 2,
                                            }}
                                        >
                                            <div
                                                className="rounded-circle d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: 40,
                                                    height: 40,
                                                    background: isLast
                                                        ? "#20c997"
                                                        : "#f0f2f5",
                                                    boxShadow: isLast
                                                        ? "0 0 0 3px rgba(32,201,151,0.2)"
                                                        : "none",
                                                }}
                                            >
                                                <i
                                                    className={`fas ${isLast ? "fa-star text-white" : "fa-user text-secondary"}`}
                                                ></i>
                                            </div>
                                            {!isLast && (
                                                <div
                                                    style={{
                                                        width: 2,
                                                        height: "calc(100% + 12px)",
                                                        background: "#e9ecef",
                                                        margin: "4px auto 0",
                                                        position: "absolute",
                                                        top: 40,
                                                        left: "50%",
                                                        transform:
                                                            "translateX(-50%)",
                                                    }}
                                                ></div>
                                            )}
                                        </div>

                                        {/* Contenu */}
                                        <div className="flex-grow-1 pb-1">
                                            <div className="d-flex justify-content-between align-items-start flex-wrap">
                                                <div className="d-flex align-items-center gap-2">
                                                    <span
                                                        className="fw-semibold"
                                                        style={{
                                                            fontSize: "0.9rem",
                                                        }}
                                                    >
                                                        {item.user?.name ? (
                                                            <>
                                                                {item.user.name}
                                                                {item.user
                                                                    .role && (
                                                                    <span
                                                                        style={{
                                                                            color: "#0d9488",
                                                                            fontSize:
                                                                                "0.85em",
                                                                            fontWeight:
                                                                                "500",
                                                                        }}
                                                                    >
                                                                        {" "}
                                                                        (
                                                                        {
                                                                            item
                                                                                .user
                                                                                .role
                                                                        }
                                                                        )
                                                                    </span>
                                                                )}
                                                            </>
                                                        ) : (
                                                            "Utilisateur"
                                                        )}
                                                    </span>
                                                    {isOwner && (
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    item.id,
                                                                    item.montant_propose,
                                                                    item.user
                                                                        ?.name,
                                                                )
                                                            }
                                                            disabled={
                                                                deleteLoading ===
                                                                item.id
                                                            }
                                                            className="btn btn-sm text-danger p-0 border-0 bg-transparent"
                                                            style={{
                                                                fontSize:
                                                                    "0.8rem",
                                                            }}
                                                        >
                                                            {deleteLoading ===
                                                            item.id ? (
                                                                <span className="spinner-border spinner-border-sm"></span>
                                                            ) : (
                                                                <i className="fas fa-trash-alt"></i>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                                <small
                                                    className="text-muted"
                                                    style={{
                                                        fontSize: "0.7rem",
                                                    }}
                                                >
                                                    <i className="far fa-clock me-1"></i>
                                                    {new Date(
                                                        item.created_at,
                                                    ).toLocaleString("fr-FR", {
                                                        day: "2-digit",
                                                        month: "2-digit",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </small>
                                            </div>

                                            {/* Montant proposé avec libellé */}
                                            <div className="mt-1 d-flex align-items-center gap-2 flex-wrap">
                                                <span
                                                    className="fw-semibold"
                                                    style={{
                                                        fontSize: "0.85rem",
                                                        color: "#6c757d",
                                                    }}
                                                >
                                                    Montant proposé :
                                                </span>
                                                <span
                                                    className="fw-bold text-teal"
                                                    style={{
                                                        fontSize: "1.1rem",
                                                    }}
                                                >
                                                    {new Intl.NumberFormat(
                                                        "fr-FR",
                                                    ).format(
                                                        item.montant_propose,
                                                    )}
                                                </span>
                                                {item.signature_path && (
                                                    <a
                                                        href={`/storage/${item.signature_path}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-decoration-none small"
                                                        style={{
                                                            color: "#6c757d",
                                                        }}
                                                        title="Télécharger la signature"
                                                    >
                                                        <i className="fas fa-file-signature me-1"></i>
                                                        Signature
                                                    </a>
                                                )}
                                                {isLast && (
                                                    <span className="badge bg-teal-soft text-teal rounded-pill px-2 py-0 ms-1 pm-badge-last">
                                                        <i className="fas fa-clock me-1"></i>
                                                        Dernière
                                                    </span>
                                                )}
                                            </div>

                                            {/* Commentaire avec libellé */}
                                            {item.commentaire && (
                                                <div
                                                    className="mt-2 p-2 rounded-3"
                                                    style={{
                                                        background: "#fff8e1",
                                                        borderLeft:
                                                            "3px solid #ffc107",
                                                    }}
                                                >
                                                    <div className="d-flex gap-1 align-items-start">
                                                        <span
                                                            className="fw-semibold"
                                                            style={{
                                                                fontSize:
                                                                    "0.8rem",
                                                                color: "#856404",
                                                            }}
                                                        >
                                                            Commentaire:
                                                        </span>
                                                        <br />
                                                        <small
                                                            className="text-muted"
                                                            style={{
                                                                fontSize:
                                                                    "0.8rem",
                                                            }}
                                                        >
                                                            {item.commentaire}
                                                        </small>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4">
                            <i className="fas fa-chart-line fs-1 text-muted opacity-25 mb-2"></i>
                            <p
                                className="mb-0 text-muted"
                                style={{ fontSize: "0.9rem" }}
                            >
                                Aucune proposition pour l'instant
                            </p>
                            <small className="text-muted">
                                Soyez le premier à proposer un montant
                            </small>
                        </div>
                    )}

                    {/* Formulaire */}
                    {showForm && (
                        <form
                            onSubmit={handleSubmit}
                            className="mt-4 pt-3 border-top"
                        >
                            {/* Montant proposé */}
                            <div className="mb-4">
                                <label
                                    className="form-label fw-semibold"
                                    style={{
                                        color: "#2c3e50",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    <i
                                        className="fas fa-money-bill-wave me-2"
                                        style={{ color: "#20c997" }}
                                    ></i>
                                    Montant proposé{" "}
                                    <span className="text-muted fw-normal ms-1 ">
                                        <i className="text-danger">*</i>
                                    </span>
                                </label>
                                <div className="pm-input-group d-flex align-items-stretch">
                                    {/* <span className="pm-input-group-text" style={{ background: '#f8f9fa', fontWeight: 600 }}>
                <i className="fas fa-coins text-teal me-1"></i>
                Montant
            </span> */}
                                    <input
                                        type="text"
                                        className="pm-input"
                                        placeholder="0"
                                        value={formatMontant(montantPropose)}
                                        onChange={handleMontantChange}
                                        disabled={loading}
                                        autoFocus
                                        style={{
                                            fontSize: "1.3rem",
                                            fontWeight: 700,
                                            textAlign: "right",
                                            padding: "0.75rem 1rem",
                                            border: "1px solid #dee2e6",
                                            borderLeft: "none",
                                            borderRadius: "0 12px 12px 0",
                                            width: "100%",
                                            outline: "none",
                                            background: "white",
                                            transition: "all 0.2s",
                                        }}
                                    />
                                </div>
                                <div className="text-end mt-1">
                                    <small
                                        className="text-muted"
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        <i className="fas fa-info-circle me-1"></i>
                                        Entrez le montant en chiffres
                                    </small>
                                </div>
                            </div>

                            {/* Justification */}
                            <div className="mb-4">
                                <label
                                    className="form-label fw-semibold"
                                    style={{
                                        color: "#2c3e50",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    <i
                                        className="fas fa-comment-dots me-2"
                                        style={{ color: "#20c997" }}
                                    ></i>
                                    Justification
                                    <span className="text-muted fw-normal ms-1 ">
                                        <i className="text-danger">*</i>
                                    </span>
                                </label>
                                <textarea
                                    className="form-control"
                                    rows="3"
                                    placeholder="Expliquez brièvement les raisons de votre proposition..."
                                    value={commentaire}
                                    onChange={(e) =>
                                        setCommentaire(e.target.value)
                                    }
                                    disabled={loading}
                                    style={{
                                        borderRadius: "12px",
                                        border: "1px solid #dee2e6",
                                        fontSize: "0.95rem",
                                        transition: "all 0.2s",
                                        resize: "vertical",
                                        padding: "0.75rem 1rem",
                                        background: "white",
                                        boxShadow:
                                            "inset 0 1px 3px rgba(0,0,0,0.02)",
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = "#20c997";
                                        e.target.style.boxShadow =
                                            "0 0 0 3px rgba(32,201,151,0.1)";
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = "#dee2e6";
                                        e.target.style.boxShadow = "none";
                                    }}
                                />
                                <div className="d-flex justify-content-between mt-1">
                                    <small
                                        className="text-muted"
                                        style={{ fontSize: "0.75rem" }}
                                    >
                                        <i className="fas fa-lightbulb me-1"></i>
                                        Ex: "Conforme aux directives",
                                        "Nécessite approbation"
                                    </small>
                                    {commentaire.length > 0 && (
                                        <small
                                            className="text-muted"
                                            style={{ fontSize: "0.75rem" }}
                                        >
                                            {commentaire.length} caractères
                                        </small>
                                    )}
                                </div>
                            </div>

                            {/* Signature (inchangé mais bien aéré) */}
                            <div className="mb-4">
                                <label
                                    className="form-label fw-semibold"
                                    style={{
                                        color: "#2c3e50",
                                        fontSize: "0.95rem",
                                    }}
                                >
                                    <i
                                        className="fas fa-file-signature me-2"
                                        style={{ color: "#20c997" }}
                                    ></i>
                                    Signature
                                    <span className="text-muted fw-normal ms-1 ">
                                        <i className="text-danger">*</i>
                                    </span>
                                </label>
                                <div
                                    className={`pm-file-upload ${signatureFile ? "has-file" : ""}`}
                                    onClick={() =>
                                        fileInputRef.current?.click()
                                    }
                                    style={{
                                        border: "2px dashed #dee2e6",
                                        borderRadius: "12px",
                                        padding: "1.5rem",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.2s",
                                        background: signatureFile
                                            ? "rgba(32,201,151,0.04)"
                                            : "#fafafa",
                                    }}
                                >
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        className="d-none"
                                        accept=".jpg,.jpeg,.png,.gif"
                                        onChange={handleFileChange}
                                        disabled={loading}
                                    />
                                    {signatureFile ? (
                                        <div className="d-flex flex-column align-items-center gap-3">
                                            {signaturePreview && (
                                                <>
                                                    {signatureFile.type.startsWith(
                                                        "image/",
                                                    ) ? (
                                                        <img
                                                            src={
                                                                signaturePreview
                                                            }
                                                            alt="Aperçu de la signature"
                                                            className="pm-preview-image"
                                                            style={{
                                                                maxWidth:
                                                                    "100%",
                                                                maxHeight:
                                                                    "150px",
                                                                borderRadius:
                                                                    "8px",
                                                            }}
                                                        />
                                                    ) : signatureFile.type ===
                                                      "application/pdf" ? (
                                                        <div
                                                            className="pm-preview-pdf w-100 d-flex align-items-center justify-content-between p-3"
                                                            style={{
                                                                background:
                                                                    "#f8f9fa",
                                                                borderRadius:
                                                                    "8px",
                                                            }}
                                                        >
                                                            <div className="d-flex align-items-center gap-3">
                                                                <i className="fas fa-file-pdf text-danger fa-3x"></i>
                                                                <div className="text-start">
                                                                    <p className="mb-0 fw-semibold">
                                                                        {
                                                                            signatureFile.name
                                                                        }
                                                                    </p>
                                                                    <small className="text-muted">
                                                                        {(
                                                                            signatureFile.size /
                                                                            1024
                                                                        ).toFixed(
                                                                            1,
                                                                        )}{" "}
                                                                        Ko
                                                                    </small>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-secondary"
                                                                onClick={(
                                                                    e,
                                                                ) => {
                                                                    e.stopPropagation();
                                                                    window.open(
                                                                        signaturePreview,
                                                                        "_blank",
                                                                    );
                                                                }}
                                                            >
                                                                <i className="fas fa-eye me-1"></i>
                                                                Aperçu
                                                            </button>
                                                        </div>
                                                    ) : null}
                                                </>
                                            )}
                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-danger rounded-pill px-3"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeFile();
                                                }}
                                            >
                                                <i className="fas fa-times me-1"></i>
                                                Supprimer
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <i className="fas fa-cloud-upload-alt fs-2 text-muted mb-2 d-block"></i>
                                            <p className="mb-0 small text-muted">
                                                <span className="fw-semibold">
                                                    Cliquez pour charger
                                                </span>{" "}
                                                ou glissez‑déposez
                                            </p>
                                            <small
                                                className="text-muted"
                                                style={{ fontSize: "0.7rem" }}
                                            >
                                                JPG, PNG, GIF (max 5 Mo)
                                            </small>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Bouton d'envoi */}
                            <button
                                type="submit"
                                className="pm-btn-primary w-100 py-3"
                                disabled={loading}
                                style={{
                                    borderRadius: "12px",
                                    fontSize: "1rem",
                                    fontWeight: 600,
                                    transition: "all 0.25s ease",
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
                                        Soumettre les informations
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
            <style>
                {`
                .pm-timeline {
    max-height: 400px;
    overflow-y: auto;
    padding: 0.5rem 0.25rem;
    scroll-behavior: smooth; /* Défilement fluide */
}

/* Barre de défilement personnalisée - plus large et plus confortable */
.pm-timeline::-webkit-scrollbar {
    width: 8px;  /* Plus large pour faciliter l'utilisation */
}

.pm-timeline::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
    margin: 4px 0;
}

.pm-timeline::-webkit-scrollbar-thumb {
    background: linear-gradient(180deg, #20c997 0%, #198764 100%);
    border-radius: 10px;
    border: 2px solid #f1f1f1; /* Pour un effet de padding */
}

.pm-timeline::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(180deg, #198764 0%, #0f6b4b 100%);
}

/* Pour Firefox */
.pm-timeline {
    scrollbar-width: thin;
    scrollbar-color: #20c997 #f1f1f1;
}

.pm-icon-wrapper {
    width: 32px;
    height: 32px;
    background: rgba(32, 201, 151, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.pm-icon-wrapper i {
    font-size: 0.9rem;
}

.bg-teal-soft {
    background: rgba(32, 201, 151, 0.12);
}

.text-teal {
    color: #20c997 !important;
}
                `}
            </style>
        </>
    );
};

export default PropositionMontant;
