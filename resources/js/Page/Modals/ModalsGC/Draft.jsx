// import React, { useEffect, useState } from "react";
// import {
//     MdTimeline,
//     MdClose,
//     MdDelete,
//     MdVisibility,
//     MdVisibilityOff,
// } from "react-icons/md";
// import axios from "axios";
// import Swal from "sweetalert2";
// // import { Modal } from "bootstrap";

// export default function CreditTimeline({ creditId }) {
//     const [timeline, setTimeline] = useState([]);
//     const [currentUser, setCurrentUser] = useState();
//     const [selectedSignature, setSelectedSignature] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [showDeleteModal, setShowDeleteModal] = useState(false);
//     const [deleteId, setDeleteId] = useState(null);

//     useEffect(() => {
//         getTimeLine();
//     }, [creditId]);

//     const getTimeLine = () => {
//         setLoading(true);
//         axios
//             .get(`/gestion_credit/modal/${creditId}/timeline`)
//             .then((res) => {
//                 setTimeline(res.data.data || []);
//                 setCurrentUser(res.data.current_user);
//                 setLoading(false);
//             })
//             .catch((err) => {
//                 console.error(err);
//                 setLoading(false);
//             });
//     };

//     const dateParser = (num) => {
//         if (!num) return "";
//         const options = {
//             year: "numeric",
//             month: "numeric",
//             day: "numeric",
//             hour: "2-digit",
//             minute: "2-digit",
//         };
//         let timestamp = Date.parse(num);
//         let date = new Date(timestamp).toLocaleDateString("fr-FR", options);
//         return date.toString();
//     };

//     // Remplacer deleteSignature par:
//     const openDeleteConfirm = (id) => {
//         console.log("ID à supprimer:", id);
//         setDeleteId(id);
//         setShowDeleteModal(true);
//     };

//     const closeDeleteModal = () => {
//         setShowDeleteModal(false);
//         setDeleteId(null);
//     };

//     const executeDelete = async () => {
//         if (!deleteId) return;

//         try {
//             const res = await axios.delete(
//                 "/gestion_credit/pages/files/credit/timeline/signature/delete/" +
//                     deleteId,
//             );

//             console.log("Réponse:", res.data);

//             if (res.data.status == 1) {
//                 getTimeLine();
//                 closeDeleteModal();
//                 // Petit toast ou alert
//                 alert(res.data.msg);
//             } else {
//                 alert(res.data.msg || "Erreur lors de la suppression");
//             }
//         } catch (error) {
//             console.error("Erreur:", error);
//             alert("Une erreur est survenue");
//         }
//     };

//     const getDelayText = (delay) => {
//         if (delay === 0) return "📅 Le même jour que la signature précédente";
//         if (delay === 1) return "📅 1 jour après la signature précédente";
//         return `📅 ${delay} jours après la signature précédente`;
//     };

//     return (
//         <div
//             className="container-fluid p-0"
//             style={{
//                 background: "linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)",
//                 minHeight: "100vh",
//                 width: "100%",
//                 display: "flex",
//                 flexDirection: "column",
//             }}
//         >
//             {/* Header moderne épuré - Fixe en haut
//     <div
//         className="modal-header border-0"
//         style={{
//             background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
//             borderRadius: 0,
//             padding: "1.5rem 2rem",
//             flexShrink: 0,
//             margin: 0,
//         }}
//     >
//         <div className="d-flex align-items-center justify-content-between w-100">
//             <div className="d-flex align-items-center gap-3">
//                 <div
//                     style={{
//                         width: "48px",
//                         height: "48px",
//                         background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)",
//                         borderRadius: "16px",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         backdropFilter: "blur(10px)",
//                         border: "1px solid rgba(16, 185, 129, 0.2)"
//                     }}
//                 >
//                     <MdTimeline size={24} color="#10b981" />
//                 </div>
//                 <div>
//                     <h4 className="fw-bold mb-1" style={{
//                         background: "linear-gradient(135deg, #ffffff 0%, #e2e8f0 100%)",
//                         WebkitBackgroundClip: "text",
//                         WebkitTextFillColor: "transparent",
//                         backgroundClip: "text",
//                         letterSpacing: "-0.3px",
//                         margin: 0
//                     }}>
//                         Historique des signatures
//                     </h4>
//                     <p className="mb-0" style={{
//                         fontSize: "0.875rem",
//                         color: "rgba(255, 255, 255, 0.7)",
//                         fontWeight: "400"
//                     }}>
//                         Suivi chronologique des signatures du dossier
//                     </p>
//                 </div>
//             </div>
//         </div>
//     </div> */}

//             {/* Contenu principal qui prend tout l'espace restant */}
//             <div
//                 className="modal-body p-0"
//                 style={{ flex: 1, overflow: "hidden" }}
//             >
//                 {/* État de chargement */}
//                 {loading && (
//                     <div
//                         className="text-center py-5 px-4"
//                         style={{
//                             height: "100%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexDirection: "column",
//                         }}
//                     >
//                         <div className="position-relative d-inline-block mb-4">
//                             <div
//                                 className="spinner-border text-success"
//                                 role="status"
//                                 style={{
//                                     width: "48px",
//                                     height: "48px",
//                                     borderWidth: "3px",
//                                     color: "#10b981",
//                                 }}
//                             >
//                                 <span className="visually-hidden">
//                                     Chargement...
//                                 </span>
//                             </div>
//                         </div>
//                         <h6
//                             className="fw-semibold mb-2"
//                             style={{ color: "#1e293b" }}
//                         >
//                             Chargement de l'historique
//                         </h6>
//                         <p className="text-muted small mb-0">
//                             Veuillez patienter quelques instants...
//                         </p>
//                     </div>
//                 )}
//                 {/* Aucune signature */}
//                 {!loading && timeline.length === 0 && (
//                     <div
//                         className="text-center py-5 px-4"
//                         style={{
//                             height: "100%",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             flexDirection: "column",
//                         }}
//                     >
//                         <div
//                             className="d-inline-flex align-items-center justify-content-center mb-4"
//                             style={{
//                                 width: "96px",
//                                 height: "96px",
//                                 background:
//                                     "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
//                                 borderRadius: "32px",
//                             }}
//                         >
//                             <MdTimeline size={40} color="#94a3b8" />
//                         </div>
//                         <h6
//                             className="fw-bold mb-2"
//                             style={{ color: "#1e293b", fontSize: "1.1rem" }}
//                         >
//                             Aucune signature
//                         </h6>
//                         <p
//                             className="text-muted small mb-0"
//                             style={{ maxWidth: "280px", margin: "0 auto" }}
//                         >
//                             Aucune signature n'a été enregistrée pour ce dossier
//                         </p>
//                     </div>
//                 )}
//                 {/* Timeline avec signatures - Plein écran */}
//                 {!loading && timeline.length > 0 && (
//                     <div
//                         style={{
//                             height: "100%",
//                             background: "#f8fafc",
//                             overflow: "hidden",
//                         }}
//                     >
//                         <div
//                             className="timeline-container"
//                             style={{
//                                 position: "relative",
//                                 height: "100%",
//                                 overflowY: "auto",
//                                 padding: "2rem",
//                             }}
//                         >
//                             {/* Ligne verticale moderne */}
//                             <div
//                                 style={{
//                                     position: "absolute",
//                                     left: "calc(2rem + 28px)",
//                                     top: "2rem",
//                                     bottom: "2rem",
//                                     width: "2px",
//                                     background:
//                                         "linear-gradient(180deg, #10b981 0%, #cbd5e1 50%, #e2e8f0 100%)",
//                                     borderRadius: "2px",
//                                 }}
//                             ></div>

//                             <ul
//                                 className="list-unstyled mb-0"
//                                 style={{ maxWidth: "1200px", margin: "0 auto" }}
//                             >
//                                 {timeline.map((item, index) => (
//                                     <li
//                                         key={index}
//                                         className="mb-4 position-relative"
//                                         style={{
//                                             paddingLeft: "68px",
//                                             animation: "fadeInUp 0.4s ease-out",
//                                         }}
//                                     >
//                                         {/* Point de timeline moderne */}
//                                         <div
//                                             style={{
//                                                 position: "absolute",
//                                                 left: "20px",
//                                                 top: "8px",
//                                                 width: "20px",
//                                                 height: "20px",
//                                                 background:
//                                                     index === 0
//                                                         ? "#10b981"
//                                                         : "#ffffff",
//                                                 border: `2.5px solid ${index === 0 ? "#10b981" : "#cbd5e1"}`,
//                                                 borderRadius: "50%",
//                                                 zIndex: 2,
//                                                 boxShadow:
//                                                     index === 0
//                                                         ? "0 0 0 4px rgba(16, 185, 129, 0.2), 0 0 0 8px rgba(16, 185, 129, 0.1)"
//                                                         : "0 2px 4px rgba(0, 0, 0, 0.05)",
//                                                 transition: "all 0.2s ease",
//                                             }}
//                                         ></div>

//                                         {/* Carte de signature modernisée */}
//                                         <div
//                                             className="card border-0 shadow-hover"
//                                             style={{
//                                                 transition:
//                                                     "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                                                 backgroundColor: "#ffffff",
//                                                 borderRadius: "20px",
//                                                 border:
//                                                     index === 0
//                                                         ? "1px solid rgba(16, 185, 129, 0.2)"
//                                                         : "1px solid #f1f5f9",
//                                                 boxShadow:
//                                                     index === 0
//                                                         ? "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1)"
//                                                         : "0 2px 8px rgba(0, 0, 0, 0.04)",
//                                             }}
//                                             onMouseEnter={(e) => {
//                                                 e.currentTarget.style.transform =
//                                                     "translateX(4px)";
//                                                 e.currentTarget.style.boxShadow =
//                                                     "0 8px 24px rgba(0, 0, 0, 0.08)";
//                                             }}
//                                             onMouseLeave={(e) => {
//                                                 e.currentTarget.style.transform =
//                                                     "translateX(0)";
//                                                 e.currentTarget.style.boxShadow =
//                                                     index === 0
//                                                         ? "0 4px 12px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(16, 185, 129, 0.1)"
//                                                         : "0 2px 8px rgba(0, 0, 0, 0.04)";
//                                             }}
//                                         >
//                                             <div className="card-body p-4">
//                                                 <div className="d-flex justify-content-between align-items-start flex-wrap gap-3">
//                                                     <div className="flex-grow-1">
//                                                         <div className="d-flex align-items-center gap-2 mb-2">
//                                                             <span
//                                                                 className="fw-bold"
//                                                                 style={{
//                                                                     fontSize:
//                                                                         "1rem",
//                                                                     color: "#0f172a",
//                                                                     letterSpacing:
//                                                                         "-0.2px",
//                                                                 }}
//                                                             >
//                                                                 {item.signed_by}
//                                                             </span>
//                                                             {index === 0 && (
//                                                                 <span
//                                                                     className="badge"
//                                                                     style={{
//                                                                         background:
//                                                                             "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//                                                                         color: "white",
//                                                                         fontSize:
//                                                                             "0.7rem",
//                                                                         padding:
//                                                                             "4px 10px",
//                                                                         borderRadius:
//                                                                             "30px",
//                                                                         fontWeight:
//                                                                             "500",
//                                                                         letterSpacing:
//                                                                             "-0.2px",
//                                                                     }}
//                                                                 >
//                                                                     ✨ Dernière
//                                                                     signature
//                                                                 </span>
//                                                             )}
//                                                         </div>

//                                                         <div className="d-flex flex-wrap gap-3 mb-2">
//                                                             <div className="d-flex align-items-center gap-2">
//                                                                 <svg
//                                                                     width="14"
//                                                                     height="14"
//                                                                     viewBox="0 0 24 24"
//                                                                     fill="none"
//                                                                     stroke="#64748b"
//                                                                     strokeWidth="2"
//                                                                 >
//                                                                     <rect
//                                                                         x="3"
//                                                                         y="4"
//                                                                         width="18"
//                                                                         height="18"
//                                                                         rx="2"
//                                                                         ry="2"
//                                                                     ></rect>
//                                                                     <line
//                                                                         x1="16"
//                                                                         y1="2"
//                                                                         x2="16"
//                                                                         y2="6"
//                                                                     ></line>
//                                                                     <line
//                                                                         x1="8"
//                                                                         y1="2"
//                                                                         x2="8"
//                                                                         y2="6"
//                                                                     ></line>
//                                                                     <line
//                                                                         x1="3"
//                                                                         y1="10"
//                                                                         x2="21"
//                                                                         y2="10"
//                                                                     ></line>
//                                                                 </svg>
//                                                                 <small
//                                                                     className="text-secondary"
//                                                                     style={{
//                                                                         color: "#64748b",
//                                                                     }}
//                                                                 >
//                                                                     Signé le :{" "}
//                                                                     {dateParser(
//                                                                         item.signed_at,
//                                                                     )}
//                                                                 </small>
//                                                             </div>

//                                                             {item.delay_from_previous !==
//                                                                 null && (
//                                                                 <div className="d-flex align-items-center gap-2">
//                                                                     <svg
//                                                                         width="14"
//                                                                         height="14"
//                                                                         viewBox="0 0 24 24"
//                                                                         fill="none"
//                                                                         stroke="#64748b"
//                                                                         strokeWidth="2"
//                                                                     >
//                                                                         <circle
//                                                                             cx="12"
//                                                                             cy="12"
//                                                                             r="10"
//                                                                         ></circle>
//                                                                         <polyline points="12 6 12 12 16 14"></polyline>
//                                                                     </svg>
//                                                                     <small className="text-secondary">
//                                                                         {getDelayText(
//                                                                             item.delay_from_previous,
//                                                                         )}
//                                                                     </small>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>

//                                                     {/* Boutons d'action modernisés */}
//                                                     {item.signature_file && (
//                                                         <div className="d-flex gap-2">
//                                                             <button
//                                                                 className="btn"
//                                                                 onClick={() =>
//                                                                     setSelectedSignature(
//                                                                         selectedSignature ===
//                                                                             `storage/${item.signature_file}`
//                                                                             ? null
//                                                                             : `storage/${item.signature_file}`,
//                                                                     )
//                                                                 }
//                                                                 style={{
//                                                                     background:
//                                                                         selectedSignature ===
//                                                                         `storage/${item.signature_file}`
//                                                                             ? "#e2e8f0"
//                                                                             : "#f1f5f9",
//                                                                     color: "#334155",
//                                                                     borderRadius:
//                                                                         "12px",
//                                                                     padding:
//                                                                         "8px 16px",
//                                                                     fontSize:
//                                                                         "0.8rem",
//                                                                     fontWeight:
//                                                                         "500",
//                                                                     transition:
//                                                                         "all 0.2s ease",
//                                                                     border: "none",
//                                                                 }}
//                                                                 onMouseEnter={(
//                                                                     e,
//                                                                 ) => {
//                                                                     e.currentTarget.style.background =
//                                                                         "#e2e8f0";
//                                                                     e.currentTarget.style.transform =
//                                                                         "translateY(-1px)";
//                                                                 }}
//                                                                 onMouseLeave={(
//                                                                     e,
//                                                                 ) => {
//                                                                     e.currentTarget.style.background =
//                                                                         selectedSignature ===
//                                                                         `storage/${item.signature_file}`
//                                                                             ? "#e2e8f0"
//                                                                             : "#f1f5f9";
//                                                                     e.currentTarget.style.transform =
//                                                                         "translateY(0)";
//                                                                 }}
//                                                             >
//                                                                 <i
//                                                                     className={`fas ${selectedSignature === `storage/${item.signature_file}` ? "fa-eye-slash" : "fa-eye"} me-2`}
//                                                                 ></i>
//                                                                 {selectedSignature ===
//                                                                 `storage/${item.signature_file}`
//                                                                     ? "Masquer"
//                                                                     : "Voir la signature"}
//                                                             </button>

//                                                             {currentUser &&
//                                                                 (item.signed_by ===
//                                                                     currentUser.role ||
//                                                                     currentUser.role ===
//                                                                         "DG") && (
//                                                                     // Dans votre bouton Supprimer, remplacez onClick:
//                                                                     <button
//                                                                         className="btn"
//                                                                         onClick={() =>
//                                                                             openDeleteConfirm(
//                                                                                 item.id,
//                                                                             )
//                                                                         } // Changement ici
//                                                                         style={{
//                                                                             background:
//                                                                                 "#fef2f2",
//                                                                             color: "#dc2626",
//                                                                             borderRadius:
//                                                                                 "12px",
//                                                                             padding:
//                                                                                 "8px 16px",
//                                                                             fontSize:
//                                                                                 "0.8rem",
//                                                                             fontWeight:
//                                                                                 "500",
//                                                                             transition:
//                                                                                 "all 0.2s ease",
//                                                                             border: "none",
//                                                                         }}
//                                                                     >
//                                                                         <MdDelete
//                                                                             size={
//                                                                                 14
//                                                                             }
//                                                                             className="me-1"
//                                                                         />
//                                                                         Supprimer
//                                                                     </button>
//                                                                 )}
//                                                         </div>
//                                                     )}
//                                                 </div>

//                                                 {/* Aperçu de la signature modernisé */}
//                                                 {selectedSignature ===
//                                                     `storage/${item.signature_file}` && (
//                                                     <div
//                                                         className="mt-4 overflow-hidden"
//                                                         style={{
//                                                             background:
//                                                                 "#ffffff",
//                                                             borderRadius:
//                                                                 "16px",
//                                                             border: "1px solid #e2e8f0",
//                                                         }}
//                                                     >
//                                                         <div
//                                                             className="px-4 py-3"
//                                                             style={{
//                                                                 background:
//                                                                     "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
//                                                                 borderBottom:
//                                                                     "1px solid #e2e8f0",
//                                                             }}
//                                                         >
//                                                             <div className="d-flex align-items-center gap-2">
//                                                                 <svg
//                                                                     width="18"
//                                                                     height="18"
//                                                                     viewBox="0 0 24 24"
//                                                                     fill="none"
//                                                                     stroke="#64748b"
//                                                                     strokeWidth="2"
//                                                                 >
//                                                                     <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
//                                                                     <polyline points="14 2 14 8 20 8"></polyline>
//                                                                     <line
//                                                                         x1="16"
//                                                                         y1="13"
//                                                                         x2="8"
//                                                                         y2="13"
//                                                                     ></line>
//                                                                     <line
//                                                                         x1="16"
//                                                                         y1="17"
//                                                                         x2="8"
//                                                                         y2="17"
//                                                                     ></line>
//                                                                     <polyline points="10 9 9 9 8 9"></polyline>
//                                                                 </svg>
//                                                                 <small
//                                                                     className="fw-semibold"
//                                                                     style={{
//                                                                         color: "#475569",
//                                                                     }}
//                                                                 >
//                                                                     Aperçu du
//                                                                     document
//                                                                     signé
//                                                                 </small>
//                                                             </div>
//                                                         </div>
//                                                         <div
//                                                             style={{
//                                                                 height: "500px",
//                                                                 background:
//                                                                     "#f8fafc",
//                                                             }}
//                                                         >
//                                                             <iframe
//                                                                 src={`/pdfjs/web/viewer.html?file=/storage/${item.signature_file}#toolbar=0&navpanes=0`}
//                                                                 style={{
//                                                                     width: "100%",
//                                                                     height: "100%",
//                                                                     border: "none",
//                                                                 }}
//                                                                 title="Aperçu de la signature"
//                                                             ></iframe>
//                                                         </div>
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         </div>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     </div>
//                 )}
//                 // Dans votre JSX, ajoutez ce modal personnalisé (juste avant la
//                 fermeture du div parent)
//                 {showDeleteModal && (
//                     <div
//                         style={{
//                             position: "fixed",
//                             top: 0,
//                             left: 0,
//                             right: 0,
//                             bottom: 0,
//                             backgroundColor: "rgba(0,0,0,0.5)",
//                             display: "flex",
//                             alignItems: "center",
//                             justifyContent: "center",
//                             zIndex: 9999,
//                         }}
//                         onClick={closeDeleteModal}
//                     >
//                         <div
//                             style={{
//                                 backgroundColor: "white",
//                                 borderRadius: "12px",
//                                 padding: "24px",
//                                 maxWidth: "400px",
//                                 width: "90%",
//                                 boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
//                             }}
//                             onClick={(e) => e.stopPropagation()}
//                         >
//                             <h3
//                                 style={{
//                                     marginBottom: "16px",
//                                     fontSize: "20px",
//                                     fontWeight: "bold",
//                                 }}
//                             >
//                                 Confirmation
//                             </h3>
//                             <p
//                                 style={{
//                                     marginBottom: "24px",
//                                     color: "#4b5563",
//                                 }}
//                             >
//                                 Êtes-vous sûr de vouloir supprimer ce fichier ?
//                             </p>
//                             <div
//                                 style={{
//                                     display: "flex",
//                                     gap: "12px",
//                                     justifyContent: "flex-end",
//                                 }}
//                             >
//                                 <button
//                                     onClick={closeDeleteModal}
//                                     style={{
//                                         padding: "8px 16px",
//                                         backgroundColor: "#e5e7eb",
//                                         border: "none",
//                                         borderRadius: "8px",
//                                         cursor: "pointer",
//                                     }}
//                                 >
//                                     Annuler
//                                 </button>
//                                 <button
//                                     onClick={executeDelete}
//                                     style={{
//                                         padding: "8px 16px",
//                                         backgroundColor: "#dc2626",
//                                         color: "white",
//                                         border: "none",
//                                         borderRadius: "8px",
//                                         cursor: "pointer",
//                                     }}
//                                 >
//                                     Supprimer
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>

//             <style jsx>{`
//                 @keyframes fadeInUp {
//                     from {
//                         opacity: 0;
//                         transform: translateY(20px);
//                     }
//                     to {
//                         opacity: 1;
//                         transform: translateY(0);
//                     }
//                 }

//                 .shadow-hover {
//                     transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
//                 }

//                 .timeline-container::-webkit-scrollbar {
//                     width: 8px;
//                 }

//                 .timeline-container::-webkit-scrollbar-track {
//                     background: #e2e8f0;
//                     border-radius: 10px;
//                 }

//                 .timeline-container::-webkit-scrollbar-thumb {
//                     background: #cbd5e1;
//                     border-radius: 10px;
//                 }

//                 .timeline-container::-webkit-scrollbar-thumb:hover {
//                     background: #94a3b8;
//                 }

//                 * {
//                     margin: 0;
//                     padding: 0;
//                     box-sizing: border-box;
//                 }
//             `}</style>
//         </div>
//     );
// }






























// import React from "react";
// import {
//   MdHistory,
//   MdPerson,
//   MdAttachMoney,
//   MdComment,
//   MdStar,
//   MdTrendingUp,
// } from "react-icons/md";

// // Composant principal
// const PropositionsHistory = ({ propositions = [], currency = "CDF", onPrint = null }) => {
//   // Données de test si aucune proposition n'est fournie
//   const testData = [
//     {
//       id: 1,
//       nom: "Jean Dupont",
//       role: "Commercial",
//       montant: 1250000,
//       commentaire: "Proposition initiale basée sur l'évaluation du marché local",
//       date: "2025-01-15T10:30:00",
//       isLatest: false,
//     },
//     {
//       id: 2,
//       nom: "Marie Laurent",
//       role: "Chef de département",
//       montant: 1180000,
//       commentaire: "Révision après négociation avec le client, réduction de 5.6%",
//       date: "2025-01-18T14:45:00",
//       isLatest: false,
//     },
//     {
//       id: 3,
//       nom: "Sophie Bernard",
//       role: "Directrice financière",
//       montant: 1120000,
//       commentaire: "Validation budget, aligné avec les capacités financières",
//       date: "2025-01-20T09:15:00",
//       isLatest: false,
//     },
//     {
//       id: 4,
//       nom: "Thomas Martin",
//       role: "Directeur Général",
//       montant: 1085000,
//       commentaire: "Approbation finale après analyse complète du dossier",
//       date: "2025-01-22T16:20:00",
//       isLatest: true,
//     },
//   ];

//   const dataToShow = propositions.length > 0 ? propositions : testData;

//   const formatCurrency = (amount) => {
//     return new Intl.NumberFormat("fr-FR").format(amount);
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("fr-FR", {
//       day: "2-digit",
//       month: "2-digit",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   const getRoleColor = (role) => {
//     const roleColors = {
//       Commercial: "#3b82f6",
//       "Chef de département": "#8b5cf6",
//       "Directrice financière": "#ec489a",
//       "Directeur Général": "#10b981",
//     };
//     return roleColors[role] || "#6b7280";
//   };

//   return (
//     <div
//       className="propositions-history-container"
//       style={{
//         padding: "24px",
//         backgroundColor: "#ffffff",
//         borderRadius: "16px",
//         fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
//       }}
//     >
//       {/* En-tête avec impression */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: "24px",
//           flexWrap: "wrap",
//           gap: "16px",
//           borderBottom: "2px solid #e5e7eb",
//           paddingBottom: "16px",
//         }}
//       >
//         <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
//           <div
//             style={{
//               width: "48px",
//               height: "48px",
//               background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
//               borderRadius: "14px",
//               display: "flex",
//               alignItems: "center",
//               justifyContent: "center",
//             }}
//           >
//             <MdHistory size={24} color="#ffffff" />
//           </div>
//           <div>
//             <h2
//               style={{
//                 fontSize: "20px",
//                 fontWeight: "700",
//                 margin: 0,
//                 color: "#1f2937",
//               }}
//             >
//               Historique des propositions
//             </h2>
//             <p
//               style={{
//                 fontSize: "13px",
//                 color: "#6b7280",
//                 margin: "4px 0 0 0",
//               }}
//             >
//               Suivi chronologique des propositions de montant
//             </p>
//           </div>
//         </div>

//         {onPrint && (
//           <button
//             onClick={onPrint}
//             style={{
//               padding: "8px 20px",
//               backgroundColor: "#1f2937",
//               color: "white",
//               border: "none",
//               borderRadius: "10px",
//               fontSize: "13px",
//               fontWeight: "500",
//               cursor: "pointer",
//               display: "flex",
//               alignItems: "center",
//               gap: "8px",
//               transition: "all 0.2s",
//             }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.backgroundColor = "#374151";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.backgroundColor = "#1f2937";
//             }}
//           >
//             <i className="fas fa-print"></i>
//             Imprimer
//           </button>
//         )}
//       </div>

//       {/* Tableau moderne */}
//       <div style={{ overflowX: "auto" }}>
//         <table
//           style={{
//             width: "100%",
//             borderCollapse: "collapse",
//             fontSize: "13px",
//           }}
//         >
//           <thead>
//             <tr
//               style={{
//                 backgroundColor: "#f9fafb",
//                 borderBottom: "2px solid #e5e7eb",
//               }}
//             >
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "14px 12px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   fontSize: "12px",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 <MdPerson size={14} style={{ marginRight: "6px" }} />
//                 Signataire
//               </th>
//               <th
//                 style={{
//                   textAlign: "right",
//                   padding: "14px 12px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   fontSize: "12px",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 <MdAttachMoney size={14} style={{ marginRight: "6px" }} />
//                 Montant proposé
//               </th>
//               <th
//                 style={{
//                   textAlign: "left",
//                   padding: "14px 12px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   fontSize: "12px",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 <MdComment size={14} style={{ marginRight: "6px" }} />
//                 Commentaire
//               </th>
//               <th
//                 style={{
//                   textAlign: "center",
//                   padding: "14px 12px",
//                   fontWeight: "600",
//                   color: "#374151",
//                   fontSize: "12px",
//                   textTransform: "uppercase",
//                   letterSpacing: "0.5px",
//                 }}
//               >
//                 Date de signature
//               </th>
//             </tr>
//           </thead>
//           <tbody>
//             {dataToShow.map((proposition, index) => {
//               const isLatest = proposition.isLatest || index === dataToShow.length - 1;
//               const roleColor = getRoleColor(proposition.role);

//               return (
//                 <tr
//                   key={proposition.id || index}
//                   style={{
//                     borderBottom: "1px solid #f3f4f6",
//                     backgroundColor: isLatest ? "#f0fdf4" : "transparent",
//                     transition: "background-color 0.2s",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isLatest) {
//                       e.currentTarget.style.backgroundColor = "#faf5ff";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isLatest) {
//                       e.currentTarget.style.backgroundColor = "transparent";
//                     }
//                   }}
//                 >
//                   {/* Signataire */}
//                   <td
//                     style={{
//                       padding: "14px 12px",
//                       verticalAlign: "top",
//                     }}
//                   >
//                     <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
//                       <span
//                         style={{
//                           fontWeight: "600",
//                           color: "#1f2937",
//                           display: "flex",
//                           alignItems: "center",
//                           gap: "6px",
//                         }}
//                       >
//                         {proposition.nom}
//                         {isLatest && (
//                           <span
//                             style={{
//                               backgroundColor: "#10b981",
//                               color: "white",
//                               fontSize: "9px",
//                               padding: "2px 8px",
//                               borderRadius: "20px",
//                               display: "inline-flex",
//                               alignItems: "center",
//                               gap: "4px",
//                             }}
//                           >
//                             <MdStar size={10} />
//                             Dernière
//                           </span>
//                         )}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: "11px",
//                           color: roleColor,
//                           backgroundColor: `${roleColor}10`,
//                           padding: "2px 8px",
//                           borderRadius: "20px",
//                           display: "inline-block",
//                           width: "fit-content",
//                         }}
//                       >
//                         {proposition.role}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Montant */}
//                   <td
//                     style={{
//                       padding: "14px 12px",
//                       textAlign: "right",
//                       verticalAlign: "middle",
//                     }}
//                   >
//                     <div>
//                       <span
//                         style={{
//                           fontWeight: "700",
//                           fontSize: "15px",
//                           color: isLatest ? "#10b981" : "#1f2937",
//                         }}
//                       >
//                         {formatCurrency(proposition.montant)}
//                       </span>
//                       <span
//                         style={{
//                           fontSize: "11px",
//                           color: "#6b7280",
//                           marginLeft: "4px",
//                         }}
//                       >
//                         {currency}
//                       </span>
//                     </div>
//                   </td>

//                   {/* Commentaire */}
//                   <td
//                     style={{
//                       padding: "14px 12px",
//                       verticalAlign: "middle",
//                     }}
//                   >
//                     {proposition.commentaire ? (
//                       <div
//                         style={{
//                           backgroundColor: "#fffbeb",
//                           padding: "8px 12px",
//                           borderRadius: "10px",
//                           borderLeft: `3px solid ${isLatest ? "#10b981" : "#f59e0b"}`,
//                           maxWidth: "300px",
//                         }}
//                       >
//                         <span
//                           style={{
//                             fontSize: "12px",
//                             color: "#92400e",
//                             lineHeight: "1.5",
//                           }}
//                         >
//                           {proposition.commentaire}
//                         </span>
//                       </div>
//                     ) : (
//                       <span
//                         style={{
//                           fontSize: "12px",
//                           color: "#9ca3af",
//                           fontStyle: "italic",
//                         }}
//                       >
//                         Aucun commentaire
//                       </span>
//                     )}
//                   </td>

//                   {/* Date */}
//                   <td
//                     style={{
//                       padding: "14px 12px",
//                       textAlign: "center",
//                       verticalAlign: "middle",
//                     }}
//                   >
//                     <div
//                       style={{
//                         display: "flex",
//                         flexDirection: "column",
//                         alignItems: "center",
//                         gap: "4px",
//                       }}
//                     >
//                       <span
//                         style={{
//                           fontSize: "12px",
//                           fontWeight: "500",
//                           color: "#374151",
//                         }}
//                       >
//                         {formatDate(proposition.date)}
//                       </span>
//                       <MdTrendingUp
//                         size={12}
//                         color={isLatest ? "#10b981" : "#9ca3af"}
//                       />
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Pied de tableau avec résumé */}
//       {dataToShow.length > 0 && (
//         <div
//           style={{
//             marginTop: "20px",
//             padding: "16px",
//             backgroundColor: "#f9fafb",
//             borderRadius: "12px",
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             flexWrap: "wrap",
//             gap: "12px",
//           }}
//         >
//           <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
//             <div>
//               <span style={{ fontSize: "11px", color: "#6b7280" }}>
//                 Nombre de propositions
//               </span>
//               <div style={{ fontWeight: "700", fontSize: "18px", color: "#1f2937" }}>
//                 {dataToShow.length}
//               </div>
//             </div>
//             <div>
//               <span style={{ fontSize: "11px", color: "#6b7280" }}>
//                 Montant final proposé
//               </span>
//               <div style={{ fontWeight: "700", fontSize: "18px", color: "#10b981" }}>
//                 {formatCurrency(dataToShow[dataToShow.length - 1]?.montant || 0)}{" "}
//                 <span style={{ fontSize: "12px" }}>{currency}</span>
//               </div>
//             </div>
//             <div>
//               <span style={{ fontSize: "11px", color: "#6b7280" }}>
//                 Évolution
//               </span>
//               <div style={{ fontWeight: "600", fontSize: "14px", color: "#3b82f6" }}>
//                 {dataToShow.length > 1
//                   ? `${Math.round(
//                       ((dataToShow[dataToShow.length - 1]?.montant - dataToShow[0]?.montant) /
//                         dataToShow[0]?.montant) *
//                         100
//                     )}%`
//                   : "0%"}
//               </div>
//             </div>
//           </div>
//           <div style={{ fontSize: "11px", color: "#9ca3af" }}>
//             <i className="fas fa-print"></i> Optimisé pour l'impression
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// // Styles pour l'impression
// const printStyles = `
//   @media print {
//     body * {
//       visibility: hidden;
//     }
//     .propositions-history-container,
//     .propositions-history-container * {
//       visibility: visible;
//     }
//     .propositions-history-container {
//       position: absolute;
//       top: 0;
//       left: 0;
//       width: 100%;
//       margin: 0;
//       padding: 20px;
//     }
//     button {
//       display: none !important;
//     }
//     table {
//       page-break-inside: avoid;
//     }
//     tr {
//       page-break-inside: avoid;
//       page-break-after: auto;
//     }
//   }
// `;

// // Composant d'impression séparé
// export const PrintPropositionsHistory = ({ propositions = [], currency = "CDF" }) => {
//   React.useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = printStyles;
//     document.head.appendChild(style);
    
//     return () => {
//       document.head.removeChild(style);
//     };
//   }, []);

//   return <PropositionsHistory propositions={propositions} currency={currency} />;
// };

// export default PropositionsHistory;














// // Dans votre composant principal
// import PropositionsHistory from "./PropositionsHistory";

// // Utilisation simple avec données de test
// <PropositionsHistory />

// // Utilisation avec vos données réelles
// <PropositionsHistory 
//   propositions={propositions} 
//   currency={fetchData?.monnaie || "CDF"}
//   onPrint={() => window.print()}
// />

// // Pour l'impression séparée
// import { PrintPropositionsHistory } from "./PropositionsHistory";

// // Dans votre modal d'impression
// <PrintPropositionsHistory 
//   propositions={propositions} 
//   currency={fetchData?.monnaie}
// />























// import axios from "axios";
// import { useState, useEffect } from "react";
// import { EnteteRapport } from "./HeaderReport";
// import { jsPDF } from "jspdf";
// import * as FileSaver from "file-saver";
// import html2canvas from "html2canvas";
// import { FaDownload } from "react-icons/fa";

// export default function ValidationFile({ dossierId }) {
//     const [fetchData, setFetchData] = useState();
//     const [showFile, setShowFile] = useState(false);
//     const [propositions, setPropositions] = useState([]);

//     useEffect(() => {
//         getDossierCredit();
//     }, [dossierId]);

//     const getDossierCredit = () => {
//         // Charger les données
//         axios
//             .get(`suivi-credit/dossiers/${dossierId}`)
//             .then((res) => {
//                 const data = res.data.data; // récupère l'objet dossier complet
//                 setFetchData(data); // stocke tout l'objet dossier dans dossier
//                 setPropositions(data.propositions || []);
//                 // console.log(fetchData);
//             })
//             .catch(() => setFetchData(null));
//     };

//     // const getData = async () => {
//     //     const res = await axios.get("gestion_credit/rapport/validation-file");
//     //     if (res.data.status == 1) {
//     //         setFetchData(res.data.data);
//     //     }
//     // };

//     // const exportToPDF = () => {
//     //     const content = document.getElementById("content-to-download");

//     //     if (!content) {
//     //         console.error("Element not found!");
//     //         return;
//     //     }

//     //     html2canvas(content, { scale: 2 })
//     //         .then((canvas) => {
//     //             const imgData = canvas.toDataURL("image/jpeg", 0.75);
//     //             const pdf = new jsPDF("p", "mm", "a4");

//     //             const pdfWidth = pdf.internal.pageSize.getWidth();
//     //             const pdfHeight = pdf.internal.pageSize.getHeight();
//     //             const imgProps = pdf.getImageProperties(imgData);
//     //             const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

//     //             let heightLeft = imgHeight;
//     //             let position = 0;

//     //             pdf.addImage(
//     //                 imgData,
//     //                 "JPEG",
//     //                 0,
//     //                 position,
//     //                 pdfWidth,
//     //                 imgHeight,
//     //                 undefined,
//     //                 "FAST"
//     //             );
//     //             heightLeft -= pdfHeight;

//     //             while (heightLeft >= 0) {
//     //                 position = heightLeft - imgHeight;
//     //                 pdf.addPage();
//     //                 pdf.addImage(
//     //                     imgData,
//     //                     "JPEG",
//     //                     0,
//     //                     position,
//     //                     pdfWidth,
//     //                     imgHeight,
//     //                     undefined,
//     //                     "FAST"
//     //                 );
//     //                 heightLeft -= pdfHeight;
//     //             }

//     //             pdf.autoPrint();
//     //             window.open(pdf.output("bloburl"), "_blank");
//     //         })
//     //         .catch((error) => {
//     //             console.error("Error capturing canvas:", error);
//     //         });
//     // };
//     const exportToPDF = () => {
//         const content = document.getElementById("content-to-download");

//         if (!content) {
//             console.error("Element not found!");
//             return;
//         }

//         html2canvas(content, { scale: 2 })
//             .then((canvas) => {
//                 const imgData = canvas.toDataURL("image/jpeg", 0.75);
//                 const pdf = new jsPDF("p", "mm", "a4");

//                 const pdfWidth = pdf.internal.pageSize.getWidth();
//                 const pdfHeight = pdf.internal.pageSize.getHeight();
//                 const imgProps = pdf.getImageProperties(imgData);
//                 const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

//                 let heightLeft = imgHeight;
//                 let position = 0;

//                 pdf.addImage(
//                     imgData,
//                     "JPEG",
//                     0,
//                     position,
//                     pdfWidth,
//                     imgHeight,
//                     undefined,
//                     "FAST",
//                 );
//                 heightLeft -= pdfHeight;

//                 while (heightLeft >= 0) {
//                     position = heightLeft - imgHeight;
//                     pdf.addPage();
//                     pdf.addImage(
//                         imgData,
//                         "JPEG",
//                         0,
//                         position,
//                         pdfWidth,
//                         imgHeight,
//                         undefined,
//                         "FAST",
//                     );
//                     heightLeft -= pdfHeight;
//                 }

//                 // Générer la date du jour
//                 const today = new Date();
//                 const day = String(today.getDate()).padStart(2, "0");
//                 const month = String(today.getMonth() + 1).padStart(2, "0");
//                 const year = today.getFullYear();

//                 // Construire le nom du fichier avec NomCompte
//                 const fileName = `${fetchData.NomCompte}_${day}-${month}-${year}.pdf`;

//                 // Télécharger directement le PDF avec le bon nom
//                 pdf.save(fileName);
//             })
//             .catch((error) => {
//                 console.error("Error capturing canvas:", error);
//             });
//     };

//     const handleClickPrint = () => {
//         // Affiche temporairement le contenu hors écran
//         setShowFile(true);

//         // Laisse le DOM rendre avant capture
//         setTimeout(() => {
//             exportToPDF();
//             setShowFile(false); // Cache à nouveau après impression
//         }, 300);
//     };
//     return (
//         <>
//             {fetchData && (
//                 <div className="position-relative">
//                     {/* Zone cachée pour le téléchargement */}
//                     <div
//                         id="content-to-download"
//                         style={{
//                             width: "90%",
//                             margin: "0 auto",
//                             position: "absolute",
//                             top: "-9999px",
//                             left: "-9999px",
//                             backgroundColor: "white",
//                             padding: "20px",
//                         }}
//                         className="card p-4 mt-2 mb-4 shadow-sm"
//                     >
//                         {/* En-tête du rapport */}
//                         <div className="text-center mb-4">
//                             <EnteteRapport />
//                         </div>
//                         {/* Titre principal */}
//                         <div className="text-center mb-4">
//                             <h4
//                                 style={{
//                                     color: "#20c997",
//                                     fontWeight: "bold",
//                                     borderBottom: "3px solid #20c997",
//                                     borderTop: "3px solid #20c997",
//                                     padding: "12px 24px",
//                                     display: "inline-block",
//                                     backgroundColor: "#f8f9fa",
//                                     borderRadius: "8px",
//                                     fontSize: "1.2rem",
//                                     letterSpacing: "1px",
//                                 }}
//                             >
//                                 📄 FICHE DE SUIVI DE CREDIT
//                             </h4>
//                         </div>
//                         {/* Informations principales */}
//                         <div className="row g-3 mt-1">
//                             {/* Colonne 1 */}
//                             <div className="col-md-4">
//                                 <div className="card border-0 shadow-sm rounded-3 h-100">
//                                     <div
//                                         className="card-header bg-teal text-white"
//                                         style={{
//                                             backgroundColor: "#20c997",
//                                             borderRadius: "8px 8px 0 0",
//                                         }}
//                                     >
//                                         <strong>Informations générales</strong>
//                                     </div>
//                                     <div className="card-body p-0">
//                                         <table className="table table-sm table-borderless mb-0">
//                                             <tbody>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             width: "40%",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                             padding: "12px",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-hashtag me-2 text-teal"></i>
//                                                         Num Compte
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.NumCompte}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-user me-2 text-teal"></i>
//                                                         Nom Compte
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.NomCompte}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-tag me-2 text-teal"></i>
//                                                         Produit de crédit
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
//                                                             {
//                                                                 fetchData.produit_credit
//                                                             }
//                                                         </span>
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-chart-line me-2 text-teal"></i>
//                                                         Type crédit
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.type_credit}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-user-tie me-2 text-teal"></i>
//                                                         Recouvreur
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.recouvreur}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-money-bill-wave me-2 text-teal"></i>
//                                                         Montant
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         <strong className="text-success">
//                                                             {new Intl.NumberFormat(
//                                                                 "fr-FR",
//                                                             ).format(
//                                                                 fetchData.montant_demande,
//                                                             )}{" "}
//                                                             {fetchData.monnaie ==
//                                                             "CDF"
//                                                                 ? "FC "
//                                                                 : " USD"}
//                                                         </strong>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-calendar me-2 text-teal"></i>
//                                                         Date Demande
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {new Date(
//                                                             fetchData.date_demande,
//                                                         ).toLocaleDateString(
//                                                             "fr-FR",
//                                                         )}
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Colonne 2 */}
//                             <div className="col-md-4">
//                                 <div className="card border-0 shadow-sm rounded-3 h-100">
//                                     <div
//                                         className="card-header bg-teal text-white"
//                                         style={{
//                                             backgroundColor: "#20c997",
//                                             borderRadius: "8px 8px 0 0",
//                                         }}
//                                     >
//                                         <strong>Conditions du crédit</strong>
//                                     </div>
//                                     <div className="card-body p-0">
//                                         <table className="table table-sm table-borderless mb-0">
//                                             <tbody>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             width: "40%",
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-clock me-2 text-teal"></i>
//                                                         Fréquence
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {
//                                                             fetchData.frequence_mensualite
//                                                         }
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-calculator me-2 text-teal"></i>
//                                                         Nbre Échéances
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {
//                                                             fetchData.nombre_echeance
//                                                         }
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-coins me-2 text-teal"></i>
//                                                         Devise
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         <span className="badge bg-primary bg-opacity-10 text-primary">
//                                                             {fetchData.monnaie ||
//                                                                 "CDF"}
//                                                         </span>
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-hourglass-half me-2 text-teal"></i>
//                                                         Durée
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.duree_credit}{" "}
//                                                         jours
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-chart-simple me-2 text-teal"></i>
//                                                         Intervalle
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {
//                                                             fetchData.intervale_jrs
//                                                         }{" "}
//                                                         jours
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-percent me-2 text-teal"></i>
//                                                         Taux intérêt
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         <strong className="text-info">
//                                                             {
//                                                                 fetchData.taux_interet
//                                                             }
//                                                             %
//                                                         </strong>
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-building me-2 text-teal"></i>
//                                                         Source fonds
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.source_fond}
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-building me-2 text-teal"></i>
//                                                         Agence
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.Agence}
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Colonne 3 - Garanties */}
//                             <div className="col-md-4">
//                                 <div className="card border-0 shadow-sm rounded-3 h-100">
//                                     <div
//                                         className="card-header bg-teal text-white"
//                                         style={{
//                                             backgroundColor: "#20c997",
//                                             borderRadius: "8px 8px 0 0",
//                                         }}
//                                     >
//                                         <strong>Garanties</strong>
//                                     </div>
//                                     <div className="card-body p-0">
//                                         <table className="table table-sm table-borderless mb-0">
//                                             <tbody>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             width: "40%",
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-shield-alt me-2 text-teal"></i>
//                                                         Type Garantie
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {
//                                                             fetchData.type_garantie
//                                                         }
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-chart-line me-2 text-teal"></i>
//                                                         Valeur comptable
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {new Intl.NumberFormat(
//                                                             "fr-FR",
//                                                         ).format(
//                                                             fetchData.valeur_comptable,
//                                                         )}{" "}
//                                                         {fetchData.monnaie ==
//                                                         "CDF"
//                                                             ? "FC "
//                                                             : " USD"}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-hashtag me-2 text-teal"></i>
//                                                         Num Titre
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.num_titre}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-hand-holding-usd me-2 text-teal"></i>
//                                                         Val garantie
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         <strong className="text-success">
//                                                             {new Intl.NumberFormat(
//                                                                 "fr-FR",
//                                                             ).format(
//                                                                 fetchData.valeur_garantie,
//                                                             )}{" "}
//                                                             {fetchData.monnaie ==
//                                                             "CDF"
//                                                                 ? "FC "
//                                                                 : " USD"}
//                                                         </strong>
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-calendar-alt me-2 text-teal"></i>
//                                                         Date sortie titre
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.date_sortie_titre ||
//                                                             "Non renseigné"}
//                                                     </td>
//                                                 </tr>
//                                                 <tr
//                                                     style={{
//                                                         borderBottom:
//                                                             "1px solid #e9ecef",
//                                                     }}
//                                                 >
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-calendar-times me-2 text-teal"></i>
//                                                         Date Expiration
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.date_expiration_titre ||
//                                                             "Non renseigné"}
//                                                     </td>
//                                                 </tr>
//                                                 <tr>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "600",
//                                                             color: "#495057",
//                                                         }}
//                                                     >
//                                                         <i className="fas fa-user-check me-2 text-teal"></i>
//                                                         Gestionnaire
//                                                     </td>
//                                                     <td
//                                                         style={{
//                                                             padding: "12px",
//                                                             fontWeight: "500",
//                                                             color: "#2c3e50",
//                                                         }}
//                                                     >
//                                                         {fetchData.gestionnaire}
//                                                     </td>
//                                                 </tr>
//                                             </tbody>
//                                         </table>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                         {/* Section récapitulative des propositions */}
//                         {propositions && propositions.length > 0 && (
//                             <div
//                                 className="mt-1 p-3"
//                                 style={{
//                                     borderRadius: "12px",
//                                     backgroundColor: "#f8f9fa",
//                                     pageBreakBefore: "always", // Force une nouvelle page avant cet élément
//                                     breakBefore: "page", // Alternative moderne
//                                     marginTop: "0", // Ajuste la marge pour éviter l'espace blanc
//                                 }}
//                             >
//                                 <h6
//                                     className="fw-bold mb-3"
//                                     style={{ color: "#20c997" }}
//                                 >
//                                     <i className="fas fa-chart-line me-2"></i>
//                                     Historique des propositions de montant
//                                 </h6>
//                                 <div className="row g-3">
//                                     {propositions.map((prop, index) => (
//                                         <div
//                                             key={index}
//                                             className="col-md-6 col-lg-4"
//                                         >
//                                             <div
//                                                 className="card h-100 border-0 shadow-sm"
//                                                 style={{
//                                                     borderRadius: "14px",
//                                                     transition: "all 0.2s ease",
//                                                     borderTop: `3px solid ${index === propositions.length - 1 ? "#20c997" : "#ffc107"}`,
//                                                     overflow: "hidden",
//                                                 }}
//                                             >
//                                                 <div className="card-body p-3">
//                                                     {/* En-tête */}
//                                                     <div className="d-flex justify-content-between align-items-center mb-2">
//                                                         <div>
//                                                             <i
//                                                                 className="fas fa-user-circle me-1"
//                                                                 style={{
//                                                                     color: "#20c997",
//                                                                     fontSize:
//                                                                         "14px",
//                                                                 }}
//                                                             ></i>
//                                                             <span
//                                                                 className="fw-semibold"
//                                                                 style={{
//                                                                     fontSize:
//                                                                         "13px",
//                                                                 }}
//                                                             >
//                                                                 {prop.role ||
//                                                                     prop.nom}
//                                                             </span>
//                                                             {index ===
//                                                                 propositions.length -
//                                                                     1 && (
//                                                                 <span
//                                                                     className="badge ms-2"
//                                                                     style={{
//                                                                         backgroundColor:
//                                                                             "#20c997",
//                                                                         fontSize:
//                                                                             "8px",
//                                                                         padding:
//                                                                             "2px 6px",
//                                                                     }}
//                                                                 >
//                                                                     <i className="fas fa-star"></i>
//                                                                 </span>
//                                                             )}
//                                                         </div>
//                                                         <small
//                                                             className="text-muted"
//                                                             style={{
//                                                                 fontSize: "9px",
//                                                             }}
//                                                         >
//                                                             {new Date(
//                                                                 prop.date,
//                                                             ).toLocaleDateString(
//                                                                 "fr-FR",
//                                                                 {
//                                                                     day: "2-digit",
//                                                                     month: "2-digit",
//                                                                     hour: "2-digit",
//                                                                     minute: "2-digit",
//                                                                 },
//                                                             )}
//                                                         </small>
//                                                     </div>

//                                                     {/* Contenu principal : Montant + Commentaire côte à côte */}
//                                                     <div className="d-flex gap-2 mt-2">
//                                                         {/* Montant */}
//                                                         <div
//                                                             className="flex-shrink-0 text-center"
//                                                             style={{
//                                                                 width: "100px",
//                                                             }}
//                                                         >
//                                                             <div
//                                                                 className="p-2 rounded-3"
//                                                                 style={{
//                                                                     backgroundColor:
//                                                                         "rgba(32, 201, 151, 0.1)",
//                                                                     borderRadius:
//                                                                         "10px",
//                                                                 }}
//                                                             >
//                                                                 <span
//                                                                     className="text-muted d-block"
//                                                                     style={{
//                                                                         fontSize:
//                                                                             "9px",
//                                                                     }}
//                                                                 >
//                                                                     Montant
//                                                                 </span>
//                                                                 <span
//                                                                     className="fw-bold"
//                                                                     style={{
//                                                                         fontSize:
//                                                                             "14px",
//                                                                         color: "#20c997",
//                                                                     }}
//                                                                 >
//                                                                     {new Intl.NumberFormat(
//                                                                         "fr-FR",
//                                                                     ).format(
//                                                                         prop.montant,
//                                                                     )}
//                                                                 </span>
//                                                                 <span
//                                                                     className="text-muted"
//                                                                     style={{
//                                                                         fontSize:
//                                                                             "8px",
//                                                                     }}
//                                                                 >
//                                                                     {fetchData?.monnaie ===
//                                                                     "CDF"
//                                                                         ? "FC"
//                                                                         : "USD"}
//                                                                 </span>
//                                                             </div>
//                                                         </div>

//                                                         {/* Commentaire */}
//                                                         <div className="flex-grow-1">
//                                                             {prop.commentaire ? (
//                                                                 <div
//                                                                     className="p-2 rounded-3 h-100"
//                                                                     style={{
//                                                                         backgroundColor:
//                                                                             "#fff9e6",
//                                                                         borderLeft:
//                                                                             "3px solid #ffc107",
//                                                                     }}
//                                                                 >
//                                                                     <div className="d-flex gap-1">
//                                                                         <i
//                                                                             className="fas fa-comment-dots"
//                                                                             style={{
//                                                                                 fontSize:
//                                                                                     "10px",
//                                                                                 color: "#ffc107",
//                                                                             }}
//                                                                         ></i>
//                                                                         <small
//                                                                             style={{
//                                                                                 fontSize:
//                                                                                     "11px",
//                                                                                 color: "#856404",
//                                                                                 lineHeight:
//                                                                                     "1.3",
//                                                                             }}
//                                                                         >
//                                                                             {prop
//                                                                                 .commentaire
//                                                                                 .length >
//                                                                             100
//                                                                                 ? prop.commentaire.substring(
//                                                                                       0,
//                                                                                       500,
//                                                                                   ) +
//                                                                                   "..."
//                                                                                 : prop.commentaire}
//                                                                         </small>
//                                                                     </div>
//                                                                 </div>
//                                                             ) : (
//                                                                 <div
//                                                                     className="p-2 text-center rounded-3"
//                                                                     style={{
//                                                                         backgroundColor:
//                                                                             "#f8f9fa",
//                                                                     }}
//                                                                 >
//                                                                     <i
//                                                                         className="fas fa-comment-slash"
//                                                                         style={{
//                                                                             fontSize:
//                                                                                 "12px",
//                                                                             color: "#adb5bd",
//                                                                         }}
//                                                                     ></i>
//                                                                 </div>
//                                                             )}
//                                                         </div>
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             </div>
//                         )}
//                         {/* Section signatures avec montants proposés */}
//                         <div className="mt-1">
//                             <div className="card border-0 shadow-sm rounded-3">
//                                 <div
//                                     className="card-header bg-teal text-white"
//                                     style={{
//                                         backgroundColor: "#20c997",
//                                         borderRadius: "8px 8px 0 0",
//                                     }}
//                                 >
//                                     <strong>
//                                         <i className="fas fa-signature me-2"></i>
//                                         Signatures et validation
//                                     </strong>
//                                 </div>
//                                 <div className="card-body">
//                                     <div className="row g-3">
//                                         {/* Agent crédit */}
//                                         <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-user-check fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     Agent crédit
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
//                                                 {/* Montant proposé par l'agent crédit */}
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) =>
//                                                             p.nom ===
//                                                             fetchData.recouvreur,
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             fetchData.recouvreur,
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                                 "CDF"
//                                                                     ? "FC "
//                                                                     : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div>

//                                         {/* Superviseur */}
//                                         <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-chart-line fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     Superviseur
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
//                                                 {/* Montant proposé par le superviseur */}
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) =>
//                                                             p.nom ===
//                                                             "Superviseur",
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             "Superviseur",
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                                 "CDF"
//                                                                     ? "FC "
//                                                                     : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div>

//                                         {/* Chef Agence */}
//                                         {/* <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-building fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     Chef Agence
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
                                            
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) =>
//                                                             p.nom ===
//                                                             "Chef Agence",
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             "Chef Agence",
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                             "CDF"
//                                                                 ? "FC "
//                                                                 : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div> */}

//                                         {/* CTC */}
//                                         <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-check-double fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     CTC
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
//                                                 {/* Montant proposé par le CTC */}
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) => p.nom === "CTC",
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             "CTC",
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                                 "CDF"
//                                                                     ? "FC "
//                                                                     : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div>

//                                         {/* DG */}
//                                         {/* <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-crown fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     DG
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
//                                                  Montant proposé par le DG *
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) => p.nom === "DG",
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             "DG",
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                             "CDF"
//                                                                 ? "FC "
//                                                                 : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div> */}

//                                         {/* CC */}
//                                         <div className="col-md-2">
//                                             <div className="text-center p-3 border rounded-3 bg-light h-100">
//                                                 <i className="fas fa-users fa-2x text-teal mb-2"></i>
//                                                 <p className="mb-0 fw-semibold">
//                                                     CC
//                                                 </p>
//                                                 <small className="text-muted">
//                                                     Signature
//                                                 </small>
//                                                 <div
//                                                     className="mt-2"
//                                                     style={{
//                                                         borderTop:
//                                                             "1px dashed #dee2e6",
//                                                         paddingTop: "8px",
//                                                     }}
//                                                 >
//                                                     <span className="text-muted small">
//                                                         _________________
//                                                     </span>
//                                                 </div>
//                                                 {/* Montant proposé par le CC */}
//                                                 {propositions &&
//                                                     propositions.find(
//                                                         (p) => p.nom === "CC",
//                                                     ) && (
//                                                         <div className="mt-2 p-1 bg-success bg-opacity-10 rounded">
//                                                             <small className="text-success fw-semibold">
//                                                                 <i className="fas fa-hand-holding-usd me-1"></i>
//                                                                 {new Intl.NumberFormat(
//                                                                     "fr-FR",
//                                                                 ).format(
//                                                                     propositions.find(
//                                                                         (p) =>
//                                                                             p.nom ===
//                                                                             "CC",
//                                                                     ).montant,
//                                                                 )}{" "}
//                                                                 {fetchData.monnaie ==
//                                                                 "CDF"
//                                                                     ? "FC "
//                                                                     : " USD"}
//                                                             </small>
//                                                         </div>
//                                                     )}
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Bouton de téléchargement */}
//                     <div
//                         style={{
//                             background:
//                                 "linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%)",
//                             borderRadius: "28px",
//                             padding: "28px",
//                             marginTop: "24px",
//                             marginRight: "auto", // ✅ Ajoutez cette ligne (pousse à gauche)
//                             marginLeft: "0", // ✅ Ajoutez cette ligne (assure qu'il colle à gauche)
//                             border: "1px solid rgba(32, 201, 151, 0.3)",
//                             boxShadow: "0 8px 30px rgba(0, 0, 0, 0.08)",
//                             width: "fit-content", // ✅ Optionnel : le container prend la largeur de son contenu
//                             maxWidth: "100%", // ✅ Optionnel : éviter le débordement
//                         }}
//                     >
//                         {/* Badge d'information */}
//                         <div
//                             style={{
//                                 display: "inline-flex",
//                                 alignItems: "center",
//                                 gap: "8px",
//                                 backgroundColor: "#20c997",
//                                 color: "white",
//                                 padding: "6px 16px",
//                                 borderRadius: "50px",
//                                 marginBottom: "20px",
//                                 fontSize: "12px",
//                                 fontWeight: "500",
//                             }}
//                         >
//                             <i className="fas fa-star-of-life"></i>
//                             <span>Nouveau</span>
//                         </div>

//                         {/* Titre principal */}
//                         <div style={{ marginBottom: "20px" }}>
//                             <h3
//                                 style={{
//                                     fontSize: "20px",
//                                     fontWeight: "700",
//                                     color: "#1f2937",
//                                     marginBottom: "8px",
//                                 }}
//                             >
//                                 📄 Fiche de suivi vierge
//                             </h3>
//                             <p
//                                 style={{
//                                     fontSize: "14px",
//                                     color: "#6b7280",
//                                     margin: 0,
//                                 }}
//                             >
//                                 Document officiel pour la collecte des
//                                 signatures
//                             </p>
//                         </div>

//                         {/* Message informatif avec icône */}
//                         <div
//                             style={{
//                                 backgroundColor: "#fefce8",
//                                 borderRadius: "16px",
//                                 padding: "16px",
//                                 marginBottom: "24px",
//                                 display: "flex",
//                                 gap: "12px",
//                                 alignItems: "flex-start",
//                             }}
//                         >
//                             <i
//                                 className="fas fa-hand-point-right"
//                                 style={{ color: "#eab308", fontSize: "24px" }}
//                             ></i>
//                             <div>
//                                 <strong
//                                     style={{
//                                         color: "#854d0e",
//                                         fontSize: "13px",
//                                         display: "block",
//                                         marginBottom: "4px",
//                                     }}
//                                 >
//                                     Important
//                                 </strong>
//                                 <p
//                                     style={{
//                                         color: "#854d0e",
//                                         fontSize: "12px",
//                                         margin: 0,
//                                         lineHeight: "1.5",
//                                     }}
//                                 >
//                                     Ce document doit être signé par toutes les
//                                     parties concernées avant validation finale.
//                                 </p>
//                             </div>
//                         </div>

//                         {/* Bouton - Changé de "text-center" à "text-start" */}
//                         <div style={{ marginBottom: "24px" }}>
//                             {" "}
//                             {/* ✅ Supprimé className="text-center" */}
//                             <button
//                                 onClick={handleClickPrint}
//                                 style={{
//                                     background:
//                                         "linear-gradient(135deg, #20c997 0%, #059669 100%)",
//                                     border: "none",
//                                     padding: "14px 32px",
//                                     borderRadius: "50px",
//                                     color: "white",
//                                     fontWeight: "600",
//                                     fontSize: "15px",
//                                     display: "inline-flex",
//                                     alignItems: "center",
//                                     gap: "12px",
//                                     cursor: "pointer",
//                                     transition:
//                                         "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
//                                     boxShadow:
//                                         "0 6px 20px rgba(32, 201, 151, 0.35)",
//                                 }}
//                                 onMouseEnter={(e) => {
//                                     e.currentTarget.style.transform =
//                                         "translateY(-3px)";
//                                     e.currentTarget.style.boxShadow =
//                                         "0 12px 28px rgba(32, 201, 151, 0.45)";
//                                     e.currentTarget.style.background =
//                                         "linear-gradient(135deg, #059669 0%, #047857 100%)";
//                                 }}
//                                 onMouseLeave={(e) => {
//                                     e.currentTarget.style.transform =
//                                         "translateY(0)";
//                                     e.currentTarget.style.boxShadow =
//                                         "0 6px 20px rgba(32, 201, 151, 0.35)";
//                                     e.currentTarget.style.background =
//                                         "linear-gradient(135deg, #20c997 0%, #059669 100%)";
//                                 }}
//                             >
//                                 <i className="fas fa-download fa-lg"></i>
//                                 <span>Télécharger la fiche vierge</span>
//                                 <i className="fas fa-file-pdf fa-lg"></i>
//                             </button>
//                         </div>

//                         {/* Note de bas - Changé de "center" à "flex-start" */}
//                         <div
//                             style={{
//                                 textAlign: "left", // ✅ Changé
//                                 fontSize: "11px",
//                                 color: "#9ca3af",
//                                 display: "flex",
//                                 alignItems: "center",
//                                 justifyContent: "flex-start", // ✅ Changé
//                                 gap: "8px",
//                             }}
//                         >
//                             <i className="fas fa-print"></i>
//                             <span>Format A4 - Prêt à imprimer</span>
//                             <i className="fas fa-qrcode"></i>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }
