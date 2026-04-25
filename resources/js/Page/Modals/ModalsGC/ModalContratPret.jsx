import React, { useEffect, useState, useRef } from "react";
// import { MdFile } from "react-icons/md";
import axios from "axios";
import Zoom from "react-medium-image-zoom";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";
import "../../../styles/style.css";
import ModalTitreCredit from "./ModalTitreCredit";
//import * as XLSX from "xlsx";

export default function ModalContratPret({ creditId, onClose }) {
    const [dossier, setDossier] = useState();
    const [newFile, setnewFile] = useState();
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [progress, setProgress] = useState(0);
    const [images, setImages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileType, setFileType] = useState(null); // "pdf" ou "excel"
    const [type_image, settype_image] = useState("");
    const [dossierIdSelected, setDossierIdSelected] = useState(null);
    const [location, setLocation] = useState(null);
    const [error, setError] = useState(null);

    navigator.geolocation.getCurrentPosition(
        (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setError(null);
        },
        (err) => {
            setError("Impossible de récupérer la position : " + err.message);
        }
    );

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

    const handleSubmitAddFileImage = async (e) => {
        e.preventDefault();
        setIsLoadingBar(true);
        setProgress(0);
        const formData = new FormData();
        formData.append("creditId", creditId);
        formData.append("type_image", type_image);
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

    // const deleteImageActivite = async (id) => {
    //     let confirmation;
    //     confirmation = await Swal.fire({
    //         title: "Êtes-vous sûr?",
    //         text: "Vous êtes sûr ? vous êtes sur le point de supprimer cette image voulez vous continuer ?",
    //         icon: "question",
    //         showCancelButton: true,
    //         confirmButtonText: "Oui",
    //         cancelButtonText: "Non",
    //     });

    //     if (confirmation.isConfirmed) {
    //         const res = await axios.delete(
    //             "/gestion_credit/pages/files/credit/image/activite/" + id
    //         );
    //         if (res.data.status == 1) {
    //             getDossierCredit();
    //             Swal.fire({
    //                 title: "Suppression",
    //                 text: res.data.msg,
    //                 icon: "success",
    //                 timer: 8000,
    //                 confirmButtonText: "Okay",
    //             });
    //         } else {
    //             Swal.fire({
    //                 title: "Suppression",
    //                 text: res.data.msg,
    //                 icon: "error",
    //                 timer: 8000,
    //                 confirmButtonText: "Okay",
    //             });
    //         }
    //     }
    // };

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

    const getGPS = async (e) => {
        e.preventDefault();
        if (!navigator.geolocation) {
            Swal.fire({
                title: "GPS",
                text: "La géolocalisation n'est pas supportée par ce navigateur",
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setError(
                "La géolocalisation n'est pas supportée par ce navigateur."
            );
            return;
        }

        const res = await axios.post("/gestion_credit/files/get-gps", {
            latitude: location.latitude,
            longitude: location.longitude,
            creditId,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "GPS",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    const currentUserRole = dossier?.current_user?.role || "";

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
  id="modalContratPret"
>
  <div className="modal-dialog modal-xl">
    <div className="modal-content border-0 shadow-lg rounded-3">
      {/* Header modernisé */}
      <div className="modal-header bg-gradient-primary text-white rounded-top-3" style={{ background: "linear-gradient(135deg, #20c997 0%, #198764 100%)", borderBottom: "none", padding: "1rem 1.5rem" }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-3">
            <i className="fas fa-folder-open fa-2x"></i>
            <div>
              <h5 className="fw-semibold mb-0 text-white">
                <i className="fas fa-file me-2"></i>
                Gestion des documents
              </h5>
              <small className="text-white-50">
                {dossier ? `Dossier #${dossier.NumDossier}` : "Crédit sélectionné"}
              </small>
            </div>
          </div>
          <div className="d-flex gap-2">
            <button
              className="btn btn-light btn-sm d-flex align-items-center gap-2"
              type="button"
              data-toggle="modal"
              data-target="#modalVisualisationTitre"
              onClick={() => setDossierIdSelected(creditId)}
              style={{ borderRadius: "20px" }}
            >
              <i className="fas fa-file-alt"></i>
              Voir tous les titres
            </button>
            <button
              type="button"
              className="btn-close btn-close-white"
              data-dismiss="modal"
              aria-label="Close"
              onClick={onClose}
            ></button>
          </div>
        </div>
      </div>

      <div className="modal-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        {/* Loader amélioré */}
        {isLoadingBar && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center" 
               style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", zIndex: 9999, backdropFilter: "blur(4px)" }}>
            <div className="bg-white rounded-4 p-4 text-center shadow-lg" style={{ minWidth: "250px" }}>
              <div className="spinner-border text-primary mb-3" role="status" style={{ width: "3rem", height: "3rem" }}>
                <span className="visually-hidden">Chargement...</span>
              </div>
              <h6 className="mb-2">Traitement en cours</h6>
              <div className="progress" style={{ height: "8px" }}>
                <div className="progress-bar progress-bar-striped progress-bar-animated" 
                     style={{ width: `${progress}%`, backgroundColor: "#20c997" }}></div>
              </div>
              <p className="text-muted mt-2 mb-0">{progress}%</p>
            </div>
          </div>
        )}

        <div className="row">
          <div className="col-md-12">
            {!dossier && (
              <div className="text-center py-5">
                <div className="spinner-border text-teal" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-2 text-muted">Chargement des données...</p>
              </div>
            )}

            {/* Section Images */}
            {groupedImages && Object.keys(groupedImages).length > 0 && (
              <div className="mb-4">
                {Object.keys(groupedImages).map((state, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                      <div className="bg-teal rounded-circle p-2" style={{ backgroundColor: "#20c997" }}>
                        <i className="fas fa-image text-white fa-sm"></i>
                      </div>
                      <h6 className="fw-semibold mb-0" style={{ fontSize: "1rem" }}>
                        {state === "ia" && "📸 Images activités"}
                        {state === "im" && "👥 Images membres"}
                        {state === "it" && "📄 Images titres"}
                        {state === "ig" && "🔒 Images garanties"}
                      </h6>
                      <span className="badge bg-secondary rounded-pill ms-2">
                        {groupedImages[state].length}
                      </span>
                    </div>

                    <div className="d-flex flex-wrap gap-3">
                      {groupedImages[state].map((img, i) => (
                        <div key={i} className="position-relative" style={{ width: "180px" }}>
                          <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                            <div className="position-relative">
                              <Zoom>
                                <img
                                  src={`/storage/${img.path}`}
                                  alt={`Image ${i}`}
                                  className="w-100"
                                  style={{ height: "180px", objectFit: "cover", cursor: "zoom-in" }}
                                />
                              </Zoom>
                              
                              {currentUserRole === "AC" && (
                                <button
                                  onClick={() => deleteImageMembre(img.id)}
                                  className="position-absolute top-0 end-0 m-2 btn btn-sm btn-danger rounded-circle"
                                  style={{ width: "32px", height: "32px", padding: 0 }}
                                  title="Supprimer"
                                >
                                  <i className="fas fa-trash-alt fa-sm"></i>
                                </button>
                              )}
                            </div>
                            <div className="card-body p-2 text-center bg-light">
                              <small className="text-muted text-truncate d-block">
                                {img.path.split("/").pop()}
                              </small>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Section Documents PDF et Excel - AVEC FONCTIONNALITÉ D'AFFICHAGE */}
            <div>
              {/* Boutons pour les PDF */}
              {dossier && dossier.pdfs && dossier.pdfs.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="fas fa-file-pdf text-danger fa-lg"></i>
                    <h6 className="fw-semibold mb-0">Documents PDF ({dossier.pdfs.length})</h6>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {dossier.pdfs.map((pdf, i) => (
                      <div key={pdf.id || i} className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2"
                          style={{ borderRadius: "8px", padding: "6px 12px" }}
                          onClick={() => handleViewFile(pdf.path, "pdf")}
                          title="Visualiser le PDF"
                        >
                          <i className="fas fa-eye"></i>
                          <span>{getFileName(pdf.path)}</span>
                        </button>
                        {currentUserRole === "AC" && (
                          <button
                            onClick={() => deletePdfFile(pdf.id)}
                            className="btn btn-sm btn-outline-danger"
                            style={{ borderRadius: "8px" }}
                            title="Supprimer"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Boutons pour les fichiers Excel */}
              {dossier && dossier.excels && dossier.excels.length > 0 && (
                <div className="mt-3">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="fas fa-file-excel text-success fa-lg"></i>
                    <h6 className="fw-semibold mb-0">Fichiers Excel ({dossier.excels.length})</h6>
                  </div>
                  <div className="d-flex flex-wrap gap-2">
                    {dossier.excels.map((excel, i) => (
                      <div key={excel.id || i} className="d-flex align-items-center gap-2">
                        <button
                          className="btn btn-outline-success btn-sm d-flex align-items-center gap-2"
                          style={{ borderRadius: "8px", padding: "6px 12px" }}
                          onClick={() => handleViewFile(excel.path, "excel")}
                          title="Visualiser le fichier Excel"
                        >
                          <i className="fas fa-eye"></i>
                          <span>{getFileName(excel.path)}</span>
                        </button>
                        {currentUserRole === "AC" && (
                          <button
                            onClick={() => deleteExcelFile(excel.id)}
                            className="btn btn-sm btn-outline-danger"
                            style={{ borderRadius: "8px" }}
                            title="Supprimer"
                          >
                            <i className="fas fa-trash-alt"></i>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Modal / visualisation du fichier - CORRIGÉ */}
            {selectedFile && (
              <div className="mt-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="fw-semibold mb-0">
                    <i className="fas fa-file-alt me-2"></i>
                    Aperçu du document
                  </h6>
                  <button
                    className="btn btn-sm btn-danger"
                    style={{ borderRadius: "20px" }}
                    onClick={handleCloseFile}
                  >
                    <i className="fas fa-times me-1"></i>
                    Fermer
                  </button>
                </div>
                <div className="border rounded-3 p-2 bg-light" style={{ minHeight: "500px" }}>
                  {fileType === "pdf" && (
                    <iframe
                      title="PDF Viewer"
                      width="100%"
                      height="600px"
                      src={`/storage/${selectedFile}`}
                      style={{ border: "none", borderRadius: "8px" }}
                    />
                  )}

                  {fileType === "excel" && (
                    <iframe
                      title="Excel Viewer"
                      width="100%"
                      height="600px"
                      style={{ border: "none", borderRadius: "8px" }}
                      src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                        `${window.location.origin}/storage/${selectedFile}`
                      )}`}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section d'ajout de fichiers */}
        <div className="row g-3 mt-3">
          {/* Ajout de fichiers (PDF/Excel) */}
          <div className="col-md-4">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h6 className="fw-semibold mb-0">
                  <i className="fas fa-upload text-primary me-2"></i>
                  Ajouter un document (PDF/Excel)
                </h6>
              </div>
              <div className="card-body">
                <div className="mb-3">
                  <label className="form-label fw-semibold small">Fichier (PDF/Excel)</label>
                  <input
                    type="file"
                    className="form-control form-control-sm"
                    accept="application/pdf,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    onChange={(e) => setnewFile(e.target.files[0])}
                  />
                </div>
                {newFile && (
                  <button
                    onClick={handleSubmitAddFile}
                    className="btn btn-primary w-100"
                    style={{ borderRadius: "8px" }}
                  >
                    <i className="fas fa-paperclip me-2"></i>
                    Joindre le fichier
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Ajout d'images */}
         <div className="col-md-5">
  <div className="card border-0 shadow-sm rounded-3 h-100">
    <div className="card-header bg-white border-0 pt-3">
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h6 className="fw-semibold mb-0">
          <i className="fas fa-images text-info me-2"></i>
          Ajouter des images
        </h6>
        <select
          className="form-select form-select-sm"
          name="type_image"
          value={type_image}
          onChange={(e) => settype_image(e.target.value)}
          style={{ borderRadius: "8px", borderColor: "#dee2e6", width: "auto" }}
          required
        >
          <option value="">Type d'image *</option>
          <option value="im">👥 Image membre</option>
          <option value="ia">📸 Image activité</option>
          <option value="it">📄 Image titre</option>
          <option value="ig">🔒 Image garantie</option>
        </select>
      </div>
    </div>

    <div className="card-body">
      {/* Zone de drop stylisée */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
        className="border-2 border-dashed rounded-3 text-center p-4 mb-3 transition-all"
        style={{
          borderColor: "#20c997",
          backgroundColor: "#f8fafc",
          cursor: "pointer",
          transition: "all 0.2s ease-in-out",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "#f0fdf4";
          e.currentTarget.style.borderColor = "#0d9488";
          e.currentTarget.style.transform = "scale(1.01)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "#f8fafc";
          e.currentTarget.style.borderColor = "#20c997";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <i className="fas fa-cloud-upload-alt fa-3x mb-2" style={{ color: "#20c997" }}></i>
        <p className="mb-1 fw-semibold">Glissez-déposez vos images ici</p>
        <small className="text-muted">ou cliquez pour sélectionner (JPG, PNG)</small>
        <input
          type="file"
          multiple
          // accept="image/*,application/pdf"
           accept="image/*"
          ref={fileInputRef}
          onChange={handleInputChange}
          className="d-none"
        />
      </div>

      {/* Prévisualisation améliorée */}
      {images.length > 0 && (
        <div className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small className="text-muted">
              <i className="fas fa-images me-1"></i> {images.length} fichier(s) sélectionné(s)
            </small>
            <button
              type="button"
              onClick={() => setImages([])}
              className="btn btn-sm btn-link text-danger p-0"
              style={{ fontSize: "12px" }}
            >
              <i className="fas fa-trash-alt me-1"></i> Tout supprimer
            </button>
          </div>
          <div className="d-flex flex-wrap gap-3">
            {images.map((file, index) => (
              <div
                key={index}
                className="position-relative shadow-sm rounded-3 overflow-hidden"
                style={{ width: "90px", height: "90px" }}
              >
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    className="w-100 h-100 object-fit-cover"
                  />
                ) : (
                  <div className="w-100 h-100 bg-danger bg-opacity-10 d-flex flex-column align-items-center justify-content-center">
                    <i className="fas fa-file-pdf fa-2x text-danger"></i>
                    <small className="text-muted mt-1" style={{ fontSize: "10px" }}>PDF</small>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="position-absolute top-0 end-0 btn btn-sm btn-danger rounded-circle p-0 m-1"
                  style={{ width: "22px", height: "22px", fontSize: "12px", lineHeight: "1" }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>

    <div className="card-footer bg-white border-0 pb-4 pt-0">
      <button
        onClick={handleSubmitAddFileImage}
        disabled={isLoadingBar || images.length === 0 || !type_image}
        className="btn w-100 py-3 fw-semibold rounded-3 d-flex align-items-center justify-content-center gap-2"
        style={{
          background: "linear-gradient(135deg, #20c997 0%, #0d9488 100%)",
          border: "none",
          color: "white",
          transition: "all 0.2s",
          opacity: isLoadingBar || images.length === 0 || !type_image ? 0.6 : 1,
          cursor: isLoadingBar || images.length === 0 || !type_image ? "not-allowed" : "pointer",
        }}
      >
        {isLoadingBar ? (
          <>
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Enregistrement en cours...
          </>
        ) : (
          <>
            <i className="fas fa-save"></i>
            Enregistrer ({images.length} fichier{images.length > 1 ? "s" : ""})
          </>
        )}
      </button>
      {!type_image && images.length > 0 && (
        <small className="text-danger d-block text-center mt-2">
          <i className="fas fa-exclamation-circle me-1"></i> Veuillez sélectionner un type d’image
        </small>
      )}
    </div>
  </div>
</div>

          {/* GPS */}
          <div className="col-md-3">
            <div className="card border-0 shadow-sm rounded-3 h-100">
              <div className="card-header bg-white border-0 pt-3">
                <h6 className="fw-semibold mb-0">
                  <i className="fas fa-map-marker-alt text-danger me-2"></i>
                  Localisation GPS
                </h6>
              </div>
              <div className="card-body">
                <button
                  onClick={getGPS}
                  className="btn btn-outline-primary w-100 mb-3"
                  style={{ borderRadius: "8px" }}
                >
                  <i className="fas fa-location-dot me-2"></i>
                  Récupérer ma position
                </button>
                
                {location && (
                  <div className="alert alert-success p-2 small">
                    <i className="fas fa-check-circle me-1"></i>
                    <strong>Position:</strong><br />
                    📍 Lat: {location.latitude}<br />
                    📍 Lng: {location.longitude}
                  </div>
                )}
                
                {error && (
                  <div className="alert alert-danger p-2 small">
                    <i className="fas fa-exclamation-triangle me-1"></i>
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  {dossierIdSelected && (
    <ModalTitreCredit onClose={() => setDossierIdSelected(null)} />
  )}
</div>
    );
}
