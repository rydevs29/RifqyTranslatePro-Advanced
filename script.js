// ==========================================
// RIFQYTRANSLATE PRO - ULTIMATE CORE ENGINE
// ==========================================

// Global State
let state = {
    isGhost: false,
    isZen: false,
    activeTab: 'text',
    history: []
};

// 1. Inisialisasi
document.addEventListener('DOMContentLoaded', () => {
    try { state.history = JSON.parse(localStorage.getItem('rt_ultimate_hist')) || []; } catch(e){}
    setupCommandInterceptor();
});

// 2. Tab Manager
function goTab(tab) {
    ['text', 'cyber'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        document.getElementById(`nav-${t}`).classList.replace('text-blue-500', 'text-slate-600');
        document.getElementById(`nav-${t}`).classList.replace('text-green-400', 'text-slate-600');
        document.getElementById(`nav-${t}`).classList.remove('scale-110', 'font-bold');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    let color = tab === 'cyber' ? 'text-green-400' : 'text-blue-500';
    document.getElementById(`nav-${tab}`).classList.replace('text-slate-600', color);
    document.getElementById(`nav-${tab}`).classList.add('scale-110', 'font-bold');
    state.activeTab = tab;
}

// 3. UI Toggles (Ghost & Zen Mode)
function toggleGhostMode() {
    state.isGhost = !state.isGhost;
    let btn = document.getElementById('btnGhost');
    let main = document.getElementById('mainArea');
    
    if(state.isGhost) {
        btn.classList.replace('text-slate-500', 'text-red-500');
        main.classList.add('ghost-active');
        alert("Ghost Mode AKTIF: Anti-Log. Cache & History dimatikan.");
    } else {
        btn.classList.replace('text-red-500', 'text-slate-500');
        main.classList.remove('ghost-active');
    }
}

function toggleZenMode() {
    state.isZen = !state.isZen;
    document.getElementById('mainHeader').style.display = state.isZen ? 'none' : 'flex';
    document.getElementById('mainNav').style.display = state.isZen ? 'none' : 'flex';
}

// 4. Command Interceptor & Auto-Slang
function setupCommandInterceptor() {
    document.getElementById('txtInput').addEventListener('input', function(e) {
        let txt = this.value;
        if(txt.trim() === '/clear') { this.value = ''; document.getElementById('txtOutput').value = ''; return; }
        if(txt.trim() === '/ghost') { this.value = ''; toggleGhostMode(); return; }
        if(txt.trim() === '/help') { alert("Commands: /clear, /ghost, /cyber"); this.value=''; return; }
        if(txt.trim() === '/cyber') { this.value = ''; goTab('cyber'); return; }
        
        // Auto URL Detector
        if((txt.startsWith('http://') || txt.startsWith('https://')) && txt.length > 10) {
            if(confirm("Buka URL ini di Tab Web?")) { window.open(`https://translate.google.com/translate?sl=auto&tl=id&u=${encodeURIComponent(txt)}`); }
        }
    });
}

function applySlangDictionary(text) {
    if(!document.getElementById('chkSlang').checked) return text;
    const dict = { "yg": "yang", "gk": "tidak", "gak": "tidak", "bs": "bisa", "krn": "karena", "kalo": "kalau", "dgn": "dengan" };
    let words = text.split(' ');
    return words.map(w => dict[w.toLowerCase()] || w).join(' ');
}

// 5. Core Translate Engine
async function runTranslate() {
    let inputEl = document.getElementById('txtInput');
    let rawText = inputEl.value.trim();
    if(!rawText) return;

    let textToTranslate = applySlangDictionary(rawText);
    let tgt = document.getElementById('valTxtTgt').value;
    let outEl = document.getElementById('txtOutput');
    let badge = document.getElementById('speedBadge');
    
    outEl.value = "Menerjemahkan...";
    let startTime = performance.now();

    try {
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tgt}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
        let res = await fetch(url);
        let json = await res.json();
        let result = json[0].map(x => x[0]).join('');
        
        let endTime = performance.now();
        let ping = Math.round(endTime - startTime);
        
        // Handle Bionic Reading
        if(document.getElementById('chkBionic').checked) {
            outEl.classList.add('hidden');
            let bioEl = document.getElementById('bionicOutput');
            bioEl.classList.remove('hidden');
            bioEl.innerHTML = generateBionic(result);
        } else {
            outEl.classList.remove('hidden');
            document.getElementById('bionicOutput').classList.add('hidden');
            outEl.value = result;
        }

        badge.innerText = `${ping}ms`;
        badge.classList.remove('hidden');
        
        if(!state.isGhost) saveHistory(rawText, result);

    } catch(err) {
        outEl.value = "Koneksi gagal/Server Error.";
    }
}

// Bionic Reading Generator
function generateBionic(text) {
    let words = text.split(' ');
    return words.map(word => {
        let half = Math.ceil(word.length / 2);
        let boldPart = word.substring(0, half);
        let dimPart = word.substring(half);
        return `<span class="bionic-bold">${boldPart}</span><span class="bionic-dim">${dimPart}</span>`;
    }).join(' ');
}

// 6. Cyber / Security Tools
function runCyber(action) {
    let mode = document.getElementById('cyberMode').value;
    let txt = document.getElementById('cyberInput').value;
    let out = document.getElementById('cyberOutput');
    if(!txt) return;

    try {
        if(mode === 'hex') {
            if(action === 'encode') out.value = txt.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
            else out.value = txt.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
        } 
        else if(mode === 'base64') {
            if(action === 'encode') out.value = btoa(unescape(encodeURIComponent(txt)));
            else out.value = decodeURIComponent(escape(atob(txt)));
        }
        else if(mode === 'stegano') {
            alert("Fitur AES-256 Stegano akan diaktifkan di update kriptografi berikutnya!");
        }
    } catch(e) {
        out.value = "Error: Format tidak valid untuk " + action;
    }
}

// 7. Utilities (QR, Clipboard, History)
async function checkClipboard() {
    try {
        let text = await navigator.clipboard.readText();
        if(text) { document.getElementById('txtInput').value = text; }
    } catch (err) { alert("Izin clipboard ditolak."); }
}

function copyText(id) {
    let el = document.getElementById(id);
    navigator.clipboard.writeText(el.value || el.innerText);
    alert("Teks disalin!");
}

function openShareModal() {
    let text = document.getElementById('txtOutput').value;
    if(!text || text === "Menerjemahkan...") return alert("Belum ada hasil.");
    
    document.getElementById('modalQR').classList.remove('hidden');
    let qc = document.getElementById('qrContainer');
    qc.innerHTML = '';
    new QRCode(qc, { text: text, width: 150, height: 150 });
}

function shareLink(type) {
    let text = document.getElementById('txtOutput').value;
    if(type === 'wa') window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`);
    else {
        if(navigator.share) navigator.share({ title: 'RifqyTranslate', text: text });
        else copyText('txtOutput');
    }
}

function saveHistory(inTxt, outTxt) {
    state.history.unshift({ in: inTxt, out: outTxt, time: new Date().getTime() });
    if(state.history.length > 30) state.history.pop();
    localStorage.setItem('rt_ultimate_hist', JSON.stringify(state.history));
}
