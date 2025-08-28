import React, { useEffect, useState, useRef } from "react";
// import { MdFile } from "react-icons/md";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";
//import * as XLSX from "xlsx";

export default function ModalContratPret({ creditId, onClose }) {
    const [dossier, setDossier] = useState();
    const [newFile, setnewFile] = useState();
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [progress, setProgress] = useState(0);
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(null); // "pdf" ou "excel"

    const handleViewFile = (file, type) => {
        setSelectedFile(file);
        setFileType(type);
    };

    const handleCloseFile = () => {
        setSelectedFile(null);
        setFileType(null);
    };

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
                // console.log(dossier);
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

    const handleDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    const fileInputRef = useRef(null);

    const handleFiles = (files) => {
        const validFiles = Array.from(files).filter((file) =>
            file.type.startsWith("image/")
        );
        setImages((prev) => [...prev, ...validFiles]);
    };
    // const handleInputChange = (e) => {
    //     handleFiles(e.target.files);
    // };
    const handleInputChange = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(
            (file) =>
                file.type.startsWith("image/") ||
                file.type === "application/pdf"
        );
        setImages((prev) => [...prev, ...selectedFiles]);
    };
    const handleClick = () => {
        fileInputRef.current.click();
    };
    const handleRemoveImage = (indexToRemove) => {
        setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmitAddFileImageMembre = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("creditId", creditId);
        images.forEach((img) => {
            formData.append("images[]", img); // Laravel s’attend à un tableau ici
        });
        try {
            const response = await axios.post(
                "/gestion_credit/pages/dossier-credit/images-membre/add",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round(
                            (progressEvent.loaded * 100) / progressEvent.total
                        );
                        setProgress(percentCompleted);
                    },
                }
            );

            if (response.data.status == 1) {
                setIsLoadingBar(false);
                setImages([]);
                Swal.fire({
                    title: "Ajout image",
                    text: response.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                getDossierCredit();
                //alert("Crédit enregistré avec succès !");

                // Réinitialiser les champs si besoin
            } else {
                setIsLoadingBar(false);
                Swal.fire({
                    title: "Erreur",
                    text: response.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        } catch (error) {
            console.error("Erreur :", error.response?.data || error.message);
            Swal.fire({
                title: "Erreur",
                text: error.response.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            // alert("Erreur lors de l’envoi du formulaire.");
        }
    };

    const deleteExcelFile = async (id) => {
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer ce fichier voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.get(
                "/gestion_credit/pages/files/credit/excel/" + id
            );
            if (res.data.status == 1) {
                getDossierCredit();
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });

                //  window.location.reload();
            } else {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const deletePdfFile = async (id) => {
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer ce fichier voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.delete(
                "/gestion_credit/pages/files/credit/pdf/" + id
            );
            if (res.data.status == 1) {
                getDossierCredit();
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const deleteImageActivite = async (id) => {
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer cette image voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.delete(
                "/gestion_credit/pages/files/credit/image/activite/" + id
            );
            if (res.data.status == 1) {
                getDossierCredit();
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const deleteImageMembre = async (id) => {
        console.log(id);
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer cette image voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.delete(
                "/gestion_credit/pages/files/credit/image/membre/" + id
            );
            if (res.data.status == 1) {
                getDossierCredit();
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            } else {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };
    const currentUserRole = dossier && dossier.current_user?.role;
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
                            onClick={onClose}
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
                            <div className="col-md-12">
                                {!dossier && <p>Chargement...</p>}
                                {dossier &&
                                    dossier.images &&
                                    dossier.images.length > 0 && (
                                        <>
                                            <div>
                                                <h6>Images activités</h6>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {dossier.images.map(
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
                                                                {/* Bouton de suppression visible seulement si AC */}
                                                                {currentUserRole ===
                                                                    "AC" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteImageMembre(
                                                                                img.id
                                                                            )
                                                                        }
                                                                        style={{
                                                                            position:
                                                                                "absolute",
                                                                            top: "6px",
                                                                            right: "6px",
                                                                            backgroundColor:
                                                                                "rgba(255, 255, 255, 0.8)",
                                                                            border: "none",
                                                                            borderRadius:
                                                                                "50%",
                                                                            padding:
                                                                                "6px",
                                                                            cursor: "pointer",
                                                                            boxShadow:
                                                                                "0 2px 5px rgba(0,0,0,0.2)",
                                                                            transition:
                                                                                "background 0.2s ease",
                                                                        }}
                                                                        onMouseEnter={(
                                                                            e
                                                                        ) =>
                                                                            (e.currentTarget.style.backgroundColor =
                                                                                "rgba(255,0,0,0.8)")
                                                                        }
                                                                        onMouseLeave={(
                                                                            e
                                                                        ) =>
                                                                            (e.currentTarget.style.backgroundColor =
                                                                                "rgba(255,255,255,0.8)")
                                                                        }
                                                                        title="Supprimer"
                                                                    >
                                                                        <i
                                                                            className="fa fa-trash"
                                                                            aria-hidden="true"
                                                                            style={{
                                                                                color: "red",
                                                                                fontSize:
                                                                                    "14px",
                                                                            }}
                                                                        ></i>
                                                                    </button>
                                                                )}

                                                                {/* Image avec effet zoom */}
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

                                            <div>
                                                <h6>Images du membre</h6>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {dossier.imageMembre.map(
                                                        (img, i) => (
                                                            <>
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
                                                                    {/* Bouton de suppression visible seulement si AC */}
                                                                    {currentUserRole ===
                                                                        "AC" && (
                                                                        <button
                                                                            onClick={() =>
                                                                                deleteImageActivite(
                                                                                    img.id
                                                                                )
                                                                            }
                                                                            style={{
                                                                                position:
                                                                                    "absolute",
                                                                                top: "6px",
                                                                                right: "6px",
                                                                                backgroundColor:
                                                                                    "rgba(255, 255, 255, 0.8)",
                                                                                border: "none",
                                                                                borderRadius:
                                                                                    "50%",
                                                                                padding:
                                                                                    "6px",
                                                                                cursor: "pointer",
                                                                                boxShadow:
                                                                                    "0 2px 5px rgba(0,0,0,0.2)",
                                                                                transition:
                                                                                    "background 0.2s ease",
                                                                            }}
                                                                            onMouseEnter={(
                                                                                e
                                                                            ) =>
                                                                                (e.currentTarget.style.backgroundColor =
                                                                                    "rgba(255,0,0,0.8)")
                                                                            }
                                                                            onMouseLeave={(
                                                                                e
                                                                            ) =>
                                                                                (e.currentTarget.style.backgroundColor =
                                                                                    "rgba(255,255,255,0.8)")
                                                                            }
                                                                            title="Supprimer"
                                                                        >
                                                                            <i
                                                                                className="fa fa-trash"
                                                                                aria-hidden="true"
                                                                                style={{
                                                                                    color: "red",
                                                                                    fontSize:
                                                                                        "14px",
                                                                                }}
                                                                            ></i>
                                                                        </button>
                                                                    )}

                                                                    {/* Image avec effet zoom */}
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
                                                            </>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                {/* {dossier &&
                                    dossier.pdfs &&
                                    dossier.pdfs.length > 0 && (
                                        <div className="mt-3">
                                            <h6>Documents PDF(Titres) :</h6>
                                            {dossier.pdfs.map((pdf, i) => (
                                                <a
                                                    key={i}
                                                    href={`/storage/${pdf}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-outline-secondary btn-sm me-2"
                                                >
                                                    Voir{" "}
                                                    {pdf
                                                        .split("_")
                                                        .pop()
                                                        .replace(".pdf", "")}
                                                    {i + 1}
                                                </a>
                                            ))}
                                        </div>
                                    )} */}

                                <div>
                                    {/* Boutons pour les PDF */}
                                    {dossier &&
                                        dossier.pdfs &&
                                        dossier.pdfs.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Documents PDF :</h6>
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
                                                                {pdf.path
                                                                    .split("_")
                                                                    .pop()
                                                                    .replace(
                                                                        ".pdf",
                                                                        ""
                                                                    )}
                                                            </button>
                                                            {currentUserRole ===
                                                                "AC" && (
                                                                <button
                                                                    onClick={() =>
                                                                        deletePdfFile(
                                                                            pdf.id
                                                                        )
                                                                    }
                                                                    className="flex items-center gap-1 px-2 py-1 text-red-600 bg-red-100 rounded-lg 
                                                                    hover:bg-red-200 hover:text-red-800 transition duration-200"
                                                                    title="Supprimer ce fichier PDF"
                                                                >
                                                                    <i
                                                                        className="fa fa-trash"
                                                                        aria-hidden="true"
                                                                    ></i>
                                                                    <span className="text-sm font-medium">
                                                                        Supprimer
                                                                    </span>
                                                                </button>
                                                            )}
                                                        </span>
                                                    </>
                                                ))}
                                            </div>
                                        )}

                                    {/* Boutons pour les fichiers Excel */}
                                    {dossier &&
                                        dossier.excels &&
                                        dossier.excels.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Fichiers Excel :</h6>
                                                {dossier.excels.map(
                                                    (excel, i) => (
                                                        <>
                                                            <span
                                                                style={{
                                                                    border: "1px solid #dcdcdc",
                                                                    padding:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <button
                                                                    key={
                                                                        excel.id
                                                                    }
                                                                    className="btn btn-outline-success btn-sm me-2"
                                                                    data-toggle="tooltip"
                                                                    title="Visualiser"
                                                                    onClick={() =>
                                                                        handleViewFile(
                                                                            excel.path,
                                                                            "excel"
                                                                        )
                                                                    }
                                                                >
                                                                    {excel.path
                                                                        .split(
                                                                            "_"
                                                                        )
                                                                        .pop()
                                                                        .replace(
                                                                            ".xlsx",
                                                                            ""
                                                                        )}
                                                                </button>
                                                                {currentUserRole ===
                                                                    "AC" && (
                                                                    <button
                                                                        onClick={() =>
                                                                            deleteExcelFile(
                                                                                excel.id
                                                                            )
                                                                        }
                                                                        className="flex items-center gap-1 px-2 py-1 text-red-600 bg-red-100 rounded-lg 
                                                                    hover:bg-red-200 hover:text-red-800 transition duration-200"
                                                                        title="Supprimer ce fichier PDF"
                                                                    >
                                                                        <i
                                                                            className="fa fa-trash"
                                                                            aria-hidden="true"
                                                                        ></i>
                                                                        <span className="text-sm font-medium">
                                                                            Supprimer
                                                                        </span>
                                                                    </button>
                                                                )}
                                                            </span>
                                                        </>
                                                    )
                                                )}
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

                                            {fileType === "excel" && (
                                                <iframe
                                                    title="Excel Viewer"
                                                    style={{
                                                        width: "79vw",
                                                        height: "600px",
                                                        border: "none",
                                                    }}
                                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                                                        `https://app.coopecakibayetu.org/${selectedFile}`
                                                    )}`}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row mt-3">
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
                                                            // accept="application/pdf,xls,xlsx, image/*"
                                                            accept="
                                                            application/pdf,
                                                            application/vnd.ms-excel,
                                                            application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
                                                            image/*"
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
                                                    {newFile && (
                                                        <button
                                                            onClick={
                                                                handleSubmitAddFile
                                                            }
                                                            className="btn btn-success mt-2"
                                                            style={{
                                                                borderRadius:
                                                                    "25px",
                                                                padding:
                                                                    "8px 16px",
                                                            }}
                                                        >
                                                            Joindre le fichier
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        </table>
                                    </fieldset>
                                </form>
                            </div>

                            <div className="col-md-9">
                                <form>
                                    <fieldset className="border p-2">
                                        <legend
                                            className="float-none w-auto p-0"
                                            style={{ fontSize: "15px" }}
                                        >
                                            <h6 className="text-bold unclear-text">
                                                Ajouter photo du membre
                                            </h6>
                                        </legend>
                                        <div
                                            onDrop={handleDrop}
                                            onDragOver={handleDragOver}
                                            onClick={handleClick}
                                            style={{
                                                border: "2px dashed #aaa",
                                                padding: "30px",
                                                textAlign: "center",
                                                borderRadius: "10px",
                                                marginBottom: "15px",
                                                cursor: "pointer",
                                                color: "#555",
                                                position: "relative",
                                            }}
                                        >
                                            <p>
                                                Glissez-déposez vos images ici
                                                ou cliquez pour sélectionner
                                            </p>

                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*,application/pdf"
                                                ref={fileInputRef}
                                                onChange={handleInputChange}
                                                style={{
                                                    position: "absolute",
                                                    top: 0,
                                                    left: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    opacity: 0,
                                                    cursor: "pointer",
                                                }}
                                            />
                                        </div>

                                        {/* ✅ Prévisualisation avec bouton supprimer */}
                                        <div
                                            style={{
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "10px",
                                            }}
                                        >
                                            {images.map((file, index) => (
                                                <div
                                                    key={index}
                                                    style={{
                                                        position: "relative",
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        width: "100px",
                                                    }}
                                                >
                                                    {file.type.startsWith(
                                                        "image/"
                                                    ) ? (
                                                        <img
                                                            src={URL.createObjectURL(
                                                                file
                                                            )}
                                                            alt={`preview-${index}`}
                                                            width="100"
                                                            height="100"
                                                            style={{
                                                                objectFit:
                                                                    "cover",
                                                                borderRadius:
                                                                    "5px",
                                                            }}
                                                        />
                                                    ) : file.type ===
                                                      "application/pdf" ? (
                                                        <div
                                                            style={{
                                                                width: "100px",
                                                                height: "100px",
                                                                backgroundColor:
                                                                    "#f44336",
                                                                color: "white",
                                                                display: "flex",
                                                                flexDirection:
                                                                    "column",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                borderRadius:
                                                                    "5px",
                                                                cursor: "pointer",
                                                                fontSize:
                                                                    "12px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                            onClick={() =>
                                                                window.open(
                                                                    URL.createObjectURL(
                                                                        file
                                                                    ),
                                                                    "_blank"
                                                                )
                                                            }
                                                        >
                                                            📄 PDF
                                                        </div>
                                                    ) : null}

                                                    <small
                                                        style={{
                                                            marginTop: "5px",
                                                            textAlign: "center",
                                                            fontSize: "10px",
                                                            wordBreak:
                                                                "break-word",
                                                        }}
                                                    >
                                                        {file.name}
                                                    </small>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleRemoveImage(
                                                                index
                                                            )
                                                        }
                                                        style={{
                                                            position:
                                                                "absolute",
                                                            top: "-8px",
                                                            right: "-8px",
                                                            background: "red",
                                                            color: "white",
                                                            border: "none",
                                                            borderRadius: "50%",
                                                            width: "20px",
                                                            height: "20px",
                                                            cursor: "pointer",
                                                            fontSize: "12px",
                                                            fontWeight: "bold",
                                                        }}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </fieldset>
                                    {images.length > 0 && (
                                        <button
                                            onClick={
                                                handleSubmitAddFileImageMembre
                                            }
                                            className="btn btn-success mt-2"
                                            style={{
                                                borderRadius: "25px",
                                                padding: "8px 16px",
                                            }}
                                        >
                                            Enregistrer
                                        </button>
                                    )}
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
