//import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect, useRef } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalBootstrapVisualisation from "../Modals/ModalsGC/ModalBootstrapVisualisation";
import "../../styles/style.css";

const ValidationC = () => {
    const inputRef = useRef(null);
    const [loading, setloading] = useState(false);
    const [fetchData, setFetchData] = useState();
    const [searchRefCredit, setsearchRefCredit] = useState();
    const [fetchSearchedCredit, setFetchSearchedCredit] = useState();
    const [dossierIdSelected, setDossierIdSelected] = useState(null);

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
        const res = await axios.get(
            "/montage_credit/page/validation/credit/reference/" + ref
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
                        <div className="col-md-4 float-end mb-1">
                            <div className="input-group input-group-sm">
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
                                    <th>NumDossier</th>
                                    <th>Date</th>
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
                                {!fetchSearchedCredit && fetchData
                                    ? fetchData.map((credit, index) => {
                                          return (
                                              <tr key={index}>
                                                  <td>{credit.NumCompte}</td>
                                                  <td>{credit.NomCompte}</td>
                                                  <td>{credit.NumDossier}</td>
                                                  <td>
                                                      {dateParser(
                                                          credit.date_demande
                                                      )}
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
                                                          >
                                                              Modifier{" "}
                                                              <i className="fas fa-pen"></i>
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
                                                  <td>{res.NumDossier}</td>
                                                  <td>
                                                      {dateParser(
                                                          res.date_demande
                                                      )}
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
                                                          >
                                                              Modifier{" "}
                                                              <i className="fas fa-pen"></i>
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
                                                      </div>
                                                  </td>
                                              </tr>
                                          );
                                      })}
                            </tbody>
                        </table>
                        {dossierIdSelected && (
                            <ModalBootstrapVisualisation
                                dossierId={dossierIdSelected}
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
