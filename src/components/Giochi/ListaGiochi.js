import styles from "./ListaGiochi.module.css";
import { useContext } from "react";
import GameContext from "../../context/game-context";
import GenericButton from "../UI/GenericButton";

function ListaGiochi(props) {
  const game_ctx = useContext(GameContext);

  // Filtriamo i giochi in base al tipo selezionato nella barra superiore
  const filteredGames =
    game_ctx.listaGiochi?.filter((gioco) => {
      if (
        props.tipoGioco === "" ||
        props.tipoGioco === "TUTTI" ||
        props.tipoGioco === "Tipo Gioco"
      ) {
        return true;
      }
      return gioco.tipoGioco === props.tipoGioco;
    }) || [];

  if (filteredGames.length === 0) {
    return (
      <div className={styles.no_games}>
        Nessun gioco trovato in questa categoria.
      </div>
    );
  }

  return (
    <div className={styles.grid_container}>
      {filteredGames.map((gioco) => (
        <div key={gioco.gameID} className={styles.game_card}>
          <div className={styles.card_header}>
            <span className={styles.game_type_badge}>{gioco.tipoGioco}</span>
            <h3 className={styles.game_title}>{gioco.nomeGioco}</h3>
          </div>

          <div className={styles.card_body}>
            <div className={styles.info_row}>
              <strong>Livello:</strong> <span>{gioco.livelloGioco}</span>
            </div>
            <div className={styles.info_row}>
              <strong>Categoria:</strong> <span>{gioco.categoriaGioco}</span>
            </div>
            {gioco.numero && (
              <div className={styles.info_row}>
                <strong>Coppie:</strong> <span>{gioco.numero}</span>
              </div>
            )}
          </div>

          <div className={styles.card_actions}>
            <GenericButton
              onClick={() =>
                props.iniziaGioco(
                  gioco.tipoGioco,
                  gioco.gameID,
                  gioco.livelloGioco
                )
              }
              generic_button={true}
              buttonText={"Gioca"}
            />
            <div className={styles.admin_buttons}>
              <button
                className={styles.icon_btn_edit}
                onClick={() => props.mostraFormModificaGioco(gioco)}
                title="Modifica Gioco"
              >
                📝
              </button>
              <button
                className={styles.icon_btn_assign}
                onClick={() => props.mostraSchedaAssegnazione(gioco.gameID)}
                title="Assegna a Paziente"
              >
                👤
              </button>
              <button
                className={styles.icon_btn_delete}
                onClick={() => game_ctx.eliminaGioco(gioco.gameID)}
                title="Elimina"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaGiochi;
