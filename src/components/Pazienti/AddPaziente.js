import { useContext, useEffect, useState } from "react";
import GenericButton from "../UI/GenericButton";
import styles from "./AddPaziente.module.css";
import AuthContext from "../../context/auth-context";
import { getServerMgr } from "../../backend_conn/ServerMgr";
import PatientContext from "../../context/patients-context";
import { Modal } from "react-bootstrap";

function AddPaziente(props) {
    const auth_ctx = useContext(AuthContext);
    const patients_ctx = useContext(PatientContext);

    const [stepAggiuntaPaziente, setStepAggiuntaPaziente] = useState(1);

    // Form States
    const [enteredNome, setEnteredNome] = useState("");
    const [enteredCognome, setEnteredCognome] = useState("");
    const [enteredCittà, setEnteredCittà] = useState("");
    const [enteredData, setEnteredData] = useState("");
    const [enteredCF, setEnteredCF] = useState("");
    
    // Validation States
    const [errors, setErrors] = useState({});
    
    // Account States
    const [modaleCreazioneAccount, setModaleCreazioneAccount] = useState(false);
    const [enteredEmail, setEnteredEmail] = useState("");
    const [enteredPsw, setEnteredPsw] = useState("");

    const validateStep1 = () => {
        let newErrors = {};
        if (!enteredNome.trim()) newErrors.nome = "Nome obbligatorio";
        if (!enteredCognome.trim()) newErrors.cognome = "Cognome obbligatorio";
        if (!enteredCittà.trim()) newErrors.citta = "Città obbligatoria";
        if (!enteredData) newErrors.data = "Data non valida";
        if (enteredCF.trim().length !== 16) newErrors.cf = "Il CF deve essere di 16 caratteri";

        const birthDate = new Date(enteredData);
        if (birthDate < new Date("1870-01-01")) newErrors.data = "Data troppo remota";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const stepSuccessivo = () => {
        if (validateStep1()) setStepAggiuntaPaziente(2);
    };

    const formSubmitHandler = async (withAccount = false) => {
        if (withAccount) {
            if (!enteredEmail.includes("@") || enteredPsw.length < 6) {
                setErrors({ email: !enteredEmail.includes("@"), psw: enteredPsw.length < 6 });
                return;
            }
        }

        const datiPaziente = {
            doct_UID: auth_ctx.utenteLoggatoUID,
            nome: enteredNome,
            cognome: enteredCognome,
            city: enteredCittà,
            codiceFiscale: enteredCF.toUpperCase(),
            dataNascita: enteredData,
            contattoEmail: enteredEmail || "",
            contattoCellulare: "", // Espandibile
            informazioniMediche: []
        };

        try {
            const res = await getServerMgr().addPaziente(
                datiPaziente.doct_UID, datiPaziente.nome, datiPaziente.cognome,
                datiPaziente.city, datiPaziente.codiceFiscale, datiPaziente.dataNascita,
                datiPaziente.contattoEmail, datiPaziente.contattoCellulare, []
            );

            if (withAccount && res.pazienteID) {
                await getServerMgr().addAccount(enteredNome, enteredCognome, 2, enteredEmail, enteredPsw, res.pazienteID);
                alert("Paziente e Account creati con successo!");
            }
            
            patients_ctx.nuovoPazienteHandler();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className={styles.mainContainer}>
            <div className={styles.stepperCard}>
                {/* Visual Progress Indicator */}
                <div className={styles.progressHeader}>
                    <div className={`${styles.step} ${stepAggiuntaPaziente >= 1 ? styles.active : ""}`}>
                        <span className={styles.stepNum}>1</span>
                        <span className={styles.stepLabel}>Anagrafica</span>
                    </div>
                    <div className={styles.line}></div>
                    <div className={`${styles.step} ${stepAggiuntaPaziente >= 2 ? styles.active : ""}`}>
                        <span className={styles.stepNum}>2</span>
                        <span className={styles.stepLabel}>Account</span>
                    </div>
                </div>

                {stepAggiuntaPaziente === 1 ? (
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Dati Personali</h2>
                        <div className={styles.gridFields}>
                            <div className={styles.inputGroup}>
                                <label>Nome</label>
                                <input type="text" value={enteredNome} onChange={(e) => setEnteredNome(e.target.value)} className={errors.nome ? styles.invalid : ""} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Cognome</label>
                                <input type="text" value={enteredCognome} onChange={(e) => setEnteredCognome(e.target.value)} className={errors.cognome ? styles.invalid : ""} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Città di Nascita</label>
                                <input type="text" value={enteredCittà} onChange={(e) => setEnteredCittà(e.target.value)} className={errors.citta ? styles.invalid : ""} />
                            </div>
                            <div className={styles.inputGroup}>
                                <label>Data di Nascita</label>
                                <input type="date" value={enteredData} onChange={(e) => setEnteredData(e.target.value)} className={errors.data ? styles.invalid : ""} />
                            </div>
                            <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                                <label>Codice Fiscale</label>
                                <input type="text" value={enteredCF} onChange={(e) => setEnteredCF(e.target.value.toUpperCase())} maxLength={16} className={errors.cf ? styles.invalid : ""} />
                                {errors.cf && <small className={styles.errorText}>{errors.cf}</small>}
                            </div>
                        </div>

                        <div className={styles.actions}>
                            <GenericButton onClick={props.hideFormNewPaziente} buttonText="Annulla" red_styling generic_button />
                            <GenericButton onClick={stepSuccessivo} buttonText="Continua" generic_button />
                        </div>
                    </div>
                ) : (
                    <div className={styles.formSection}>
                        <div className={styles.accountChoice}>
                            <div className={styles.iconCircle}>🔑</div>
                            <h2 className={styles.sectionTitle}>Accesso Paziente</h2>
                            <p className={styles.description}>
                                Vuoi creare un account per permettere al paziente di svolgere gli esercizi da casa?
                            </p>
                            
                            <div className={styles.choiceButtons}>
                                <GenericButton onClick={() => setModaleCreazioneAccount(true)} buttonText="Sì, Crea Account ora" generic_button />
                                <GenericButton onClick={() => formSubmitHandler(false)} buttonText="No, Salva solo Anagrafica" generic_button />
                            </div>
                            <button className={styles.backLink} onClick={() => setStepAggiuntaPaziente(1)}>Torna all'anagrafica</button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modale Creazione Account */}
            <Modal centered show={modaleCreazioneAccount} onHide={() => setModaleCreazioneAccount(false)} contentClassName={styles.customModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Nuove Credenziali</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className={styles.inputGroup}>
                        <label>Email Accesso</label>
                        <input type="email" value={enteredEmail} onChange={(e) => setEnteredEmail(e.target.value)} placeholder="esempio@mail.it" />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Password (min. 6 car.)</label>
                        <input type="password" value={enteredPsw} onChange={(e) => setEnteredPsw(e.target.value)} placeholder="******" />
                    </div>
                    <p className={styles.warningNote}>
                        <strong>Nota:</strong> Queste credenziali saranno necessarie al paziente per il login tramite App o QR Code.
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <GenericButton onClick={() => formSubmitHandler(true)} buttonText="Crea e Salva Tutto" generic_button />
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default AddPaziente;