import styles from "./EditPaziente.module.css";
import { useContext, useEffect, useState } from "react";
import PatientContext from "../../context/patients-context";
import GameContext from "../../context/game-context";
import { getServerMgr } from "../../backend_conn/ServerMgr";
import GenericButton from "../UI/GenericButton";
import DeleteButton from "../UI/DeleteButton";
import { Accordion, Modal, Tab, Tabs } from "react-bootstrap";

function EditPaziente(props) {
    const patients_ctx = useContext(PatientContext);
    const game_ctx = useContext(GameContext);

    const [visualizzaSchermata, setVisualizzaSchermata] = useState("DATI_PERSONALI");
    const [listaGiochi, setListaGiochi] = useState(game_ctx.listaGiochi || []);
    const [giochiDelPaziente, setGiochiDelPaziente] = useState([]);
    
    // States per i dati personali
    const [dati, setDati] = useState({
        nome: props.nomeee,
        cognome: props.cognomeee,
        città: props.cittààà,
        data: props.dataaa,
        cf: props.cfff,
        email: props.contattoEmail,
        cellulare: props.contattoCellulare
    });

    const [validity, setValidity] = useState({ nome: true, cognome: true, cf: true, data: true });
    const [modaleListaGiochi, setModaleListaGiochi] = useState(false);

    // Sincronizzazione giochi assegnati
    useEffect(() => {
        const aggiornaGiochi = listaGiochi.map(gioco => {
            const isAssegnato = props.giochiii?.some(g => g.gameID === gioco.gameID);
            return { ...gioco, assegnato: isAssegnato };
        });
        setListaGiochi(aggiornaGiochi);
    }, []);

    useEffect(() => {
        setGiochiDelPaziente(listaGiochi.filter(g => g.assegnato));
    }, [listaGiochi]);

    const handleInputChange = (e, field) => {
        setDati(prev => ({ ...prev, [field]: e.target.value }));
        setValidity(prev => ({ ...prev, [field]: true }));
    };

    const toggleAssegnazioneGioco = (gameID) => {
        setListaGiochi(prev => prev.map(g => 
            g.gameID === gameID ? { ...g, assegnato: !g.assegnato } : g
        ));
    };

    const handleSalvaModifiche = async (e) => {
        e.preventDefault();
        
        // Validazione rapida
        if (dati.nome.length < 1 || dati.cf.length !== 16) {
            setValidity({ nome: dati.nome.length > 0, cf: dati.cf.length === 16 });
            return;
        }

        try {
            await getServerMgr().updatePaziente(
                dati.nome, dati.cognome, dati.città, dati.cf.toUpperCase(), 
                dati.data, dati.email, dati.cellulare, 
                props.patologiaaa_1 || [], giochiDelPaziente, props.iddd
            );
            patients_ctx.modificaLista();
            alert("Dati aggiornati con successo!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Modifica Profilo</h1>
                <p className={styles.subtitle}>{props.nomeee} {props.cognomeee}</p>
            </header>

            <div className={styles.mainCard}>
                <Tabs 
                    activeKey={visualizzaSchermata} 
                    onSelect={(k) => setVisualizzaSchermata(k)} 
                    fill 
                    className={styles.customTabs}
                >
                    <Tab eventKey="DATI_PERSONALI" title="👤 Anagrafica e Contatti">
                        <div className={styles.formPadding}>
                            <div className={styles.sectionTitle}>Informazioni Generali</div>
                            <div className={styles.gridForm}>
                                <div className={styles.inputBox}>
                                    <label>Nome</label>
                                    <input type="text" value={dati.nome} onChange={(e) => handleInputChange(e, 'nome')} className={!validity.nome ? styles.invalid : ""} />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Cognome</label>
                                    <input type="text" value={dati.cognome} onChange={(e) => handleInputChange(e, 'cognome')} />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Città di nascita</label>
                                    <input type="text" value={dati.città} onChange={(e) => handleInputChange(e, 'città')} />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Data di nascita</label>
                                    <input type="date" value={dati.data} onChange={(e) => handleInputChange(e, 'data')} />
                                </div>
                                <div className={`${styles.inputBox} ${styles.fullWidth}`}>
                                    <label>Codice Fiscale</label>
                                    <input type="text" value={dati.cf} onChange={(e) => handleInputChange(e, 'cf')} maxLength={16} style={{textTransform: 'uppercase'}} />
                                </div>
                            </div>

                            <div className={styles.sectionTitle} style={{marginTop: '30px'}}>Recapiti</div>
                            <div className={styles.gridForm}>
                                <div className={styles.inputBox}>
                                    <label>Email</label>
                                    <input type="email" value={dati.email} onChange={(e) => handleInputChange(e, 'email')} />
                                </div>
                                <div className={styles.inputBox}>
                                    <label>Cellulare</label>
                                    <input type="tel" value={dati.cellulare} onChange={(e) => handleInputChange(e, 'cellulare')} />
                                </div>
                            </div>
                        </div>
                    </Tab>

                    <Tab eventKey="GIOCHI" title="🎮 Gestione Esercizi">
                        <div className={styles.formPadding}>
                            <div className={styles.gamesHeader}>
                                <h3>Esercizi Assegnati ({giochiDelPaziente.length})</h3>
                                <GenericButton onClick={() => setModaleListaGiochi(true)} buttonText="Gestisci Lista" generic_button />
                            </div>

                            {giochiDelPaziente.length === 0 ? (
                                <div className={styles.emptyGames}>Nessun esercizio assegnato al momento.</div>
                            ) : (
                                <div className={styles.assignedGrid}>
                                    {giochiDelPaziente.map(gioco => (
                                        <div key={gioco.gameID} className={styles.miniGameCard}>
                                            <div className={styles.gameInfo}>
                                                <strong>{gioco.nomeGioco}</strong>
                                                <span>{gioco.tipoGioco} - {gioco.livelloGioco}</span>
                                            </div>
                                            <button className={styles.removeBtn} onClick={() => toggleAssegnazioneGioco(gioco.gameID)}>✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Tab>
                </Tabs>
            </div>

            <footer className={styles.footer}>
                <GenericButton onClick={handleSalvaModifiche} buttonText="Applica Modifiche" generic_button />
                <GenericButton onClick={patients_ctx.chiudiFormModifica} buttonText="Annulla" red_styling generic_button />
            </footer>

            {/* Modale Selezione Giochi */}
            <Modal show={modaleListaGiochi} onHide={() => setModaleListaGiochi(false)} centered size="lg" contentClassName={styles.customModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Libreria Esercizi</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.modalScroll}>
                        {listaGiochi.map(gioco => (
                            <div 
                                key={gioco.gameID} 
                                className={`${styles.selectionRow} ${gioco.assegnato ? styles.selectedRow : ""}`}
                                onClick={() => toggleAssegnazioneGioco(gioco.gameID)}
                            >
                                <div className={styles.rowInfo}>
                                    <strong>{gioco.nomeGioco}</strong>
                                    <small>{gioco.tipoGioco} | {gioco.livelloGioco}</small>
                                </div>
                                <div className={styles.checkboxWrapper}>
                                    <input type="checkbox" checked={gioco.assegnato} readOnly />
                                    <span className={styles.checkmark}></span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <GenericButton onClick={() => setModaleListaGiochi(false)} buttonText="Conferma" generic_button />
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default EditPaziente;