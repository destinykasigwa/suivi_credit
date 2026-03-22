//import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
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

const ValidationC = () => {
    const inputRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [fetchData, setFetchData] = useState();
    const [searchRefCredit, setsearchRefCredit] = useState();
    const [fetchSearchedCredit, setFetchSearchedCredit] = useState();
    const [dossierIdSelected, setDossierIdSelected] = useState(null);
    const [type_recherche, settype_recherche] = useState();
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        // Place automatiquement le curseur dans le champ à l'ouverture de la page
        inputRef.current?.focus();
        getDataCredit();
    }, []);

    const getDataCredit = async () => {
        try {
            const res = await axios.get("/montage-credit/validation/rapport");

            // Vérifie si le tableau existe et contient des données
            if (Array.isArray(res.data.data) && res.data.data.length > 0) {
                setFetchData(res.data.data);
            } else {
                setFetchData([]); // tableau vide si aucune donnée
            }
        } catch (error) {
            console.error("Erreur lors du chargement des crédits :", error);
            setFetchData([]); // en cas d'erreur, tableau vide pour éviter le crash
        }
    };

    //PERMET DE RECHERCHER UN DOSSIER DE CREDIT

    const handleSeachCredit = async (ref) => {
        setloading(true);
        const res = await axios.post(
            "/montage_credit/page/validation/credit/reference",
            {
                ref,
                type_recherche,
            },
        );
        if (res.data.status == 1) {
            setloading(false);
            setFetchSearchedCredit(res.data.data);
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
            const res = await axios.post(
                "/gestion_credit/pages/dossier-credit/delete/" + id,
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Suppression",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                getDataCredit();
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

    // const handleVisualiser = (dossier) => {
    //     setSelectedDossier(dossier);
    //     setShowModal(true);
    // };

    // Calculate the index of the first and last item of the current page
    let itemsPerPage = 5;
    const totalPages = Math.ceil(fetchData && fetchData.length / itemsPerPage);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems =
        fetchData && fetchData.slice(indexOfFirstItem, indexOfLastItem);

    // const handlePageChange = (pageNumber) => {
    //     setCurrentPage(pageNumber);
    // };
    const renderPagination = () => {
        const totalPages = Math.ceil(fetchData?.length / itemsPerPage) || 1;
        const maxVisiblePages = 5; // Nombre maximum de pages visibles
        const halfVisible = Math.floor(maxVisiblePages / 2);

        let startPage = Math.max(1, currentPage - halfVisible);
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = [];

        // Ajouter les points de suspension au début
        if (startPage > 1) {
            pages.push(
                <li key="start-ellipsis" className="page-item disabled">
                    <span
                        className="page-link"
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #dee2e6",
                        }}
                    >
                        ...
                    </span>
                </li>,
            );
        }

        // Générer les numéros de pages
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

        // Ajouter les points de suspension à la fin
        if (endPage < totalPages) {
            pages.push(
                <li key="end-ellipsis" className="page-item disabled">
                    <span
                        className="page-link"
                        style={{
                            borderRadius: "8px",
                            border: "1px solid #dee2e6",
                        }}
                    >
                        ...
                    </span>
                </li>,
            );
        }

        return pages;
    };
    const goToNextPage = () => {
        setCurrentPage((prevPage) =>
            Math.min(
                prevPage + 1,
                Math.ceil(fetchData && fetchData.length / itemsPerPage),
            ),
        );
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // const paginationStyle = {
    //     listStyle: "none",
    //     display: "flex",
    //     justifyContent: "center",
    //     alignItems: "center",
    //     background: "",
    // };

    // const buttonStylePrevNext = {
    //     padding: "2px 20px",
    //     backgroundColor: "steelblue",
    //     color: "white",
    //     border: "none",
    //     borderRadius: "5px",
    //     cursor: "pointer",
    //     margin: "0 5px",
    // };
    const buttonStyle = {
        padding: "1px 5px",
        backgroundColor: "steelblue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 5px",
    };

    // const selectedButtonStyle = {
    //     ...buttonStyle,
    //     backgroundColor: "#FFC107", // Change color for selected button
    // };

    document.addEventListener("DOMContentLoaded", function () {
        let select = document.querySelector("#produit_credit_select");
        let options = Array.from(select.options);

        options.sort((a, b) => a.text.localeCompare(b.text));

        select.innerHTML = "";
        options.forEach((option) => select.add(option));
    });

    return (
        <>
            <div className="container-fluid" style={{ marginTop: "10px" }}>
                {/* En-tête de la section */}
                <div className="row mb-3">
                    <div className="col-md-12">
                        <div className="card border-0 shadow-sm rounded-3 overflow-hidden">
                            <div
                                style={{
                                    background: "teal",
                                    padding: "12px 20px",
                                }}
                            >
                                <h5
                                    className="fw-semibold mb-0"
                                    style={{
                                        color: "white",
                                        letterSpacing: "0.3px",
                                    }}
                                >
                                    <i className="fas fa-clipboard-list me-2"></i>
                                    Validation crédit
                                </h5>
                                <small
                                    className="text-white-50"
                                    style={{ fontSize: "12px" }}
                                >
                                    <i className="fas fa-hourglass-half me-1"></i>
                                    Liste des crédits en cours d'étude et
                                    validation
                                </small>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row mt-3 card rounded-0 p-3">
                    <div className="col-md-12">
                        <div className="col-md-6 mb-3">
                            <div className="card border-0 shadow-sm rounded-3">
                                <div className="card-body p-2">
                                    <div className="d-flex gap-2 align-items-center">
                                        {/* Sélecteur de type de recherche */}
                                        <div
                                            className="flex-shrink-0"
                                            style={{ minWidth: "160px" }}
                                        >
                                            <select
                                                type="text"
                                                className="form-select form-select-sm border-0 bg-light"
                                                style={{
                                                    color: "#0d6efd",
                                                    fontWeight: "500",
                                                    cursor: "pointer",
                                                    borderRadius: "8px",
                                                    padding: "8px 12px",
                                                }}
                                                name="type_recherche"
                                                id="type_recherche"
                                                onChange={(e) => {
                                                    settype_recherche(
                                                        e.target.value,
                                                    );
                                                }}
                                                value={type_recherche}
                                            >
                                                <option value="">
                                                    🔍 Type de recherche
                                                </option>
                                                <option value="AC">
                                                    👤 Agent crédit
                                                </option>
                                                <option value="type_credit">
                                                    📊 Type crédit
                                                </option>
                                            </select>
                                        </div>

                                        {/* Champ de recherche dynamique */}
                                        <div className="flex-grow-1">
                                            {type_recherche === "AC" ? (
                                                <select
                                                    className="form-select form-select-sm border-0 bg-light"
                                                    style={{
                                                        borderRadius: "8px",
                                                        padding: "8px 12px",
                                                        fontWeight: "500",
                                                        color: "#495057",
                                                        cursor: "pointer",
                                                    }}
                                                    name="searchRefOperation"
                                                    value={searchRefCredit}
                                                    onChange={(e) => {
                                                        setsearchRefCredit(
                                                            e.target.value,
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        👥 Sélectionnez un agent
                                                        crédit
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
                                            ) : type_recherche ===
                                              "type_credit" ? (
                                                <select
                                                    className="form-select form-select-sm border-0 bg-light"
                                                    style={{
                                                        borderRadius: "8px",
                                                        padding: "8px 12px",
                                                        fontWeight: "500",
                                                        color: "#495057",
                                                        cursor: "pointer",
                                                    }}
                                                    name="searchRefOperation"
                                                    value={searchRefCredit}
                                                    id="produit_credit_select"
                                                    onChange={(e) => {
                                                        setsearchRefCredit(
                                                            e.target.value,
                                                        );
                                                    }}
                                                >
                                                    <option value="">
                                                        📋 Sélectionnez un type
                                                        de crédit
                                                    </option>
                                                    <option value="Crédit Express à CT">
                                                        ⚡ Crédit Express à CT
                                                    </option>
                                                    <option value="Crédits à la consommation à CT">
                                                        🛒 Crédits à la
                                                        consommation à CT
                                                    </option>
                                                    <option value="Crédit aux MPME à CT ">
                                                        🏢 Crédit aux MPME à CT
                                                    </option>
                                                    <option value="Crédit Staff à MT ">
                                                        👔 Crédit Staff à MT
                                                    </option>
                                                    <option value="Crédit aux Groupes Solidaires USD ">
                                                        👥 Crédit aux Groupes
                                                        Solidaires USD
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
                                                        🛒 Crédits à la
                                                        consommation à MT
                                                    </option>
                                                    <option value="Crédit aux MPME à MT ">
                                                        🏢 Crédit aux MPME à MT
                                                    </option>
                                                    <option value="Crédit aux MPME à CT en FC  ">
                                                        🏢 Crédit aux MPME à CT
                                                        en FC
                                                    </option>
                                                    <option value="Crédit aux Groupes Solidaires FC   ">
                                                        👥 Crédit aux Groupes
                                                        Solidaires FC
                                                    </option>
                                                    <option value="Crédit Agro-Pastoral à CT   ">
                                                        🌾 Crédit Agro-Pastoral
                                                        à CT
                                                    </option>
                                                    <option value="Crédit MWANGAZA   ">
                                                        ⭐ Crédit MWANGAZA
                                                    </option>
                                                    <option value="Crédit Salaire à MT en FC   ">
                                                        💰 Crédit Salaire à MT
                                                        en FC
                                                    </option>
                                                    <option value="Crédits JIKO BORA Menage (CT)   ">
                                                        🏠 Crédits JIKO BORA
                                                        Menage (CT)
                                                    </option>
                                                    <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                                        🛍️ Crédits JIKO BORA
                                                        Grand Cons (CT)
                                                    </option>
                                                    <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                                        🤝 Crédits TUFAIDIKE
                                                        WOTE en USD
                                                    </option>
                                                    <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                                        🤝 Crédits TUFAIDIKE
                                                        WOTE en FC
                                                    </option>
                                                    <option value="Crédit aux salariés domiciliés à MT   ">
                                                        👨‍💼 Crédit aux salariés
                                                        domiciliés à MT
                                                    </option>
                                                    <option value="Crédit aux MPME à MT en FC    ">
                                                        🏢 Crédit aux MPME à MT
                                                        en FC
                                                    </option>
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="form-control form-control-sm border-0 bg-light"
                                                    style={{
                                                        borderRadius: "8px",
                                                        padding: "8px 12px",
                                                        fontWeight: "500",
                                                        color: "#495057",
                                                    }}
                                                    placeholder="🔍 Rechercher par numéro de compte, nom, etc..."
                                                    name="searchRefOperation"
                                                    value={searchRefCredit}
                                                    onChange={(e) => {
                                                        setsearchRefCredit(
                                                            e.target.value,
                                                        );
                                                    }}
                                                />
                                            )}
                                        </div>

                                        {/* Bouton de recherche */}
                                        <div className="flex-shrink-0">
                                            <button
                                                type="button"
                                                className="btn btn-primary btn-sm"
                                                style={{
                                                    borderRadius: "8px",
                                                    padding: "8px 20px",
                                                    fontWeight: "500",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                    transition: "all 0.2s ease",
                                                    background:
                                                        "linear-gradient(135deg, #0d6efd 0%, #0b5ed7 100%)",
                                                    border: "none",
                                                }}
                                                onClick={() => {
                                                    handleSeachCredit(
                                                        searchRefCredit,
                                                    );
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                    e.currentTarget.style.boxShadow =
                                                        "0 4px 12px rgba(13,110,253,0.3)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                    e.currentTarget.style.boxShadow =
                                                        "none";
                                                }}
                                                disabled={loading}
                                            >
                                                {loading ? (
                                                    <>
                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                        ></span>
                                                        <span>
                                                            Recherche...
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <i className="fas fa-search"></i>
                                                        <span>Rechercher</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="table-responsive rounded-3 shadow-sm">
                            <table className="table table-hover table-striped align-middle mb-0">
                                <thead className="table-light">
                                    <tr
                                        style={{
                                            backgroundColor: "#f8f9fa",
                                            borderBottom: "2px solid #dee2e6",
                                        }}
                                    >
                                        <th
                                            className="py-3 fw-semibold"
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#495057",
                                            }}
                                        >
                                            Num Compte
                                        </th>
                                        <th
                                            className="py-3 fw-semibold"
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#495057",
                                            }}
                                        >
                                            Nom Compte
                                        </th>
                                        <th
                                            className="py-3 fw-semibold"
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#495057",
                                            }}
                                        >
                                            Date demande
                                        </th>
                                        <th
                                            className="py-3 fw-semibold"
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#495057",
                                            }}
                                        >
                                            Statut
                                        </th>
                                        <th
                                            className="py-3 fw-semibold text-center"
                                            style={{
                                                fontSize: "0.85rem",
                                                color: "#495057",
                                            }}
                                        >
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {!fetchSearchedCredit && currentItems
                                        ? currentItems.map((credit, index) => (
                                              <tr
                                                  key={index}
                                                  className="border-bottom"
                                                  style={{
                                                      transition:
                                                          "background-color 0.2s ease",
                                                  }}
                                              >
                                                  <td
                                                      className="py-3"
                                                      style={{
                                                          fontWeight: "500",
                                                          color: "#2c3e50",
                                                      }}
                                                  >
                                                      {credit.NumCompte}
                                                  </td>
                                                  <td className="py-3">
                                                      <TruncatedName
                                                          name={
                                                              credit.NomCompte
                                                          }
                                                      />
                                                  </td>
                                                  <td
                                                      className="py-3 text-muted"
                                                      style={{
                                                          fontSize: "0.9rem",
                                                      }}
                                                  >
                                                      {dateParser(
                                                          credit.date_demande,
                                                      )}
                                                  </td>
                                                  <td className="py-3">
                                                      {credit.statutDossier ===
                                                      "Refusé" ? (
                                                          <span
                                                              className="badge bg-danger px-3 py-2 rounded-pill"
                                                              style={{
                                                                  fontSize:
                                                                      "0.75rem",
                                                                  fontWeight:
                                                                      "500",
                                                              }}
                                                          >
                                                              ❌ Refusé
                                                          </span>
                                                      ) : credit.statutDossier ===
                                                        "Encours" ? (
                                                          <span
                                                              className="badge bg-success px-3 py-2 rounded-pill"
                                                              style={{
                                                                  fontSize:
                                                                      "0.75rem",
                                                                  fontWeight:
                                                                      "500",
                                                              }}
                                                          >
                                                              ✅ En cours
                                                          </span>
                                                      ) : (
                                                          <span
                                                              className="badge bg-secondary px-3 py-2 rounded-pill"
                                                              style={{
                                                                  fontSize:
                                                                      "0.75rem",
                                                                  fontWeight:
                                                                      "500",
                                                              }}
                                                          >
                                                              ⏳ En attente
                                                          </span>
                                                      )}
                                                  </td>
                                                  <td className="py-3 text-center">
                                                      <div
                                                          className="btn-group gap-2"
                                                          role="group"
                                                          style={{
                                                              display: "flex",
                                                              justifyContent:
                                                                  "center",
                                                              gap: "8px",
                                                          }}
                                                      >
                                                          <button
                                                              type="button"
                                                              className="btn btn-sm btn-outline-primary"
                                                              data-toggle="modal"
                                                              data-target="#modalVisualisationDossier"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit,
                                                                  )
                                                              }
                                                              style={{
                                                                  borderRadius:
                                                                      "6px",
                                                                  display:
                                                                      "inline-flex",
                                                                  alignItems:
                                                                      "center",
                                                                  gap: "6px",
                                                                  transition:
                                                                      "all 0.2s ease",
                                                              }}
                                                              onMouseEnter={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(-1px)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "0 2px 6px rgba(13,110,253,0.2)";
                                                              }}
                                                              onMouseLeave={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(0)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "none";
                                                              }}
                                                          >
                                                              <i className="fas fa-eye"></i>
                                                              <span>
                                                                  Visualiser
                                                              </span>
                                                          </button>

                                                          <button
                                                              type="button"
                                                              className="btn btn-sm btn-outline-success"
                                                              data-toggle="modal"
                                                              data-target="#modalTimeLine"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit,
                                                                  )
                                                              }
                                                              style={{
                                                                  borderRadius:
                                                                      "6px",
                                                                  display:
                                                                      "inline-flex",
                                                                  alignItems:
                                                                      "center",
                                                                  gap: "6px",
                                                                  transition:
                                                                      "all 0.2s ease",
                                                              }}
                                                              onMouseEnter={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(-1px)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "0 2px 6px rgba(25,135,84,0.2)";
                                                              }}
                                                              onMouseLeave={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(0)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "none";
                                                              }}
                                                          >
                                                              <MdTimeline
                                                                  size={16}
                                                              />
                                                              <span>
                                                                  Signatures
                                                              </span>
                                                          </button>

                                                          <button
                                                              type="button"
                                                              className="btn btn-sm btn-outline-danger"
                                                              onClick={() =>
                                                                  handleDeleteCredit(
                                                                      credit.id_credit,
                                                                  )
                                                              }
                                                              style={{
                                                                  borderRadius:
                                                                      "6px",
                                                                  display:
                                                                      "inline-flex",
                                                                  alignItems:
                                                                      "center",
                                                                  gap: "6px",
                                                                  transition:
                                                                      "all 0.2s ease",
                                                              }}
                                                              onMouseEnter={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(-1px)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "0 2px 6px rgba(220,53,69,0.2)";
                                                              }}
                                                              onMouseLeave={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(0)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "none";
                                                              }}
                                                          >
                                                              <i
                                                                  className="fa fa-trash"
                                                                  aria-hidden="true"
                                                              ></i>
                                                              <span>
                                                                  Supprimer
                                                              </span>
                                                          </button>

                                                          <button
                                                              type="button"
                                                              className="btn btn-sm btn-outline-info"
                                                              data-toggle="modal"
                                                              data-target="#modalContratPret"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit,
                                                                  )
                                                              }
                                                              style={{
                                                                  borderRadius:
                                                                      "6px",
                                                                  display:
                                                                      "inline-flex",
                                                                  alignItems:
                                                                      "center",
                                                                  gap: "6px",
                                                                  transition:
                                                                      "all 0.2s ease",
                                                              }}
                                                              onMouseEnter={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(-1px)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "0 2px 6px rgba(13,202,240,0.2)";
                                                              }}
                                                              onMouseLeave={(
                                                                  e,
                                                              ) => {
                                                                  e.currentTarget.style.transform =
                                                                      "translateY(0)";
                                                                  e.currentTarget.style.boxShadow =
                                                                      "none";
                                                              }}
                                                          >
                                                              <i
                                                                  className="fa fa-file"
                                                                  aria-hidden="true"
                                                              ></i>
                                                              <span>
                                                                  Fichiers
                                                              </span>
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          ))
                                        : fetchSearchedCredit &&
                                          fetchSearchedCredit.map(
                                              (res, index) => (
                                                  <tr
                                                      key={index}
                                                      className="border-bottom"
                                                      style={{
                                                          transition:
                                                              "background-color 0.2s ease",
                                                      }}
                                                  >
                                                      <td
                                                          className="py-3"
                                                          style={{
                                                              fontWeight: "500",
                                                              color: "#2c3e50",
                                                          }}
                                                      >
                                                          {res.NumCompte}
                                                      </td>
                                                      <td className="py-3">
                                                          {res.NomCompte}
                                                      </td>
                                                      <td
                                                          className="py-3 text-muted"
                                                          style={{
                                                              fontSize:
                                                                  "0.9rem",
                                                          }}
                                                      >
                                                          {dateParser(
                                                              res.date_demande,
                                                          )}
                                                      </td>
                                                      <td className="py-3">
                                                          {res.statutDossier ===
                                                          "Refusé" ? (
                                                              <span
                                                                  className="badge bg-danger px-3 py-2 rounded-pill"
                                                                  style={{
                                                                      fontSize:
                                                                          "0.75rem",
                                                                      fontWeight:
                                                                          "500",
                                                                  }}
                                                              >
                                                                  ❌ Refusé
                                                              </span>
                                                          ) : res.statutDossier ===
                                                            "Encours" ? (
                                                              <span
                                                                  className="badge bg-success px-3 py-2 rounded-pill"
                                                                  style={{
                                                                      fontSize:
                                                                          "0.75rem",
                                                                      fontWeight:
                                                                          "500",
                                                                  }}
                                                              >
                                                                  ✅ En cours
                                                              </span>
                                                          ) : (
                                                              <span
                                                                  className="badge bg-secondary px-3 py-2 rounded-pill"
                                                                  style={{
                                                                      fontSize:
                                                                          "0.75rem",
                                                                      fontWeight:
                                                                          "500",
                                                                  }}
                                                              >
                                                                  ⏳ En attente
                                                              </span>
                                                          )}
                                                      </td>
                                                      <td className="py-3 text-center">
                                                          <div
                                                              className="btn-group gap-2"
                                                              role="group"
                                                              style={{
                                                                  display:
                                                                      "flex",
                                                                  justifyContent:
                                                                      "center",
                                                                  gap: "8px",
                                                              }}
                                                          >
                                                              <button
                                                                  type="button"
                                                                  className="btn btn-sm btn-outline-primary"
                                                                  data-toggle="modal"
                                                                  data-target="#modalVisualisationDossier"
                                                                  onClick={() =>
                                                                      setDossierIdSelected(
                                                                          res.id_credit,
                                                                      )
                                                                  }
                                                                  style={{
                                                                      borderRadius:
                                                                          "6px",
                                                                      display:
                                                                          "inline-flex",
                                                                      alignItems:
                                                                          "center",
                                                                      gap: "6px",
                                                                      transition:
                                                                          "all 0.2s ease",
                                                                  }}
                                                                  onMouseEnter={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(-1px)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "0 2px 6px rgba(13,110,253,0.2)";
                                                                  }}
                                                                  onMouseLeave={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(0)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "none";
                                                                  }}
                                                              >
                                                                  <i className="fas fa-eye"></i>
                                                                  <span>
                                                                      Visualiser
                                                                  </span>
                                                              </button>

                                                              <button
                                                                  type="button"
                                                                  className="btn btn-sm btn-outline-success"
                                                                  data-toggle="modal"
                                                                  data-target="#modalTimeLine"
                                                                  onClick={() =>
                                                                      setDossierIdSelected(
                                                                          res.id_credit,
                                                                      )
                                                                  }
                                                                  style={{
                                                                      borderRadius:
                                                                          "6px",
                                                                      display:
                                                                          "inline-flex",
                                                                      alignItems:
                                                                          "center",
                                                                      gap: "6px",
                                                                      transition:
                                                                          "all 0.2s ease",
                                                                  }}
                                                                  onMouseEnter={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(-1px)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "0 2px 6px rgba(25,135,84,0.2)";
                                                                  }}
                                                                  onMouseLeave={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(0)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "none";
                                                                  }}
                                                              >
                                                                  <MdTimeline
                                                                      size={16}
                                                                  />
                                                                  <span>
                                                                      Signatures
                                                                  </span>
                                                              </button>

                                                              <button
                                                                  type="button"
                                                                  className="btn btn-sm btn-outline-danger"
                                                                  onClick={() =>
                                                                      handleDeleteCredit(
                                                                          res.id_credit,
                                                                      )
                                                                  }
                                                                  style={{
                                                                      borderRadius:
                                                                          "6px",
                                                                      display:
                                                                          "inline-flex",
                                                                      alignItems:
                                                                          "center",
                                                                      gap: "6px",
                                                                      transition:
                                                                          "all 0.2s ease",
                                                                  }}
                                                                  onMouseEnter={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(-1px)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "0 2px 6px rgba(220,53,69,0.2)";
                                                                  }}
                                                                  onMouseLeave={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(0)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "none";
                                                                  }}
                                                              >
                                                                  <i
                                                                      className="fa fa-trash"
                                                                      aria-hidden="true"
                                                                  ></i>
                                                                  <span>
                                                                      Supprimer
                                                                  </span>
                                                              </button>

                                                              <button
                                                                  type="button"
                                                                  className="btn btn-sm btn-outline-info"
                                                                  data-toggle="modal"
                                                                  data-target="#modalContratPret"
                                                                  onClick={() =>
                                                                      setDossierIdSelected(
                                                                          res.id_credit,
                                                                      )
                                                                  }
                                                                  style={{
                                                                      borderRadius:
                                                                          "6px",
                                                                      display:
                                                                          "inline-flex",
                                                                      alignItems:
                                                                          "center",
                                                                      gap: "6px",
                                                                      transition:
                                                                          "all 0.2s ease",
                                                                  }}
                                                                  onMouseEnter={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(-1px)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "0 2px 6px rgba(13,202,240,0.2)";
                                                                  }}
                                                                  onMouseLeave={(
                                                                      e,
                                                                  ) => {
                                                                      e.currentTarget.style.transform =
                                                                          "translateY(0)";
                                                                      e.currentTarget.style.boxShadow =
                                                                          "none";
                                                                  }}
                                                              >
                                                                  <i
                                                                      className="fa fa-file"
                                                                      aria-hidden="true"
                                                                  ></i>
                                                                  <span>
                                                                      Fichiers
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

                        {/* Message si aucun résultat */}
                        {!fetchSearchedCredit &&
                            (!currentItems || currentItems.length === 0) && (
                                <div className="text-center py-5 bg-light rounded-3 mt-3">
                                    <i className="fas fa-inbox fa-3x text-muted mb-3"></i>
                                    <p className="text-muted mb-0">
                                        Aucun dossier de crédit trouvé
                                    </p>
                                </div>
                            )}
                        <div className="d-flex justify-content-center align-items-center mt-4 pt-2">
                            <nav aria-label="Navigation par pages">
                                <ul
                                    className="pagination pagination-sm mb-0"
                                    style={{ gap: "4px" }}
                                >
                                    {/* Bouton Première page */}
                                    <li
                                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => goToPage(1)}
                                            disabled={currentPage === 1}
                                            style={{
                                                borderRadius: "8px",
                                                color: "#0d6efd",
                                                border: "1px solid #dee2e6",
                                                padding: "6px 12px",
                                                fontSize: "13px",
                                                transition: "all 0.2s ease",
                                                backgroundColor: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentPage !== 1) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#0d6efd";
                                                    e.currentTarget.style.color =
                                                        "white";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentPage !== 1) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "white";
                                                    e.currentTarget.style.color =
                                                        "#0d6efd";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }
                                            }}
                                        >
                                            <i className="fas fa-angle-double-left me-1"></i>
                                            Premier
                                        </button>
                                    </li>

                                    {/* Bouton Précédent */}
                                    <li
                                        className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={goToPrevPage}
                                            disabled={currentPage === 1}
                                            style={{
                                                borderRadius: "8px",
                                                color: "#0d6efd",
                                                border: "1px solid #dee2e6",
                                                padding: "6px 12px",
                                                fontSize: "13px",
                                                transition: "all 0.2s ease",
                                                backgroundColor: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (currentPage !== 1) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#0d6efd";
                                                    e.currentTarget.style.color =
                                                        "white";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (currentPage !== 1) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "white";
                                                    e.currentTarget.style.color =
                                                        "#0d6efd";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }
                                            }}
                                        >
                                            <i className="fas fa-chevron-left me-1"></i>
                                            Précédent
                                        </button>
                                    </li>

                                    {/* Numéros de pages */}
                                    {renderPagination()}

                                    {/* Bouton Suivant */}
                                    <li
                                        className={`page-item ${
                                            currentPage ===
                                                Math.ceil(
                                                    fetchData?.length /
                                                        itemsPerPage,
                                                ) || fetchData?.length === 0
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={goToNextPage}
                                            disabled={
                                                currentPage ===
                                                    Math.ceil(
                                                        fetchData?.length /
                                                            itemsPerPage,
                                                    ) || fetchData?.length === 0
                                            }
                                            style={{
                                                borderRadius: "8px",
                                                color: "#0d6efd",
                                                border: "1px solid #dee2e6",
                                                padding: "6px 12px",
                                                fontSize: "13px",
                                                transition: "all 0.2s ease",
                                                backgroundColor: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (
                                                    currentPage !==
                                                        Math.ceil(
                                                            fetchData?.length /
                                                                itemsPerPage,
                                                        ) &&
                                                    fetchData?.length !== 0
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#0d6efd";
                                                    e.currentTarget.style.color =
                                                        "white";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (
                                                    currentPage !==
                                                        Math.ceil(
                                                            fetchData?.length /
                                                                itemsPerPage,
                                                        ) &&
                                                    fetchData?.length !== 0
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "white";
                                                    e.currentTarget.style.color =
                                                        "#0d6efd";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }
                                            }}
                                        >
                                            Suivant
                                            <i className="fas fa-chevron-right ms-1"></i>
                                        </button>
                                    </li>

                                    {/* Bouton Dernière page */}
                                    <li
                                        className={`page-item ${
                                            currentPage ===
                                                Math.ceil(
                                                    fetchData?.length /
                                                        itemsPerPage,
                                                ) || fetchData?.length === 0
                                                ? "disabled"
                                                : ""
                                        }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() =>
                                                goToPage(
                                                    Math.ceil(
                                                        fetchData?.length /
                                                            itemsPerPage,
                                                    ),
                                                )
                                            }
                                            disabled={
                                                currentPage ===
                                                    Math.ceil(
                                                        fetchData?.length /
                                                            itemsPerPage,
                                                    ) || fetchData?.length === 0
                                            }
                                            style={{
                                                borderRadius: "8px",
                                                color: "#0d6efd",
                                                border: "1px solid #dee2e6",
                                                padding: "6px 12px",
                                                fontSize: "13px",
                                                transition: "all 0.2s ease",
                                                backgroundColor: "white",
                                            }}
                                            onMouseEnter={(e) => {
                                                if (
                                                    currentPage !==
                                                        Math.ceil(
                                                            fetchData?.length /
                                                                itemsPerPage,
                                                        ) &&
                                                    fetchData?.length !== 0
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "#0d6efd";
                                                    e.currentTarget.style.color =
                                                        "white";
                                                    e.currentTarget.style.transform =
                                                        "translateY(-1px)";
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (
                                                    currentPage !==
                                                        Math.ceil(
                                                            fetchData?.length /
                                                                itemsPerPage,
                                                        ) &&
                                                    fetchData?.length !== 0
                                                ) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "white";
                                                    e.currentTarget.style.color =
                                                        "#0d6efd";
                                                    e.currentTarget.style.transform =
                                                        "translateY(0)";
                                                }
                                            }}
                                        >
                                            Dernier
                                            <i className="fas fa-angle-double-right ms-1"></i>
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>

                        {/* Indicateur d'information sur la pagination */}
                        <div className="d-flex justify-content-center align-items-center mt-3">
                            <small className="text-muted">
                                Page {currentPage} sur{" "}
                                {Math.ceil(fetchData?.length / itemsPerPage) ||
                                    1}{" "}
                                • Total : {fetchData?.length || 0} élément(s)
                            </small>
                        </div>
                        {dossierIdSelected && (
                            <ModalBootstrapVisualisation
                                dossierId={dossierIdSelected}
                                onClose={() => setDossierIdSelected(null)}
                            />
                        )}

                        {dossierIdSelected && (
                            <CreditTimeline
                                creditId={dossierIdSelected}
                                onClose={() => setDossierIdSelected(null)}
                            />
                        )}

                        {dossierIdSelected && (
                            <ModalContratPret
                                creditId={dossierIdSelected}
                                onClose={() => setDossierIdSelected(null)}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ValidationC;
