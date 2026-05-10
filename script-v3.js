/* ================================================
   UCi-ARG v3 — SCRIPT IMAGEBOARD THREAD
   ================================================ */

// ---- GATE ----
function checkGV3() {
    const raw = document.getElementById('gv3').value.trim().toLowerCase()
        .replace(/\s+/g, '')
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const err = document.getElementById('gerr-v3');
    if (raw === 'rnnuks') {
        document.getElementById('gate-v3').classList.add('hidden');
        document.getElementById('main-v3').classList.remove('hidden');
        initV3();
    } else {
        err.classList.remove('hidden');
        document.getElementById('gv3').value = '';
        setTimeout(() => err.classList.add('hidden'), 3000);
    }
}

// ---- INIT ----
function initV3() {
    startClockV3();
    renderTransV3();
    renderOsintV3('all');
    initStaticCanvasV3();
}

// ---- TOGGLE COLLAPSE ----
function togglePost(header) {
    header.closest('.post').classList.toggle('expanded');
}

// ---- STATIC CANVAS (CAM 03) ----
function initStaticCanvasV3() {
    const canvas = document.getElementById('v3-static-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const resize = () => {
        canvas.width  = canvas.offsetWidth  || 210;
        canvas.height = canvas.offsetHeight || 210;
    };
    resize();
    window.addEventListener('resize', resize);
    const draw = () => {
        const { width: w, height: h } = canvas;
        const img = ctx.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 255 | 0;
            img.data[i]   = v;
            img.data[i+1] = v;
            img.data[i+2] = v;
            img.data[i+3] = 255;
        }
        ctx.putImageData(img, 0, 0);
        // scanline overlay
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        for (let y = 0; y < h; y += 3) {
            ctx.fillRect(0, y, w, 1);
        }
        requestAnimationFrame(draw);
    };
    draw();
}

// ---- CLOCK ----
function startClockV3() {
    const el = document.getElementById('clock-v3');
    const tick = () => {
        if (!el) return;
        const n = new Date();
        const pad = x => String(x).padStart(2,'0');
        el.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
    };
    tick(); setInterval(tick, 1000);
}

// ---- AUDIO ----
let curAudioV3 = null;
function playV3(id) {
    if (curAudioV3 && curAudioV3 !== id) {
        const p = document.getElementById(curAudioV3);
        if (p) { p.pause(); p.currentTime = 0; }
    }
    const a = document.getElementById(id);
    if (!a) return;
    if (a.paused) { a.play(); curAudioV3 = id; }
    else { a.pause(); a.currentTime = 0; curAudioV3 = null; }
}

// ---- PW MODAL ----
function togglePwV3() {
    const m = document.getElementById('pw-v3');
    m.classList.toggle('hidden');
    if (!m.classList.contains('hidden')) document.getElementById('pwi-v3').focus();
}

function checkPwV3() {
    const val = document.getElementById('pwi-v3').value.trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const err = document.getElementById('pwe-v3');
    if (val === 'moscu') {
        document.getElementById('pw-v3').classList.add('hidden');
        playV3('pav4');
    } else {
        err.classList.remove('hidden');
        document.getElementById('pwi-v3').value = '';
        setTimeout(() => err.classList.add('hidden'), 2500);
    }
}

// ---- TRANSMISSIONS ----
function renderTransV3() {
    const el = document.getElementById('trans-v3');
    if (!el) return;
    const stored = JSON.parse(localStorage.getItem('argl34k_transmissions') || '[]');
    if (!stored.length) return;
    el.innerHTML = stored.map(t => `
        <div class="trans-v3-item">
            <div class="trans-v3-ts">${t.date || ''}</div>
            <div class="trans-v3-txt">${t.text || ''}</div>
        </div>
    `).join('');
}

// ---- OSINT ----
const ARTS = [
    { cat:'espionaje', date:'2024-07-25', src:'INFOBAE', rel:'critico',
      title:'El Gobierno disolvió la AFI y creó la nueva SIDE: sus cuatro agencias',
      url:'https://www.infobae.com/politica/2024/07/25/el-gobierno-disolvio-la-afi-y-creo-la-nueva-side-cuales-son-sus-cuatro-agencias/' },
    { cat:'espionaje', date:'2024-05-28', src:'LA NACIÓN', rel:'critico',
      title:'Renunció el interventor de la AFI Sívori tras la salida de Nicolás Posse',
      url:'https://www.lanacion.com.ar/politica/renuncia-del-interventor-de-la-afi-silvestre-sivori-tras-la-salida-de-nicolas-posse-nid28052024/' },
    { cat:'espionaje', date:'2024-03-11', src:'LA NACIÓN', rel:'critico',
      title:'Alconada Mon reveló el Plan de Inteligencia de la SIDE: podría habilitar vigilancia interna',
      url:'https://www.lanacion.com.ar/politica/alconada-mon-revelo-el-plan-de-inteligencia-nacional-de-la-side-podria-habilitar-vigilancia-interna-nid11032024/' },
    { cat:'espionaje', date:'2024-04-04', src:'CLARÍN', rel:'critico',
      title:'Espías rusos en Argentina: uno fue expulsado del país (Adorni confirmó)',
      url:'https://www.clarin.com/politica/espias-rusos-argentina-adorni-confirmo-uno-expulsado-pais_0_v8GOzELrE2.html' },
    { cat:'espionaje', date:'2024-04-03', src:'INFOBAE', rel:'critico',
      title:'Dos espías rusos vivían en Argentina con identidades falsas',
      url:'https://www.infobae.com/politica/2024/04/03/dos-espias-rusos-vivian-en-argentina-con-identidades-falsas-uno-fue-expulsado/' },
    { cat:'espionaje', date:'2023-09-14', src:'INFOBAE', rel:'alto',
      title:'El espía del GRU ruso que usó documentación argentina para operar en Europa (2013–2018)',
      url:'https://www.infobae.com/america/mundo/2023/09/14/el-espia-del-gru-ruso-que-uso-documentacion-argentina-para-operar-en-europa/' },
    { cat:'espionaje', date:'2020-06-15', src:'LA NACIÓN', rel:'alto',
      title:'La AFI espiaba a Alconada Mon: lo llamaban "Anaconda" y vigilaban a sus padres',
      url:'https://www.lanacion.com.ar/politica/la-afi-espio-al-periodista-alconada-mon-lo-llamaban-nid2378614/' },
    { cat:'espionaje', date:'2024-02-01', src:'CENITAL', rel:'alto',
      title:'El PIN: ambigüedades que habilitan la vigilancia de periodistas y opositores',
      url:'https://www.cenital.com/el-nuevo-plan-de-inteligencia-nacional/' },
    { cat:'vigilancia', date:'2024-07-01', src:'PERFIL', rel:'alto',
      title:'La nueva SIDE: fondos reservados sin control parlamentario',
      url:'https://www.perfil.com/noticias/politica/la-nueva-side-fondos-reservados-sin-control-parlamentario.phtml' },
    { cat:'vigilancia', date:'2024-01-17', src:'LA NACIÓN', rel:'alto',
      title:'Alarma en la terraza del Congreso por un drone no identificado',
      url:'https://www.lanacion.com.ar/politica/alarma-en-la-terraza-del-congreso-por-un-drone-no-identificado-nid17012024/' },
    { cat:'vigilancia', date:'2023-04-22', src:'PÁGINA 12', rel:'alto',
      title:'Escuchas ilegales en la AFI: cómo funciona la "mesa judicial"',
      url:'https://www.pagina12.com.ar/558312-escuchas-ilegales-en-la-afi-como-funciona-la-mesa-judicial' },
    { cat:'vigilancia', date:'2023-11-08', src:'INFOBAE', rel:'medio',
      title:'El GCBA y sus 13.000 cámaras: reconocimiento facial en tiempo real',
      url:'https://www.infobae.com/sociedad/2023/11/08/el-sistema-de-camaras-de-vigilancia-del-gcba-13000-camaras-y-reconocimiento-facial-en-tiempo-real/' },
    { cat:'zona', date:'2024-03-05', src:'LA NACIÓN', rel:'alto',
      title:'Fondos reservados: 50 mil millones de pesos gastados sin control en la AFI desde 2016',
      url:'https://www.lanacion.com.ar/politica/fondos-reservados-como-se-gastaron-sin-control-en-la-afi-nid05032024/' },
    { cat:'zona', date:'2024-09-03', src:'EL DESTAPE', rel:'alto',
      title:'La SIDE de Milei: sin auditorías, sin presupuesto público, sin rendición de cuentas',
      url:'https://www.eldestapeweb.com/politica/la-side-de-milei-y-los-fondos-reservados-sin-auditorias-nid04092024' },
    { cat:'zona', date:'2023-10-22', src:'INFOBAE', rel:'medio',
      title:'Los servicios de inteligencia extranjeros en Argentina: cuántos operan y cómo',
      url:'https://www.infobae.com/politica/2023/10/22/los-servicios-de-inteligencia-extranjeros-en-argentina-cuantos-operan-y-como-lo-hacen/' },
    { cat:'ruta', date:'2023-09-14', src:'CARMELO PORTAL', rel:'critico',
      title:'El agente del GRU cruzó por Colonia del Sacramento con DNI argentino (2013–2018)',
      url:'https://carmeloportal.com/el-agente-del-gru-ruso-cruzo-por-colonia-del-sacramento-con-dni-argentino/' },
    { cat:'ruta', date:'2024-02-14', src:'CLARÍN', rel:'alto',
      title:'Armada uruguaya persiguió embarcación sospechosa que escapó hacia aguas argentinas',
      url:'https://www.clarin.com/policiales/armada-uruguaya-persiguio-embarcacion-sospechosa-escapo-aguas-argentinas-rio-plata_0_zGvz6BO4A9.html' },
    { cat:'ruta', date:'2023-05-10', src:'LA NACIÓN', rel:'medio',
      title:'Control Buenos Aires–Colonia: el nuevo sistema unificado de migraciones en puertos',
      url:'https://www.lanacion.com.ar/sociedad/control-de-pasajeros-buenos-aires-colonia-el-nuevo-sistema-unificado-nid10052023/' },
];

function renderOsintV3(filter) {
    const el = document.getElementById('osint-v3');
    if (!el) return;
    const list = filter === 'all' ? ARTS : ARTS.filter(a => a.cat === filter);
    let n = 1;
    el.innerHTML = list.map(a => `
        <a class="osint-row-v3" href="${a.url}" target="_blank" rel="noopener noreferrer">
            <div class="or-meta">
                <span class="or-date">${a.date}</span>
                <span class="or-src">${a.src}</span>
            </div>
            <div class="or-title">&gt;&gt; ${n++}. ${a.title}</div>
            <span class="or-tag ${a.rel}">${a.rel.toUpperCase()}</span>
        </a>
    `).join('');
}

function filterV3(cat, btn) {
    document.querySelectorAll('.obtn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    renderOsintV3(cat);
}
