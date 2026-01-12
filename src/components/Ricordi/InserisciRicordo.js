import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import { useNavigate, useParams } from "react-router-dom";
import styles from './InserisciRicordo.module.css';
import GenericButton from "../UI/GenericButton";

// Fix per l'icona di default di Leaflet che spesso sparisce in React
const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function InserisciRicordo() {
    const navigate = useNavigate();
    const { boxID } = useParams();
    const [titolo, setTitolo] = useState('');
    const [tipo, setTipo] = useState('');
    const [multimedia, setMultimedia] = useState([]);
    const [descrizione, setDescrizione] = useState('');
    const [latitudine, setLatitudine] = useState(null);
    const [longitudine, setLongitudine] = useState(null);

    const handleMultimediaChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length + multimedia.length <= 4) {
            setMultimedia((prev) => [...prev, ...files]);
        } else {
            alert('Puoi aggiungere al massimo 4 file');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!tipo) {
            alert("Seleziona un tipo di ricordo prima di salvare.");
            return;
        }
        if (tipo === "luogo" && (!latitudine || !longitudine)) {
            alert("Seleziona una posizione sulla mappa prima di salvare.");
            return;
        }

        const ricordoData = {
            titolo: titolo,
            tipo: tipo,
            descrizione: descrizione,
            latitudine: latitudine,
            longitudine: longitudine,
            multimedia: multimedia.map(file => file.name),
            id_box: boxID
        };

        try {
            const response = await getServerMgr().insertRicordo(ricordoData);
            if (response.success) {
                alert("Ricordo salvato con successo!");
                navigate(-1);
            } else {
                alert("Errore nel salvataggio del ricordo.");
            }
        } catch (error) {
            console.error("Errore:", error);
            alert("Si è verificato un errore, riprova.");
        }
    };

     const handleBack = () => {
        navigate(-1); 
    };

    function LocationMarker() {
        useMapEvents({
            click(e) {
                setLatitudine(e.latlng.lat);
                setLongitudine(e.latlng.lng);
            }
        });

        return latitudine && longitudine ? (
            <Marker position={[latitudine, longitudine]} icon={customIcon}>
                <Popup>Posizione selezionata</Popup>
            </Marker>
        ) : null;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.configCard}>
                <header className={styles.cardHeader}>
                    <h2>Nuovo Ricordo</h2>
                    <p>Inserisci un'immagine, un video, un audio o un luogo significativo</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.cardBody}>
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>1. Informazioni Generali</label>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label htmlFor="titolo">Titolo del Ricordo</label>
                                <input 
                                    type="text" 
                                    id="titolo" 
                                    placeholder="Es: Il giorno del mio matrimonio"
                                    value={titolo} 
                                    onChange={(e) => setTitolo(e.target.value)} 
                                    required 
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label htmlFor="tipo">Categoria</label>
                                <select 
                                    id="tipo" 
                                    value={tipo} 
                                    onChange={(e) => setTipo(e.target.value)} 
                                    required
                                >
                                    <option value="" hidden>Seleziona tipo...</option>
                                    <option value="immagine">🖼️ Immagine</option>
                                    <option value="video">🎥 Video</option>
                                    <option value="audio">🎵 Audio</option>
                                    <option value="luogo">📍 Luogo</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.mainLabel}>2. Contenuto Multimediale</label>
                        
                        {(tipo === 'immagine' || tipo === 'video' || tipo === 'audio') && (
                            <div className={styles.uploadArea}>
                                <label className={styles.uploadBtn}>
                                    📁 Sfoglia file...
                                    <input 
                                        type="file" 
                                        hidden
                                        accept={tipo === 'immagine' ? 'image/*' : tipo === 'video' ? 'video/*' : 'audio/*'} 
                                        onChange={handleMultimediaChange} 
                                        multiple 
                                    />
                                </label>
                                <div className={styles.fileStatus}>
                                    {multimedia.length > 0 ? (
                                        <ul className={styles.fileList}>
                                            {multimedia.map((f, i) => <li key={i}>✅ {f.name}</li>)}
                                        </ul>
                                    ) : (
                                        <p>Nessun file selezionato (Max 4)</p>
                                    )}
                                </div>
                            </div>
                        )}

                        {tipo === 'luogo' && (
                            <div className={styles.mapWrapper}>
                                <p className={styles.mapHint}>Clicca sulla mappa per segnare il punto esatto:</p>
                                <div className={styles.mapContainerInner}>
                                    <MapContainer 
                                        center={[45.0, 9.0]} 
                                        zoom={8} 
                                        scrollWheelZoom={true}
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <LocationMarker />
                                    </MapContainer>
                                </div>
                                {latitudine && (
                                    <div className={styles.coordsBadge}>
                                        📍 {latitudine.toFixed(4)}, {longitudine.toFixed(4)}
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {!tipo && <p className={styles.infoText}>Seleziona una categoria per procedere con l'inserimento.</p>}
                    </div>

                    <div className={styles.section}>
                        <label className={styles.mainLabel}>3. Descrizione</label>
                        <textarea 
                            className={styles.textArea}
                            placeholder="Aggiungi un pensiero o un dettaglio su questo ricordo..."
                            value={descrizione} 
                            onChange={(e) => setDescrizione(e.target.value)} 
                        />
                    </div>

                    <footer className={styles.actions}>
                        <GenericButton buttonText="Annulla" onClick={handleBack} red_styling generic_button />
                        <GenericButton type="submit" buttonText="Salva Ricordo" generic_button />
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default InserisciRicordo;