// import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Bars } from "react-loader-spinner";
import { Circles } from "react-loader-spinner";
// import { useNavigate } from "react-router-dom";

const Cloture = () => {
    const [disabled, setdisabled] = useState(false);
    const [isloading, setisloading] = useState(true);
    const [loading, setloading] = useState(false);
    const [showDateContainer, setshowDateContainer] = useState(false);
    const [dateWork, setDateWork] = useState("");
    const [Taux, setTaux] = useState();
    const [usd, setusd] = useState(1);
    const [todayDate, settodayDate] = useState(new Date());
    const [isClosing, setisClosing] = useState(false);
    // const [tomorrow, setTomorrow] = useState("");
    useEffect(() => {
        setTimeout(() => {
            setisloading(false);
        }, 1000);
        const today = new Date();
        today.setDate(today.getDate() + 1); // Ajoute un jour à la date d'aujourd'hui

        const dd = String(today.getDate()).padStart(2, "0");
        const mm = String(today.getMonth() + 1).padStart(2, "0"); // Les mois commencent à 0
        const yyyy = today.getFullYear();

        const formattedDate = `${yyyy}-${mm}-${dd}`; // Format 'yyyy-mm-dd' pour l'input type="date"
        setDateWork(formattedDate);
    }, []);

    //PERMET DE POSTER
    const clotureBtn = async (e) => {
        setisClosing(true);
        e.preventDefault();
        const res = await axios.get("/eco/pages/cloture/journee");
        if (res.data.status == 1) {
            setdisabled(true);
            setisClosing(false);
            setshowDateContainer(true);
            Swal.fire({
                title: "Clôture de la journée",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else {
            Swal.fire({
                title: "Clôture de la journée",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    const OpenDayBtn = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/pages/cloture/openday/data", {});
        if (res.data.status == 1) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
            document
                .getElementById("OpendayBtn")
                .setAttribute("disabled", "disabled");
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };
    //DEFINI LA DATE DU SYSTEME
    const definirDate = async (e) => {
        e.preventDefault();
        console.log(dateWork);
        const res = await axios.post("/eco/pages/datesystem/definir", {
            dateWork,
            usd,
            Taux,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "success",
                button: "OK!",
            });
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Date système",
                text: res.data.msg,
                icon: "error",
                button: "OK!",
            });
        }
    };

    const dateParser = (num) => {
        const options = {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        };

        let timestamp = Date.parse(num);

        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

        return date.toString();
    };
    //STEND FOR REFRESHING PAGE
    const actualiser = () => {
        location.reload();
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
                            <h5 className="text-bold p-1">
                                Clotûre de la journée
                            </h5>
                        </div>{" "}
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12 card">
                        <div className="card card-default">
                            <div
                                className="card-header"
                                style={{
                                    background: "#DCDCDC",
                                    textAlign: "center",
                                    color: "#fff",
                                    marginTop: "5px",
                                }}
                            >
                                <button
                                    style={{
                                        height: "30px",
                                        float: "right",
                                        background: "green",
                                        border: "0px",
                                        padding: "3px",
                                        marginLeft: "5px",
                                    }}
                                    onClick={actualiser}
                                >
                                    <i className="fas fa-sync"></i> Actualiser{" "}
                                </button>
                            </div>

                            <div
                                className="card-body"
                                style={{ background: "#dcdcdc" }}
                            >
                                <div
                                    className="row"
                                    style={{
                                        padding: "10px",
                                        border: "2px solid #fff",
                                    }}
                                >
                                    <div className="col-lg-6">
                                        <div className="card card-default">
                                            <div
                                                className="card-header"
                                                style={{
                                                    background: "#dcdcdc",
                                                    textAlign: "center",
                                                    color: "#000",
                                                }}
                                            >
                                                <h3 className="card-title">
                                                    <b>CLOTURE DE LA JOURNEE</b>
                                                </h3>
                                                <button
                                                    style={{
                                                        height: "30px",
                                                        float: "right",
                                                        marginLeft: "20px",
                                                        background: "green",
                                                        border: "0px",
                                                        padding: "3px",
                                                    }}
                                                    onClick={() =>
                                                        setshowDateContainer(
                                                            true
                                                        )
                                                    }
                                                >
                                                    Date{" "}
                                                    <i className="fas fa-calendar"></i>{" "}
                                                </button>
                                                <button
                                                    style={{
                                                        height: "30px",
                                                        float: "right",
                                                        marginLeft: "20px",
                                                        background: "green",
                                                        border: "0px",
                                                        padding: "3px",
                                                    }}
                                                    onClick={actualiser}
                                                >
                                                    <i className="fas fa-sync"></i>{" "}
                                                    Actualiser{" "}
                                                </button>
                                            </div>

                                            <div
                                                className="card-body h-200"
                                                style={{
                                                    background: "#dcdcdc",
                                                }}
                                            >
                                                <form>
                                                    {isClosing && (
                                                        <div
                                                            style={{
                                                                position:
                                                                    "fixed",
                                                                top: 0,
                                                                left: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                display: "flex",
                                                                justifyContent:
                                                                    "center",
                                                                alignItems:
                                                                    "center",
                                                                backgroundColor:
                                                                    "rgba(0, 0, 0, 0.5)",
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
                                                    <table>
                                                        <tr>
                                                            <td>
                                                                {disabled ? (
                                                                    <button
                                                                        style={{
                                                                            padding:
                                                                                "6px",
                                                                            color: "#fff",
                                                                            fontWeight:
                                                                                "bold",
                                                                            background:
                                                                                "steelblue",
                                                                            border: "0px",
                                                                            height: "40px",
                                                                        }}
                                                                        type="text"
                                                                        id="btnClose"
                                                                        className="btn disabled"
                                                                    >
                                                                        <i className="fas fa-check"></i>{" "}
                                                                        Clôturer
                                                                        la
                                                                        journée
                                                                        {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        style={{
                                                                            padding:
                                                                                "6px",
                                                                            color: "#fff",
                                                                            fontWeight:
                                                                                "bold",
                                                                            background:
                                                                                "steelblue",
                                                                            border: "0px",
                                                                            height: "40px",
                                                                        }}
                                                                        // disabled
                                                                        type="text"
                                                                        id="btnClose"
                                                                        className="btn "
                                                                        onClick={
                                                                            clotureBtn
                                                                        }
                                                                    >
                                                                        <i className="fas fa-check"></i>{" "}
                                                                        Clôturer
                                                                        la
                                                                        journée
                                                                        {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td>
                                                                <button
                                                                    style={{
                                                                        padding:
                                                                            "6px",
                                                                        color: "#fff",
                                                                        fontWeight:
                                                                            "bold",

                                                                        border: "0px",
                                                                        height: "40px",
                                                                        marginTop:
                                                                            "10px",
                                                                    }}
                                                                    type="text"
                                                                    id="OpendayBtn"
                                                                    className="btn btn-success"
                                                                    onClick={
                                                                        OpenDayBtn
                                                                    }
                                                                >
                                                                    <i className="fas fa-check"></i>{" "}
                                                                    Ouvrir la
                                                                    journée
                                                                    {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </table>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    {showDateContainer && (
                                        <div className="col-lg-6">
                                            <div className="card card-default">
                                                <div
                                                    className="card-header"
                                                    style={{
                                                        background: "#dcdcdc",
                                                        textAlign: "center",
                                                        color: "#000",
                                                    }}
                                                >
                                                    <h3 className="card-title">
                                                        <b>
                                                            OUVETURE JOURNEE
                                                            PROCHAINE DATE N + 1
                                                        </b>
                                                    </h3>
                                                </div>

                                                <div
                                                    className="card-body h-200"
                                                    style={{
                                                        background: "#dcdcdc",
                                                    }}
                                                >
                                                    <form>
                                                        <table>
                                                            <tr>
                                                                <td
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Taux
                                                                    (Facultatif)
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td>
                                                                    <input
                                                                        style={{
                                                                            height: "33px",
                                                                            border: "1px solid steelblue",
                                                                        }}
                                                                        type="text"
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setTaux(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style={{
                                                                        fontWeight:
                                                                            "bold",
                                                                        color: "steelblue",
                                                                    }}
                                                                >
                                                                    Définir la
                                                                    date{" "}
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <input
                                                                        style={{
                                                                            // height: "33px",
                                                                            border: "1px solid steelblue",
                                                                            width: "100px",
                                                                        }}
                                                                        type="date"
                                                                        name="dateWork"
                                                                        id="dateWork"
                                                                        value={
                                                                            dateWork
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            setDateWork(
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td>
                                                                    <button
                                                                        style={{
                                                                            height: "33px",
                                                                            border: "1px solid steelblue",
                                                                        }}
                                                                        type="text"
                                                                        id="btnsaveDate"
                                                                        className="btn mt-1"
                                                                        onClick={
                                                                            definirDate
                                                                        }
                                                                    >
                                                                        <i className="fas fa-check"></i>{" "}
                                                                        Valider
                                                                        {/* <span class="spinner-border spinner-border-sm invisible"></span>{" "} */}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        </table>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {showDateContainer && (
                                        <div
                                            className="row col-md-6"
                                            // style={{ margin: "0px auto" }}
                                        >
                                            <table
                                                className="table table-striped"
                                                style={{
                                                    background: "teal",
                                                    padding: "5px",
                                                    // color: "#fff",
                                                }}
                                            >
                                                <thead>
                                                    <tr>
                                                        <th scope="col">#</th>
                                                        <th scope="col">
                                                            Date à clôturer
                                                        </th>
                                                        <th scope="col">
                                                            Date N+1
                                                        </th>
                                                        <th scope="col">
                                                            Monnaie
                                                        </th>
                                                        <th scope="col">
                                                            Taux jour
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th scope="row">1</th>
                                                        <td>
                                                            {dateParser(
                                                                todayDate
                                                            )}
                                                        </td>
                                                        <td>{dateWork}</td>
                                                        <td>{"USD"}</td>
                                                        <td>{usd}</td>
                                                    </tr>
                                                    <tr>
                                                        <th scope="row">2</th>
                                                        <td>
                                                            {dateParser(
                                                                todayDate
                                                            )}
                                                        </td>
                                                        <td>{dateWork}</td>
                                                        <td>{"CDF"}</td>
                                                        <td>{Taux}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Cloture;
