import { useContext, useEffect, useState, useMemo } from "react";
import GameContext from "../../context/game-context";
import styles from "./ElencoDomande.module.css";
import AuthContext from "../../context/auth-context";
import GenericButton from "../UI/GenericButton";
import { Link } from "react-router-dom";

function ElencoDomande(props) {
    const game_ctx = useContext(GameContext);
    const auth_ctx = useContext(AuthContext);

    // Gestione stato locale per gli ID selezionati
    const [selectedIds, setSelectedIds] = useState([...game_ctx.domandeDaModificare]);

    const websiteUrl = "/immagini/";

    // Reset se cambia il tipo gioco (a meno che non sia specificato diversamente)
    useEffect(() => {
        if (!props.booleanForNotReset) {
            setSelectedIds([]);
            props.domandeNuovoGioco([]);
        }
    }, [props.tipoGioco]);

    // Filtriamo le domande in base al tipo gioco richiesto
    const filteredQuestions = useMemo(() => {
        return game_ctx.domande?.filter(q => q.tipoGioco === props.tipoGioco) || [];
    }, [game_ctx.domande, props.tipoGioco]);

    const toggleDomanda = (id) => {
        setSelectedIds(prev => {
            const updated = prev.includes(id) 
                ? prev.filter(item => item !== id) 
                : [...prev, id];
            
            // Notifichiamo il componente padre (AddGioco)
            props.domandeNuovoGioco(updated);
            return updated;
        });
    };

    const renderMedia = (question) => {
        const src = websiteUrl + question.immagine;
        switch (props.tipoGioco) {
            case "QUIZ CON IMMAGINI": return <img className={styles.media_prev} src={src} alt="Preview" />;
            case "QUIZ CON SUONI": return <audio className={styles.audio_prev} controls src={src} />;
            case "QUIZ CON VIDEO": return <video className={styles.video_prev} controls src={src} />;
            default: return null;
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.list_header}>
                <div className={styles.counter_badge}>
                    <span>Domande Selezionate:</span>
                    <strong>{selectedIds.length}</strong>
                </div>
                
                <Link to={`/domande/creaDomanda/${auth_ctx.utenteLoggatoUID}`} className={styles.no_deco}>
                    <GenericButton buttonText="＋ Crea Nuova Domanda" generic_button />
                </Link>
            </header>

            {filteredQuestions.length === 0 ? (
                <div className={styles.empty_msg}>
                    <p>Non ci sono domande salvate per questa categoria.</p>
                </div>
            ) : (
                <div className={styles.questions_grid}>
                    {filteredQuestions.map((q) => {
                        const isChecked = selectedIds.includes(q.ID);
                        return (
                            <div 
                                key={q.ID} 
                                className={`${styles.question_card} ${isChecked ? styles.card_selected : ""}`}
                                onClick={() => toggleDomanda(q.ID)}
                            >
                                <div className={styles.card_top}>
                                    <span className={styles.id_tag}>ID: {q.ID}</span>
                                    <div className={styles.checkbox_custom}>
                                        <input 
                                            type="checkbox" 
                                            checked={isChecked} 
                                            readOnly 
                                        />
                                        <span className={styles.checkmark}></span>
                                    </div>
                                </div>

                                <div className={styles.card_content}>
                                    {renderMedia(q)}
                                    
                                    <p className={styles.question_text}>
                                        {props.tipoGioco === "COMPLETA LA PAROLA" ? (
                                            <>Parola: <strong>{q.domanda}</strong></>
                                        ) : q.domanda}
                                    </p>

                                    {q.suggerimento && (
                                        <div className={styles.hint_box}>
                                            <small>Suggerimento: {q.suggerimento}</small>
                                        </div>
                                    )}

                                    {props.tipoGioco.includes("QUIZ") && (
                                        <div className={styles.answers_preview}>
                                            <div className={styles.ans_tag_corr}>{q.rispCorrettaN1}</div>
                                            <div className={styles.ans_tag_wrong}>{q.rispSbagliataN1}</div>
                                            {(q.rispCorrettaN2 || q.rispSbagliataN2) && <div className={styles.more_tag}>...</div>}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default ElencoDomande;