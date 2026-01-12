import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from "./ModificaRicordo.module.css"; 
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import AuthContext from "../../context/auth-context";
import GenericButton from "../UI/GenericButton";

// Fix per l'icona del marker di Leaflet
const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function LocationMarker({ setLatitudine, setLongitudine }) {
    useMapEvents({
        click(e) {
            setLatitudine(e.latlng.lat);
            setLongitudine(e.latlng.lng);
        }
    });
    return null; 
}

function ModificaRicordo() {
    const auth_ctx = useContext(AuthContext);
    const { idRicordo } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    
    const ricordo = location.state?.ricordo; 
    const BOXid = location.state?.boxID;
    const UID = auth_ctx.utenteLoggatoUID;

    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [tipo, setTipo] = useState("");
    const [latitudine, setLatitudine] = useState("");
    const [longitudine, setLongitudine] = useState("");
    const [files, setFiles] = useState([]);
    const [oldMultimedia, setOldMultimedia] = useState([]);

    useEffect(() => {
        if (ricordo) {
            setTitolo(ricordo.titolo || "");
            setDescrizione(ricordo.descrizione || "");
            setTipo(ricordo.tipo || "");
            setOldMultimedia(ricordo.multimedia || []);
            if (ricordo.tipo === "luogo") {
                setLatitudine(ricordo.latitudine || "");
                setLongitudine(ricordo.longitudine || "");
            }
        }
    }, [ricordo]);

    const handleTipoChange = (e) => {
        const newTipo = e.target.value;
        setTipo(newTipo);
        if (newTipo !== "luogo") {
            setLatitudine("");
            setLongitudine("");
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = e.target.files; 
        if (selectedFiles && selectedFiles.length > 0) {
            setFiles(Array.from(selectedFiles));
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const newMultimedia = files.length > 0 ? files : oldMultimedia;
        const multimediaFormatted = newMultimedia.map(item => {
            if (item && item.name) return { url: "immagini/" + item.name }; 
            if (item && item.url) return { url: item.url };
            return null;
        }).filter(Boolean); 

        const updatedRicordo = {
            id_ricordo: idRicordo,
            titolo,
            descrizione,
            tipo,
            latitudine: tipo === "luogo" ? parseFloat(latitudine) : null,
            longitudine: tipo === "luogo" ? parseFloat(longitudine) : null,
            multimedia: multimediaFormatted,
        };

        try {
            await getServerMgr().updateRicordo(idRicordo, updatedRicordo, () => {
                alert("Modifiche salvate con successo!");
                navigate(`/box-dei-ricordi/dettagliBox/${UID}/${BOXid}`);
            });
        } catch (error) {
            console.error("Errore nell'aggiornamento:", error);
            alert("Errore durante il salvataggio.");
        }
    };

    const currentLat = parseFloat(latitudine) || 41.9028;
    const currentLng = parseFloat(longitudine) || 12.4964;

    return (
        <div className={styles.mainContainer}>
            <div className={styles.configCard}>
                <header className={styles.cardHeader}>
                    <h2>Modifica Ricordo</h2>
                    <p>Aggiorna le informazioni o il contenuto multimediale</p>
                </header>

                <form onSubmit={handleSave} className={styles.cardBody}>
                    {/* Sezione 1: Informazioni */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>1. Informazioni Generali</label>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label>Titolo</label>
                                <input
                                    type="text"
                                    value={titolo}
                                    onChange={(e) => setTitolo(e.target.value)}
                                    className={styles.inputField}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Tipo Contenuto</label>
                                <select value={tipo} onChange={handleTipoChange} className={styles.selectField}>
                                    <option value="luogo">📍 Luogo</option>
                                    <option value="immagine">🖼️ Immagine</option>
                                    <option value="video">🎥 Video</option>
                                    <option value="audio">🎵 Audio</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Sezione 2: Media o Mappa */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>2. Contenuto del Ricordo</label>
                        
                        {tipo === "luogo" ? (
                            <div className={styles.mapWrapper}>
                                <p className={styles.hint}>Clicca sulla mappa per aggiornare la posizione:</p>
                                <div className={styles.mapContainer}>
                                    <MapContainer center={[currentLat, currentLng]} zoom={13} style={{ height: "100%", width: "100%" }}>
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker setLatitudine={setLatitudine} setLongitudine={setLongitudine} />
                                        {latitudine && longitudine && (
                                            <Marker position={[currentLat, currentLng]} icon={markerIcon}>
                                                <Popup>Posizione salvata</Popup>
                                            </Marker>
                                        )}
                                    </MapContainer>
                                </div>
                                {latitudine && (
                                    <div className={styles.coordsBadge}>
                                        Coordinate: {parseFloat(latitudine).toFixed(4)}, {parseFloat(longitudine).toFixed(4)}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className={styles.uploadArea}>
                                <label className={styles.uploadBtn}>
                                    📁 Sostituisci File
                                    <input
                                        type="file"
                                        hidden
                                        accept={tipo === "immagine" ? "image/*" : tipo === "video" ? "video/*" : "audio/*"}
                                        onChange={handleFileChange}
                                        multiple 
                                    />
                                </label>
                                <div className={styles.fileStatus}>
                                    {files.length > 0 ? (
                                        <p className={styles.newFiles}>Selezionati {files.length} nuovi file</p>
                                    ) : (
                                        <p>Stai usando i file caricati precedentemente ({oldMultimedia.length})</p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sezione 3: Descrizione */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>3. Descrizione</label>
                        <textarea
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                            className={styles.textareaField}
                            placeholder="Racconta qualcosa su questo ricordo..."
                        />
                    </div>

                    <footer className={styles.actions}>
                        <GenericButton buttonText="Annulla" onClick={() => navigate(-1)} red_styling generic_button />
                        <GenericButton type="submit" buttonText="Salva Modifiche" generic_button />
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default ModificaRicordo;