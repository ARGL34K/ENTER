// ================================================
//  script-v4.js — Lógica exclusiva de la v4
//  (Clock, Camera Static, Scan Bar, Admin Gate, Lang)
//  El sistema de audio, contraseñas, transmisiones
//  y admin panel ya viven en script.js
// ================================================

// ------------------------------------------------
//  RELOJ EN VIVO
// ------------------------------------------------
function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;

    const dateEl = document.getElementById('live-date');
    if (dateEl) {
        const dd = String(now.getDate()).padStart(2, '0');
        const mo = String(now.getMonth() + 1).padStart(2, '0');
        const yy = now.getFullYear();
        dateEl.textContent = `${dd}/${mo}/${yy}`;
    }
}
setInterval(updateClock, 1000);
updateClock();

// Solo CAM 04 usa canvas (señal cortada)
const CAM4_TINT = { r: 20, g: 20, b: 20 };  // B&N oscuro, señal muerta

function drawStatic(canvas, tint, frame) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random() * 200 | 0;
        data[i]     = noise;
        data[i + 1] = noise;
        data[i + 2] = noise;
        data[i + 3] = 230;
    }

    // Línea de glitch horizontal
    if (Math.random() < 0.12) {
        const glitchY = (Math.random() * h | 0) * w * 4;
        for (let x = 0; x < w; x++) {
            const idx = glitchY + x * 4;
            data[idx] = data[idx+1] = data[idx+2] = 255;
            data[idx+3] = 160;
        }
    }

    // Barra oscura de rollback VHS
    if (frame % 180 < 8) {
        const barY = ((frame % 180) / 8 * h | 0) * w * 4;
        for (let x = 0; x < w * 4; x++) data[barY + x] = x % 4 === 3 ? 120 : 0;
    }

    ctx.putImageData(imageData, 0, 0);
}

function initCamera4() {
    const canvas = document.getElementById('cnv3');  // CAM 03 = señal cortada
    if (!canvas) return;
    const parent = canvas.parentElement;
    canvas.width  = parent.offsetWidth  || 200;
    canvas.height = parent.offsetHeight || 200;
}

let frameCount = 0;
function animateStatic() {
    frameCount++;
    const canvas = document.getElementById('cnv3');  // CAM 03 = señal cortada
    if (canvas) drawStatic(canvas, CAM4_TINT, frameCount);
    requestAnimationFrame(animateStatic);
}

// ------------------------------------------------
//  BARRA DE ESCANEO ANIMADA
// ------------------------------------------------
let scanPct = 0;
let scanDir = 1;

function animateScan() {
    scanPct += scanDir * (0.3 + Math.random() * 0.4);
    if (scanPct >= 100) { scanPct = 100; scanDir = -1; }
    if (scanPct <= 0)   { scanPct = 0;   scanDir = 1; }

    const bar = document.getElementById('scan-bar');
    const pct = document.getElementById('scan-pct');
    if (bar) bar.style.width = scanPct.toFixed(1) + '%';
    if (pct) pct.textContent  = Math.round(scanPct) + '%';

    setTimeout(animateScan, 80 + Math.random() * 60);
}

// ------------------------------------------------
//  OVERRIDE: Render de transmisiones estilo v2
//  Sobreescribe la función de script.js para esta página
// ------------------------------------------------
// Re-definimos renderTransmissions para que use estilos v2
window.renderTransmissions = function() {
    const list = getTransmissions();
    const container = document.getElementById('transmissions-list');
    const noMsg     = document.getElementById('no-transmissions-msg');

    const existing = container.querySelectorAll('.transmission-item');
    existing.forEach(el => el.remove());

    if (list.length === 0) {
        if (noMsg) noMsg.classList.remove('hidden');
    } else {
        if (noMsg) noMsg.classList.add('hidden');
        list.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'transmission-item';
            div.innerHTML = `
                <div class="transmission-timestamp">▶ [${formatDate(msg.date)}] OPERADOR .ARGL34K:</div>
                <div class="transmission-text">${escapeHTML(msg.text)}</div>
            `;
            container.appendChild(div);
        });
    }
};

// Override del checkPassword para actualizar el estilo v2 al desencriptar
const _origCheck = window.checkPassword;
window.checkPassword = function() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorText = document.getElementById('password-error');
    if (input === currentPassword) {
        const fileElement = document.getElementById(targetFileId);
        const statusSpan  = fileElement.querySelector('.file-status-v2');
        fileElement.classList.remove('locked');
        fileElement.classList.add('decrypted');
        if (statusSpan) {
            statusSpan.className = 'file-status-v2 decrypted-status';
            statusSpan.innerText = '▶ DESENCRIPTADO';
        }
        document.getElementById('password-modal').classList.add('hidden');
        playAudio(currentAudioId);
    } else {
        if (errorText) errorText.classList.remove('hidden');
    }
};

// ------------------------------------------------
//  INIT
// ------------------------------------------------
document.addEventListener('DOMContentLoaded', function() {
    initCamera4();
    animateStatic();
    animateScan();
    renderTransmissions();
});

// ================================================
//  LIGHTBOX: CÁMARA EN PANTALLA COMPLETA
// ================================================

const CAM_DATA = [
    {
        name: 'CAM 01 · DOCK SUD',
        coord: '34°40\'S 58°21\'O · PUERTO BsAs',
        type: 'iframe',
        vhs: true,
        src: 'https://webcams.windy.com/webcams/public/embed/player/1751040831/day'
    },
    {
        name: 'CAM 02 · MARTÍNEZ',
        coord: '34°29\'S 58°31\'O · NORTE BsAs',
        type: 'iframe',
        vhs: true,
        src: 'https://webcams.windy.com/webcams/public/embed/player/1745449788/day'
    },
    {
        name: 'CAM 03 · DPTO-D P8',
        coord: 'SEÑAL CORTADA — SIN RESPUESTA',
        type: 'canvas',
        vhs: false
    },
    {
        name: 'CAM 04 · RUTA ESCAPE',
        coord: 'BUENOS AIRES → COLONIA DEL SACRAMENTO · MODO OLAS',
        type: 'map',
        vhs: false,
        src: 'https://embed.windy.com/embed2.html?lat=-35.5&lon=-57.85&detailLat=-35.5&detailLon=-57.85&zoom=5&level=surface&overlay=waves&product=ecmwf&menu=&message=&marker=&calendar=now&pressure=&type=map&location=coordinates&detail=&metricWind=default&metricTemp=default&radarRange=-1'
    }
];

let lbCanvasAnim = null;

function openCamLightbox(idx) {
    const cam = CAM_DATA[idx];
    const lb      = document.getElementById('cam-lightbox');
    const content = document.getElementById('lb-content');

    // Rellenar datos HUD
    document.getElementById('lb-cam-name').textContent  = cam.name;
    document.getElementById('lb-cam-coord').textContent = cam.coord;

    // Limpiar contenido anterior
    content.innerHTML = '';
    content.className = 'lb-content';
    if (lbCanvasAnim) { cancelAnimationFrame(lbCanvasAnim); lbCanvasAnim = null; }

    if (cam.type === 'iframe') {
        content.classList.add('lb-vhs');
        const iframe = document.createElement('iframe');
        iframe.src = cam.src;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        iframe.allow = 'autoplay';
        content.appendChild(iframe);

    } else if (cam.type === 'map') {
        content.classList.add('lb-map');
        const iframe = document.createElement('iframe');
        iframe.src = cam.src;
        iframe.frameBorder = '0';
        iframe.allowFullscreen = true;
        content.appendChild(iframe);

    } else if (cam.type === 'canvas') {
        // Canvas grande con ruido VHS B&N
        const canvas = document.createElement('canvas');
        canvas.style.width  = '100%';
        canvas.style.height = '100%';
        content.appendChild(canvas);

        // Ajustar tamaño real
        requestAnimationFrame(() => {
            canvas.width  = content.offsetWidth;
            canvas.height = content.offsetHeight;
            const tint = { r: 15, g: 15, b: 15 };
            let f = 0;
            function loop() {
                drawStatic(canvas, tint, f++);
                lbCanvasAnim = requestAnimationFrame(loop);
            }
            loop();
        });
    }

    lb.classList.remove('hidden');
    startLbClock();
    document.addEventListener('keydown', lbKeyHandler);
}

function closeCamLightbox() {
    const lb = document.getElementById('cam-lightbox');
    lb.classList.add('hidden');
    document.getElementById('lb-content').innerHTML = '';
    if (lbCanvasAnim) { cancelAnimationFrame(lbCanvasAnim); lbCanvasAnim = null; }
    document.removeEventListener('keydown', lbKeyHandler);
    if (lbClockInterval) { clearInterval(lbClockInterval); lbClockInterval = null; }
}

function lbKeyHandler(e) {
    if (e.key === 'Escape') closeCamLightbox();
}

// Reloj propio del lightbox
let lbClockInterval = null;
function startLbClock() {
    if (lbClockInterval) clearInterval(lbClockInterval);
    const tick = () => {
        const now = new Date();
        const t = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const el = document.getElementById('lb-clock-live');
        if (el) el.textContent = t;
    };
    tick();
    lbClockInterval = setInterval(tick, 1000);
}

// ================================================
//  SECCIÓN ACCESO PÚBLICO — NAVEGADOR DE MEDIOS OSINT
// ================================================

const OSINT_ARTICLES = [

    // ---- ESPIONAJE ----
    {
        cat: 'espionaje',
        date: '2025-05-07',
        source: 'CELS',
        rel: 'critico',
        title: 'Plan de Inteligencia Nacional y directiva para monitoreo de grupos vulnerables [INFORME OFICIAL]',
        url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-grupos-vulnerables_mayo25.docx-1.pdf'
    },
    {
        cat: 'espionaje',
        date: '2025-06-03',
        source: 'CNN',
        rel: 'critico',
        title: 'Filtran supuesto plan del Gobierno de Argentina para investigar a periodistas y políticos',
        url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix'
    },
    {
        cat: 'espionaje',
        date: '2025-06-10',
        source: 'CENITAL',
        rel: 'alto',
        title: 'Alconada Mon: "Hay un plan muy bien armado para tratar de avanzar sobre la opinión pública"',
        url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinion-publica/'
    },
    {
        cat: 'espionaje',
        date: '2025-07-01',
        source: 'ACIJ',
        rel: 'alto',
        title: 'Reforma del sistema de inteligencia: una norma que pone en riesgo garantías constitucionales básicas',
        url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/'
    },
    {
        cat: 'espionaje',
        date: '2025-09-01',
        source: 'CRISIS',
        rel: 'alto',
        title: 'Controlar al pueblo para entregar la patria: ¿Qué dice el Plan de Inteligencia Nacional libertario?',
        url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/'
    },
    {
        cat: 'espionaje',
        date: '2025-10-01',
        source: 'HCDN',
        rel: 'critico',
        title: 'Proyecto de Ley 4201-D-2025: Régimen de control parlamentario del sistema de inteligencia [DOC OFICIAL]',
        url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf'
    },

    // ---- VIGILANCIA: FONDOS RESERVADOS ----
    {
        cat: 'vigilancia',
        date: '2024-09-01',
        source: 'CENITAL',
        rel: 'critico',
        title: 'Senado: se derogó el DNU de fondos reservados para la SIDE',
        url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/'
    },
    {
        cat: 'vigilancia',
        date: '2025-07-15',
        source: 'CLARÍN',
        rel: 'alto',
        title: 'Reasignan $25.000 millones para la SIDE: un tercio de los fondos se destinará a gastos reservados',
        url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html'
    },
    {
        cat: 'vigilancia',
        date: '2025-11-01',
        source: 'CHEQUEADO',
        rel: 'alto',
        title: 'Los fondos de la SIDE: el gobierno de Milei amplió el presupuesto y nombró un nuevo jefe',
        url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/'
    },
    {
        cat: 'vigilancia',
        date: '2025-11-15',
        source: 'PÁGINA 12',
        rel: 'alto',
        title: 'El Gobierno aumentó los fondos reservados para la SIDE por decreto',
        url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/'
    },
    {
        cat: 'vigilancia',
        date: '2025-12-02',
        source: 'FILO.NEWS',
        rel: 'medio',
        title: 'El Gobierno amplía fondos a la SIDE en silencio y en medio de internas',
        url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas'
    },
    {
        cat: 'vigilancia',
        date: '2025-12-05',
        source: 'BOLETÍN OFICIAL',
        rel: 'critico',
        title: 'Decreto 864/2025 — Apruébase la "Política de Inteligencia Nacional" [DOCUMENTO OFICIAL]',
        url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205'
    }
];

let osintActiveFilter = 'all';


function renderOsint(filter) {
    const feed = document.getElementById('osint-feed');
    if (!feed) return;
    const articles = filter === 'all' ? OSINT_ARTICLES : OSINT_ARTICLES.filter(a => a.cat === filter);
    feed.innerHTML = articles.map(a => `
        <a class="osint-item" href="${a.url}" target="_blank" rel="noopener noreferrer" data-cat="${a.cat}">
            <div class="osint-meta">
                <span class="osint-date">${a.date}</span>
                <span class="osint-source">${a.source}</span>
            </div>
            <div class="osint-body">
                <div class="osint-title">${a.title}</div>
            </div>
            <span class="osint-tag ${a.rel}">${a.rel.toUpperCase()}</span>
        </a>
    `).join('');
}

function filterOsint(cat, btn) {
    osintActiveFilter = cat;
    document.querySelectorAll('.osint-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderOsint(cat);
}

// Inicializar OSINT al arrancar
document.addEventListener('DOMContentLoaded', function() {
    // (ya existe el listener, agregamos renderOsint aquí via patch)
});

// Llamada directa para cuando el DOM ya está listo
(function initOsint() {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => renderOsint('all'));
    } else {
        renderOsint('all');
    }
})();

// ================================================
//  ADMIN GATE v4 — intercepta Ctrl+Shift+A
//  Clave: paranoid_drift
// ================================================
const ADMIN_KEY_V4 = 'paranoid_drift';

(function initAdminGate() {
    // Crear modal de clave de operador
    const overlay = document.createElement('div');
    overlay.id = 'admin-gate-overlay';
    overlay.style.cssText = `
        display:none; position:fixed; inset:0; z-index:9500;
        background:rgba(0,0,0,0.88); backdrop-filter:blur(6px);
        align-items:center; justify-content:center;
    `;

    overlay.innerHTML = `
        <div style="
            background:#111; border:1px solid #664400;
            padding:2rem 2.5rem; width:min(90vw,420px);
            font-family:'Share Tech Mono',monospace; color:#b8b8b8;
            box-shadow:0 0 40px rgba(100,60,0,0.2);
        ">
            <div style="color:#cc7700;font-family:'Bebas Neue',sans-serif;font-size:1.4rem;letter-spacing:4px;margin-bottom:1rem;">
                // PANEL DE OPERADOR
            </div>
            <div style="font-size:0.72rem;color:#555;margin-bottom:1.2rem;letter-spacing:1px;">
                ACCESO RESTRINGIDO · INGRESE CLAVE DE OPERADOR
            </div>
            <input id="admin-gate-input" type="password" autocomplete="off" spellcheck="false"
                placeholder="_ _ _ _ _ _ _ _ _ _ _ _ _"
                style="
                    width:100%; background:#000; border:1px solid #664400;
                    border-bottom:2px solid #cc7700; color:#b8b8b8;
                    font-family:'Share Tech Mono',monospace; font-size:1rem;
                    letter-spacing:4px; padding:0.6rem 0.75rem; outline:none;
                    margin-bottom:0.75rem;
                "
            >
            <div id="admin-gate-error" style="color:#993333;font-size:0.72rem;margin-bottom:0.75rem;display:none;">
                ✕ CLAVE INVÁLIDA. ACCESO DENEGADO.
            </div>
            <div style="display:flex;gap:0.75rem;">
                <button onclick="checkAdminGate()" style="
                    flex:1; background:#161616; border:1px solid #664400;
                    color:#b8b8b8; font-family:'Bebas Neue',sans-serif;
                    font-size:1rem; letter-spacing:3px; padding:0.5rem;
                    cursor:pointer; transition:all 0.15s;
                " onmouseover="this.style.borderColor='#cc7700';this.style.color='#cc7700'"
                   onmouseout="this.style.borderColor='#664400';this.style.color='#b8b8b8'">
                    [ VERIFICAR ]
                </button>
                <button onclick="closeAdminGate()" style="
                    background:transparent; border:1px solid #333;
                    color:#555; font-family:'Share Tech Mono',monospace;
                    font-size:0.75rem; padding:0.5rem 1rem; cursor:pointer;
                " onmouseover="this.style.color='#b8b8b8'" onmouseout="this.style.color='#555'">
                    [ CANCELAR ]
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Interceptar el atajo antes de que script.js lo procese
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.stopImmediatePropagation();
            e.preventDefault();
            openAdminGate();
        }
    }, true); // capture phase — se ejecuta antes que el listener de script.js
})();

function openAdminGate() {
    const overlay = document.getElementById('admin-gate-overlay');
    overlay.style.display = 'flex';
    const inp = document.getElementById('admin-gate-input');
    inp.value = '';
    document.getElementById('admin-gate-error').style.display = 'none';
    inp.focus();
}

function closeAdminGate() {
    document.getElementById('admin-gate-overlay').style.display = 'none';
}

function checkAdminGate() {
    const val = document.getElementById('admin-gate-input').value.trim();
    if (val === ADMIN_KEY_V4) {
        closeAdminGate();
        openAdmin(); // función de script.js
    } else {
        const err = document.getElementById('admin-gate-error');
        err.style.display = 'block';
        document.getElementById('admin-gate-input').value = '';
        document.getElementById('admin-gate-input').focus();
    }
}

// Enter en el admin-gate-input
document.addEventListener('keydown', function(e) {
    const overlay = document.getElementById('admin-gate-overlay');
    if (!overlay || overlay.style.display === 'none') return;
    if (e.key === 'Enter') checkAdminGate();
    if (e.key === 'Escape') closeAdminGate();
});

// ================================================
//  SELECTOR DE IDIOMA v4
// ================================================
function switchLang(lang) {
    document.documentElement.lang = lang;
    const sel = document.getElementById('lang-select');
    if (sel) sel.value = lang;
}

// ================================================
//  SECCIONES COLAPSABLES (panel derecho)
// ================================================
function toggleSection(sectionId) {
    const sec = document.getElementById(sectionId);
    if (!sec) return;
    sec.classList.toggle('collapsed');
}


