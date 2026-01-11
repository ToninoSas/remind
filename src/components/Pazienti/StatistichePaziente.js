import { useEffect, useState, useMemo } from "react";
import styles from "./StatistichePaziente.module.css";
import { ProgressBar } from "react-bootstrap";

function StatistichePaziente(props) {
    const [filtroStatistiche, setFiltroStatistiche] = useState("Totali");
    const risultatiTotali = props.stats || [];

    // Calcolo delle statistiche filtrate tramite useMemo per performance ottimali
    const stats = useMemo(() => {
        let tot = 0, corr = 0, sbag = 0;
        const now = Date.now();

        risultatiTotali.forEach((item) => {
            const dataEsecuzione = new Date(item.dataSvolgimento).getTime();
            const diffMs = now - dataEsecuzione;

            let include = false;
            if (filtroStatistiche === "Totali") include = true;
            else if (filtroStatistiche === "ultime 48 ore" && diffMs < 172800000) include = true;
            else if (filtroStatistiche === "ultima settimana" && diffMs < 604800000) include = true;
            else if (filtroStatistiche === "ultimi 30 giorni" && diffMs < 2592000000) include = true;

            if (include) {
                tot += item.rispTotali;
                corr += item.rispCorrette;
                sbag += item.rispSbagliate;
            }
        });

        const percCorr = tot > 0 ? ((corr / tot) * 100).toFixed(1) : 0;
        const percSbag = tot > 0 ? ((sbag / tot) * 100).toFixed(1) : 0;

        return { tot, corr, sbag, percCorr, percSbag };
    }, [filtroStatistiche, risultatiTotali]);

    return (
        <div className={styles.stats_container}>
            {/* Header con Filtro */}
            <div className={styles.filter_header}>
                <label className={styles.filter_label}>Analisi Periodo:</label>
                <select 
                    value={filtroStatistiche} 
                    onChange={(e) => setFiltroStatistiche(e.target.value)} 
                    className={styles.select_modern}
                >
                    <option>Totali</option>
                    <option>ultime 48 ore</option>
                    <option>ultima settimana</option>
                    <option>ultimi 30 giorni</option>
                </select>
            </div>

            {/* Grid delle schede numeriche (KPI) */}
            <div className={styles.kpi_grid}>
                <div className={styles.kpi_card}>
                    <span className={styles.kpi_icon}>📝</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.tot}</span>
                        <span className={styles.kpi_title}>Domande Totali</span>
                    </div>
                </div>
                <div className={`${styles.kpi_card} ${styles.success}`}>
                    <span className={styles.kpi_icon}>✅</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.corr}</span>
                        <span className={styles.kpi_title}>Corrette</span>
                    </div>
                </div>
                <div className={`${styles.kpi_card} ${styles.danger}`}>
                    <span className={styles.kpi_icon}>❌</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.sbag}</span>
                        <span className={styles.kpi_title}>Sbagliate</span>
                    </div>
                </div>
            </div>

            {/* Sezione Grafica */}
            <div className={styles.visual_card}>
                <h3 className={styles.card_title}>Rendimento Percentuale</h3>
                
                <div className={styles.progress_section}>
                    <div className={styles.progress_info}>
                        <span>Risposte Corrette</span>
                        <span className={styles.perc_text_green}>{stats.percCorr}%</span>
                    </div>
                    <ProgressBar 
                        now={stats.percCorr} 
                        variant="success" 
                        animated 
                        className={styles.custom_bar}
                    />
                </div>

                <div className={styles.progress_section}>
                    <div className={styles.progress_info}>
                        <span>Risposte Sbagliate</span>
                        <span className={styles.perc_text_red}>{stats.percSbag}%</span>
                    </div>
                    <ProgressBar 
                        now={stats.percSbag} 
                        variant="danger" 
                        className={styles.custom_bar}
                    />
                </div>
            </div>
        </div>
    );
}

export default StatistichePaziente;