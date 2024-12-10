import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { EnteteRecu } from "../EnteteRecu";
import { jsPDF } from "jspdf";
import * as FileSaver from "file-saver";
import html2canvas from "html2canvas";
import { EnteteBordereau } from "../EnteteBordereau";

const RecuDepot = ({ data }) => {
    function Unite(nombre) {
        var unite;
        switch (nombre) {
            case 0:
                unite = "zéro";
                break;
            case 1:
                unite = "un";
                break;
            case 2:
                unite = "deux";
                break;
            case 3:
                unite = "trois";
                break;
            case 4:
                unite = "quatre";
                break;
            case 5:
                unite = "cinq";
                break;
            case 6:
                unite = "six";
                break;
            case 7:
                unite = "sept";
                break;
            case 8:
                unite = "huit";
                break;
            case 9:
                unite = "neuf";
                break;
        } //fin switch
        return unite;
    } //-----------------------------------------------------------------------

    function Dizaine(nombre) {
        let dizaine = "";
        switch (nombre) {
            case 10:
                dizaine = "dix";
                break;
            case 11:
                dizaine = "onze";
                break;
            case 12:
                dizaine = "douze";
                break;
            case 13:
                dizaine = "treize";
                break;
            case 14:
                dizaine = "quatorze";
                break;
            case 15:
                dizaine = "quinze";
                break;
            case 16:
                dizaine = "seize";
                break;
            case 17:
                dizaine = "dix-sept";
                break;
            case 18:
                dizaine = "dix-huit";
                break;
            case 19:
                dizaine = "dix-neuf";
                break;
            case 20:
                dizaine = "vingt";
                break;
            case 30:
                dizaine = "trente";
                break;
            case 40:
                dizaine = "quarante";
                break;
            case 50:
                dizaine = "cinquante";
                break;
            case 60:
                dizaine = "soixante";
                break;
            case 70:
                dizaine = "soixante-dix";
                break;
            case 80:
                dizaine = "quatre-vingt";
                break;
            case 90:
                dizaine = "quatre-vingt-dix";
                break;
        } //fin switch
        return dizaine;
    } //-----------------------------------------------------------------------

    function NumberToLetter(nombre) {
        var i, j, n, quotient, reste, nb;
        var ch;
        var numberToLetter = "";
        //__________________________________

        if (nombre.toString().replace(/ /gi, "").length > 15)
            return "dépassement de capacité";
        if (isNaN(nombre.toString().replace(/ /gi, "")))
            return "Nombre non valide";

        nb = parseFloat(nombre.toString().replace(/ /gi, ""));
        if (Math.ceil(nb) != nb) return "Nombre avec virgule non géré.";

        n = nb.toString().length;
        switch (n) {
            case 1:
                numberToLetter = Unite(nb);
                break;
            case 2:
                if (nb > 19) {
                    quotient = Math.floor(nb / 10);
                    reste = nb % 10;
                    if (nb < 71 || (nb > 79 && nb < 91)) {
                        if (reste == 0) numberToLetter = Dizaine(quotient * 10);
                        if (reste == 1)
                            numberToLetter =
                                Dizaine(quotient * 10) + "-et-" + Unite(reste);
                        if (reste > 1)
                            numberToLetter =
                                Dizaine(quotient * 10) + "-" + Unite(reste);
                    } else
                        numberToLetter =
                            Dizaine((quotient - 1) * 10) +
                            "-" +
                            Dizaine(10 + reste);
                } else numberToLetter = Dizaine(nb);
                break;
            case 3:
                quotient = Math.floor(nb / 100);
                reste = nb % 100;
                if (quotient == 1 && reste == 0) numberToLetter = "cent";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "cent" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = Unite(quotient) + " cents";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        Unite(quotient) + " cent " + NumberToLetter(reste);
                break;
            case 4:
                quotient = Math.floor(nb / 1000);
                reste = nb - quotient * 1000;
                if (quotient == 1 && reste == 0) numberToLetter = "mille";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "mille" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " mille";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " mille " +
                        NumberToLetter(reste);
                break;
            case 5:
                quotient = Math.floor(nb / 1000);
                reste = nb - quotient * 1000;
                if (quotient == 1 && reste == 0) numberToLetter = "mille";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "mille" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " mille";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " mille " +
                        NumberToLetter(reste);
                break;
            case 6:
                quotient = Math.floor(nb / 1000);
                reste = nb - quotient * 1000;
                if (quotient == 1 && reste == 0) numberToLetter = "mille";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "mille" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " mille";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " mille " +
                        NumberToLetter(reste);
                break;
            case 7:
                quotient = Math.floor(nb / 1000000);
                reste = nb % 1000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un million";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un million" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " millions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " millions " +
                        NumberToLetter(reste);
                break;
            case 8:
                quotient = Math.floor(nb / 1000000);
                reste = nb % 1000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un million";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un million" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " millions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " millions " +
                        NumberToLetter(reste);
                break;
            case 9:
                quotient = Math.floor(nb / 1000000);
                reste = nb % 1000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un million";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un million" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " millions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " millions " +
                        NumberToLetter(reste);
                break;
            case 10:
                quotient = Math.floor(nb / 1000000000);
                reste = nb - quotient * 1000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
                if (quotient == 1 && reste != 0)
                    numberToLetter =
                        "un milliard" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " milliards";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " milliards " +
                        NumberToLetter(reste);
                break;
            case 11:
                quotient = Math.floor(nb / 1000000000);
                reste = nb - quotient * 1000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
                if (quotient == 1 && reste != 0)
                    numberToLetter =
                        "un milliard" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " milliards";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " milliards " +
                        NumberToLetter(reste);
                break;
            case 12:
                quotient = Math.floor(nb / 1000000000);
                reste = nb - quotient * 1000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un milliard";
                if (quotient == 1 && reste != 0)
                    numberToLetter =
                        "un milliard" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " milliards";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " milliards " +
                        NumberToLetter(reste);
                break;
            case 13:
                quotient = Math.floor(nb / 1000000000000);
                reste = nb - quotient * 1000000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un billion";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un billion" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " billions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " billions " +
                        NumberToLetter(reste);
                break;
            case 14:
                quotient = Math.floor(nb / 1000000000000);
                reste = nb - quotient * 1000000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un billion";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un billion" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " billions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " billions " +
                        NumberToLetter(reste);
                break;
            case 15:
                quotient = Math.floor(nb / 1000000000000);
                reste = nb - quotient * 1000000000000;
                if (quotient == 1 && reste == 0) numberToLetter = "un billion";
                if (quotient == 1 && reste != 0)
                    numberToLetter = "un billion" + " " + NumberToLetter(reste);
                if (quotient > 1 && reste == 0)
                    numberToLetter = NumberToLetter(quotient) + " billions";
                if (quotient > 1 && reste != 0)
                    numberToLetter =
                        NumberToLetter(quotient) +
                        " billions " +
                        NumberToLetter(reste);
                break;
        } //fin switch
        /*respect de l'accord de quatre-vingt*/
        if (
            numberToLetter.substr(
                numberToLetter.length - "quatre-vingt".length,
                "quatre-vingt".length
            ) == "quatre-vingt"
        )
            numberToLetter = numberToLetter + "s";

        return numberToLetter;
    } //-----------------------------------------------------------------------

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

    const exportToPDF = () => {
        const content = document.getElementById("modal-to-print");

        if (!content) {
            console.error("Element not found!");
            return;
        }

        html2canvas(content, { scale: 3 })
            .then((canvas) => {
                const imgData = canvas.toDataURL("image/png");
                const pdf = new jsPDF("p", "mm", "a4");

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                const imgProps = pdf.getImageProperties(imgData);
                const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

                let heightLeft = imgHeight;
                let position = 0;

                pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
                heightLeft -= pdfHeight;

                while (heightLeft >= 0) {
                    position = heightLeft - imgHeight;
                    pdf.addPage();
                    pdf.addImage(
                        imgData,
                        "PNG",
                        0,
                        position,
                        pdfWidth,
                        imgHeight
                    );
                    heightLeft -= pdfHeight;
                }

                pdf.autoPrint();
                window.open(pdf.output("bloburl"), "_blank");
            })
            .catch((error) => {
                console.error("Error capturing canvas:", error);
            });
    };

    const cellStyle = {
        paddingTop: "5px",
        paddingBottom: "5px",
        lineHeight: "1",
    };

    // Fonction pour obtenir le premier mot et la première lettre du deuxième mot
    const getShortenedName = (name) => {
        const words = name.split(" ");
        if (words.length > 1) {
            return `${words[0]} ${words[1][0]}`;
        }
        return name; // Retourne le nom original s'il n'y a pas de deuxième mot
    };
    return (
        <>
            <div
                className="modal fade card-body h-200"
                id="modal-delestage-cdf"
                style={{
                    background: "#dcdcdc",
                }}
            >
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            {/* <h4
                                style={{ color: "#000" }}
                                className="modal-title"
                            >
                                Recu appro {data.Reference}
                               
                            </h4> */}
                            <button
                                type="button"
                                class="close"
                                data-dismiss="modal"
                                aria-label="Close"
                                // onClick={clearData}
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body" id="modal-to-print">
                            <div className="row">
                                <div className="col-md-12">
                                    <div
                                    // className="card-body h-200"
                                    // style={{
                                    //     background: "#dcdcdc",
                                    // }}
                                    >
                                        <div className="row" id="printme">
                                            <div
                                                className="card"
                                                style={{
                                                    margin: "5px",
                                                    width: "100%",
                                                    marginTop: "-90px",
                                                    marginBottom: "-30px",
                                                }}
                                            >
                                                <div
                                                    className="logo-container"
                                                    style={{
                                                        // margin: "0 auto",
                                                        // width: "100%",
                                                        width: "40%",
                                                        textAlign: "left",
                                                    }}
                                                >
                                                    {" "}
                                                    <br />
                                                    <br />
                                                    {/* <div style={{ textAlign: "center" }}><h4><b>ACTION POUR LA PAIX L'EDUCATION ET LE DEFENSE DES DROITS HUMAINS</b></h4></div> */}
                                                    <div className="h-130 d-flex align-items-left justify-content-left">
                                                        <EnteteBordereau />
                                                    </div>
                                                </div>

                                                {data.montantEntre > 0 ? (
                                                    <>
                                                        <div
                                                            className="row"
                                                            style={{
                                                                // margin: "0px auto",
                                                                marginTop:
                                                                    "5px",
                                                                // margin: "auto",
                                                                width: "250px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h5
                                                                style={{
                                                                    background:
                                                                        "#dcdcdc",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "16px",
                                                                    marginBottom:
                                                                        "-30px",
                                                                    marginLeft:
                                                                        "35px",
                                                                    marginRight:
                                                                        "0px",
                                                                }}
                                                            >
                                                                BORDERAUX DE
                                                                DEPOT N°{" "}
                                                                {
                                                                    data.refOperation
                                                                }
                                                            </h5>{" "}
                                                        </div>
                                                        <div
                                                            class="card-body"
                                                            style={{
                                                                marginLeft:
                                                                    "2px",
                                                                marginRight:
                                                                    "2px",
                                                                marginTop:
                                                                    "30px",
                                                            }}
                                                        >
                                                            <div
                                                                className="row entete-recu"
                                                                style={{
                                                                    // width: "100%",
                                                                    width: "40%",
                                                                    // margin: "0px auto",
                                                                    background:
                                                                        "#dcdcdc",
                                                                    padding:
                                                                        "2px",
                                                                    color: "#000",
                                                                    border: "1px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <div className="col-md-12">
                                                                    <table
                                                                        className="table p-0"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                N°Compte
                                                                                :
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {
                                                                                    data.NumCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                CompteAbrégé
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    data.NumAbrege
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Intitulé
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                    lineHeight:
                                                                                        "0.3",
                                                                                }}
                                                                            >
                                                                                {getShortenedName(
                                                                                    data.NomMembre
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        ></tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Motif
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    data.Motif
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Dévise
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {data.Devise ==
                                                                                "CDF"
                                                                                    ? "CDF"
                                                                                    : "USD"}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div
                                                                align="left"
                                                                style={{
                                                                    marginLeft:
                                                                        "100px",
                                                                }}
                                                            >
                                                                BILLETAGE
                                                            </div>
                                                            <div
                                                                className="row  corp-recu"
                                                                // id=""
                                                                style={{
                                                                    // width: "100%",
                                                                    width: "40%",
                                                                    // margin: "0px auto",
                                                                    background:
                                                                        "#DCDCDC",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    border: "2px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <table
                                                                    className="table table-striped"
                                                                    style={{
                                                                        background:
                                                                            "#DCDCDC",
                                                                        padding:
                                                                            "5px",
                                                                        color: "#000",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">
                                                                                NbrBillets
                                                                            </th>
                                                                            <th scope="col">
                                                                                Coupure
                                                                            </th>
                                                                            <th scope="col">
                                                                                Total
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    {data.Devise ==
                                                                    "CDF" ? (
                                                                        <tbody>
                                                                            {parseInt(
                                                                                data.vightMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            20000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightMilleFranc
                                                                                            ) *
                                                                                                20000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.dixMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            10000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixMilleFranc
                                                                                            ) *
                                                                                                10000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            5000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqMilleFranc
                                                                                            ) *
                                                                                                5000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.milleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.milleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            1000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.milleFranc
                                                                                            ) *
                                                                                                1000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqCentFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqCentFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            500{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqCentFranc
                                                                                            ) *
                                                                                                500}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.deuxCentFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.deuxCentFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            200{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.deuxCentFranc
                                                                                            ) *
                                                                                                200}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            {parseInt(
                                                                                data.centFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            100{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centFranc
                                                                                            ) *
                                                                                                100}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinquanteFanc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteFanc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            50{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteFanc
                                                                                            ) *
                                                                                                50}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            <tr>
                                                                                <th>
                                                                                    Total
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        border: "0px",
                                                                                    }}
                                                                                ></th>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "16px",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    {parseInt(
                                                                                        data.montantEntre
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    ) : data.Devise ==
                                                                      "USD" ? (
                                                                        <tbody>
                                                                            {parseInt(
                                                                                data.centDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            100{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centDollars
                                                                                            ) *
                                                                                                100}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinquanteDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            50{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteDollars
                                                                                            ) *
                                                                                                50}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.vightDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            20{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightDollars
                                                                                            ) *
                                                                                                20}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.dixDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            10{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixDollars
                                                                                            ) *
                                                                                                10}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            5{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqDollars
                                                                                            ) *
                                                                                                5}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.unDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.unDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            1{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.unDollars
                                                                                            ) *
                                                                                                1}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            <tr>
                                                                                <th>
                                                                                    Total
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        border: "0px",
                                                                                    }}
                                                                                ></th>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "16px",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    {parseInt(
                                                                                        data.montantEntre
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    ) : null}
                                                                </table>
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "-10px",
                                                                    }}
                                                                >
                                                                    Nous disons{" "}
                                                                    {data.Devise ==
                                                                    "CDF"
                                                                        ? " CDF"
                                                                        : " USD"}
                                                                    <b>
                                                                        {" "}
                                                                        {NumberToLetter(
                                                                            data.montantEntre
                                                                        )}{" "}
                                                                        {data.Devise ==
                                                                        "CDF"
                                                                            ? "Francs congolais"
                                                                            : "Dollars américains"}
                                                                    </b>{" "}
                                                                </div>
                                                                <hr
                                                                    style={{
                                                                        border: "2px dashed #fff",
                                                                        width: "95%",
                                                                    }}
                                                                />
                                                                <div>
                                                                    Date valeur
                                                                    :{" "}
                                                                    {dateParser(
                                                                        data.DateTransaction
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    Fait à goma
                                                                    le{" "}
                                                                    {dateParser(
                                                                        new Date()
                                                                    )}{" "}
                                                                </div>
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                style={{
                                                                                    border: "2px solid #000",
                                                                                    padding:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                Signature{" "}
                                                                                {
                                                                                    data.NomUtilisateur
                                                                                }
                                                                            </th>
                                                                            {/* <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th> */}

                                                                            <th
                                                                                style={{
                                                                                    border: "2px solid #000",
                                                                                    padding:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <i>
                                                                                    Signature{" "}
                                                                                    {
                                                                                        data.Beneficiaire
                                                                                    }
                                                                                </i>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : data.montantSortie > 0 ? (
                                                    <>
                                                        <div
                                                            className="row"
                                                            style={{
                                                                // margin: "0px auto",
                                                                marginTop:
                                                                    "5px",
                                                                // margin: "auto",
                                                                width: "250px",
                                                                textAlign:
                                                                    "center",
                                                            }}
                                                        >
                                                            {" "}
                                                            <h5
                                                                style={{
                                                                    background:
                                                                        "#dcdcdc",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    fontSize:
                                                                        "16px",
                                                                    marginBottom:
                                                                        "-30px",
                                                                    marginLeft:
                                                                        "35px",
                                                                    marginRight:
                                                                        "0px",
                                                                }}
                                                            >
                                                                BORDERAUX DE
                                                                RETRAIT N°{" "}
                                                                {
                                                                    data.refOperation
                                                                }
                                                            </h5>{" "}
                                                        </div>
                                                        <div
                                                            class="card-body"
                                                            style={{
                                                                marginLeft:
                                                                    "2px",
                                                                marginRight:
                                                                    "2px",
                                                                marginTop:
                                                                    "30px",
                                                            }}
                                                        >
                                                            <div
                                                                className="row entete-recu"
                                                                style={{
                                                                    // width: "100%",
                                                                    width: "40%",
                                                                    // margin: "0px auto",
                                                                    background:
                                                                        "#dcdcdc",
                                                                    padding:
                                                                        "2px",
                                                                    color: "#000",
                                                                    border: "1px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <div className="col-md-12">
                                                                    <table
                                                                        className="table p-0"
                                                                        style={{
                                                                            width: "100%",
                                                                        }}
                                                                    >
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                N°Compte
                                                                                :
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                {
                                                                                    data.NumCompte
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                CompteAbrégé
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {
                                                                                    data.NumAbrege
                                                                                }
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                    lineHeight:
                                                                                        "0.3",
                                                                                }}
                                                                            >
                                                                                Intitulé
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {getShortenedName(
                                                                                    data.NomMembre
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        ></tr>

                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Motif
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {getShortenedName(
                                                                                    data.Motif
                                                                                )}
                                                                            </td>
                                                                        </tr>
                                                                        <tr
                                                                            style={{
                                                                                border: "1px solid #fff",
                                                                                lineHeight:
                                                                                    "0.3",
                                                                            }}
                                                                        >
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                Dévise
                                                                            </td>
                                                                            <td
                                                                                style={{
                                                                                    border: "1px solid #fff",
                                                                                }}
                                                                            >
                                                                                {data.Devise ==
                                                                                "CDF"
                                                                                    ? "CDF"
                                                                                    : "USD"}
                                                                            </td>
                                                                        </tr>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div
                                                                align="left"
                                                                style={{
                                                                    marginLeft:
                                                                        "100px",
                                                                }}
                                                            >
                                                                BILLETAGE
                                                            </div>
                                                            <div
                                                                className="row  corp-recu"
                                                                // id=""
                                                                style={{
                                                                    // width: "100%",
                                                                    width: "40%",
                                                                    // margin: "0px auto",
                                                                    background:
                                                                        "#DCDCDC",
                                                                    padding:
                                                                        "5px",
                                                                    color: "#000",
                                                                    border: "2px solid #444",
                                                                    borderRadius:
                                                                        "10px",
                                                                }}
                                                            >
                                                                <table
                                                                    className="table table-striped"
                                                                    style={{
                                                                        background:
                                                                            "#DCDCDC",
                                                                        padding:
                                                                            "5px",
                                                                        color: "#000",
                                                                        width: "100%",
                                                                    }}
                                                                >
                                                                    <thead>
                                                                        <tr>
                                                                            <th scope="col">
                                                                                NbrBillets
                                                                            </th>
                                                                            <th scope="col">
                                                                                Coupure
                                                                            </th>
                                                                            <th scope="col">
                                                                                Total
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                    {data.Devise ==
                                                                    "CDF" ? (
                                                                        <tbody>
                                                                            {parseInt(
                                                                                data.vightMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            20000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightMilleFranc
                                                                                            ) *
                                                                                                20000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.dixMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            10000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixMilleFranc
                                                                                            ) *
                                                                                                10000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqMilleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqMilleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            5000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqMilleFranc
                                                                                            ) *
                                                                                                5000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.milleFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.milleFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            1000{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.milleFranc
                                                                                            ) *
                                                                                                1000}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqCentFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqCentFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            500{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqCentFranc
                                                                                            ) *
                                                                                                500}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.deuxCentFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.deuxCentFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            200{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.deuxCentFranc
                                                                                            ) *
                                                                                                200}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            {parseInt(
                                                                                data.centFranc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centFranc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            100{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centFranc
                                                                                            ) *
                                                                                                100}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinquanteFanc
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteFanc
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            50{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteFanc
                                                                                            ) *
                                                                                                50}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            <tr>
                                                                                <th>
                                                                                    Total
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        border: "0px",
                                                                                    }}
                                                                                ></th>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "15px",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    {parseInt(
                                                                                        data.montantSortie
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    ) : data.Devise ==
                                                                      "USD" ? (
                                                                        <tbody>
                                                                            {parseInt(
                                                                                data.centDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            100{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.centDollars
                                                                                            ) *
                                                                                                100}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinquanteDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            50{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinquanteDollars
                                                                                            ) *
                                                                                                50}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.vightDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            20{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.vightDollars
                                                                                            ) *
                                                                                                20}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.dixDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            10{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.dixDollars
                                                                                            ) *
                                                                                                10}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.cinqDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            5{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.cinqDollars
                                                                                            ) *
                                                                                                5}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}
                                                                            {parseInt(
                                                                                data.unDollars
                                                                            ) >
                                                                                0 && (
                                                                                <React.Fragment>
                                                                                    <tr
                                                                                        style={{
                                                                                            lineHeight:
                                                                                                "0.3",
                                                                                        }}
                                                                                    >
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.unDollars
                                                                                            )}{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            X
                                                                                            1{" "}
                                                                                        </td>
                                                                                        <td>
                                                                                            {parseInt(
                                                                                                data.unDollars
                                                                                            ) *
                                                                                                1}
                                                                                        </td>
                                                                                    </tr>
                                                                                </React.Fragment>
                                                                            )}

                                                                            <tr>
                                                                                <th>
                                                                                    Total
                                                                                </th>
                                                                                <th
                                                                                    style={{
                                                                                        border: "0px",
                                                                                    }}
                                                                                ></th>
                                                                                <td
                                                                                    style={{
                                                                                        fontSize:
                                                                                            "16px",
                                                                                        fontWeight:
                                                                                            "bold",
                                                                                    }}
                                                                                >
                                                                                    {parseInt(
                                                                                        data.montantSortie
                                                                                    )}
                                                                                </td>
                                                                            </tr>
                                                                        </tbody>
                                                                    ) : null}
                                                                </table>
                                                                <div
                                                                    style={{
                                                                        marginTop:
                                                                            "-10px",
                                                                    }}
                                                                >
                                                                    Nous disons
                                                                    {data.Devise ==
                                                                    "CDF"
                                                                        ? " CDF"
                                                                        : " USD"}
                                                                    <b>
                                                                        {" "}
                                                                        {NumberToLetter(
                                                                            data.montantSortie
                                                                        )}{" "}
                                                                        {data.Devise ==
                                                                        "CDF"
                                                                            ? " Francs congolais"
                                                                            : " Dollars américains"}
                                                                    </b>{" "}
                                                                </div>
                                                                <hr
                                                                    style={{
                                                                        border: "2px dashed #fff",
                                                                        width: "95%",
                                                                    }}
                                                                />
                                                                <div>
                                                                    Date valeur
                                                                    :{" "}
                                                                    {dateParser(
                                                                        data.DateTransaction
                                                                    )}
                                                                </div>

                                                                <div>
                                                                    Fait à goma
                                                                    le{" "}
                                                                    {dateParser(
                                                                        new Date()
                                                                    )}{" "}
                                                                </div>
                                                                <table className="table table-striped">
                                                                    <thead>
                                                                        <tr>
                                                                            <th
                                                                                style={{
                                                                                    border: "2px solid #000",
                                                                                    padding:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                {" "}
                                                                                Signature{" "}
                                                                                {
                                                                                    data.NomUtilisateur
                                                                                }
                                                                            </th>
                                                                            {/* <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th>
                                                                    <th></th> */}

                                                                            <th
                                                                                style={{
                                                                                    border: "2px solid #000",
                                                                                    padding:
                                                                                        "20px",
                                                                                }}
                                                                            >
                                                                                <i>
                                                                                    Signature{" "}
                                                                                    {
                                                                                        data.Beneficiaire
                                                                                    }
                                                                                </i>
                                                                            </th>
                                                                        </tr>
                                                                    </thead>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer justify-content-between">
                            {/* <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
              <button type="button" className="btn btn-primary">Sav changes</button> */}
                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={exportToPDF}
                            >
                                Imprimer
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
export default RecuDepot;
