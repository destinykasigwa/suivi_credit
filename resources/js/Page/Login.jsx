import styles from "../styles/RegisterForm.module.css";
import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        name: "",
        password: "",
        Previouspassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [error, setError] = useState([]);
    const [expiredPassword, setExpiredPassword] = useState(false);
    const [isSessionExpired, setSessionExpired] = useState(false);

    useEffect(() => {
        const checkSessionExpiration = async () => {
            try {
                const res = await axios.get("/check-session-expiration");
                if (res.data.sessionExpired) {
                    console.log(res.data.requestedPageUrl);
                    const lastVisitedUrl = res.data.requestedPageUrl;
                    // La session de l'utilisateur a expiré
                    setSessionExpired(true);
                    // Stocker l'URL de la dernière page visitée dans le localStorage
                    localStorage.setItem("lastVisitedPage", lastVisitedUrl);
                    // console.log(window.location.pathname);
                } else {
                    // La session de l'utilisateur n'a pas expiré
                    setSessionExpired(false);
                }
            } catch (error) {
                console.error(
                    "Erreur lors de la vérification de l'expiration de la session :",
                    error
                );
                // Gérer les erreurs de requête ici
            }
        };

        // Appeler la fonction pour vérifier l'expiration de la session au chargement du composant
        checkSessionExpiration();
    }, []);

    // useEffect(() => {
    //     const storedRequestedPage = localStorage.getItem("lastVisitedPage");
    //     if (storedRequestedPage && isSessionExpired) {
    //         // La session de l'utilisateur a expiré et une page protégée a été demandée précédemment
    //         navigate("/auth/login");
    //     }
    // }, [isSessionExpired]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/auth/login", user);
        if (res.data.status == 1) {
            console.log(res.data.data.reseted_password);
            if (res.data.data.reseted_password == 1) {
                // Rediriger immédiatement vers la page de réinitialisation
                navigate("/auth/reset-password");
                window.location.reload();
                return;
                // Arrêter l'exécution ici
            }
            // Stocker l'URL de la page actuelle dans le localStorage
            // localStorage.setItem("lastVisitedPage", window.location.pathname);
            const lastVisitedPage = localStorage.getItem("lastVisitedPage");
            if (lastVisitedPage && lastVisitedPage !== "null") {
                navigate(lastVisitedPage);
            } else {
                // S'il n'y a pas de dernière page visitée, rediriger vers la page d'accueil
                navigate("/gestion_credit/home");
            }
            window.location.reload();
        } else if (res.data.status == 0) {
            // Afficher un message d'erreur
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 10000,
                confirmButtonText: "Okay",
            });
        } else if (res.data.status == "password_expired") {
            // Gérer l'expiration du mot de passe
            Swal.fire({
                title: "Expiration du mot de passe",
                text: res.data.msg,
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "Changer le mot de passe",
                denyButtonText: `Ignorer`,
            }).then((result) => {
                if (result.isConfirmed) {
                    // Rediriger vers la page de changement de mot de passe
                    setExpiredPassword(true);
                } else if (result.isDenied) {
                    // Ignorer la mise à jour du mot de passe et rediriger vers la page de connexion
                    navigate("/auth/skip-change-password");
                    window.location.reload();
                }
            });
        } else {
            setError(res.data.validate_error);
        }
    };

    const handleSubmitChangePassword = async (e) => {
        e.preventDefault();
        const res = await axios.post("/auth/login/change-password", user);
        if (res.data.status == 1) {
            navigate("/eco/home");
            window.location.reload();
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 10000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        }
    };
    // useEffect(() => {
    //     const storedRequestedPage = localStorage.getItem("lastVisitedPage");
    //     if (storedRequestedPage && isSessionExpired) {
    //         // La session de l'utilisateur a expiré et une page protégée a été demandée précédemment
    //         navigate("/auth/login");
    //     } else {
    //         navigate(storedRequestedPage);
    //         window.location.reload();
    //     }
    // }, [isSessionExpired]);

    // const handleSkipUpdatePassword = async (e) => {
    //     e.preventDefault();
    //     const res = await axios.post("/auth/login/change-password/skip", user);
    //     if (res.data.status == 1) {
    //         navigate("/");
    //         window.location.reload();
    //     } else if (res.data.status == 0) {
    //         Swal.fire({
    //             title: "Erreur",
    //             text: res.data.msg,
    //             icon: "error",
    //             timer: 6000,
    //             // showCancelButton: true,
    //             // cancelButtonColor: "#d33",
    //             confirmButtonText: "Okay",
    //         });
    //     }
    // };

    // Bouton désactivé si l'un des deux champs est vide
    const isDisabled = user.name.trim() === "" || user.password.trim() === "";

    return (
        <div className="container-fluid">
            {expiredPassword == false ? (
                <div className="row">
                    <div
                        className="col-md-6  rounded-0"
                        style={{
                            height: "100vh",
                            background: "#dcdcdc",
                            border: "25px solid #fff",
                            margin: "0px",
                        }}
                    >
                        <div style={{ marginTop: "120px" }}>
                            <div className={styles.register_section_warp}>
                                <div className={styles.register_section_right}>
                                    <form
                                        className={styles.form}
                                        onSubmit={handleSubmit}
                                    >
                                        <p style={{ textAlign: "center" }}>
                                            <h5>
                                                {" "}
                                                <strong>
                                                    {" "}
                                                    Bienvenue sur la plate forme
                                                </strong>{" "}
                                                <br />
                                                de traitement de dossier de
                                                crédit
                                            </h5>
                                        </p>
                                        <div className={styles.name}>
                                            <input
                                                className={styles.input_form}
                                                type="text"
                                                name="name"
                                                value={user.name}
                                                onChange={(e) =>
                                                    setUser((p) => ({
                                                        ...p,
                                                        name: e.target.value,
                                                    }))
                                                }
                                            />
                                            <input
                                                type="hidden"
                                                value={user.SkipNow}
                                            />
                                            <span className="text-danger">
                                                {error.name}
                                            </span>
                                            <label
                                                className={styles.label_form}
                                            >
                                                Nom d'utilisateur
                                            </label>
                                        </div>

                                        <div className="password">
                                            <input
                                                className={styles.input_form}
                                                type="password"
                                                name="password"
                                                value={user.password}
                                                onChange={(e) =>
                                                    setUser((p) => ({
                                                        ...p,
                                                        password:
                                                            e.target.value,
                                                    }))
                                                }
                                                // required
                                                // autoComplete="off"
                                                // placeholder="Xbshsd$##@31!"
                                            />
                                            <span className="text-danger">
                                                {error.password}
                                            </span>
                                            <label
                                                className={styles.label_form}
                                            >
                                                Mot de passe
                                            </label>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isDisabled}
                                            className={`w-full py-2 rounded text-white ${
                                                isDisabled
                                                    ? "bg-gray-400 cursor-not-allowed"
                                                    : "bg-blue-600"
                                            }`}
                                        >
                                            Connexion
                                        </button>
                                        <a
                                            style={{
                                                textDecoration: "none",
                                                textAlign: "center",
                                            }}
                                            href="/auth/forget-password"
                                        >
                                            J'ai oublié mon mot de passe
                                        </a>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <br />
                    </div>
                    <div
                        className="col-md-6 card rounded-0"
                        style={{
                            height: "100vh",
                            margin: "0px",
                        }}
                    >
                        <div className="container text-center my-4">
                            <img
                                src="/images/credit-image.jpg"
                                alt="Crédit"
                                className="img-fluid"
                                style={{ maxWidth: "570px", width: "100%" }}
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="col-md-6 card">
                    <div>
                        <div className={styles.register_section_warp}>
                            <div className={styles.register_section_right}>
                                <h2>Changement du mot de passe !</h2>

                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmitChangePassword}
                                >
                                    <div className={styles.name}>
                                        <input
                                            className={styles.input_form}
                                            type="password"
                                            name="Previouspassword"
                                            value={user.Previouspassword}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    Previouspassword:
                                                        e.target.value,
                                                }))
                                            }
                                            // required
                                            // placeholder=""
                                            // autoComplete="off"
                                        />
                                        <span className="text-danger">
                                            {error.Previouspassword}
                                        </span>
                                        <label className={styles.label_form}>
                                            Ancien mot de passe
                                        </label>
                                    </div>

                                    <div className="password">
                                        <input
                                            className={styles.input_form}
                                            type="password"
                                            name="newPassword"
                                            value={user.newPassword}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    newPassword: e.target.value,
                                                }))
                                            }
                                        />
                                        <span className="text-danger">
                                            {error.newPassword}
                                        </span>
                                        <label className={styles.label_form}>
                                            Nouveau Mot de passe
                                        </label>
                                    </div>

                                    <div className="password">
                                        <input
                                            className={styles.input_form}
                                            type="password"
                                            name="confirmNewPassword"
                                            value={user.confirmNewPassword}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    confirmNewPassword:
                                                        e.target.value,
                                                }))
                                            }
                                        />
                                        <span className="text-danger">
                                            {error.confirmNewPassword}
                                        </span>
                                        <label className={styles.label_form}>
                                            Confirmer votre mot de passe
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.button_effect}
                                    >
                                        Connexion
                                    </button>
                                    <a
                                        style={{ textDecoration: "none" }}
                                        href="/auth/forget-password"
                                    >
                                        J'ai oublié mon mot de passe
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            )}
        </div>
    );
};

export default LoginForm;
