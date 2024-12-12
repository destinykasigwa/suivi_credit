import styles from "../styles/Global.module.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";
import { Bars } from "react-loader-spinner";
// import DataTable from "react-data-table-component";

const Comptes = () => {
    // const [company, setcompany] = useState({
    //     name: "",
    //     email: "",
    // });
    //SOCIETE ATTRIBUTE
    const [sigle, setSigle] = useState();
    const [denomination, setDenomination] = useState();
    const [adresse, setAdresse] = useState();
    const [forme, setForme] = useState();
    const [ville, setVille] = useState();
    const [departement, setDepartement] = useState();
    const [pays, setPays] = useState();
    const [tel, setTel] = useState();
    const [email, setEmail] = useState();
    const [idnat, setIdnat] = useState();
    const [nrc, setNrc] = useState();
    const [num_impot, setNum_impot] = useState();
    const [companyId, setCompanyId] = useState();
    const [date_system, setDate_system] = useState();
    const [company_logo, setCompany_logo] = useState();
    const [isloading1, setIsloading1] = useState(false);
    const [isloading2, setIsloading2] = useState(false);
    const [isloading3, setisloading3] = useState(false);
    const [isloading4, setisloading4] = useState(false);
    const [fetchCompany, setFetchCompany] = useState();

    //EPARGNE ADHESION ATTRIBUTE
    const [Ecompte_courant, setEcompte_courant] = useState();
    const [Ecompte_courant_usd, setEcompte_courant_usd] = useState();
    const [Ecompte_courant_cdf, setEcompte_courant_cdf] = useState();
    const [Edebiteur, setEdebiteur] = useState();
    const [Edebiteur_usd, setEdebiteur_usd] = useState();
    const [Edebiteur_fc, setEdebiteur_fc] = useState();
    const [Etontine_usd, setEtontine_usd] = useState();
    const [Etontine_fc, setEtontine_fc] = useState();
    const [D_a_terme, setD_a_terme] = useState();
    const [solde_minimum, setsolde_minimum] = useState();
    const [frais_adhesion, setfrais_adhesion] = useState();
    const [part_social, setpart_social] = useState();
    const [droit_entree, setdroit_entree] = useState();
    const [compte_papeterie, setcompte_papeterie] = useState();
    const [compte_papeterie_fc, setcompte_papeterie_fc] = useState();
    const [compte_papeterie_usd, setcompte_papeterie_usd] = useState();
    const [valeur_droit_entree, setvaleur_droit_entree] = useState();
    const [valeur_droit_entree_pysique, setvaleur_droit_entree_pysique] =
        useState();
    const [valeur_droit_entree_moral, setvaleur_droit_entree_moral] =
        useState();
    const [valeur_frais_papeterie, setvaleur_frais_papeterie] = useState();
    const [groupe_c_virement, setgroupe_c_virement] = useState();
    const [groupe_c_fond_non_servi, setgroupe_c_fond_non_servi] = useState();
    const [compte_revenu_virement_usd, setcompte_revenu_virement_usd] =
        useState();
    const [compte_revenu_virement_fc, setcompte_revenu_virement_fc] =
        useState();
    const [taux_tva_sur_vir, settaux_tva_sur_vir] = useState();
    const [arrondir_frais_vir, setarrondir_frais_vir] = useState();
    const [Edebiteur_radie_usd, setEdebiteur_radie_usd] = useState();
    const [Edebiteur_radie_fc, setEdebiteur_radie_fc] = useState();
    const [engagement_sur_eparg_usd, setengagement_sur_eparg_usd] = useState();
    const [engagement_sur_eparg_fc, setengagement_sur_eparg_fc] = useState();
    const [rec_sur_epargne_radie_usd, setrec_sur_epargne_radie_usd] =
        useState();
    const [rec_sur_epargne_radie_fc, setrec_sur_epargne_radie_fc] = useState();
    const [AdhesionEpID, setAdhesionEpID] = useState();

    const [fetchAdhesionEpargneData, setFetchAdhesionEpargneData] = useState();

    //PORTE FEUILLE ATTRIBUTE

    const [pre_ordinanire, setpre_ordinanire] = useState();
    const [pre_ordinanire_au_dirigent, setpre_ordinanire_au_dirigent] =
        useState();
    const [pre_ordinanire_au_membres, setpre_ordinanire_au_membres] =
        useState();
    const [pre_ordinanire_au_agents, setpre_ordinanire_au_agents] = useState();
    const [pre_en_billet_delabre, setpre_en_billet_delabre] = useState();
    const [
        pre_en_billet_delabre_aux_dirigent,
        setpre_en_billet_delabre_aux_dirigent,
    ] = useState();
    const [
        pre_en_billet_delabre_aux_membres,
        setpre_en_billet_delabre_aux_membres,
    ] = useState();
    const [
        pre_en_billet_delabre_aux_agents,
        setpre_en_billet_delabre_aux_agents,
    ] = useState();
    const [grpe_compte_pret_r_HB, setgrpe_compte_pret_r_HB] = useState();
    const [compte_charge_radiation, setcompte_charge_radiation] = useState();
    const [compte_a_credite_HB, setcompte_a_credite_HB] = useState();
    const [compte_a_credite_au_bilan, setcompte_a_credite_au_bilan] =
        useState();
    const [interet_pret_ordin_NE, setinteret_pret_ordin_NE] = useState();
    const [interet_pret_ordin_echu, setinteret_pret_ordin_echu] = useState();
    const [interet_pret_en_billet_DL_NE, setinteret_pret_en_billet_DL_NE] =
        useState();
    const [interet_pret_en_billet_DL_E, setinteret_pret_en_billet_DL_E] =
        useState();
    const [pret_ordi_en_retard, setpret_ordi_en_retard] = useState();
    const [un_a_30_jours, setun_a_30_jours] = useState();
    const [trente_et_un_a_60_jours, settrente_et_un_a_60_jours] = useState();
    const [soixante_et_un_a_90_jours, setsoixante_et_un_a_90_jours] =
        useState();
    const [nonante_et_un_a_90_jours, setnonante_et_un_a_90_jours] = useState();
    const [plus_de_180_jours, setplus_de_180_jours] = useState();
    const [p_billet_delabre_retard, setp_billet_delabre_retard] = useState();
    const [un_a_30_jours_del, setun_a_30_jours_del] = useState();
    const [trente_et_un_a_60_jours_del, settrente_et_un_a_60_jours_del] =
        useState();
    const [soixante_et_un_a_90_jours_del, setsoixante_et_un_a_90_jours_del] =
        useState();
    const [nonante_et_un_a_180_jours_del, setnonante_et_un_a_180_jours_del] =
        useState();
    const [plus_de_180_jours_del, setplus_de_180_jours_del] = useState();
    const [provision_pret_ordinaire, setprovision_pret_ordinaire] = useState();
    const [provision_un_a_30_jours, setprovision_un_a_30_jours] = useState();
    const [taux_provision_1_30_jours, settaux_provision_1_30_jours] =
        useState();
    const [
        provision_trente_et_un_a_60_jours,
        setprovision_trente_et_un_a_60_jours,
    ] = useState();
    const [taux_provision_31_60_jours, settaux_provision_31_60_jours] =
        useState();
    const [
        provision_soixante_et_un_a_90_jours,
        setprovision_soixante_et_un_a_90_jours,
    ] = useState();
    const [taux_provision_61_90_jours, settaux_provision_61_90_jours] =
        useState();
    const [
        provision_nonante_et_un_a_180_jours,
        setprovision_nonante_et_un_a_180_jours,
    ] = useState();
    const [taux_provision_91_180_jours, settaux_provision_91_180_jours] =
        useState();
    const [provision_plus_180_jours, setprovision_plus_180_jours] = useState();
    const [taux_provision_plus_180_jours, settaux_provision_plus_180_jours] =
        useState();
    const [provision_pret_BD, setprovision_pret_BD] = useState();
    const [provision_un_a_30_jours_BD, setprovision_un_a_30_jours_BD] =
        useState();
    const [taux_provision_1_30_jours_BD, settaux_provision_1_30_jours_BD] =
        useState();
    const [
        provision_trente_et_un_a_60_jours_BD,
        setprovision_trente_et_un_a_60_jours_BD,
    ] = useState();
    const [taux_provision_31_60_jours_BD, settaux_provision_31_60_jours_BD] =
        useState();
    const [
        provision_soixante_et_un_a_90_jours_BD,
        setprovision_soixante_et_un_a_90_jours_BD,
    ] = useState();
    const [taux_provision_61_90_jours_BD, settaux_provision_61_90_jours_BD] =
        useState();
    const [
        provision_nonante_et_un_a_180_jours_BD,
        setprovision_nonante_et_un_a_180_jours_BD,
    ] = useState();
    const [taux_provision_91_180_jours_BD, settaux_provision_91_180_jours_BD] =
        useState();
    const [provision_plus_180_jours_BD, setprovision_plus_180_jours_BD] =
        useState();
    const [
        taux_provision_plus_180_jours_BD,
        settaux_provision_plus_180_jours_BD,
    ] = useState();
    const [porteFeuilleConfigID, setPorteFeuilleConfigID] = useState();

    //PASS WORD EXPIRATE ATTRIBUTE
    const [password_expired_days, setpassword_expired_days] = useState();
    const [password_expired_days_user_id, setpassword_expired_days_user_id] =
        useState();

    //LOGIN ATTEMPT ATTRIBUTE
    const [login_attempt, setlogin_attempt] = useState();
    const [IntituleCompteNew, setIntituleCompteNew] = useState();
    //ADD NEW ACCOUNT ATTRIBUTE
    const [RefGroupe, setRefGroupe] = useState();
    const [RefSousGroupe, setRefSousGroupe] = useState();
    const [RefCadre, setRefCadre] = useState();
    const [RefTypeCompte, setRefTypeCompte] = useState();

    const [fetchCreatedAccount, setfetchCreatedAccount] = useState();
    const [showAccountSession, setshowAccountSession] = useState(true);
    const [showCommissionPanel, setShowCommissionPanel] = useState();
    const [isClosing, setisClosing] = useState(false);
    useEffect(() => {
        getCompanyData();
    }, []);

    const handleToggleChange = (e) => {
        setShowCommissionPanel(e.target.checked);
    };

    const ChargeCompte = async (e) => {
        e.preventDefault();
        setshowAccountSession(false);
        const res = await axios.get("/eco/pages/comptes-cree/data");
        if (res.data.status == 1) {
            setfetchCreatedAccount(res.data.data);
        }
    };

    const hideAccountSession = async (e) => {
        e.preventDefault();
        setfetchCreatedAccount(false);
        setshowAccountSession(true);
    };
    //GET COMPANY DATA
    const getCompanyData = async () => {
        const res = await axios.get("/eco/page/params/company");
        if (res.data.status == 1) {
            //GET COMPANY DATA
            setFetchCompany(res.data.data_company);
            setSigle(res.data.data_company.sigle);
            setDenomination(res.data.data_company.denomination);
            setAdresse(res.data.data_company.adresse);
            setForme(res.data.data_company.forme);
            setVille(res.data.data_company.ville);
            setDepartement(res.data.data_company.departement);
            setPays(res.data.data_company.pays);
            setTel(res.data.data_company.tel);
            setEmail(res.data.data_company.email);
            setIdnat(res.data.data_company.idnat);
            setNrc(res.data.data_company.nrc);
            setNum_impot(res.data.data_company.num_impot);
            setDate_system(res.data.data_company.date_system);
            setCompanyId(res.data.data_company.id);
            setCompany_logo(res.data.data_company.company_logo);

            //GET ADHESION EPARGNE DATA
            setFetchAdhesionEpargneData(res.data.adhesion_epargne_data);
            console.log(fetchAdhesionEpargneData);
            setEcompte_courant(res.data.adhesion_epargne_data.Ecompte_courant);
            setEcompte_courant_usd(
                res.data.adhesion_epargne_data.Ecompte_courant_usd
            );
            setEcompte_courant_cdf(
                res.data.adhesion_epargne_data.Ecompte_courant_cdf
            );
            setEdebiteur(res.data.adhesion_epargne_data.Edebiteur);
            setEdebiteur_usd(res.data.adhesion_epargne_data.Edebiteur_usd);

            setEdebiteur_fc(res.data.adhesion_epargne_data.Edebiteur_fc);
            setEtontine_usd(res.data.adhesion_epargne_data.Etontine_usd);
            setEtontine_fc(res.data.adhesion_epargne_data.Etontine_fc);
            setD_a_terme(res.data.adhesion_epargne_data.D_a_terme);
            setsolde_minimum(res.data.adhesion_epargne_data.solde_minimum);
            setfrais_adhesion(res.data.adhesion_epargne_data.frais_adhesion);
            setpart_social(res.data.adhesion_epargne_data.part_social);
            setdroit_entree(res.data.adhesion_epargne_data.droit_entree);
            setcompte_papeterie(
                res.data.adhesion_epargne_data.compte_papeterie
            );
            setcompte_papeterie_fc(
                res.data.adhesion_epargne_data.compte_papeterie_fc
            );
            setcompte_papeterie_usd(
                res.data.adhesion_epargne_data.compte_papeterie_usd
            );
            setvaleur_droit_entree(
                res.data.adhesion_epargne_data.valeur_droit_entree
            );
            setvaleur_droit_entree_pysique(
                res.data.adhesion_epargne_data.valeur_droit_entree_pysique
            );
            setvaleur_droit_entree_moral(
                res.data.adhesion_epargne_data.valeur_droit_entree_moral
            );
            setvaleur_frais_papeterie(
                res.data.adhesion_epargne_data.valeur_frais_papeterie
            );
            setgroupe_c_virement(
                res.data.adhesion_epargne_data.groupe_c_virement
            );
            setgroupe_c_fond_non_servi(
                res.data.adhesion_epargne_data.groupe_c_fond_non_servi
            );
            setcompte_revenu_virement_usd(
                res.data.adhesion_epargne_data.compte_revenu_virement_usd
            );
            setcompte_revenu_virement_fc(
                res.data.adhesion_epargne_data.compte_revenu_virement_fc
            );
            settaux_tva_sur_vir(
                res.data.adhesion_epargne_data.taux_tva_sur_vir
            );
            setarrondir_frais_vir(
                res.data.adhesion_epargne_data.arrondir_frais_vir
            );
            setEdebiteur_radie_usd(
                res.data.adhesion_epargne_data.Edebiteur_radie_usd
            );
            setEdebiteur_radie_fc(
                res.data.adhesion_epargne_data.Edebiteur_radie_fc
            );
            setengagement_sur_eparg_usd(
                res.data.adhesion_epargne_data.engagement_sur_eparg_usd
            );
            setengagement_sur_eparg_fc(
                res.data.adhesion_epargne_data.engagement_sur_eparg_fc
            );
            setrec_sur_epargne_radie_usd(
                res.data.adhesion_epargne_data.rec_sur_epargne_radie_usd
            );
            setrec_sur_epargne_radie_fc(
                res.data.adhesion_epargne_data.rec_sur_epargne_radie_fc
            );
            setAdhesionEpID(res.data.adhesion_epargne_data.id);

            //GET PORTE FEUILLE ATTRIBUTE

            setpre_ordinanire(res.data.porte_feuille_data.pre_ordinanire);
            setpre_ordinanire_au_dirigent(
                res.data.porte_feuille_data.pre_ordinanire_au_dirigent
            );
            setpre_ordinanire_au_membres(
                res.data.porte_feuille_data.pre_ordinanire_au_membres
            );
            setpre_ordinanire_au_agents(
                res.data.porte_feuille_data.pre_ordinanire_au_agents
            );
            setpre_en_billet_delabre(
                res.data.porte_feuille_data.pre_en_billet_delabre
            );
            setpre_en_billet_delabre_aux_dirigent(
                res.data.porte_feuille_data.pre_en_billet_delabre_aux_dirigent
            );
            setpre_en_billet_delabre_aux_membres(
                res.data.porte_feuille_data.pre_en_billet_delabre_aux_membres
            );
            setpre_en_billet_delabre_aux_membres(
                res.data.porte_feuille_data.pre_en_billet_delabre_aux_membres
            );
            setpre_en_billet_delabre_aux_agents(
                res.data.porte_feuille_data.pre_en_billet_delabre_aux_agents
            );
            setgrpe_compte_pret_r_HB(
                res.data.porte_feuille_data.grpe_compte_pret_r_HB
            );
            setcompte_charge_radiation(
                res.data.porte_feuille_data.compte_charge_radiation
            );
            setcompte_a_credite_HB(
                res.data.porte_feuille_data.compte_a_credite_HB
            );
            setcompte_a_credite_au_bilan(
                res.data.porte_feuille_data.compte_a_credite_au_bilan
            );
            setinteret_pret_ordin_NE(
                res.data.porte_feuille_data.interet_pret_ordin_NE
            );
            setinteret_pret_ordin_echu(
                res.data.porte_feuille_data.interet_pret_ordin_echu
            );
            setinteret_pret_en_billet_DL_NE(
                res.data.porte_feuille_data.interet_pret_en_billet_DL_NE
            );
            setinteret_pret_en_billet_DL_E(
                res.data.porte_feuille_data.interet_pret_en_billet_DL_E
            );
            setpret_ordi_en_retard(
                res.data.porte_feuille_data.pret_ordi_en_retard
            );
            setpret_ordi_en_retard(
                res.data.porte_feuille_data.pret_ordi_en_retard
            );
            setun_a_30_jours(res.data.porte_feuille_data.un_a_30_jours);
            settrente_et_un_a_60_jours(
                res.data.porte_feuille_data.trente_et_un_a_60_jours
            );
            setsoixante_et_un_a_90_jours(
                res.data.porte_feuille_data.soixante_et_un_a_90_jours
            );
            setnonante_et_un_a_90_jours(
                res.data.porte_feuille_data.nonante_et_un_a_90_jours
            );
            setplus_de_180_jours(res.data.porte_feuille_data.plus_de_180_jours);
            setp_billet_delabre_retard(
                res.data.porte_feuille_data.p_billet_delabre_retard
            );
            setun_a_30_jours_del(res.data.porte_feuille_data.un_a_30_jours_del);
            settrente_et_un_a_60_jours_del(
                res.data.porte_feuille_data.trente_et_un_a_60_jours_del
            );
            setsoixante_et_un_a_90_jours_del(
                res.data.porte_feuille_data.soixante_et_un_a_90_jours_del
            );
            setnonante_et_un_a_180_jours_del(
                res.data.porte_feuille_data.nonante_et_un_a_180_jours_del
            );
            setplus_de_180_jours_del(
                res.data.porte_feuille_data.plus_de_180_jours_del
            );
            setprovision_pret_ordinaire(
                res.data.porte_feuille_data.provision_pret_ordinaire
            );
            setprovision_un_a_30_jours(
                res.data.porte_feuille_data.provision_un_a_30_jours
            );
            settaux_provision_1_30_jours(
                res.data.porte_feuille_data.taux_provision_1_30_jours
            );
            setprovision_trente_et_un_a_60_jours(
                res.data.porte_feuille_data.provision_trente_et_un_a_60_jours
            );
            settaux_provision_31_60_jours(
                res.data.porte_feuille_data.taux_provision_31_60_jours
            );
            setprovision_soixante_et_un_a_90_jours(
                res.data.porte_feuille_data.provision_soixante_et_un_a_90_jours
            );
            settaux_provision_61_90_jours(
                res.data.porte_feuille_data.taux_provision_61_90_jours
            );
            setprovision_nonante_et_un_a_180_jours(
                res.data.porte_feuille_data.provision_nonante_et_un_a_180_jours
            );
            settaux_provision_91_180_jours(
                res.data.porte_feuille_data.taux_provision_91_180_jours
            );
            setprovision_plus_180_jours(
                res.data.porte_feuille_data.provision_plus_180_jours
            );
            settaux_provision_plus_180_jours(
                res.data.porte_feuille_data.taux_provision_plus_180_jours
            );
            setprovision_pret_BD(res.data.porte_feuille_data.provision_pret_BD);
            setprovision_un_a_30_jours_BD(
                res.data.porte_feuille_data.provision_un_a_30_jours_BD
            );
            settaux_provision_1_30_jours_BD(
                res.data.porte_feuille_data.taux_provision_1_30_jours_BD
            );
            setprovision_trente_et_un_a_60_jours_BD(
                res.data.porte_feuille_data.provision_trente_et_un_a_60_jours_BD
            );
            settaux_provision_31_60_jours_BD(
                res.data.porte_feuille_data.taux_provision_31_60_jours_BD
            );
            setprovision_soixante_et_un_a_90_jours_BD(
                res.data.porte_feuille_data
                    .provision_soixante_et_un_a_90_jours_BD
            );
            settaux_provision_61_90_jours_BD(
                res.data.porte_feuille_data.taux_provision_61_90_jours_BD
            );
            setprovision_nonante_et_un_a_180_jours_BD(
                res.data.porte_feuille_data
                    .provision_nonante_et_un_a_180_jours_BD
            );
            settaux_provision_91_180_jours_BD(
                res.data.porte_feuille_data.taux_provision_91_180_jours_BD
            );
            setprovision_plus_180_jours_BD(
                res.data.porte_feuille_data.provision_plus_180_jours_BD
            );
            settaux_provision_plus_180_jours_BD(
                res.data.porte_feuille_data.taux_provision_plus_180_jours_BD
            );
            setPorteFeuilleConfigID(res.data.porte_feuille_data.id);

            //PASSWORD EXPIRATE DATE
            setpassword_expired_days(
                res.data.users_password_expirate.password_expired_days
            );
            setpassword_expired_days_user_id(
                res.data.users_password_expirate.id
            );
            //LOGIN ATTEMPT
            setlogin_attempt(res.data.login_attempt_data);
            setShowCommissionPanel(
                res.data.adhesion_epargne_data.show_commission_pannel
            );
            console.log(login_attempt);
        }
    };
    //UPDATE COMPANY DATA

    const updateCompanyData = async (e) => {
        e.preventDefault();
        setIsloading1(true);
        const res = await axios.post("/eco/page/params/edit-company", {
            companyId,
            sigle,
            denomination,
            adresse,
            forme,
            ville,
            departement,
            pays,
            tel,
            email,
            idnat,
            nrc,
            num_impot,
            date_system,
        });
        if (res.data.status == 1) {
            setIsloading1(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            setIsloading1(false);
        }
    };

    const updateCompanyLogo = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("companyId", companyId);
            formData.append("company_logo", company_logo);
            const config = {
                Headers: {
                    accept: "application/json",
                    "Accept-Language": "en-US,en;q=0.8",
                    "content-type": "multipart/form-data",
                },
            };

            const url = "/eco/page/params/edit-company_logo";
            axios
                .post(url, formData, config)
                .then((response) => {
                    if (response.data.status == 1) {
                        Swal.fire({
                            title: "Succès",
                            text: response.data.msg,
                            icon: "success",
                            button: "OK!",
                        });
                    } else {
                        Swal.fire({
                            title: "Erreur",
                            text: response.data.msg,
                            icon: "error",
                            button: "OK!",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                });
        } catch (error) {
            throw error;
        }
    };

    //UPDATE ADHESION AND EPARGNE CONFIG
    const updateAdhesionEpargneConfig = async (e) => {
        console.log(AdhesionEpID);
        e.preventDefault();
        setIsloading2(true);
        const res = await axios.post("/eco/page/params/edit-adhesion-epargne", {
            AdhesionEpID,
            Ecompte_courant,
            Ecompte_courant_usd,
            Ecompte_courant_cdf,
            Edebiteur,
            Edebiteur_usd,
            Edebiteur_fc,
            Etontine_usd,
            Etontine_fc,
            D_a_terme,
            solde_minimum,
            frais_adhesion,
            part_social,
            droit_entree,
            compte_papeterie,
            compte_papeterie_fc,
            compte_papeterie_usd,
            valeur_droit_entree,
            valeur_droit_entree_pysique,
            valeur_droit_entree_moral,
            valeur_frais_papeterie,
            groupe_c_virement,
            groupe_c_fond_non_servi,
            compte_revenu_virement_usd,
            compte_revenu_virement_fc,
            taux_tva_sur_vir,
            arrondir_frais_vir,
            Edebiteur_radie_usd,
            Edebiteur_radie_fc,
            engagement_sur_eparg_usd,
            engagement_sur_eparg_fc,
            rec_sur_epargne_radie_usd,
            rec_sur_epargne_radie_fc,
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
            setIsloading2(false);
        }
    };

    //UPDATE PORTE FEUILLE CONFIG

    const updatePorteFeuilleConfig = async (e) => {
        e.preventDefault();
        setisloading3(true);
        const res = await axios.post(
            "/eco/page/params/edit-portefeuille-config",
            {
                porteFeuilleConfigID,
                pre_ordinanire,
                pre_ordinanire_au_dirigent,
                pre_ordinanire_au_membres,
                pre_ordinanire_au_agents,
                pre_en_billet_delabre,
                pre_en_billet_delabre_aux_dirigent,
                pre_en_billet_delabre_aux_membres,
                pre_en_billet_delabre_aux_agents,
                grpe_compte_pret_r_HB,
                compte_charge_radiation,
                compte_a_credite_HB,
                compte_a_credite_au_bilan,
                interet_pret_ordin_NE,
                interet_pret_ordin_echu,
                interet_pret_en_billet_DL_NE,
                interet_pret_en_billet_DL_E,
                pret_ordi_en_retard,
                un_a_30_jours,
                trente_et_un_a_60_jours,
                soixante_et_un_a_90_jours,
                nonante_et_un_a_90_jours,
                plus_de_180_jours,
                p_billet_delabre_retard,
                un_a_30_jours_del,
                trente_et_un_a_60_jours_del,
                soixante_et_un_a_90_jours_del,
                nonante_et_un_a_180_jours_del,
                plus_de_180_jours_del,
                provision_pret_ordinaire,
                provision_un_a_30_jours,
                taux_provision_1_30_jours,
                provision_trente_et_un_a_60_jours,
                taux_provision_31_60_jours,
                provision_soixante_et_un_a_90_jours,
                taux_provision_61_90_jours,
                provision_nonante_et_un_a_180_jours,
                taux_provision_91_180_jours,
                provision_plus_180_jours,
                taux_provision_plus_180_jours,
                provision_pret_BD,
                provision_un_a_30_jours_BD,
                taux_provision_1_30_jours_BD,
                provision_trente_et_un_a_60_jours_BD,
                taux_provision_31_60_jours_BD,
                provision_soixante_et_un_a_90_jours_BD,
                taux_provision_61_90_jours_BD,
                provision_nonante_et_un_a_180_jours_BD,
                taux_provision_91_180_jours_BD,
                provision_plus_180_jours_BD,
                taux_provision_plus_180_jours_BD,
            }
        );
        if (res.data.status == 1) {
            setisloading3(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        } else {
            setisloading3(false);
        }
    };

    // const FraisAdhesionChecked = async (e) => {
    //     if (e.target.checked) {
    //         setfrais_adhesion(1);
    //     }
    // };

    //UPDATE DAYS OF THE USER EXPIRATE PASSWORD
    const updateExpirateDays = async (e) => {
        e.preventDefault();
        console.log(showAccountSession);
        const res = await axios.post(
            "/eco/page/params/edit-expirate-date-config",
            {
                password_expired_days_user_id,
                password_expired_days,
                login_attempt,
                showCommissionPanel,
            }
        );
        if (res.data.status == 1) {
            setisloading3(false);
            Swal.fire({
                title: "Succès",
                text: res.data.msg,
                icon: "success",
                timer: 3000,
                confirmButtonText: "Okay",
            });
        }
    };

    const saveNewCompte = async (e) => {
        e.preventDefault();
        if (RefSousGroupe.length === 4) {
            setisloading4(true);
            const res = await axios.post("/eco/pages/comptes/compte/add-new", {
                IntituleCompteNew,
                RefGroupe,
                RefSousGroupe,
                RefCadre,
                RefTypeCompte,
            });
            if (res.data.status == 1) {
                Swal.fire({
                    title: "Ajout Compte",
                    text: res.data.msg,
                    icon: "success",
                    button: "OK!",
                });
                document
                    .getElementById("saveNewAccountBtn")
                    .setAttribute("disabled", "disabled");
                setisloading4(false);
            } else if (res.data.status == 0) {
                Swal.fire({
                    title: "Erreur",
                    text: res.data.msg,
                    icon: "error",
                    button: "OK!",
                });
                setisloading4(false);
            }
        } else {
            Swal.fire({
                title: "Erreur",
                text: "La Réf sous groupe doit être de 4 chiffres",
                icon: "error",
                button: "OK!",
            });
        }
    };

    const addNewAccount = async (e) => {
        e.preventDefault();
        setIntituleCompteNew("");
        setRefGroupe("");
        setRefSousGroupe("");
        setRefCadre("");
        setRefTypeCompte("");
        document
            .getElementById("saveNewAccountBtn")
            .removeAttribute("disabled", "disabled");
    };

    //PERMET DE CLOTURER L'EXERCICE EN COURS

    const clotureAnuelle = async (e) => {
        e.preventDefault();
        setisClosing(true);
        Swal.fire({
            title: "Confirmation !",
            text: "Etes vous sûr d'effectuer la clotûre annuelle ?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Oui Clotûrer!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    "Confirmation!",
                    "La clotûre annuelle se passe en arrière-plan, veuillez patienter.",
                    "success"
                ).then(async function () {
                    try {
                        const res = await axios.get(
                            "/eco/comptes/cloture/annuelle"
                        );
                        if (res.data.status === 1) {
                            Swal.fire({
                                title: "Succès",
                                text: res.data.msg,
                                icon: "success",
                                timer: 8000,
                                confirmButtonText: "Okay",
                            });
                            setTimeout(function () {
                                window.location.reload();
                            }, 2000);
                        } else {
                            Swal.fire({
                                title: "Erreur",
                                text: res.data.msg,
                                icon: "error",
                                timer: 8000,
                                confirmButtonText: "Okay",
                            });
                        }
                    } catch (error) {
                        setisClosing(false);
                        Swal.fire({
                            title: "Erreur",
                            text: "Une erreur est survenue pendant la clotûre annuelle.",
                            icon: "error",
                            timer: 8000,
                            confirmButtonText: "Okay",
                        });
                        console.error(error);
                    } finally {
                        setisClosing(false);
                    }
                });
            } else {
                setisClosing(false);
            }
        });
    };

    const exportTableData = (tableId) => {
        const s2ab = (s) => {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i !== s.length; ++i)
                view[i] = s.charCodeAt(i) & 0xff;
            return buf;
        };

        const table = document.getElementById(tableId);
        const wb = XLSX.utils.table_to_book(table);
        const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
        const fileName = `table_${tableId}.xlsx`;
        saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            fileName
        );
    };
    const exportToPDF = () => {
        const content = document.getElementById("content-to-download-balance");

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 3 }).then((canvas) => {
            const paddingTop = 50;
            const paddingRight = 50;
            const paddingBottom = 50;
            const paddingLeft = 50;

            const canvasWidth = canvas.width + paddingLeft + paddingRight;
            const canvasHeight = canvas.height + paddingTop + paddingBottom;

            const newCanvas = document.createElement("canvas");
            newCanvas.width = canvasWidth;
            newCanvas.height = canvasHeight;
            const ctx = newCanvas.getContext("2d");

            if (ctx) {
                ctx.fillStyle = "#ffffff"; // Background color
                ctx.fillRect(0, 0, canvasWidth, canvasHeight);
                ctx.drawImage(canvas, paddingLeft, paddingTop);
            }

            const pdf = new jsPDF("p", "mm", "a4");
            const imgData = newCanvas.toDataURL("image/png");
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.autoPrint();
            window.open(pdf.output("bloburl"), "_blank");
            // pdf.save("releve-de-compte.pdf");
        });
    };

    let compteur = 1;
    return (
        <div style={{ marginTop: "5px" }}>
            <div>
                <ul
                    className="nav nav-tabs"
                    id="custom-tabs-one-tab"
                    role="tablist"
                    style={{ background: "teal", borderRadius: "10px" }}
                >
                    <li className="nav-item">
                        <a
                            style={{
                                textDecoration: "none",
                                color: "#000",
                                fontWeight: "bold",
                            }}
                            className="nav-link active"
                            id="custom-tabs-one-1-tab"
                            data-toggle="pill"
                            href="#custom-tabs-one-1"
                            role="tab"
                            aria-controls="custom-tabs-one-1"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Société
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
                            id="custom-tabs-two-2-tab"
                            data-toggle="pill"
                            href="#custom-tabs-two-2"
                            role="tab"
                            aria-controls="custom-tabs-two-2"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Epargne & Adhésion
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
                            id="custom-tabs-three-3-tab"
                            data-toggle="pill"
                            href="#custom-tabs-three-3"
                            role="tab"
                            aria-controls="custom-tabs-three-3"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Porte Feuille
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
                            id="custom-tabs-four-4-tab"
                            data-toggle="pill"
                            href="#custom-tabs-four-4"
                            role="tab"
                            aria-controls="custom-tabs-four-4"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Autres
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
                            id="custom-tabs-five-5-tab"
                            data-toggle="pill"
                            href="#custom-tabs-five-5"
                            role="tab"
                            aria-controls="custom-tabs-five-5"
                            aria-selected="false"
                            // style={{ color: "#000", fontSize: "17px" }}
                        >
                            Nouveau compte
                        </a>
                    </li>
                </ul>
                <div className="card-body">
                    {isClosing && (
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
                        className="tab-content"
                        id="custom-tabs-one-tabContent"
                    >
                        <div
                            className="tab-pane fade show active"
                            id="custom-tabs-one-1"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-one-1-tab"
                        >
                            <h4
                                className="fw-bold"
                                style={{ color: "steelblue" }}
                            >
                                Société
                            </h4>
                            <br />
                            <div
                                className="row"
                                style={{ height: "600px", overflowX: "scroll" }}
                            >
                                <div className="col-md-4 card rounded-0 p-3">
                                    <form
                                        method="POST"
                                        style={{
                                            height: "auto",
                                        }}
                                    >
                                        <table className="tableDepotEspece">
                                            <tbody>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="sigle"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Sigle
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="sigle"
                                                            type="text"
                                                            name="sigle"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setSigle(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={sigle}
                                                        />
                                                        <input
                                                            type="hidden"
                                                            value={companyId}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="denomination"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Denomination
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="denomination"
                                                            type="text"
                                                            name="denomination"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setDenomination(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={denomination}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="adresse"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Adresse
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="adresse"
                                                            type="text"
                                                            name="adresse"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setAdresse(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={adresse}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="forme"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Forme
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="forme"
                                                            type="text"
                                                            name="forme"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setForme(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={forme}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="ville"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Ville
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="ville"
                                                            type="text"
                                                            name="ville"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setVille(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={ville}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="departement"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Département
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="departement"
                                                            type="text"
                                                            name="departement"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setDepartement(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={departement}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="pays"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Pays
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="pays"
                                                            type="text"
                                                            name="pays"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setPays(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={pays}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="tel"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Num Tél
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="tel"
                                                            type="text"
                                                            name="tel"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setTel(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={tel}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="email"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Email
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="email"
                                                            type="text"
                                                            name="email"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
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
                                                    <td>
                                                        <label
                                                            htmlFor="idnat"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            ID Nat
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="idnat"
                                                            type="text"
                                                            name="idnat"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setIdnat(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={idnat}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="nrc"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            NRC
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="nrc"
                                                            type="text"
                                                            name="nrc"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setNrc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={nrc}
                                                        />
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="num_impot"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Num impot
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="num_impot"
                                                            type="text"
                                                            name="num_impot"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setNum_impot(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={num_impot}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="date_system"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Date
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="date_system"
                                                            type="date"
                                                            name="date_system"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setDate_system(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={date_system}
                                                        />{" "}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td></td>
                                                    <td>
                                                        <button
                                                            type="submit"
                                                            className="btn btn-success rounded-0"
                                                            onClick={
                                                                updateCompanyData
                                                            }
                                                        >
                                                            {isloading1 ? (
                                                                <span class="spinner-border spinner-border-sm visible"></span>
                                                            ) : (
                                                                "Mettre à jour"
                                                            )}
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                                <div
                                    className="col-md-4  card rounded-0 p-3"
                                    style={{ marginLeft: "3px" }}
                                >
                                    <form action="">
                                        <table>
                                            <tr>
                                                <td>
                                                    <img
                                                        style={{
                                                            width: "100%",
                                                            height: "90px",
                                                        }}
                                                        src={`uploads/images/logo/${
                                                            company_logo
                                                                ? company_logo
                                                                : "default.jpg"
                                                        }`}
                                                        alt="img"
                                                    />{" "}
                                                    <br />
                                                    <label htmlFor="">
                                                        <input
                                                            class="form-control"
                                                            type="file"
                                                            id="formFile"
                                                            accept="image/png, image/jpeg"
                                                            onChange={(e) =>
                                                                setCompany_logo(
                                                                    e.target
                                                                        .files[0]
                                                                )
                                                            }
                                                            // value={company_logo}
                                                        />
                                                    </label>{" "}
                                                    <br />
                                                    <button
                                                        type="submit"
                                                        className="btn btn-success rounded-0 w-100"
                                                        onClick={
                                                            updateCompanyLogo
                                                        }
                                                    >
                                                        Mettre à jour
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade show"
                            id="custom-tabs-two-2"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-two-2-tab"
                        >
                            <h4 className="fw-bold">Epargne Adhésion</h4>
                            <div
                                className="row"
                                style={{ height: "650px", overflowX: "scroll" }}
                            >
                                <div className="col-md-4  card rounded-0 ">
                                    <form
                                        method="POST"
                                        style={{
                                            height: "auto",
                                        }}
                                    >
                                        <table className="tableDepotEspece">
                                            <tbody>
                                                <p className="text-bold">
                                                    Groupe de compte epargne
                                                </p>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Ecompte_courant"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne compte
                                                            Courant
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Ecompte_courant"
                                                            type="text"
                                                            name="Ecompte_courant"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEcompte_courant(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                Ecompte_courant
                                                            }
                                                        />
                                                        <input
                                                            type="hidden"
                                                            value={AdhesionEpID}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Ecompte_courant_usd"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne Courant en
                                                            USD
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Ecompte_courant_usd"
                                                            type="text"
                                                            name="Ecompte_courant_usd"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEcompte_courant_usd(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                Ecompte_courant_usd
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Ecompte_courant_cdf"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne Courant en
                                                            FC
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Ecompte_courant_cdf"
                                                            type="text"
                                                            name="Ecompte_courant_cdf"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEcompte_courant_cdf(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                Ecompte_courant_cdf
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <p className="text-bold">
                                                    Epargne Débiteur
                                                </p>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Edebiteur_usd"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne Débiteur
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Edebiteur"
                                                            type="text"
                                                            name="Edebiteur"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEdebiteur(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={Edebiteur}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Edebiteur_usd"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne Débiteur en
                                                            USD
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Edebiteur_usd"
                                                            type="text"
                                                            name="Edebiteur_usd"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEdebiteur_usd(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                Edebiteur_usd
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Edebiteur_fc"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne Débiteur en
                                                            FC
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Edebiteur_fc"
                                                            type="text"
                                                            name="Edebiteur_fc"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEdebiteur_fc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={Edebiteur_fc}
                                                        />
                                                    </td>
                                                </tr>
                                                <p className="text-bold">
                                                    Epargne à la carte
                                                </p>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Etontine_usd"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne à la carte
                                                            en USD
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Etontine_usd"
                                                            type="text"
                                                            name="Etontine_usd"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEtontine_usd(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={Etontine_usd}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="Etontine_fc"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Epargne à la carte
                                                            en FC
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="Etontine_fc"
                                                            type="text"
                                                            name="Etontine_fc"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setEtontine_fc(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={Etontine_fc}
                                                        />
                                                    </td>
                                                </tr>
                                                -----------------
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="D_a_terme"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Dépot à terme
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="D_a_terme"
                                                            type="text"
                                                            name="D_a_terme"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setD_a_terme(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={D_a_terme}
                                                        />
                                                    </td>
                                                </tr>
                                                <tr ng-repeat="name in getdrugnameNewArray">
                                                    <td>
                                                        <label
                                                            htmlFor="solde_minimum"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Solde minimum
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            id="solde_minimum"
                                                            type="text"
                                                            name="solde_minimum"
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                // width: "100px",
                                                            }}
                                                            onChange={(e) =>
                                                                setsolde_minimum(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                solde_minimum
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                                <div className="col-md-4  card rounded-0">
                                    <table className="tableDepotEspece">
                                        <tbody>
                                            <p className="text-bold">
                                                Adhésion
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="frais_adhesion"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Frais d'Adhésion
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        name="frais_adhesion"
                                                        id="frais_adhesion"
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                        }}
                                                        onChange={(e) => {
                                                            setfrais_adhesion(
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option
                                                            value={
                                                                frais_adhesion
                                                            }
                                                        >
                                                            {frais_adhesion}
                                                        </option>
                                                        {frais_adhesion ==
                                                        "OUI" ? (
                                                            <option value="NON">
                                                                NON
                                                            </option>
                                                        ) : (
                                                            <option value="OUI">
                                                                OUI
                                                            </option>
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="part_social"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Groupe parts sociales
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="part_social"
                                                        name="part_social"
                                                        onChange={(e) =>
                                                            setpart_social(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={part_social}
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="droit_entree"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Droit d'entrée
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="droit_entree"
                                                        name="droit_entree"
                                                        onChange={(e) =>
                                                            setdroit_entree(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={droit_entree}
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_papeterie"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte papeterie
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="compte_papeterie"
                                                        name="compte_papeterie"
                                                        onChange={(e) =>
                                                            setcompte_papeterie(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={compte_papeterie}
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_papeterie_fc"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte papeterie FC
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="compte_papeterie_fc"
                                                        name="compte_papeterie_fc"
                                                        onChange={(e) =>
                                                            setcompte_papeterie_fc(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_papeterie_fc
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="valeur_droit_entree"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Valeur droit d'entrée
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="valeur_droit_entree"
                                                        name="valeur_droit_entree"
                                                        onChange={(e) =>
                                                            setvaleur_droit_entree(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            valeur_droit_entree
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="valeur_droit_entree_pysique"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        V. droit d'entrée p.
                                                        Phys
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="valeur_droit_entree_pysique"
                                                        name="valeur_droit_entree_pysique"
                                                        onChange={(e) =>
                                                            setvaleur_droit_entree_pysique(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            valeur_droit_entree_pysique
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="valeur_droit_entree_moral"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        V. droit d'entrée p.
                                                        Moral
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="valeur_droit_entree_moral"
                                                        name="valeur_droit_entree_moral"
                                                        onChange={(e) =>
                                                            setvaleur_droit_entree_moral(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            valeur_droit_entree_moral
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="valeur_frais_papeterie"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        V. frais de papeterie
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="valeur_frais_papeterie"
                                                        name="valeur_frais_papeterie"
                                                        onChange={(e) =>
                                                            setvaleur_frais_papeterie(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            valeur_frais_papeterie
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <p className="text-bold">
                                                Virement
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="groupe_c_virement"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Gr. de compte de
                                                        virement
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="groupe_c_virement"
                                                        name="groupe_c_virement"
                                                        onChange={(e) =>
                                                            setgroupe_c_virement(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            groupe_c_virement
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="groupe_c_fond_non_servi"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Gr. de compte font non
                                                        servi
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="groupe_c_fond_non_servi"
                                                        name="groupe_c_fond_non_servi"
                                                        onChange={(e) =>
                                                            setgroupe_c_fond_non_servi(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            groupe_c_fond_non_servi
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_revenu_virement_usd"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte revenu sur vir.
                                                        USD
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="compte_revenu_virement_usd"
                                                        name="compte_revenu_virement_usd"
                                                        onChange={(e) =>
                                                            setcompte_revenu_virement_usd(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_revenu_virement_usd
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_revenu_virement_fc"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte revenu sur vir.
                                                        FC
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="compte_revenu_virement_fc"
                                                        name="compte_revenu_virement_fc"
                                                        onChange={(e) =>
                                                            setcompte_revenu_virement_fc(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_revenu_virement_fc
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="taux_tva_sur_vir"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Taux TVA sur virement
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            // width: "70px",
                                                        }}
                                                        type="text"
                                                        id="taux_tva_sur_vir"
                                                        name="taux_tva_sur_vir"
                                                        onChange={(e) =>
                                                            settaux_tva_sur_vir(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={taux_tva_sur_vir}
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="arrondir_frais_vir"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Arrondir les frais de
                                                        vir
                                                    </label>
                                                </td>
                                                <td>
                                                    <select
                                                        name="arrondir_frais_vir"
                                                        id="arrondir_frais_vir"
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                        }}
                                                        onChange={(e) => {
                                                            setarrondir_frais_vir(
                                                                e.target.value
                                                            );
                                                        }}
                                                    >
                                                        <option
                                                            value={
                                                                arrondir_frais_vir
                                                            }
                                                        >
                                                            {arrondir_frais_vir}
                                                        </option>
                                                        {arrondir_frais_vir ==
                                                        "OUI" ? (
                                                            <option value="NON">
                                                                NON
                                                            </option>
                                                        ) : (
                                                            <option value="OUI">
                                                                OUI
                                                            </option>
                                                        )}
                                                    </select>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4  card rounded-0">
                                    <table>
                                        <p className="text-bold">
                                            Suivi des épargnes radiés en Hors
                                            Bilan
                                        </p>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="Edebiteur_radie_usd"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Epargnes débiteurs radiés
                                                    USD
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="Edebiteur_radie_usd"
                                                    name="Edebiteur_radie_usd"
                                                    onChange={(e) =>
                                                        setEdebiteur_radie_usd(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={Edebiteur_radie_usd}
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="Edebiteur_radie_fc"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Epargnes débiteurs radiés FC
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="Edebiteur_radie_fc"
                                                    name="Edebiteur_radie_fc"
                                                    onChange={(e) =>
                                                        setEdebiteur_radie_fc(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={Edebiteur_radie_fc}
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="engagement_sur_eparg_usd"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Engagements sur Epargne USD
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="engagement_sur_eparg_usd"
                                                    name="engagement_sur_eparg_usd"
                                                    onChange={(e) =>
                                                        setengagement_sur_eparg_usd(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        engagement_sur_eparg_usd
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="engagement_sur_eparg_fc"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Engagements sur Epargne FC
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="engagement_sur_eparg_fc"
                                                    name="engagement_sur_eparg_fc"
                                                    onChange={(e) =>
                                                        setengagement_sur_eparg_fc(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        engagement_sur_eparg_fc
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="rec_sur_epargne_radie_usd"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Récupération sur E. radié
                                                    USD
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="rec_sur_epargne_radie_usd"
                                                    name="rec_sur_epargne_radie_usd"
                                                    onChange={(e) =>
                                                        setrec_sur_epargne_radie_usd(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        rec_sur_epargne_radie_usd
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="rec_sur_epargne_radie_fc"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Récupération sur E. radié FC
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        // width: "70px",
                                                    }}
                                                    type="text"
                                                    id="rec_sur_epargne_radie_fc"
                                                    name="rec_sur_epargne_radie_fc"
                                                    onChange={(e) =>
                                                        setrec_sur_epargne_radie_fc(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        rec_sur_epargne_radie_fc
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                {" "}
                                                <button
                                                    className="btn btn-success rounded-0"
                                                    onClick={
                                                        updateAdhesionEpargneConfig
                                                    }
                                                >
                                                    {isloading2 ? (
                                                        <span class="spinner-border spinner-border-sm visible"></span>
                                                    ) : (
                                                        "Mettre à jour"
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade show"
                            id="custom-tabs-three-3"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-three-3-tab"
                        >
                            <h4 className="fw-bold">Porte Feuille</h4>
                            <div
                                className="row"
                                style={{ height: "650px", overflowX: "scroll" }}
                            >
                                <div className="col-md-4 card rounded-0">
                                    <table>
                                        <tbody>
                                            <p className="text-bold">
                                                Prêt nos échus
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_ordinanire"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt ordinaire
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_ordinanire"
                                                        name="pre_ordinanire"
                                                        onChange={(e) =>
                                                            setpre_ordinanire(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={pre_ordinanire}
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_ordinanire_au_dirigent"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt ordinaire aux dir.
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_ordinanire_au_dirigent"
                                                        name="pre_ordinanire_au_dirigent"
                                                        onChange={(e) =>
                                                            setpre_ordinanire_au_dirigent(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_ordinanire_au_dirigent
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_ordinanire_au_membres"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt ordinaire aux
                                                        membres
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_ordinanire_au_membres"
                                                        name="pre_ordinanire_au_membres"
                                                        onChange={(e) =>
                                                            setpre_ordinanire_au_membres(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_ordinanire_au_membres
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_ordinanire_au_agents"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt ordinaire aux
                                                        agents
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_ordinanire_au_agents"
                                                        name="pre_ordinanire_au_agents"
                                                        onChange={(e) =>
                                                            setpre_ordinanire_au_agents(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_ordinanire_au_agents
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_en_billet_delabre"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt en billet delabré
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_en_billet_delabre"
                                                        name="pre_en_billet_delabre"
                                                        onChange={(e) =>
                                                            setpre_en_billet_delabre(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_en_billet_delabre
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_en_billet_delabre_aux_dirigent"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt en billet delabré
                                                        aux dir.
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_en_billet_delabre_aux_dirigent"
                                                        name="pre_en_billet_delabre_aux_dirigent"
                                                        onChange={(e) =>
                                                            setpre_en_billet_delabre_aux_dirigent(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_en_billet_delabre_aux_dirigent
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_en_billet_delabre_aux_membres"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt en billet delabré
                                                        aux m.
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_en_billet_delabre_aux_membres"
                                                        name="pre_en_billet_delabre_aux_membres"
                                                        onChange={(e) =>
                                                            setpre_en_billet_delabre_aux_membres(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_en_billet_delabre_aux_membres
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pre_en_billet_delabre_aux_agents"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt en billet delabré
                                                        aux agt.
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pre_en_billet_delabre_aux_agents"
                                                        name="pre_en_billet_delabre_aux_agents"
                                                        onChange={(e) =>
                                                            setpre_en_billet_delabre_aux_agents(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pre_en_billet_delabre_aux_agents
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <p className="text-bold">
                                                Prêt radiés
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="grpe_compte_pret_r_HB"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Groupe compte prêt radié
                                                        en HB
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="grpe_compte_pret_r_HB"
                                                        name="grpe_compte_pret_r_HB"
                                                        onChange={(e) =>
                                                            setgrpe_compte_pret_r_HB(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            grpe_compte_pret_r_HB
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_charge_radiation"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte charge pour la
                                                        radiation
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="compte_charge_radiation"
                                                        name="compte_charge_radiation"
                                                        onChange={(e) =>
                                                            setcompte_charge_radiation(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_charge_radiation
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_a_credite_HB"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte à créditer en HB
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="compte_a_credite_HB"
                                                        name="compte_a_credite_HB"
                                                        onChange={(e) =>
                                                            setcompte_a_credite_HB(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_a_credite_HB
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="compte_a_credite_au_bilan"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Compte à créditer au
                                                        bilan
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="compte_a_credite_au_bilan"
                                                        name="compte_a_credite_au_bilan"
                                                        onChange={(e) =>
                                                            setcompte_a_credite_au_bilan(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            compte_a_credite_au_bilan
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <p className="text-bold">
                                                Comptes d'intérêts
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="interet_pret_ordin_NE"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Intérêt sur prêt ord.
                                                        non échu
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="interet_pret_ordin_NE"
                                                        name="interet_pret_ordin_NE"
                                                        onChange={(e) =>
                                                            setinteret_pret_ordin_NE(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            interet_pret_ordin_NE
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="interet_pret_ordin_echu"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Intérêt sur prêt ord.
                                                        échu
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="interet_pret_ordin_echu"
                                                        name="interet_pret_ordin_echu"
                                                        onChange={(e) =>
                                                            setinteret_pret_ordin_echu(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            interet_pret_ordin_echu
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="interet_pret_en_billet_DL_NE"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Intérêt sur prêt en
                                                        billet Del NE
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="interet_pret_en_billet_DL_NE"
                                                        name="interet_pret_en_billet_DL_NE"
                                                        onChange={(e) =>
                                                            setinteret_pret_en_billet_DL_NE(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            interet_pret_en_billet_DL_NE
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="interet_pret_en_billet_DL_E"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Intérêt sur prêt en
                                                        billet Del echu
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "90px",
                                                        }}
                                                        type="text"
                                                        id="interet_pret_en_billet_DL_E"
                                                        name="interet_pret_en_billet_DL_E"
                                                        onChange={(e) =>
                                                            setinteret_pret_en_billet_DL_E(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            interet_pret_en_billet_DL_E
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 card rounded-0">
                                    <table>
                                        <tbody>
                                            <p className="text-bold">
                                                Prêts en retard de paiement
                                            </p>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="pret_ordi_en_retard"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt ordinaire en retard
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="pret_ordi_en_retard"
                                                        name="pret_ordi_en_retard"
                                                        onChange={(e) =>
                                                            setpret_ordi_en_retard(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            pret_ordi_en_retard
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="un_a_30_jours"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        1 à 30 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="un_a_30_jours"
                                                        name="un_a_30_jours"
                                                        onChange={(e) =>
                                                            setun_a_30_jours(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={un_a_30_jours}
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="trente_et_un_a_60_jours"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        31 à 60 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="trente_et_un_a_60_jours"
                                                        name="trente_et_un_a_60_jours"
                                                        onChange={(e) =>
                                                            settrente_et_un_a_60_jours(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            trente_et_un_a_60_jours
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="soixante_et_un_a_90_jours"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        61 à 90 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="soixante_et_un_a_90_jours"
                                                        name="soixante_et_un_a_90_jours"
                                                        onChange={(e) =>
                                                            setsoixante_et_un_a_90_jours(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            soixante_et_un_a_90_jours
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="nonante_et_un_a_90_jours"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        91 à 180 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="nonante_et_un_a_90_jours"
                                                        name="nonante_et_un_a_90_jours"
                                                        onChange={(e) =>
                                                            setnonante_et_un_a_90_jours(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            nonante_et_un_a_90_jours
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="plus_de_180_jours"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Plus de 180 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="plus_de_180_jours"
                                                        name="plus_de_180_jours"
                                                        onChange={(e) =>
                                                            setplus_de_180_jours(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            plus_de_180_jours
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            {/* <p className="text-bold">Prêt en billet delabré en retard</p> */}
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="p_billet_delabre_retard"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Prêt en billet delabré
                                                        en retard
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="p_billet_delabre_retard"
                                                        name="p_billet_delabre_retard"
                                                        onChange={(e) =>
                                                            setp_billet_delabre_retard(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            p_billet_delabre_retard
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="un_a_30_jours_del"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        1 à 30 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="un_a_30_jours_del"
                                                        name="un_a_30_jours_del"
                                                        onChange={(e) =>
                                                            setun_a_30_jours_del(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            un_a_30_jours_del
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="trente_et_un_a_60_jours_del"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        31 à 60 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="trente_et_un_a_60_jours_del"
                                                        name="trente_et_un_a_60_jours_del"
                                                        onChange={(e) =>
                                                            settrente_et_un_a_60_jours_del(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            trente_et_un_a_60_jours_del
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="soixante_et_un_a_90_jours_del"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        61 à 90 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="soixante_et_un_a_90_jours_del"
                                                        name="soixante_et_un_a_90_jours_del"
                                                        onChange={(e) =>
                                                            setsoixante_et_un_a_90_jours_del(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            soixante_et_un_a_90_jours_del
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="nonante_et_un_a_180_jours_del"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        91 à 180 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="nonante_et_un_a_180_jours_del"
                                                        name="nonante_et_un_a_180_jours_del"
                                                        onChange={(e) =>
                                                            setnonante_et_un_a_180_jours_del(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            nonante_et_un_a_180_jours_del
                                                        }
                                                    />
                                                </td>
                                            </tr>

                                            <tr ng-repeat="name in getdrugnameNewArray">
                                                <td>
                                                    <label
                                                        htmlFor="plus_de_180_jours_del"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Plus de 180 jours
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        style={{
                                                            padding: "1px ",
                                                            border: "1px solid #dcdcdc",
                                                            marginBottom: "5px",
                                                            width: "60px",
                                                        }}
                                                        type="text"
                                                        id="plus_de_180_jours_del"
                                                        name="plus_de_180_jours_del"
                                                        onChange={(e) =>
                                                            setplus_de_180_jours_del(
                                                                e.target.value
                                                            )
                                                        }
                                                        value={
                                                            plus_de_180_jours_del
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <div className="col-md-4 card rounded-0">
                                    <table>
                                        <p className="text-bold">
                                            Provision sur prêt en retard
                                        </p>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_pret_ordinaire"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Provision prêt ordinaire
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_pret_ordinaire"
                                                    name="provision_pret_ordinaire"
                                                    onChange={(e) =>
                                                        setprovision_pret_ordinaire(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_pret_ordinaire
                                                    }
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_un_a_30_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    1 à 30 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_un_a_30_jours"
                                                    name="provision_un_a_30_jours"
                                                    onChange={(e) =>
                                                        setprovision_un_a_30_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_un_a_30_jours
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_1_30_jours"
                                                    onChange={(e) =>
                                                        settaux_provision_1_30_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_1_30_jours
                                                    }
                                                />{" "}
                                                {" %"}
                                            </td>
                                        </tr>

                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_trente_et_un_a_60_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    31 à 60 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_trente_et_un_a_60_jours"
                                                    name="provision_trente_et_un_a_60_jours"
                                                    onChange={(e) =>
                                                        setprovision_trente_et_un_a_60_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_trente_et_un_a_60_jours
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_31_60_jours"
                                                    onChange={(e) =>
                                                        settaux_provision_31_60_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_31_60_jours
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_soixante_et_un_a_90_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    61 à 90 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_soixante_et_un_a_90_jours"
                                                    name="provision_soixante_et_un_a_90_jours"
                                                    onChange={(e) =>
                                                        setprovision_soixante_et_un_a_90_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_soixante_et_un_a_90_jours
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_61_90_jours"
                                                    onChange={(e) =>
                                                        settaux_provision_61_90_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_61_90_jours
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_nonante_et_un_a_180_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    91 à 180 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_nonante_et_un_a_180_jours"
                                                    name="provision_nonante_et_un_a_180_jours"
                                                    onChange={(e) =>
                                                        setprovision_nonante_et_un_a_180_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_nonante_et_un_a_180_jours
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_91_180_jours"
                                                    onChange={(e) =>
                                                        settaux_provision_91_180_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_91_180_jours
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>

                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_plus_180_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Plus 180 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_plus_180_jours"
                                                    name="provision_plus_180_jours"
                                                    onChange={(e) =>
                                                        setprovision_plus_180_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_plus_180_jours
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_plus_180_jours"
                                                    onChange={(e) =>
                                                        settaux_provision_plus_180_jours(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_plus_180_jours
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>

                                        <p className="text-bold">
                                            Prov. prêt en billet delabré
                                        </p>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_pret_BD"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Prov. prêt en billet delabré
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_pret_BD"
                                                    name="provision_pret_BD"
                                                    onChange={(e) =>
                                                        setprovision_pret_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={provision_pret_BD}
                                                />
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_un_a_30_jours"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    1 à 30 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_un_a_30_jours_BD"
                                                    name="provision_un_a_30_jours_BD"
                                                    onChange={(e) =>
                                                        setprovision_un_a_30_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_un_a_30_jours_BD
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_1_30_jours_BD"
                                                    onChange={(e) =>
                                                        settaux_provision_1_30_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_1_30_jours_BD
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>

                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_trente_et_un_a_60_jours_BD"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    31 à 60 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_trente_et_un_a_60_jours_BD"
                                                    name="provision_trente_et_un_a_60_jours_BD"
                                                    onChange={(e) =>
                                                        setprovision_trente_et_un_a_60_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_trente_et_un_a_60_jours_BD
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_31_60_jours_BD"
                                                    onChange={(e) =>
                                                        settaux_provision_31_60_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_31_60_jours_BD
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_soixante_et_un_a_90_jours_BD"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    61 à 90 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_soixante_et_un_a_90_jours_BD"
                                                    name="provision_soixante_et_un_a_90_jours_BD"
                                                    onChange={(e) =>
                                                        setprovision_soixante_et_un_a_90_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_soixante_et_un_a_90_jours_BD
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_61_90_jours_BD"
                                                    onChange={(e) =>
                                                        settaux_provision_61_90_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_61_90_jours_BD
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>
                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_nonante_et_un_a_180_jours_BD"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    91 à 180 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    id="provision_nonante_et_un_a_180_jours_BD"
                                                    name="provision_nonante_et_un_a_180_jours_BD"
                                                    onChange={(e) =>
                                                        setprovision_nonante_et_un_a_180_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_nonante_et_un_a_180_jours_BD
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_91_180_jours_BD"
                                                    onChange={(e) =>
                                                        settaux_provision_91_180_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_91_180_jours_BD
                                                    }
                                                />
                                                {" %"}
                                            </td>
                                        </tr>

                                        <tr ng-repeat="name in getdrugnameNewArray">
                                            <td>
                                                <label
                                                    htmlFor="provision_plus_180_jours_BD"
                                                    style={{
                                                        padding: "2px",
                                                        color: "steelblue",
                                                    }}
                                                >
                                                    Plus 180 jours
                                                </label>
                                            </td>
                                            <td>
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "40px",
                                                    }}
                                                    type="text"
                                                    id="provision_plus_180_jours_BD"
                                                    name="provision_plus_180_jours_BD"
                                                    onChange={(e) =>
                                                        setprovision_plus_180_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        provision_plus_180_jours_BD
                                                    }
                                                />{" "}
                                                <input
                                                    style={{
                                                        padding: "1px ",
                                                        border: "1px solid #dcdcdc",
                                                        marginBottom: "5px",
                                                        width: "60px",
                                                    }}
                                                    type="text"
                                                    name="taux_provision_plus_180_jours_BD"
                                                    onChange={(e) =>
                                                        settaux_provision_plus_180_jours_BD(
                                                            e.target.value
                                                        )
                                                    }
                                                    value={
                                                        taux_provision_plus_180_jours_BD
                                                    }
                                                />{" "}
                                                {" %"}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td></td>
                                            <td>
                                                {" "}
                                                <button
                                                    className="btn btn-success rounded-0"
                                                    onClick={
                                                        updatePorteFeuilleConfig
                                                    }
                                                >
                                                    {isloading3 ? (
                                                        <span class="spinner-border spinner-border-sm visible"></span>
                                                    ) : (
                                                        "Mettre à jour"
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade show"
                            id="custom-tabs-four-4"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-four-4-tab"
                        >
                            <div className="row">
                                <div className="col-md-5">
                                    <h4 className="fw-bold">Autres</h4>
                                    <form action="">
                                        <table>
                                            <tbody>
                                                <p>
                                                    Expiration du mot de passe
                                                </p>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="password_expired_days"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Durée d'expiration
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                width: "60px",
                                                            }}
                                                            type="text"
                                                            id="password_expired_days"
                                                            name="password_expired_days"
                                                            onChange={(e) =>
                                                                setpassword_expired_days(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                password_expired_days
                                                            }
                                                        />
                                                        {" Jours"}
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="login_attempt"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Login Attempt
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <input
                                                            style={{
                                                                padding: "1px ",
                                                                border: "1px solid #dcdcdc",
                                                                marginBottom:
                                                                    "5px",
                                                                width: "60px",
                                                            }}
                                                            type="text"
                                                            id="login_attempt"
                                                            name="login_attempt"
                                                            onChange={(e) =>
                                                                setlogin_attempt(
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            value={
                                                                login_attempt
                                                            }
                                                        />
                                                    </td>
                                                </tr>
                                                <p>Commission</p>
                                                <tr>
                                                    <td>
                                                        <label
                                                            htmlFor="login_attempt"
                                                            style={{
                                                                padding: "2px",
                                                                color: "steelblue",
                                                            }}
                                                        >
                                                            Afficher le champ de
                                                            commission
                                                        </label>
                                                    </td>
                                                    <td>
                                                        <div className="form-check form-switch ml-4">
                                                            <input
                                                                className="form-check-input"
                                                                type="checkbox"
                                                                id="flexSwitchCheckDefault"
                                                                checked={
                                                                    showCommissionPanel
                                                                }
                                                                onChange={
                                                                    handleToggleChange
                                                                }
                                                            />
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    {/* <td></td> */}
                                                    <td>
                                                        {" "}
                                                        <button
                                                            onClick={
                                                                updateExpirateDays
                                                            }
                                                            className="btn btn-success rounded-10"
                                                        >
                                                            Mettre à jour
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                                <div className=" col-md-4">
                                    <h4 className="fw-bold">Clotûre Anuelle</h4>
                                    <form action="">
                                        <button
                                            onClick={clotureAnuelle}
                                            className="btn btn-danger rounded-10"
                                        >
                                            Clotûrer ...
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div
                            className="tab-pane fade show"
                            id="custom-tabs-five-5"
                            role="tabpanel"
                            aria-labelledby="custom-tabs-five-5-tab"
                        >
                            <h4 className="fw-bold">
                                Création des comptes internes
                            </h4>
                            <div
                                className="row"
                                style={{
                                    padding: "10px",
                                    border: "2px solid #fff",
                                }}
                            >
                                <div className="col-lg-12">
                                    <div className="card card-default">
                                        <div
                                            className="card-header"
                                            style={{
                                                background: "#DCDCDC",
                                                textAlign: "center",
                                                color: "#fff",
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="col-md-8">
                                    <form>
                                        <table>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="IntituleCompteNew"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Intitulé compte
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="IntituleCompteNew"
                                                        name="IntituleCompteNew"
                                                        className="form-control mt-1 font-weight-bold"
                                                        style={{
                                                            width: "300px",
                                                            height: "30px",
                                                            borderRadius: "0px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        onChange={(e) => {
                                                            setIntituleCompteNew(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={
                                                            IntituleCompteNew
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
                                                        htmlFor="RefTypeCompte"
                                                    >
                                                        Réf type compte
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="RefTypeCompte"
                                                        name="RefTypeCompte"
                                                        className="form-control mt-1 font-weight-bold"
                                                        style={{
                                                            height: "30px",
                                                            borderRadius: "0px",
                                                            width: "150px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        placeholder="Exemple 7"
                                                        onChange={(e) => {
                                                            setRefTypeCompte(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={RefTypeCompte}
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
                                                        htmlFor="RefCadre"
                                                    >
                                                        Réf cadre
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="RefCadre"
                                                        name="RefCadre"
                                                        className="form-control mt-1 font-weight-bold"
                                                        placeholder="Exemple 70"
                                                        style={{
                                                            height: "30px",
                                                            borderRadius: "0px",
                                                            width: "150px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        onChange={(e) => {
                                                            setRefCadre(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={RefCadre}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="RefSousGroupe"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Réf groupe
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="RefGroupe"
                                                        name="RefGroupe"
                                                        className="form-control mt-1 font-weight-bold"
                                                        style={{
                                                            height: "30px",
                                                            borderRadius: "0px",
                                                            width: "150px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        placeholder="Exemple 700"
                                                        onChange={(e) => {
                                                            setRefGroupe(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={RefGroupe}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <label
                                                        htmlFor="RefSousGroupe"
                                                        style={{
                                                            padding: "2px",
                                                            color: "steelblue",
                                                        }}
                                                    >
                                                        Réf sous groupe
                                                    </label>
                                                </td>
                                                <td>
                                                    <input
                                                        type="text"
                                                        id="RefSousGroupe"
                                                        name="RefSousGroupe"
                                                        className="form-control mt-1 font-weight-bold"
                                                        style={{
                                                            height: "30px",
                                                            borderRadius: "0px",
                                                            width: "150px",
                                                            boxShadow:
                                                                "inset 0 0 5px 5px #888",
                                                            fontSize: "15px",
                                                        }}
                                                        placeholder="Exemple 7000"
                                                        onChange={(e) => {
                                                            setRefSousGroupe(
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={RefSousGroupe}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td></td>
                                                <td>
                                                    <button
                                                        type="button"
                                                        style={{
                                                            borderRadius: "0px",
                                                            width: "30%",
                                                            height: "30px",
                                                            fontSize: "12px",
                                                        }}
                                                        id="saveNewAccountBtn"
                                                        className="btn btn-primary mt-1"
                                                        onClick={saveNewCompte}
                                                    >
                                                        Valider{" "}
                                                        <i
                                                            className={`${
                                                                isloading4
                                                                    ? "spinner-border spinner-border-sm"
                                                                    : "fas fa-check"
                                                            }`}
                                                        ></i>
                                                    </button>{" "}
                                                    <button
                                                        type="button"
                                                        style={{
                                                            borderRadius: "0px",
                                                            width: "30%",
                                                            height: "30px",
                                                            fontSize: "12px",
                                                        }}
                                                        id="savebtn"
                                                        className="btn btn-success mt-1"
                                                        onClick={addNewAccount}
                                                    >
                                                        Ajouter{" "}
                                                        <i className="fas fa-plus"></i>
                                                    </button>
                                                </td>
                                            </tr>
                                        </table>
                                    </form>
                                </div>

                                <div className="row mt-5">
                                    <div className="card card-default">
                                        <div
                                            className="card-header"
                                            style={{
                                                background: "#DCDCDC",
                                                textAlign: "center",
                                                color: "#fff",
                                            }}
                                        ></div>
                                    </div>

                                    <div className="col-md-2">
                                        <table>
                                            <tr>
                                                <td>
                                                    {showAccountSession ? (
                                                        <button
                                                            onClick={
                                                                ChargeCompte
                                                            }
                                                            className="btn btn-success rounded-0"
                                                        >
                                                            Charger les comptes{" "}
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={
                                                                hideAccountSession
                                                            }
                                                            className="btn btn-success rounded-0"
                                                        >
                                                            Masquer les comptes{" "}
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        </table>
                                    </div>
                                </div>
                                {fetchCreatedAccount && (
                                    <div className="row">
                                        <table
                                            id="main-table-balance"
                                            style={{
                                                border: "0px",
                                                width: "100%",
                                            }}
                                        >
                                            <div
                                                id="content-to-download-balance"
                                                style={{
                                                    width: "90%",
                                                    margin: "0px auto",
                                                }}
                                            >
                                                <div className="col-md-12 table-search-by-name">
                                                    <table
                                                        className="table table-bordered mt-3"
                                                        style={{
                                                            // background: "#444",
                                                            padding: "5px",
                                                            color: "#000",
                                                        }}
                                                    >
                                                        <thead
                                                            style={{
                                                                background:
                                                                    "#000",
                                                                color: "#fff",
                                                            }}
                                                        >
                                                            <tr>
                                                                <th>#</th>
                                                                <th>
                                                                    NumCompte
                                                                </th>
                                                                <th>
                                                                    Nom compte
                                                                </th>
                                                                <th>
                                                                    RefTypeCompte
                                                                </th>
                                                                <th>
                                                                    RefCadre
                                                                </th>
                                                                <th>
                                                                    RefGroupe
                                                                </th>

                                                                <th>
                                                                    RefSousGroupe
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {fetchCreatedAccount &&
                                                                fetchCreatedAccount.map(
                                                                    (
                                                                        res,
                                                                        index
                                                                    ) => {
                                                                        return (
                                                                            <tr
                                                                                key={
                                                                                    index
                                                                                }
                                                                            >
                                                                                <td>
                                                                                    {
                                                                                        compteur++
                                                                                    }{" "}
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.NumCompte
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.NomCompte
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.RefTypeCompte
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.RefCadre
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.RefGroupe
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    {
                                                                                        res.RefSousGroupe
                                                                                    }
                                                                                </td>
                                                                            </tr>
                                                                        );
                                                                    }
                                                                )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </table>
                                        <div className="container">
                                            {fetchCreatedAccount && (
                                                <div className="float-end mt-2">
                                                    <button
                                                        onClick={() =>
                                                            exportTableData(
                                                                "main-table-balance"
                                                            )
                                                        }
                                                        className="btn btn-success"
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                    >
                                                        <i class="fas fa-file-excel"></i>{" "}
                                                        Exporter en Excel
                                                    </button>{" "}
                                                    <button
                                                        className="btn btn-primary"
                                                        style={{
                                                            borderRadius: "0px",
                                                        }}
                                                        onClick={exportToPDF}
                                                    >
                                                        {" "}
                                                        <i class="fas fa-file-pdf"></i>{" "}
                                                        Exporter en PDF
                                                    </button>
                                                </div>
                                            )}
                                            <br /> <br /> <br />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Comptes;
