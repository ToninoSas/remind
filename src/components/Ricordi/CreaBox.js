import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CreaBox.module.css";
import AuthContext from "../../context/auth-context";
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import GenericButton from "../UI/GenericButton";

function CreaBox() {
    const navigate = useNavigate();
    const auth_ctx = useContext(AuthContext);
    const [pazienti, setPazienti] = useState([]);
    const [pazienteSelezionato, setPazienteSelezionato] = useState("");
    const [validPaziente, setValidPaziente] = useState(true);

    const [formData, setFormData] = useState({
        nome: "",
        cognome: "",
        citta: "",
        eta: "",
    });

    useEffect(() => {
        const fetchPazienti = async () => {
            try {
                const result = await getServerMgr().getPatientsListArray(auth_ctx.utenteLoggatoUID);
                setPazienti(Array.isArray(result) ? result : []);
            } catch (error) {
                console.error("Errore nel recupero dei pazienti:", error);
                setPazienti([]);
            }
        };
        if (auth_ctx.utenteLoggatoUID) {
            fetchPazienti();
        }
    }, [auth_ctx.utenteLoggatoUID]);

    const handleChange = (event) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    };

    const handlePazienteChange = (event) => {
        const pazienteId = event.target.value;
        setPazienteSelezionato(pazienteId);
        setValidPaziente(!!pazienteId);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!pazienteSelezionato) {
            setValidPaziente(false);
            return;
        }

        try {
            const boxResult = await getServerMgr().CreateBoxPatient(
                pazienteSelezionato,
                formData.nome,
                formData.cognome,
                formData.citta,
                formData.eta
            );

            if (boxResult) {
                alert("Box creata con successo!");
                navigate(`/box-dei-ricordi/${auth_ctx.utenteLoggatoUID}`);
            }
        } catch (error) {
            console.error("Errore durante l'invio:", error);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.configCard}>
                <header className={styles.cardHeader}>
                    <h2>Nuova Box dei Ricordi</h2>
                    <p>Configura l'archivio multimediale per un paziente</p>
                </header>

                <form onSubmit={handleSubmit} className={styles.cardBody}>
                    {/* Step 1: Selezione Paziente */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>1. Assegna a un Paziente</label>
                        <select
                            className={`${styles.selectStyle} ${!validPaziente ? styles.invalid : ""}`}
                            onChange={handlePazienteChange}
                            value={pazienteSelezionato}
                            required
                        >
                            <option value="">-- Seleziona un paziente esistente --</option>
                            {pazienti.map((paziente) => (
                                <option key={paziente.ID} value={paziente.ID}>
                                    {paziente.nome} {paziente.cognome}
                                </option>
                            ))}
                        </select>
                        {!validPaziente && <small className={styles.errorText}>È necessario selezionare un paziente</small>}
                    </div>

                    {/* Step 2: Dati Box */}
                    <div className={styles.section}>
                        <label className={styles.mainLabel}>2. Dati della Box</label>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input
                                    type="text"
                                    name="nome"
                                    placeholder="Nome del box"
                                    value={formData.nome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Cognome</label>
                                <input
                                    type="text"
                                    name="cognome"
                                    placeholder="Cognome del box"
                                    value={formData.cognome}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Città</label>
                                <input
                                    type="text"
                                    name="citta"
                                    placeholder="Luogo di origine"
                                    value={formData.citta}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Età</label>
                                <input
                                    type="number"
                                    name="eta"
                                    placeholder="Età del paziente"
                                    value={formData.eta}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <footer className={styles.actions}>
                        <GenericButton
                            type="button"
                            onClick={() => navigate(`/box-dei-ricordi/${auth_ctx.utenteLoggatoUID}`)}
                            buttonText="Annulla"
                            red_styling
                            generic_button
                        />
                        <GenericButton
                            type="submit"
                            buttonText="Crea Box"
                            generic_button
                        />
                    </footer>
                </form>
            </div>
        </div>
    );
}

export default CreaBox;