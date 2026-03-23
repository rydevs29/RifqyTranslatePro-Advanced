window.onload = () => { initDB(); };

function initDB() {
    const tSrc = document.getElementById('valTxtSrc');
    const tTgt = document.getElementById('valTxtTgt');
    const vSrc = document.getElementById('voiceSrc');
    const vTgt = document.getElementById('voiceTgt');

    // Kosongkan dulu
    tSrc.innerHTML = ''; tTgt.innerHTML = ''; vSrc.innerHTML = ''; vTgt.innerHTML = '';

    langTextDB.forEach(l => {
        tSrc.appendChild(new Option(l.name, l.code));
        // Target tidak butuh Auto Detect, jadi skip jika code == 'auto'
        if(l.code !== 'auto') tTgt.appendChild(new Option(l.name, l.code));
    });

    langVoiceDB.forEach(v => {
        vSrc.appendChild(new Option(v[0], v[1])); // Source dialek
        vTgt.appendChild(new Option(v[0], v[2])); // Target bahasa
    });
}

function filterLang(inputId, selectId) {
    const filter = document.getElementById(inputId).value.toLowerCase();
    const options = document.getElementById(selectId).options;
    for (let i = 0; i < options.length; i++) {
        const text = options[i].text.toLowerCase();
        options[i].style.display = text.includes(filter) ? "" : "none";
    }
}

function tukarBahasa(srcId, tgtId) {
    const src = document.getElementById(srcId);
    const tgt = document.getElementById(tgtId);
    if(src.value === 'auto') return alert("Pilih bahasa spesifik dulu sebelum menukar!");
    const temp = src.value;
    src.value = tgt.value;
    tgt.value = temp;
}

function goTab(tab) {
    ['text', 'voice', 'cyber', 'media', 'ai'].forEach(t => {
        document.getElementById(`tab-${t}`).classList.add('hidden');
        let nav = document.getElementById(`nav-${t}`);
        nav.classList.remove('scale-110', 'font-bold', 'text-blue-500', 'text-red-400', 'text-green-400', 'text-pink-400', 'text-indigo-400');
        nav.classList.add('text-slate-500');
    });
    
    document.getElementById(`tab-${tab}`).classList.remove('hidden');
    let navActive = document.getElementById(`nav-${tab}`);
    navActive.classList.remove('text-slate-500');
    navActive.classList.add('scale-110', 'font-bold');
    
    const colors = {text:'text-blue-500', voice:'text-red-400', cyber:'text-green-400', media:'text-pink-400', ai:'text-indigo-400'};
    navActive.classList.add(colors[tab].split('-')[1] + '-' + colors[tab].split('-')[2]); // Ekstrak warna
}

async function runTranslate() {
    let rawText = document.getElementById('txtInput').value.trim();
    if(!rawText) return;
    
    let src = document.getElementById('valTxtSrc').value;
    let tgt = document.getElementById('valTxtTgt').value;
    let outEl = document.getElementById('txtOutput');
    outEl.value = "Menerjemahkan...";

    try {
        // Jika src adalah 'auto', API Google akan otomatis mendeteksi bahasa
        let url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${src}&tl=${tgt}&dt=t&q=${encodeURIComponent(rawText)}`;
        let res = await fetch(url);
        let json = await res.json();
        outEl.value = json[0].map(x => x[0]).join('');
    } catch(err) { outEl.value = "Error koneksi Translate."; }
}

function copyText(id) {
    navigator.clipboard.writeText(document.getElementById(id).value || document.getElementById(id).innerText);
    alert("Teks Tersalin!");
}
