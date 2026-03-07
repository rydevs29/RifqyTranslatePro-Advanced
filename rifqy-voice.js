// ==========================================
// TAB 2: LIVE VOICE TRANSLATOR & TTS
// ==========================================

let isVoiceActive = false;
let voiceRecog;

function startInstantVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return alert("Browser tidak support Voice API.");
    
    if(isVoiceActive) { voiceRecog.stop(); return; }

    const VoiceSrcCode = document.getElementById('voiceSrc').value; // e.g. "id-ID"
    const VoiceTgtCode = document.getElementById('voiceTgt').value; // e.g. "en"
    const inBox = document.getElementById('voiceTextIn');
    const outBox = document.getElementById('voiceTextOut');
    const anim = document.getElementById('waveAnim');

    voiceRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    voiceRecog.lang = VoiceSrcCode;
    voiceRecog.interimResults = true;

    voiceRecog.onstart = () => {
        isVoiceActive = true;
        anim.classList.remove('hidden');
        inBox.innerText = "...";
        outBox.innerText = "...";
    };

    voiceRecog.onresult = (e) => {
        let transcript = Array.from(e.results).map(r => r[0].transcript).join('');
        inBox.innerText = `"${transcript}"`;
    };

    voiceRecog.onend = async () => {
        isVoiceActive = false;
        anim.classList.add('hidden');
        
        let rawText = inBox.innerText.replace(/"/g, '');
        if(rawText && rawText !== "...") {
            outBox.innerText = "Menerjemahkan...";
            try {
                let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${VoiceTgtCode}&dt=t&q=${encodeURIComponent(rawText)}`);
                let json = await res.json();
                outBox.innerText = json[0].map(x => x[0]).join('');
                
                // Otomatis bacakan hasil
                speakNatural('voiceTextOut', 'voiceTgt');
            } catch(e) { outBox.innerText = "Gagal menerjemahkan."; }
        }
    };
    voiceRecog.start();
}

function speakNatural(textId, targetSelectId) {
    const text = document.getElementById(textId).value || document.getElementById(textId).innerText;
    const tgtLang = document.getElementById(targetSelectId).value; // e.g. "en"
    if(!text) return;

    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    msg.pitch = 1.0;

    // Deteksi dari database untuk mencari BCP-47 Code yang paling cocok
    let match = langVoiceDB.find(v => v[2] === tgtLang);
    msg.lang = match ? match[1] : tgtLang;

    window.speechSynthesis.speak(msg);
}
