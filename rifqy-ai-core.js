// ==========================================
// TAB 5: GOOGLE GEMINI AI CORE (VERCEL SECURE)
// ==========================================

// Fungsi dari Tab Media (OCR) yang melempar teks ke AI
async function processOCR() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('ocrStatus');
    
    if (!fileInput.files[0]) return alert("Pilih foto dulu, Rifqy!");

    status.classList.remove('hidden');
    status.innerText = "Membaca Gambar (AI Vision)...";

    try {
        const result = await Tesseract.recognize(fileInput.files[0], 'eng+ind');
        const teks = result.data.text;
        
        status.innerText = "OCR Berhasil! Mengirim ke Smart AI...";

        // Pindah ke Tab AI dan isi pertanyaannya
        goTab('ai');
        const aiInput = document.getElementById('aiInput');
        aiInput.value = `Tolong rapikan teks hasil scan OCR ini, perbaiki jika ada typo, dan jelaskan intinya: "${teks}"`;
        
        // Jalankan fungsi AI secara otomatis
        setTimeout(() => {
            askGemini();
            status.classList.add('hidden');
        }, 500);

    } catch(e) { 
        alert("OCR Gagal membaca gambar."); 
        status.classList.add('hidden');
    }
}

// Fungsi dari Tab Text (Terjemahan) yang membedah hasil
function kirimKeSmartAI(sourceId) {
    let text = document.getElementById(sourceId).value || document.getElementById(sourceId).innerText;
    if(!text || text === "Menerjemahkan..." || text === "...") return alert("Belum ada teks untuk dibedah!");
    
    goTab('ai');
    document.getElementById('aiInput').value = `Bedah struktur bahasa, berikan cara pengucapan (pronunciation), dan jelaskan arti dari kalimat ini: "${text}"`;
    askGemini();
}

// FUNGSI UTAMA: Chat dengan Gemini via Vercel API
async function askGemini() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('aiChatBox');
    const promptText = input.value.trim();

    if(!promptText) return;

    // 1. Tampilkan Chat User
    chatBox.innerHTML += `
        <div class="flex justify-end mb-4">
            <div class="bg-slate-800 text-white text-xs py-2 px-3 rounded-xl rounded-tr-none max-w-[85%] border border-slate-700 shadow-lg">
                ${promptText}
            </div>
        </div>`;
    
    input.value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    // 2. Tampilkan Indikator Loading AI (Typing...)
    const loadingId = "loading-" + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" class="flex justify-start mb-4">
            <div class="bg-indigo-900/40 text-indigo-300 text-xs py-2 px-3 rounded-xl rounded-tl-none border border-indigo-500/30 flex items-center gap-1 shadow-lg">
                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Gemini sedang berpikir...
            </div>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        // 3. Panggil Vercel Serverless API (/api/gemini)
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptText: promptText })
        });
        
        const data = await res.json();
        
        // Hapus indikator loading
        document.getElementById(loadingId).remove();

        // Cek jika ada error dari server
        if (data.error) {
            throw new Error(data.error);
        }

        // 4. Tampilkan Chat AI
        // Mengubah format Markdown (**) menjadi bold HTML
        let aiResponse = data.candidates[0].content.parts[0].text;
        aiResponse = aiResponse.replace(/\n/g, '<br>');
        aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
        
        chatBox.innerHTML += `
            <div class="flex justify-start mb-4">
                <div class="bg-indigo-900/30 text-indigo-100 text-xs py-3 px-4 rounded-xl rounded-tl-none border border-indigo-500/50 max-w-[90%] shadow-[0_0_15px_rgba(99,102,241,0.1)] leading-relaxed">
                    <strong class="text-indigo-400 block mb-1">✨ Gemini AI:</strong>
                    ${aiResponse}
                </div>
            </div>`;
        
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch(e) {
        document.getElementById(loadingId)?.remove();
        chatBox.innerHTML += `
            <div class="flex justify-start mb-4">
                <div class="bg-red-900/30 text-red-300 text-xs py-2 px-3 rounded-xl rounded-tl-none border border-red-500/50">
                    <strong>Error:</strong> ${e.message || "Gagal menghubungi server Vercel."}
                </div>
            </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
