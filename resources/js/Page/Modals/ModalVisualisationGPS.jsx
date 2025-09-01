import React, { useEffect, useState } from "react";
import { MdTimeline } from "react-icons/md";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalVisualisationGPS({ dossierId, onClose }) {
    const [location, setLocation] = useState(null);
    const [error, setError] = useState("");
    // Récupérer la position

    const getGPS = async () => {
        try {
            const res = await axios.get(
                "/gestion_credit/pages/get-gps/map/" + dossierId
            );

            if (res.data.status === 1) {
                setLocation({
                    latitude: res.data.data.latitude,
                    longitude: res.data.data.longitude,
                });
            } else {
                Swal.fire({
                    title: "Erreur",
                    text: "Impossible de récupérer la position GPS.",
                    icon: "error",
                    button: "OK!",
                });
            }
        } catch (error) {
            Swal.fire({
                title: "Erreur serveur",
                text: "Vérifie la connexion ou l’API.",
                icon: "error",
                button: "OK!",
            });
        }
    };

    useEffect(() => {
        getGPS();
    }, [dossierId]);

    // Ouvrir la position dans Google Maps
    const openInGoogleMaps = () => {
        if (location) {
            const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
            window.open(url, "_blank");
        }
    };

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            // ref={modalRef}
            id="modalVisualisationGPS"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>📍 MAP</h4>
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
                        {!location && <p>Chargement...</p>}

                        {location && location.latitude && location.longitude ? (
                            <div className="card p-3 shadow-sm">
                                <h5 className="mb-3">Localisation :</h5>

                                {/* Affichage de la carte dans l'application */}
                                <iframe
                                    title="map"
                                    width="100%"
                                    height="300"
                                    frameBorder="0"
                                    style={{ border: 0 }}
                                    src={`https://www.google.com/maps?q=${location.latitude},${location.longitude}&z=15&output=embed`}
                                    allowFullScreen
                                ></iframe>

                                <p className="mt-2 text-success">
                                    Latitude: {location.latitude}, Longitude:{" "}
                                    {location.longitude}
                                </p>

                                {/* Bouton ouvrir dans Google Maps */}
                                <button
                                    onClick={openInGoogleMaps}
                                    className="btn btn-success mt-2"
                                >
                                    🚀 Ouvrir dans Google Maps
                                </button>
                            </div>
                        ) : (
                            <h5 className="mb-3">
                                Vous devez prendre la localisation pour ce
                                dossier...
                            </h5>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
