// ================================================
//  script-v7.js — Lógica para la versión ALTAR
// ================================================

const OSINT_DATA = [
    { date: '2025-12-05', source: 'BOLETÍN OFICIAL', title: 'DECRETO 864/2025: POLÍTICA DE INTELIGENCIA NACIONAL', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' },
    { date: '2025-12-02', source: 'FILO.NEWS', title: 'AMPLIACIÓN DE FONDOS SIDE EN SILENCIO', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
    { date: '2025-11-15', source: 'PÁGINA 12', title: 'FONDOS RESERVADOS SIDE: AUMENTO POR DECRETO', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
    { date: '2025-11-01', source: 'CHEQUEADO', title: 'SIDE: TERCERA AMPLIACIÓN PRESUPUESTARIA 2025', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
    { date: '2025-10-01', source: 'HCDN', title: 'PROYECTO 4201-D-2025: CONTROL PARLAMENTARIO', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
    { date: '2025-09-01', source: 'CRISIS', title: 'PLAN DE INTELIGENCIA NACIONAL LIBERTARIO', url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
    { date: '2025-07-15', source: 'CLARÍN', title: 'REASIGNACIÓN DE $25.000M PARA LA SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
    { date: '2025-07-01', source: 'ACIJ', title: 'SISTEMA DE INTELIGENCIA: RIESGO CONSTITUCIONAL', url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
    { date: '2025-06-10', source: 'CENITAL', title: 'PLAN DE AVANCE SOBRE LA OPINIÓN PÚBLICA', url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinión-pública/' },
    { date: '2025-06-03', source: 'CNN', title: 'FILTRACIÓN: INVESTIGACIÓN A PERIODISTAS', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
    { date: '2025-05-07', source: 'CELS', title: 'MONITOREO DE GRUPOS VULNERABLES: INFORME', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-grupos-vulnerables_mayo25.docx-1.pdf' },
    { date: '2024-09-01', source: 'CENITAL', title: 'DEROGACIÓN DNU FONDOS RESERVADOS SIDE', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' }
];

const FREQS = [
    { name: 'FREQ_A1_INTERFERENCIA', id: 'audio1', src: 'assets/11729__wwwbonsonca__telephone_interference_01.wav' },
    { name: 'FREQ_B2_WOODPECKER', id: 'audio2', src: 'assets/Woodpecker.ogg' },
    { name: 'FREQ_M3_MORSE', id: 'audio3', src: 'assets/CLAVE-EN-MORSE.mp3' },
    { name: 'FREQ_R4_RUSSIAN', id: 'audio4', src: 'assets/CLAVE-EN-RUSO-pt1.mp3' }
];

// ------------------------------------------------
//  CLOCK
// ------------------------------------------------
function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').textContent = now.toLocaleTimeString('es-AR', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

// ------------------------------------------------
//  OSINT & FREQS RENDER
// ------------------------------------------------
function initAltar() {
    const osintFeed = document.getElementById('osint-feed');
    osintFeed.innerHTML = OSINT_DATA.map(a => `
        <a href="${a.url}" target="_blank" class="altar-item">
            <div class="item-meta">♰ ${a.source} // ${a.date}</div>
            <div class="item-title">${a.title}</div>
        </a>
    `).join('');

    const freqList = document.getElementById('freq-list');
    freqList.innerHTML = FREQS.map(f => `
        <div class="freq-item" onclick="playFreq('${f.id}')">
            ${f.name}
            <audio id="${f.id}" src="${f.src}"></audio>
        </div>
    `).join('');
}

// ------------------------------------------------
//  AUDIO
// ------------------------------------------------
let currentAudio = null;
function playFreq(id) {
    const audio = document.getElementById(id);
    if (currentAudio && currentAudio !== audio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }
    if (audio.paused) {
        audio.play();
        currentAudio = audio;
    } else {
        audio.pause();
        currentAudio = null;
    }
}

// ------------------------------------------------
//  STATIC NOISE
// ------------------------------------------------
const cnv = document.getElementById('static-cnv');
if (cnv) {
    const ctx = cnv.getContext('2d');
    cnv.width = 100; cnv.height = 100;
    const imgData = ctx.createImageData(100, 100);
    const data = imgData.data;
    function noise() {
        for (let i = 0; i < data.length; i += 4) {
            const val = Math.random() * 255;
            data[i] = data[i+1] = data[i+2] = val;
            data[i+3] = 255;
        }
        ctx.putImageData(imgData, 0, 0);
        requestAnimationFrame(noise);
    }
    noise();
}

// ------------------------------------------------
//  LIGHTBOX
// ------------------------------------------------
function openLightbox(idx) {
    const lb = document.getElementById('lightbox');
    const content = document.getElementById('lb-content');
    lb.classList.remove('hidden');
    
    const cams = [
        'https://webcams.windy.com/webcams/public/embed/player/1751040831/day',
        'https://webcams.windy.com/webcams/public/embed/player/1745449788/day',
        'static',
        'https://embed.windy.com/embed2.html?lat=-35.5&lon=-57.85&zoom=5&overlay=waves'
    ];
    
    if (cams[idx] === 'static') {
        content.innerHTML = '<div style="height:100%; display:flex; align-items:center; justify-content:center; color:red; font-size:3rem; font-family:Courier Prime;">♰ SIGNAL LOST ♰</div>';
    } else {
        content.innerHTML = `<iframe src="${cams[idx]}" style="width:100%; height:100%; border:none;"></iframe>`;
    }
}

function closeLightbox() {
    document.getElementById('lightbox').classList.add('hidden');
    document.getElementById('lb-content').innerHTML = '';
}

// ------------------------------------------------
//  ADMIN GATE
// ------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        document.getElementById('admin-gate').classList.remove('hidden');
        document.getElementById('gate-input').focus();
    }
});

document.getElementById('gate-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (e.target.value === 'paranoid_drift') {
            document.getElementById('admin-gate').classList.add('hidden');
            alert('♰ ACCESO AL ALTAR CONCEDIDO ♰');
        } else {
            document.getElementById('gate-error').classList.remove('hidden');
        }
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeLightbox();
        document.getElementById('admin-gate').classList.add('hidden');
    }
});

window.onload = initAltar;
