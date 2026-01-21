import styles from "./EditGioco.module.css";
import GenericButton from "../UI/GenericButton";
import ElencoDomande from "./ElencoDomande";
import { useContext, useEffect, useState } from "react";
import GameContext from "../../context/game-context";
import { getServerMgr } from "../../backend_conn/ServerMgr";

function EditGioco(props) {
    const game_ctx = useContext(GameContext);

    // Form States
    const [nomeGiocoModifica, setNomeGiocoModifica] = useState(props.nomeGioco);
    const [tipoGiocoModifica] = useState(props.tipoGioco);
    const [livelloGiocoModifica, setLivelloGiocoModifica] = useState(props.difficulty);
    const [numeroCoppie, setNumeroCoppie] = useState(props.numero);
    const [categoriaGioco, setCategoriaGioco] = useState("");
    const [domandeSelected, setDomandeSelected] = useState(game_ctx.domandeDaModificare || []);
    
    // Validation States
    const [validity, setValidity] = useState({ titolo: true, domande: true });

    useEffect(() => {
        setValidity(prev => ({ 
            ...prev, 
            domande: domandeSelected.length > 0 || tipoGiocoModifica === "GIOCO DELLE COPPIE" 
        }));
    }, [domandeSelected, tipoGiocoModifica]);

    const handleLivelloChange = (livello) => {
        setLivelloGiocoModifica(livello);
    };

    const handleNumeroCoppie = (e) => {
        const val = Math.max(2, Math.min(5, Number(e.target.value)));
        setNumeroCoppie(val);
    };

    const modificaOggettoDomande = (domandeSelezionate) => {
        setDomandeSelected(domandeSelezionate);
    };

    async function salvaGiocoAggiornato() {
        const isTitoloValid = nomeGiocoModifica.trim().length > 0;
        const isDomandeValid = tipoGiocoModifica === "GIOCO DELLE COPPIE" || domandeSelected.length > 0;

        setValidity({ titolo: isTitoloValid, domande: isDomandeValid });

        if (isTitoloValid && isDomandeValid) {
            try {
                await getServerMgr().updateGame(
                    nomeGiocoModifica, 
                    livelloGiocoModifica, 
                    domandeSelected, 
                    numeroCoppie,
                    categoriaGioco, 
                    props.gameID
                );
                alert("Gioco modificato con successo!");
                props.chiudiFormModifica();
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
                    <h2>Modifica Configurazione</h2>
                    <p>Aggiorna i parametri del gioco: <strong>{props.nomeGioco}</strong></p>
                </header>

                <div className={styles.cardBody}>
                    {/* Sola Lettura: Tipo Gioco */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>Tipologia Gioco (Non modificabile)</label>
                        <input 
                            className={styles.inputReadOnly} 
                            type="text" 
                            value={tipoGiocoModifica} 
                            readOnly 
                        />
                    </div>

                    <div className={styles.section}>
                        <label className={styles.mainLabel}>Scegli la categoria del gioco</label>
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

                    {/* Dati Base */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>Parametri Base</label>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label>Nome del gioco</label>
                                <input 
                                    type="text" 
                                    className={`${styles.inputStyle} ${!validity.titolo ? styles.invalid : ""}`}
                                    value={nomeGiocoModifica}
                                    onChange={(e) => setNomeGiocoModifica(e.target.value)}
                                />
                                {!validity.titolo && <small className={styles.errorText}>Il nome è obbligatorio</small>}
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Difficoltà</label>
                                <div className={styles.difficultyGroup}>
                                    <button 
                                        className={`${styles.diffBtn} ${livelloGiocoModifica === 'FACILE' ? styles.activeEasy : ""}`}
                                        onClick={() => handleLivelloChange('FACILE')}
                                    >Facile</button>
                                    <button 
                                        className={`${styles.diffBtn} ${livelloGiocoModifica === 'MEDIA' ? styles.activeMedium : ""}`}
                                        onClick={() => handleLivelloChange('MEDIA')}
                                    >Media</button>
                                    <button 
                                        className={`${styles.diffBtn} ${livelloGiocoModifica === 'DIFFICILE' ? styles.activeHard : ""}`}
                                        onClick={() => handleLivelloChange('DIFFICILE')}
                                    >Difficile</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contenuti */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>Contenuti e Domande</label>
                        
                        {tipoGiocoModifica === "GIOCO DELLE COPPIE" ? (
                            <div className={styles.pairsBox}>
                                <label>Numero di coppie (2-5)</label>
                                <input 
                                    type="number" 
                                    className={styles.inputStyle}
                                    value={numeroCoppie} 
                                    onChange={handleNumeroCoppie}
                                />
                            </div>
                        ) : (
                            <div className={styles.questionSection}>
                                <div className={`${styles.listContainer} ${!validity.domande ? styles.invalidList : ""}`}>
                                    <ElencoDomande
                                        booleanForNotReset={true}
                                        domandeNuovoGioco={modificaOggettoDomande}
                                        tipoGioco={tipoGiocoModifica}
                                        categoria={props.categoria}
                                    />
                                </div>
                                {!validity.domande && <p className={styles.errorText}>Devi selezionare almeno una domanda</p>}
                            </div>
                        )}
                    </div>
                </div>

                <footer className={styles.actions}>
                    <GenericButton 
                        onClick={salvaGiocoAggiornato} 
                        buttonText="Salva Modifiche" 
                        generic_button 
                    />
                    <GenericButton 
                        onClick={props.chiudiFormModifica} 
                        buttonText="Annulla" 
                        red_styling 
                        generic_button 
                    />
                </footer>
            </div>
        </div>
    );
}

export default EditGioco;