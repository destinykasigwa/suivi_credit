// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import { useNavigate } from "react-router-dom";

const EntreeT = () => {
    const [loading, setloading] = useState(false);
    const [devise, setDevise] = useState("CDF");
    const [getData, setGetdata] = useState();
    const [fetchInfo, setFetchInfo] = useState();
    const [fetchInfo2, setFetchInfo2] = useState();

    useEffect(() => {
        GetInformation();
    }, []);

    const GetInformation = async () => {
        const res = await axios.get(
            "/eco/page/entreT/get-billetage-caissier/delested"
        );
        if (res.data.status == 1) {
            setGetdata(res.data.data);
            setFetchInfo(res.data.billetageUSD);
            setFetchInfo2(res.data.billetageCDF);
            console.log(getData[0].centDollars);
        }
    };

    // const saveOperation = async (e) => {
    //     e.preventDefault();
    // };

    const SaveDelestageUSD = async (id) => {
        const question = confirm(
            "Voulez vous vraiment confirmer ce delestage ?"
        );
        if (question == true) {
            const res = await axios.post("/eco/page/accept-delestage-usd", {
                refDelestage: id,
            });
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Succès",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const SaveDelestageCDF = async (id) => {
        const question = confirm(
            "Voulez vous vraiment confirmer ce delestage ?"
        );
        if (question == true) {
            const res = await axios.post("/eco/page/accept-delestage-cdf", {
                refDelestage: id,
            });
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Succès",
                    text: res.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            } else {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    const CuncelDelestageCDF = async (id) => {
        const question = confirm("Etes vous sûr de supprimer ce delestage ?");
        if (question == true) {
            const res = await axios.get(
                "/eco/page/delestage/remove-item-cdf/" + id
            );
            if (res.data.status == 1) {
                window.location.reload();
            }
        }
    };
    const CuncelDelestageUSD = async (id) => {
        const question = confirm("Etes vous sûr de supprimer ce delestage ?");
        if (question == true) {
            const res = await axios.get(
                "/eco/page/delestage/remove-item-usd/" + id
            );
            if (res.data.status == 1) {
                window.location.reload();
            }
        }
    };

    function numberWithSpaces(x) {
        if (x === null || x === undefined) {
            return "0.00"; // ou une autre valeur par défaut appropriée
        }
        var parts = x.toString().split(".");
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
        return parts.join(".");
    }
    let compteur = 1;
    let compteur2 = 1;
    return (
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
                        <h5 className="text-bold p-1">Entrée Trésor</h5>
                    </div>{" "}
                </div>
            </div>
            <div className="row mt-3">
                <div
                    className="col-md-4 card rounded-0 p-3"
                    style={{ marginRight: "3px" }}
                >
                    <form action="">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        {" "}
                                        <label
                                            htmlFor="Devise"
                                            style={{
                                                padding: "2px",
                                                color: "steelblue",
                                            }}
                                        >
                                            Devise
                                        </label>
                                    </td>
                                    <td>
                                        {" "}
                                        <select
                                            id="devise"
                                            name="devise"
                                            style={{
                                                padding: "1px ",
                                                border: `${"1px solid #dcdcdc"}`,
                                                marginBottom: "5px",
                                            }}
                                            onChange={(e) => {
                                                setDevise(e.target.value);
                                            }}
                                        >
                                            <option value="CDF">CDF</option>
                                            <option value="USD">USD</option>
                                        </select>
                                    </td>
                                </tr>
                                <hr />
                            </tbody>
                        </table>
                    </form>
                </div>
            </div>

            <div className="row">
                <div
                    className="col-md-4 card rounded-0 p-3"
                    style={{ marginRight: "2px" }}
                >
                    <form action="">
                        <p className="text-bold">BILLETAGE DISPONIBLE</p>
                        {devise == "USD"
                            ? fetchInfo && (
                                  <table
                                      className="table-dark"
                                      style={{
                                          padding: "10px",
                                          border: "1px solid #dcdcdc",
                                          width: "100%",
                                      }}
                                  >
                                      <thead
                                          style={{
                                              border: "1px solid #dcdcdc",
                                              padding: "3px solid",
                                          }}
                                      >
                                          <tr>
                                              <th
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  Coupure
                                              </th>
                                              <th>Nbr Billets</th>
                                              <th>Montant</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  100 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.centDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.centDollars *
                                                          100
                                                  )}
                                              </td>
                                          </tr>
                                          <tr>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  50 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {" "}
                                                  {parseInt(
                                                      fetchInfo.cinquanteDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.cinquanteDollars *
                                                          50
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  20 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.vightDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.vightDollars *
                                                          20
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  10 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.dixDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.dixDollars * 10
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  5 X{" "}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.cinqDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.cinqDollars * 5
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  1 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.unDollars
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo.unDollars * 1
                                                  )}
                                              </td>
                                          </tr>
                                      </tbody>
                                      <tfoot>
                                          <th></th>
                                          <th></th>
                                          <th
                                              style={{
                                                  padding: "5px",
                                                  background: "green",
                                              }}
                                          >
                                              {fetchInfo.montantUSD !==
                                                  undefined &&
                                                  numberWithSpaces(
                                                      parseInt(
                                                          fetchInfo.montantUSD
                                                      )
                                                  )}
                                          </th>
                                      </tfoot>
                                  </table>
                              )
                            : fetchInfo2 && (
                                  <table
                                      className="table-dark"
                                      style={{
                                          padding: "10px",
                                          border: "1px solid #dcdcdc",
                                          width: "100%",
                                      }}
                                  >
                                      <thead
                                          style={{
                                              border: "1px solid #dcdcdc",
                                              padding: "3px solid",
                                          }}
                                      >
                                          <tr>
                                              <th
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  Coupure
                                              </th>
                                              <th>Nbr Billets</th>
                                              <th>Montant</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  20 000 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.vightMilleFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.vightMilleFranc *
                                                          20000
                                                  )}
                                              </td>
                                          </tr>
                                          <tr>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  10 000 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.dixMilleFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.dixMilleFranc *
                                                          10000
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  5 000 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinqMilleFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinqMilleFranc *
                                                          5000
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  1 000 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.milleFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.milleFranc *
                                                          1000
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  500 X{" "}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinqCentFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinqCentFranc *
                                                          500
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  200 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.deuxCentFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.deuxCentFranc *
                                                          200
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  100 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.centFranc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.centFranc * 100
                                                  )}
                                              </td>
                                          </tr>
                                          <tr
                                              style={{
                                                  border: "1px solid #dcdcdc",
                                                  padding: "2px",
                                              }}
                                          >
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  50 X
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinquanteFanc
                                                  )}
                                              </td>
                                              <td
                                                  style={{
                                                      padding: "2px",
                                                  }}
                                              >
                                                  {parseInt(
                                                      fetchInfo2.cinquanteFanc *
                                                          50
                                                  )}
                                              </td>
                                          </tr>
                                      </tbody>
                                      <tfoot>
                                          <th></th>
                                          <th></th>
                                          <th
                                              style={{
                                                  padding: "5px",
                                                  background: "green",
                                              }}
                                          >
                                              {fetchInfo2.montantCDF !==
                                                  undefined &&
                                                  numberWithSpaces(
                                                      parseInt(
                                                          fetchInfo2.montantCDF
                                                      )
                                                  )}
                                          </th>
                                      </tfoot>
                                  </table>
                              )}
                    </form>
                </div>
                <div className="col-md-5 card rounded-0 p-3">
                    {getData !== undefined ? (
                        <>
                            <h4>DELESTAGE EN CDF</h4>
                            <table
                                className="table-dark"
                                style={{
                                    padding: "10px",
                                    border: "1px solid #dcdcdc",
                                    width: "100%",
                                }}
                            >
                                <thead
                                    style={{
                                        border: "1px solid #dcdcdc",
                                        padding: "3px solid",
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                padding: "2px",
                                            }}
                                        >
                                            Num
                                        </th>
                                        <th>Nom caissier</th>
                                        <th>Montant</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getData !== undefined &&
                                        getData.map((res, index) => {
                                            return (
                                                res.montantCDF > 0 && (
                                                    <tr
                                                        style={{
                                                            border: "1px solid #dcdcdc",
                                                            padding: "2px",
                                                        }}
                                                        key={index}
                                                    >
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {compteur++}
                                                        </td>
                                                        <td>
                                                            {res.NomDemandeur}
                                                        </td>
                                                        <td>
                                                            {res.montantCDF}
                                                        </td>
                                                        <td>
                                                            <div
                                                                class="btn-group"
                                                                role="group"
                                                                aria-label="Basic example"
                                                            >
                                                                {" "}
                                                                <button
                                                                    className="btn btn-primary rounded-0"
                                                                    id="validerbtn"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        SaveDelestageCDF(
                                                                            res.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        className={`${" fas fa-check-circle"}`}
                                                                    ></i>
                                                                    Délester
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger rounded-0"
                                                                    id="validerbtn"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        CuncelDelestageCDF(
                                                                            res.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        className={`${" fas fa-info-circle"}`}
                                                                    ></i>
                                                                    Réjeter
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            );
                                        })}
                                </tbody>
                            </table>
                        </>
                    ) : null}
                    {getData !== undefined ? (
                        <>
                            <h4>DELESTAGE EN USD</h4>
                            <table
                                className="table-dark"
                                style={{
                                    padding: "10px",
                                    border: "1px solid #dcdcdc",
                                    width: "100%",
                                }}
                            >
                                <thead
                                    style={{
                                        border: "1px solid #dcdcdc",
                                        padding: "3px solid",
                                    }}
                                >
                                    <tr>
                                        <th
                                            style={{
                                                padding: "2px",
                                            }}
                                        >
                                            Num
                                        </th>
                                        <th>Nom caissier</th>
                                        <th>Montant</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getData !== undefined &&
                                        getData.map((res, index) => {
                                            return (
                                                res.montantUSD > 0 && (
                                                    <tr
                                                        style={{
                                                            border: "1px solid #dcdcdc",
                                                            padding: "2px",
                                                        }}
                                                        key={index}
                                                    >
                                                        <td
                                                            style={{
                                                                padding: "2px",
                                                            }}
                                                        >
                                                            {compteur2++}
                                                        </td>
                                                        <td>
                                                            {res.NomDemandeur}
                                                        </td>
                                                        <td>
                                                            {res.montantUSD}
                                                        </td>
                                                        <td>
                                                            {" "}
                                                            <div
                                                                class="btn-group"
                                                                role="group"
                                                                aria-label="Basic example"
                                                            >
                                                                {" "}
                                                                <button
                                                                    className="btn btn-primary rounded-0"
                                                                    id="validerbtn"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        SaveDelestageUSD(
                                                                            res.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        className={`${" fas fa-check-circle"}`}
                                                                    ></i>
                                                                    Délester
                                                                </button>
                                                                <button
                                                                    className="btn btn-danger rounded-0"
                                                                    id="validerbtn"
                                                                    type="button"
                                                                    onClick={() => {
                                                                        CuncelDelestageUSD(
                                                                            res.id
                                                                        );
                                                                    }}
                                                                >
                                                                    <i
                                                                        className={`${" fas fa-info-circle"}`}
                                                                    ></i>
                                                                    Réjeter
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            );
                                        })}
                                </tbody>
                            </table>
                        </>
                    ) : null}
                    {/* {getData !== undefined || getData !== undefined ? (
                        <table>
                            <tr>
                                <td></td>
                                <td>
                                  
                                </td>
                            </tr>
                        </table>
                    ) : null} */}
                </div>
            </div>
        </div>
    );
};

export default EntreeT;
