import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";

const Visa = () => {
    const [loading, setloading] = useState(false);
    const [error, setError] = useState([]);
    const [searched_account, setsearched_account] = useState();
    const [fetchData, setFetchData] = useState();
    const [fetchData2, setfetchData2] = useState();
    // const [devise, setDevise] = useState("");
    const [Montant, setMontant] = useState(0);
    const [benecifiaire, setBenecifiaire] = useState();
    const [typeDocument, setTypeDocument] = useState();
    const [other_benecifiaire, setother_benecifiaire] = useState();
    // const [numDocument, setnumDocument] = useState();
    const [telephone, setTelephone] = useState();
    const [signature_file, setsignature_file] = useState();
    const [fetchnumDocument, setFetchnumDocument] = useState();
    const [fetchMandataire, setFetchMandataire] = useState();
    const [loadingData, setloadingData] = useState(false);
    const [isLoadingBar, setIsLoadingBar] = useState();
    const [fetchSolde, setFetchSolde] = useState();
    const getSeachedData = async (e) => {
        e.preventDefault();
        setloadingData(true);
        const res = await axios.post("/eco/page/depot-espece/get-account/2", {
            searched_account: searched_account,
        });
        if (res.data.status == 1) {
            setloadingData(false);
            setFetchData(res.data.data);
            setsignature_file(
                res.data.membreSignature
                    ? res.data.membreSignature.signature_image_file
                    : null
            );
            setFetchnumDocument(res.data.numDocument.id);
            setFetchMandataire(res.data.madantairedata);

            console.log(fetchnumDocument);
        } else {
            setloadingData(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };
    const saveOperation = async (e) => {
        e.preventDefault();
        setloading(true);
        setIsLoadingBar(true);
        // alert(other_benecifiaire);
        const res = await axios.post("/eco/page/transaction/positionnement", {
            refCompte: searched_account,
            devise: fetchData2.CodeMonnaie == 1 ? "USD" : "CDF",
            Montant,
            benecifiaire,
            typeDocument,
            numDocument: "DC00" + fetchnumDocument,
            telephone,
            other_benecifiaire,
        });
        if (res.data.status == 1) {
            setloading(false);
            setIsLoadingBar(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
            setMontant("");
            setTelephone("");
            setBenecifiaire("");
            setother_benecifiaire("");
        } else if (res.data.status == 0) {
            setloading(false);
            setIsLoadingBar(false);
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        } else {
            setloading(false);
            setError(res.data.validate_error);
        }
    };

    const getAccountInfo = async (event) => {
        if (event.detail == 2) {
            setloadingData(true);
            const res = await axios.post(
                "/eco/page/depot-espece/get-account/specific",
                {
                    NumCompte: event.target.innerHTML,
                }
            );
            if (res.data.status == 1) {
                setloadingData(false);
                setfetchData2(res.data.data);
                setFetchSolde(res.data.soldeCompte);
                console.log(fetchData2);
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
    let myspinner = {
        margin: "5px auto",
        width: "3rem",
        marginTop: "180px",
        border: "0px",
        height: "200px",
    };
    return (
        <>
            {loadingData ? (
                <div className="row" id="rowspinner">
                    <div className="myspinner" style={myspinner}>
                        <span className="spinner-border" role="status"></span>
                        <span style={{ marginLeft: "-20px" }}>
                            Chargement...
                        </span>
                    </div>
                </div>
            ) : (
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
                                <h5 className="text-bold p-1">Visa</h5>
                            </div>{" "}
                        </div>
                    </div>
                    <div className="row mt-3">
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
                                }}
                            >
                                <div>
                                    <Bars
                                        height="80"
                                        width="80"
                                        color="#4fa94d"
                                        ariaLabel="loading"
                                    />
                                    <h5
                                        style={{
                                            color: "#fff",
                                        }}
                                    >
                                        Patientez...
                                    </h5>
                                </div>
                            </div>
                        )}
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "3px" }}
                        >
                            <form action="">
                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <input
                                                    id="compte_to_search"
                                                    name="compte_to_search"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "80px",
                                                    }}
                                                    onChange={(e) => {
                                                        setsearched_account(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                                <button
                                                    className="btn btn-primary rounded-0"
                                                    style={{
                                                        padding: "2px",
                                                        marginTop: "-5px",
                                                    }}
                                                    onClick={getSeachedData}
                                                >
                                                    Rechercher
                                                </button>
                                            </td>
                                        </tr>
                                        <hr />
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="intituleCompte"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Intitulé de compte
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="intituleCompte"
                                                    name="intituleCompte"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.NomCompte
                                                    }
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="NumCompte"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Numéro de compte
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="NumCompte"
                                                    name="NumCompte"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    disabled
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.NumCompte
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {" "}
                                                <label
                                                    htmlFor="CodeAgence"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Code Agence
                                                </label>
                                            </td>
                                            <td>
                                                {" "}
                                                <input
                                                    id="CodeAgence"
                                                    name="CodeAgence"
                                                    type="text"
                                                    style={{
                                                        padding: "1px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "50px",
                                                    }}
                                                    value={
                                                        fetchData2 &&
                                                        fetchData2.CodeAgence
                                                    }
                                                    disabled
                                                />
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        </div>
                        <div className="col-md-4 card rounded-0 p-3">
                            <p
                                className="text-bold"
                                style={{ color: "steelblue" }}
                            >
                                Listes de comptes
                            </p>
                            <form
                                action=""
                                style={{ overflowX: "scroll", height: "150px" }}
                            >
                                <table className="table">
                                    {fetchData &&
                                        fetchData.map((res, index) => {
                                            return (
                                                <tr
                                                    key={index}
                                                    style={{
                                                        background: "#dcdcdc",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    <td
                                                        style={{
                                                            border: "1px solid #fff",
                                                            cursor: "pointer",
                                                        }}
                                                        onClick={(event) =>
                                                            getAccountInfo(
                                                                event
                                                            )
                                                        }
                                                    >
                                                        {res.NumCompte}
                                                    </td>
                                                    <td
                                                        style={{
                                                            border: "1px solid #fff",
                                                        }}
                                                    >
                                                        {res.CodeMonnaie == 1
                                                            ? "USD"
                                                            : "CDF"}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    <tr>
                                        {/* <td>
                                    <button className="btn btn-primary rounded-0">
                                        Afficher le solde
                                    </button>
                                </td> */}
                                    </tr>
                                </table>
                            </form>
                        </div>
                        {fetchSolde && (
                            <div className="col-md-3 card rounded-0 p-3">
                                <p
                                    className="text-bold"
                                    style={{ color: "steelblue" }}
                                >
                                    Solde compte
                                </p>
                                <form
                                    action=""
                                    style={{
                                        overflowX: "scroll",
                                        height: "150px",
                                    }}
                                >
                                    <table className="table">
                                        <tr>
                                            <td>
                                                <h4>
                                                    <strong>
                                                        {" "}
                                                        {fetchData2 &&
                                                        fetchData2.CodeMonnaie ==
                                                            1
                                                            ? "USD "
                                                            : "CDF "}
                                                        {fetchSolde.soldeMembre.toFixed(
                                                            2
                                                        )}{" "}
                                                    </strong>
                                                </h4>
                                            </td>
                                        </tr>
                                    </table>
                                </form>
                            </div>
                        )}
                    </div>
                    <p
                        className="border border-10"
                        style={{
                            background: "#dcdcdc",
                            padding: "1px",
                        }}
                    ></p>
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
                                        <p>Informations</p>
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
                                                        // onChange={(e) => {
                                                        //     setDevise(e.target.value);
                                                        // }}

                                                        disabled
                                                    >
                                                        <option
                                                            value={
                                                                fetchData2 &&
                                                                fetchData2.CodeMonnaie ==
                                                                    1
                                                                    ? "USD"
                                                                    : "CDF"
                                                            }
                                                        >
                                                            {fetchData2 &&
                                                            fetchData2.CodeMonnaie ==
                                                                1
                                                                ? "USD"
                                                                : "CDF"}
                                                        </option>
                                                        {/* <option value="USD">USD</option> */}
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
                                                    <input
                                                        id="Montant"
                                                        name="Montant"
                                                        type="text"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${
                                                                error.Montant
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                            width: "70px",
                                                        }}
                                                        onChange={(e) =>
                                                            setMontant(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={Montant}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="typeDocument"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Type document
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <select
                                                        id="typeDocument"
                                                        name="typeDocument"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${
                                                                error.typeDocument
                                                                    ? "1px solid red"
                                                                    : "1px solid #dcdcdc"
                                                            }`,
                                                            marginBottom: "5px",
                                                        }}
                                                        onChange={(e) => {
                                                            setTypeDocument(
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Séléctionnez
                                                        </option>
                                                        <option value="Visa de retrait">
                                                            Visa de retrait
                                                        </option>
                                                        <option value="Bon de depense">
                                                            Bon de dépense
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="numDocument"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Num document
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="numDocument"
                                                        name="numDocument"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "70px",
                                                        }}
                                                        // onChange={(e) => {
                                                        //     setnumDocument(
                                                        //         e.target.value
                                                        //     );
                                                        // }}
                                                        disabled
                                                        value={
                                                            fetchnumDocument
                                                                ? "DC00" +
                                                                  fetchnumDocument
                                                                : ""
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="beneficiaire"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Bénéficiaire
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <select
                                                        id="benecifiaire"
                                                        name="benecifiaire"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                        }}
                                                        onChange={(e) => {
                                                            setBenecifiaire(
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option value="">
                                                            Séléctionnez
                                                        </option>
                                                        {fetchMandataire &&
                                                            fetchMandataire.map(
                                                                (res) => {
                                                                    return (
                                                                        <>
                                                                            <option
                                                                                value={
                                                                                    res.mendataireName
                                                                                }
                                                                            >
                                                                                {
                                                                                    res.mendataireName
                                                                                }
                                                                            </option>
                                                                        </>
                                                                    );
                                                                }
                                                            )}
                                                        <option value="autre">
                                                            Autre
                                                        </option>
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr>
                                                {benecifiaire == "autre" ? (
                                                    <>
                                                        <td>
                                                            {" "}
                                                            <label
                                                                htmlFor="other_benecifiaire"
                                                                style={{
                                                                    padding:
                                                                        "2px",
                                                                    color: "green",
                                                                }}
                                                            >
                                                                Nom bénéficiaire
                                                            </label>
                                                        </td>
                                                        <td>
                                                            <input
                                                                type="text"
                                                                id="other_benecifiaire"
                                                                name="other_benecifiaire"
                                                                style={{
                                                                    padding:
                                                                        "1px ",
                                                                    border: `${"2px solid green"}`,
                                                                    marginBottom:
                                                                        "5px",
                                                                    width: "150px",
                                                                    marginLeft:
                                                                        "2px",
                                                                }}
                                                                placeholder="Nom du bénéficiaire"
                                                                onChange={(
                                                                    e
                                                                ) => {
                                                                    setother_benecifiaire(
                                                                        e.target
                                                                            .value
                                                                    ).toUpperCase();
                                                                }}
                                                            />
                                                        </td>
                                                    </>
                                                ) : null}
                                            </tr>
                                            <tr>
                                                <td>
                                                    {" "}
                                                    <label
                                                        htmlFor="telephone"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Téléphone
                                                    </label>
                                                </td>
                                                <td>
                                                    {" "}
                                                    <input
                                                        type="text"
                                                        id="telephone"
                                                        name="telephone"
                                                        style={{
                                                            padding: "1px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "100px",
                                                        }}
                                                        onChange={(e) => {
                                                            setTelephone(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={telephone}
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </fieldset>
                            </form>
                        </div>

                        <div className="col-md-3 card rounded-0 p-3">
                            <form action="">
                                <table>
                                    <tr>
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
                                                            : " fas fa-check"
                                                    }`}
                                                ></i>
                                                Valider
                                            </button>
                                        </td>
                                    </tr>
                                </table>
                            </form>
                        </div>
                        <div
                            className="col-md-4 card rounded-0 p-3"
                            style={{ marginRight: "2px" }}
                        >
                            {signature_file ? (
                                <form action="">
                                    <p className="text-bold">
                                        Photo et signature
                                    </p>
                                    <table>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <iframe
                                                        src={`uploads/membres/signatures/files/${signature_file}`}
                                                        style={{
                                                            width: "140%",
                                                            height: "200px",
                                                        }}
                                                    >
                                                        {" "}
                                                    </iframe>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <br />{" "}
                                </form>
                            ) : null}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Visa;
