import { useState, useEffect, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalBootstrapVisualisation from "../Modals/ModalsGC/ModalBootstrapVisualisation";
import "../../styles/style.css";
import { MdTimeline } from "react-icons/md";
import CreditTimeline from "../Modals/ModalsGC/TimeLine";
import ModalContratPret from "../Modals/ModalsGC/ModalContratPret";
import TruncatedName from "./TruncatedName";
import ModalCheckListSuperviseur from "../Modals/ModalsGC/ModalCheckListSuperviseur";
import ModalTitreCredit from "../Modals/ModalsGC/ModalTitreCredit";

const ValidationC = () => {
    const inputRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [fetchData, setFetchData] = useState([]);
    const [searchRefCredit, setsearchRefCredit] = useState("");
    const [fetchSearchedCredit, setFetchSearchedCredit] = useState(null);
    // const [dossierIdSelected, setDossierIdSelected] = useState(null);
    //  const [dossierIdSelectedSuperv, setDossierIdSelectedSuperv] = useState(null);
    //  const [dossierIdSelectedTitre, setDossierIdSelectedTitre] = useState(null);
    //  const [dossierIdSelectedTimeLine, setDossierIdSelectedTimeLine] = useState(null);
    //  const [dossierIdSelectedContratPret, setDossierIdSelectedContratPret] = useState(null);
    const [type_recherche, settype_recherche] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [NumDossier, setNumDossier] = useState(null);

    const [selectedCreditForActions, setSelectedCreditForActions] =
        useState(null);
    const [selectedDossierId, setSelectedDossierId] = useState(null);
    const [selectedDossierIdContrat, setSelectedDossierIdContrat] =
        useState(null);
    const [selectedDossierIdTimeline, setSelectedDossierIdTimeline] =
        useState(null);
    const [selectedDossierIdSuperv, setSelectedDossierIdSuperv] =
        useState(null);
    const [selectedDossierIdTitre, setSelectedDossierIdTitre] = useState(null);

    // State pour l'offcanvas
    const [showActionsOffcanvas, setShowActionsOffcanvas] = useState(false);
    const [currentCredit, setCurrentCredit] = useState(null); // Stocke tout l'objet du crédit

    const itemsPerPage = 15;

    useEffect(() => {
        inputRef.current?.focus();
        getDataCredit();
    }, []);

    const getDataCredit = async () => {
        try {
            const res = await axios.get("/montage-credit/validation/rapport");

            if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                setFetchData(res.data.data);
                setNumDossier(res.data.data);
            } else {
                setFetchData([]);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des crédits :", error);
            setFetchData([]);
        }
    };

    const handleSeachCredit = async (ref) => {
        if (!ref) {
            Swal.fire({
                title: "Information",
                text: "Veuillez saisir un critère de recherche",
                icon: "info",
                timer: 3000,
                confirmButtonText: "OK",
            });
            return;
        }

        setloading(true);
        try {
            const res = await axios.post(
                "/montage_credit/page/validation/credit/reference",
                {
                    ref,
                    type_recherche,
                },
            );
            if (res.data.status == 1) {
                setFetchSearchedCredit(res.data.data);
            } else if (res.data.status == 0) {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                setFetchSearchedCredit(null);
            }
        } catch (error) {
            console.error("Erreur lors de la recherche :", error);
            Swal.fire({
                title: "Erreur",
                text: "Une erreur est survenue lors de la recherche",
                icon: "error",
                confirmButtonText: "OK",
            });
        } finally {
            setloading(false);
        }
    };

    const handleDeleteCredit = async (id) => {
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer ce dossier voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            try {
                const res = await axios.post(
                    "/gestion_credit/pages/dossier-credit/delete/" + id,
                );
                if (res.data.status == 1) {
                    Swal.fire({
                        title: "Suppression",
                        text: res.data.msg,
                        icon: "success",
                        timer: 3000,
                        confirmButtonText: "Okay",
                    });
                    getDataCredit();
                    setFetchSearchedCredit(null);
                } else {
                    Swal.fire({
                        title: "Suppression",
                        text: res.data.msg,
                        icon: "error",
                        timer: 3000,
                        confirmButtonText: "Okay",
                    });
                }
            } catch (error) {
                console.error("Erreur lors de la suppression :", error);
                Swal.fire({
                    title: "Erreur",
                    text: "Une erreur est survenue lors de la suppression",
                    icon: "error",
                    confirmButtonText: "OK",
                });
            }
        }
    };

    const dateParser = (num) => {
        if (!num) return "";
        const options = {
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };
        let timestamp = Date.parse(num);
        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);
        return date.toString();
    };

    // Calculs pour la pagination
    const totalPages = Math.ceil(fetchData.length / itemsPerPage) || 1;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = fetchData.slice(indexOfFirstItem, indexOfLastItem);

    // Fonctions de navigation
    const goToPage = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const goToNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const goToPrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // Rendu de la pagination
    const renderPagination = () => {
        const maxVisiblePages = 5;
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = [];

        // Points de suspension au début
        if (startPage > 1) {
            pages.push(
                <li key="start-ellipsis" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>,
            );
        }

        // Numéros de pages
        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <li
                    key={i}
                    className={`page-item ${currentPage === i ? "active" : ""}`}
                >
                    <button
                        onClick={() => goToPage(i)}
                        className="page-link"
                        style={{
                            borderRadius: "8px",
                            backgroundColor:
                                currentPage === i ? "#0d6efd" : "white",
                            color: currentPage === i ? "white" : "#0d6efd",
                            border: "1px solid #dee2e6",
                            padding: "6px 12px",
                            fontSize: "13px",
                            fontWeight: currentPage === i ? "600" : "400",
                            transition: "all 0.2s ease",
                            minWidth: "36px",
                        }}
                        onMouseEnter={(e) => {
                            if (currentPage !== i) {
                                e.currentTarget.style.backgroundColor =
                                    "#e7f1ff";
                                e.currentTarget.style.transform =
                                    "translateY(-1px)";
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (currentPage !== i) {
                                e.currentTarget.style.backgroundColor = "white";
                                e.currentTarget.style.transform =
                                    "translateY(0)";
                            }
                        }}
                    >
                        {i}
                    </button>
                </li>,
            );
        }

        // Points de suspension à la fin
        if (endPage < totalPages) {
            pages.push(
                <li key="end-ellipsis" className="page-item disabled">
                    <span className="page-link">...</span>
                </li>,
            );
        }

        return pages;
    };

    // Tri des options du select
    document.addEventListener("DOMContentLoaded", function () {
        let select = document.querySelector("#produit_credit_select");
        if (select) {
            let options = Array.from(select.options);
            options.sort((a, b) => a.text.localeCompare(b.text));
            select.innerHTML = "";
            options.forEach((option) => select.add(option));
        }
    });

    return (
        <>
            <div
                className="container-fluid px-3 px-lg-4"
                style={{ marginTop: "10px" }}
            >
                {/* ===== EN-TÊTE MODERNE ===== */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="card modern-header-card">
                            <div className="modern-header-content d-flex flex-wrap align-items-center justify-content-between gap-2">
                                <div>
                                    <h5 className="fw-bold mb-1 text-white d-flex align-items-center gap-2">
                                        <i className="fas fa-gem fs-5"></i>
                                        Validation crédit
                                    </h5>
                                    <small className="text-white-50">
                                        <i className="fas fa-hourglass-half me-1"></i>
                                        Liste des crédits en cours d'étude et
                                        validation
                                    </small>
                                </div>
                                <div className="bg-white bg-opacity-15 rounded-4 px-3 py-2">
                                    <small className="text-dark">
                                        <i className="fas fa-chart-line me-1"></i>{" "}
                                        {fetchData?.length || 0} dossiers
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== BARRE DE RECHERCHE MODERNE ===== */}
                <div className="row mb-5">
                    <div className="col-12">
                        <div className="card modern-search-card p-3">
                            <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center">
                                {/* Sélecteur de type */}
                                <div
                                    className="flex-shrink-0"
                                    style={{ minWidth: "180px", zIndex: "0px" }}
                                >
                                    <select
                                        className="form-select modern-select"
                                        name="type_recherche"
                                        id="type_recherche"
                                        onChange={(e) =>
                                            settype_recherche(e.target.value)
                                        }
                                        value={type_recherche}
                                    >
                                        <option value="">
                                            🔍 Recherche par
                                        </option>
                                        <option value="AC">
                                            👤 Agent crédit
                                        </option>
                                        <option value="type_credit">
                                            📊 Type crédit
                                        </option>
                                        <option value="credit_refuse">
                                            ❌ Crédits refusés
                                        </option>
                                    </select>
                                </div>

                                {/* Champ dynamique */}
                                <div className="flex-grow-1">
                                    {type_recherche === "AC" ? (
                                        <select
                                            className="form-select modern-select"
                                            value={searchRefCredit}
                                            onChange={(e) =>
                                                setsearchRefCredit(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                👥 Sélectionnez un agent crédit
                                            </option>
                                            <option value="ALAME KUZANWA WILLY">
                                                👤 ALAME KUZANWA WILLY
                                            </option>
                                            <option value="AKILI SANGARA JULIEN">
                                                👤 AKILI SANGARA JULIEN
                                            </option>
                                            <option value="MAPENDO RUTH">
                                                👤 MAPENDO RUTH
                                            </option>
                                            <option value="LAVIE MATEMBERA">
                                                👤 LAVIE MATEMBERA
                                            </option>
                                            <option value="KANKINSINGI NGADU">
                                                👤 KANKINSINGI NGADU
                                            </option>
                                            <option value="NEEMA MULINGA GRACE">
                                                👤 NEEMA MULINGA GRACE
                                            </option>
                                            <option value="NGASHANI ALBERT">
                                                👤 NGASHANI ALBERT
                                            </option>
                                            <option value="WIVINE ALISA">
                                                👤 WIVINE ALISA
                                            </option>
                                            <option value="MOSES KATEMBO">
                                                👤 MOSES KATEMBO
                                            </option>
                                            <option value="SAFARI KALEKERA">
                                                👤 SAFARI KALEKERA
                                            </option>
                                        </select>
                                    ) : type_recherche === "type_credit" ? (
                                        <select
                                            className="form-select modern-select"
                                            value={searchRefCredit}
                                            onChange={(e) =>
                                                setsearchRefCredit(
                                                    e.target.value,
                                                )
                                            }
                                        >
                                            <option value="">
                                                📋 Sélectionnez un type de
                                                crédit
                                            </option>
                                            <option value="Crédit Express à CT">
                                                ⚡ Crédit Express à CT
                                            </option>
                                            <option value="Crédits à la consommation à CT">
                                                🛒 Crédits à la consommation à
                                                CT
                                            </option>
                                            <option value="Crédit aux MPME à CT ">
                                                🏢 Crédit aux MPME à CT
                                            </option>
                                            <option value="Crédit Staff à MT ">
                                                👔 Crédit Staff à MT
                                            </option>
                                            <option value="Crédit aux Groupes Solidaires USD ">
                                                👥 Crédit aux Groupes Solidaires
                                                USD
                                            </option>
                                            <option value="Crédit Salaire à CT ">
                                                💰 Crédit Salaire à CT
                                            </option>
                                            <option value="Crédit Salaire à MT">
                                                💰 Crédit Salaire à MT
                                            </option>
                                            <option value="Crédit à l'habitat CT ">
                                                🏠 Crédit à l'habitat CT
                                            </option>
                                            <option value="Crédits à la consommation à MT ">
                                                🛒 Crédits à la consommation à
                                                MT
                                            </option>
                                            <option value="Crédit aux MPME à MT ">
                                                🏢 Crédit aux MPME à MT
                                            </option>
                                            <option value="Crédit aux MPME à CT en FC  ">
                                                🏢 Crédit aux MPME à CT en FC
                                            </option>
                                            <option value="Crédit aux Groupes Solidaires FC   ">
                                                👥 Crédit aux Groupes Solidaires
                                                FC
                                            </option>
                                            <option value="Crédit Agro-Pastoral à CT   ">
                                                🌾 Crédit Agro-Pastoral à CT
                                            </option>
                                            <option value="Crédit MWANGAZA   ">
                                                ⭐ Crédit MWANGAZA
                                            </option>
                                            <option value="Crédit Salaire à MT en FC   ">
                                                💰 Crédit Salaire à MT en FC
                                            </option>
                                            <option value="Crédits JIKO BORA Menage (CT)   ">
                                                🏠 Crédits JIKO BORA Menage (CT)
                                            </option>
                                            <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                                🛍️ Crédits JIKO BORA Grand Cons
                                                (CT)
                                            </option>
                                            <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                                🤝 Crédits TUFAIDIKE WOTE en USD
                                            </option>
                                            <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                                🤝 Crédits TUFAIDIKE WOTE en FC
                                            </option>
                                            <option value="Crédit aux salariés domiciliés à MT   ">
                                                👨‍💼 Crédit aux salariés
                                                domiciliés à MT
                                            </option>
                                            <option value="Crédit aux MPME à MT en FC    ">
                                                🏢 Crédit aux MPME à MT en FC
                                            </option>
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            className="form-control modern-input"
                                            placeholder="🔍 Rechercher par numéro de compte, nom, etc..."
                                            value={searchRefCredit}
                                            onChange={(e) =>
                                                setsearchRefCredit(
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}
                                </div>

                                {/* Bouton recherche */}
                                <div className="flex-shrink-0">
                                    <button
                                        type="button"
                                        className="btn modern-btn-search w-100 w-md-auto"
                                        onClick={() =>
                                            handleSeachCredit(searchRefCredit)
                                        }
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span
                                                    className="spinner-border spinner-border-sm me-2"
                                                    role="status"
                                                />
                                                Recherche...
                                            </>
                                        ) : (
                                            <>
                                                <i className="fas fa-search me-2"></i>
                                                <span>Rechercher</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ===== TABLEAU RESPONSIVE ===== */}
                <div className="row">
                    <div className="col-12">
                        <div className="modern-table-container">
                            {/* Version desktop - tableau standard */}
                            <div className="d-none d-lg-block">
                                <table className="table modern-table align-middle mb-0">
                                    <thead>
                                        <tr>
                                            <th>Num Compte</th>
                                            <th>Nom Compte</th>
                                            <th>Date demande</th>
                                            <th>Statut</th>
                                            <th className="text-center">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {!fetchSearchedCredit && currentItems
                                            ? currentItems.map(
                                                  (credit, index) => (
                                                      <tr key={index}>
                                                          <td
                                                              className="fw-semibold"
                                                              style={{
                                                                  color: "#0f2b3d",
                                                              }}
                                                          >
                                                              {credit.NumCompte}
                                                          </td>
                                                          <td>
                                                              <TruncatedName
                                                                  name={
                                                                      credit.NomCompte
                                                                  }
                                                              />
                                                          </td>
                                                          <td
                                                              className="text-muted"
                                                              style={{
                                                                  fontSize:
                                                                      "0.85rem",
                                                              }}
                                                          >
                                                              {dateParser(
                                                                  credit.date_demande,
                                                              )}
                                                          </td>
                                                          <td>
                                                              {credit.statutDossier ===
                                                              "Refusé" ? (
                                                                  <span className="badge-modern badge-refuse">
                                                                      ❌ Refusé
                                                                  </span>
                                                              ) : credit.statutDossier ===
                                                                "Encours" ? (
                                                                  <span className="badge-modern badge-encours">
                                                                      ✅ En
                                                                      cours
                                                                  </span>
                                                              ) : (
                                                                  <span className="badge-modern badge-attente">
                                                                      ⏳ En
                                                                      attente
                                                                  </span>
                                                              )}
                                                          </td>
                                                          <td className="py-3">
                                                              <div className="d-flex gap-2 justify-content-center align-items-center flex-wrap">
                                                                  <button
                                                                      type="button"
                                                                      className="btn btn-sm btn-outline-primary"
                                                                      onClick={() => {
                                                                          setSelectedDossierId(
                                                                              credit.id_credit,
                                                                          );
                                                                          setShowActionsOffcanvas(
                                                                              false,
                                                                          );

                                                                          setTimeout(
                                                                              () => {
                                                                                  const modal =
                                                                                      new window.bootstrap.Modal(
                                                                                          document.getElementById(
                                                                                              "modalVisualisationDossier",
                                                                                          ),
                                                                                      );
                                                                                  modal.show();
                                                                              },
                                                                              300,
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-eye"></i>
                                                                      <span className="ms-1">
                                                                          {" "}
                                                                          Visualiser
                                                                      </span>
                                                                  </button>

                                                                  {/* Bouton Fichiers */}
                                                                  <button
                                                                      type="button"
                                                                      className="btn btn-sm btn-outline-info"
                                                                      onClick={() => {
                                                                          setSelectedDossierIdContrat(
                                                                              credit.id_credit,
                                                                          );
                                                                          setShowActionsOffcanvas(
                                                                              false,
                                                                          );

                                                                          setTimeout(
                                                                              () => {
                                                                                  const modal =
                                                                                      new window.bootstrap.Modal(
                                                                                          document.getElementById(
                                                                                              "modalContratPret",
                                                                                          ),
                                                                                      );
                                                                                  modal.show();
                                                                              },
                                                                              300,
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i className="fa fa-file"></i>
                                                                      <span className="ms-1">
                                                                          {" "}
                                                                          Fichiers
                                                                      </span>
                                                                  </button>

                                                                  <button
                                                                      className="btn btn-sm btn-outline-secondary"
                                                                      type="button"
                                                                      onClick={() => {
                                                                          setCurrentCredit(
                                                                              credit,
                                                                          ); // Stocke tout l'objet du crédit
                                                                          setShowActionsOffcanvas(
                                                                              true,
                                                                          );
                                                                      }}
                                                                      style={{
                                                                          borderRadius:
                                                                              "6px",
                                                                          padding:
                                                                              "6px 12px",
                                                                          display:
                                                                              "inline-flex",
                                                                          alignItems:
                                                                              "center",
                                                                          gap: "6px",
                                                                          transition:
                                                                              "all 0.2s ease",
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-bars"></i>
                                                                      <span className="d-none d-sm-inline">
                                                                          Actions
                                                                      </span>
                                                                  </button>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  ),
                                              )
                                            : fetchSearchedCredit &&
                                              fetchSearchedCredit.map(
                                                  (res, index) => (
                                                      <tr key={index}>
                                                          <td className="fw-semibold">
                                                              {res.NumCompte}
                                                          </td>
                                                          <td>
                                                              {res.NomCompte}
                                                          </td>
                                                          <td className="text-muted">
                                                              {dateParser(
                                                                  res.date_demande,
                                                              )}
                                                          </td>
                                                          <td>
                                                              {res.statutDossier ===
                                                              "Refusé" ? (
                                                                  <span className="badge-modern badge-refuse">
                                                                      ❌ Refusé
                                                                  </span>
                                                              ) : res.statutDossier ===
                                                                "Encours" ? (
                                                                  <span className="badge-modern badge-encours">
                                                                      ✅ En
                                                                      cours
                                                                  </span>
                                                              ) : (
                                                                  <span className="badge-modern badge-attente">
                                                                      ⏳ En
                                                                      attente
                                                                  </span>
                                                              )}
                                                          </td>
                                                          <td className="py-3">
                                                              <div className="d-flex gap-2 justify-content-center align-items-center flex-wrap">
                                                                  <button
                                                                      type="button"
                                                                      className="btn btn-sm btn-outline-primary"
                                                                      onClick={() => {
                                                                          setSelectedDossierId(
                                                                              res.id_credit,
                                                                          );
                                                                          setShowActionsOffcanvas(
                                                                              false,
                                                                          );

                                                                          setTimeout(
                                                                              () => {
                                                                                  const modal =
                                                                                      new window.bootstrap.Modal(
                                                                                          document.getElementById(
                                                                                              "modalVisualisationDossier",
                                                                                          ),
                                                                                      );
                                                                                  modal.show();
                                                                              },
                                                                              300,
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-eye"></i>
                                                                      <span className="ms-1">
                                                                          {" "}
                                                                          Visualiser
                                                                      </span>
                                                                  </button>

                                                                  {/* Bouton Fichiers */}
                                                                  <button
                                                                      type="button"
                                                                      className="btn btn-sm btn-outline-info"
                                                                      onClick={() => {
                                                                          setSelectedDossierIdContrat(
                                                                              res.id_credit,
                                                                          );
                                                                          setShowActionsOffcanvas(
                                                                              false,
                                                                          );

                                                                          setTimeout(
                                                                              () => {
                                                                                  const modal =
                                                                                      new window.bootstrap.Modal(
                                                                                          document.getElementById(
                                                                                              "modalContratPret",
                                                                                          ),
                                                                                      );
                                                                                  modal.show();
                                                                              },
                                                                              300,
                                                                          );
                                                                      }}
                                                                  >
                                                                      <i className="fa fa-file"></i>
                                                                      <span className="ms-1">
                                                                          {" "}
                                                                          Fichiers
                                                                      </span>
                                                                  </button>

                                                                  <button
                                                                      className="btn btn-sm btn-outline-secondary"
                                                                      type="button"
                                                                      onClick={() => {
                                                                          setCurrentCredit(
                                                                              res,
                                                                          ); // Stocke tout l'objet du crédit
                                                                          setShowActionsOffcanvas(
                                                                              true,
                                                                          );
                                                                      }}
                                                                      style={{
                                                                          borderRadius:
                                                                              "6px",
                                                                          padding:
                                                                              "6px 12px",
                                                                          display:
                                                                              "inline-flex",
                                                                          alignItems:
                                                                              "center",
                                                                          gap: "6px",
                                                                          transition:
                                                                              "all 0.2s ease",
                                                                      }}
                                                                  >
                                                                      <i className="fas fa-bars"></i>
                                                                      <span className="d-none d-sm-inline">
                                                                          Actions
                                                                      </span>
                                                                  </button>
                                                              </div>
                                                          </td>
                                                      </tr>
                                                  ),
                                              )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Version mobile - cartes */}
                            <div className="d-block d-lg-none">
                                {!fetchSearchedCredit && currentItems
                                    ? currentItems.map((credit, index) => (
                                          <div
                                              key={index}
                                              className="credit-card-mobile mb-3"
                                          >
                                              <div className="credit-card-header">
                                                  <span
                                                      className="fw-bold"
                                                      style={{
                                                          color: "#0f2b3d",
                                                      }}
                                                  >
                                                      {credit.NumCompte}
                                                  </span>
                                                  <div>
                                                      {credit.statutDossier ===
                                                      "Refusé" ? (
                                                          <span className="badge-modern badge-refuse">
                                                              ❌ Refusé
                                                          </span>
                                                      ) : credit.statutDossier ===
                                                        "Encours" ? (
                                                          <span className="badge-modern badge-encours">
                                                              ✅ En cours
                                                          </span>
                                                      ) : (
                                                          <span className="badge-modern badge-attente">
                                                              ⏳ En attente
                                                          </span>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="credit-card-body">
                                                  <div className="credit-card-row">
                                                      <span className="credit-card-label">
                                                          Nom Compte :
                                                      </span>
                                                      <span className="credit-card-value">
                                                          <TruncatedName
                                                              name={
                                                                  credit.NomCompte
                                                              }
                                                          />
                                                      </span>
                                                  </div>
                                                  <div className="credit-card-row">
                                                      <span className="credit-card-label">
                                                          Date demande :
                                                      </span>
                                                      <span className="credit-card-value">
                                                          {dateParser(
                                                              credit.date_demande,
                                                          )}
                                                      </span>
                                                  </div>
                                              </div>
                                              <div className="credit-card-actions">
                                                  <button
                                                      type="button"
                                                      className="btn btn-sm btn-outline-primary"
                                                      onClick={() => {
                                                          setSelectedDossierId(
                                                              credit.id_credit,
                                                          );
                                                          setShowActionsOffcanvas(
                                                              false,
                                                          );

                                                          setTimeout(() => {
                                                              const modal =
                                                                  new window.bootstrap.Modal(
                                                                      document.getElementById(
                                                                          "modalVisualisationDossier",
                                                                      ),
                                                                  );
                                                              modal.show();
                                                          }, 300);
                                                      }}
                                                  >
                                                      <i className="fas fa-eye"></i>
                                                      <span className="ms-1">
                                                          {" "}
                                                          Visualiser
                                                      </span>
                                                  </button>

                                                  <button
                                                      type="button"
                                                      className="btn btn-sm btn-outline-info"
                                                      onClick={() => {
                                                          setSelectedDossierIdContrat(
                                                              credit.id_credit,
                                                          );
                                                          setShowActionsOffcanvas(
                                                              false,
                                                          );

                                                          setTimeout(() => {
                                                              const modal =
                                                                  new window.bootstrap.Modal(
                                                                      document.getElementById(
                                                                          "modalContratPret",
                                                                      ),
                                                                  );
                                                              modal.show();
                                                          }, 300);
                                                      }}
                                                  >
                                                      <i className="fa fa-file"></i>
                                                      <span className="ms-1">
                                                          {" "}
                                                          Fichiers
                                                      </span>
                                                  </button>
                                              </div>
                                          </div>
                                      ))
                                    : fetchSearchedCredit &&
                                      fetchSearchedCredit.map((res, index) => (
                                          <div
                                              key={index}
                                              className="credit-card-mobile mb-3"
                                          >
                                              <div className="credit-card-header">
                                                  <span className="fw-bold">
                                                      {res.NumCompte}
                                                  </span>
                                                  <div>
                                                      {res.statutDossier ===
                                                      "Refusé" ? (
                                                          <span className="badge-modern badge-refuse">
                                                              ❌ Refusé
                                                          </span>
                                                      ) : res.statutDossier ===
                                                        "Encours" ? (
                                                          <span className="badge-modern badge-encours">
                                                              ✅ En cours
                                                          </span>
                                                      ) : (
                                                          <span className="badge-modern badge-attente">
                                                              ⏳ En attente
                                                          </span>
                                                      )}
                                                  </div>
                                              </div>
                                              <div className="credit-card-body">
                                                  <div className="credit-card-row">
                                                      <span className="credit-card-label">
                                                          Nom Compte :
                                                      </span>
                                                      <span className="credit-card-value">
                                                          {res.NomCompte}
                                                      </span>
                                                  </div>
                                                  <div className="credit-card-row">
                                                      <span className="credit-card-label">
                                                          Date demande :
                                                      </span>
                                                      <span className="credit-card-value">
                                                          {dateParser(
                                                              res.date_demande,
                                                          )}
                                                      </span>
                                                  </div>
                                              </div>
                                              <div className="credit-card-actions">
                                                  <button
                                                      type="button"
                                                      className="btn btn-sm btn-outline-primary"
                                                      onClick={() => {
                                                          setSelectedDossierId(
                                                              res.id_credit,
                                                          );
                                                          setShowActionsOffcanvas(
                                                              false,
                                                          );

                                                          setTimeout(() => {
                                                              const modal =
                                                                  new window.bootstrap.Modal(
                                                                      document.getElementById(
                                                                          "modalVisualisationDossier",
                                                                      ),
                                                                  );
                                                              modal.show();
                                                          }, 300);
                                                      }}
                                                  >
                                                      <i className="fas fa-eye"></i>
                                                      <span className="ms-1">
                                                          {" "}
                                                          Visualiser
                                                      </span>
                                                  </button>

                                                  {/* Bouton Fichiers */}
                                                  <button
                                                      type="button"
                                                      className="btn btn-sm btn-outline-info"
                                                      onClick={() => {
                                                          setSelectedDossierIdContrat(
                                                              res.id_credit,
                                                          );
                                                          setShowActionsOffcanvas(
                                                              false,
                                                          );

                                                          setTimeout(() => {
                                                              const modal =
                                                                  new window.bootstrap.Modal(
                                                                      document.getElementById(
                                                                          "modalContratPret",
                                                                      ),
                                                                  );
                                                              modal.show();
                                                          }, 300);
                                                      }}
                                                  >
                                                      <i className="fa fa-file"></i>
                                                      <span className="ms-1">
                                                          {" "}
                                                          Fichiers
                                                      </span>
                                                  </button>

                                                  <button
                                                      className="btn btn-sm btn-outline-secondary"
                                                      type="button"
                                                      onClick={() => {
                                                          setSelectedDossierIdContrat(
                                                              res.id_credit,
                                                          );
                                                          setShowActionsOffcanvas(
                                                              false,
                                                          );

                                                          setTimeout(() => {
                                                              const modal =
                                                                  new window.bootstrap.Modal(
                                                                      document.getElementById(
                                                                          "modalContratPret",
                                                                      ),
                                                                  );
                                                              modal.show();
                                                          }, 300);
                                                      }}
                                                      style={{
                                                          borderRadius: "6px",
                                                          padding: "6px 12px",
                                                          display:
                                                              "inline-flex",
                                                          alignItems: "center",
                                                          gap: "6px",
                                                          transition:
                                                              "all 0.2s ease",
                                                      }}
                                                  >
                                                      <i className="fas fa-bars"></i>
                                                      <span className="d-none d-sm-inline">
                                                          Actions
                                                      </span>
                                                  </button>
                                              </div>
                                          </div>
                                      ))}
                            </div>
                        </div>

                        {/* Message vide */}
                        {!fetchSearchedCredit &&
                            (!currentItems || currentItems.length === 0) && (
                                <div className="text-center py-5 my-4 bg-light rounded-4">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <p className="text-muted mb-0">
                                        Aucun dossier de crédit trouvé
                                    </p>
                                </div>
                            )}

                        {/* Pagination modernisée */}
                        {!fetchSearchedCredit && fetchData.length > 0 && (
                            <div className="mt-5">
                                <div className="d-flex flex-wrap justify-content-center align-items-center gap-3">
                                    <nav>
                                        <ul className="pagination pagination-modern mb-0 flex-wrap justify-content-center">
                                            <li
                                                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() => goToPage(1)}
                                                    disabled={currentPage === 1}
                                                >
                                                    <i className="fas fa-angle-double-left me-1"></i>{" "}
                                                    <span className="d-none d-sm-inline">
                                                        Premier
                                                    </span>
                                                </button>
                                            </li>
                                            <li
                                                className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={goToPrevPage}
                                                    disabled={currentPage === 1}
                                                >
                                                    <i className="fas fa-chevron-left me-1"></i>{" "}
                                                    <span className="d-none d-sm-inline">
                                                        Précédent
                                                    </span>
                                                </button>
                                            </li>
                                            {renderPagination()}
                                            <li
                                                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={goToNextPage}
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                >
                                                    <span className="d-none d-sm-inline">
                                                        Suivant
                                                    </span>{" "}
                                                    <i className="fas fa-chevron-right ms-1"></i>
                                                </button>
                                            </li>
                                            <li
                                                className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                                            >
                                                <button
                                                    className="page-link"
                                                    onClick={() =>
                                                        goToPage(totalPages)
                                                    }
                                                    disabled={
                                                        currentPage ===
                                                        totalPages
                                                    }
                                                >
                                                    <span className="d-none d-sm-inline">
                                                        Dernier
                                                    </span>{" "}
                                                    <i className="fas fa-angle-double-right ms-1"></i>
                                                </button>
                                            </li>
                                        </ul>
                                    </nav>
                                    <small className="text-muted bg-light px-3 py-2 rounded-pill text-center">
                                        Page {currentPage} / {totalPages} •
                                        Total : {fetchData.length}
                                    </small>
                                </div>
                            </div>
                        )}

                        {/* ===== OFFCANVAS MODERNE POUR LES ACTIONS ===== */}
                        <div
                            className={`offcanvas offcanvas-end ${showActionsOffcanvas ? "show" : ""}`}
                            tabIndex="-1"
                            style={{
                                visibility: showActionsOffcanvas
                                    ? "visible"
                                    : "hidden",
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                                backdropFilter: "blur(4px)",
                            }}
                        >
                            <div className="offcanvas-container">
                                <div className="offcanvas-modern">
                                    {/* ===== HEADER ===== */}
                                    <div className="offcanvas-header-modern">
                                        <div className="d-flex align-items-center gap-3">
                                            <div className="action-icon-wrapper">
                                                <i className="fas fa-sliders-h"></i>
                                            </div>
                                            <div>
                                                <h5 className="mb-0 fw-bold">
                                                    Actions du dossier
                                                </h5>
                                                <p className="mb-0 small opacity-75">
                                                    #{currentCredit?.NumDossier} -{" "}
                                                   {currentCredit?.NomCompte}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            type="button"
                                            className="btn-close-modern"
                                            onClick={() =>
                                                setShowActionsOffcanvas(false)
                                            }
                                        >
                                            <i className="fas fa-times"></i>
                                        </button>
                                    </div>

                                    {/* ===== BODY ===== */}
                                    <div className="offcanvas-body-modern">
                                        <div className="actions-list">
                                            {/* ===== TIMELINE ===== */}
                                            {/* <button
                                                className="action-item"
                                                onClick={() => {
                                                    setSelectedDossierIdTimeline(
                                                        currentCredit?.id_credit,
                                                    );
                                                    setShowActionsOffcanvas(
                                                        false,
                                                    );

                                                    setTimeout(() => {
                                                        const modal =
                                                            new window.bootstrap.Modal(
                                                                document.getElementById(
                                                                    "modalTimeLine",
                                                                ),
                                                            );
                                                        modal.show();
                                                    }, 300);
                                                }}
                                            >
                                                <div
                                                    className="action-icon"
                                                    style={{
                                                        backgroundColor:
                                                            "#e8f5e9",
                                                        color: "#2e7d32",
                                                    }}
                                                >
                                                    <MdTimeline size={20} />
                                                </div>
                                                <div className="action-content">
                                                    <h6 className="mb-0 fw-semibold">
                                                        Historique des
                                                        signatures
                                                    </h6>
                                                    <small className="text-muted">
                                                        Suivez l'évolution des
                                                        signatures
                                                    </small>
                                                </div>
                                                <i className="fas fa-chevron-right action-arrow"></i>
                                            </button> */}
                                            <button
    className="action-item"
    onClick={() => {
        setSelectedDossierIdTimeline(currentCredit?.id_credit);
        setShowActionsOffcanvas(false); // ferme le offcanvas des actions
    }}
>
    <div className="action-icon" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32' }}>
        <MdTimeline size={20} />
    </div>
    <div className="action-content">
        <h6 className="mb-0 fw-semibold">Historique des signatures</h6>
        <small className="text-muted">Suivez l'évolution des signatures</small>
    </div>
</button>

                                            {/* ===== CONTRAT ===== */}
                                            <button
                                                className="action-item"
                                                onClick={() => {
                                                    setSelectedDossierIdContrat(
                                                        currentCredit?.id_credit,
                                                    );
                                                    setShowActionsOffcanvas(
                                                        false,
                                                    );

                                                    setTimeout(() => {
                                                        const modal =
                                                            new window.bootstrap.Modal(
                                                                document.getElementById(
                                                                    "modalContratPret",
                                                                ),
                                                            );
                                                        modal.show();
                                                    }, 300);
                                                }}
                                            >
                                                <div
                                                    className="action-icon"
                                                    style={{
                                                        backgroundColor:
                                                            "#fff3e0",
                                                        color: "#ed6c02",
                                                    }}
                                                >
                                                    <i className="fas fa-file-contract"></i>
                                                </div>
                                                <div className="action-content">
                                                    <h6 className="mb-0 fw-semibold">
                                                        Contrat de prêt
                                                    </h6>
                                                    <small className="text-muted">
                                                        Visualisez et
                                                        téléchargez le contrat
                                                    </small>
                                                </div>
                                                <i className="fas fa-chevron-right action-arrow"></i>
                                            </button>

                                            {/* ===== CHECK LIST ===== */}
                                            <button
                                                className="action-item"
                                                onClick={() => {
                                                    setSelectedDossierIdSuperv(
                                                        currentCredit?.id_credit,
                                                    );
                                                    setShowActionsOffcanvas(
                                                        false,
                                                    );

                                                    setTimeout(() => {
                                                        const modal =
                                                            new window.bootstrap.Modal(
                                                                document.getElementById(
                                                                    "modalCheckListSuperviseur",
                                                                ),
                                                            );
                                                        modal.show();
                                                    }, 300);
                                                }}
                                            >
                                                <div
                                                    className="action-icon"
                                                    style={{
                                                        backgroundColor:
                                                            "#e8f5e9",
                                                        color: "#2e7d32",
                                                    }}
                                                >
                                                    <i className="fas fa-check-square"></i>
                                                </div>
                                                <div className="action-content">
                                                    <h6 className="mb-0 fw-semibold">
                                                        Check Liste superviseur
                                                    </h6>
                                                    <small className="text-muted">
                                                        Vérifiez les éléments de
                                                        contrôle
                                                    </small>
                                                </div>
                                                <i className="fas fa-chevron-right action-arrow"></i>
                                            </button>

                                            {/* ===== TITRES ===== */}
                                            <button
                                                className="action-item"
                                                onClick={() => {
                                                    setSelectedDossierIdTitre(
                                                        currentCredit?.id_credit,
                                                    );
                                                    setShowActionsOffcanvas(
                                                        false,
                                                    );

                                                    setTimeout(() => {
                                                        const modal =
                                                            new window.bootstrap.Modal(
                                                                document.getElementById(
                                                                    "modalVisualisationTitre",
                                                                ),
                                                            );
                                                        modal.show();
                                                    }, 300);
                                                }}
                                            >
                                                <div
                                                    className="action-icon"
                                                    style={{
                                                        backgroundColor:
                                                            "#e3f2fd",
                                                        color: "#1565c0",
                                                    }}
                                                >
                                                    <i className="fas fa-file-alt"></i>
                                                </div>
                                                <div className="action-content">
                                                    <h6 className="mb-0 fw-semibold">
                                                        Tous les titres
                                                    </h6>
                                                    <small className="text-muted">
                                                        Accédez à l'ensemble des
                                                        documents
                                                    </small>
                                                </div>
                                                <i className="fas fa-chevron-right action-arrow"></i>
                                            </button>

                                            {/* ===== DELETE ===== */}
                                            <button
                                                className="action-item action-item-danger"
                                                onClick={() => {
                                                    setShowActionsOffcanvas(
                                                        false,
                                                    );
                                                    setTimeout(() => {
                                                        handleDeleteCredit(
                                                            currentCredit?.id_credit,
                                                        );
                                                    }, 300);
                                                }}
                                            >
                                                <div
                                                    className="action-icon"
                                                    style={{
                                                        backgroundColor:
                                                            "#ffebee",
                                                        color: "#d32f2f",
                                                    }}
                                                >
                                                    <i className="fas fa-trash-alt"></i>
                                                </div>
                                                <div className="action-content">
                                                    <h6 className="mb-0 fw-semibold text-danger">
                                                        Supprimer le dossier
                                                    </h6>
                                                    <small className="text-muted">
                                                        Action irréversible
                                                    </small>
                                                </div>
                                                <i className="fas fa-chevron-right action-arrow"></i>
                                            </button>
                                        </div>

                                        {/* ===== FOOTER INFO ===== */}
                                        <div className="offcanvas-footer-info">
                                            <div className="info-card">
                                                <i className="fas fa-info-circle"></i>
                                                <div>
                                                    <small className="fw-semibold">
                                                        Informations dossier
                                                    </small>
                                                    <small className="d-block text-muted">
                                                        Créé le :{" "}
                                                        {currentCredit?.date_demande
                                                            ? dateParser(
                                                                  currentCredit.date_demande,
                                                              )
                                                            : "N/A"}
                                                    </small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>









   <div
  className={`offcanvas offcanvas-bottom ${selectedDossierIdTimeline ? "show" : ""}`}
  tabIndex="-1"
  style={{
    visibility: selectedDossierIdTimeline ? "visible" : "hidden",
    height: "100vh",
    backgroundColor: "white",
    borderTopLeftRadius: "0",
    borderTopRightRadius: "0",
    boxShadow: "0 -4px 12px rgba(0,0,0,0.2)",
    transition: "visibility 0.3s, transform 0.3s",
    transform: selectedDossierIdTimeline ? "translateY(0)" : "translateY(100%)",
    width: "100%",
    maxWidth: "100%",
    left: "0",
    right: "0",
  }}
>
  {/* Header moderne amélioré */}
  <div 
    className="offcanvas-header border-0"  
    style={{
      background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
      borderRadius: 0,
      padding: "1.25rem 1.5rem",
      flexShrink: 0,
      margin: 0,
      position: "relative",
    }}
  >
    {/* Indicateur de tirage pour fermer */}
    <div
      style={{
        position: "absolute",
        top: "12px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "40px",
        height: "4px",
        background: "rgba(255, 255, 255, 0.2)",
        borderRadius: "2px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={() => setSelectedDossierIdTimeline(null)}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.4)";
        e.currentTarget.style.width = "50px";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
        e.currentTarget.style.width = "40px";
      }}
    ></div>

    <div className="d-flex align-items-center justify-content-between w-100">
      <div className="d-flex align-items-center gap-3">
        <div
          style={{
            width: "48px",
            height: "48px",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
            borderRadius: "16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
          }}
        >
          <MdTimeline size={24} color="#10b981" />
        </div>
        <div>
          <h4
            className="fw-bold mb-1"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              letterSpacing: "-0.3px",
              margin: 0,
              fontSize: "1.35rem",
            }}
          >
            Historique des signatures
          </h4>
          <p
            className="mb-0"
            style={{
              fontSize: "0.8rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontWeight: "400",
            }}
          >
            Suivi chronologique des signatures du dossier
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={() => setSelectedDossierIdTimeline(null)}
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "12px",
          background: "rgba(255, 255, 255, 0.1)",
          border: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "all 0.2s ease",
          backdropFilter: "blur(10px)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
          e.currentTarget.style.transform = "scale(1.05) rotate(90deg)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
          e.currentTarget.style.transform = "scale(1) rotate(0deg)";
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  </div>

  <div className="offcanvas-body overflow-auto p-0">
    {selectedDossierIdTimeline && (
      <CreditTimeline
        creditId={selectedDossierIdTimeline}
      />
    )}
  </div>

  {/* Footer avec bouton modernisé */}
  <div className="offcanvas-footer p-3 pt-0" style={{ background: "#ffffff", borderTop: "1px solid #eef2ff" }}>
    <button 
      className="btn w-100" 
      onClick={() => setSelectedDossierIdTimeline(null)}
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
        border: "1px solid #e2e8f0",
        padding: "12px",
        borderRadius: "14px",
        color: "#475569",
        fontWeight: "600",
        fontSize: "0.9rem",
        transition: "all 0.2s ease",
        letterSpacing: "-0.2px",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.05)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
      Fermer
    </button>
  </div>
</div>

            {/* Modales */}

            {/* Modal Timeline - utilise le state dédié */}

            {/* Modal Contrat Pret */}
            {selectedDossierIdContrat && (
                <ModalContratPret
                    creditId={selectedDossierIdContrat}
                    onClose={() => setSelectedDossierIdContrat(null)}
                />
            )}

            {/* Modal Check Liste Superviseur */}
            {selectedDossierIdSuperv && (
                <ModalCheckListSuperviseur
                    dossierId={selectedDossierIdSuperv}
                    NumDossier={NumDossier?.NumDossier}
                    onClose={() => setSelectedDossierIdSuperv(null)}
                />
            )}

            {/* Modal Visualisation Titre */}
            {selectedDossierIdTitre && (
                <ModalTitreCredit
                    creditId={selectedDossierIdTitre}
                    onClose={() => setSelectedDossierIdTitre(null)}
                />
            )}

            {/* Modal Visualisation Dossier */}
            {selectedDossierId && (
                <ModalBootstrapVisualisation
                    dossierId={selectedDossierId}
                    onClose={() => setSelectedDossierId(null)}
                />
            )}

            {/* {selectedDossierIdTimeline && (
                <CreditTimeline
                    creditId={selectedDossierIdTimeline}
                    onClose={() => setSelectedDossierIdTimeline(null)}
                />
            )} */}

            <style>
                {`
    /* ===== STYLES MODERNES ===== */
    .modern-header-card {
      background: teal;
      border-radius: 20px;
      border: none;
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
      overflow: hidden;
    }

    .modern-header-content {
      padding: 1rem 1.5rem;
      position: relative;
    }

    .modern-header-content::after {
      content: '';
      position: absolute;
      top: -30px;
      right: -30px;
      width: 150px;
      height: 150px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 50%;
      pointer-events: none;
    }

    .modern-search-card {
      background: rgba(255, 255, 255, 0.96);
      backdrop-filter: blur(4px);
      border: 1px solid rgba(0, 0, 0, 0.05);
      border-radius: 24px;
      box-shadow: 0 6px 14px rgba(0, 0, 0, 0.03);
      transition: all 0.2s;
    }

    .modern-select, .modern-input {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 10px 14px;
      font-weight: 500;
      transition: all 0.2s;
    }

    .modern-select:focus, .modern-input:focus {
      border-color: #1a4a6f;
      box-shadow: 0 0 0 3px rgba(26, 74, 111, 0.1);
      outline: none;
    }

    .modern-btn-search {
      background: teal;
      border: none;
      border-radius: 40px;
      padding: 10px 24px;
      font-weight: 600;
      transition: all 0.2s ease;
    }

    .modern-btn-search:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 18px rgba(26, 74, 111, 0.3);
    }

    .modern-table-container {
      border-radius: 24px;
      background: white;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.03);
      overflow-x: auto;
    }

    .modern-table {
      width: 100%;
      border-collapse: separate;
      border-spacing: 0;
    }

    .modern-table thead th {
      background: #f1f5f9;
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #1e293b;
      padding: 1rem 0.75rem;
      border-bottom: 2px solid #e2e8f0;
    }

    .modern-table tbody tr {
      transition: all 0.2s;
      background: white;
    }

    .modern-table tbody tr:hover {
      background-color: #fefce8;
      transform: scale(1.01);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .modern-table td {
      padding: 1rem 0.75rem;
      vertical-align: middle;
      border-bottom: 1px solid #f1f5f9;
    }

    .badge-modern {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 0.4rem 1rem;
      border-radius: 40px;
      font-size: 0.75rem;
      font-weight: 600;
      background: #f1f5f9;
      color: #1e293b;
    }

    .badge-refuse {
      background: #fee2e2;
      color: #b91c1c;
    }

    .badge-encours {
      background: #dcfce7;
      color: #15803d;
    }

    .badge-attente {
      background: #fef9c3;
      color: #854d0e;
    }

    .pagination-modern {
      gap: 8px;
    }

    .pagination-modern .page-link {
      border: none;
      border-radius: 40px !important;
      padding: 8px 16px;
      font-weight: 500;
      color: #1e293b;
      background: white;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
      transition: all 0.2s;
    }

    .pagination-modern .page-link:hover {
      background: #1e3a5f;
      color: white;
      transform: translateY(-2px);
    }

    .pagination-modern .active .page-link {
      background: #1e3a5f;
      color: white;
      box-shadow: 0 4px 8px rgba(30, 58, 95, 0.2);
    }

    /* Styles pour les cartes mobiles */
    .credit-card-mobile {
      background: white;
      border-radius: 16px;
      padding: 1rem;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      transition: all 0.2s;
    }

    .credit-card-mobile:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    }

    .credit-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.75rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #f1f5f9;
    }

    .credit-card-body {
      margin-bottom: 1rem;
    }

    .credit-card-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
    }

    .credit-card-label {
      font-weight: 600;
      color: #64748b;
    }

    .credit-card-value {
      color: #1e293b;
      text-align: right;
      word-break: break-word;
      max-width: 60%;
    }

    .credit-card-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding-top: 0.5rem;
      border-top: 1px solid #f1f5f9;
    }

    /* Responsive pour très petits écrans */
    @media (max-width: 480px) {
      .credit-card-actions {
        flex-direction: column;
      }
      
      .credit-card-actions .btn,
      .credit-card-actions .dropdown {
        width: 100%;
      }
      
      .credit-card-actions .dropdown-toggle {
        width: 100%;
        justify-content: center;
      }
      
      .credit-card-row {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.25rem;
      }
      
      .credit-card-value {
        max-width: 100%;
        text-align: left;
      }
    }

    /* Ajustements pour la pagination mobile */
    @media (max-width: 768px) {
      .pagination-modern {
        gap: 4px;
      }
      
      .pagination-modern .page-link {
        padding: 6px 10px;
        font-size: 0.8rem;
      }
    }






    /* ===== OFFCANVAS MODERNE ===== */
.offcanvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 99999;
  width: 100%;
  max-width: 450px;
  visibility: hidden;
  transition: visibility 0.3s ease-in-out;
}

.offcanvas.show {
  visibility: visible;
}

.offcanvas-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  max-width: 450px;
  transform: translateX(100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.offcanvas.show .offcanvas-container {
  transform: translateX(0);
}

.offcanvas-modern {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0, 0, 0, 0.12);
  position: relative;
}

/* En-tête moderne */
.offcanvas-header-modern {
  padding: 1.5rem;
  background: linear-gradient(135deg, #1a4a6f 0%, #0f2b3d 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.action-icon-wrapper {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  backdrop-filter: blur(10px);
}

.btn-close-modern {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.15);
  border: none;
  border-radius: 12px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-close-modern:hover {
  background: rgba(255, 255, 255, 0.25);
  transform: rotate(90deg);
}

/* Corps de l'offcanvas */
.offcanvas-body-modern {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem;
}

.actions-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  transition: all 0.2s ease;
  cursor: pointer;
  width: 100%;
  text-align: left;
}

.action-item:hover {
  transform: translateX(4px);
  border-color: #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.action-item-danger:hover {
  background: #fff5f5;
  border-color: #fed7d7;
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.action-item:hover .action-icon {
  transform: scale(1.05);
}

.action-content {
  flex: 1;
}

.action-content h6 {
  font-size: 0.95rem;
  margin-bottom: 0.25rem;
  color: #1e293b;
}

.action-content small {
  font-size: 0.75rem;
  display: block;
  line-height: 1.3;
}

.action-arrow {
  color: #94a3b8;
  font-size: 12px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.action-item:hover .action-arrow {
  transform: translateX(4px);
  color: #1a4a6f;
}

/* Footer info */
.offcanvas-footer-info {
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.info-card {
  background: #f1f5f9;
  border-radius: 14px;
  padding: 1rem;
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.info-card i {
  font-size: 20px;
  color: #3b82f6;
}

/* Animation d'entrée */
@keyframes slideInRight {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.offcanvas.show .offcanvas-container {
  animation: slideInRight 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Responsive */
@media (max-width: 576px) {
  .offcanvas {
    max-width: 100%;
  }
  
  .offcanvas-container {
    max-width: 100%;
  }
  
  .offcanvas-header-modern {
    padding: 1rem;
  }
  
  .offcanvas-body-modern {
    padding: 1rem;
  }
  
  .action-item {
    padding: 0.875rem;
  }
}
      
  `}
            </style>
        </>
    );
};

export default ValidationC;
