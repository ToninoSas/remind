import { useEffect, useContext, useState } from "react";
import GenericAlternativeButton from "../UI/GenericAlternativeButton";
import styles from "./CreaDomanda.module.css";
import GameContext from "../../context/game-context";
import AuthContext from "../../context/auth-context";
import GenericButton from "../UI/GenericButton";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { getServerMgr } from "../../backend_conn/ServerMgr";

function CreaDomanda(props) {
  const game_ctx = useContext(GameContext);
  const auth_ctx = useContext(AuthContext);
  const params = useParams();
  const navigate = useNavigate();

  // State per contatori (sostituiscono le variabili globali)
  const [totalAnswers_CORRECT, setTotalAnswers_CORRECT] = useState(1);
  const [totalAnswers_WRONG, setTotalAnswers_WRONG] = useState(1);

  // State per i dati della domanda
  const [gameType, setGameType] = useState("QUIZ");
  const [domanda, setDomanda] = useState("");
  const [suggerimento, setSuggerimento] = useState("");
  const [categoryQuestion, setCategoryQuestion] = useState("");

  // State per le risposte (oggetti per pulizia codice)
  const [risposteC, setRisposteC] = useState({
    n1: "",
    n2: "",
    n3: "",
    n4: "",
  });
  const [risposteS, setRisposteS] = useState({
    n1: "",
    n2: "",
    n3: "",
    n4: "",
  });

  // State per validazione
  const [formValid, setFormValid] = useState({
    domanda: true,
    media: true,
    corrette: true,
    sbagliate: true,
  });

  // State per Media e Pazienti
  const [pazienti, setPazienti] = useState([]);
  const [pazienteSelezionato, setPazienteSelezionato] = useState("");
  const [selezionaMediaBox, setSelezionaMediaBox] = useState(false);
  const [media, setMedia] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [myFile, setMyFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMyFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePazienteChange = async (event) => {
    const id = event.target.value;
    setPazienteSelezionato(id);
    if (id) {
      const multimedia = await getServerMgr().getPatientMedia(id);
      setMedia(multimedia || []);
    }
  };

  const handleMediaSelection = (item) => {
    let url = item.url_multimedia
      .replace("immagini/", "")
      .replace("/immagini/", "");
    setMyFile(url); // Per il salvataggio
    setPreviewUrl(`/${item.url_multimedia}`);
    setSelectedMedia([item]);
  };

  const salvaDomanda = () => {
    // Validazione rapida
    if (!domanda.trim()) {
      setFormValid((prev) => ({ ...prev, domanda: false }));
      return;
    }

    const new_question = {
      doctor_UID: auth_ctx.utenteLoggatoUID,
      tipoGioco: gameType,
      categoria: categoryQuestion,
      domanda:
        gameType === "COMPLETA LA PAROLA" ? domanda.toUpperCase() : domanda,
      rispCorrette: {
        correct_answer_n1: risposteC.n1,
        correct_answer_n2: risposteC.n2,
        correct_answer_n3: risposteC.n3,
        correct_answer_n4: risposteC.n4,
      },
      rispSbagliate: {
        wrong_answer_n1: risposteS.n1,
        wrong_answer_n2: risposteS.n2,
        wrong_answer_n3: risposteS.n3,
        wrong_answer_n4: risposteS.n4,
      },
      immagine: typeof myFile === "string" ? myFile : myFile ? myFile.name : "",
      suggerimento: suggerimento,
    };

    game_ctx.aggiungiDomandaAllaLista(new_question);
    navigate(`/domande/${params.UID}`);
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <header className={styles.cardHeader}>
          <h2>Crea Nuova Domanda</h2>
          <div className={styles.typeSelector}>
            <label>Tipo Gioco:</label>
            <select
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
            >
              <option>QUIZ</option>
              <option>QUIZ CON IMMAGINI</option>
              <option>QUIZ CON SUONI</option>
              <option>QUIZ CON VIDEO</option>
              <option>COMPLETA LA PAROLA</option>
            </select>
          </div>
        </header>

        <div className={styles.cardBody}>
          {/* Sezione Media */}
          {gameType !== "QUIZ" && gameType !== "COMPLETA LA PAROLA" && (
            <div className={styles.section}>
              <label className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  checked={selezionaMediaBox}
                  onChange={(e) => setSelezionaMediaBox(e.target.checked)}
                />
                <span className={styles.customCheck}></span>
                Seleziona dai media del paziente
              </label>

              {selezionaMediaBox ? (
                <div className={styles.patientBox}>
                  <select
                    className={styles.input}
                    onChange={handlePazienteChange}
                    value={pazienteSelezionato}
                  >
                    <option value="">Scegli Paziente...</option>
                    {pazienti.map((p) => (
                      <option key={p.ID} value={p.ID}>
                        {p.nome} {p.cognome}
                      </option>
                    ))}
                  </select>
                  <div className={styles.mediaGrid}>
                    {media.map((m) => (
                      <div
                        key={m.id_multimedia}
                        className={`${styles.mediaThumb} ${
                          selectedMedia.includes(m) ? styles.activeMedia : ""
                        }`}
                        onClick={() => handleMediaSelection(m)}
                      >
                        {m.tipo_multimedia === "immagine" && (
                          <img src={`/${m.url_multimedia}`} alt="thumb" />
                        )}
                        {m.tipo_multimedia === "video" && (
                          <div className={styles.mediaIcon}>🎬</div>
                        )}
                        {m.tipo_multimedia === "audio" && (
                          <div className={styles.mediaIcon}>🎵</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className={styles.uploadArea}>
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    hidden
                  />
                  <label htmlFor="file" className={styles.uploadBtn}>
                    📁 Carica File
                  </label>
                  {previewUrl && (
                    <div className={styles.previewContainer}>
                      {gameType.includes("IMMAGINI") && (
                        <img src={previewUrl} alt="prev" />
                      )}
                      {gameType.includes("SUONI") && (
                        <audio controls src={previewUrl} />
                      )}
                      {gameType.includes("VIDEO") && (
                        <video controls src={previewUrl} width="100%" />
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Testo Domanda */}
          <div className={styles.section}>
            <label className={styles.mainLabel}>
              {gameType === "COMPLETA LA PAROLA"
                ? "Parola da Indovinare"
                : "Testo della Domanda"}
            </label>
            <input
              type="text"
              className={`${styles.input} ${
                !formValid.domanda ? styles.error : ""
              }`}
              value={domanda}
              onChange={(e) => {
                setDomanda(e.target.value);
                setFormValid({ ...formValid, domanda: true });
              }}
              placeholder="Scrivi qui..."
            />
            {gameType === "COMPLETA LA PAROLA" && (
              <div style={{ marginTop: "15px" }}>
                <label className={styles.mainLabel}>
                  Suggerimento per l'utente
                </label>
                <input
                  type="text"
                  className={styles.input}
                  value={suggerimento}
                  onChange={(e) => setSuggerimento(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Risposte */}
          {gameType.includes("QUIZ") && (
            <div className={styles.answersGrid}>
              <div className={styles.answerCol}>
                <h4 className={styles.greenTitle}>Corrette</h4>
                {[...Array(totalAnswers_CORRECT)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    className={styles.inputC}
                    placeholder={`Corretta ${i + 1}`}
                    value={risposteC[`n${i + 1}`]}
                    onChange={(e) =>
                      setRisposteC({
                        ...risposteC,
                        [`n${i + 1}`]: e.target.value,
                      })
                    }
                  />
                ))}
                <div className={styles.counterBtns}>
                  <button
                    onClick={() =>
                      totalAnswers_CORRECT < 4 &&
                      setTotalAnswers_CORRECT((v) => v + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      totalAnswers_CORRECT > 1 &&
                      setTotalAnswers_CORRECT((v) => v - 1)
                    }
                    className={styles.red}
                  >
                    -
                  </button>
                </div>
              </div>
              <div className={styles.answerCol}>
                <h4 className={styles.redTitle}>Sbagliate</h4>
                {[...Array(totalAnswers_WRONG)].map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    className={styles.inputS}
                    placeholder={`Sbagliata ${i + 1}`}
                    value={risposteS[`n${i + 1}`]}
                    onChange={(e) =>
                      setRisposteS({
                        ...risposteS,
                        [`n${i + 1}`]: e.target.value,
                      })
                    }
                  />
                ))}
                <div className={styles.counterBtns}>
                  <button
                    onClick={() =>
                      totalAnswers_WRONG < 4 &&
                      setTotalAnswers_WRONG((v) => v + 1)
                    }
                  >
                    +
                  </button>
                  <button
                    onClick={() =>
                      totalAnswers_WRONG > 1 &&
                      setTotalAnswers_WRONG((v) => v - 1)
                    }
                    className={styles.red}
                  >
                    -
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <footer className={styles.footer}>
          <GenericButton
            onClick={salvaDomanda}
            generic_button={true}
            buttonText="Crea Domanda"
          />
          <GenericButton
            onClick={() => navigate(-1)}
            generic_button={true}
            red_styling
            buttonText="Annulla"
          />
        </footer>
      </div>
    </div>
  );
}

export default CreaDomanda;
