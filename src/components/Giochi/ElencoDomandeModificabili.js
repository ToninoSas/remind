import styles from "./ElencoDomandeModificabili.module.css";
import { useContext, useState, useMemo } from "react";
import GameContext from "../../context/game-context";
import GenericButton from "../UI/GenericButton";
import AuthContext from "../../context/auth-context";

function ElencoDomandeModificabili(props) {
  const game_ctx = useContext(GameContext);
  const auth_ctx = useContext(AuthContext);

  const [gameType, setGameType] = useState("QUIZ");
  const websiteUrl = "/immagini/";

  // Filtriamo le domande in base al tipo di gioco selezionato
  const filteredQuestions = useMemo(() => {
    return game_ctx.domande?.filter((q) => q.tipoGioco === gameType) || [];
  }, [game_ctx.domande, gameType]);

  const hasQuestions = filteredQuestions.length > 0;

  function gameTypeChangeHandler(event) {
    setGameType(event.target.value);
  }

  const renderMedia = (question) => {
    switch (gameType) {
      case "QUIZ CON IMMAGINI":
        return (
          <img
            className={styles.preview_media}
            src={websiteUrl + question.immagine}
            alt="Preview"
          />
        );
      case "QUIZ CON SUONI":
        return (
          <audio
            className={styles.audio_player}
            controls
            src={websiteUrl + question.immagine}
          ></audio>
        );
      case "QUIZ CON VIDEO":
        return (
          <video className={styles.video_player} controls>
            <source src={websiteUrl + question.immagine} type="video/mp4" />
          </video>
        );
      default:
        return null;
    }
  };

  return (
    <div className={styles.main_container}>
      {game_ctx.showModale && game_ctx.modale}

      <div className={styles.filter_section}>
        <div className={styles.input_group}>
          <label className={styles.label_style}>Filtra per Tipo Gioco</label>
          <select
            className={styles.select_style}
            value={gameType}
            onChange={gameTypeChangeHandler}
          >
            <option>QUIZ</option>
            <option>QUIZ CON IMMAGINI</option>
            <option>QUIZ CON SUONI</option>
            <option>QUIZ CON VIDEO</option>
            <option>COMPLETA LA PAROLA</option>
          </select>
        </div>
      </div>

      <hr className={styles.divider} />

      {!hasQuestions ? (
        <div className={styles.no_data}>
          <h2>Nessuna domanda trovata per questa categoria</h2>
          <p>Inizia a crearne una per visualizzarla qui.</p>
        </div>
      ) : (
        <ul className={styles.questions_grid}>
          {filteredQuestions.map((q) => (
            <li key={q.ID} className={styles.question_card}>
              <div className={styles.card_header}>
                {/* <span className={styles.badge_id}>ID: {q.ID}</span> */}
                {gameType === "COMPLETA LA PAROLA" ? (
                  <h4 className={styles.word_title}>
                    Parola: <span>{q.domanda}</span>
                  </h4>
                ) : (
                  <p className={styles.question_text}>{q.domanda}</p>
                )}
              </div>

              <div className={styles.card_body}>
                {renderMedia(q)}

                {gameType === "COMPLETA LA PAROLA" && (
                  <div className={styles.hint_box}>
                    <strong>Suggerimento:</strong> {q.suggerimento}
                  </div>
                )}

                {gameType.includes("QUIZ") && (
                  <div className={styles.answers_container}>
                    <div className={styles.answer_group}>
                      <label>Corrette:</label>
                      <div className={styles.chips_wrapper}>
                        {[
                          q.rispCorrettaN1,
                          q.rispCorrettaN2,
                          q.rispCorrettaN3,
                          q.rispCorrettaN4,
                        ]
                          .filter((r) => r && r.trim() !== "")
                          .map((r, i) => (
                            <span key={i} className={styles.chip_correct}>
                              {r}
                            </span>
                          ))}
                      </div>
                    </div>
                    <div className={styles.answer_group}>
                      <label>Sbagliate:</label>
                      <div className={styles.chips_wrapper}>
                        {[
                          q.rispSbagliataN1,
                          q.rispSbagliataN2,
                          q.rispSbagliataN3,
                          q.rispSbagliataN4,
                        ]
                          .filter((r) => r && r.trim() !== "")
                          .map((r, i) => (
                            <span key={i} className={styles.chip_wrong}>
                              {r}
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className={styles.card_actions}>
                <GenericButton
                  onClick={() =>
                    props.modificaSingolaDomanda(gameType, q, q.ID)
                  }
                  generic_button={true}
                  buttonText={"Modifica"}
                />
                <GenericButton
                  onClick={() => game_ctx.eliminaDomanda(q.ID)}
                  generic_button={true}
                  red_styling
                  buttonText={"Elimina"}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ElencoDomandeModificabili;
