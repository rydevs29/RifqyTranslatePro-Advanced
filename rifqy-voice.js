// ==========================================
// MODULE 4: VOICE AI (Speech-to-Text)
// File: rifqy-voice.js
// ==========================================

let isRecording = false;
let recognition;

function startVoiceRecognition() {
    // Periksa sokongan pelayar (browser support)
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("Maaf, pelayar (browser) anda tidak menyokong ciri Pengecaman Suara. Sila gunakan Google Chrome.");
        return;
    }

    const btnMic = document.getElementById('btnMic');

    // Jika sedang merakam, hentikan
    if (isRecording) {
        recognition.stop();
        return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
    
    // Anda boleh tukar 'id-ID' kepada 'ms-MY' atau 'en-US' mengikut keperluan
    recognition.lang = 'id-ID'; 
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = function() {
        isRecording = true;
        btnMic.classList.replace('bg-red-500/20', 'bg-red-600');
        btnMic.classList.replace('text-red-400', 'text-white');
        btnMic.innerHTML = `<span class="animate-pulse">🔴 Mendengar...</span>`;
    };

    recognition.onresult = function(event) {
        const speechResult = event.results[0][0].transcript;
        const txtInput = document.getElementById('txtInput');
        
        // Tambah teks suara ke dalam kotak teks sedia ada
        txtInput.value = txtInput.value ? txtInput.value + ' ' + speechResult : speechResult;
        
        // Simpan log ke Time Machine secara manual (jika ada)
        if(typeof timeMachineLog !== 'undefined') {
            timeMachineLog.push(txtInput.value);
        }
    };

    recognition.onspeechend = function() {
        recognition.stop();
    };

    recognition.onend = function() {
        isRecording = false;
        btnMic.classList.replace('bg-red-600', 'bg-red-500/20');
        btnMic.classList.replace('text-white', 'text-red-400');
        btnMic.innerHTML = `<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg> Bicara`;
    };

    recognition.onerror = function(event) {
        alert("Ralat Suara: " + event.error);
        isRecording = false;
    };

    // Mulakan rakaman
    recognition.start();
}
