import styles from "../styles/Global.module.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
// import DataTable from "react-data-table-component";
import $ from "jquery";
import "datatables.net";
import "datatables.net-bs4/js/dataTables.bootstrap4.min";
// import "data";

const TypeCredit = () => {
    const [loading, setLoading] = useState(false);
    const [fetchData, setFetchData] = useState();
    const [reference, setReference] = useState();
    const [type_credit, settype_credit] = useState();
    const [taux_ordinaire, settaux_ordinaire] = useState();
    const [montant_min, setmontant_min] = useState();
    const [montant_max, setmontant_max] = useState();
    const [compte_interet, setcompte_interet] = useState();
    const [compte_commission, setcompte_commission] = useState();
    const [compte_etude_dossier, setcompte_etude_dossier] = useState();
    const [sous_groupe_compte, setsous_groupe_compte] = useState();
    const [taux_retard, settaux_retard] = useState();
    const [compte_interet_retard, setcompte_interet_retard] = useState();
    const [commission_en_pourc, setcommission_en_pourc] = useState();
    const [frais_dossier, setfrais_dossier] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const [fetchData2, setfetchData2] = useState();

    //UPDATE ATTRIBUTE
    const [reference_up, setReference_up] = useState();
    const [type_credit_up, settype_credit_up] = useState();
    const [taux_ordinaire_up, settaux_ordinaire_up] = useState();
    const [montant_min_up, setmontant_min_up] = useState();
    const [montant_max_up, setmontant_max_up] = useState();
    const [compte_interet_up, setcompte_interet_up] = useState();
    const [compte_commission_up, setcompte_commission_up] = useState();
    const [compte_etude_dossier_up, setcompte_etude_dossier_up] = useState();
    const [sous_groupe_compte_up, setsous_groupe_compte_up] = useState();
    const [taux_retard_up, settaux_retard_up] = useState();
    const [compte_interet_retard_up, setcompte_interet_retard_up] = useState();
    const [commission_en_pourc_up, setcommission_en_pourc_up] = useState();
    const [frais_dossier_up, setfrais_dossier_up] = useState();

    useEffect(() => {
        // Initialize DataTable
        $("#example").DataTable();
        getData();
    }, []);

    const getData = async () => {
        const res = await axios.get("/eco/type-credit/get-data");
        if (res.data.status == 1) {
            setFetchData(res.data.data);
        }
    };
    const saveTypeCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/credit/type-credit/addnew", {
            reference,
            type_credit,
            taux_ordinaire,
            montant_min,
            montant_max,
            compte_interet,
            compte_commission,
            compte_etude_dossier,
            sous_groupe_compte,
            taux_retard,
            compte_interet_retard,
            commission_en_pourc,
            frais_dossier,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    const updateTypeCredit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/credit/type-credit/update", {
            reference_up,
            type_credit_up,
            taux_ordinaire_up,
            montant_min_up,
            montant_max_up,
            compte_interet_up,
            compte_commission_up,
            compte_etude_dossier_up,
            sous_groupe_compte_up,
            taux_retard_up,
            compte_interet_retard_up,
            commission_en_pourc_up,
            frais_dossier_up,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 8000,
                confirmButtonText: "Okay",
            });
        }
    };

    const getInfo = async (event) => {
        if (event.detail == 2) {
            console.log(event.target.innerText);
            const res = await axios.post(
                "/eco/page/type-credit/get-credit/specific",
                {
                    RefCredit: event.target.innerText,
                }
            );
            if (res.data.status == 1) {
                setfetchData2(res.data.data);
                setReference_up(fetchData2.Reference);
                settype_credit_up(fetchData2.type_credit);
                settaux_ordinaire_up(fetchData2.taux_ordinaire);
                setmontant_min_up(fetchData2.montant_min);
                setmontant_max_up(fetchData2.montant_max);
                setcompte_interet_up(fetchData2.compte_interet);
                setcompte_commission_up(fetchData2.compte_commission);
                setcompte_etude_dossier_up(fetchData2.compte_etude_dossier);
                setsous_groupe_compte_up(fetchData2.sous_groupe_compte);
                settaux_retard_up(fetchData2.taux_retard);
                setcompte_interet_retard_up(fetchData2.compte_interet_retard);
                setcommission_en_pourc_up(fetchData2.commission);
                setfrais_dossier_up(fetchData2.frais_dossier);
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
    const ChargerTypeCredit = (e) => {
        e.preventDefault();
        fetchData2 && setReference_up(fetchData2.Reference);
        settype_credit_up(fetchData2.type_credit);
        settaux_ordinaire_up(fetchData2.taux_ordinaire);
        setmontant_min_up(fetchData2.montant_min);
        setmontant_max_up(fetchData2.montant_max);
        setcompte_interet_up(fetchData2.compte_interet);
        setcompte_commission_up(fetchData2.compte_commission);
        setcompte_etude_dossier_up(fetchData2.compte_etude_dossier);
        setsous_groupe_compte_up(fetchData2.sous_groupe_compte);
        settaux_retard_up(fetchData2.taux_retard);
        setcompte_interet_retard_up(fetchData2.compte_interet_retard);
        setcommission_en_pourc_up(fetchData2.commission);
        setfrais_dossier_up(fetchData2.frais_dossier);
    };
    // Calculate the index of the first and last item of the current page
    let itemsPerPage = 5;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems =
        fetchData && fetchData.slice(indexOfFirstItem, indexOfLastItem);

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Render pagination buttons
    const renderPagination = () => {
        const pageNumbers = [];
        for (
            let i = 1;
            i <= Math.ceil(fetchData && fetchData.length / itemsPerPage);
            i++
        ) {
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
                        <h5 className="text-bold p-1">Type crédit</h5>
                    </div>{" "}
                </div>
            </div>
            <div className="row mt-3"></div>
            {/* <p
                className="border border-10"
                style={{
                    background: "#dcdcdc",
                    padding: "1px",
                }}
            ></p> */}
            <div className="row">
                <div
                    className="col-md-9 card rounded-0 p-4"
                    style={{ marginRight: "3px" }}
                >
                    {!fetchData2 ? (
                        <form action="">
                            <div className="row">
                                <div className="col-md-6">
                                    <fieldset>
                                        {/* <legend
                                        className="float-none w-auto p-0"
                                        style={{
                                            margin: "-15px",
                                            marginLeft: "7px",
                                        }}
                                    >
                                        <p style={{ fontSize: "15px" }}>
                                            Type crédit
                                        </p>
                                    </legend> */}

                                        <table>
                                            {/* <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="reference"
                                                >
                                                    Référence
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    name="reference"
                                                    id="reference"
                                                    onChange={(e) => {
                                                        setReference(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr> */}
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="type_credit"
                                                    >
                                                        Type crédit
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "300px",
                                                        }}
                                                        name="type_credit"
                                                        id="type_credit"
                                                        onChange={(e) => {
                                                            settype_credit(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="taux_ordinaire"
                                                    >
                                                        Taux ordinaire
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="taux_ordinaire"
                                                        id="taux_ordinaire"
                                                        onChange={(e) => {
                                                            settaux_ordinaire(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="montant_min"
                                                    >
                                                        Montant Min
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="montant_min"
                                                        id="montant_min"
                                                        onChange={(e) => {
                                                            setmontant_min(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="montant_max"
                                                    >
                                                        Montant Max
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="montant_max"
                                                        id="montant_max"
                                                        onChange={(e) => {
                                                            setmontant_max(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="compte_interet"
                                                    >
                                                        Compte intérêt
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="compte_interet"
                                                        id="compte_interet"
                                                        onChange={(e) => {
                                                            setcompte_interet(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="commission"
                                                    >
                                                        Commission
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="commission"
                                                        id="commission"
                                                        onChange={(e) => {
                                                            setfrais_dossier(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="compte_etude_dossier"
                                                    >
                                                        Compte étude dossier
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="compte_etude_dossier"
                                                        id="compte_etude_dossier"
                                                        onChange={(e) => {
                                                            setcompte_etude_dossier(
                                                                e.target.value
                                                            );
                                                        }}
                                                    />
                                                </td>
                                            </tr>
                                        </table>
                                    </fieldset>
                                </div>
                                <div className="col-md-6">
                                    <table>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="sous_groupe_compte"
                                                >
                                                    S/G Compte
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                    }}
                                                    name="sous_groupe_compte"
                                                    id="sous_groupe_compte"
                                                    onChange={(e) => {
                                                        setsous_groupe_compte(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="taux_retard"
                                                >
                                                    Taux retard
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "300px",
                                                    }}
                                                    name="taux_retard"
                                                    id="taux_retard"
                                                    onChange={(e) => {
                                                        settaux_retard(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="compte_interet_retard"
                                                >
                                                    Compte int. retard
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "150px",
                                                    }}
                                                    name="compte_interet_retard"
                                                    id="compte_interet_retard"
                                                    onChange={(e) => {
                                                        setcompte_interet_retard(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="frais_de_dossier"
                                                >
                                                    Frais de doss (%).
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "150px",
                                                    }}
                                                    name="frais_de_dossier"
                                                    id="frais_de_dossier"
                                                    onChange={(e) => {
                                                        setfrais_de_dossier(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="commission_en_pourc"
                                                >
                                                    commission(%)
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "150px",
                                                    }}
                                                    name="commission_en_pourc"
                                                    id="commission_en_pourc"
                                                    onChange={(e) => {
                                                        setcommission_en_pourc(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <label
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                    htmlFor="compte_commission"
                                                >
                                                    Compte commission
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    type="text"
                                                    style={{
                                                        padding: "3px ",
                                                        border: `${"1px solid #dcdcdc"}`,
                                                        marginBottom: "5px",
                                                        width: "150px",
                                                    }}
                                                    name="compte_commission"
                                                    id="compte_commission"
                                                    onChange={(e) => {
                                                        setcompte_commission(
                                                            e.target.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                <button
                                                    onClick={saveTypeCredit}
                                                    className="btn btn-primary rounded-0"
                                                >
                                                    Enregistrer
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </form>
                    ) : (
                        fetchData2 && (
                            <form action="">
                                <div className="row">
                                    <div className="col-md-6">
                                        <div className="text-start">
                                            <button
                                                className="btn btn-primary rounded-0"
                                                onClick={ChargerTypeCredit}
                                            >
                                                <i className="fa fa-spinner"></i>{" "}
                                                Charger
                                            </button>
                                        </div>
                                        <fieldset>
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="reference_up"
                                                        >
                                                            Référence
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                background:
                                                                    "teal",
                                                                color: "#fff",
                                                            }}
                                                            name="reference_up"
                                                            id="reference_up"
                                                            onChange={(e) => {
                                                                setReference_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={reference_up}
                                                            disabled
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="type_credit_up"
                                                        >
                                                            Type crédit
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "300px",
                                                                background:
                                                                    "teal",
                                                                color: "#fff",
                                                            }}
                                                            name="type_credit_up"
                                                            id="type_credit_up"
                                                            onChange={(e) => {
                                                                settype_credit_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                type_credit_up
                                                            }
                                                            disabled
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="taux_ordinaire_up"
                                                        >
                                                            Taux ordinaire
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="taux_ordinaire_up"
                                                            id="taux_ordinaire_up"
                                                            onChange={(e) => {
                                                                settaux_ordinaire_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                taux_ordinaire_up
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="montant_min_up"
                                                        >
                                                            Montant Min
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="montant_min_up"
                                                            id="montant_min_up"
                                                            onChange={(e) => {
                                                                setmontant_min_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                montant_min_up
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="montant_max_up"
                                                        >
                                                            Montant Max
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="montant_max_up"
                                                            id="montant_max_up"
                                                            onChange={(e) => {
                                                                setmontant_max_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                montant_max_up
                                                            }
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="frais_dossier_up"
                                                        >
                                                            Compte intérêt
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="compte_interet_up"
                                                            id="compte_interet_up"
                                                            onChange={(e) => {
                                                                setcompte_interet_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                compte_interet_up
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                {/* <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="commission_up"
                                                        >
                                                            Commission
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="commission_up"
                                                            id="commission_up"
                                                            onChange={(e) => {
                                                                setcomm(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                        />
                                                    </td>
                                                </tr> */}
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                            htmlFor="compte_etude_dossier_up"
                                                        >
                                                            Compte étude dossier
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            type="text"
                                                            style={{
                                                                padding: "3px ",
                                                                border: `${"1px solid #dcdcdc"}`,
                                                                marginBottom:
                                                                    "5px",
                                                                width: "150px",
                                                            }}
                                                            name="compte_etude_dossier_up"
                                                            id="compte_etude_dossier_up"
                                                            onChange={(e) => {
                                                                setcompte_etude_dossier_up(
                                                                    e.target
                                                                        .value
                                                                );
                                                            }}
                                                            value={
                                                                compte_etude_dossier_up
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </table>
                                        </fieldset>
                                    </div>
                                    <div className="col-md-6">
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="sous_groupe_compte_up"
                                                    >
                                                        S/G Compte
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                        }}
                                                        name="sous_groupe_compte_up"
                                                        id="sous_groupe_compte_up"
                                                        onChange={(e) => {
                                                            setsous_groupe_compte_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            sous_groupe_compte_up
                                                        }
                                                        disabled
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="taux_retard_up"
                                                    >
                                                        Taux retard
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "300px",
                                                        }}
                                                        name="taux_retard_up"
                                                        id="taux_retard_up"
                                                        onChange={(e) => {
                                                            settaux_retard_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={taux_retard_up}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="compte_interet_retard_up"
                                                    >
                                                        Compte int. retard
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="compte_interet_retard_up"
                                                        id="compte_interet_retard_up"
                                                        onChange={(e) => {
                                                            setcompte_interet_retard_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            compte_interet_retard_up
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="frais_dossier_up"
                                                    >
                                                        Frais de doss (%).
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="frais_dossier_up"
                                                        id="frais_dossier_up"
                                                        onChange={(e) => {
                                                            setfrais_dossier_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={frais_dossier_up}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="commission_en_pourc_up"
                                                    >
                                                        commission(%)
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="commission_en_pourc_up"
                                                        id="commission_en_pourc_up"
                                                        onChange={(e) => {
                                                            setcommission_en_pourc_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            commission_en_pourc_up
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                        htmlFor="compte_commission_up"
                                                    >
                                                        Compte commission
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        style={{
                                                            padding: "3px ",
                                                            border: `${"1px solid #dcdcdc"}`,
                                                            marginBottom: "5px",
                                                            width: "150px",
                                                        }}
                                                        name="compte_commission_up"
                                                        id="compte_commission_up"
                                                        onChange={(e) => {
                                                            setcompte_commission_up(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            compte_commission_up
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <button
                                                        onClick={
                                                            updateTypeCredit
                                                        }
                                                        className="btn btn-primary rounded-0"
                                                    >
                                                        Modifier
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                            </form>
                        )
                    )}
                </div>
            </div>
            <div className="row">
                <div className="col-md-8 card rounded-0 p-2">
                    <table
                        className="table table-striped table-bordered p-3"
                        style={{ width: "100%" }}
                    >
                        <thead>
                            <tr>
                                <th>Réf</th>
                                <th>TypeCrédit</th>
                                <th>TauxOrd.</th>
                                <th>MontantMin.</th>
                                <th>MontantMax.</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems &&
                                currentItems.map((res, index) => {
                                    return (
                                        <tr key={index}>
                                            <td
                                                style={{ cursor: "pointer" }}
                                                onClick={(event) =>
                                                    getInfo(event)
                                                }
                                            >
                                                <a
                                                    style={{
                                                        pointerEvents: "none",
                                                    }}
                                                    href=""
                                                >
                                                    {res.Reference}
                                                </a>
                                            </td>
                                            <td>{res.type_credit}</td>
                                            <td>{res.taux_ordinaire}</td>
                                            <td>{res.montant_min}</td>
                                            <td>{res.montant_max}</td>
                                        </tr>
                                    );
                                })}

                            {/* Ajoutez plus de lignes au besoin */}
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
                                                fetchData.length / itemsPerPage
                                        )
                                    }
                                    style={buttonStylePrevNext}
                                >
                                    Next
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TypeCredit;
