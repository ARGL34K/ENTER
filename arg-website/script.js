// =====================================================
//  AUDIO PLAYER
// =====================================================
let currentlyPlaying = null;
let targetFileId = '';
let currentPassword = '';
let currentAudioId = '';

function playAudio(audioId) {
    const audioElement = document.getElementById(audioId);
    if (currentlyPlaying && currentlyPlaying !== audioElement) {
        currentlyPlaying.pause();
        currentlyPlaying.currentTime = 0;
    }
    if (audioElement.paused) {
        audioElement.play();
        currentlyPlaying = audioElement;
    } else {
        audioElement.pause();
        currentlyPlaying = null;
    }
}

// =====================================================
//  SISTEMA DE CONTRASEÑAS
// =====================================================
function promptPassword(fileId, correctPassword, audioId) {
    const fileElement = document.getElementById(fileId);
    if (fileElement.classList.contains('decrypted')) {
        playAudio(audioId);
        return;
    }
    targetFileId = fileId;
    currentPassword = correctPassword;
    currentAudioId = audioId;

    const modal = document.getElementById('password-modal');
    const errorText = document.getElementById('password-error');
    const input = document.getElementById('password-input');
    modal.classList.remove('hidden');
    errorText.classList.add('hidden');
    input.value = '';
    input.focus();
}

function checkPassword() {
    const input = document.getElementById('password-input').value.toLowerCase().trim();
    const errorText = document.getElementById('password-error');
    if (input === currentPassword) {
        const fileElement = document.getElementById(targetFileId);
        const statusSpan = fileElement.querySelector('.file-status');
        fileElement.classList.remove('locked');
        fileElement.classList.add('decrypted');
        statusSpan.innerText = 'DESENCRIPTADO';
        document.getElementById('password-modal').classList.add('hidden');
        playAudio(currentAudioId);
    } else {
        errorText.classList.remove('hidden');
    }
}

document.getElementById('password-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') checkPassword();
});

// =====================================================
//  SISTEMA DE TRANSMISIONES (localStorage)
// =====================================================
const STORAGE_KEY = 'argl34k_transmissions';

function getTransmissions() {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveTransmissions(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function formatDate(isoString) {
    const d = new Date(isoString);
    const date = d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' });
    return `${date} ${time}`;
}

function renderTransmissions() {
    const list = getTransmissions();
    const container = document.getElementById('transmissions-list');
    const noMsg = document.getElementById('no-transmissions-msg');

    // Limpiar transmisiones públicas (preservar el mensaje vacío)
    const existing = container.querySelectorAll('.transmission-item');
    existing.forEach(el => el.remove());

    if (list.length === 0) {
        noMsg.classList.remove('hidden');
    } else {
        noMsg.classList.add('hidden');
        list.forEach(msg => {
            const div = document.createElement('div');
            div.className = 'transmission-item';
            div.innerHTML = `
                <div class="transmission-timestamp">> [${formatDate(msg.date)}] .ARGL34K TRANSMITE:</div>
                <div class="transmission-text">${escapeHTML(msg.text)}</div>
            `;
            container.appendChild(div);
        });
    }
}

function renderAdminTransmissions() {
    const list = getTransmissions();
    const container = document.getElementById('admin-transmissions-list');
    container.innerHTML = '';

    if (list.length === 0) {
        container.innerHTML = '<p class="no-admin-msg">> Sin transmisiones.</p>';
        return;
    }

    list.forEach((msg, index) => {
        const row = document.createElement('div');
        row.className = 'admin-transmission-row';
        row.innerHTML = `
            <div>
                <div class="admin-msg-date">[${formatDate(msg.date)}]</div>
                <div class="admin-msg-preview">${escapeHTML(msg.text)}</div>
            </div>
            <button class="btn-delete" onclick="deleteTransmission(${index})">[ BORRAR ]</button>
        `;
        container.appendChild(row);
    });
}

function postTransmission() {
    const input = document.getElementById('admin-message-input');
    const text = input.value.trim();
    if (!text) return;

    const list = getTransmissions();
    list.push({ text, date: new Date().toISOString() });
    saveTransmissions(list);
    input.value = '';
    renderTransmissions();
    renderAdminTransmissions();
}

function deleteTransmission(index) {
    const list = getTransmissions();
    list.splice(index, 1);
    saveTransmissions(list);
    renderTransmissions();
    renderAdminTransmissions();
}

function escapeHTML(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/\n/g, '<br>');
}

// =====================================================
//  PANEL DE ADMIN (Ctrl + Shift + A)
// =====================================================
function openAdmin() {
    document.getElementById('admin-panel').classList.remove('hidden');
    document.getElementById('admin-overlay').classList.remove('hidden');
    renderAdminTransmissions();
    document.getElementById('admin-message-input').focus();
}

function closeAdmin() {
    document.getElementById('admin-panel').classList.add('hidden');
    document.getElementById('admin-overlay').classList.add('hidden');
}

document.addEventListener('keydown', function(e) {
    // Ctrl + Shift + A → abrir panel admin
    if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        openAdmin();
    }
    // Escape → cerrar admin o cerrar modal contraseña
    if (e.key === 'Escape') {
        closeAdmin();
        document.getElementById('password-modal').classList.add('hidden');
    }
    // Enter en el admin textarea (Ctrl+Enter para enviar)
    if (e.ctrlKey && e.key === 'Enter') {
        const adminPanel = document.getElementById('admin-panel');
        if (!adminPanel.classList.contains('hidden')) {
            postTransmission();
        }
    }
});

// =====================================================
//  INIT
// =====================================================
document.addEventListener('DOMContentLoaded', function() {
    renderTransmissions();
    // Foco en el gate input si existe
    const gateInput = document.getElementById('gate-input');
    if (gateInput) gateInput.focus();
});

// =====================================================
//  GATE: POPUP DE ACCESO INICIAL
//  Clave: RN NU KS (normalizada: rnnuks)
// =====================================================
const GATE_KEY = 'rnnuks';

function checkGate() {
    const raw   = document.getElementById('gate-input').value;
    const input = raw.toLowerCase().replace(/[\s\-_]/g, '');
    const error = document.getElementById('gate-error');

    if (input === GATE_KEY) {
        const overlay = document.getElementById('gate-overlay');
        overlay.style.animation = 'gate-out 0.5s ease forwards';
        // Insertar keyframe de salida si no existe
        if (!document.getElementById('gate-out-style')) {
            const s = document.createElement('style');
            s.id = 'gate-out-style';
            s.textContent = '@keyframes gate-out { from{opacity:1} to{opacity:0} }';
            document.head.appendChild(s);
        }
        setTimeout(() => { overlay.style.display = 'none'; }, 500);
    } else {
        error.classList.remove('hidden');
        // Resetear la animación de shake
        error.style.animation = 'none';
        requestAnimationFrame(() => { error.style.animation = ''; });
        document.getElementById('gate-input').value = '';
        document.getElementById('gate-input').focus();
    }
}

// Enter en el campo del gate
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        const overlay = document.getElementById('gate-overlay');
        if (overlay && overlay.style.display !== 'none' && !overlay.classList.contains('hidden')) {
            checkGate();
        }
    }
});
