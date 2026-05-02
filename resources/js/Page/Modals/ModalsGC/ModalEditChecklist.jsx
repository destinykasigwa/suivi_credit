import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "../../../styles/style.css";

export default function ModalEditChecklist({
    dossierId,
    NumDossier,
    onClose,
    onUpdate,
}) {
    const [form, setForm] = useState({
        agence: "",
        date_etablissement: "",
        nom_demandeur: "",
        numero_dossier: "",
        montant: "",
        type_client: "",
        piece_identite: false,
        lettre_demande: false,
        formulaire_pret: false,
        contrat_travail: false,
        fiche_paye: false,
        recommandation: false,
        caution_employeur: false,
        document_activite: false,
        bilan: false,
        rencontre_adc: "",
        capacite_remboursement: "",
        fiabilite: "",
        avis_positif: "",
        date_adc: "",
        nom_adc: "",
        decision_ctc: false,
        decision_cc: false,
        contrat_signe: false,
        garanties_constituees: false,
        rencontre_client: false,
        hypothèque: false,
        lettre_garantie: false,
        domiciliation_salaire: false,
        dat: false,
        aval: false,
        nantissement: false,
        salaire: false,
        date_superviseur: "",
        nom_superviseur: "",
        date_analyste: "",
        nom_analyste: "",
        commentaire_analyste: "",
    });

    const [signaturePreview, setSignaturePreview] = useState(null);
    const [signatureAnalystePreview, setSignatureAnalystePreview] =
        useState(null);
    const [signatureFile, setSignatureFile] = useState(null);
    const [signatureAnalysteFile, setSignatureAnalysteFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [isLoadingBar, setIsLoadingBar] = useState(false);
  

    const fileInputRef = useRef(null);
    const fileInputRefAnalyste = useRef(null);

    // Charger les données existantes
    useEffect(() => {
        const fetchChecklist = async () => {
            try {
                const res = await axios.get(
                    `/gestion_credit/dossier/credit-checklists/${dossierId}`,
                );
                if (res.data.status === 1 && res.data.data) {
                    const data = res.data.data;
                    setForm({
                        agence: data.agence || "",
                        date_etablissement: data.date_etablissement || "",
                        nom_demandeur: data.nom_demandeur || "",
                        numero_dossier: data.numero_dossier || "",
                        montant: data.montant || "",
                        type_client: data.type_client || "",
                        piece_identite: !!data.piece_identite,
                        lettre_demande: !!data.lettre_demande,
                        formulaire_pret: !!data.formulaire_pret,
                        contrat_travail: !!data.contrat_travail,
                        fiche_paye: !!data.fiche_paye,
                        recommandation: !!data.recommandation,
                        caution_employeur: !!data.caution_employeur,
                        document_activite: !!data.document_activite,
                        bilan: !!data.bilan,
                        rencontre_adc:
                            data.rencontre_adc === 1
                                ? "oui"
                                : data.rencontre_adc === 0
                                  ? "non"
                                  : "",
                        capacite_remboursement:
                            data.capacite_remboursement === 1
                                ? "oui"
                                : data.capacite_remboursement === 0
                                  ? "non"
                                  : "",
                        fiabilite:
                            data.fiabilite === 1
                                ? "oui"
                                : data.fiabilite === 0
                                  ? "non"
                                  : "",
                        avis_positif:
                            data.avis_positif === 1
                                ? "oui"
                                : data.avis_positif === 0
                                  ? "non"
                                  : "",
                        date_adc: data.date_adc || "",
                        nom_adc: data.nom_adc || "",
                        decision_ctc: !!data.decision_ctc,
                        decision_cc: !!data.decision_cc,
                        contrat_signe: !!data.contrat_signe,
                        garanties_constituees: !!data.garanties_constituees,
                        rencontre_client: !!data.rencontre_client,
                        hypothèque: !!data.hypothèque,
                        lettre_garantie: !!data.lettre_garantie,
                        domiciliation_salaire: !!data.domiciliation_salaire,
                        dat: !!data.dat,
                        aval: !!data.aval,
                        nantissement: !!data.nantissement,
                        salaire: !!data.salaire,
                        date_superviseur: data.date_superviseur || "",
                        nom_superviseur: data.nom_superviseur || "",
                        date_analyste: data.date_analyste || "",
                        nom_analyste: data.nom_analyste || "",
                        commentaire_analyste: data.commentaire_analyste || "",
                    });
                    // Gestion des signatures avec vérification du chemin
                    if (data.signature) {
                        const sigUrl = data.signature.startsWith("/")
                            ? data.signature
                            : `/storage/${data.signature}`;
                        setSignaturePreview(sigUrl);
                    }
                    if (data.signature_analyste) {
                        const sigUrl = data.signature_analyste.startsWith("/")
                            ? data.signature_analyste
                            : `/storage/${data.signature_analyste}`;
                        setSignatureAnalystePreview(sigUrl);
                    }

                    console.log(
                        "Signature analyste brute :",
                        data.signature_analyste,
                    );
                }
            } catch (error) {
                Swal.fire(
                    "Erreur",
                    "Impossible de charger la checklist",
                    "error",
                );
                onClose();
            } finally {
                setInitialLoading(false);
            }
        };
        fetchChecklist();
    }, [dossierId, onClose]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Pour le superviseur
    const handleSignatureSuperviseurChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
            Swal.fire("Format non supporté", "JPEG ou PNG uniquement", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire("Fichier trop volumineux", "Max 5 Mo", "error");
            return;
        }
        setSignatureFile(file);
        setSignaturePreview(URL.createObjectURL(file));
    };

    const handleDeleteSignatureSuperviseur = () => {
        setSignatureFile(null);
        setSignaturePreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const dataToSend = new FormData();
        // Ajouter tous les champs du formulaire
        Object.keys(form).forEach((key) => {
            dataToSend.append(key, form[key]);
        });
        if (signatureFile) dataToSend.append("signature", signatureFile);
        if (signatureAnalysteFile)
            dataToSend.append("signature_analyste", signatureAnalysteFile);
        dataToSend.append("_method", "PUT"); // Pour Laravel

        try {
            await axios.post(
                `/gestion_credit/dossier/credit-checklists/${dossierId}`,
                dataToSend,
                {
                    headers: { "Content-Type": "multipart/form-data" },
                },
            );
            Swal.fire("Succès", "Checklist mise à jour", "success");
            if (onUpdate) onUpdate();
            onClose();
        } catch (error) {
            Swal.fire("Erreur", "Échec de la mise à jour", "error");
        } finally {
            setLoading(false);
        }
    };

    // Pour l'analyste
    const handleSignatureAnalysteChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (!file.type.match("image/jpeg") && !file.type.match("image/png")) {
            Swal.fire("Format non supporté", "JPEG ou PNG uniquement", "error");
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire("Fichier trop volumineux", "Max 5 Mo", "error");
            return;
        }
        setSignatureAnalysteFile(file);
        setSignatureAnalystePreview(URL.createObjectURL(file));
    };

    const handleDeleteSignatureAnalyste = () => {
        setSignatureAnalysteFile(null);
        setSignatureAnalystePreview(null);
        if (fileInputRefAnalyste.current)
            fileInputRefAnalyste.current.value = "";
    };

     if (initialLoading)
        return <div className="text-center p-5">Chargement...</div>;
//  if (initialLoading) {
//         return (
//             <div
//                 className="d-flex justify-content-center align-items-center"
//                 style={{ minHeight: "400px" }}
//             >
//                 <div className="text-center">
//                     <div
//                         className="spinner-border text-primary mb-3"
//                         style={{ width: "3rem", height: "3rem" }}
//                     >
//                         <span className="visually-hidden">Chargement...</span>
//                     </div>
//                     <p className="text-muted">Chargement de la check-list...</p>
//                 </div>
//             </div>
//         );
//     }
    return (
            
        <div
            className="modal fade show"
            tabIndex="-1"
            style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.5)",
                zIndex: 1050,
            }}
        >
            <style>{`
                .modal-body label {
                    color: #212529 !important;
                }
            `}</style>

            <div className="modal-dialog modal-xl">
                <div className="modal-content border-0 shadow rounded-3">
                    <div className="modal-header bg-primary text-white">
                        <h5 className="mb-0">
                            Modification de la Checklist N°: #
                            <strong>{NumDossier ?? NumDossier}</strong>
                        </h5>
                        <button
                            type="button"
                            className="btn-close btn-close-white"
                            onClick={onClose}
                        ></button>
                    </div>

                    {/* Corps du formulaire */}
                    <div
                        className="modal-body p-4"
                        style={{ maxHeight: "80vh", overflowY: "auto" }}
                    >

                        <div className="container mt-4">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div
                                    className="card-header bg-gradient-primary text-white rounded-top-3"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                    }}
                                >
                                    <h5 className="mb-0">
                                        Formulaire de vérification
                                    </h5>
                                </div>

                                <div className="card-body">
                                    {/* GENERAL */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-info-circle me-2"></i>
                                        I. Généralités
                                    </h6>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="modern-label">
                                                Agence
                                            </label>
                                            <input
                                                name="agence"
                                                className="form-control"
                                                placeholder="Agence"
                                                value={form.agence}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Date
                                            </label>
                                            <input
                                                type="date"
                                                name="date_etablissement"
                                                className="form-control"
                                                value={form.date_etablissement}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* DEMANDEUR */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-user me-2"></i>
                                        II. Références du demandeur
                                    </h6>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Nom du demandeur
                                            </label>
                                            <input
                                                name="nom_demandeur"
                                                className="form-control"
                                                placeholder="Nom"
                                                value={form.nom_demandeur}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                N° Dossier
                                            </label>
                                            <input
                                                name="numero_dossier"
                                                className="form-control"
                                                placeholder="N° Dossier"
                                                value={form.numero_dossier}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <label className="form-label fw-semibold">
                                                Montant
                                            </label>
                                            <input
                                                name="montant"
                                                className="form-control"
                                                placeholder="Montant"
                                                value={form.montant}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mt-2">
                                            <label className="form-label fw-semibold">
                                                Type client
                                            </label>
                                            <select
                                                name="type_client"
                                                className="form-select"
                                                value={form.type_client}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Type client
                                                </option>
                                                <option value="salarie">
                                                    Salarié
                                                </option>
                                                <option value="mpme">
                                                    MPME
                                                </option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* DOCUMENTS */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-file-alt me-2"></i>
                                        III. Documents
                                    </h6>
                                    <div className="mb-3">
                                        <label className="fw-semibold">
                                            Généraux
                                        </label>
                                        <div className="mt-2">
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="piece_identite"
                                                    checked={
                                                        form.piece_identite
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Pièce d'identité
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="lettre_demande"
                                                    checked={
                                                        form.lettre_demande
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Lettre demande
                                                </label>
                                            </div>
                                            <div className="form-check">
                                                <input
                                                    type="checkbox"
                                                    className="form-check-input"
                                                    name="formulaire_pret"
                                                    checked={
                                                        form.formulaire_pret
                                                    }
                                                    onChange={handleChange}
                                                />
                                                <label className="form-check-label">
                                                    Formulaire prêt
                                                </label>
                                            </div>
                                        </div>
                                    </div>

                                    {form.type_client === "salarie" && (
                                        <div className="mb-3">
                                            <label className="fw-semibold">
                                                Salarié
                                            </label>
                                            <div className="mt-2">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="contrat_travail"
                                                        checked={
                                                            form.contrat_travail
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Contrat travail
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="fiche_paye"
                                                        checked={
                                                            form.fiche_paye
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Fiche de paye
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="recommandation"
                                                        checked={
                                                            form.recommandation
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Recommandation
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="caution_employeur"
                                                        checked={
                                                            form.caution_employeur
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Caution employeur
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {form.type_client === "mpme" && (
                                        <div className="mb-3">
                                            <label className="fw-semibold">
                                                MPME
                                            </label>
                                            <div className="mt-2">
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="document_activite"
                                                        checked={
                                                            form.document_activite
                                                        }
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Document activité
                                                    </label>
                                                </div>
                                                <div className="form-check">
                                                    <input
                                                        type="checkbox"
                                                        className="form-check-input"
                                                        name="bilan"
                                                        checked={form.bilan}
                                                        onChange={handleChange}
                                                    />
                                                    <label className="form-check-label">
                                                        Bilan
                                                    </label>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ANALYSE */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-chart-line me-2"></i>
                                        IV. Analyse ADC
                                    </h6>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <select
                                                name="rencontre_adc"
                                                className="form-select mb-2"
                                                value={form.rencontre_adc}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Rencontré ?
                                                </option>
                                                <option value="oui">Oui</option>
                                                <option value="non">Non</option>
                                            </select>
                                            <select
                                                name="capacite_remboursement"
                                                className="form-select mb-2"
                                                value={
                                                    form.capacite_remboursement
                                                }
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Capacité remboursement
                                                </option>
                                                <option value="oui">Oui</option>
                                                <option value="non">Non</option>
                                            </select>
                                            <select
                                                name="fiabilite"
                                                className="form-select mb-2"
                                                value={form.fiabilite}
                                                onChange={handleChange}
                                            >
                                                <option value="">
                                                    Infos fiables ?
                                                </option>
                                                <option value="oui">Oui</option>
                                                <option value="non">Non</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6">
                                            <select
                                                name="avis_positif"
                                                className="form-select mb-2"
                                                value={form.avis_positif}
                                                onChange={handleChange}
                                            >
                                                <option value="">Avis</option>
                                                <option value="oui">
                                                    Positif
                                                </option>
                                                <option value="non">
                                                    Négatif
                                                </option>
                                            </select>
                                            <input
                                                type="date"
                                                name="date_adc"
                                                className="form-control mb-2"
                                                value={form.date_adc}
                                                onChange={handleChange}
                                                placeholder="Date ADC"
                                            />
                                            <input
                                                name="nom_adc"
                                                className="form-control mb-3"
                                                placeholder="Nom ADC"
                                                value={form.nom_adc}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* VALIDATION */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-check-circle me-2"></i>
                                        V. Avant Contrat
                                    </h6>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="decision_ctc"
                                                checked={form.decision_ctc}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Décision CTC
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="decision_cc"
                                                checked={form.decision_cc}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Décision CC
                                            </label>
                                        </div>
                                    </div>

                                    {/* DECAISSEMENT */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-money-bill-wave me-2"></i>
                                        VI. Avant Décaissement
                                    </h6>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="contrat_signe"
                                                checked={form.contrat_signe}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Contrat signé
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="garanties_constituees"
                                                checked={
                                                    form.garanties_constituees
                                                }
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Garanties constituées
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="rencontre_client"
                                                checked={form.rencontre_client}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Rencontre client
                                            </label>
                                        </div>
                                    </div>

                                    {/* GARANTIES */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-shield-alt me-2"></i>
                                        VII. Garanties
                                    </h6>
                                    <div className="mb-3">
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="hypothèque"
                                                checked={form.hypothèque}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Hypothèque
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="lettre_garantie"
                                                checked={form.lettre_garantie}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Lettre garantie
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="domiciliation_salaire"
                                                checked={
                                                    form.domiciliation_salaire
                                                }
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Domiciliation salaire
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="dat"
                                                checked={form.dat}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                DAT
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="aval"
                                                checked={form.aval}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Aval
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="nantissement"
                                                checked={form.nantissement}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Nantissement
                                            </label>
                                        </div>
                                        <div className="form-check">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                name="salaire"
                                                checked={form.salaire}
                                                onChange={handleChange}
                                            />
                                            <label className="form-check-label">
                                                Salaire
                                            </label>
                                        </div>
                                    </div>

                                    {/* SECTION SUPERVISEUR */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-signature me-2"></i>
                                        VIII. Validation Superviseur
                                    </h6>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Date de validation
                                            </label>
                                            <input
                                                type="date"
                                                name="date_superviseur"
                                                className="form-control"
                                                value={form.date_superviseur}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Nom du superviseur
                                            </label>
                                            <input
                                                name="nom_superviseur"
                                                className="form-control"
                                                placeholder="Superviseur"
                                                value={form.nom_superviseur}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    {/* Zone de signature */}
                                    <div className="mb-4">
                                        <label className="form-label fw-semibold">
                                            Signature du superviseur
                                        </label>
                                        <div className="border rounded-3 p-3">
                                            <div className="text-center mb-3">
                                                {signaturePreview ? (
                                                    <div className="position-relative d-inline-block">
                                                        <img
                                                            src={
                                                                signaturePreview
                                                            }
                                                            alt="Signature"
                                                            style={{
                                                                maxHeight:
                                                                    "150px",
                                                                maxWidth:
                                                                    "100%",
                                                            }}
                                                            className="border rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle-y"
                                                            onClick={
                                                                handleDeleteSignatureSuperviseur
                                                            } // ← modifié
                                                            style={{
                                                                borderRadius:
                                                                    "50%",
                                                                padding:
                                                                    "0 6px",
                                                            }}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-muted py-4">
                                                        <i className="fas fa-pen fa-3x mb-2"></i>
                                                        <p>
                                                            Aucune signature
                                                            téléchargée
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="d-flex justify-content-center gap-3">
                                                <label className="btn btn-outline-primary">
                                                    <i className="fas fa-upload me-2"></i>
                                                    Télécharger la signature
                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        accept="image/jpeg,image/png"
                                                        onChange={
                                                            handleSignatureSuperviseurChange
                                                        } // ← modifié
                                                        style={{
                                                            display: "none",
                                                        }}
                                                    />
                                                </label>
                                                {signaturePreview && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={
                                                            handleDeleteSignatureSuperviseur
                                                        } // ← modifié
                                                    >
                                                        <i className="fas fa-trash-alt me-2"></i>
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                            <small className="text-muted d-block text-center mt-2">
                                                Formats acceptés : JPEG, PNG
                                                (max 5 Mo)
                                            </small>
                                        </div>
                                    </div>

                                    {/* SECTION ANALYSTE */}
                                    <h6 className="text-primary mb-3">
                                        <i className="fas fa-user-check me-2"></i>
                                        IX. Informations Analyste
                                    </h6>
                                    <div className="row mb-3">
                                        <div className="col-md-12">
                                            <label class="form-label fw-semibold">
                                                Commentaire Analyste
                                            </label>{" "}
                                            <br />
                                            <textarea
                                                className="modern-textarea"
                                                rows="3"
                                                placeholder="Écrivez ici..."
                                                name="commentaire_analyste"
                                                value={
                                                    form.commentaire_analyste
                                                }
                                                onChange={handleChange}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-md-12 mb-3">
                                        <label className="form-label fw-semibold">
                                            Signature de l'analyste
                                        </label>
                                        <div className="border rounded-3 p-3">
                                            <div className="text-center mb-3">
                                                {signatureAnalystePreview ? (
                                                    <div className="position-relative d-inline-block">
                                                        <img
                                                            src={
                                                                signatureAnalystePreview
                                                            }
                                                            alt="Signature Analyste"
                                                            style={{
                                                                maxHeight:
                                                                    "150px",
                                                                maxWidth:
                                                                    "100%",
                                                            }}
                                                            className="border rounded"
                                                        />
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-danger position-absolute top-0 end-0 translate-middle-y"
                                                            onClick={
                                                                handleDeleteSignatureAnalyste
                                                            }
                                                            style={{
                                                                borderRadius:
                                                                    "50%",
                                                                padding:
                                                                    "0 6px",
                                                            }}
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="text-muted py-4">
                                                        <i className="fas fa-pen fa-3x mb-2"></i>
                                                        <p>
                                                            Aucune signature
                                                            téléchargée
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="d-flex justify-content-center gap-3">
                                                <label className="btn btn-outline-primary">
                                                    <i className="fas fa-upload me-2"></i>
                                                    Télécharger la signature
                                                    <input
                                                        type="file"
                                                        ref={
                                                            fileInputRefAnalyste
                                                        }
                                                        accept="image/jpeg,image/png"
                                                        onChange={
                                                            handleSignatureAnalysteChange
                                                        }
                                                        style={{
                                                            display: "none",
                                                        }}
                                                    />
                                                </label>
                                                {signatureAnalystePreview && (
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-danger"
                                                        onClick={
                                                            handleDeleteSignatureAnalyste
                                                        }
                                                    >
                                                        <i className="fas fa-trash-alt me-2"></i>
                                                        Supprimer
                                                    </button>
                                                )}
                                            </div>
                                            <small className="text-muted d-block text-center mt-2">
                                                Formats acceptés : JPEG, PNG
                                                (max 5 Mo)
                                            </small>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Date d'analyse
                                            </label>
                                            <input
                                                type="date"
                                                name="date_analyste"
                                                className="form-control"
                                                value={form.date_analyste}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <label className="form-label fw-semibold">
                                                Nom de l'analyste
                                            </label>
                                            <input
                                                name="nom_analyste"
                                                className="form-control"
                                                placeholder="Analyste"
                                                value={form.nom_analyste}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className="btn btn-success w-100 py-2"
                                        style={{
                                            background:
                                                "linear-gradient(135deg, #20c997 0%, #198764 100%)",
                                            border: "none",
                                        }}
                                    >
                                        <i className="fas fa-save me-2"></i>
                                        {loading
                                            ? "Mise à jour..."
                                            : "Mettre à jour"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button className="btn btn-secondary" onClick={onClose}>
                            Annuler
                        </button>
                        {/* <button
                            className="btn btn-success"
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {loading ? "Mise à jour..." : "Mettre à jour"}
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
