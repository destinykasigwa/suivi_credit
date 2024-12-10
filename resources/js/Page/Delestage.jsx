import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import RecuApproUSD from "./Modals/RecuApproUSD";
import RecuApproCDF from "./Modals/RecuApproCDF";
import RecuDelestageUSD from "./Modals/RecuDelestageUSD";
import RecuDelestageCDF from "./Modals/RecuDelestageCDF";

const Delestage = () => {
    const [loading, setloading] = useState(false);
    const [Montant, setMontant] = useState(0);
    const [devise, setDevise] = useState("CDF");
    const [getBilletageCDF, setGetBilletageCDF] = useState();
    const [getBilletageUSD, setGetBilletageUSD] = useState();
    const [fetchInfo, setFetchInfo] = useState(false);
    const [getCaissierName, setGetCaissierName] = useState();
    const [fetchDailyOperationCDF, setFetchDailyOperationCDF] = useState();
    const [fetchDailyOperationUSD, setFetchDailyOperationUSD] = useState();
    const [selectedData, setSelectedData] = useState(null);

    useEffect(() => {
        getLastestOperation();
    }, []);
    const getLastestOperation = async () => {
        const res = await axios.get(
            "/eco/pages/delestage/get-daily-operations"
        );
        if (res.data.status == 1) {
            setFetchDailyOperationCDF(res.data.dataCDF);
            setFetchDailyOperationUSD(res.data.dataUSD);
        }
        console.log(fetchDailyOperationCDF);
    };

    const saveOperation = (e) => {
        e.preventDefault();
        setloading(true);
        Swal.fire({
            title: "Confirmation !",
            text: "Etes vous sûr d'effectuer ce délestage ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui Délester!",
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    "Confirmation!",
                    "Votre délestage est effectué avec succès.",
                    "success"
                ).then(function () {
                    setloading(false);
                    const res = axios.post("/eco/page/delestage/validation", {
                        devise: devise,
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
                        setloading(false);
                        Swal.fire({
                            title: "Erreur",
                            text: res.data.msg,
                            icon: "error",
                            timer: 8000,
                            confirmButtonText: "Okay",
                        });
                    }
                });
            } else {
                setloading(false);
            }
        });
    };

    useEffect(() => {
        GetInformation();
    }, []);

    const GetInformation = async () => {
        const res = await axios.get(
            "/eco/page/delestage/get-billetage-caissier"
        );
        if (res.data.status == 1) {
            setGetBilletageCDF(res.data.billetageCDF[0]);
            setGetBilletageUSD(res.data.billetageUSD[0]);

            setFetchInfo(true);
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

    const handlePrintClick = (data) => {
        setSelectedData(data);
    };

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
                        <h5 className="text-bold p-1">Délestage</h5>
                    </div>{" "}
                </div>
            </div>
            {fetchInfo && (
                <div className="row">
                    <div
                        className="col-md-4 card rounded-0 p-1"
                        style={{ marginRight: "3px" }}
                    >
                        <form action="">
                            <fieldset>
                                <legend
                                    style={{
                                        border: "2px solid:#dcdcdc !important",
                                    }}
                                >
                                    {/* <p>Informations</p> */}
                                </legend>
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
                                                        setDevise(
                                                            e.target.value
                                                        );
                                                    }}
                                                >
                                                    <option value="CDF">
                                                        CDF
                                                    </option>
                                                    <option value="USD">
                                                        USD
                                                    </option>
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="Montant"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Montant
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                {devise == "USD" ? (
                                                    <input
                                                        id="Montant"
                                                        name="Montant"
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "70px",
                                                            color: "white",
                                                            background: "black",
                                                            fontWeight: "bold",
                                                            fontSize: "20px",
                                                        }}
                                                        onChange={(e) =>
                                                            setMontant(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            getBilletageUSD &&
                                                            numberWithSpaces(
                                                                getBilletageUSD.sommeMontantUSD
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                ) : (
                                                    <input
                                                        id="Montant"
                                                        name="Montant"
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "100px",
                                                            color: "white",
                                                            background: "black",

                                                            fontWeight: "bold",
                                                            fontSize: "20px",
                                                        }}
                                                        onChange={(e) =>
                                                            setMontant(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            getBilletageCDF &&
                                                            numberWithSpaces(
                                                                getBilletageCDF.sommeMontantCDF
                                                            )
                                                        }
                                                        disabled
                                                    />
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </fieldset>
                        </form>
                    </div>

                    {/* <div className="col-md-3 card rounded-0 p-3">
                    <form action="">
                        <table>
                          
                        </table>
                    </form>
                </div> */}
                    <div
                        className="col-md-4 card rounded-0 p-3"
                        style={{ marginRight: "2px" }}
                    >
                        <form action="">
                            <p className="text-bold">BILLETAGE DISPONIBLE</p>
                            {devise == "USD"
                                ? getBilletageUSD && (
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
                                                          getBilletageUSD.centDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.centDollars *
                                                              100
                                                      )}
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      50 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {" "}
                                                      {parseInt(
                                                          getBilletageUSD.cinquanteDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.cinquanteDollars *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      20 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.vightDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.vightDollars *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      10 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.dixDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.dixDollars *
                                                              10
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      5 X{" "}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.cinqDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.cinqDollars *
                                                              5
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      1 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.unDollars
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageUSD.unDollars *
                                                              1
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
                                                  {getBilletageUSD.sommeMontantUSD !==
                                                      undefined &&
                                                      numberWithSpaces(
                                                          parseInt(
                                                              getBilletageUSD.sommeMontantUSD
                                                          )
                                                      )}
                                              </th>
                                          </tfoot>
                                      </table>
                                  )
                                : getBilletageCDF && (
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
                                                          getBilletageCDF.vightMilleFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{
                                                          padding: "2px",
                                                      }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.vightMilleFranc *
                                                              20000
                                                      )}
                                                  </td>
                                              </tr>
                                              <tr>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      10 000 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.dixMilleFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.dixMilleFranc *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      5 000 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinqMilleFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinqMilleFranc *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      1 000 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.milleFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.milleFranc *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      500 X{" "}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinqCentFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinqCentFranc *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      200 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.deuxCentFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.deuxCentFranc *
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      100 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.centFranc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.centFranc *
                                                              100
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
                                                      style={{ padding: "2px" }}
                                                  >
                                                      50 X
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinquanteFanc
                                                      )}
                                                  </td>
                                                  <td
                                                      style={{ padding: "2px" }}
                                                  >
                                                      {parseInt(
                                                          getBilletageCDF.cinquanteFanc *
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
                                                  {getBilletageCDF.sommeMontantCDF !==
                                                      undefined &&
                                                      numberWithSpaces(
                                                          parseInt(
                                                              getBilletageCDF.sommeMontantCDF
                                                          )
                                                      )}
                                              </th>
                                          </tfoot>
                                      </table>
                                  )}
                        </form>
                    </div>
                    <div className="col-md-3 card rounded-0 p-3">
                        {getBilletageCDF !== undefined ||
                        getBilletageUSD !== undefined ? (
                            <table>
                                <tr>
                                    <td></td>
                                    <td>
                                        <button
                                            className="btn btn-primary rounded-10"
                                            id="validerbtn"
                                            onClick={saveOperation}
                                        >
                                            <i
                                                className={`${
                                                    loading
                                                        ? "spinner-border spinner-border-sm"
                                                        : " fas fa-check-circle"
                                                }`}
                                            ></i>
                                            Délester
                                        </button>
                                    </td>
                                </tr>
                            </table>
                        ) : null}
                    </div>

                    <div
                        className="col-md-6"
                        style={{ overflowX: "scroll", height: "500px" }}
                    >
                        {fetchDailyOperationCDF &&
                            fetchDailyOperationCDF.length > 0 && (
                                <>
                                    <p>
                                        <h4>Délestages recents</h4>
                                    </p>
                                    <br />
                                    <h3
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                            background: "#fff",
                                            padding: "2px",
                                        }}
                                    >
                                        CDF
                                    </h3>
                                </>
                            )}

                        {fetchDailyOperationCDF &&
                            fetchDailyOperationCDF.length > 0 && (
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Réference</th>
                                            <th>Montant</th>
                                            <th>Caissier</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchDailyOperationCDF &&
                                            fetchDailyOperationCDF.map(
                                                (res, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {res.Reference}
                                                            </td>
                                                            <td>
                                                                {res.montantCDF}
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.NomUtilisateur
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        handlePrintClick(
                                                                            res
                                                                        )
                                                                    }
                                                                    data-toggle="modal"
                                                                    data-target="#modal-delestage-cdf"
                                                                    className="btn btn-primary rounded-10"
                                                                >
                                                                    Imprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                    {selectedData && (
                                        <RecuDelestageCDF data={selectedData} />
                                    )}
                                </table>
                            )}

                        <br />
                        {fetchDailyOperationUSD &&
                            fetchDailyOperationUSD.length > 0 && (
                                <>
                                    <h3
                                        style={{
                                            color: "steelblue",
                                            fontWeight: "bold",
                                            background: "#fff",
                                            padding: "2px",
                                        }}
                                    >
                                        {" "}
                                        USD
                                    </h3>
                                </>
                            )}

                        {fetchDailyOperationUSD &&
                            fetchDailyOperationUSD.length > 0 && (
                                <table className="table table-bordered table-striped">
                                    <thead>
                                        <tr>
                                            <th>Réference</th>
                                            <th>Montant</th>
                                            <th>Caissier</th>
                                            <th>Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {fetchDailyOperationUSD &&
                                            fetchDailyOperationUSD.map(
                                                (res, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>
                                                                {res.Reference}
                                                            </td>
                                                            <td>
                                                                {res.montantUSD}
                                                            </td>
                                                            <td>
                                                                {
                                                                    res.NomUtilisateur
                                                                }
                                                            </td>
                                                            <td>
                                                                <button
                                                                    onClick={() =>
                                                                        handlePrintClick(
                                                                            res
                                                                        )
                                                                    }
                                                                    data-toggle="modal"
                                                                    data-target="#modal-delestage-usd"
                                                                    className="btn btn-primary rounded-10"
                                                                >
                                                                    Imprimer
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                }
                                            )}
                                    </tbody>
                                    {selectedData && (
                                        <RecuDelestageUSD data={selectedData} />
                                    )}
                                </table>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Delestage;
