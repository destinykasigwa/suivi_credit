import styles from "../styles/RegisterForm.module.css";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({
        userName: "",
        email: "",
        confirmpassword: "",
        password: "",
    });
    const [error, setError] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await axios.post("/auth/regiter", user);
        if (res.data.status == 1) {
            // Swal.fire({
            //   title: "Succès",
            //   text:res.data.msg,
            //   icon: "success",
            //   timer: 3000,
            //   // showCancelButton: true,
            //   // cancelButtonColor: "#d33",
            //   confirmButtonText: "Okay",
            // });
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

    return (
        <div
            className="h-100 d-flex align-items-center justify-content-center"
            style={{ marginTop: "100px" }}
        >
            <div className="col-md-6 card">
                <div>
                    <div className={styles.register_section_warp}>
                        <div className={styles.register_section_right}>
                            <h2>Register !</h2>

                            {/* {error.length!=0 ?
                error.map((err)=>{
                  return(
                    <ul className="bg-danger" style={{marginLeft:"50px",marginRight:"200px"}}>
                      <li>
                     {err.validate_error}
                     </li>
                    </ul>
                  )
                })
               
               :""} */}

                            <form
                                className={styles.form}
                                onSubmit={handleSubmit}
                            >
                                <div className={styles.userName}>
                                    <input
                                        className={styles.input_form}
                                        type="text"
                                        name="userName"
                                        value={user.userName}
                                        onChange={(e) =>
                                            setUser((p) => ({
                                                ...p,
                                                userName: e.target.value,
                                            }))
                                        }
                                        // required
                                        // placeholder=""
                                        // autoComplete="off"
                                    />
                                    <span className="text-danger">
                                        {error.userName}
                                    </span>
                                    <label className={styles.label_form}>
                                        Nom d'utilisateur
                                    </label>
                                </div>
                                <div className="email">
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
                                        // placeholder="Jhondeo@gamil.com"
                                        // autoComplete="off"
                                    />
                                    <span className="text-danger">
                                        {error.email}
                                    </span>
                                    <label className={styles.label_form}>
                                        Email
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
                                                password: e.target.value,
                                            }))
                                        }
                                        // required
                                        // autoComplete="off"
                                        // placeholder="Xbshsd$##@31!"
                                    />
                                    <span className="text-danger">
                                        {error.password}
                                    </span>
                                    <label className={styles.label_form}>
                                        Mot de passe
                                    </label>
                                </div>
                                <div className="confirmpassword">
                                    <input
                                        className={styles.input_form}
                                        type="password"
                                        name="confirmpassword"
                                        value={user.confirmpassword}
                                        onChange={(e) =>
                                            setUser((p) => ({
                                                ...p,
                                                confirmpassword: e.target.value,
                                            }))
                                        }
                                        // required
                                        // placeholder="+380639752361"
                                        // autoComplete="off"
                                    />
                                    <span className="text-danger">
                                        {error.confirmpassword}
                                    </span>
                                    <label className={styles.label_form}>
                                        Confirmez mot de passe
                                    </label>
                                </div>
                                {/* <div className="error">
                  addUserResults.isError? addUserResults.error.data: ''
                </div> */}{" "}
                                <button
                                    type="submit"
                                    className={styles.button_effect}
                                >
                                    Submit
                                </button>
                                {/* <p className={styles.login_desc}>
                  Have An Account Please Log In
                </p> */}
                            </form>
                            <br />
                            <br />
                        </div>
                    </div>
                </div>
                <br />
            </div>
        </div>
    );
};

export default RegisterForm;
