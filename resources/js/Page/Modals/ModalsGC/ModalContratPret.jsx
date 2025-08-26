import React, { useEffect, useState } from "react";
// import { MdFile } from "react-icons/md";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";

export default function ModalContratPret({ creditId, onClose }) {
    const [dossier, setDossier] = useState();
    const [newFile, setnewFile] = useState();
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!creditId) return;
        getDossierCredit();
    }, [creditId]);

    const getDossierCredit = () => {
        // Charger les données
        axios
            .get(`suivi-credit/dossiers/${creditId}`)
            .then((res) => {
                const data = res.data.data; // récupère l'objet dossier complet

                setDossier(data); // stocke tout l'objet dossier dans dossier
                console.log(dossier);
            })
            .catch(() => setDossier(null));
    };

    if (!creditId) return null;

    const handleSubmitAddFile = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);
        setProgress(0);
        try {
            const formData = new FormData();
            formData.append("creditId", creditId);
            formData.append("newFile", newFile);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent) => {
                    const percentCompleted = Math.round(
                        (progressEvent.loaded * 100) / progressEvent.total
                    );
                    setProgress(percentCompleted);
                },
            };

            const url = "suivi-credit/pages/add-contrat";
            axios
                .post(url, formData, config)
                .then((response) => {
                    if (response.data.status == 1) {
                        setIsLoadingBar(false);

                        Swal.fire({
                            title: "Succès",
                            text: response.data.msg,
                            icon: "success",
                            button: "OK!",
                        });
                        getDossierCredit();
                        setnewFile("");
                    } else {
                        setIsLoadingBar(false);
                        Swal.fire({
                            title: "Erreur",
                            text: response.data.msg,
                            icon: "error",
                            button: "OK!",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
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

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            // ref={modalRef}
            id="modalContratPret"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4>
                            <i className="fas fa-file"></i> Fichiers
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
                        {isLoadingBar && (
                            <div
                                style={{
                                    position: "fixed",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                                    zIndex: 1000,
                                    flexDirection: "column",
                                }}
                            >
                                <Bars
                                    height="80"
                                    width="80"
                                    color="#4fa94d"
                                    ariaLabel="loading"
                                />
                                <h5
                                    style={{ color: "#fff", marginTop: "10px" }}
                                >
                                    Patientez... {progress}%
                                </h5>
                            </div>
                        )}
                        <div className="row">
                            <div className="col-md-7">
                                {!dossier && <p>Chargement...</p>}
                                {dossier &&
                                    dossier.images &&
                                    dossier.images.length > 0 && (
                                        <div>
                                            <h6>Images :</h6>
                                            <div
                                                style={{
                                                    display: "flex",
                                                    flexWrap: "wrap",
                                                    gap: "10px",
                                                }}
                                            >
                                                {dossier.images.map(
                                                    (img, i) => (
                                                        <Zoom key={i}>
                                                            <img
                                                                src={`/storage/${img}`}
                                                                alt={`Image ${i}`}
                                                                style={{
                                                                    maxWidth:
                                                                        "150px",
                                                                    maxHeight:
                                                                        "150px",
                                                                    objectFit:
                                                                        "cover",
                                                                    borderRadius:
                                                                        "8px",
                                                                    cursor: "zoom-in",
                                                                    boxShadow:
                                                                        "0 0 5px rgba(0,0,0,0.3)",
                                                                }}
                                                            />
                                                        </Zoom>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {dossier &&
                                    dossier.pdfs &&
                                    dossier.pdfs.length > 0 && (
                                        <div className="mt-3">
                                            <h6>Documents PDF :</h6>
                                            {dossier.pdfs.map((pdf, i) => (
                                                <a
                                                    key={i}
                                                    href={`/storage/${pdf}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                >
                                                    Voir PDF {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3">
                                <form>
                                    <fieldset className="border p-2">
                                        <legend
                                            className="float-none w-auto p-0"
                                            style={{ fontSize: "15px" }}
                                        >
                                            <h6 className="text-bold unclear-text">
                                                Ajouter un fichier
                                            </h6>
                                        </legend>
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        for="images"
                                                        // class="drop-container"
                                                        // id="dropcontainer"
                                                    >
                                                        {/* <span class="drop-title">
                                                            Drop files here
                                                        </span>
                                                        or */}
                                                        <input
                                                            type="file"
                                                            id="images"
                                                            name="addFile"
                                                            accept="application/pdf, image/*"
                                                            onChange={(e) =>
                                                                setnewFile(
                                                                    e.target
                                                                        .files[0]
                                                                )
                                                            }
                                                            style={{
                                                                width: "80%",
                                                            }}
                                                        />
                                                    </label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <button
                                                        onClick={
                                                            handleSubmitAddFile
                                                        }
                                                        className="btn btn-success mt-2"
                                                        style={{
                                                            borderRadius:
                                                                "25px",
                                                            padding: "8px 16px",
                                                        }}
                                                    >
                                                        Joindre le fichier
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>
                                    </fieldset>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
