import styles from "../styles/RegisterForm.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const Recuperation = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        email: "",
        password: "",
        password_confirm: "",
        code_recuperation: "",
    });
    const [isValide, setIsValide] = useState(0);

    const [error, setError] = useState([]);
    const handleSubmitStep1 = async (e) => {
        e.preventDefault();
        //CHECK IF EMAIL IS CORRECT STEP 1
        const res = await axios.post("/auth/recuperation", user);
        if (res.data.status == 1) {
            setIsValide(1);
            // navigate('/auth/forget-password')
            // window.location.reload()
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        } else {
            setError(res.data.validate_error);
        }
    };
    //CHECK THE SENT CODE IF IS CORRECT
    const handleSubmitStep2 = async (e) => {
        e.preventDefault();
        const res = await axios.post("/auth/recuperation-step-two", user);
        if (res.data.status == 1) {
            setIsValide(2);
            // navigate('/auth/login')
            // window.location.reload()
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        } else {
            setError(res.data.validate_error);
            // Swal.fire({
            //   title: "Erreur",
            //   text:"Veuillez completer tous les champs",
            //   icon: "error",
            //   timer: 3000,
            //   // showCancelButton: true,
            //   // cancelButtonColor: "#d33",
            //   confirmButtonText: "Okay",
            // });
        }
    };

    //CREATE NEW PASSWORD
    const handleSubmitStep3 = async (e) => {
        e.preventDefault();
        const res = await axios.post("/auth/recuperation-step-three", user);
        if (res.data.status == 1) {
            setIsValide(2);
            navigate("/auth/login");
            window.location.reload();
        } else if (res.data.status == 0) {
            Swal.fire({
                title: "Erreur",
                text: res.data.msg,
                icon: "error",
                timer: 3000,
                // showCancelButton: true,
                // cancelButtonColor: "#d33",
                confirmButtonText: "Okay",
            });
        } else {
            setError(res.data.validate_error);
        }
    };

    return (
        <div
            className="h-100 d-flex align-items-center justify-content-center"
            style={{ marginTop: "100px" }}
        >
            {isValide == 0 ? (
                <div className="col-md-6 card">
                    <div>
                        <div className={styles.register_section_warp}>
                            <div className={styles.register_section_right}>
                                <div className={styles.headersection}>
                                    <h3>Récuperation du mot de passe 1/3!</h3>
                                </div>
                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmitStep1}
                                >
                                    <div className={styles.email}>
                                        <input
                                            className={styles.input_form}
                                            type="email"
                                            name="email"
                                            value={user.email}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    email: e.target.value,
                                                }))
                                            }
                                            // required
                                            // placeholder=""
                                            // autoComplete="off"
                                        />
                                        <span className="text-danger">
                                            {error.email}
                                        </span>
                                        <label className={styles.label_form}>
                                            Votre adresse email
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.button_effect}
                                    >
                                        Envoyer
                                    </button>
                                    <a
                                        style={{ textDecoration: "none" }}
                                        href="/auth/login"
                                    >
                                        Retour à la connexion
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            ) : isValide == 1 ? (
                <div className="col-md-6 card">
                    <div>
                        <div className={styles.register_section_warp}>
                            <div className={styles.register_section_right}>
                                <div className={styles.headersection}>
                                    <h4>
                                        Veuillez renseigner le code vous envoyé
                                        par email étape 2/3!
                                    </h4>
                                </div>
                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmitStep2}
                                >
                                    <div className={styles.password}>
                                        <input
                                            className={styles.input_form}
                                            type="text"
                                            name="code_recuperation"
                                            value={user.code_recuperation}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    code_recuperation:
                                                        e.target.value,
                                                }))
                                            }
                                            required
                                            // placeholder=""
                                            // autoComplete="off"
                                        />
                                        <span className="text-danger">
                                            {error.code_recuperation}
                                        </span>
                                        <label className={styles.label_form}>
                                            Entrez le code
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.button_effect}
                                    >
                                        Envoyer
                                    </button>
                                    <a
                                        style={{ textDecoration: "none" }}
                                        href="/auth/login"
                                    >
                                        Retour à la connexion
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            ) : isValide == 2 ? (
                <div className="col-md-6 card">
                    <div>
                        <div className={styles.register_section_warp}>
                            <div className={styles.register_section_right}>
                                <div className={styles.headersection}>
                                    <h4>
                                        Récuperation de mot de passe étape 3/3!
                                    </h4>
                                </div>

                                <form
                                    className={styles.form}
                                    onSubmit={handleSubmitStep3}
                                >
                                    <div className={styles.password}>
                                        <input
                                            className={styles.input_form}
                                            type="password"
                                            name="password"
                                            value={user.password}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    password: e.target.value,
                                                }))
                                            }
                                            required
                                            // placeholder=""
                                            // autoComplete="off"
                                        />
                                        <span className="text-danger">
                                            {error.password}
                                        </span>
                                        <label className={styles.label_form}>
                                            Nouveau mot de passe
                                        </label>
                                    </div>
                                    <div className={styles.password}>
                                        <input
                                            className={styles.input_form}
                                            type="password"
                                            name="password_confirm"
                                            value={user.password_confirm}
                                            onChange={(e) =>
                                                setUser((p) => ({
                                                    ...p,
                                                    password_confirm:
                                                        e.target.value,
                                                }))
                                            }
                                            required
                                            // placeholder=""
                                            // autoComplete="off"
                                        />
                                        <span className="text-danger">
                                            {error.password_confirm}
                                        </span>
                                        <label className={styles.label_form}>
                                            Confirmez le mot de passe
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className={styles.button_effect}
                                    >
                                        Récuperer
                                    </button>
                                    <a
                                        style={{ textDecoration: "none" }}
                                        href="/auth/login"
                                    >
                                        Retour à la connexion
                                    </a>
                                </form>
                            </div>
                        </div>
                    </div>
                    <br />
                </div>
            ) : null}
        </div>
    );
};

export default Recuperation;
