/* ============================================================================
   ALTAR-NASA Yüksek Çözünürlüklü Bilimsel Grafikler & Web Audio Sonifikasyon Motoru
   1) Tutuşabilirlik Sınır Haritası (MOC %O₂ vs Hava Akış Hızı cm/s)
   2) Çoklu Sensör Tutarlılık ve Görünmez Soğuk Alev Anomali Grafiği
   3) Gerçek Zamanlı Web Audio API Akustik Sonifikasyon + Canlı Osiloskop
   ============================================================================ */

(function () {
    "use strict";

    function setupHiDPICanvas(canvas) {
        if (!canvas) return null;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(260, rect.width || 360);
        const h = Math.max(50, rect.height || 195);
        if (canvas.width !== Math.round(w * dpr) || canvas.height !== Math.round(h * dpr)) {
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
        }
        const ctx = canvas.getContext("2d");
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        return { ctx, w, h };
    }

    // =========================================================================
    // 1. TUTUŞABİLİRLİK SINIR HARİTASI (MOC %O2 vs Hava Akışı cm/s)
    // =========================================================================
    function drawFlammabilityMap(canvasId, mapData, lang, flightValidation, showFlightOverlay) {
        const canvas = document.getElementById(canvasId);
        const pack = setupHiDPICanvas(canvas);
        if (!pack || !mapData) return;
        const { ctx, w, h } = pack;

        ctx.clearRect(0, 0, w, h);
        const pad = { l: 42, r: 16, t: 22, b: 30 };
        const pw = w - pad.l - pad.r;
        const ph = h - pad.t - pad.b;

        const flows = mapData.airflow_cms || [];
        const moc0g = mapData.moc_0g_pct || [];
        const mocLunar = mapData.moc_lunar_016g_pct || [];
        const moc1g = mapData.moc_1g_pct || [];
        const curr = mapData.current_point || { airflow_cms: 3.5, oxygen_pct: 21 };

        const minY = 6;
        const maxY = Math.min(105, Math.max(40, Math.ceil((curr.oxygen_pct + 5) / 10) * 10));
        const maxX = 40;
        const yStep = maxY > 55 ? 20 : 10;

        const xOf = (val) => pad.l + (Math.min(maxX, Math.max(0, val)) / maxX) * pw;
        const yOf = (val) => pad.t + ph - ((Math.min(maxY, Math.max(minY, val)) - minY) / (maxY - minY)) * ph;

        // Izgara ve Eksenler
        ctx.strokeStyle = "#172642";
        ctx.lineWidth = 1;
        ctx.font = "10.5px Consolas, monospace";
        ctx.fillStyle = "#64748b";

        for (let yv = yStep; yv <= maxY; yv += yStep) {
            const py = yOf(yv);
            ctx.beginPath();
            ctx.moveTo(pad.l, py);
            ctx.lineTo(w - pad.r, py);
            ctx.stroke();
            ctx.fillText(`%${yv}`, 5, py + 3);
        }
        for (let xv = 0; xv <= 40; xv += 10) {
            const px = xOf(xv);
            ctx.beginPath();
            ctx.moveTo(px, pad.t);
            ctx.lineTo(px, h - pad.b);
            ctx.stroke();
            ctx.fillText(`${xv}`, px - 6, h - 10);
        }

        // 0G Yanıcı Bölge Kırmızımsı Yarı-Saydam Dolgu (MOC eğrisinin üstü)
        if (flows.length > 1) {
            ctx.beginPath();
            ctx.moveTo(xOf(flows[0]), pad.t);
            for (let i = 0; i < flows.length; i++) {
                ctx.lineTo(xOf(flows[i]), yOf(moc0g[i]));
            }
            ctx.lineTo(xOf(flows[flows.length - 1]), pad.t);
            ctx.closePath();
            const grad = ctx.createLinearGradient(0, pad.t, 0, h - pad.b);
            grad.addColorStop(0, "rgba(239, 68, 68, 0.22)");
            grad.addColorStop(1, "rgba(245, 158, 11, 0.05)");
            ctx.fillStyle = grad;
            ctx.fill();
        }

        // 1G MOC Üst Sınır Eğrisi (Kesikli Kehribar)
        ctx.beginPath();
        ctx.setLineDash([5, 4]);
        ctx.strokeStyle = "#f59e0b";
        ctx.lineWidth = 1.8;
        flows.forEach((f, idx) => {
            const px = xOf(f);
            const py = yOf(moc1g[idx]);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();
        ctx.setLineDash([]);

        // 0.16G Ay (Lunar-g • LUCI/FM2 Ara Sınır) Eğrisi (Noktalı Zümrüt Yeşili)
        if (mocLunar.length === flows.length) {
            ctx.beginPath();
            ctx.setLineDash([2, 3]);
            ctx.strokeStyle = "#10b981";
            ctx.lineWidth = 1.65;
            flows.forEach((f, idx) => {
                const px = xOf(f);
                const py = yOf(mocLunar[idx]);
                if (idx === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();
            ctx.setLineDash([]);
        }

        // 0G MOC Alt Sınır Eğrisi (Parlak Turkuaz)
        ctx.beginPath();
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2.4;
        flows.forEach((f, idx) => {
            const px = xOf(f);
            const py = yOf(moc0g[idx]);
            if (idx === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
        });
        ctx.stroke();

        // Gerçek ISS / PSI Deneysel Ölçüm Noktaları (Elmas İşaretçi + Hata Çubuğu)
        if (showFlightOverlay !== false && flightValidation && Array.isArray(flightValidation.moc_points)) {
            flightValidation.moc_points.forEach((pt) => {
                const px = xOf(pt.airflow_cms);
                const py = yOf(pt.moc_meas_pct);
                const yTop = yOf(pt.moc_meas_pct + (pt.err_pct || 0.45));
                const yBot = yOf(pt.moc_meas_pct - (pt.err_pct || 0.45));

                ctx.strokeStyle = "rgba(224, 242, 254, 0.78)";
                ctx.lineWidth = 1.1;
                ctx.beginPath();
                ctx.moveTo(px, yTop);
                ctx.lineTo(px, yBot);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(px, py - 4.2);
                ctx.lineTo(px + 4.2, py);
                ctx.lineTo(px, py + 4.2);
                ctx.lineTo(px - 4.2, py);
                ctx.closePath();
                ctx.fillStyle = "#f8fafc";
                ctx.strokeStyle = "#0284c7";
                ctx.lineWidth = 1.5;
                ctx.fill();
                ctx.stroke();
            });
        }

        // Aktif Çalışma Noktası İşaretçisi (Canlı Hedef Halkası)
        const cx = xOf(curr.airflow_cms);
        const cy = yOf(curr.oxygen_pct);

        ctx.beginPath();
        ctx.arc(cx, cy, 9, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(cx, cy, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.strokeStyle = "#38bdf8";
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // Başlık ve Etiketler
        ctx.fillStyle = "#94a3b8";
        ctx.font = "10.5px Segoe UI, sans-serif";
        ctx.fillText(lang === "en" ? "Airflow (cm/s) →" : "Hava Akışı (cm/s) →", w - 110, h - 10);
        ctx.fillStyle = "#38bdf8";
        ctx.fillText("── 0G", pad.l + 2, 14);
        ctx.fillStyle = "#10b981";
        ctx.fillText(lang === "en" ? "·· 0.16G Moon" : "·· 0.16G Ay", pad.l + 44, 14);
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("- - 1G", pad.l + 124, 14);
        if (showFlightOverlay !== false && flightValidation) {
            ctx.fillStyle = "#f8fafc";
            ctx.fillText("◆ ISS", pad.l + 170, 14);
        }
        ctx.fillStyle = "#fca5a5";
        ctx.fillText(lang === "en" ? "▲ Flammable" : "▲ Yanıcı Bölge", w - 96, 14);
    }

    // =========================================================================
    // 2. ÇOKLU SENSÖR TUTARLILIK VE SOĞUK ALEV ANOMALİ GRAFİĞİ
    // =========================================================================
    function drawMultiSensorChart(canvasId, series, lang, flightValidation, showFlightOverlay) {
        const canvas = document.getElementById(canvasId);
        const pack = setupHiDPICanvas(canvas);
        if (!pack || !series || !series.time_s) return;
        const { ctx, w, h } = pack;

        ctx.clearRect(0, 0, w, h);
        const pad = { l: 38, r: 14, t: 22, b: 28 };
        const pw = w - pad.l - pad.r;
        const ph = h - pad.t - pad.b;

        const tArr = series.time_s;
        const optArr = series.optical_intensity_pct || [];
        const radArr = series.radiometer_kw_m2 || [];
        const coArr = series.co_ppm || [];
        const d2Arr = series.d2_normalized || [];

        const maxT = tArr[tArr.length - 1] || 30;
        const xOf = (t) => pad.l + (t / maxT) * pw;
        const yNorm = (norm01) => pad.t + ph - Math.min(1, Math.max(0, norm01)) * ph;

        // Izgara
        ctx.strokeStyle = "#172642";
        ctx.lineWidth = 1;
        for (let i = 0; i <= 4; i++) {
            const py = pad.t + (ph * i) / 4;
            ctx.beginPath();
            ctx.moveTo(pad.l, py);
            ctx.lineTo(w - pad.r, py);
            ctx.stroke();
        }

        // İki aşamalı Soğuk Alev geçiş çizgisi varsa vurgula
        if (series.two_stage_transition_s) {
            const tx = xOf(series.two_stage_transition_s);
            ctx.strokeStyle = "rgba(168, 85, 247, 0.75)";
            ctx.setLineDash([4, 3]);
            ctx.beginPath();
            ctx.moveTo(tx, pad.t);
            ctx.lineTo(tx, h - pad.b);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = "#d8b4fe";
            ctx.font = "10px Segoe UI, sans-serif";
            ctx.fillText(lang === "en" ? "Cool Flame Shift" : "Soğuk Alev Geçişi", tx + 4, pad.t + 12);
        }

        const plotTrace = (arr, scaleMax, color, width) => {
            ctx.beginPath();
            ctx.strokeStyle = color;
            ctx.lineWidth = width;
            arr.forEach((v, i) => {
                const px = xOf(tArr[i]);
                const py = yNorm(v / scaleMax);
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            });
            ctx.stroke();
        };

        // D²/D₀² (Yeşil), Optik Kamera (Mavi), IR Radyometre (Kehribar), CO ppm (Mor)
        plotTrace(d2Arr, 1.05, "#10b981", 1.8);
        plotTrace(optArr, 105.0, "#38bdf8", 2.2);
        plotTrace(radArr, 55.0, "#f59e0b", 2.0);
        plotTrace(coArr, 700.0, "#a855f7", 1.9);

        // Gerçek ISS Uçuş Telemetrisi (FLEX / BASS / Saffire / CFI-G) D²/D₀² Noktaları
        if (showFlightOverlay !== false && flightValidation && Array.isArray(flightValidation.d2_points)) {
            flightValidation.d2_points.forEach((pt) => {
                const px = xOf(pt.t_s);
                const py = yNorm(pt.d2_meas / 1.05);
                const yTop = yNorm((pt.d2_meas + (pt.err || 0.024)) / 1.05);
                const yBot = yNorm((pt.d2_meas - (pt.err || 0.024)) / 1.05);

                ctx.strokeStyle = "rgba(110, 231, 183, 0.85)";
                ctx.lineWidth = 1.15;
                ctx.beginPath();
                ctx.moveTo(px, yTop);
                ctx.lineTo(px, yBot);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(px, py - 4.2);
                ctx.lineTo(px + 4.2, py);
                ctx.lineTo(px, py + 4.2);
                ctx.lineTo(px - 4.2, py);
                ctx.closePath();
                ctx.fillStyle = "#ecfdf5";
                ctx.strokeStyle = "#059669";
                ctx.lineWidth = 1.5;
                ctx.fill();
                ctx.stroke();
            });
        }

        // Üst Lejant
        ctx.font = "10.5px Segoe UI, sans-serif";
        ctx.fillStyle = "#38bdf8";
        ctx.fillText(lang === "en" ? "■ Optical" : "■ Optik", pad.l, 14);
        ctx.fillStyle = "#f59e0b";
        ctx.fillText("■ IR Flux", pad.l + 56, 14);
        ctx.fillStyle = "#a855f7";
        ctx.fillText("■ CO ppm", pad.l + 114, 14);
        ctx.fillStyle = "#10b981";
        ctx.fillText("■ D²/D₀²", pad.l + 174, 14);
        if (showFlightOverlay !== false && flightValidation) {
            ctx.fillStyle = "#ecfdf5";
            ctx.fillText(`◆ ISS (R²=${flightValidation.r_squared})`, pad.l + 234, 14);
        }

        ctx.fillStyle = "#64748b";
        ctx.font = "10px Consolas, monospace";
        ctx.fillText("0s", pad.l, h - 9);
        ctx.fillText("15s", xOf(15) - 8, h - 9);
        ctx.fillText("30s", w - pad.r - 20, h - 9);
    }

    // =========================================================================
    // 3. WEB AUDIO API AKUSTİK SONİFİKASYON & CANLI OSİLOSKOP
    // =========================================================================
    class TelemetrySonifier {
        constructor(scopeCanvasId) {
            this.scopeCanvas = document.getElementById(scopeCanvasId);
            this.audioCtx = null;
            this.oscMain = null;
            this.oscHarmonic = null;
            this.lfo = null;
            this.lfoGain = null;
            this.masterGain = null;
            this.analyser = null;
            this.active = false;
            this.currentTel = null;
            this._drawLoop();
        }

        toggle() {
            if (this.active) {
                this.stop();
                return false;
            }
            this.start();
            return true;
        }

        start() {
            const AudioContextCls = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextCls) return;
            if (!this.audioCtx) {
                this.audioCtx = new AudioContextCls();
            }
            if (this.audioCtx.state === "suspended") {
                this.audioCtx.resume();
            }

            this.oscMain = this.audioCtx.createOscillator();
            this.oscHarmonic = this.audioCtx.createOscillator();
            this.lfo = this.audioCtx.createOscillator();
            this.lfoGain = this.audioCtx.createGain();
            this.masterGain = this.audioCtx.createGain();
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.fftSize = 256;

            this.oscMain.type = "sine";
            this.oscHarmonic.type = "triangle";
            this.lfo.type = "sine";

            this.lfo.frequency.value = 2.0;
            this.lfoGain.gain.value = 6.0;
            this.masterGain.gain.value = 0.08;

            this.lfo.connect(this.lfoGain);
            this.lfoGain.connect(this.oscMain.frequency);

            this.oscMain.connect(this.masterGain);
            this.oscHarmonic.connect(this.masterGain);
            this.masterGain.connect(this.analyser);
            this.analyser.connect(this.audioCtx.destination);

            this.oscMain.start();
            this.oscHarmonic.start();
            this.lfo.start();
            this.active = true;

            if (this.currentTel) {
                this.updateTelemetry(this.currentTel);
            }
        }

        stop() {
            this.active = false;
            try {
                if (this.oscMain) this.oscMain.stop();
                if (this.oscHarmonic) this.oscHarmonic.stop();
                if (this.lfo) this.lfo.stop();
            } catch (_) {}
            this.oscMain = null;
            this.oscHarmonic = null;
            this.lfo = null;
        }

        updateTelemetry(tel) {
            this.currentTel = tel;
            if (!this.active || !this.audioCtx || !this.oscMain) return;
            const now = this.audioCtx.currentTime;

            if (tel.extinguished) {
                this.masterGain.gain.setTargetAtTime(0.005, now, 0.15);
                this.oscMain.frequency.setTargetAtTime(110, now, 0.2);
                return;
            }

            if (tel.cool_flame_active) {
                // Görünmez Soğuk Alev Akustik Erken Uyarı Sinyali (Nabızlı 196 Hz & 294 Hz)
                this.masterGain.gain.setTargetAtTime(0.09, now, 0.12);
                this.oscMain.frequency.setTargetAtTime(196, now, 0.15);
                this.oscHarmonic.frequency.setTargetAtTime(294, now, 0.15);
                this.lfo.frequency.setTargetAtTime(4.2, now, 0.15);
                this.lfoGain.gain.setTargetAtTime(18.0, now, 0.15);
            } else {
                const baseFreq = 160 + ((tel.flame_temp_k - 1000) / 1500) * 260;
                this.masterGain.gain.setTargetAtTime(0.075, now, 0.12);
                this.oscMain.frequency.setTargetAtTime(Math.max(120, baseFreq), now, 0.15);
                this.oscHarmonic.frequency.setTargetAtTime(Math.max(180, baseFreq * 1.498), now, 0.15);
                this.lfo.frequency.setTargetAtTime(1.5 + tel.soot_index * 6.0, now, 0.15);
                this.lfoGain.gain.setTargetAtTime(4.0 + tel.risk_score * 0.08, now, 0.15);
            }
        }

        _drawLoop() {
            requestAnimationFrame(() => this._drawLoop());
            const pack = setupHiDPICanvas(this.scopeCanvas);
            if (!pack) return;
            const { ctx, w, h } = pack;
            ctx.clearRect(0, 0, w, h);

            ctx.beginPath();
            if (this.active && this.analyser) {
                const bufLen = this.analyser.frequencyBinCount;
                const data = new Uint8Array(bufLen);
                this.analyser.getByteTimeDomainData(data);
                ctx.strokeStyle = this.currentTel && this.currentTel.cool_flame_active ? "#a855f7" : "#38bdf8";
                ctx.lineWidth = 1.8;
                const slice = w / bufLen;
                for (let i = 0; i < bufLen; i++) {
                    const v = data[i] / 128.0;
                    const y = (v * h) / 2;
                    if (i === 0) ctx.moveTo(0, y);
                    else ctx.lineTo(i * slice, y);
                }
            } else {
                // Pasif bekleme nabız çizgisi
                ctx.strokeStyle = "#1e3a5f";
                ctx.lineWidth = 1.2;
                ctx.moveTo(0, h / 2);
                ctx.lineTo(w, h / 2);
            }
            ctx.stroke();
        }
    }

    window.AltarCharts = {
        drawFlammabilityMap,
        drawMultiSensorChart,
        TelemetrySonifier,
    };
})();
