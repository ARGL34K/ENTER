// ================================================
//  script-v2.js — Lógica exclusiva de la v2
//  (Clock, Camera Static, Scan Bar)
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
        date: '2024-07-25',
        source: 'INFOBAE',
        rel: 'critico',
        title: 'El Gobierno disolvió la AFI y creó la nueva SIDE: cuáles son sus cuatro agencias',
        url: 'https://www.infobae.com/politica/2024/07/25/el-gobierno-disolvio-la-afi-y-creo-la-nueva-side-cuales-son-sus-cuatro-agencias/'
    },
    {
        cat: 'espionaje',
        date: '2024-05-28',
        source: 'LA NACIÓN',
        rel: 'critico',
        title: 'Renunció el interventor de la AFI Silvestre Sívori tras la salida de Nicolás Posse',
        url: 'https://www.lanacion.com.ar/politica/renuncia-del-interventor-de-la-afi-silvestre-sivori-tras-la-salida-de-nicolas-posse-nid28052024/'
    },
    {
        cat: 'espionaje',
        date: '2024-03-11',
        source: 'LA NACIÓN',
        rel: 'critico',
        title: 'Alconada Mon reveló el Plan de Inteligencia Nacional de la SIDE: podría habilitar vigilancia interna',
        url: 'https://www.lanacion.com.ar/politica/alconada-mon-revelo-el-plan-de-inteligencia-nacional-de-la-side-podria-habilitar-vigilancia-interna-nid11032024/'
    },
    {
        cat: 'espionaje',
        date: '2024-02-01',
        source: 'CENITAL',
        rel: 'alto',
        title: 'El nuevo Plan de Inteligencia Nacional: ambigüedades que habilitan la vigilancia de periodistas y opositores',
        url: 'https://www.cenital.com/el-nuevo-plan-de-inteligencia-nacional/'
    },
    {
        cat: 'espionaje',
        date: '2023-09-14',
        source: 'INFOBAE',
        rel: 'alto',
        title: 'El espía del GRU ruso que usó documentación argentina para operar en Europa entre 2013 y 2018',
        url: 'https://www.infobae.com/america/mundo/2023/09/14/el-espia-del-gru-ruso-que-uso-documentacion-argentina-para-operar-en-europa/'
    },
    {
        cat: 'espionaje',
        date: '2024-04-03',
        source: 'INFOBAE',
        rel: 'critico',
        title: 'Dos espías rusos vivían en Argentina con identidades falsas: uno fue expulsado',
        url: 'https://www.infobae.com/politica/2024/04/03/dos-espias-rusos-vivian-en-argentina-con-identidades-falsas-uno-fue-expulsado/'
    },
    {
        cat: 'espionaje',
        date: '2024-04-04',
        source: 'CLARÍN',
        rel: 'critico',
        title: 'Espías rusos en Argentina: Adorni confirmó que uno fue expulsado del país',
        url: 'https://www.clarin.com/politica/espias-rusos-argentina-adorni-confirmo-uno-expulsado-pais_0_v8GOzELrE2.html'
    },
    {
        cat: 'espionaje',
        date: '2020-06-15',
        source: 'LA NACIÓN',
        rel: 'alto',
        title: 'El espionaje ilegal de la AFI a Alconada Mon: lo llamaban "Anaconda" y vigilaban a sus padres',
        url: 'https://www.lanacion.com.ar/politica/la-afi-espio-al-periodista-alconada-mon-lo-llamaban-nid2378614/'
    },
    {
        cat: 'espionaje',
        date: '2023-12-14',
        source: 'CRONISTA',
        rel: 'medio',
        title: 'Silvestre Sívori, el nuevo interventor de la AFI: quién es el abogado elegido por Milei',
        url: 'https://www.cronista.com/economia-politica/silvestre-sivori-el-nuevo-interventor-de-la-afi-quien-es-el-abogado-elegido-por-milei/'
    },

    // ---- VIGILANCIA ----
    {
        cat: 'vigilancia',
        date: '2024-07-01',
        source: 'PERFIL',
        rel: 'alto',
        title: 'La nueva SIDE: fondos reservados sin control parlamentario y cuatro agencias independientes',
        url: 'https://www.perfil.com/noticias/politica/la-nueva-side-fondos-reservados-sin-control-parlamentario.phtml'
    },
    {
        cat: 'vigilancia',
        date: '2023-11-08',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'El sistema de cámaras de vigilancia del GCBA: 13.000 cámaras y reconocimiento facial en tiempo real',
        url: 'https://www.infobae.com/sociedad/2023/11/08/el-sistema-de-camaras-de-vigilancia-del-gcba-13000-camaras-y-reconocimiento-facial-en-tiempo-real/'
    },
    {
        cat: 'vigilancia',
        date: '2024-01-17',
        source: 'LA NACIÓN',
        rel: 'alto',
        title: 'Alarma en la terraza del Congreso por un drone no identificado: intervino la Policía Federal',
        url: 'https://www.lanacion.com.ar/politica/alarma-en-la-terraza-del-congreso-por-un-drone-no-identificado-nid17012024/'
    },
    {
        cat: 'vigilancia',
        date: '2023-04-22',
        source: 'PÁGINA 12',
        rel: 'alto',
        title: 'Escuchas ilegales en la AFI: cómo funciona la "mesa judicial" que espiaba sin orden judicial',
        url: 'https://www.pagina12.com.ar/558312-escuchas-ilegales-en-la-afi-como-funciona-la-mesa-judicial'
    },
    {
        cat: 'vigilancia',
        date: '2024-08-12',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'Buenos Aires Herald: cómo el Gobierno usa la nueva SIDE para monitorear redes sociales y disidencia',
        url: 'https://www.buenosairesherald.com/argentina/politics/how-the-government-uses-the-new-side-to-monitor-social-media'
    },
    {
        cat: 'vigilancia',
        date: '2022-09-30',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'Argentina instalará un sistema de reconocimiento facial en aeropuertos y terminales de ómnibus',
        url: 'https://www.infobae.com/sociedad/2022/09/30/argentina-instalara-un-sistema-de-reconocimiento-facial-en-aeropuertos-y-terminales-de-omnibus/'
    },

    // ---- ZONA OPS ----
    {
        cat: 'zona',
        date: '2024-06-10',
        source: 'CLARÍN',
        rel: 'medio',
        title: 'Congreso porteño: el barrio que cambió y el peso de vivir a la sombra del poder político',
        url: 'https://www.clarin.com/ciudades/congreso-porteno-barrio-cambio-peso-vivir-sombra-poder-politico_0_yVmKEbdq2A.html'
    },
    {
        cat: 'zona',
        date: '2023-07-18',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'Departamentos en Congreso: el auge de los alquileres temporarios y el mercado que no para',
        url: 'https://www.infobae.com/economia/2023/07/18/departamentos-en-congreso-el-auge-de-los-alquileres-temporarios/'
    },
    {
        cat: 'zona',
        date: '2024-03-05',
        source: 'LA NACIÓN',
        rel: 'alto',
        title: 'Fondos reservados: cómo se gastaron sin control 50 mil millones de pesos en la AFI desde 2016',
        url: 'https://www.lanacion.com.ar/politica/fondos-reservados-como-se-gastaron-sin-control-en-la-afi-nid05032024/'
    },
    {
        cat: 'zona',
        date: '2024-09-03',
        source: 'EL DESTAPE',
        rel: 'alto',
        title: 'La SIDE de Milei y los fondos reservados: sin auditorías, sin presupuesto público, sin rendición de cuentas',
        url: 'https://www.eldestapeweb.com/politica/la-side-de-milei-y-los-fondos-reservados-sin-auditorias-nid04092024'
    },
    {
        cat: 'zona',
        date: '2023-10-22',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'Los servicios de inteligencia extranjeros en Argentina: cuántos operan y cómo lo hacen',
        url: 'https://www.infobae.com/politica/2023/10/22/los-servicios-de-inteligencia-extranjeros-en-argentina-cuantos-operan-y-como-lo-hacen/'
    },

    // ---- RUTA ESCAPE ----
    {
        cat: 'ruta',
        date: '2024-02-14',
        source: 'CLARÍN',
        rel: 'alto',
        title: 'Armada uruguaya persiguió una embarcación sospechosa que escapó hacia aguas argentinas por el Río de la Plata',
        url: 'https://www.clarin.com/policiales/armada-uruguaya-persiguio-embarcacion-sospechosa-escapo-aguas-argentinas-rio-plata_0_zGvz6BO4A9.html'
    },
    {
        cat: 'ruta',
        date: '2023-05-10',
        source: 'LA NACIÓN',
        rel: 'medio',
        title: 'Control de pasajeros Buenos Aires–Colonia: el nuevo sistema unificado de migraciones en los puertos',
        url: 'https://www.lanacion.com.ar/sociedad/control-de-pasajeros-buenos-aires-colonia-el-nuevo-sistema-unificado-nid10052023/'
    },
    {
        cat: 'ruta',
        date: '2023-09-14',
        source: 'CARMELO PORTAL',
        rel: 'critico',
        title: 'El agente del GRU ruso cruzó por Colonia del Sacramento repetidamente entre 2013 y 2018 con DNI argentino',
        url: 'https://carmeloportal.com/el-agente-del-gru-ruso-cruzo-por-colonia-del-sacramento-con-dni-argentino/'
    },
    {
        cat: 'ruta',
        date: '2024-05-08',
        source: 'INFOBAE',
        rel: 'medio',
        title: 'El puerto de Buenos Aires y el cruce a Uruguay: los controles migratorios que nadie controla bien',
        url: 'https://www.infobae.com/sociedad/2024/05/08/el-puerto-de-buenos-aires-y-el-cruce-a-uruguay-los-controles-migratorios/'
    },
    {
        cat: 'ruta',
        date: '2023-12-01',
        source: 'EL PAÍS UY',
        rel: 'medio',
        title: 'Colonia del Sacramento y el turismo portuario: la ciudad donde llegan 3 millones de personas al año',
        url: 'https://www.elpais.com.uy/informacion/turismo/colonia-del-sacramento-turismo-portuario-3-millones-personas'
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
