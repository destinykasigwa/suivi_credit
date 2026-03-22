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
  id="modalVisualisationTitre"
>
  <div className="modal-dialog modal-xl">
    <div className="modal-content border-0 shadow-lg rounded-3">
      {/* Header modernisé */}
      <div className="modal-header bg-gradient-primary text-white rounded-top-3" style={{ background: "linear-gradient(135deg, #20c997 0%, #198764 100%)", borderBottom: "none", padding: "1rem 1.5rem" }}>
        <div className="d-flex justify-content-between align-items-center w-100">
          <div className="d-flex align-items-center gap-3">
            <div style={{ width: "48px", height: "48px", background: "rgba(255,255,255,0.15)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <i className="fas fa-file-alt fa-2x"></i>
            </div>
            <div>
              <h5 className="fw-semibold mb-0 text-white">
                Gestion des titres
              </h5>
              <small className="text-white-50">
                Documents et images des titres
              </small>
            </div>
          </div>
          <button
            type="button"
            className="btn-close btn-close-white"
            data-dismiss="modal"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>
      </div>

      <div className="modal-body p-4" style={{ maxHeight: "80vh", overflowY: "auto" }}>
        <div className="row">
          <div className="col-md-12">
            {/* Barre de recherche améliorée */}
            <div className="card border-0 bg-light rounded-3 mb-4">
              <div className="card-body p-3">
                <div className="d-flex gap-2 align-items-center">
                  <div className="flex-grow-1">
                    <div className="position-relative">
                      <i className="fas fa-search position-absolute top-50 start-0 translate-middle-y ms-3 text-muted" style={{ fontSize: "12px" }}></i>
                      <input
                        type="text"
                        style={{ borderRadius: "10px", padding: "10px 12px 10px 35px" }}
                        className="form-control border-0"
                        placeholder="Rechercher par nom de document..."
                        name="searchRefOperation"
                        value={searchRefCredit}
                        onChange={(e) => {
                          setsearchRefCredit(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <button
                      type="button"
                      style={{ borderRadius: "10px", padding: "10px 24px" }}
                      className="btn btn-teal d-flex align-items-center gap-2"
                      onClick={() => {
                        handleSeachCredit(searchRefCredit);
                      }}
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        <i className="fas fa-search"></i>
                      )}
                      <span>Rechercher</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Chargement */}
            {!dossier && (
              <div className="text-center py-5">
                <div className="spinner-border text-teal" role="status" style={{ width: "3rem", height: "3rem" }}>
                  <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="mt-3 text-muted">Chargement des titres...</p>
              </div>
            )}

            {/* Section Images des titres */}
            {groupedImages && Object.keys(groupedImages).length > 0 && (
              <div className="mb-4">
                {Object.keys(groupedImages).map((state, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                      <div className="bg-teal rounded-circle p-2" style={{ backgroundColor: "#20c997" }}>
                        <i className="fas fa-image text-white fa-sm"></i>
                      </div>
                      <h6 className="fw-semibold mb-0" style={{ fontSize: "1rem" }}>
                        <i className="fas fa-certificate me-2"></i>
                        Titres en image
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
                                  alt={`Titre ${i}`}
                                  className="w-100"
                                  style={{ height: "180px", objectFit: "cover", cursor: "zoom-in" }}
                                />
                              </Zoom>
                              <div className="position-absolute bottom-0 start-0 end-0 bg-dark bg-opacity-75 text-white p-1 text-center" style={{ fontSize: "10px" }}>
                                <i className="fas fa-file-image me-1"></i>
                                Image titre
                              </div>
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

            {/* Section PDF des titres */}
            {dossier && dossier.pdfs && dossier.pdfs.length > 0 && (
              <div className="mt-4">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <div className="bg-danger rounded-circle p-2" style={{ backgroundColor: "#dc3545" }}>
                    <i className="fas fa-file-pdf text-white fa-sm"></i>
                  </div>
                  <h6 className="fw-semibold mb-0" style={{ fontSize: "1rem" }}>
                    <i className="fas fa-file-pdf me-2"></i>
                    Titres en PDF
                  </h6>
                  <span className="badge bg-danger rounded-pill ms-2">
                    {dossier.pdfs.length}
                  </span>
                </div>

                <div className="row g-3">
                  {dossier.pdfs.map((pdf, i) => (
                    <div key={pdf.id || i} className="col-md-4 col-lg-3">
                      <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                        <div className="card-body p-3 text-center">
                          <div className="mb-3">
                            <div style={{ width: "60px", height: "60px", background: "linear-gradient(135deg, #dc3545 0%, #b02a37 100%)", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                              <i className="fas fa-file-pdf fa-2x text-white"></i>
                            </div>
                          </div>
                          <h6 className="fw-semibold small mb-2 text-truncate" title={getFileName(pdf.path)}>
                            {getFileName(pdf.path)}
                          </h6>
                          <button
                            className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                            onClick={() => handleViewFile(pdf.path, "pdf")}
                            style={{ borderRadius: "8px" }}
                          >
                            <i className="fas fa-eye"></i>
                            <span>Visualiser</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Message si aucun document */}
            {dossier && (!groupedImages || Object.keys(groupedImages).length === 0) && (!dossier.pdfs || dossier.pdfs.length === 0) && (
              <div className="text-center py-5">
                <i className="fas fa-folder-open fa-4x text-muted mb-3"></i>
                <p className="text-muted mb-0">Aucun titre disponible pour ce dossier</p>
                <small className="text-muted">Aucune image ou document PDF trouvé</small>
              </div>
            )}

            {/* Visualisation du fichier sélectionné */}
            {selectedFile && (
              <div className="mt-4">
                <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                  <div className="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                    <h6 className="fw-semibold mb-0">
                      <i className="fas fa-eye me-2"></i>
                      Aperçu du document
                    </h6>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      style={{ borderRadius: "20px" }}
                      onClick={handleCloseFile}
                    >
                      <i className="fas fa-times me-1"></i>
                      Fermer
                    </button>
                  </div>
                  <div className="card-body p-0">
                    {fileType === "pdf" && (
                      <iframe
                        title="PDF Viewer"
                        width="100%"
                        height="600px"
                        src={`/storage/${selectedFile}`}
                        style={{ border: "none" }}
                      />
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
    );
}
