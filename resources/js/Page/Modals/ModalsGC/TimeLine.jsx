import React, { useEffect, useState } from "react";
import { MdTimeline } from "react-icons/md";
import axios from "axios";

export default function CreditTimeline({ creditId, onClose }) {
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        axios
            .get(`/gestion_credit/modal/${creditId}/timeline`)
            .then((res) => setTimeline(res.data))
            .catch((err) => console.error(err));
    }, [creditId]);

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
                        >
                            {" "}
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="timeline-container">
                            <ul className="list-group">
                                {timeline.map((item, index) => (
                                    <li key={index} className="list-group-item">
                                        <strong>{item.signed_by}</strong>
                                        <br />
                                        <small>
                                            Signé le :{" "}
                                            {dateParser(item.signed_at)}
                                        </small>
                                        {item.delay_from_previous !== null && (
                                            <div className="text-muted">
                                                ⏳ {item.delay_from_previous}{" "}
                                                jour(s) après la signature
                                                précédente
                                            </div>
                                        )}
                                        {item.signature_file && (
                                            <div>
                                                <a
                                                    href={`storage/${item.signature_file}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    Voir la signature
                                                </a>
                                            </div>
                                        )}
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
