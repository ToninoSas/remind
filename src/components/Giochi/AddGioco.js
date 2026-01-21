import styles from "./AddGioco.module.css";
import GenericButton from "../UI/GenericButton";
import RadioButton from "../UI/RadioButton";
import { useContext, useEffect, useState } from "react";
import GameContext from "../../context/game-context";
import ElencoDomande from "./ElencoDomande";
import AuthContext from "../../context/auth-context";
import { getServerMgr } from "../../backend_conn/ServerMgr";

function AddGioco(props) {
    const game_ctx = useContext(GameContext);
    const auth_ctx = useContext(AuthContext);

    // Form States
    const [tipologiaGioco, setTipologiaGioco] = useState("");
    const [titoloGioco, setTitoloGioco] = useState("");
    const [categoriaGioco, setCategoriaGioco] = useState("");
    const [livelloGioco, setLivelloGioco] = useState("MEDIA");
    const [numeroCoppie, setNumeroCoppie] = useState(2);
    const [domandeSelected, setDomandeSelected] = useState([]);
    
    // Validation States
    const [validity, setValidity] = useState({ titolo: true, domande: true });

    useEffect(() => {
        setDomandeSelected([]);
    }, [tipologiaGioco]);

    const handleLivelloChange = (livello) => {
        setLivelloGioco(livello);
    };

    const handleNumeroCoppie = (e) => {
        const val = Math.max(2, Math.min(5, Number(e.target.value)));
        setNumeroCoppie(val);
    };

    const handleDomandeSelection = (domandeSelezionate) => {
        setDomandeSelected(domandeSelezionate);
        setValidity(prev => ({ ...prev, domande: domandeSelezionate.length > 0 }));
    };

    async function salvaNuovoGioco() {
        const isTitoloValid = titoloGioco.trim().length > 0;
        const isDomandeValid = tipologiaGioco === "GIOCO DELLE COPPIE" || domandeSelected.length > 0;

        setValidity({ titolo: isTitoloValid, domande: isDomandeValid });

        if (isTitoloValid && isDomandeValid) {
            try {
                await getServerMgr().addGame(
                    auth_ctx.utenteLoggatoUID, 
                    titoloGioco, 
                    tipologiaGioco, 
                    livelloGioco, 
                    domandeSelected, 
                    numeroCoppie
                );
                alert("Gioco creato con successo!");
                props.chiudiFormNuovoGioco();
                game_ctx.prendiTuttiGiochiDomande();
            } catch (err) {
                console.error(err);
            }
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.configCard}>
                <header className={styles.cardHeader}>
                    <h2>Nuova Configurazione Gioco</h2>
                    <p>Definisci i parametri e assegna le domande</p>
                </header>

                <div className={styles.cardBody}>
                    {/* Step 1: Tipo Gioco */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>1. Scegli la tipologia di gioco</label>
                        <select 
                            className={styles.selectStyle} 
                            value={tipologiaGioco}
                            onChange={(e) => setTipologiaGioco(e.target.value)}
                        >
                            <option value="" hidden>Seleziona un tipo...</option>
                            <option>QUIZ</option>
                            <option>QUIZ CON IMMAGINI</option>
                            <option>QUIZ CON SUONI</option>
                            <option>QUIZ CON VIDEO</option>
                            <option>COMPLETA LA PAROLA</option>
                            <option>GIOCO DELLE COPPIE</option>
                        </select>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.mainLabel}>2. Scegli la categoria del gioco</label>
                        <select 
                            className={styles.selectStyle} 
                            value={categoriaGioco}
                            onChange={(e) => setCategoriaGioco(e.target.value)}
                        >
                            <option value="" hidden>Seleziona un tipo...</option>
                            <option>Memoria a breve termine</option>
                            <option>Memoria autobiografica</option>
                            <option>Memoria visiva-spaziale</option>
                            <option>Categorizzazione</option>
                            <option>Riconoscimento volti</option>
                            <option>Completamento</option>
                        </select>
                    </div>

                    {tipologiaGioco && (
                        <div className={styles.animateIn}>
                            {/* Step 2: Dati Base */}
                            <div className={styles.section}>
                                <label className={styles.mainLabel}>3. Informazioni Base</label>
                                <div className={styles.gridFields}>
                                    <div className={styles.inputGroup}>
                                        <label>Nome del gioco</label>
                                        <input 
                                            type="text" 
                                            className={`${styles.inputStyle} ${!validity.titolo ? styles.invalid : ""}`}
                                            placeholder="Es: Quiz di Storia, Memoria Visiva..."
                                            value={titoloGioco}
                                            onChange={(e) => {setTitoloGioco(e.target.value); setValidity(p => ({...p, titolo: true}))}}
                                        />
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Difficoltà</label>
                                        <div className={styles.difficultyGroup}>
                                            <button 
                                                className={`${styles.diffBtn} ${livelloGioco === 'FACILE' ? styles.activeEasy : ""}`}
                                                onClick={() => handleLivelloChange('FACILE')}
                                            >Facile</button>
                                            <button 
                                                className={`${styles.diffBtn} ${livelloGioco === 'MEDIA' ? styles.activeMedium : ""}`}
                                                onClick={() => handleLivelloChange('MEDIA')}
                                            >Media</button>
                                            <button 
                                                className={`${styles.diffBtn} ${livelloGioco === 'DIFFICILE' ? styles.activeHard : ""}`}
                                                onClick={() => handleLivelloChange('DIFFICILE')}
                                            >Difficile</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Contenuti Specifici */}
                            <div className={styles.section}>
                                <label className={styles.mainLabel}>4. Contenuti del Gioco</label>
                                
                                {tipologiaGioco === "GIOCO DELLE COPPIE" ? (
                                    <div className={styles.pairsBox}>
                                        <label>Numero di coppie da indovinare (2-5)</label>
                                        <input 
                                            type="number" 
                                            className={styles.inputStyle}
                                            value={numeroCoppie} 
                                            onChange={handleNumeroCoppie}
                                        />
                                    </div>
                                ) : (
                                    <div className={styles.questionSection}>
                                        <p className={styles.hint}>Seleziona le domande dalla tua libreria:</p>
                                        <div className={`${styles.listContainer} ${!validity.domande ? styles.invalidList : ""}`}>
                                            <ElencoDomande
                                                domandeNuovoGioco={handleDomandeSelection}
                                                tipoGioco={tipologiaGioco}
                                            />
                                        </div>
                                        {!validity.domande && <p className={styles.errorText}>Seleziona almeno una domanda per continuare</p>}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <footer className={styles.actions}>
                    <GenericButton 
                        onClick={props.chiudiFormNuovoGioco} 
                        buttonText="Annulla" 
                        red_styling 
                        generic_button 
                    />
                    {tipologiaGioco && (
                        <GenericButton 
                            onClick={salvaNuovoGioco} 
                            buttonText="Crea Gioco" 
                            generic_button 
                        />
                    )}
                </footer>
            </div>
        </div>
    );
}

export default AddGioco;