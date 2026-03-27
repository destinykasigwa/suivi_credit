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

export default function CreditTimeline({ creditId, onClose }) {
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
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            id="modalTimeLine"
        >
            <div className="modal-dialog modal-xl modal-dialog-scrollable">
                <div className="modal-content border-0 shadow-lg rounded-3">
                    {/* Header moderne */}
                    <div
                        className="modal-header border-0 bg-gradient-primary text-white"
                        style={{
                            // background: "linear-gradient(135deg, #1a2632 0%, #0f1419 100%)",
                            borderRadius: "12px 12px 0 0",
                            padding: "1.25rem 1.5rem",
                        }}
                    >
                        <div className="d-flex align-items-center gap-3">
                            <div
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    background: "rgba(32, 201, 151, 0.15)",
                                    borderRadius: "12px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <MdTimeline size={22} color="#20c997" />
                            </div>
                            <div>
                                <h4 className="fw-semibold mb-0 text-white">
                                    Historique des signatures
                                </h4>
                                <small className="text-white-50">
                                    Suivi chronologique des signatures du
                                    dossier
                                </small>
                            </div>
                        </div>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            onClick={() => {
                                onClose(); // Ferme le modal (cache le modal React)
                                window.location.reload(); // Recharge la page
                            }}
                        ></button>
                    </div>

                    <div className="modal-body p-4">
                        {/* État de chargement */}
                        {loading && (
                            <div className="text-center py-5">
                                <div
                                    className="spinner-border text-success mb-3"
                                    role="status"
                                >
                                    <span className="visually-hidden">
                                        Chargement...
                                    </span>
                                </div>
                                <p className="text-muted">
                                    Chargement de l'historique...
                                </p>
                            </div>
                        )}

                        {/* Aucune signature */}
                        {!loading && timeline.length === 0 && (
                            <div className="text-center py-5">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        background: "#f8f9fa",
                                        borderRadius: "50%",
                                    }}
                                >
                                    <MdTimeline size={32} color="#adb5bd" />
                                </div>
                                <h6 className="fw-semibold mb-2">
                                    Aucune signature
                                </h6>
                                <p className="text-muted small mb-0">
                                    Aucune signature n'a été enregistrée pour ce
                                    dossier
                                </p>
                            </div>
                        )}

                        {/* Timeline avec signatures */}
                        {!loading && timeline.length > 0 && (
                            <div
                                className="timeline-container"
                                style={{ position: "relative" }}
                            >
                                {/* Ligne verticale de la timeline */}
                                <div
                                    style={{
                                        position: "absolute",
                                        left: "20px",
                                        top: "10px",
                                        bottom: "10px",
                                        width: "2px",
                                        background:
                                            "linear-gradient(180deg, #20c997 0%, #e9ecef 100%)",
                                        borderRadius: "2px",
                                    }}
                                ></div>

                                <ul className="list-unstyled mb-0">
                                    {timeline.map((item, index) => (
                                        <li
                                            key={index}
                                            className="mb-4 position-relative"
                                            style={{ paddingLeft: "50px" }}
                                        >
                                            {/* Point de la timeline */}
                                            <div
                                                style={{
                                                    position: "absolute",
                                                    left: "11px",
                                                    top: "4px",
                                                    width: "20px",
                                                    height: "20px",
                                                    background:
                                                        index === 0
                                                            ? "#20c997"
                                                            : "white",
                                                    border: `2px solid ${index === 0 ? "#20c997" : "#dee2e6"}`,
                                                    borderRadius: "50%",
                                                    zIndex: 2,
                                                    boxShadow:
                                                        index === 0
                                                            ? "0 0 0 4px rgba(32, 201, 151, 0.2)"
                                                            : "none",
                                                }}
                                            ></div>

                                            {/* Carte de signature */}
                                            <div
                                                className="card border-0 shadow-sm rounded-3"
                                                style={{
                                                    transition: "all 0.2s ease",
                                                    backgroundColor:
                                                        index === 0
                                                            ? "#f8f9fa"
                                                            : "white",
                                                }}
                                            >
                                                <div className="card-body p-3">
                                                    <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                                                        <div className="flex-grow-1">
                                                            <div className="d-flex align-items-center gap-2 mb-2">
                                                                <span
                                                                    className="fw-semibold"
                                                                    style={{
                                                                        fontSize:
                                                                            "15px",
                                                                        color: "#1a2632",
                                                                    }}
                                                                >
                                                                    {
                                                                        item.signed_by
                                                                    }
                                                                </span>
                                                                {index ===
                                                                    0 && (
                                                                    <span
                                                                        className="badge"
                                                                        style={{
                                                                            background:
                                                                                "#20c997",
                                                                            color: "white",
                                                                            fontSize:
                                                                                "10px",
                                                                            padding:
                                                                                "3px 8px",
                                                                            borderRadius:
                                                                                "20px",
                                                                        }}
                                                                    >
                                                                        Dernière
                                                                        signature
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="d-flex flex-wrap gap-3 mb-2">
                                                                <small className="text-muted d-flex align-items-center gap-1">
                                                                    <i className="fas fa-calendar-alt"></i>
                                                                    Signé le :{" "}
                                                                    {dateParser(
                                                                        item.signed_at,
                                                                    )}
                                                                </small>

                                                                {item.delay_from_previous !==
                                                                    null && (
                                                                    <small className="text-muted d-flex align-items-center gap-1">
                                                                        <i className="fas fa-clock"></i>
                                                                        {getDelayText(
                                                                            item.delay_from_previous,
                                                                        )}
                                                                    </small>
                                                                )}
                                                            </div>
                                                        </div>

                                                        {/* Boutons d'action */}
                                                        {item.signature_file && (
                                                            <div className="d-flex gap-2">
                                                                <button
                                                                    className="btn btn-sm"
                                                                    onClick={() =>
                                                                        setSelectedSignature(
                                                                            selectedSignature ===
                                                                                `storage/${item.signature_file}`
                                                                                ? null
                                                                                : `storage/${item.signature_file}`,
                                                                        )
                                                                    }
                                                                    style={{
                                                                        background:
                                                                            "#f0f2f5",
                                                                        color: "#495057",
                                                                        borderRadius:
                                                                            "8px",
                                                                        padding:
                                                                            "6px 12px",
                                                                        fontSize:
                                                                            "12px",
                                                                        transition:
                                                                            "all 0.2s ease",
                                                                    }}
                                                                    onMouseEnter={(
                                                                        e,
                                                                    ) => {
                                                                        e.currentTarget.style.background =
                                                                            "#e9ecef";
                                                                    }}
                                                                    onMouseLeave={(
                                                                        e,
                                                                    ) => {
                                                                        e.currentTarget.style.background =
                                                                            "#f0f2f5";
                                                                    }}
                                                                >
                                                                    <i
                                                                        className={`fas ${selectedSignature === `storage/${item.signature_file}` ? "fa-eye-slash" : "fa-eye"} me-1`}
                                                                    ></i>
                                                                    {selectedSignature ===
                                                                    `storage/${item.signature_file}`
                                                                        ? "Masquer"
                                                                        : "Voir la signature"}
                                                                </button>

                                                                {currentUser &&
                                                                    (item.signed_by ===
                                                                        currentUser.role ||
                                                                        currentUser.role ===
                                                                            "DG") && (
                                                                        <button
                                                                            className="btn btn-sm btn-outline-danger"
                                                                            onClick={() =>
                                                                                deleteSignature(
                                                                                    item.id,
                                                                                )
                                                                            }
                                                                            style={{
                                                                                borderRadius:
                                                                                    "8px",
                                                                                padding:
                                                                                    "6px 12px",
                                                                                fontSize:
                                                                                    "12px",
                                                                            }}
                                                                        >
                                                                            <MdDelete
                                                                                size={
                                                                                    14
                                                                                }
                                                                                className="me-1"
                                                                            />
                                                                            Supprimer
                                                                        </button>
                                                                    )}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {/* Aperçu de la signature */}
                                                    {selectedSignature ===
                                                        `storage/${item.signature_file}` && (
                                                        <div
                                                            className="mt-3 border rounded-3 overflow-hidden"
                                                            style={{
                                                                background:
                                                                    "#f8f9fa",
                                                                borderRadius:
                                                                    "12px",
                                                            }}
                                                        >
                                                            <div
                                                                className="bg-light px-3 py-2 border-bottom"
                                                                style={{
                                                                    background:
                                                                        "#f8f9fa",
                                                                }}
                                                            >
                                                                <small className="text-muted">
                                                                    <i className="fas fa-file-pdf me-1"></i>
                                                                    Aperçu du
                                                                    document
                                                                    signé
                                                                </small>
                                                            </div>
                                                            <div
                                                                style={{
                                                                    height: "450px",
                                                                }}
                                                            >
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
                        )}
                    </div>

                    {/* Footer avec bouton de fermeture */}
                    <div className="modal-footer border-0 pt-0 pb-4 px-4">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            data-bs-dismiss="modal"
                            onClick={() => {
                                onClose(); // Ferme le modal (cache le modal React)
                                window.location.reload(); // Recharge la page
                            }}
                            style={{
                                borderRadius: "10px",
                                padding: "8px 20px",
                                fontSize: "14px",
                            }}
                        >
                            <i className="fas fa-times me-2"></i>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
