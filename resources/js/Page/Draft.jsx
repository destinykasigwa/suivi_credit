{
    /* <tbody>
                                    {fetchBalanceAgee.length != 0 &&
                                        fetchBalanceAgee.map((res, index) => {
                                            return res.NbrJrRetard <= 0 ||
                                                res.NbrJrRetard == null ? (
                                                <>
                                                    <p>Crédits sains</p>
                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : res.NbrJrRetard > 1 &&
                                              res.NbrJrRetard <= 30 ? (
                                                <>
                                                    <p>De 1 à 30 jrs</p>
                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : res.NbrJrRetard > 31 &&
                                              res.NbrJrRetard <= 60 ? (
                                                <>
                                                    <p>
                                                        En retard de 31 à 60
                                                        jours{" "}
                                                    </p>
                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : res.NbrJrRetard > 61 &&
                                              res.NbrJrRetard <= 90 ? (
                                                <>
                                                    <p>
                                                        En retard de 61 à 90
                                                        jours
                                                    </p>
                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : res.NbrJrRetard > 91 &&
                                              res.NbrJrRetard <= 180 ? (
                                                <>
                                                    <p>
                                                        {" "}
                                                        En retard de 91 à 180
                                                        jours
                                                    </p>

                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : res.NbrJrRetard > 180 ? (
                                                <>
                                                    <p>
                                                        {" "}
                                                        En retard de plus de 180
                                                        jours{" "}
                                                    </p>
                                                    <tr key={index}>
                                                        <td>{compteur++}</td>
                                                        <td>
                                                            {res.NumDossier}
                                                        </td>
                                                        <td>
                                                            {
                                                                res.NumCompteCredit
                                                            }
                                                        </td>
                                                        <td>{res.NomCompte}</td>
                                                        <td>{res.Duree}</td>
                                                        <td>
                                                            {dateParser(
                                                                res.DateOctroi
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.MontantAccorde}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalCapitalRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {numberWithSpaces(
                                                                res.TotalInteretRembourse.toFixed(
                                                                    2
                                                                )
                                                            )}
                                                        </td>
                                                        <td>
                                                            {res.CapitalRestant &&
                                                                numberWithSpaces(
                                                                    res.CapitalRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td>
                                                            {res.InteretRestant &&
                                                                numberWithSpaces(
                                                                    res.InteretRestant.toFixed(
                                                                        2
                                                                    )
                                                                )}
                                                        </td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td></td>
                                                        <td>
                                                            {res.NbrJrRetard}
                                                        </td>
                                                    </tr>
                                                </>
                                            ) : (
                                                "Default result"
                                            );
                                        })}
                                </tbody> */
}
