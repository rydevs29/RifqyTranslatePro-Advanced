// ==========================================
// CORE TRANSLATE ENGINE & UI
// ==========================================

window.onload = () => {
    initDB();
};

function initDB() {
    const tTgt = document.getElementById('valTxtTgt');
    const vSrc = document.getElementById('voiceSrc');
    const vTgt = document.getElementById('voiceTgt');

    langTextDB.forEach(l => {
        tTgt.appendChild(new Option(l.name, l.code));
        vTgt.appendChild(new Option(l.name, l.code));
    });
    langVoiceDB.forEach(v => {
        vSrc.appendChild(new Option(v[0], v[1]));
    });
}

function goTab(tab) {
    ['text', 'voice', 'cyber', 'media', 'ai'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        let nav = document.getElementById(`nav-${t}`);
        nav.classList.replace('text-blue-500', 'text-slate-500');
        nav.classList.replace('text-red-400', 'text-slate-500');
        nav.classList.replace('text-green-400', 'text-slate-500');
        nav.classList.replace('text-pink-400', 'text-slate-500');
        nav.classList.replace('text-indigo-400', 'text-slate-500');
        nav.classList.remove('scale-110', 'font-bold');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    let navActive = document.getElementById(`nav-${tab}`);
    navActive.classList.add('scale-110', 'font-bold');
    
    const colors = {text:'text-blue-500', voice:'text-red-400', cyber:'text-green-400', media:'text-pink-400', ai:'text-indigo-400'};
    navActive.classList.replace('text-slate-500', colors[tab]);
}

function toggleGhostMode() {
    document.getElementById('mainArea').classList.toggle('ghost-active');
    document.getElementById('btnGhost').classList.toggle('text-red-500');
}

async function runTranslate() {
    let rawText = document.getElementById('txtInput').value.trim();
    if(!rawText) return;
    
    let textToTranslate = document.getElementById('chkSlang').checked ? rawText.replace(/yg/gi, "yang").replace(/gk/gi, "tidak") : rawText;
    let tgt = document.getElementById('valTxtTgt').value;
    let outEl = document.getElementById('txtOutput');
    outEl.value = "Menerjemahkan...";

    try {
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tgt}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
        let res = await fetch(url);
        let json = await res.json();
        let result = json[0].map(x => x[0]).join('');
        
        if(document.getElementById('chkBionic').checked) {
            outEl.classList.add('hidden');
            let bioEl = document.getElementById('bionicOutput');
            bioEl.classList.remove('hidden');
            bioEl.innerHTML = result.split(' ').map(w => `<span class="bionic-bold">${w.substring(0, Math.ceil(w.length/2))}</span><span class="bionic-dim">${w.substring(Math.ceil(w.length/2))}</span>`).join(' ');
        } else {
            outEl.classList.remove('hidden');
            document.getElementById('bionicOutput').classList.add('hidden');
            outEl.value = result;
        }
    } catch(err) { outEl.value = "Error koneksi API Translate."; }
}

function copyText(id) { navigator.clipboard.writeText(document.getElementById(id).value); alert("Teks Disalin!"); }
async function checkClipboard() { try { document.getElementById('txtInput').value = await navigator.clipboard.readText(); } catch(e){} }
function openShareModal() {
    document.getElementById('modalQR').classList.remove('hidden');
    document.getElementById('qrContainer').innerHTML = '';
    new QRCode(document.getElementById('qrContainer'), { text: document.getElementById('txtOutput').value, width: 150, height: 150 });
}
