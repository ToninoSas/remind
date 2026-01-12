import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import styles from "./DettaglioRicordo.module.css"; 
import GenericButton from "../UI/GenericButton";

function DettaglioRicordo() {
    const { userID, boxID, IdRicordo } = useParams(); 
    const [ricordo, setRicordo] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRicordoDetails = async () => {
            try {
                const data = await getServerMgr().getRicordoByID(IdRicordo); 
                setRicordo(data);
            } catch (error) {
                console.error("Errore nel recupero dei dettagli del ricordo:", error);
            }
        };
        fetchRicordoDetails();
    }, [IdRicordo]);

    if (!ricordo) {
        return (
            <div className={styles.loadingWrapper}>
                <div className={styles.spinner}></div>
                <p>Caricamento contenuti...</p>
            </div>
        );
    }

    return (
        <div className={styles.mainWrapper}>
            <div className={styles.detailCard}>
                <header className={styles.cardHeader}>
                    <GenericButton 
                        onClick={() => navigate(-1)} 
                        buttonText="← Indietro" 
                        red_styling 
                        generic_button 
                    />
                    <div className={styles.headerInfo}>
                        <h1 className={styles.title}>{ricordo.titolo}</h1>
                        <span className={styles.typeBadge}>Categoria: {ricordo.tipo}</span>
                    </div>
                </header>

                <main className={styles.cardBody}>
                    <section className={styles.descriptionSection}>
                        <h3>Descrizione del Ricordo</h3>
                        <p>{ricordo.descrizione || "Nessuna descrizione fornita."}</p>
                    </section>

                    <section className={styles.multimediaSection}>
                        <h3>Galleria Multimediale</h3>
                        <div className={styles.multimediaGrid}>
                            {ricordo.multimedia.map((media, index) => {
                                // Pulizia URL per sicurezza
                                const fileUrl = media.startsWith('http') ? media : `/immagini/${media.split('/').pop()}`;
                                
                                return (
                                    <div key={index} className={styles.mediaItem}>
                                        {media.toLowerCase().includes(".mp4") ? (
                                            <video controls className={styles.mediaContent}>
                                                <source src={fileUrl} type="video/mp4" />
                                                Il browser non supporta il video.
                                            </video>
                                        ) : media.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/) ? (
                                            <img className={styles.mediaContent} src={fileUrl} alt={`Media ${index}`} />
                                        ) : media.toLowerCase().match(/\.(mp3|wav|ogg)$/) ? (
                                            <div className={styles.audioContainer}>
                                                <span className={styles.audioIcon}>🎵</span>
                                                <audio controls className={styles.audioElement}>
                                                    <source src={fileUrl} type="audio/mpeg" />
                                                </audio>
                                            </div>
                                        ) : (
                                            <div className={styles.unsupported}>
                                                <span>📄</span>
                                                <p>File: {media.split('/').pop()}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

export default DettaglioRicordo;