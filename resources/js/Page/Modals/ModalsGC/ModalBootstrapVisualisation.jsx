import React, { useEffect, useState, useRef } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import "../../../styles/style.css";
import axios from "axios";
import Swal from "sweetalert2";

export default function ModalBootstrapVisualisation({ dossierId, onClose }) {
    const [dossier, setDossier] = useState(null);
    const modalRef = useRef(null);
    const bsModal = useRef(null);

    const [NumCompte, setNumCompte] = useState();
    const [NomCompte, setNomCompte] = useState();
    const [produit_credit, setproduit_credit] = useState();
    const [type_credit, settype_credit] = useState();
    const [recouvreur, setrecouvreur] = useState();
    const [montant_demande, setmontant_demande] = useState();
    const [date_demande, setdate_demande] = useState();
    // const formattedDate = date_demande.toISOString().split("T")[0];
    const [frequence_mensualite, setfrequence_mensualite] = useState();
    const [nombre_echeance, setnombre_echeance] = useState();
    const [NumDossier, setNumDossier] = useState();
    const [gestionnaire, setgestionnaire] = useState();
    const [source_fond, setsource_fond] = useState();
    const [monnaie, setmonnaie] = useState();
    const [duree_credit, setduree_credit] = useState();
    const [intervale_jrs, setintervale_jrs] = useState();
    const [taux_interet, settaux_interet] = useState();
    const [type_garantie, settype_garantie] = useState();
    const [valeur_comptable, setvaleur_comptable] = useState();
    const [num_titre, setnum_titre] = useState();
    const [valeur_garantie, setvaleur_garantie] = useState();
    const [description_titre, setdescription_titre] = useState();
    const [getDossierId, setGetDossierId] = useState();

    useEffect(() => {
        if (!dossierId) return;

        // Charger les données
        axios
            .get(`suivi-credit/dossiers/${dossierId}`)
            .then((res) => {
                const data = res.data.data; // récupère l'objet dossier complet

                setDossier(data); // stocke tout l'objet dossier dans dossier
                setNumCompte(data.NumCompte);
                setNomCompte(data.NomCompte);
                setproduit_credit(data.produit_credit);
                settype_credit(data.type_credit);
                setrecouvreur(data.recouvreur);
                setmontant_demande(data.montant_demande);
                setfrequence_mensualite(data.frequence_mensualite);
                setnombre_echeance(data.nombre_echeance);
                setNumDossier(data.NumDossier);
                setgestionnaire(data.gestionnaire);
                setsource_fond(data.source_fond);
                setmonnaie(data.monnaie);
                setduree_credit(data.duree_credit);
                setintervale_jrs(data.intervale_jrs);
                settaux_interet(data.taux_interet);
                settype_garantie(data.type_garantie);
                setvaleur_comptable(data.valeur_comptable);
                setnum_titre(data.num_titre);
                setvaleur_garantie(data.valeur_garantie);
                setdescription_titre(data.description_titre);
                setdate_demande(data.date_demande);
                setGetDossierId(data.id_credit);
            })
            .catch(() => setDossier(null));
    }, [dossierId]);

    useEffect(() => {
        if (!modalRef.current) return;
        bsModal.current = new window.bootstrap.Modal(modalRef.current);
        bsModal.current.show();

        // À la fermeture du modal
        modalRef.current.addEventListener("hidden.bs.modal", () => {
            onClose();
            setDossier(null);
        });

        return () => {
            // Nettoyage écouteurs si le composant est démonté
            if (modalRef.current)
                modalRef.current.removeEventListener(
                    "hidden.bs.modal",
                    () => {}
                );
        };
    }, [dossierId, onClose]);

    if (!dossierId) return null;

    const dateParser = (num) => {
        const options = {
            // weekday: "long",
            year: "numeric",
            month: "numeric",
            day: "numeric",
        };

        let timestamp = Date.parse(num);

        let date = new Date(timestamp).toLocaleDateString("fr-FR", options);

        return date.toString();
    };
    //PERMET DE MODIFIER UN DOSSIER
    const handleSubmitUpadate = async (e) => {
        e.preventDefault();
        let confirmation;
        confirmation = await Swal.fire({
            title: "Êtes-vous sûr?",
            text: "Vous êtes sûr ? vous êtes sur le point de supprimer ce dossier voulez vous continuer ?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Oui",
            cancelButtonText: "Non",
        });

        if (confirmation.isConfirmed) {
            const res = await axios.post(
                "gestion_credit/dossier-credit/upadate",
                {
                    NumCompte,
                    NomCompte,
                    produit_credit,
                    type_credit,
                    recouvreur,
                    montant_demande,
                    frequence_mensualite,
                    nombre_echeance,
                    NumDossier,
                    gestionnaire,
                    source_fond,
                    monnaie,
                    duree_credit,
                    intervale_jrs,
                    taux_interet,
                    type_garantie,
                    valeur_comptable,
                    num_titre,
                    valeur_garantie,
                    description_titre,
                    date_demande,
                    idDossier: getDossierId,
                }
            );
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Modication",
                    text: response.data.msg,
                    icon: "success",
                    timer: 8000,
                    confirmButtonText: "Okay",
                });
            }
        }
    };

    return (
        <div
            className="modal fade"
            tabIndex="-1"
            aria-hidden="true"
            ref={modalRef}
            id="modalVisualisation"
        >
            <div className="modal fade" id="modalVisualisationDossier">
                <div className="modal-dialog modal-xl">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Détails du dossier</h5>
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                            >
                                {" "}
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            {!dossier && <p>Chargement...</p>}
                            {dossier && (
                                <>
                                    <form>
                                        <div className="row">
                                            <div className="col-md-4 card rounded-0">
                                                <p>
                                                    <label className="label-style">
                                                        Num compte :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        value={NumCompte}
                                                        onChange={(e) =>
                                                            setNumCompte(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Nom Compte :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        value={NomCompte}
                                                        onChange={(e) =>
                                                            setNomCompte(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Produit de crédit :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                        value={produit_credit}
                                                        onChange={(e) =>
                                                            setproduit_credit(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Type crédit :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        value={type_credit}
                                                        onChange={(e) =>
                                                            settype_credit(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Recouvreur :
                                                    </label>{" "}
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        value={recouvreur}
                                                        onChange={(e) =>
                                                            setrecouvreur(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            value={recouvreur}
                                                        >
                                                            {recouvreur}
                                                        </option>
                                                        <option value="ALAME KUZANWA WILLY">
                                                            ALAME KUZANWA WILLY
                                                        </option>
                                                        <option value="AKILI SANGARA JULIEN">
                                                            AKILI SANGARA JULIEN
                                                        </option>
                                                        <option value="MAPENDO RUTH">
                                                            MAPENDO RUTH
                                                        </option>
                                                        <option value="LAVIE MATEMBERA">
                                                            LAVIE MATEMBERA
                                                        </option>
                                                        <option value="KANKINSINGI NGADU">
                                                            KANKINSINGI NGADU
                                                        </option>
                                                        <option value="NEEMA MULINGA GRACE">
                                                            NEEMA MULINGA GRACE
                                                        </option>
                                                        <option value="WIVINE ALISA">
                                                            WIVINE ALISA
                                                        </option>
                                                        <option value="MOSES KATEMBO">
                                                            MOSES KATEMBO
                                                        </option>
                                                        <option value="SAFARI KALEKERA">
                                                            SAFARI KALEKERA
                                                        </option>
                                                    </select>
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Montant demande :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "60px",
                                                        }}
                                                        value={montant_demande}
                                                        onChange={(e) =>
                                                            setmontant_demande(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Date demande :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={dateParser(
                                                            date_demande
                                                        )}
                                                        onChange={(e) =>
                                                            setdate_demande(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Frequence mens. :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        value={
                                                            frequence_mensualite
                                                        }
                                                        onChange={(e) =>
                                                            setfrequence_mensualite(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                            </div>
                                            <div className="col-md-4 card rounded-0">
                                                <p>
                                                    <label className="label-style">
                                                        Nbre Echnce:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "50px",
                                                        }}
                                                        value={nombre_echeance}
                                                        onChange={(e) =>
                                                            setnombre_echeance(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Gestionnaire:
                                                    </label>{" "}
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "150px",
                                                        }}
                                                        value={gestionnaire}
                                                        onChange={(e) =>
                                                            setgestionnaire(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option
                                                            value={gestionnaire}
                                                        >
                                                            {gestionnaire}
                                                        </option>
                                                        <option value="ALAME KUZANWA WILLY">
                                                            ALAME KUZANWA WILLY
                                                        </option>
                                                        <option value="AKILI SANGARA JULIEN">
                                                            AKILI SANGARA JULIEN
                                                        </option>
                                                        <option value="MAPENDO RUTH">
                                                            MAPENDO RUTH
                                                        </option>
                                                        <option value="LAVIE MATEMBERA">
                                                            LAVIE MATEMBERA
                                                        </option>
                                                        <option value="KANKINSINGI NGADU">
                                                            KANKINSINGI NGADU
                                                        </option>
                                                        <option value="NEEMA MULINGA GRACE">
                                                            NEEMA MULINGA GRACE
                                                        </option>
                                                        <option value="WIVINE ALISA">
                                                            WIVINE ALISA
                                                        </option>
                                                        <option value="MOSES KATEMBO">
                                                            MOSES KATEMBO
                                                        </option>
                                                        <option value="SAFARI KALEKERA">
                                                            SAFARI KALEKERA
                                                        </option>
                                                    </select>
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Source Fonds:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "100px",
                                                        }}
                                                        value={source_fond}
                                                        onChange={(e) =>
                                                            setsource_fond(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Monnaie:
                                                    </label>{" "}
                                                    <select
                                                        type="text"
                                                        className="input-style"
                                                        value={monnaie}
                                                        onChange={(e) =>
                                                            setmonnaie(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        <option value={monnaie}>
                                                            {monnaie}
                                                        </option>
                                                        <option value={monnaie}>
                                                            {monnaie == "CDF"
                                                                ? "USD"
                                                                : "CDF"}
                                                        </option>
                                                    </select>
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Durée crédit:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={duree_credit}
                                                        onChange={(e) =>
                                                            setduree_credit(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Intervalle jrs:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={intervale_jrs}
                                                        onChange={(e) =>
                                                            setintervale_jrs(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Taux intérêt:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={taux_interet}
                                                        onChange={(e) =>
                                                            settaux_interet(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                            </div>
                                            <div className="col-md-4 card rounded-0">
                                                <p>
                                                    <label className="label-style">
                                                        Type Garantie:
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={type_garantie}
                                                        onChange={(e) =>
                                                            settype_credit(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        valeur compt. :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={valeur_comptable}
                                                        onChange={(e) =>
                                                            setvaleur_comptable(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Num titre :
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={num_titre}
                                                        onChange={(e) =>
                                                            setnum_titre(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    <label className="label-style">
                                                        Va. gararantie :
                                                    </label>{" "}
                                                    <input
                                                        type="text"
                                                        className="input-style"
                                                        style={{
                                                            width: "80px",
                                                        }}
                                                        value={valeur_garantie}
                                                        onChange={(e) =>
                                                            setvaleur_garantie(
                                                                e.target.value
                                                            )
                                                        }
                                                    />
                                                </p>
                                                <p>
                                                    {/* <label className="label-style">
                                                        Descrition :
                                                    </label>{" "} */}
                                                    <textarea
                                                        className="input-style"
                                                        onChange={(e) =>
                                                            setdescription_titre(
                                                                e.target.value
                                                            )
                                                        }
                                                    >
                                                        {description_titre}
                                                    </textarea>
                                                </p>
                                                <p>
                                                    <button
                                                        onClick={
                                                            handleSubmitUpadate
                                                        }
                                                        className="btn btn-primary rounded-10 mt-1"
                                                    >
                                                        Modifier
                                                    </button>
                                                </p>
                                            </div>
                                        </div>
                                    </form>
                                    {dossier.images &&
                                        dossier.images.length > 0 && (
                                            <div>
                                                <h6>Images :</h6>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        flexWrap: "wrap",
                                                        gap: "10px",
                                                    }}
                                                >
                                                    {dossier.images.map(
                                                        (img, i) => (
                                                            <Zoom key={i}>
                                                                <img
                                                                    src={`/storage/${img}`}
                                                                    alt={`Image ${i}`}
                                                                    style={{
                                                                        maxWidth:
                                                                            "150px",
                                                                        maxHeight:
                                                                            "150px",
                                                                        objectFit:
                                                                            "cover",
                                                                        borderRadius:
                                                                            "8px",
                                                                        cursor: "zoom-in",
                                                                        boxShadow:
                                                                            "0 0 5px rgba(0,0,0,0.3)",
                                                                    }}
                                                                />
                                                            </Zoom>
                                                        )
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {dossier.pdfs &&
                                        dossier.pdfs.length > 0 && (
                                            <div className="mt-3">
                                                <h6>Documents PDF :</h6>
                                                {dossier.pdfs.map((pdf, i) => (
                                                    <a
                                                        key={i}
                                                        href={`/storage/${pdf}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-outline-secondary btn-sm me-2"
                                                    >
                                                        Voir PDF {i + 1}
                                                    </a>
                                                ))}
                                            </div>
                                        )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
