import { useContext, useState, useEffect } from "react";
import BoxRicordo from "./BoxRicordoLayout"; 
import styles from "./BoxDeiRicordi.module.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthContext from "../../context/auth-context";
import { getServerMgr } from "../../backend_conn/ServerMgr.js";
import GenericButton from "../UI/GenericButton";

function BoxDeiRicordi() {
    const auth_ctx = useContext(AuthContext);
    const navigate = useNavigate();
    const [ricordi, setRicordi] = useState([]);
    const [filtroNome, setFiltroNome] = useState("");
    const tipoAccount = auth_ctx.tipoAccount;
    const isDoctor = tipoAccount === "Caregiver" || tipoAccount === "Dottore"; // Adattato in base ai ruoli standard

    const getBoxByUID = async () => {
        try {
            const result = await getServerMgr().getBoxByUID(auth_ctx.utenteLoggatoUID, isDoctor);
            if (Array.isArray(result)) {
                setRicordi(result);
            } else {
                setRicordi([]);
            }
        } catch (error) {
            setRicordi([]);
            console.error("Errore nel recupero dei dati:", error);
        }
    };

    useEffect(() => {
        if (auth_ctx.utenteLoggatoUID) {
            getBoxByUID();
        }
    }, [auth_ctx.utenteLoggatoUID]);

    const handleFiltroNome = (event) => {
        setFiltroNome(event.target.value.toLowerCase());
    };

    const ricordiFiltrati = ricordi.filter(box => {
        const nome = box.nome_box ? box.nome_box.toLowerCase() : '';
        const cognome = box.cognome_box ? box.cognome_box.toLowerCase() : '';
        const nomeCompleto = `${nome} ${cognome}`;
        return filtroNome === "" || nomeCompleto.includes(filtroNome);
    });

    const handleDelete = async (idBox) => {
        if (window.confirm("Sei sicuro di voler eliminare questa box? Questa operazione è irreversibile.")) {
            try {
                await getServerMgr().deleteBoxByID(idBox);
                setRicordi((prevRicordi) => prevRicordi.filter((box) => box.id_box !== idBox));
                alert("Box eliminata con successo");
            } catch (error) {
                alert("Errore nell'eliminazione della box");
            }
        }
    };

    const handleEdit = (idBox) => {
        navigate(`/box-dei-ricordi/modifica/${auth_ctx.utenteLoggatoUID}/${idBox}`);
    };

    return (
        <div className={styles.main_wrapper}>
            {/* Toolbar Superiore Moderna */}
            <header className={styles.toolbar}>
                <div className={styles.toolbar_content}>
                    <div className={styles.title_section}>
                        <span className={styles.icon_emoji}>📦</span>
                        <h1>Box dei Ricordi</h1>
                    </div>

                    <div className={styles.actions_section}>
                        <div className={styles.search_wrapper}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Cerca paziente..."
                                onChange={handleFiltroNome}
                            />
                            <span className={styles.search_icon}>🔍</span>
                        </div>
                        
                        {isDoctor && (
                            <Link to={`/box-dei-ricordi/crea-box/${auth_ctx.utenteLoggatoUID}`} className={styles.no_link_style}>
                                <GenericButton buttonText="＋ Crea Nuova Box" generic_button />
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <main className={styles.content_container}>
                {ricordiFiltrati.length > 0 ? (
                    <div className={styles.box_grid}>
                        {ricordiFiltrati.map((box) => (
                            <BoxRicordo
                                key={box.id_box || `${box.nome_box}-${box.cognome_box}`}
                                nome={box.nome_box}
                                cognome={box.cognome_box}
                                citta={box.citta}
                                eta={box.eta_box}
                                onView={() => navigate(`/box-dei-ricordi/dettagliBox/${auth_ctx.utenteLoggatoUID}/${box.id_box}`)}
                                onEdit={() => handleEdit(box.id_box)}
                                onDelete={() => handleDelete(box.id_box)}
                                isDoctor={isDoctor}
                            />
                        ))}
                    </div>
                ) : (
                    <div className={styles.no_results_card}>
                        <span className={styles.big_icon}>📂</span>
                        <h2>Nessun archivio trovato</h2>
                        <p>Non sono presenti box dei ricordi corrispondenti alla ricerca o per questo utente.</p>
                    </div>
                )}
            </main>
        </div>
    );
}

export default BoxDeiRicordi;