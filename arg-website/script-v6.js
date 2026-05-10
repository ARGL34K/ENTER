// ================================================
//  script-v6.js — Lógica para la versión CRUNCHY
// ================================================

const OSINT_ARTICLES = [
    { cat: 'espionaje', date: '2025-12-05', source: 'BOLETÍN OFICIAL', rel: 'critico', title: 'Decreto 864/2025 — Política de Inteligencia Nacional', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' },
    { cat: 'vigilancia', date: '2025-12-02', source: 'FILO.NEWS', rel: 'medio', title: 'El Gobierno amplía fondos a la SIDE en silencio', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
    { cat: 'vigilancia', date: '2025-11-15', source: 'PÁGINA 12', rel: 'alto', title: 'Aumento de fondos reservados por decreto', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
    { cat: 'vigilancia', date: '2025-11-01', source: 'CHEQUEADO', rel: 'alto', title: 'Fondos SIDE: ampliación presupuestaria', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
    { cat: 'espionaje', date: '2025-10-01', source: 'HCDN', rel: 'critico', title: 'Proyecto de Ley 4201-D-2025: Control Parlamentario', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
    { cat: 'espionaje', date: '2025-09-01', source: 'CRISIS', rel: 'alto', title: 'Plan de Inteligencia Nacional libertario', url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
    { cat: 'vigilancia', date: '2025-07-15', source: 'CLARÍN', rel: 'alto', title: 'Reasignan $25.000 millones para la SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
    { cat: 'espionaje', date: '2025-07-01', source: 'ACIJ', rel: 'alto', title: 'Riesgo para garantías constitucionales', url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
    { cat: 'espionaje', date: '2025-06-10', source: 'CENITAL', rel: 'alto', title: 'Alconada Mon: Plan contra la opinión pública', url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinion-publica/' },
    { cat: 'espionaje', date: '2025-06-03', source: 'CNN', rel: 'critico', title: 'Filtran plan para investigar periodistas', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
    { cat: 'espionaje', date: '2025-05-07', source: 'CELS', rel: 'critico', title: 'Monitoreo de grupos vulnerables [INFORME]', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-grupos-vulnerables_mayo25.docx-1.pdf' },
    { cat: 'vigilancia', date: '2024-09-01', source: 'CENITAL', rel: 'critico', title: 'Derogación DNU fondos reservados', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' }
];

// ------------------------------------------------
//  CLOCK & DATE
// ------------------------------------------------
function updateTime() {
    const now = new Date();
    document.getElementById('live-clock').textContent = now.toLocaleTimeString('es-AR', { hour12: false });
    document.getElementById('live-date').textContent = now.toLocaleDateString('es-AR');
}
setInterval(updateTime, 1000);
updateTime();

// ------------------------------------------------
//  STATIC NOISE CAM 03
// ------------------------------------------------
const cnv3 = document.getElementById('cnv3');
if (cnv3) {
    const ctx = cnv3.getContext('2d');
    cnv3.width = 100; cnv3.height = 100;
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
//  OSINT RENDER
// ------------------------------------------------
function renderOsint() {
    const feed = document.getElementById('osint-feed');
    feed.innerHTML = OSINT_ARTICLES.map(a => `
        <a class="osint-item" href="${a.url}" target="_blank">
            <span class="osint-tag">${a.rel.toUpperCase()}</span>
            <div class="osint-source">${a.source} // ${a.date}</div>
            <div class="osint-title">${a.title}</div>
        </a>
    `).join('');
}
renderOsint();

// ------------------------------------------------
//  PANELS & LIGHTBOX
// ------------------------------------------------
function togglePanel(id) {
    document.getElementById(id).classList.toggle('collapsed');
}

function openCam(idx) {
    const lb = document.getElementById('cam-lightbox');
    const content = document.getElementById('lb-content');
    lb.classList.remove('hidden');
    
    if (idx === 0) content.innerHTML = '<iframe src="https://webcams.windy.com/webcams/public/embed/player/1751040831/day" style="width:100%; height:100%; border:none;"></iframe>';
    if (idx === 1) content.innerHTML = '<iframe src="https://webcams.windy.com/webcams/public/embed/player/1745449788/day" style="width:100%; height:100%; border:none;"></iframe>';
    if (idx === 2) content.innerHTML = '<div style="background:#000; height:100%; display:flex; align-items:center; justify-content:center; color:red; font-size:2rem;">NO SIGNAL</div>';
    if (idx === 3) content.innerHTML = '<iframe src="https://embed.windy.com/embed2.html?lat=-35.5&lon=-57.85&zoom=5&overlay=waves" style="width:100%; height:100%; border:none;"></iframe>';
}

function closeCam() {
    document.getElementById('cam-lightbox').classList.add('hidden');
    document.getElementById('lb-content').innerHTML = '';
}

// ------------------------------------------------
//  ADMIN GATE
// ------------------------------------------------
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        document.getElementById('admin-gate').classList.remove('hidden');
        document.getElementById('admin-pw').focus();
    }
});

document.getElementById('admin-pw').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        if (e.target.value === 'paranoid_drift') {
            alert('ADMIN ACCESS GRANTED // ESTA VERSIÓN V6 ES PREVIEW ESTÉTICA');
            document.getElementById('admin-gate').classList.add('hidden');
        } else {
            document.getElementById('gate-err').classList.remove('hidden');
        }
    }
});

// ESC to close anything
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeCam();
        document.getElementById('admin-gate').classList.add('hidden');
    }
});
