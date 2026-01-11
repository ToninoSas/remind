import styles from "./EditDomanda.module.css";
import { useContext, useEffect, useState } from "react";
import GenericButton from "../UI/GenericButton";
import GenericAlternativeButton from "../UI/GenericAlternativeButton";
import GameContext from "../../context/game-context";
import axios from "axios";
import { getServerMgr } from "../../backend_conn/ServerMgr";
import AuthContext from "../../context/auth-context";

function EditDomanda(props) {
  const game_ctx = useContext(GameContext);
  const auth_ctx = useContext(AuthContext);
  const websiteUrl = "/immagini/";

  // State Management
  const [totalAnswers_CORRECT, setTotalAnswers_CORRECT] = useState(1);
  const [totalAnswers_WRONG, setTotalAnswers_WRONG] = useState(1);
  const [domandaModifica, setDomandaModifica] = useState(props.domanda || "");
  const [suggerimentoModifica, setSuggerimentoModifica] = useState(
    props.suggerimento || ""
  );
  const [tipoGiocoModifica] = useState(props.tipoGioco);

  const [rispCorretta, setRispCorretta] = useState({
    n1: props.correttaN1 || "",
    n2: props.correttaN2 || "",
    n3: props.correttaN3 || "",
    n4: props.correttaN4 || "",
  });
  const [rispSbagliata, setRispSbagliata] = useState({
    n1: props.sbagliataN1 || "",
    n2: props.sbagliataN2 || "",
    n3: props.sbagliataN3 || "",
    n4: props.sbagliataN4 || "",
  });

  const [mediaStates, setMediaStates] = useState({
    image: websiteUrl.concat(props.immagine),
    audio: websiteUrl.concat(props.immagine),
    video: websiteUrl.concat(props.immagine),
  });

  const [myFile, setMyFile] = useState(null);
  const [selezionaMediaBox, setSelezionaMediaBox] = useState(false);
  const [pazienti, setPazienti] = useState([]);
  const [pazienteSelezionato, setPazienteSelezionato] = useState("");
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [validity, setValidity] = useState({
    domanda: true,
    corrette: true,
    sbagliate: true,
  });

  // Initialization logic for counters
  useEffect(() => {
    let countC = 1;
    if (props.correttaN2?.trim()) countC++;
    if (props.correttaN3?.trim()) countC++;
    if (props.correttaN4?.trim()) countC++;
    setTotalAnswers_CORRECT(countC);

    let countW = 1;
    if (props.sbagliataN2?.trim()) countW++;
    if (props.sbagliataN3?.trim()) countW++;
    if (props.sbagliataN4?.trim()) countW++;
    setTotalAnswers_WRONG(countW);
  }, [props]);

  // Fetch Patients
  useEffect(() => {
    const fetchPazienti = async () => {
      if (auth_ctx.utenteLoggatoUID) {
        const result = await getServerMgr().getPatientsListArray(
          auth_ctx.utenteLoggatoUID
        );
        setPazienti(Array.isArray(result) ? result : []);
      }
    };
    fetchPazienti();
  }, [auth_ctx.utenteLoggatoUID]);

  const handleFileSelection = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMyFile(file);
    const objectUrl = URL.createObjectURL(file);
    if (tipoGiocoModifica.includes("IMMAGINI"))
      setMediaStates((prev) => ({ ...prev, image: objectUrl }));
    if (tipoGiocoModifica.includes("SUONI"))
      setMediaStates((prev) => ({ ...prev, audio: objectUrl }));
    if (tipoGiocoModifica.includes("VIDEO"))
      setMediaStates((prev) => ({ ...prev, video: objectUrl }));
  };

  const handlePazienteChange = async (e) => {
    const id = e.target.value;
    setPazienteSelezionato(id);
    if (id) {
      const multimedia = await getServerMgr().getPatientMedia(id);
      setMedia(multimedia || []);
    }
  };

  const salvaDomanda = () => {
    if (!domandaModifica.trim()) {
      setValidity((prev) => ({ ...prev, domanda: false }));
      return;
    }

    const modified_question = {
      domanda:
        tipoGiocoModifica === "COMPLETA LA PAROLA"
          ? domandaModifica.toUpperCase()
          : domandaModifica,
      rispCorrette: {
        correct_answer_n1: rispCorretta.n1,
        correct_answer_n2: rispCorretta.n2,
        correct_answer_n3: rispCorretta.n3,
        correct_answer_n4: rispCorretta.n4,
      },
      rispSbagliate: {
        wrong_answer_n1: rispSbagliata.n1,
        wrong_answer_n2: rispSbagliata.n2,
        wrong_answer_n3: rispSbagliata.n3,
        wrong_answer_n4: rispSbagliata.n4,
      },
      immagine: myFile
        ? selezionaMediaBox
          ? myFile
          : myFile.name
        : props.immagine,
      suggerimento: suggerimentoModifica,
      ID: props.ID,
    };

    game_ctx.salvaDomandaModificata(modified_question, props.ID);
    alert("Domanda modificata con successo!");
    props.chiudiFormModificaDomanda();
  };

  return (
    <div className={styles.container}>
      <div className={styles.editCard}>
        <header className={styles.header}>
          <h2>Modifica Domanda</h2>
          <span className={styles.gameBadge}>{tipoGiocoModifica}</span>
        </header>

        <div className={styles.formBody}>
          {/* Sezione Media/Paziente */}
          {tipoGiocoModifica !== "QUIZ" &&
            tipoGiocoModifica !== "COMPLETA LA PAROLA" && (
              <section className={styles.section}>
                <div className={styles.mediaToggle}>
                  <label className={styles.checkboxContainer}>
                    <input
                      type="checkbox"
                      checked={selezionaMediaBox}
                      onChange={(e) => setSelezionaMediaBox(e.target.checked)}
                    />
                    <span className={styles.checkmark}></span>
                    Usa media dalla Box del Paziente
                  </label>
                </div>

                {!selezionaMediaBox ? (
                  <div className={styles.uploadArea}>
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileSelection}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="fileInput" className={styles.uploadButton}>
                      📁 Seleziona nuovo file
                    </label>
                    <div className={styles.previewBox}>
                      {tipoGiocoModifica.includes("IMMAGINI") && (
                        <img src={mediaStates.image} alt="Preview" />
                      )}
                      {tipoGiocoModifica.includes("SUONI") && (
                        <audio controls src={mediaStates.audio} />
                      )}
                      {tipoGiocoModifica.includes("VIDEO") && (
                        <video controls src={mediaStates.video} width="100%" />
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.patientSelect}>
                    <select
                      value={pazienteSelezionato}
                      onChange={handlePazienteChange}
                      className={styles.inputStyle}
                    >
                      <option value="">Seleziona Paziente...</option>
                      {pazienti.map((p) => (
                        <option key={p.ID} value={p.ID}>
                          {p.nome} {p.cognome}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </section>
            )}

          {/* Testo Domanda */}
          <section className={styles.section}>
            <label className={styles.label}>Testo della Domanda</label>
            <input
              type="text"
              className={`${styles.inputStyle} ${
                !validity.domanda ? styles.invalid : ""
              }`}
              value={domandaModifica}
              onChange={(e) => setDomandaModifica(e.target.value)}
              placeholder="Inserisci la domanda qui..."
            />
            {tipoGiocoModifica === "COMPLETA LA PAROLA" && (
              <>
                <label className={styles.label}>Suggerimento</label>
                <input
                  type="text"
                  className={styles.inputStyle}
                  value={suggerimentoModifica}
                  onChange={(e) => setSuggerimentoModifica(e.target.value)}
                />
              </>
            )}
          </section>

          {/* Risposte (Grid) */}
          {tipoGiocoModifica.includes("QUIZ") && (
            <div className={styles.answersGrid}>
              <div className={styles.answerColumn}>
                <h4 className={styles.correctTitle}>Risposte Corrette</h4>
                {[...Array(totalAnswers_CORRECT)].map((_, i) => (
                  <input
                    key={i}
                    className={styles.inputCorrect}
                    value={rispCorretta[`n${i + 1}`]}
                    onChange={(e) =>
                      setRispCorretta({
                        ...rispCorretta,
                        [`n${i + 1}`]: e.target.value,
                      })
                    }
                    placeholder={`Risposta corretta ${i + 1}`}
                  />
                ))}
                <div className={styles.btnGroup}>
                  {totalAnswers_CORRECT < 4 && (
                    <button
                      className={styles.miniBtn}
                      onClick={() => setTotalAnswers_CORRECT((v) => v + 1)}
                    >
                      +
                    </button>
                  )}
                  {totalAnswers_CORRECT > 1 && (
                    <button
                      className={`${styles.miniBtn} ${styles.red}`}
                      onClick={() => setTotalAnswers_CORRECT((v) => v - 1)}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.answerColumn}>
                <h4 className={styles.wrongTitle}>Risposte Sbagliate</h4>
                {[...Array(totalAnswers_WRONG)].map((_, i) => (
                  <input
                    key={i}
                    className={styles.inputWrong}
                    value={rispSbagliata[`n${i + 1}`]}
                    onChange={(e) =>
                      setRispSbagliata({
                        ...rispSbagliata,
                        [`n${i + 1}`]: e.target.value,
                      })
                    }
                    placeholder={`Risposta sbagliata ${i + 1}`}
                  />
                ))}
                <div className={styles.btnGroup}>
                  {totalAnswers_WRONG < 4 && (
                    <button
                      className={styles.miniBtn}
                      onClick={() => setTotalAnswers_WRONG((v) => v + 1)}
                    >
                      +
                    </button>
                  )}
                  {totalAnswers_WRONG > 1 && (
                    <button
                      className={`${styles.miniBtn} ${styles.red}`}
                      onClick={() => setTotalAnswers_WRONG((v) => v - 1)}
                    >
                      -
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className={styles.actions}>
          <GenericButton
            onClick={salvaDomanda}
            generic_button={true}
            buttonText="Salva Modifiche"
          />
          <GenericButton
            onClick={props.chiudiFormModificaDomanda}
            generic_button={true}
            red_styling
            buttonText="Annulla"
          />
        </footer>
      </div>
    </div>
  );
}

export default EditDomanda;
