import React, { useEffect, useState, useRef } from "react";
// import { MdFile } from "react-icons/md";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";
import "../../../styles/style.css";
//import * as XLSX from "xlsx";

export default function ModalTitreCredit({ onClose }) {
    const [dossier, setDossier] = useState();
    const [loading, setloading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(null); // "pdf" ou "excel"
    const [searchRefCredit, setsearchRefCredit] = useState();

    const handleViewFile = (file, type) => {
        setSelectedFile(file);
        setFileType(type);
    };

    const handleCloseFile = () => {
        setSelectedFile(null);
        setFileType(null);
    };

    useEffect(() => {
        getDossierCredit();
    }, []);

    const handleSeachCredit = async (ref) => {
        setloading(true);
        const res = await axios.get(
            "/montage_credit/page/titre/credit/reference/" + ref
        );
        if (res.data.status == 1) {
            setloading(false);
            setDossier(res.data.data);
        } else if (res.data.status == 0) {
            setloading(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    const getDossierCredit = async () => {
        // Charger les données
        try {
            const res = await axios.get(
                `suivi-credit/dossiers/titre-credit/all`
            );

            if (res.data.status == 1) {
                const data = res.data.data; // récupère l'objet dossier complet
                setDossier(data); // stocke tout l'objet dossier dans dossier
                console.log(dossier);
            }
        } catch (error) {
            setDossier(null);
        }
    };
    //const currentUserRole = dossier?.current_user?.role || "";

    const getFileName = (path) => {
        return path
            .replace(/^credit\//, "") // enlève "credit/" au début s'il existe
            .replace(/\.[^/.]+$/, "") // enlève l'extension (.pdf, .xlsx, etc.)
            .split("_") // coupe par "_"
            .slice(2) // supprime les 2 premiers (date + heure)
            .join("_"); // recompose le reste
    };

    // Regrouper les images par file_state
    const groupedImages = dossier?.images?.reduce((acc, img) => {
        if (!acc[img.file_state]) {
            acc[img.file_state] = [];
        }
        acc[img.file_state].push(img);
        return acc;
    }, {});

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            // ref={modalRef}
            id="modalVisualisationTitre"
        >
            <div className="modal-dialog modal-xl">
                <div className="modal-content">
                    <div className="modal-header">
                        <div className="row">
                            <div className="col-md-12 card rounded-10 p-1">
                                <div
                                    style={{
                                        color: "black",
                                        display: "flex", // Utilisation de Flexbox
                                        justifyContent: "space-between", // Distribution des éléments aux extrémités
                                        alignItems: "center", // Alignement vertical des éléments
                                    }}
                                >
                                    <h5
                                        className="text-bold p-1"
                                        style={{ margin: 0 }}
                                    >
                                        <i className="fas fa-file"></i> Fichiers
                                        Titres
                                    </h5>

                                    <h5
                                        className="text-bold p-1"
                                        style={{ margin: 0 }}
                                    >
                                        <table>
                                            <tr>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                        // ref={textInput}
                                                        className="form-control font-weight-bold"
                                                        placeholder="Rechercher par Nom"
                                                        name="searchRefOperation"
                                                        value={searchRefCredit}
                                                        onChange={(e) => {
                                                            setsearchRefCredit(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            borderRadius: "0px",
                                                            width: "100%",
                                                            height: "auto",
                                                            fontSize: "12px",
                                                            padding: "10px",
                                                        }}
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            handleSeachCredit(
                                                                searchRefCredit
                                                            );
                                                        }}
                                                    >
                                                        <i
                                                            className={`${
                                                                loading
                                                                    ? "spinner-border spinner-border-sm"
                                                                    : " fas fa-search"
                                                            }`}
                                                        ></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>
                                    </h5>
                                </div>
                            </div>
                        </div>

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
                        <div className="row">
                            <div className="col-md-12">
                                {!dossier && <p>Chargement...</p>}
                                {groupedImages &&
                                    Object.keys(groupedImages).map(
                                        (state, idx) => (
                                            <div key={idx} className="mb-4">
                                                {/* Titre en fonction du type */}
                                                <h6>
                                                    {state === "ia"
                                                        ? "Titres en image"
                                                        : state === "im"
                                                        ? "Titres en image"
                                                        : state === "it"
                                                        ? "Titres en image"
                                                        : state === "ig"
                                                        ? "Titres en image"
                                                        : ""}
                                                </h6>

                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {groupedImages[state].map(
                                                        (img, i) => (
                                                            <div
                                                                key={i}
                                                                style={{
                                                                    position:
                                                                        "relative",
                                                                    display:
                                                                        "inline-block",
                                                                    margin: "8px",
                                                                }}
                                                            >
                                                                {/* Image avec zoom */}
                                                                <Zoom>
                                                                    <img
                                                                        src={`/storage/${img.path}`}
                                                                        alt={`Image ${i}`}
                                                                        style={{
                                                                            width: "150px",
                                                                            height: "150px",
                                                                            objectFit:
                                                                                "cover",
                                                                            borderRadius:
                                                                                "10px",
                                                                            cursor: "zoom-in",
                                                                            boxShadow:
                                                                                "0 2px 8px rgba(0,0,0,0.2)",
                                                                        }}
                                                                    />
                                                                </Zoom>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )
                                    )}

                                <div>
                                    {/* Boutons pour les PDF */}
                                    {dossier &&
                                        dossier.pdfs &&
                                        dossier.pdfs.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Titre en PDF :</h6>
                                                {dossier.pdfs.map((pdf, i) => (
                                                    <>
                                                        <span
                                                            style={{
                                                                border: "1px solid #dcdcdc",
                                                                padding: "10px",
                                                            }}
                                                        >
                                                            <button
                                                                key={pdf.id}
                                                                className="btn btn-outline-secondary btn-sm me-2"
                                                                data-toggle="tooltip"
                                                                title="Visualiser"
                                                                onClick={() =>
                                                                    handleViewFile(
                                                                        pdf.path,
                                                                        "pdf"
                                                                    )
                                                                }
                                                            >
                                                                {getFileName(
                                                                    pdf.path
                                                                )}
                                                            </button>
                                                        </span>
                                                    </>
                                                ))}
                                            </div>
                                        )}

                                    {/* Modal / visualisation du fichier */}
                                    {selectedFile && (
                                        <div className="mt-3">
                                            <button
                                                className="btn btn-danger btn-sm mb-2"
                                                onClick={handleCloseFile}
                                            >
                                                Fermer
                                            </button>

                                            {fileType === "pdf" && (
                                                <iframe
                                                    title="PDF Viewer"
                                                    width="100%"
                                                    height="600px"
                                                    src={`/storage/${selectedFile}`}
                                                ></iframe>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
