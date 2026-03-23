let isVoiceActive = false;
let voiceRecog;

function startInstantVoice() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) return alert("Browser tidak support fitur mic.");
    
    const anim = document.getElementById('waveAnim');
    const btn = document.getElementById('btnVoiceMic');

    if(isVoiceActive) { 
        voiceRecog.stop(); 
        anim.classList.add('hidden');
        btn.classList.replace('bg-red-500', 'bg-red-600');
        return; 
    }

    const srcCode = document.getElementById('voiceSrc').value; 
    const tgtCode = document.getElementById('voiceTgt').value; 
    const inBox = document.getElementById('voiceTextIn');
    const outBox = document.getElementById('voiceTextOut');

    voiceRecog = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    voiceRecog.lang = srcCode;
    voiceRecog.interimResults = true;

    voiceRecog.onstart = () => {
        isVoiceActive = true;
        anim.classList.remove('hidden');
        btn.classList.replace('bg-red-600', 'bg-red-500');
        inBox.innerText = "...";
        outBox.innerText = "...";
    };

    voiceRecog.onresult = (e) => {
        inBox.innerText = `"${Array.from(e.results).map(r => r[0].transcript).join('')}"`;
    };

    voiceRecog.onend = async () => {
        isVoiceActive = false;
        anim.classList.add('hidden');
        btn.classList.replace('bg-red-500', 'bg-red-600');
        
        let rawText = inBox.innerText.replace(/"/g, '');
        if(rawText && rawText !== "...") {
            outBox.innerText = "Menerjemahkan...";
            try {
                let res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${tgtCode}&dt=t&q=${encodeURIComponent(rawText)}`);
                let json = await res.json();
                outBox.innerText = json[0].map(x => x[0]).join('');
                
                // Suara otomatis
                speakNatural('voiceTextOut', 'voiceTgt');
            } catch(e) { outBox.innerText = "Gagal menerjemahkan."; }
        }
    };
    voiceRecog.start();
}

function speakNatural(elementId, targetSelectId) {
    const text = document.getElementById(elementId).value || document.getElementById(elementId).innerText;
    const tgtLang = document.getElementById(targetSelectId).value;
    if(!text) return;

    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(text);
    msg.rate = 0.9;
    
    let match = langVoiceDB.find(v => v[2] === tgtLang);
    msg.lang = match ? match[1] : tgtLang;

    window.speechSynthesis.speak(msg);
}
