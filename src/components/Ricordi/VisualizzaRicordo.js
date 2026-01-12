import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'; 
import 'leaflet-fullscreen';
import L from 'leaflet';
import styles from "./VisualizzaRicordo.module.css";
import GenericButton from "../UI/GenericButton";

// Fix per l'icona del marker
const markerIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34]
});

function FullscreenControl() {
    const map = useMap();
    useEffect(() => {
        if (map) {
            const fsControl = L.control.fullscreen({ position: 'topright' });
            map.addControl(fsControl);
            return () => map.removeControl(fsControl);
        }
    }, [map]);
    return null;
}

function VisualizzaRicordo() {
    const { idRicordo } = useParams();  
    const [ricordo, setRicordo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRicordoDetails = async () => {
            try {
                const data = await getServerMgr().getRicordoById(idRicordo);
                setRicordo(data);
            } catch (error) {
                console.error("Errore nel recupero dei dettagli:", error);
            }
        };
        fetchRicordoDetails();
    }, [idRicordo]);  

    if (!ricordo) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Recupero del ricordo...</p>
            </div>
        );
    }

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.viewCard}>
                <header className={styles.cardHeader}>
                    <GenericButton 
                        onClick={() => navigate(-1)} 
                        buttonText="← Indietro" 
                        red_styling 
                        generic_button 
                    />
                    <div className={styles.headerTitle}>
                        <h1>{ricordo.titolo}</h1>
                        <div className={styles.typeBadge}>
                            <span>Categoria: {ricordo.tipo}</span>
                        </div>
                    </div>
                </header>

                <main className={styles.cardBody}>
                    <section className={styles.infoSection}>
                        <h3>Descrizione</h3>
                        <p className={styles.descriptionText}>
                            {ricordo.descrizione || "Nessuna descrizione presente per questo ricordo."}
                        </p>
                    </section>

                    <section className={styles.mediaSection}>
                        {ricordo.tipo === "luogo" && ricordo.latitudine && ricordo.longitudine ? (
                            <div className={styles.mapWrapper}>
                                <h4 className={styles.mediaTitle}>📍 Posizione salvata</h4>
                                <div className={styles.mapContainer}>
                                    <MapContainer 
                                        center={[ricordo.latitudine, ricordo.longitudine]} 
                                        zoom={14} 
                                        style={{ width: '100%', height: '100%' }}
                                    >
                                        <FullscreenControl />
                                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                                        <Marker position={[ricordo.latitudine, ricordo.longitudine]} icon={markerIcon}>
                                            <Popup>{ricordo.titolo}</Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </div>
                        ) : (
                            <div className={styles.multimediaGrid}>
                                <h4 className={styles.mediaTitle}>📁 Contenuti multimediali</h4>
                                <div className={styles.filesLayout}>
                                    {ricordo.multimedia.map((file, index) => {
                                        const fileUrl = `/immagini/${file.url.split('/').pop()}`;
                                        
                                        return (
                                            <div key={index} className={styles.mediaItem}>
                                                {file.tipo.includes("immagine") && (
                                                    <img src={fileUrl} alt={`Contenuto ${index + 1}`} className={styles.imgFluid} />
                                                )}
                                                {file.tipo.includes("video") && (
                                                    <video controls className={styles.videoFluid}>
                                                        <source src={fileUrl} type="video/mp4" />
                                                    </video>
                                                )}
                                                {file.tipo.includes("audio") && (
                                                    <div className={styles.audioPlayerBox}>
                                                        <audio controls src={fileUrl} className={styles.audioFull} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}

export default VisualizzaRicordo;