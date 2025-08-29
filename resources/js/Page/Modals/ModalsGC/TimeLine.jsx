import React, { useEffect, useState } from "react";
import { MdTimeline } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

export default function CreditTimeline({ creditId, onClose }) {
    const [timeline, setTimeline] = useState([]);
    const [currentUser, setCurrentUser] = useState();
    const [selectedSignature, setSelectedSignature] = useState(null);

    useEffect(() => {
        getTimeLine();
    }, [creditId]);

    const getTimeLine = () => {
        axios
            .get(`/gestion_credit/modal/${creditId}/timeline`)
            .then((res) => {
                setTimeline(res.data.data);
                setCurrentUser(res.data.current_user); // 👈 tu le stockes dans un state
            })
            .catch((err) => console.error(err));
    };

    const dateParser = (num) => {
        const options = {
            // weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };

        let timestamp = Date.parse(num);

        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

        return date.toString();
    };

    const deleteSignature = async (id) => {
        console.log(id);
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer cette signature voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.delete(
                "/gestion_credit/pages/files/credit/timeline/signature/delete/" +
                    id
            );
            if (res.data.status == 1) {
                getTimeLine();
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 5000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "error",
                    timer: 5000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            // ref={modalRef}
            id="modalTimeLine"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>
                            <MdTimeline /> Historique des signatures
                        </h4>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                            onClick={onClose}
                        >
                            {" "}
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {!timeline && <p>Chargement...</p>}
                        <div className="timeline-container">
                            <ul className="list-group">
                                {timeline.map((item, index) => (
                                    <li
                                        key={index}
                                        className="list-group-item d-flex justify-content-between align-items-start"
                                    >
                                        <div>
                                            <strong>{item.signed_by}</strong>
                                            <br />
                                            <small>
                                                Signé le :{" "}
                                                {dateParser(item.signed_at)}
                                            </small>

                                            {item.delay_from_previous !==
                                                null && (
                                                <div className="text-muted">
                                                    ⏳{" "}
                                                    {item.delay_from_previous ===
                                                    0
                                                        ? "Le même jour que la signature précédente"
                                                        : item.delay_from_previous ===
                                                          1
                                                        ? "1 jour après la signature précédente"
                                                        : `${item.delay_from_previous} jours après la signature précédente`}
                                                </div>
                                            )}

                                            {item.signature_file && (
                                                <div className="d-flex flex-column gap-2 mt-2">
                                                    <div className="d-flex align-items-center gap-2">
                                                        <button
                                                            className="btn btn-outline-primary btn-sm"
                                                            onClick={() =>
                                                                setSelectedSignature(
                                                                    `storage/${item.signature_file}`
                                                                )
                                                            }
                                                        >
                                                            Voir la signature
                                                        </button>

                                                        {/* 👇 Bouton supprimer seulement si la signature appartient au user connecté */}
                                                        {currentUser &&
                                                            (item.signed_by ===
                                                                currentUser.role ||
                                                                currentUser.role ===
                                                                    "DG") && (
                                                                <button
                                                                    className="btn btn-sm btn-danger ms-2"
                                                                    onClick={() =>
                                                                        deleteSignature(
                                                                            item.id
                                                                        )
                                                                    }
                                                                >
                                                                    Supprimer la
                                                                    signature
                                                                </button>
                                                            )}
                                                    </div>

                                                    {/* 👇 Affichage de l’iframe si l’utilisateur a cliqué */}
                                                    {selectedSignature ===
                                                        `storage/${item.signature_file}` && (
                                                        <div
                                                            className="mt-2 border rounded"
                                                            style={{
                                                                height: "400px",
                                                            }}
                                                        >
                                                            <iframe
                                                                src={`/pdfjs/web/viewer.html?file=/storage/${item.signature_file}`}
                                                                style={{
                                                                    width: "800px",
                                                                    height: "400px",
                                                                    border: "1px solid #ccc",
                                                                    borderRadius:
                                                                        "8px",
                                                                }}
                                                            ></iframe>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
