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
                    error,
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
        <div className="container-fluid p-0">
            {expiredPassword == false ? (
                <div className="row g-0 min-vh-100">
                    {/* Colonne gauche - Formulaire de connexion */}
                    <div
                        className="col-md-6 d-flex align-items-center justify-content-center"
                        style={{
                            background:
                                "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Effet de fond décoratif */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-50%",
                                right: "-20%",
                                width: "80%",
                                height: "150%",
                                background:
                                    "radial-gradient(circle, rgba(32,201,151,0.03) 0%, transparent 70%)",
                                borderRadius: "50%",
                            }}
                        ></div>

                        <div
                            className="w-100 px-4 px-md-5"
                            style={{ maxWidth: "500px", zIndex: 1 }}
                        >
                            <div className="text-center mb-4">
                                <div
                                    className="d-inline-flex align-items-center justify-content-center mb-3"
                                    style={{
                                        width: "70px",
                                        height: "70px",
                                        background:
                                            "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                        borderRadius: "18px",
                                        boxShadow:
                                            "0 8px 20px rgba(32,201,151,0.3)",
                                    }}
                                >
                                    <i
                                        className="fas fa-chart-line"
                                        style={{
                                            fontSize: "32px",
                                            color: "white",
                                        }}
                                    ></i>
                                </div>
                                <h2
                                    className="fw-bold mb-2"
                                    style={{ color: "#2c3e50" }}
                                >
                                    Bienvenue
                                </h2>
                                <p className="text-muted mb-0">
                                    Plateforme de traitement de dossier de
                                    crédit
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="mt-4">
                                <div className="mb-4">
                                    <label className="form-label fw-semibold small text-muted">
                                        Nom d'utilisateur
                                    </label>
                                    <div className="position-relative">
                                        <i
                                            className="fas fa-user position-absolute top-50 start-0 translate-middle-y ms-3"
                                            style={{
                                                color: "#adb5bd",
                                                fontSize: "14px",
                                            }}
                                        ></i>
                                        <input
                                            type="text"
                                            name="name"
                                            value={user.name}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    name: e.target.value,
                                                }))
                                            }
                                            className="form-control form-control-lg ps-5"
                                            style={{
                                                borderRadius: "12px",
                                                border: "1px solid #e9ecef",
                                                backgroundColor: "white",
                                                padding: "12px 16px 12px 40px",
                                                transition: "all 0.2s ease",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#20c997";
                                                e.currentTarget.style.boxShadow =
                                                    "0 0 0 3px rgba(32,201,151,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#e9ecef";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                            placeholder="Entrez votre nom d'utilisateur"
                                        />
                                    </div>
                                    {error.name && (
                                        <small className="text-danger d-block mt-1">
                                            {error.name}
                                        </small>
                                    )}
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold small text-muted">
                                        Mot de passe
                                    </label>
                                    <div className="position-relative">
                                        <i
                                            className="fas fa-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                                            style={{
                                                color: "#adb5bd",
                                                fontSize: "14px",
                                            }}
                                        ></i>
                                        <input
                                            type="password"
                                            name="password"
                                            value={user.password}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    password: e.target.value,
                                                }))
                                            }
                                            className="form-control form-control-lg ps-5"
                                            style={{
                                                borderRadius: "12px",
                                                border: "1px solid #e9ecef",
                                                backgroundColor: "white",
                                                padding: "12px 16px 12px 40px",
                                                transition: "all 0.2s ease",
                                            }}
                                            onFocus={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#20c997";
                                                e.currentTarget.style.boxShadow =
                                                    "0 0 0 3px rgba(32,201,151,0.1)";
                                            }}
                                            onBlur={(e) => {
                                                e.currentTarget.style.borderColor =
                                                    "#e9ecef";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                            placeholder="Entrez votre mot de passe"
                                        />
                                    </div>
                                    {error.password && (
                                        <small className="text-danger d-block mt-1">
                                            {error.password}
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={isDisabled}
                                    className="btn w-100 py-3 fw-semibold"
                                    style={{
                                        background: isDisabled
                                            ? "#adb5bd"
                                            : "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                        color: "white",
                                        borderRadius: "12px",
                                        border: "none",
                                        transition: "all 0.2s ease",
                                        cursor: isDisabled
                                            ? "not-allowed"
                                            : "pointer",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!isDisabled) {
                                            e.currentTarget.style.transform =
                                                "translateY(-2px)";
                                            e.currentTarget.style.boxShadow =
                                                "0 6px 16px rgba(32,201,151,0.4)";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!isDisabled) {
                                            e.currentTarget.style.transform =
                                                "translateY(0)";
                                            e.currentTarget.style.boxShadow =
                                                "none";
                                        }
                                    }}
                                >
                                    {/* {isDisabled ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Connexion...
                                        </>
                                    ) : (
                                        <>
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Se connecter
                                        </>
                                    )} */}
                                     <>
                                            <i className="fas fa-sign-in-alt me-2"></i>
                                            Se connecter
                                        </>
                                </button>

                                <div className="text-center mt-4">
                                    <a
                                        href="/auth/forget-password"
                                        className="text-decoration-none small"
                                        style={{
                                            color: "#20c997",
                                            transition: "color 0.2s ease",
                                        }}
                                        onMouseEnter={(e) =>
                                            (e.currentTarget.style.color =
                                                "#198764")
                                        }
                                        onMouseLeave={(e) =>
                                            (e.currentTarget.style.color =
                                                "#20c997")
                                        }
                                    >
                                        <i className="fas fa-key me-1"></i>
                                        J'ai oublié mon mot de passe
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* Colonne droite - Image et informations */}
                    <div
                        className="col-md-6 d-none d-md-flex align-items-center justify-content-center"
                        style={{
                            background:
                                "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                            position: "relative",
                            overflow: "hidden",
                        }}
                    >
                        {/* Effet de fond décoratif */}
                        <div
                            style={{
                                position: "absolute",
                                top: "-30%",
                                left: "-20%",
                                width: "120%",
                                height: "160%",
                                background:
                                    "radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)",
                                borderRadius: "50%",
                            }}
                        ></div>

                        <div className="text-center p-5" style={{ zIndex: 1 }}>
                            <div className="mb-4">
                                <div
                                    style={{
                                        width: "100px",
                                        height: "100px",
                                        background: "rgba(255,255,255,0.15)",
                                        borderRadius: "30px",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        backdropFilter: "blur(10px)",
                                    }}
                                >
                                    <i
                                        className="fas fa-hand-holding-usd"
                                        style={{
                                            fontSize: "48px",
                                            color: "white",
                                        }}
                                    ></i>
                                </div>
                            </div>
                            <h3 className="text-white fw-bold mb-3">
                                Gestion de crédit simplifiée
                            </h3>
                            <p className="text-white-50 mb-4">
                                Accédez à votre espace de travail pour gérer
                                efficacement les dossiers de crédit
                            </p>
                            <div className="d-flex gap-3 justify-content-center">
                                <div className="text-center">
                                    {/* <div className="text-white fw-bold h4">
                                        100+
                                    </div>
                                    <small className="text-white-50">
                                        Dossiers traités
                                    </small> */}
                                </div>
                                <div className="text-center">
                                    <div className="text-white fw-bold h4">
                                        24/7
                                    </div>
                                    <small className="text-white-50">
                                        Support disponible
                                    </small>
                                </div>
                                <div className="text-center">
                                    <div className="text-white fw-bold h4">
                                        Sécurisé
                                    </div>
                                    <small className="text-white-50">
                                        Données protégées
                                    </small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* Formulaire de changement de mot de passe */
                <div className="row g-0 min-vh-100">
                    <div className="col-md-6 offset-md-3 d-flex align-items-center justify-content-center py-5">
                        <div
                            className="w-100 px-4"
                            style={{ maxWidth: "500px" }}
                        >
                            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                                <div className="card-header bg-white border-0 pt-5 pb-0 text-center">
                                    <div
                                        className="d-inline-flex align-items-center justify-content-center mb-3"
                                        style={{
                                            width: "60px",
                                            height: "60px",
                                            background:
                                                "linear-gradient(135deg, #ffc107 0%, #ffb347 100%)",
                                            borderRadius: "16px",
                                            boxShadow:
                                                "0 4px 12px rgba(255,193,7,0.3)",
                                        }}
                                    >
                                        <i
                                            className="fas fa-key"
                                            style={{
                                                fontSize: "28px",
                                                color: "white",
                                            }}
                                        ></i>
                                    </div>
                                    <h3 className="fw-bold mb-1">
                                        Changement du mot de passe
                                    </h3>
                                    <p className="text-muted small">
                                        Pour des raisons de sécurité, veuillez
                                        changer votre mot de passe
                                    </p>
                                </div>

                                <div className="card-body p-4">
                                    <form onSubmit={handleSubmitChangePassword}>
                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small text-muted">
                                                Ancien mot de passe
                                            </label>
                                            <div className="position-relative">
                                                <i
                                                    className="fas fa-lock position-absolute top-50 start-0 translate-middle-y ms-3"
                                                    style={{
                                                        color: "#adb5bd",
                                                        fontSize: "14px",
                                                    }}
                                                ></i>
                                                <input
                                                    type="password"
                                                    name="Previouspassword"
                                                    value={
                                                        user.Previouspassword
                                                    }
                                                    onChange={(e) =>
                                                        setUser((p) => ({
                                                            ...p,
                                                            Previouspassword:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    className="form-control form-control-lg ps-5"
                                                    style={{
                                                        borderRadius: "12px",
                                                        border: "1px solid #e9ecef",
                                                        backgroundColor:
                                                            "#f8f9fa",
                                                        padding:
                                                            "12px 16px 12px 40px",
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#ffc107";
                                                        e.currentTarget.style.backgroundColor =
                                                            "white";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#e9ecef";
                                                        e.currentTarget.style.backgroundColor =
                                                            "#f8f9fa";
                                                    }}
                                                    placeholder="Entrez votre ancien mot de passe"
                                                />
                                            </div>
                                            {error.Previouspassword && (
                                                <small className="text-danger d-block mt-1">
                                                    {error.Previouspassword}
                                                </small>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small text-muted">
                                                Nouveau mot de passe
                                            </label>
                                            <div className="position-relative">
                                                <i
                                                    className="fas fa-key position-absolute top-50 start-0 translate-middle-y ms-3"
                                                    style={{
                                                        color: "#adb5bd",
                                                        fontSize: "14px",
                                                    }}
                                                ></i>
                                                <input
                                                    type="password"
                                                    name="newPassword"
                                                    value={user.newPassword}
                                                    onChange={(e) =>
                                                        setUser((p) => ({
                                                            ...p,
                                                            newPassword:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    className="form-control form-control-lg ps-5"
                                                    style={{
                                                        borderRadius: "12px",
                                                        border: "1px solid #e9ecef",
                                                        backgroundColor:
                                                            "#f8f9fa",
                                                        padding:
                                                            "12px 16px 12px 40px",
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#ffc107";
                                                        e.currentTarget.style.backgroundColor =
                                                            "white";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#e9ecef";
                                                        e.currentTarget.style.backgroundColor =
                                                            "#f8f9fa";
                                                    }}
                                                    placeholder="Entrez votre nouveau mot de passe"
                                                />
                                            </div>
                                            {error.newPassword && (
                                                <small className="text-danger d-block mt-1">
                                                    {error.newPassword}
                                                </small>
                                            )}
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label fw-semibold small text-muted">
                                                Confirmer le mot de passe
                                            </label>
                                            <div className="position-relative">
                                                <i
                                                    className="fas fa-check-circle position-absolute top-50 start-0 translate-middle-y ms-3"
                                                    style={{
                                                        color: "#adb5bd",
                                                        fontSize: "14px",
                                                    }}
                                                ></i>
                                                <input
                                                    type="password"
                                                    name="confirmNewPassword"
                                                    value={
                                                        user.confirmNewPassword
                                                    }
                                                    onChange={(e) =>
                                                        setUser((p) => ({
                                                            ...p,
                                                            confirmNewPassword:
                                                                e.target.value,
                                                        }))
                                                    }
                                                    className="form-control form-control-lg ps-5"
                                                    style={{
                                                        borderRadius: "12px",
                                                        border: "1px solid #e9ecef",
                                                        backgroundColor:
                                                            "#f8f9fa",
                                                        padding:
                                                            "12px 16px 12px 40px",
                                                        transition:
                                                            "all 0.2s ease",
                                                    }}
                                                    onFocus={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#ffc107";
                                                        e.currentTarget.style.backgroundColor =
                                                            "white";
                                                    }}
                                                    onBlur={(e) => {
                                                        e.currentTarget.style.borderColor =
                                                            "#e9ecef";
                                                        e.currentTarget.style.backgroundColor =
                                                            "#f8f9fa";
                                                    }}
                                                    placeholder="Confirmez votre nouveau mot de passe"
                                                />
                                            </div>
                                            {error.confirmNewPassword && (
                                                <small className="text-danger d-block mt-1">
                                                    {error.confirmNewPassword}
                                                </small>
                                            )}
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn w-100 py-3 fw-semibold"
                                            style={{
                                                background:
                                                    "linear-gradient(135deg, #ffc107 0%, #ffb347 100%)",
                                                color: "white",
                                                borderRadius: "12px",
                                                border: "none",
                                                transition: "all 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(-2px)";
                                                e.currentTarget.style.boxShadow =
                                                    "0 6px 16px rgba(255,193,7,0.4)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform =
                                                    "translateY(0)";
                                                e.currentTarget.style.boxShadow =
                                                    "none";
                                            }}
                                        >
                                            <i className="fas fa-save me-2"></i>
                                            Changer le mot de passe
                                        </button>

                                        <div className="text-center mt-4">
                                            <a
                                                href="/auth/forget-password"
                                                className="text-decoration-none small"
                                                style={{
                                                    color: "#ffc107",
                                                    transition:
                                                        "color 0.2s ease",
                                                }}
                                                onMouseEnter={(e) =>
                                                    (e.currentTarget.style.color =
                                                        "#ffb347")
                                                }
                                                onMouseLeave={(e) =>
                                                    (e.currentTarget.style.color =
                                                        "#ffc107")
                                                }
                                            >
                                                <i className="fas fa-question-circle me-1"></i>
                                                J'ai oublié mon mot de passe
                                            </a>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LoginForm;
