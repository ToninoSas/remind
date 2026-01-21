import { useEffect, useState, useMemo } from "react";
import styles from "./StatistichePaziente.module.css";
import { ProgressBar } from "react-bootstrap";

function StatistichePaziente(props) {
    const [filtroPeriodo, setFiltroPeriodo] = useState("Totali");
    // NUOVO STATO: Filtro per categoria
    const [filtroCategoria, setFiltroCategoria] = useState("Tutte le categorie");
    
    const risultatiTotali = props.stats || [];

    // Estraiamo le categorie uniche presenti nei risultati per popolare il dropdown
    const categorieDisponibili = useMemo(() => {
        const cats = risultatiTotali.map(item => item.categoriaGioco).filter(Boolean);
        return ["Tutte le categorie", ...new Set(cats)];
    }, [risultatiTotali]);

    const getMoodDetails = (value) => {
        const val = parseFloat(value);
        if (val === 0) return { emoji: "N.D.", label: "Nessun dato", color: "#6c757d" };
        if (val <= 1.5) return { emoji: "😫", label: "Molto provato", color: "#dc3545" };
        if (val <= 2.5) return { emoji: "🙁", label: "Triste/Ansioso", color: "#fd7e14" };
        if (val <= 3.5) return { emoji: "😐", label: "Neutrale", color: "#ffc107" };
        if (val <= 4.5) return { emoji: "🙂", label: "Sereno", color: "#20c997" };
        return { emoji: "😄", label: "Molto Felice", color: "#28a745" };
    };

    const stats = useMemo(() => {
        let tot = 0, corr = 0, sbag = 0, moodSum = 0, moodCount = 0;
        const now = Date.now();

        risultatiTotali.forEach((item) => {
            const dataEsecuzione = new Date(item.dataSvolgimento).getTime();
            const diffMs = now - dataEsecuzione;

            // Logica Filtro Temporale
            let includeTempo = false;
            if (filtroPeriodo === "Totali") includeTempo = true;
            else if (filtroPeriodo === "ultime 48 ore" && diffMs < 172800000) includeTempo = true;
            else if (filtroPeriodo === "ultima settimana" && diffMs < 604800000) includeTempo = true;
            else if (filtroPeriodo === "ultimi 30 giorni" && diffMs < 2592000000) includeTempo = true;

            // Logica Filtro Categoria
            let includeCategoria = (filtroCategoria === "Tutte le categorie" || item.categoriaGioco === filtroCategoria);

            if (includeTempo && includeCategoria) {
                tot += item.rispTotali;
                corr += item.rispCorrette;
                sbag += item.rispSbagliate;
                
                if (item.statoEmotivo && item.statoEmotivo > 0) {
                    moodSum += item.statoEmotivo;
                    moodCount++;
                }
            }
        });

        const percCorr = tot > 0 ? ((corr / tot) * 100).toFixed(1) : 0;
        const percSbag = tot > 0 ? ((sbag / tot) * 100).toFixed(1) : 0;
        const avgMood = moodCount > 0 ? (moodSum / moodCount).toFixed(1) : 0;

        return { tot, corr, sbag, percCorr, percSbag, avgMood };
    }, [filtroPeriodo, filtroCategoria, risultatiTotali]);

    const moodInfo = getMoodDetails(stats.avgMood);

    return (
        <div className={styles.stats_container}>
            {/* Header con Doppi Filtri */}
            <div className={styles.filter_header_group}>
                <div className={styles.filter_item}>
                    <label className={styles.filter_label}>Analisi Periodo:</label>
                    <select 
                        value={filtroPeriodo} 
                        onChange={(e) => setFiltroPeriodo(e.target.value)} 
                        className={styles.select_modern}
                    >
                        <option>Totali</option>
                        <option>ultime 48 ore</option>
                        <option>ultima settimana</option>
                        <option>ultimi 30 giorni</option>
                    </select>
                </div>

                <div className={styles.filter_item}>
                    <label className={styles.filter_label}>Dominio Cognitivo:</label>
                    <select 
                        value={filtroCategoria} 
                        onChange={(e) => setFiltroCategoria(e.target.value)} 
                        className={styles.select_modern}
                    >
                        {categorieDisponibili.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* KPI Grid */}
            <div className={styles.kpi_grid}>
                <div className={styles.kpi_card}>
                    <span className={styles.kpi_icon}>📝</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.tot}</span>
                        <span className={styles.kpi_title}>Quesiti {filtroCategoria === "Tutte le categorie" ? "Totali" : "Area"}</span>
                    </div>
                </div>
                <div className={`${styles.kpi_card} ${styles.success}`}>
                    <span className={styles.kpi_icon}>✅</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.corr}</span>
                        <span className={styles.kpi_title}>Corrette</span>
                    </div>
                </div>
                <div className={styles.kpi_card} style={{borderLeft: `5px solid ${moodInfo.color}`}}>
                    <span className={styles.kpi_icon} style={{fontSize: '2rem'}}>{moodInfo.emoji}</span>
                    <div className={styles.kpi_data}>
                        <span className={styles.kpi_value}>{stats.avgMood > 0 ? stats.avgMood : "--"}</span>
                        <span className={styles.kpi_title}>Umore in {filtroCategoria.split(' ')[0]}</span>
                    </div>
                </div>
            </div>

            <div className={styles.main_stats_layout}>
                {/* Visual Card Rendimento */}
                <div className={styles.visual_card}>
                    <h3 className={styles.card_title}>Performance: {filtroCategoria}</h3>
                    <div className={styles.progress_section}>
                        <div className={styles.progress_info}>
                            <span>Rateo Successo</span>
                            <span className={styles.perc_text_green}>{stats.percCorr}%</span>
                        </div>
                        <ProgressBar now={stats.percCorr} variant="success" animated className={styles.custom_bar} />
                    </div>
                    {/* Rateo Sbagliate */}
                    <div className={styles.progress_section}>
                        <div className={styles.progress_info}>
                            <span>Rateo Errore</span>
                            <span className={styles.perc_text_red}>{stats.percSbag}%</span>
                        </div>
                        <ProgressBar now={stats.percSbag} variant="danger" className={styles.custom_bar} />
                    </div>
                </div>

                {/* Visual Card Benessere */}
                <div className={styles.visual_card}>
                    <h3 className={styles.card_title}>Stato Emotivo nell'attività</h3>
                    <div className={styles.mood_summary}>
                        <div className={styles.mood_big_icon} style={{color: moodInfo.color}}>
                            {moodInfo.emoji}
                        </div>
                        <div className={styles.mood_text_info}>
                            <h4>{moodInfo.label}</h4>
                            <p>Livello di stress/serenità specifico per questa categoria.</p>
                        </div>
                    </div>
                    <div className={styles.mood_range}>
                        <div className={styles.mood_pointer} style={{left: `${(stats.avgMood - 1) * 25}%`}}>▼</div>
                        <div className={styles.range_bar}></div>
                        <div className={styles.range_labels}>
                            <span>Frustrazione</span>
                            <span>Soddisfazione</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StatistichePaziente;