import { useContext } from "react";
import styles from "./TabellaPazienti.module.css";
import PatientContext from "../../context/patients-context";

function TabellaPazienti(props) {
  const patients_ctx = useContext(PatientContext);
  const hasPatients = props.elenco && props.elenco.length > 0;

  return (
    <div className={styles.main_container}>
      <div className={styles.table_card}>
        {!hasPatients ? (
          <div className={styles.empty_state}>
            <div className={styles.icon_bg}>👥</div>
            <h3>Schedario Vuoto</h3>
            <p>
              Non ci sono pazienti registrati. Inizia aggiungendo un nuovo
              profilo per gestire le sue attività.
            </p>
          </div>
        ) : (
          <div className={styles.scroll_area}>
            <table className={styles.modern_table}>
              <thead>
                <tr>
                  <th>NOME</th>
                  <th>COGNOME</th>
                  <th>CITTÀ DI NASCITA</th>
                  <th>DATA DI NASCITA</th>
                  <th>CODICE FISCALE</th>
                </tr>
              </thead>
              <tbody>{props.elenco}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default TabellaPazienti;
