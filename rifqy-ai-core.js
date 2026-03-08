// ==========================================
// TAB 5: GOOGLE GEMINI AI CORE (VERCEL SECURE)
// ==========================================

// Fungsi dari Tab Media (OCR) yang melempar teks ke AI
async function processOCR() {
    const fileInput = document.getElementById('fileInput');
    const status = document.getElementById('ocrStatus');
    
    if (!fileInput?.files?.[0]) return alert("Pilih foto dulu, Rifqy!");

    status.classList.remove('hidden');
    status.innerText = "Membaca Gambar (AI Vision)...";

    try {
        const result = await Tesseract.recognize(fileInput.files[0], 'eng+ind');
        const teks = result.data.text;
        
        status.innerText = "OCR Berhasil! Mengirim ke Smart AI...";

        // Pindah ke Tab AI dan isi pertanyaannya
        goTab('ai');
        const aiInput = document.getElementById('aiInput');
        if (aiInput) {
            aiInput.value = `Tolong rapikan teks hasil scan OCR ini, perbaiki jika ada typo, dan jelaskan intinya: "${teks}"`;
        }
        
        // Jalankan fungsi AI secara otomatis
        setTimeout(() => {
            askGemini();
            status.classList.add('hidden');
        }, 500);

    } catch(e) { 
        console.error("OCR Error:", e);
        alert("OCR Gagal membaca gambar.");
        status.classList.add('hidden');
    }
}

// Fungsi dari Tab Text (Terjemahan) yang membedah hasil
function kirimKeSmartAI(sourceId) {
    const el = document.getElementById(sourceId);
    let text = el?.value || el?.innerText;
    if (!text || text.trim() === "" || text === "Menerjemahkan..." || text === "...") {
        return alert("Belum ada teks untuk dibedah!");
    }
    
    goTab('ai');
    const aiInput = document.getElementById('aiInput');    if (aiInput) {
        aiInput.value = `Bedah struktur bahasa, berikan cara pengucapan (pronunciation), dan jelaskan arti dari kalimat ini: "${text}"`;
        askGemini();
    }
}

// FUNGSI UTAMA: Chat dengan Gemini via Vercel API
async function askGemini() {
    const input = document.getElementById('aiInput');
    const chatBox = document.getElementById('aiChatBox');
    const promptText = input?.value?.trim();

    if (!promptText) {
        return alert("Ketik dulu ya, Rifqy!");
    }

    // 1. Tampilkan Chat User
    if (chatBox) {
        chatBox.innerHTML += `
            <div class="flex justify-end mb-4">
                <div class="bg-slate-800 text-white text-xs py-2 px-3 rounded-xl rounded-tr-none max-w-[85%] border border-slate-700 shadow-lg">
                    ${promptText}
                </div>
            </div>`;
        input.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    // 2. Tampilkan Indikator Loading AI (Typing...)
    const loadingId = "loading-" + Date.now();
    if (chatBox) {
        chatBox.innerHTML += `
            <div id="${loadingId}" class="flex justify-start mb-4">
                <div class="bg-indigo-900/40 text-indigo-300 text-xs py-2 px-3 rounded-xl rounded-tl-none border border-indigo-500/30 flex items-center gap-1 shadow-lg">
                    <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Gemini sedang berpikir...
                </div>
            </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    try {
        // 3. Panggil Vercel Serverless API (/api/gemini)
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptText: promptText })        });

        const data = await res.json();

        // Hapus indikator loading
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        // Cek error dari server atau struktur tidak valid
        if (!res.ok) {
            throw new Error(`HTTP ${res.status}: ${data.error || 'Respon tidak valid'}`);
        }
        if (data.error) {
            throw new Error(data.error);
        }
        if (!data.candidates?.[0]?.content?.parts?.[0]?.text) {
            throw new Error("Respons AI kosong atau format tidak sesuai.");
        }

        // 4. Format & Tampilkan Chat AI
        let aiResponse = data.candidates[0].content.parts[0].text;
        aiResponse = aiResponse.replace(/\n/g, '<br>');
        aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        if (chatBox) {
            chatBox.innerHTML += `
                <div class="flex justify-start mb-4">
                    <div class="bg-indigo-900/30 text-indigo-100 text-xs py-3 px-4 rounded-xl rounded-tl-none border border-indigo-500/50 max-w-[90%] shadow-[0_0_15px_rgba(99,102,241,0.1)] leading-relaxed">
                        <strong class="text-indigo-400 block mb-1">✨ Gemini AI:</strong>
                        ${aiResponse}
                    </div>
                </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }

    } catch (e) {
        const loadingEl = document.getElementById(loadingId);
        if (loadingEl) loadingEl.remove();

        const errorMsg = e.message || e.toString() || "Gagal menghubungi AI. Coba lagi.";
        if (chatBox) {
            chatBox.innerHTML += `
                <div class="flex justify-start mb-4">
                    <div class="bg-red-900/30 text-red-300 text-xs py-2 px-3 rounded-xl rounded-tl-none border border-red-500/50">
                        <strong>Error:</strong> ${errorMsg}
                    </div>
                </div>`;
            chatBox.scrollTop = chatBox.scrollHeight;
        }
        console.error("askGemini error:", e);    }
}

// === EVENT LISTENER — DIJALANKAN SETELAH DOM SIAP ===
document.addEventListener('DOMContentLoaded', () => {
    const aiInput = document.getElementById('aiInput');
    const sendBtn = document.getElementById('sendBtn');

    // ✅ Tombol kirim (panah biru)
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            if (aiInput && aiInput.value.trim()) {
                askGemini();
            } else {
                alert("Ketik dulu ya, Rifqy!");
            }
        });
    }

    // ✅ Enter di input
    if (aiInput) {
        aiInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (aiInput.value.trim()) {
                    askGemini();
                } else {
                    alert("Ketik dulu ya, Rifqy!");
                }
            }
        });
    }

    // Optional: Jika ada tombol lain (misalnya di tab lain), tambahkan sini
});
