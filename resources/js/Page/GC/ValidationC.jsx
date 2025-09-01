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
            }
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
                "/gestion_credit/pages/dossier-credit/delete/" + id
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

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const renderPagination = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfMaxPagesToShow = Math.floor(maxPagesToShow / 2);
        let startPage, endPage;

        if (totalPages <= maxPagesToShow) {
            startPage = 1;
            endPage = totalPages;
        } else if (currentPage <= halfMaxPagesToShow) {
            startPage = 1;
            endPage = maxPagesToShow;
        } else if (currentPage + halfMaxPagesToShow >= totalPages) {
            startPage = totalPages - maxPagesToShow + 1;
            endPage = totalPages;
        } else {
            startPage = currentPage - halfMaxPagesToShow;
            endPage = currentPage + halfMaxPagesToShow;
        }

        if (startPage > 1) {
            pageNumbers.push(
                <li key={1}>
                    <button onClick={() => handlePageChange(1)}>1</button>
                </li>
            );
            if (startPage > 2) {
                pageNumbers.push(<li key="start-ellipsis">...</li>);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(
                <li key={i} className={i === currentPage ? "active" : ""}>
                    <button
                        style={
                            i === currentPage
                                ? selectedButtonStyle
                                : buttonStyle
                        }
                        onClick={() => handlePageChange(i)}
                    >
                        {i}
                    </button>
                </li>
            );
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pageNumbers.push(<li key="end-ellipsis">...</li>);
            }
            pageNumbers.push(
                <li key={totalPages}>
                    <button onClick={() => handlePageChange(totalPages)}>
                        {totalPages}
                    </button>
                </li>
            );
        }

        return pageNumbers;
    };

    const goToNextPage = () => {
        setCurrentPage((prevPage) =>
            Math.min(
                prevPage + 1,
                Math.ceil(fetchData && fetchData.length / itemsPerPage)
            )
        );
    };

    const goToPrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const paginationStyle = {
        listStyle: "none",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "",
    };

    const buttonStylePrevNext = {
        padding: "2px 20px",
        backgroundColor: "steelblue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 5px",
    };
    const buttonStyle = {
        padding: "1px 5px",
        backgroundColor: "steelblue",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "0 5px",
    };

    const selectedButtonStyle = {
        ...buttonStyle,
        backgroundColor: "#FFC107", // Change color for selected button
    };

    return (
        <>
            <div className="container-fluid" style={{ marginTop: "10px" }}>
                <div className="row">
                    <div className="col-md-12 card rounded-10 p-1">
                        <div
                            style={{
                                background: "teal",
                                borderRadius: "10px",
                                height: "10",
                                padding: "2px",
                                color: "white",
                            }}
                        >
                            <h5 className="text-bold p-1">Validation crédit</h5>
                        </div>{" "}
                    </div>
                </div>

                <div className="row mt-3 card rounded-0 p-3">
                    <div className="col-md-12">
                        <div className="col-md-6 float-end mb-1">
                            <div className="input-group input-group-sm">
                                <select
                                    type="text"
                                    className="input-style"
                                    style={{
                                        width: "auto",
                                        color: "steelblue",
                                    }}
                                    name="type_recherche"
                                    id="type_recherche"
                                    onChange={(e) => {
                                        settype_recherche(e.target.value);
                                    }}
                                    value={type_recherche}
                                >
                                    <option value="">Type de recherche</option>
                                    <option value="AC">Agent crédit</option>

                                    <option value="type_credit">
                                        Type crédit
                                    </option>
                                </select>
                                {type_recherche == "AC" ? (
                                    <select
                                        type="text"
                                        style={{
                                            borderRadius: "0px",
                                        }}
                                        // ref={textInput}
                                        className="form-control font-weight-bold"
                                        name="searchRefOperation"
                                        value={searchRefCredit}
                                        onChange={(e) => {
                                            setsearchRefCredit(e.target.value);
                                        }}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="ALAME KUZANWA WILLY">
                                            ALAME KUZANWA WILLY
                                        </option>
                                        <option value="AKILI SANGARA JULIEN">
                                            AKILI SANGARA JULIEN
                                        </option>
                                        <option value="MAPENDO RUTH">
                                            MAPENDO RUTH
                                        </option>
                                        <option value="LAVIE MATEMBERA">
                                            LAVIE MATEMBERA
                                        </option>
                                        <option value="KANKINSINGI NGADU">
                                            KANKINSINGI NGADU
                                        </option>
                                        <option value="NEEMA MULINGA GRACE">
                                            NEEMA MULINGA GRACE
                                        </option>
                                        <option value="WIVINE ALISA">
                                            WIVINE ALISA
                                        </option>
                                        <option value="MOSES KATEMBO">
                                            MOSES KATEMBO
                                        </option>
                                        <option value="SAFARI KALEKERA">
                                            SAFARI KALEKERA
                                        </option>
                                    </select>
                                ) : type_recherche == "type_credit" ? (
                                    <select
                                        type="text"
                                        style={{
                                            borderRadius: "0px",
                                        }}
                                        // ref={textInput}
                                        className="form-control font-weight-bold"
                                        // placeholder="Rechercher par type crédit"
                                        name="searchRefOperation"
                                        value={searchRefCredit}
                                        onChange={(e) => {
                                            setsearchRefCredit(e.target.value);
                                        }}
                                    >
                                        <option value="">Sélectionnez</option>
                                        <option value="Crédit Express à CT">
                                            Crédit Express à CT
                                        </option>
                                        <option value="Crédits à la consommation à CT">
                                            Crédits à la consommation à CT
                                        </option>
                                        <option value="Crédit aux MPME à CT ">
                                            Crédit aux MPME à CT
                                        </option>
                                        <option value="Crédit Staff à MT ">
                                            Crédit Staff à MT
                                        </option>
                                        <option value="Crédit aux Groupes Solidaires USD ">
                                            Crédit aux Groupes Solidaires USD
                                        </option>
                                        <option value="Crédit Salaire à CT ">
                                            Crédit Salaire à CT
                                        </option>
                                        <option value="Crédit à l'habitat CT ">
                                            Crédit à l'habitat CT
                                        </option>
                                        <option value="Crédits à la consommation à MT ">
                                            Crédits à la consommation à MT
                                        </option>
                                        <option value="Crédit aux MPME à MT ">
                                            Crédit aux MPME à MT
                                        </option>
                                        <option value="Crédit aux MPME à CT en FC  ">
                                            Crédit aux MPME à CT en FC
                                        </option>
                                        <option value="Crédit aux MPME à CT en FC   ">
                                            Crédit aux MPME à CT en FC
                                        </option>
                                        <option value="Crédit aux Groupes Solidaires FC   ">
                                            Crédit aux Groupes Solidaires FC
                                        </option>
                                        <option value="Crédit Agro-Pastoral à CT   ">
                                            Crédit Agro-Pastoral à CT
                                        </option>
                                        <option value="Crédit Agro-Pastoral à CT   ">
                                            Crédit Agro-Pastoral à CT
                                        </option>
                                        <option value="Crédit Agro-Pastoral à CT   ">
                                            Crédit Agro-Pastoral à CT
                                        </option>
                                        <option value="Crédit MWANGAZA   ">
                                            Crédit MWANGAZA
                                        </option>
                                        <option value="Crédit Salaire à MT en FC   ">
                                            Crédit Salaire à MT en FC
                                        </option>
                                        <option value="Crédits JIKO BORA Menage (CT)   ">
                                            Crédits JIKO BORA Menage (CT)
                                        </option>
                                        <option value="Crédits JIKO BORA Grand Cons  (CT)   ">
                                            Crédits JIKO BORA Grand Cons (CT)
                                        </option>
                                        <option value="Crédits TUFAIDIKE WOTE en USD   ">
                                            Crédits TUFAIDIKE WOTE en USD
                                        </option>
                                        <option value="Crédits TUFAIDIKE WOTE en FC   ">
                                            Crédits TUFAIDIKE WOTE en FC
                                        </option>
                                        <option value="Crédit aux salariés domiciliés à MT   ">
                                            Crédit aux salariés domiciliés à MT
                                        </option>
                                        <option value="Crédit aux MPME à MT en FC    ">
                                            Crédit aux MPME à MT en FC
                                        </option>
                                    </select>
                                ) : (
                                    <input
                                        type="text"
                                        style={{
                                            borderRadius: "0px",
                                        }}
                                        // ref={textInput}
                                        className="form-control font-weight-bold"
                                        placeholder="Rechercher..."
                                        name="searchRefOperation"
                                        value={searchRefCredit}
                                        onChange={(e) => {
                                            setsearchRefCredit(e.target.value);
                                        }}
                                    />
                                )}
                                <td>
                                    <button
                                        type="button"
                                        style={{
                                            borderRadius: "0px",
                                            width: "100%",
                                            height: "auto",
                                            fontSize: "12px",
                                        }}
                                        className="btn btn-primary"
                                        onClick={() => {
                                            handleSeachCredit(searchRefCredit);
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
                                </td>{" "}
                            </div>
                        </div>

                        <table className="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>NumCompte</th>
                                    <th>NomCompte</th>
                                    {/* <th>NumDossier</th> */}
                                    <th>Date</th>
                                    <th>Statut</th>
                                    <th
                                        style={{
                                            textAlign: "center",
                                        }}
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {!fetchSearchedCredit && currentItems
                                    ? currentItems.map((credit, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{credit.NumCompte}</td>
                                                  <TruncatedName
                                                      name={credit.NomCompte}
                                                  />
                                                  {/* <td>{credit.NumDossier}</td> */}
                                                  <td>
                                                      {dateParser(
                                                          credit.date_demande
                                                      )}
                                                  </td>
                                                  <td>
                                                      {credit.statutDossier ==
                                                      "Refusé" ? (
                                                          <label
                                                              style={{
                                                                  color: "red",
                                                              }}
                                                              htmlFor=""
                                                          >
                                                              Refusé
                                                          </label>
                                                      ) : credit.statutDossier ==
                                                        "Encours" ? (
                                                          <label
                                                              style={{
                                                                  color: "green",
                                                              }}
                                                              htmlFor=""
                                                          >
                                                              Encours
                                                          </label>
                                                      ) : null}
                                                  </td>
                                                  <td
                                                      style={{
                                                          textAlign: "center",
                                                      }}
                                                  >
                                                      <div
                                                          className="btn-group"
                                                          role="group"
                                                      >
                                                          <button
                                                              type="button"
                                                              className="btn btn-primary"
                                                              data-toggle="modal"
                                                              data-target="#modalVisualisationDossier"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit
                                                                  )
                                                              }
                                                          >
                                                              Visualiser{" "}
                                                              <i className="fas fa-eye"></i>
                                                          </button>

                                                          <button
                                                              type="button"
                                                              className="btn btn-success"
                                                              data-toggle="modal"
                                                              data-target="#modalTimeLine"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit
                                                                  )
                                                              }
                                                          >
                                                              <MdTimeline />
                                                              TimeLine{" "}
                                                              {/* <i className="fas fa-pen"></i> */}
                                                          </button>
                                                          <button
                                                              type="button"
                                                              className="btn btn-danger"
                                                              onClick={() => {
                                                                  handleDeleteCredit(
                                                                      credit.id_credit
                                                                  );
                                                              }}
                                                          >
                                                              Supprimer{" "}
                                                              <i
                                                                  class="fa fa-trash"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </button>
                                                          <button
                                                              type="button"
                                                              className="btn btn-info"
                                                              data-toggle="modal"
                                                              data-target="#modalContratPret"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      credit.id_credit
                                                                  )
                                                              }
                                                          >
                                                              Fichiers{" "}
                                                              <i
                                                                  class="fa fa-file"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          );
                                      })
                                    : fetchSearchedCredit &&
                                      fetchSearchedCredit.map((res, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{res.NumCompte}</td>
                                                  <td>{res.NomCompte}</td>
                                                  {/* <td>{res.NumDossier}</td> */}
                                                  <td>
                                                      {dateParser(
                                                          res.date_demande
                                                      )}
                                                  </td>
                                                  <td>
                                                      {res.statutDossier ==
                                                      "Refusé" ? (
                                                          <label
                                                              style={{
                                                                  color: "red",
                                                              }}
                                                              htmlFor=""
                                                          >
                                                              Refusé
                                                          </label>
                                                      ) : res.statutDossier ==
                                                        "Encours" ? (
                                                          <label
                                                              style={{
                                                                  color: "green",
                                                              }}
                                                              htmlFor=""
                                                          >
                                                              Encours
                                                          </label>
                                                      ) : null}
                                                  </td>
                                                  <td
                                                      style={{
                                                          textAlign: "center",
                                                      }}
                                                  >
                                                      <div
                                                          className="btn-group"
                                                          role="group"
                                                      >
                                                          <button
                                                              type="button"
                                                              className="btn btn-primary"
                                                              data-toggle="modal"
                                                              data-target="#modalVisualisationDossier"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      res.id_credit
                                                                  )
                                                              }
                                                          >
                                                              Visualiser{" "}
                                                              <i className="fas fa-eye"></i>
                                                          </button>
                                                          <button
                                                              type="button"
                                                              className="btn btn-success"
                                                              data-toggle="modal"
                                                              data-target="#modalTimeLine"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      res.id_credit
                                                                  )
                                                              }
                                                          >
                                                              <MdTimeline />
                                                              TimeLine{" "}
                                                              {/* <i className="fas fa-pen"></i> */}
                                                          </button>
                                                          <button
                                                              type="button"
                                                              className="btn btn-danger"
                                                              onClick={() => {
                                                                  handleDeleteCredit(
                                                                      res.id_credit
                                                                  );
                                                              }}
                                                          >
                                                              Supprimer{" "}
                                                              <i
                                                                  class="fa fa-trash"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </button>
                                                          <button
                                                              type="button"
                                                              className="btn btn-info"
                                                              data-toggle="modal"
                                                              data-target="#modalContratPret"
                                                              onClick={() =>
                                                                  setDossierIdSelected(
                                                                      res.id_credit
                                                                  )
                                                              }
                                                          >
                                                              Fichiers{" "}
                                                              <i
                                                                  class="fa fa-file"
                                                                  aria-hidden="true"
                                                              ></i>
                                                          </button>
                                                      </div>
                                                  </td>
                                              </tr>
                                          );
                                      })}
                            </tbody>
                        </table>
                        <div className="h-130 d-flex align-items-center justify-content-center">
                            <ul style={paginationStyle}>
                                <li>
                                    <button
                                        onClick={goToPrevPage}
                                        disabled={currentPage === 1}
                                        style={buttonStylePrevNext}
                                    >
                                        Previous
                                    </button>
                                </li>
                                {renderPagination()}
                                <li>
                                    <button
                                        onClick={goToNextPage}
                                        disabled={
                                            currentPage ===
                                            Math.ceil(
                                                fetchData &&
                                                    fetchData.length /
                                                        itemsPerPage
                                            )
                                        }
                                        style={buttonStylePrevNext}
                                    >
                                        Next
                                    </button>
                                </li>
                            </ul>
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
