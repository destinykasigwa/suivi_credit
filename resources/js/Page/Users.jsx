import styles from "../styles/Global.module.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
const Users = () => {
    const navigate = useNavigate();
    // const [user, setUser] = useState({
    //     name: "",
    //     email: "",
    // });
    const [email, setEmail] = useState();
    const [name, setName] = useState();
    const [userId, setUserId] = useState();
    const [profilName, setProfileName] = useState();
    const [loading, setIsloading] = useState(false);
    const [loading2, setIsloading2] = useState(false);

    const [error, setError] = useState([]);
    const [fetchUsers, setFetchUsers] = useState();
    const [fetchProfil, setFetchProfil] = useState();
    const [fetchMenu, setFetchMenu] = useState();
    const [selectedData, setSelectedData] = useState();
    const [selectedProfilData, setSelectedProfilData] = useState();
    const [selectedMenuData, setSelectedMenuData] = useState();
    const [getEditForm, setGetEditForm] = useState(false);
    const [getResetPassWordForm, setGetResetPassWordForm] = useState(false);
    const [getLockUserForm, setGetLockUserForm] = useState(false);
    const [fetchProfilForSelectedUser, setFetchProfilForSelectedUser] =
        useState();
    const [fetchMenuForSelectedUser, setFetchMenuForSelectedUser] = useState();

    const [records, setRecords] = useState();
    const [Profilrecords, setProfilrecords] = useState();
    const [menuRecords, setMenuRecords] = useState();

    const columns = [
        {
            name: "User Name",
            // selector: "name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Email",
            selector: (row) => row.email,
        },
        {
            name: "Code Agence",
            selector: "code_agence",
        },
        {
            name: "Télephone",
            selector: "phone",
        },
        // {
        //     name: "Action",
        //     cell: (row) => <button className="btn btn-primary">Edit</button>,
        // },
    ];

    const ProfilForUserCulumn = [
        {
            name: "Description",
            selector: (row) => row.nom_profile,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn btn-danger rounded-0"
                    onClick={() => {
                        removeProfil(row.id);
                    }}
                >
                    Retirer
                </button>
            ),
        },
    ];

    const columnsProfil = [
        {
            name: "Description",
            selector: (row) => row.nom_profile,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn btn-primary rounded-0"
                    onClick={() => {
                        addUserProfil(row.id);
                    }}
                >
                    Ajouter ce profil à l'utilisateur sélectionné
                </button>
            ),
        },
    ];
    const columnsMenu = [
        {
            name: "Nom menu",
            selector: (row) => row.menu_name,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn btn-primary rounded-0"
                    onClick={() => {
                        addMenuForUser(row.id);
                    }}
                >
                    Ajouter ce menu à l'utilisateur sélectionné
                </button>
            ),
        },
    ];

    const MenuForUserCulumn = [
        {
            name: "Nom menu",
            selector: (row) => row.menu_name,
        },
        {
            name: "Action",
            cell: (row) => (
                <button
                    className="btn btn-danger rounded-0"
                    onClick={() => {
                        removeMenuForUser(row.id);
                    }}
                >
                    Retirer
                </button>
            ),
        },
    ];
    const customStyles = {
        rows: {
            style: {
                minHeight: "72px", // override the row height
            },
        },
        headCells: {
            style: {
                paddingLeft: "8px", // override the cell padding for head cells
                paddingRight: "8px",
                background: "teal",
                fontSize: "16px",
                fontWeight: "bold",
            },
        },
        cells: {
            style: {
                paddingLeft: "8px", // override the cell padding for data cells
                paddingRight: "8px",
                fontSize: "16px",
            },
        },
    };

    useEffect(() => {
        getUsers();
    }, []);
    //GET USER ON PAGE LOAD
    const getUsers = async () => {
        const res = await axios.get("/eco/pages/getusers");
        if (res.data.status == 1) {
            setFetchUsers(res.data);
            setFetchProfil(res.data);
            setFetchMenu(res.data);
            //GET RECORDS
            setProfilrecords(res.data.profildata);
            setMenuRecords(res.data.menudata);
            setRecords(res.data.data);
        }
    };
    //GET SELECTED USER IN DATA TABLE
    const handleChange = (state) => {
        setSelectedData(state.selectedRows);

        console.log(selectedData);
    };
    //GET SELECTED PROFIL ITEM
    const handleChangeProfil = (state) => {
        setSelectedProfilData(state.selectedRows);
        console.log(selectedProfilData);
    };
    //FILTER USER IN USER DATA TABLE
    const handleFilter = (event) => {
        const newData = fetchUsers.data.filter((row) => {
            return row.name
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        });
        console.log(newData);
        setRecords(newData);
    };

    //FILTER USER IN DATA TABLE
    const handleFilterProfil = (event) => {
        const newData = fetchProfil.profildata.filter((row) => {
            return row.nom_profile
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        });
        console.log(newData);
        setProfilrecords(newData);
    };

    //GET EDIT FORM
    function showEditForm() {
        setGetEditForm(true);
        setName(selectedData[0].name);
        setEmail(selectedData[0].email);
        setUserId(selectedData[0].id);
        // console.log(user.name);
    }
    //GET RESET FORM
    function showResetPWForm() {
        setGetResetPassWordForm(true);
        setUserId(selectedData[0].id);
        setName(selectedData[0].name);
    }
    //UPDATE USER
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsloading(true);
        const res = await axios.post("/eco/pages/updateuser", {
            name,
            email,
            userId,
        });
        if (res.data.status == 1) {
            setIsloading(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        }
    };
    //INIT USER PASSWORD
    const handleInitPassword = async (e) => {
        e.preventDefault();
        setIsloading2(true);
        const res = await axios.post("/eco/pages/user/init", {
            userId,
        });
        if (res.data.status == 1) {
            setIsloading2(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };
    //SHOW LOCK USER FORM
    //GET RESET FORM
    function showLockPWForm() {
        setGetLockUserForm(true);
        setUserId(selectedData[0].id);
        setName(selectedData[0].name);
    }

    //INIT USER PASSWORD
    const handleLockUser = async (e) => {
        e.preventDefault();
        setIsloading(true);
        const res = await axios.post("/eco/pages/user/lock", {
            userId,
        });
        if (res.data.status == 1) {
            setIsloading(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //ADD NEW PROFIL
    const handleAddProfil = async (e) => {
        e.preventDefault();

        const res = await axios.post("/eco/pages/profil/addnew", {
            profilName,
        });
        if (res.data.status == 1) {
            setIsloading(false);
            setProfileName("");
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading(false);
            Swal.fire({
                title: "Error",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //FILTER A SEACHED MENU
    const handleFilterMenu = (event) => {
        const newData = fetchMenu.menudata.filter((row) => {
            return row.menu_name
                .toLowerCase()
                .includes(event.target.value.toLowerCase());
        });
        console.log(newData);
        setMenuRecords(newData);
    };

    //GET A SEACHED MENU ITEM

    const handleChangeMenu = (state) => {
        setSelectedMenuData(state.selectedRows);
        console.log(selectedMenuData);
    };

    //GET PROFIL FOR SELECTED USER
    const getProfilForSelectedUser = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/pages/getusers/profil", {
            userId: selectedData[0].id,
        });
        if (res.data.status == 1) {
            setFetchProfilForSelectedUser(res.data.get_profil_user);
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //GET MENU FOR SELECTED USER

    const getMenuForSelectedUser = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/pages/getusers/menu", {
            userId: selectedData[0].id,
        });
        if (res.data.status == 1) {
            setFetchMenuForSelectedUser(res.data.get_menu_user);
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //ADD A PROFIL FOR A SPECIFIC USER

    const addUserProfil = async (id) => {
        const res = await axios.post("/eco/pages/add/profil", {
            profilId: id,
            userId: selectedData[0].id,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //REMOVE A SPECIFIC PROFIL
    const removeProfil = async (id) => {
        // setIsloading(true);
        const res = await axios.post("/eco/pages/remove/profil", {
            idProfil: id,
        });
        if (res.data.status == 1) {
            // setIsloading(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading(false);
        }
    };

    const removeMenuForUser = async (id) => {
        // setIsloading(true);
        const res = await axios.post("/eco/pages/remove/menu", {
            idMenu: id,
        });
        if (res.data.status == 1) {
            // setIsloading(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading(false);
        }
    };

    //ADD A MENU FOR A SPECIFIQUE USER
    const addMenuForUser = async (id) => {
        const res = await axios.post("/eco/pages/add/menu", {
            menuId: id,
            userId: selectedData[0].id,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    //PERMET DE CREER UN COMPTE CAISSE
    const CreateCaissierAccount = async (e) => {
        e.preventDefault();
        const res = await axios.post("/eco/page/users/create-caisse-account", {
            userId,
        });
        if (res.data.status == 1) {
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 4000,
                confirmButtonText: "Okay",
            });
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 4000,
                confirmButtonText: "Okay",
            });
        }
    };

    return (
        <div style={{ marginTop: "5px" }}>
            <div>
                <ul
                    className="nav nav-tabs"
                    id="custom-tabs-one-tab"
                    role="tablist"
                    style={{ background: "teal", border: "0px" }}
                >
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link active"
                            id="custom-tabs-one-users-tab"
                            data-toggle="pill"
                            href="#custom-tabs-one-users"
                            role="tab"
                            aria-controls="custom-tabs-one-users"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Utilisateurs
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link"
                            id="custom-tabs-one-profil-tab"
                            data-toggle="pill"
                            href="#custom-tabs-one-profil"
                            role="tab"
                            aria-controls="custom-tabs-one-profil"
                            aria-selected="false"
                        >
                            Profile
                        </a>
                    </li>
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link"
                            id="custom-tabs-one-menu-tab"
                            data-toggle="pill"
                            href="#custom-tabs-one-menu"
                            role="tab"
                            aria-controls="custom-tabs-one-menu"
                            aria-selected="false"
                        >
                            Menu
                        </a>
                    </li>
                </ul>
                <div className="card-body">
                    <div
                        className="tab-content"
                        id="custom-tabs-one-tabContent"
                    >
                        <div
                            className="tab-pane fade show active"
                            id="custom-tabs-one-users"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-one-users-tab"
                        >
                            <h4 className="fw-bold">UTILISATEURS</h4>
                            <div className="row">
                                <div className="col-md-8">
                                    <div
                                        style={{
                                            overflowY: "scroll",
                                            height: "500px",
                                        }}
                                    >
                                        {records ? (
                                            <>
                                                <div className="text-end">
                                                    <input
                                                        type="text"
                                                        onChange={handleFilter}
                                                        style={{
                                                            padding: "5px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                        }}
                                                        placeholder="Rechercher..."
                                                    />
                                                </div>

                                                <DataTable
                                                    data={records}
                                                    columns={columns}
                                                    selectableRows
                                                    pagination={5}
                                                    onSelectedRowsChange={
                                                        handleChange
                                                    }
                                                    customStyles={customStyles}
                                                    // actions={
                                                    //     <button className="btn btn-info">
                                                    //         Exporter
                                                    //     </button>
                                                    // }
                                                    // subHeader
                                                    // subHeaderComponent={
                                                    // }
                                                    // subHeaderAlign=""
                                                />
                                            </>
                                        ) : (
                                            <p>Chargement...</p>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-4">
                                    {getEditForm && selectedData ? (
                                        <form
                                            action=""
                                            className={styles.edit_form}
                                        >
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                color: "steelblue",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                            htmlFor="userName"
                                                        >
                                                            Nom utilisateur
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="userName"
                                                            style={{
                                                                padding: "2px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "2px",
                                                            }}
                                                            type="text"
                                                            name="name"
                                                            required
                                                            onChange={(e) =>
                                                                setName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={name}
                                                            // disabled
                                                        />
                                                        <input
                                                            id="userId"
                                                            name="userId"
                                                            type="hidden"
                                                            onChange={(e) =>
                                                                setUserId(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={userId}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                color: "steelblue",
                                                                fontWeight:
                                                                    "bold",
                                                            }}
                                                            htmlFor="Email"
                                                        >
                                                            Email
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Email"
                                                            style={{
                                                                padding: "2px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "2px",
                                                            }}
                                                            type="text"
                                                            name="email"
                                                            onChange={(e) =>
                                                                setEmail(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={email}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <button
                                                            onClick={
                                                                handleUpdate
                                                            }
                                                            className="btn btn-primary rounded-0 mt-1"
                                                        >
                                                            {loading ? (
                                                                <span class="spinner-border spinner-border-sm visible"></span>
                                                            ) : (
                                                                "Mettre à jour"
                                                            )}
                                                        </button>
                                                        <button
                                                            onClick={
                                                                CreateCaissierAccount
                                                            }
                                                            className="btn btn-success rounded-0 mt-2"
                                                        >
                                                            Créer un compte
                                                            caisse
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </form>
                                    ) : null}

                                    {/* //RESET PASS WORD  */}
                                    {getResetPassWordForm ? (
                                        <form
                                            action=""
                                            className={styles.edit_form}
                                        >
                                            <div className="bg-info p-2">
                                                <p>
                                                    Vous êtes sur le point de
                                                    réinitialiser le mot de
                                                    passe de{" "}
                                                    <strong>{name}</strong>
                                                </p>
                                            </div>
                                            <br />
                                            <table>
                                                <tr>
                                                    <td>
                                                        <button
                                                            onClick={
                                                                handleInitPassword
                                                            }
                                                            className="btn btn-danger rounded-0"
                                                        >
                                                            {loading2 ? (
                                                                <span class="spinner-border spinner-border-sm visible"></span>
                                                            ) : (
                                                                "Réinitialiser"
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </form>
                                    ) : null}

                                    {/* LOCK A USER  */}
                                    {/* //RESET PASS WORD  */}
                                    {getLockUserForm ? (
                                        <form
                                            action=""
                                            className={styles.edit_form}
                                        >
                                            <div className="bg-info p-2">
                                                <p>
                                                    Vous êtes sur le point de
                                                    bloquer l'utilisateur{" "}
                                                    <strong>{name}</strong>
                                                </p>
                                            </div>
                                            <br />
                                            <table>
                                                <tr>
                                                    <td>
                                                        <button
                                                            onClick={
                                                                handleLockUser
                                                            }
                                                            className="btn btn-danger rounded-0"
                                                        >
                                                            {selectedData[0]
                                                                .locked_state ==
                                                            1 ? (
                                                                <i className="fas fa-lock">
                                                                    {" "}
                                                                    Débloquer
                                                                    l'utilsateur
                                                                </i>
                                                            ) : (
                                                                <i className="fas fa-unlock">
                                                                    {" "}
                                                                    Bloquer
                                                                    l'utilisateur
                                                                </i>
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </form>
                                    ) : null}
                                </div>
                            </div>
                            <div
                                class="btn-group btn-group-toggle"
                                data-toggle="buttons"
                            >
                                <label className="btn btn-primary active">
                                    <input
                                        type="radio"
                                        name="options"
                                        id="option1"
                                        autocomplete="off"
                                        checked
                                        onClick={showEditForm}
                                    />{" "}
                                    Editer
                                </label>
                                <label className="btn btn-primary">
                                    <input
                                        type="radio"
                                        name="options"
                                        id="option2"
                                        autocomplete="off"
                                        onClick={showResetPWForm}
                                    />{" "}
                                    Reset password
                                </label>
                                <label className="btn btn-primary">
                                    <input
                                        type="radio"
                                        name="options"
                                        id="option3"
                                        autocomplete="off"
                                        onClick={showLockPWForm}
                                    />{" "}
                                    Bloquer
                                </label>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="custom-tabs-one-profil"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-one-profil-tab"
                        >
                            {/* PROFIL */}
                            <h4 className="fw-bold">PROFILS</h4>
                            <div className="row">
                                <div className="col-md-8">
                                    <div
                                        style={{
                                            overflowY: "scroll",
                                            height: "500px",
                                        }}
                                    >
                                        {Profilrecords ? (
                                            <>
                                                <div>
                                                    {/* <div className="text-start">
                                                        {selectedData !=
                                                        undefined ? (
                                                            <button
                                                                className="btn btn-info"
                                                                onClick={
                                                                    addProfilForUser
                                                                }
                                                            >
                                                                Add profil for
                                                                user{" "}
                                                            </button>
                                                        ) : null}
                                                    </div> */}
                                                    <div className="text-end">
                                                        <input
                                                            type="text"
                                                            onChange={
                                                                handleFilterProfil
                                                            }
                                                            style={{
                                                                padding: "5px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                            }}
                                                            placeholder="Rechercher..."
                                                        />
                                                    </div>
                                                </div>

                                                <DataTable
                                                    data={Profilrecords}
                                                    columns={columnsProfil}
                                                    // selectableRows
                                                    pagination={5}
                                                    onSelectedRowsChange={
                                                        handleChangeProfil
                                                    }
                                                    customStyles={customStyles}
                                                />
                                            </>
                                        ) : (
                                            <p>Chargement...</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="card rounded-0">
                                        <div className="card-header">
                                            AJOUTER UN PROFIL
                                        </div>
                                        <form
                                            action=""
                                            className={styles.edit_form}
                                        >
                                            <table>
                                                <tr>
                                                    <td>
                                                        <label
                                                            style={{
                                                                color: "steelblue",
                                                                fontWeight:
                                                                    "bold",
                                                                padding: "3px",
                                                            }}
                                                            htmlFor="profilName"
                                                        >
                                                            Nom profile
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="profilName"
                                                            style={{
                                                                padding: "2px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "2px",
                                                            }}
                                                            type="text"
                                                            name="profilName"
                                                            required
                                                            onChange={(e) =>
                                                                setProfileName(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={profilName}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <button
                                                            onClick={
                                                                handleAddProfil
                                                            }
                                                            className="btn btn-primary rounded-0"
                                                        >
                                                            {loading ? (
                                                                <span class="spinner-border spinner-border-sm visible"></span>
                                                            ) : (
                                                                "Valider"
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </table>
                                        </form>
                                    </div>
                                    <div className="card-header">
                                        <button
                                            className="btn btn-primary rounded-0"
                                            onClick={getProfilForSelectedUser}
                                        >
                                            <i className="fa fa-spinner"></i>{" "}
                                            Charger les profil
                                        </button>
                                    </div>{" "}
                                    {fetchProfilForSelectedUser ? (
                                        <>
                                            <div
                                                style={{
                                                    height: "350px",
                                                    overflowX: "scroll",
                                                }}
                                            >
                                                <DataTable
                                                    data={
                                                        fetchProfilForSelectedUser
                                                    }
                                                    columns={
                                                        ProfilForUserCulumn
                                                    }
                                                    // selectableRows
                                                    pagination={5}
                                                    // onSelectedRowsChange={
                                                    //     handleChangeProfil
                                                    // }
                                                    customStyles={customStyles}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <p>{""}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade"
                            id="custom-tabs-one-menu"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-one-menu-tab"
                        >
                            {/* MENU */}
                            <h4 className="fw-bold">MENUS</h4>
                            <div className="row">
                                <div className="col-md-7">
                                    <div
                                        style={{
                                            overflowY: "scroll",
                                            height: "500px",
                                        }}
                                    >
                                        {Profilrecords ? (
                                            <>
                                                <div className="text-end">
                                                    <input
                                                        type="text"
                                                        onChange={
                                                            handleFilterMenu
                                                        }
                                                        style={{
                                                            padding: "5px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                        }}
                                                        placeholder="Rechercher..."
                                                    />
                                                </div>

                                                <DataTable
                                                    data={menuRecords}
                                                    columns={columnsMenu}
                                                    // selectableRows
                                                    pagination={5}
                                                    onSelectedRowsChange={
                                                        handleChangeMenu
                                                    }
                                                    customStyles={customStyles}
                                                />
                                            </>
                                        ) : (
                                            <p>Chargement...</p>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="card rounded-0">
                                        <div className="card-header">
                                            <button
                                                className="btn btn-primary rounded-0"
                                                onClick={getMenuForSelectedUser}
                                            >
                                                <i className="fa fa-spinner"></i>{" "}
                                                Charger les menus
                                            </button>
                                        </div>{" "}
                                        {fetchMenuForSelectedUser ? (
                                            <>
                                                <div
                                                    style={{
                                                        height: "350px",
                                                        overflowX: "scroll",
                                                    }}
                                                >
                                                    <DataTable
                                                        data={
                                                            fetchMenuForSelectedUser
                                                        }
                                                        columns={
                                                            MenuForUserCulumn
                                                        }
                                                        // selectableRows
                                                        pagination={5}
                                                        // onSelectedRowsChange={
                                                        //     handleChangeProfil
                                                        // }
                                                        customStyles={
                                                            customStyles
                                                        }
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <p>{""}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <button type="button" onClick={handleTest}>
                    TESTER
                </button> */}
            </div>
        </div>
    );
};

export default Users;
