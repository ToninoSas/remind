import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import styles from "./ModificaBox.module.css";
import AuthContext from "../../context/auth-context";
import GenericButton from "../UI/GenericButton";

function ModificaBox() {
    const { boxID } = useParams();
    const navigate = useNavigate();
    const auth_ctx = useContext(AuthContext);

    const [boxData, setBoxData] = useState({
        nome_box: "",
        cognome_box: "",
        citta: "",
        eta_box: ""
    });

    const [initialBoxData, setInitialBoxData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchBox = async () => {
            try {
                const data = await getServerMgr().getBoxPazienteByID(boxID);
                const box = data[0];

                if (box) {
                    const mappedData = {
                        nome_box: box.nome_box || "",
                        cognome_box: box.cognome_box || "",
                        citta: box.citta || "",
                        eta_box: box.eta_box || "",
                    };
                    setBoxData(mappedData);
                    setInitialBoxData(mappedData);
                }
            } catch (error) {
                console.error("Errore nel recupero del box:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBox();
    }, [boxID]);

    const handleInputChange = (field, value) => {
        setBoxData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = async () => {
        // Controllo se ci sono stati cambiamenti reali
        const hasChanges = Object.keys(boxData).some(
            key => boxData[key].toString().trim() !== initialBoxData[key].toString().trim()
        );

        if (!hasChanges) {
            alert("Nessuna modifica rilevata.");
            return;
        }

        try {
            const updatedBoxData = {
                nome_box: boxData.nome_box.trim(),
                cognome_box: boxData.cognome_box.trim(),
                citta: boxData.citta.trim(),
                eta_box: boxData.eta_box.toString().trim(),
            };

            await getServerMgr().updateBox(boxID, updatedBoxData);
            alert("Le modifiche sono state salvate con successo!");
            navigate(`/box-dei-ricordi/${auth_ctx.utenteLoggatoUID}`);
        } catch (error) {
            console.error("Errore durante la modifica:", error);
            alert("Si è verificato un errore durante il salvataggio.");
        }
    };

    if (isLoading) {
        return <div className={styles.loading}>Caricamento dati...</div>;
    }

    return (
        <div className={styles.mainContainer}>
            <div className={styles.configCard}>
                <header className={styles.cardHeader}>
                    <h2>Modifica Box dei Ricordi</h2>
                    <p>Stai modificando l'archivio di: <strong>{initialBoxData.nome_box} {initialBoxData.cognome_box}</strong></p>
                </header>

                <div className={styles.cardBody}>
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>Dati dell'Archivio</label>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    value={boxData.nome_box}
                                    onChange={(e) => handleInputChange('nome_box', e.target.value)}
                                    placeholder="Inserisci nome"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Cognome</label>
                                <input
                                    type="text"
                                    value={boxData.cognome_box}
                                    onChange={(e) => handleInputChange('cognome_box', e.target.value)}
                                    placeholder="Inserisci cognome"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Città</label>
                                <input
                                    type="text"
                                    value={boxData.citta}
                                    onChange={(e) => handleInputChange('citta', e.target.value)}
                                    placeholder="Luogo di origine"
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Età</label>
                                <input
                                    type="number"
                                    value={boxData.eta_box}
                                    onChange={(e) => handleInputChange('eta_box', e.target.value)}
                                    placeholder="Età paziente"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <footer className={styles.actions}>
                    <GenericButton
                        onClick={handleSave}
                        buttonText="Salva Modifiche"
                        generic_button
                    />
                    <GenericButton
                        onClick={() => navigate(`/box-dei-ricordi/${auth_ctx.utenteLoggatoUID}`)}
                        buttonText="Annulla"
                        red_styling
                        generic_button
                    />
                </footer>
            </div>
        </div>
    );
}

export default ModificaBox;