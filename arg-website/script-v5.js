// ================================================
//  script-v5.js — Lógica exclusiva de la v5
//  Inspirada en estética Angus Nicneven
// ================================================

// ------------------------------------------------
//  RELOJ Y FECHA
// ------------------------------------------------
function updateClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    
    const clockEl = document.getElementById('live-clock');
    const lbClockEl = document.getElementById('lb-clock-live');
    
    if (clockEl) clockEl.textContent = `${hh}:${mm}:${ss}`;
    if (lbClockEl) lbClockEl.textContent = `${hh}:${mm}:${ss}`;

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

// ------------------------------------------------
//  ESTÁTICA CAM 03
// ------------------------------------------------
const cnv3 = document.getElementById('cnv3');
function drawStatic(canvas) {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 200;
    const h = canvas.height = 200;
    const imageData = ctx.createImageData(w, h);
    const data = imageData.data;

    function render() {
        for (let i = 0; i < data.length; i += 4) {
            const noise = Math.random() * 255 | 0;
            data[i] = data[i+1] = data[i+2] = noise;
            data[i+3] = 255;
        }
        ctx.putImageData(imageData, 0, 0);
        requestAnimationFrame(render);
    }
    render();
}
if (cnv3) drawStatic(cnv3);

// ------------------------------------------------
//  OSINT DATA & RENDERING (NOTICIAS.txt)
// ------------------------------------------------
const OSINT_ARTICLES = [
    {
        cat: 'espionaje',
        date: '2025-12-05',
        source: 'BOLETÍN OFICIAL',
        rel: 'critico',
        title: 'Decreto 864/2025 — Apruébase la "Política de Inteligencia Nacional" [DOCUMENTO OFICIAL]',
        url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205'
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
        date: '2025-11-15',
        source: 'PÁGINA 12',
        rel: 'alto',
        title: 'El Gobierno aumentó los fondos reservados para la SIDE por decreto',
        url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/'
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
        cat: 'espionaje',
        date: '2025-10-01',
        source: 'HCDN',
        rel: 'critico',
        title: 'Proyecto de Ley 4201-D-2025: Régimen de control parlamentario del sistema de inteligencia [DOC OFICIAL]',
        url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf'
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
        cat: 'vigilancia',
        date: '2025-07-15',
        source: 'CLARÍN',
        rel: 'alto',
        title: 'Reasignan $25.000 millones para la SIDE: un tercio de los fondos se destinará a gastos reservados',
        url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html'
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
        date: '2025-06-10',
        source: 'CENITAL',
        rel: 'alto',
        title: 'Alconada Mon: "Hay un plan muy bien armado para tratar de avanzar sobre la opinión pública"',
        url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar- de-avanzar-sobre-la-opinión-pública/'
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
        date: '2025-05-07',
        source: 'CELS',
        rel: 'critico',
        title: 'Plan de Inteligencia Nacional y directiva para monitoreo de grupos vulnerables [INFORME OFICIAL]',
        url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-grupos-vulnerables_mayo25.docx-1.pdf'
    },
    {
        cat: 'vigilancia',
        date: '2024-09-01',
        source: 'CENITAL',
        rel: 'critico',
        title: 'Senado: se derogó el DNU de fondos reservados para la SIDE',
        url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/'
    }
];

let currentOsintFilter = 'all';

function renderOsint(filter = 'all') {
    const feed = document.getElementById('osint-feed');
    if (!feed) return;
    currentOsintFilter = filter;
    
    const articles = filter === 'all' ? OSINT_ARTICLES : OSINT_ARTICLES.filter(a => a.cat === filter);
    
    feed.innerHTML = articles.map(a => `
        <a class="osint-item" href="${a.url}" target="_blank" rel="noopener noreferrer">
            <div class="osint-meta">
                <span class="osint-date">${a.date}</span>
                <span class="osint-source">${a.source}</span>
            </div>
            <div class="osint-title">${a.title}</div>
            <span class="osint-tag ${a.rel}">${a.rel.toUpperCase()}</span>
        </a>
    `).join('');
}

function filterOsint(cat, btn) {
    renderOsint(cat);
    document.querySelectorAll('.osint-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}

// ------------------------------------------------
//  SECCIONES COLAPSABLES
// ------------------------------------------------
function toggleSection(id) {
    const sec = document.getElementById(id);
    if (sec) sec.classList.toggle('collapsed');
}

// ------------------------------------------------
//  LIGHTBOX CÁMARAS
// ------------------------------------------------
const CAM_DATA = [
    { name: "CAM 01 · DOCK SUD", coord: "34°40'S 58°21'O", type: "windy", id: "1751040831" },
    { name: "CAM 02 · MARTÍNEZ", coord: "34°29'S 58°31'O", type: "windy", id: "1745449788" },
    { name: "CAM 03 · DPTO-D P8", coord: "34°36'S 58°22'O", type: "static" },
    { name: "CAM 04 · RUTA ESCAPE", coord: "BsAs → COLONIA", type: "map" }
];

function openCamLightbox(idx) {
    const lb = document.getElementById('cam-lightbox');
    const content = document.getElementById('lb-content');
    const nameEl = document.getElementById('lb-cam-name');
    const coordEl = document.getElementById('lb-cam-coord');
    
    const cam = CAM_DATA[idx];
    nameEl.textContent = cam.name;
    coordEl.textContent = cam.coord;
    
    content.className = "lb-content";
    if (cam.type === "windy") {
        content.classList.add("lb-vhs");
        content.innerHTML = `<iframe src="https://webcams.windy.com/webcams/public/embed/player/${cam.id}/day" frameborder="0" allowfullscreen></iframe>`;
    } else if (cam.type === "static") {
        content.innerHTML = `<canvas id="lb-canvas"></canvas>`;
        drawStatic(document.getElementById('lb-canvas'));
    } else if (cam.type === "map") {
        content.classList.add("lb-map");
        content.innerHTML = `<iframe src="https://embed.windy.com/embed2.html?lat=-35.5&lon=-57.85&zoom=6&overlay=waves" frameborder="0" allowfullscreen></iframe>`;
    }
    
    lb.classList.remove('hidden');
}

function closeCamLightbox() {
    document.getElementById('cam-lightbox').classList.add('hidden');
    document.getElementById('lb-content').innerHTML = "";
}

// Esc para cerrar lightbox
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape") closeCamLightbox();
});

// ------------------------------------------------
//  SISTEMA DE CONTRASEÑAS (EXPEDIENTES)
// ------------------------------------------------
let currentLockedFileId = null;
let currentLockedAudioId = null;
let currentTargetPassword = null;

function promptPassword(fileId, password, audioId) {
    const fileRow = document.getElementById(fileId);
    if (fileRow.classList.contains('unlocked')) {
        playAudio(audioId);
        return;
    }
    
    currentLockedFileId = fileId;
    currentLockedAudioId = audioId;
    currentTargetPassword = password;
    
    const modal = document.getElementById('password-modal');
    modal.classList.remove('hidden');
    document.getElementById('password-input').focus();
    document.getElementById('password-error').classList.add('hidden');
}

function checkPassword() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    if (input === currentTargetPassword) {
        const fileRow = document.getElementById(currentLockedFileId);
        fileRow.classList.remove('locked');
        fileRow.classList.add('unlocked');
        fileRow.querySelector('.file-status').textContent = "▶ REPRODUCIR";
        fileRow.querySelector('.file-status').className = "file-status ok";
        
        document.getElementById('password-modal').classList.add('hidden');
        document.getElementById('password-input').value = "";
        playAudio(currentLockedAudioId);
    } else {
        document.getElementById('password-error').classList.remove('hidden');
    }
}

function playAudio(id) {
    const audios = document.querySelectorAll('audio');
    audios.forEach(a => {
        if (a.id !== id) {
            a.pause();
            a.currentTime = 0;
        }
    });
    const target = document.getElementById(id);
    if (target.paused) target.play();
    else target.pause();
}

// ------------------------------------------------
//  ADMIN GATE & PANEL (Ctrl+Shift+A)
// ------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        document.getElementById('admin-gate').classList.remove('hidden');
        document.getElementById('admin-gate-input').focus();
    }
});

function checkAdminGate() {
    const pw = document.getElementById('admin-gate-input').value;
    if (pw === 'paranoid_drift') {
        document.getElementById('admin-gate').classList.add('hidden');
        document.getElementById('admin-panel').classList.remove('hidden');
        document.getElementById('admin-gate-input').value = "";
        document.getElementById('gate-error').classList.add('hidden');
    } else {
        document.getElementById('gate-error').classList.remove('hidden');
    }
}

function closeAdminGate() {
    document.getElementById('admin-gate').classList.add('hidden');
    document.getElementById('admin-gate-input').value = "";
}

function closeAdminPanel() {
    document.getElementById('admin-panel').classList.add('hidden');
}

// ------------------------------------------------
//  TRANSMISIONES LOGIC (con persistencia)
// ------------------------------------------------
const STORAGE_KEY = 'argl34k_transmissions';

function getTransmissions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveTransmissions(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderTransmissions() {
    const list = getTransmissions();
    const container = document.getElementById('transmissions-list');
    const noMsg = document.getElementById('no-transmissions-msg');
    
    if (!container) return;
    container.innerHTML = '';
    
    if (list.length === 0) {
        if (noMsg) container.appendChild(noMsg);
        else container.innerHTML = '<p class="no-transmissions" id="no-transmissions-msg">SIN TRANSMISIONES ACTIVAS.</p>';
    } else {
        list.forEach(msg => {
            const item = document.createElement('div');
            item.className = 'transmission-item';
            item.innerHTML = `
                <div class="transmission-timestamp">[${msg.timestamp}] OPERADOR .ARGL34K:</div>
                <div class="transmission-text">${msg.text}</div>
            `;
            container.appendChild(item);
        });
    }
}

function addTransmission() {
    const input = document.getElementById('transmission-input');
    const text = input.value.trim();
    if (!text) return;
    
    const now = new Date();
    const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
    
    const list = getTransmissions();
    list.unshift({ timestamp: ts, text: text });
    saveTransmissions(list);
    renderTransmissions();
    
    input.value = "";
}

// ------------------------------------------------
//  IDIOMAS (Placeholder funcional)
// ------------------------------------------------
function switchLang(lang) {
    console.log("Switching language to:", lang);
}

// INIT
window.onload = () => {
    renderOsint('all');
    renderTransmissions();
    
    // Escuchar Enter en el modal de contraseña
    const pwInput = document.getElementById('password-input');
    if (pwInput) {
        pwInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') checkPassword();
        });
    }
};

