import React, { useState, useEffect } from 'react';
import styles from './ZoomControl.module.css';

function ZoomControl() {
    const [zoomLevel, setZoomLevel] = useState(1);

    // Applichiamo lo zoom al CSS variabile del root o del body
    useEffect(() => {
        document.documentElement.style.setProperty('--app-zoom', zoomLevel);
    }, [zoomLevel]);

    const handleZoomIn = () => {
        if (zoomLevel < 1.5) setZoomLevel(prev => prev + 0.1);
    };

    const handleZoomOut = () => {
        if (zoomLevel > 0.8) setZoomLevel(prev => prev - 0.1);
    };

    const handleReset = () => setZoomLevel(1);

    return (
        <div className={styles.zoomWrapper}>
            <span className={styles.zoomLabel}>Zoom: {Math.round(zoomLevel * 100)}%</span>
            <div className={styles.btnGroup}>
                <button onClick={handleZoomOut} className={styles.zoomBtn} title="Rimpicciolisci">-</button>
                <button onClick={handleReset} className={styles.zoomBtn} title="Reset">100%</button>
                <button onClick={handleZoomIn} className={styles.zoomBtn} title="Ingrandisci">+</button>
            </div>
        </div>
    );
}

export default ZoomControl;