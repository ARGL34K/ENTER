// ================================================
//  script-v8.js — Lógica para la versión RELICARIO
// ================================================

let currentLang = 'es';

// OSINT_DATA moved inside TRANSLATIONS

const TRANSLATIONS = {
    es: {
        lockedTitle: "SISTEMA_BLOQUEADO",
        freqTitle: "GRABACIONES",
        logsTitle: "MENSAJES",
        camTitle: "CÁMARAS",
        docTitle: "DOCUMENTOS",
        gateWarning: "Si estás leyendo esto, algo salió mal. Yo no elegí estar en el lugar que estoy pero ahora solo puedo escapar. Esta es una forma de protegerme. Procede con cautela. No confíes en nadie. La información es peligro.",
        noData: "SIN DATOS",
        closeBtn: "[ CERRAR ]",
        enterKey: "// INGRESE CLAVE //",
        accessDenied: "ACCESO DENEGADO",
        consoleHeader: "[ OPERADOR // CONSOLA_DE_COMUNICACIONES ]",
        consolePlaceholder: "NUEVA TRANSMISIÓN...",
        ticker: "Если вы это читаете, значит, что-то пошло не так. Или все пошло не так. Я не выбирал место, где нахожусь, но теперь я могу только бежать. Это способ защитить себя. Действуйте с осторожностью. Информация — это опасность. // ",
        osint: [
            { date: '2024-09-01', source: 'CENITAL', title: 'DEROGACIÓN DNU FONDOS RESERVADOS SIDE', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' },
            { date: '2025-05-07', source: 'CELS', title: 'MONITOREO DE GRUPOS VULNERABLES: INFORME', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-grupos-vulnerables_mayo25.docx-1.pdf' },
            { date: '2025-06-03', source: 'CNN', title: 'FILTRACIÓN: INVESTIGACIÓN A PERIODISTAS', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
            { date: '2025-06-10', source: 'CENITAL', title: 'PLAN DE AVANCE SOBRE LA OPINIÓN PÚBLICA', url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinión-pública/' },
            { date: '2025-07-01', source: 'ACIJ', title: 'SISTEMA DE INTELIGENCIA: RIESGO CONSTITUCIONAL', url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
            { date: '2025-07-15', source: 'CLARÍN', title: 'REASIGNACIÓN DE $25.000M PARA LA SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
            { date: '2025-09-01', source: 'CRISIS', title: 'PLAN DE INTELIGENCIA NACIONAL: INFORME', url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
            { date: '2025-10-01', source: 'HCDN', title: 'PROYECTO 4201-D-2025: CONTROL PARLAMENTARIO', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
            { date: '2025-11-01', source: 'CHEQUEADO', title: 'SIDE: TERCERA AMPLIACIÓN PRESUPUESTARIA 2025', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
            { date: '2025-11-15', source: 'PÁGINA 12', title: 'FONDOS RESERVADOS SIDE: AUMENTO POR DECRETO', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
            { date: '2025-12-02', source: 'FILO.NEWS', title: 'AMPLIACIÓN DE FONDOS SIDE EN SILENCIO', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
            { date: '2025-12-05', source: 'BOLETÍN OFICIAL', title: 'DECRETO 864/2025: POLÍTICA DE INTELIGENCIA NACIONAL', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' }
        ]
    },
    en: {
        lockedTitle: "SYSTEM_LOCKED",
        freqTitle: "RECORDINGS",
        logsTitle: "MESSAGES",
        camTitle: "CAMERAS",
        docTitle: "DOCUMENTS",
        gateWarning: "If you are reading this, something went wrong. I did not choose to be where I am but now I can only escape. This is a way to protect myself. Proceed with caution. Trust no one. Information is danger.",
        noData: "NO DATA",
        closeBtn: "[ CLOSE ]",
        enterKey: "// ENTER KEY //",
        accessDenied: "ACCESS DENIED",
        consoleHeader: "[ OPERATOR // COMMUNICATIONS_CONSOLE ]",
        consolePlaceholder: "NEW TRANSMISSION...",
        ticker: "If you are reading this, something went wrong. Or everything went wrong. I did not choose to be where I am, but now I can only escape. This is a way to protect myself. Proceed with caution. Information is danger. // ",
        osint: [
            { date: '2024-09-01', source: 'CENITAL', title: 'REPEAL OF DNU SIDE RESERVED FUNDS', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' },
            { date: '2025-05-07', source: 'CELS', title: 'MONITORING OF VULNERABLE GROUPS: REPORT', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-groups-vulnerables_mayo25.docx-1.pdf' },
            { date: '2025-06-03', source: 'CNN', title: 'LEAK: INVESTIGATION OF JOURNALISTS', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
            { date: '2025-06-10', source: 'CENITAL', title: 'PLAN TO ADVANCE ON PUBLIC OPINION', url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinión-pública/' },
            { date: '2025-07-01', source: 'ACIJ', title: 'INTELLIGENCE SYSTEM: CONSTITUTIONAL RISK', url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
            { date: '2025-07-15', source: 'CLARÍN', title: 'REALLOCATION OF $25BN FOR SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
            { date: '2025-09-01', source: 'CRISIS', title: 'NATIONAL INTELLIGENCE PLAN: REPORT', url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
            { date: '2025-10-01', source: 'HCDN', title: 'BILL 4201-D-2025: PARLIAMENTARY CONTROL', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
            { date: '2025-11-01', source: 'CHEQUEADO', title: 'SIDE: THIRD BUDGET EXPANSION 2025', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
            { date: '2025-11-15', source: 'PÁGINA 12', title: 'SIDE RESERVED FUNDS: INCREASE BY DECREE', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
            { date: '2025-12-02', source: 'FILO.NEWS', title: 'SILENT EXPANSION OF SIDE FUNDS', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
            { date: '2025-12-05', source: 'OFFICIAL GAZETTE', title: 'DECREE 864/2025: NATIONAL INTELLIGENCE POLICY', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' }
        ]
    },
    fr: {
        lockedTitle: "SYSTÈME_BLOQUÉ",
        freqTitle: "ENREGISTREMENTS",
        logsTitle: "MESSAGES",
        camTitle: "CAMÉRAS",
        docTitle: "DOCUMENTS",
        gateWarning: "Si vous lisez ceci, quelque chose s'est mal passé. Je n'ai pas choisi d'être là où je suis mais maintenant je ne peux que m'échapper. C'est une façon de me protéger. Procédez avec caution. Ne faites confiance à personne. L'information est danger.",
        noData: "PAS DE DONNÉES",
        closeBtn: "[ FERMER ]",
        enterKey: "// ENTRER LA CLÉ //",
        accessDenied: "ACCÈS REFUSÉ",
        consoleHeader: "[ OPÉRATEUR // CONSOLE_DE_COMMUNICATIONS ]",
        consolePlaceholder: "NOUVELLE TRANSMISSION...",
        ticker: "Si vous lisez ceci, quelque chose s'est mal passé. Ou tout s'est mal passé. Je n'ai pas choisi d'être là où je suis, mais maintenant je ne peux que m'échapper. C'est une façon de me protéger. Procédez avec caution. L'information est danger. // ",
        osint: [
            { date: '2024-09-01', source: 'CENITAL', title: 'ABROGATION DU DNU FONDS RÉSERVÉS SIDE', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' },
            { date: '2025-05-07', source: 'CELS', title: 'SURVEILLANCE DES GROUPES VULNÉRABLES : RAPPORT', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-groups-vulnerables_mayo25.docx-1.pdf' },
            { date: '2025-06-03', source: 'CNN', title: 'FUITE : ENQUÊTE SUR LES JOURNALISTES', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
            { date: '2025-06-10', source: 'CENITAL', title: "PLAN D'AVANCEMENT SUR L'OPINION PUBLIQUE", url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinión-pública/' },
            { date: '2025-07-01', source: 'ACIJ', title: "SYSTÈME D'INTELLIGENCE : RISQUE CONSTITUTIONNEL", url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
            { date: '2025-07-15', source: 'CLARÍN', title: 'RÉALLOCATION DE 25 MILLIARDS $ POUR LA SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
            { date: '2025-09-01', source: 'CRISIS', title: "PLAN D'INTELLIGENCE NATIONAL : RAPPORT", url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
            { date: '2025-10-01', source: 'HCDN', title: 'PROJET 4201-D-2025 : CONTRÔLE PARLEMENTAIRE', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
            { date: '2025-11-01', source: 'CHEQUEADO', title: 'SIDE : TROISIÈME AGRANDISSEMENT BUDGÉTAIRE 2025', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
            { date: '2025-11-15', source: 'PÁGINA 12', title: 'FONDS RÉSERVÉS SIDE : AUGMENTATION PAR DÉCRET', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
            { date: '2025-12-02', source: 'FILO.NEWS', title: 'EXPANSION SILENCIEUSE DES FONDS SIDE', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
            { date: '2025-12-05', source: 'JOURNAL OFFICIEL', title: 'DÉCRET 864/2025 : POLITIQUE D\'INTELLIGENCE NATIONALE', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' }
        ]
    },
    it: {
        lockedTitle: "SISTEMA_BLOCCATO",
        freqTitle: "REGISTRAZIONI",
        logsTitle: "MESSAGGI",
        camTitle: "TELECAMERE",
        docTitle: "DOCUMENTI",
        gateWarning: "Se stai leggendo questo, qualcosa è andato storto. Non ho scelto di essere dove sono ma ora posso solo scappare. Questo è un modo per proteggermi. Procedere con cautela. Non fidarti di nessuno. L'informazione è pericolo.",
        noData: "NESSUN DATO",
        closeBtn: "[ CHIUDI ]",
        enterKey: "// INSERIRE CHIAVE //",
        accessDenied: "ACCESSO NEGATO",
        consoleHeader: "[ OPERATORE // CONSOLE_DI_COMUNICAZIONE ]",
        consolePlaceholder: "NUOVA TRASMISSIONE...",
        ticker: "Se stai leggendo questo, qualcosa è andato storto. O tutto è andato storto. Non ho scelto di essere dove sono, ma ora posso solo scappare. Questo è un modo per proteggermi. Procedere con cautela. L'informazione è pericolo. // ",
        osint: [
            { date: '2024-09-01', source: 'CENITAL', title: 'ABROGAZIONE DNU FONDI RISERVATI SIDE', url: 'https://cenital.com/senado-se-derogo-el-dnu-de-fondos-reservados-para-la-side/' },
            { date: '2025-05-07', source: 'CELS', title: 'MONITORAGGIO DEI GRUPPI VULNERABILI: RAPPORTO', url: 'https://www.cels.org.ar/web/wp-content/uploads/2025/05/ICSI-Plan-de-Inteligencia-Nacional-y-directiva-para-monitoreo-de-groups-vulnerables_mayo25.docx-1.pdf' },
            { date: '2025-06-03', source: 'CNN', title: 'FUGA DI NOTIZIE: INDAGINE SUI GIORNALISTI', url: 'https://cnnespanol.cnn.com/2025/06/03/argentina/filtran-supuesto-plan-argentina-investigar-periodistas-politicos-orix' },
            { date: '2025-06-10', source: 'CENITAL', title: "PIANO DI AVANZAMENTO SULL'OPINIONE PUBBLICA", url: 'https://cenital.com/alconada-mon-hay-un-plan-muy-bien-armado-para-tratar-de-avanzar-sobre-la-opinión-pública/' },
            { date: '2025-07-01', source: 'ACIJ', title: 'SISTEMA DI INTELLIGENCE: RISCHIO COSTITUZIONALE', url: 'https://acij.org.ar/reforma-del-sistema-de-inteligencia-una-norma-que-pone-en-riesgo-garantias-constitucionales-basicas/' },
            { date: '2025-07-15', source: 'CLARÍN', title: 'RIALLOCAZIONE DI 25 MILIARDI $ PER LA SIDE', url: 'https://www.clarin.com/politica/reasignan-25000-millones-side-tercio-fondos-destinara-gastos-reservados_0_ucp6M2LaPC.html' },
            { date: '2025-09-01', source: 'CRISIS', title: 'PIANO DI INTELLIGENCE NAZIONALE: RAPPORTO', url: 'https://informes.revistacrisis.com.ar/controlar-al-pueblo-para-entregar-la-patria/' },
            { date: '2025-10-01', source: 'HCDN', title: 'PROGETTO 4201-D-2025: CONTROLLO PARLAMENTARE', url: 'https://www4.hcdn.gob.ar/dependencias/dsecretaria/Periodo2025/PDF2025/TP2025/4201-D-2025.pdf' },
            { date: '2025-11-01', source: 'CHEQUEADO', title: 'SIDE: TERZA ESPANSIONE DEL BUDGET 2025', url: 'https://chequeado.com/el-explicador/los-fondos-reservados-de-la-secretaria-de-inteligencia-el-gobierno-de-milei-los-amplio-por-tercera-vez/' },
            { date: '2025-11-15', source: 'PÁGINA 12', title: 'FONDI RISERVATI SIDE: AUMENTO PER DECRETO', url: 'https://www.pagina12.com.ar/810621-el-gobierno-aumento-los-fondos-reservados-para-la-side-por-d/' },
            { date: '2025-12-02', source: 'FILO.NEWS', title: 'ESPANSIONE SILENZIOSA DEI FONDI SIDE', url: 'https://www.filo.news/noticia/2025/12/02/el-gobierno-amplia-fondos-a-la-side-en-silencio-y-en-medio-de-internas' },
            { date: '2025-12-05', source: 'GAZZETTA UFFICIALE', title: 'DECRETO 864/2025: POLITICA DI INTELLIGENCE NAZIONALE', url: 'https://www.boletinoficial.gob.ar/detalleAviso/primera/335597/20251205' }
        ]
    }
};

const FREQS = [
    { name: 'VOID_0X1_INTEL', id: 'audio1', src: 'assets/11729__wwwbonsonca__telephone_interference_01.wav' },
    { name: 'ECHO_0X2_RESONANCE', id: 'audio2', src: 'assets/Woodpecker.ogg' },
    { name: 'SPECTRE_0X3_CIPHER', id: 'audio3', src: 'assets/CLAVE-EN-MORSE.mp3' },
    { name: 'SYSTEM_0X4_DECAY', id: 'audio4', src: 'assets/CLAVE-EN-RUSO-pt1.mp3' }
];

function updateClock() {
    const now = new Date();
    document.getElementById('live-clock').textContent = now.toLocaleTimeString('es-AR', { hour12: false });
}
setInterval(updateClock, 1000);
updateClock();

function renderOsint(lang) {
    const osintFeed = document.getElementById('osint-feed');
    if (!osintFeed) return;
    const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
    osintFeed.innerHTML = t.osint.map(a => `
        <a href="${a.url}" target="_blank" class="osint-item">
            <div class="osint-meta">>> ${a.source} // ${a.date}</div>
            <div class="osint-title">${a.title}</div>
        </a>
    `).join('');
}

function initV8() {
    renderOsint(currentLang);

    const freqList = document.getElementById('freq-list');
    if (freqList) {
        freqList.innerHTML = FREQS.map(f => `
            <div class="freq-item">
                <div class="freq-name">${f.name}</div>
                <div class="freq-controls">
                    <span class="freq-btn" onclick="playAudio('${f.id}')">[ PLAY ]</span>
                    <span class="freq-btn" onclick="stopAudio('${f.id}')">[ STOP ]</span>
                </div>
                <audio id="${f.id}" src="${f.src}"></audio>
            </div>
        `).join('');
    }
    
    renderTransmissions();
}

function switchTab(idx) {
    const cols = document.querySelectorAll('.side-col, .main-col');
    const btns = document.querySelectorAll('.m-nav-btn');
    
    cols.forEach(c => c.classList.remove('tab-active'));
    btns.forEach(b => b.classList.remove('active'));
    
    if (cols[idx]) cols[idx].classList.add('tab-active');
    if (btns[idx]) btns[idx].classList.add('active');
}

function playAudio(id) {
    const target = document.getElementById(id);
    if (target && target.paused) target.play();
}

function stopAudio(id) {
    const target = document.getElementById(id);
    if (target) {
        target.pause();
        target.currentTime = 0;
    }
}

function renderTransmissions() {
    const raw = localStorage.getItem('argl34k_transmissions');
    const list = raw ? JSON.parse(raw) : [];
    const container = document.getElementById('transmissions-list');
    if (!container) return;
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
    container.innerHTML = list.length === 0 ? `<p style="color:#333; font-size:0.8rem;">${t.noData}</p>` : 
        list.map(m => `
            <div class="log-entry">
                <span class="log-ts">[${m.timestamp || '--:--'}]</span>
                <span class="log-msg">${m.text}</span>
            </div>
        `).join('');
}

function openOperatorGate() {
    document.getElementById('operator-gate').classList.remove('hidden');
    document.getElementById('op-pass').focus();
}

function validateOperator() {
    const pass = document.getElementById('op-pass').value.trim().toLowerCase();
    const error = document.getElementById('op-error');
    if (pass === 'scott') {
        document.getElementById('operator-gate').classList.add('hidden');
        document.getElementById('operator-console').classList.remove('hidden');
        document.getElementById('op-msg').focus();
        error.classList.add('hidden');
        renderOperatorHistory();
    } else {
        error.classList.remove('hidden');
        document.getElementById('op-pass').value = '';
    }
}

function closeOperator() {
    document.getElementById('operator-gate').classList.add('hidden');
    document.getElementById('operator-console').classList.add('hidden');
}

function broadcastMessage() {
    const msgInput = document.getElementById('op-msg');
    const msg = msgInput.value.trim();
    if (!msg) return;

    const raw = localStorage.getItem('argl34k_transmissions');
    const list = raw ? JSON.parse(raw) : [];
    const now = new Date();
    const ts = now.toLocaleTimeString('es-AR', { hour12: false });
    
    list.unshift({ timestamp: ts, text: msg });
    localStorage.setItem('argl34k_transmissions', JSON.stringify(list));
    
    msgInput.value = '';
    renderOperatorHistory();
    renderTransmissions();
}

function renderOperatorHistory() {
    const raw = localStorage.getItem('argl34k_transmissions');
    const list = raw ? JSON.parse(raw) : [];
    const container = document.getElementById('op-history-list');
    if (!container) return;

    container.innerHTML = list.map((m, idx) => `
        <div class="op-history-item">
            <div class="op-history-text">
                <span style="color:var(--red-bright)">[${m.timestamp}]</span> ${m.text}
            </div>
            <div class="op-history-del" onclick="deleteOperatorMessage(${idx})">[ ELIMINAR ]</div>
        </div>
    `).join('');
}

function deleteOperatorMessage(idx) {
    const raw = localStorage.getItem('argl34k_transmissions');
    let list = raw ? JSON.parse(raw) : [];
    list.splice(idx, 1);
    localStorage.setItem('argl34k_transmissions', JSON.stringify(list));
    renderOperatorHistory();
    renderTransmissions();
}

function closeStealthConsole() {
    document.getElementById('stealth-modal').classList.add('hidden');
}

function renderConsoleHistory() {
    const raw = localStorage.getItem('argl34k_transmissions');
    const list = raw ? JSON.parse(raw) : [];
    const body = document.getElementById('console-history');
    if (!body) return;
    body.innerHTML = list.map((m, idx) => `
        <div class="console-msg">
            <div class="msg-text">
                <span class="log-ts">[${m.timestamp || '--:--'}]</span>
                <span class="log-msg">${m.text}</span>
            </div>
            <div class="msg-del" onclick="deleteTransmission(${idx})">[ DEL ]</div>
        </div>
    `).join('');
    body.scrollTop = 0;
}

function deleteTransmission(idx) {
    const raw = localStorage.getItem('argl34k_transmissions');
    let list = raw ? JSON.parse(raw) : [];
    list.splice(idx, 1);
    localStorage.setItem('argl34k_transmissions', JSON.stringify(list));
    renderConsoleHistory();
    renderTransmissions();
}

function clearAllTransmissions() {
    const t = TRANSLATIONS[currentLang] || TRANSLATIONS.es;
    if (confirm('>> ¿ELIMINAR TODOS LOS REGISTROS? <<')) {
        localStorage.removeItem('argl34k_transmissions');
        renderConsoleHistory();
        renderTransmissions();
    }
}

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

function formatGateInput(e) {
    let val = e.target.value.toUpperCase().replace(/[^A-Z]/g, '');
    let formatted = '';
    if (val.length > 0) formatted += val.substring(0, 2);
    if (val.length > 2) formatted += ' - ' + val.substring(2, 4);
    if (val.length > 4) formatted += ' - ' + val.substring(4, 6);
    e.target.value = formatted.substring(0, 12);
}

function validateAccess() {
    const input = document.getElementById('gate-pass');
    const error = document.getElementById('access-error');
    const val = input.value.trim().toUpperCase();

    if (val === 'RN - NU - KS' || val === 'RNNUKS' || val === 'RN-NU-KS') {
        document.getElementById('integrated-gate').classList.add('hidden');
        document.getElementById('main-content').classList.remove('hidden');
        document.querySelector('.panoramic-layout').classList.remove('is-locked');
        window.scrollTo(0,0);
    } else {
        error.classList.remove('hidden');
        setTimeout(() => error.classList.add('hidden'), 3000);
    }
}

function changeLanguage(lang) {
    currentLang = lang;
    const t = TRANSLATIONS[lang];
    if (!t) return;

    const lockedLabel = document.getElementById('locked-label');
    if (lockedLabel) lockedLabel.textContent = t.lockedTitle;

    const gateMsg = document.getElementById('gate-msg');
    if (gateMsg) gateMsg.textContent = t.gateWarning;

    const freqLabel = document.getElementById('freq-label');
    if (freqLabel) freqLabel.textContent = t.freqTitle;
    
    const logsLabel = document.getElementById('logs-label');
    if (logsLabel) logsLabel.textContent = t.logsTitle;

    const camLabel = document.getElementById('cam-label');
    if (camLabel) camLabel.textContent = t.camTitle;

    const docLabel = document.getElementById('doc-label');
    if (docLabel) docLabel.textContent = t.docTitle;

    // MOBILE TABS
    const mBtnFreq = document.getElementById('m-btn-freq');
    if (mBtnFreq) mBtnFreq.textContent = t.freqTitle;
    const mBtnCam = document.getElementById('m-btn-cam');
    if (mBtnCam) mBtnCam.textContent = t.camTitle;
    const mBtnDoc = document.getElementById('m-btn-doc');
    if (mBtnDoc) mBtnDoc.textContent = t.docTitle;
    const mBtnLogs = document.getElementById('m-btn-logs');
    if (mBtnLogs) mBtnLogs.textContent = t.logsTitle;

    const closeBtn = document.querySelector('.lb-close');
    if (closeBtn) closeBtn.textContent = t.closeBtn;

    const enterKeyLabel = document.getElementById('enter-key-label');
    if (enterKeyLabel) enterKeyLabel.textContent = t.enterKey;

    const gateError = document.getElementById('gate-error');
    if (gateError) gateError.textContent = t.accessDenied;

    const consoleHeader = document.getElementById('console-header');
    if (consoleHeader) consoleHeader.textContent = t.consoleHeader;

    const consoleInput = document.getElementById('console-input');
    if (consoleInput) consoleInput.placeholder = t.consolePlaceholder;

    renderTransmissions();
    renderOsint(lang);
    if (!document.getElementById('stealth-modal').classList.contains('hidden')) {
        renderConsoleHistory();
    }

    const ticker = document.querySelector('.ticker-track');
    if (ticker) {
        // El ticker siempre se mantiene en Ruso por requerimiento narrativo
        const russianText = "Если вы это читаете, значит, что-то пошло не так. Или все пошло не так. Я не выбирал место, где нахожусь, но теперь я могу только бежать. Это способ защитить себя. Действуйте с осторожностью. Информация — это опасность. // ";
        ticker.textContent = russianText.repeat(2);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initV8();
    const langSelector = document.getElementById('lang-selector');
    if (langSelector) {
        langSelector.addEventListener('change', (e) => {
            changeLanguage(e.target.value);
        });
    }

    const consoleInput = document.getElementById('console-input');
    if (consoleInput) {
        consoleInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const msg = e.target.value.trim();
                if (msg) {
                    const raw = localStorage.getItem('argl34k_transmissions');
                    const list = raw ? JSON.parse(raw) : [];
                    const now = new Date();
                    const ts = now.toLocaleTimeString('es-AR', { hour12: false });
                    list.unshift({ timestamp: ts, text: msg });
                    localStorage.setItem('argl34k_transmissions', JSON.stringify(list));
                    e.target.value = '';
                    renderConsoleHistory();
                    renderTransmissions();
                }
            }
        });
    }

    const gatePass = document.getElementById('gate-pass');
    if (gatePass) {
        gatePass.addEventListener('input', formatGateInput);
        setTimeout(() => gatePass.focus(), 500);
    }
    document.addEventListener('keydown', (e) => {
        // Ctrl + Shift + X -> Operator Console
        if (e.ctrlKey && e.shiftKey && (e.key === 'X' || e.key === 'x')) {
            e.preventDefault();
            openOperatorGate();
        }
        // ESC -> Close everything
        if (e.key === 'Escape') {
            closeOperator();
            const lb = document.getElementById('lightbox');
            if (lb) lb.classList.add('hidden');
        }
        // Ctrl + Enter -> Broadcast when console is open
        if (e.ctrlKey && e.key === 'Enter') {
            const console = document.getElementById('operator-console');
            if (!console.classList.contains('hidden')) {
                broadcastMessage();
            }
        }
    });
});
