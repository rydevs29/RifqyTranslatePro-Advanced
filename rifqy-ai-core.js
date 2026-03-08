// Jalankan saat web pertama kali dibuka
document.addEventListener('DOMContentLoaded', () => {
    loadChatHistory();
});

// Fungsi Navigasi Tab
function goTab(tabName) {
    document.getElementById('tab-text').classList.add('hidden');
    document.getElementById('tab-media').classList.add('hidden');
    document.getElementById('tab-ai').classList.add('hidden');
    document.getElementById(`tab-${tabName}`).classList.remove('hidden');
}

// Fitur Pencarian Bahasa (Bisa diletakkan di script.js juga)
function filterLang(inputId, selectId) {
    const input = document.getElementById(inputId).value.toLowerCase();
    const select = document.getElementById(selectId);
    const options = select.getElementsByTagName('option');

    for (let i = 0; i < options.length; i++) {
        const txtValue = options[i].textContent || options[i].innerText;
        options[i].style.display = txtValue.toLowerCase().indexOf(input) > -1 ? "" : "none";
    }
}

// Menukar Bahasa
function tukarBahasa() {
    const src = document.getElementById('sourceLang');
    const tgt = document.getElementById('targetLang');
    const temp = src.value;
    src.value = tgt.value;
    tgt.value = temp;
}

// ==========================================
// KODE INTI GEMINI AI
// ==========================================

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('rifqy_ai_history') || "[]");
    const chatBox = document.getElementById('aiChatBox');
    chatBox.innerHTML = "";
    
    if(history.length === 0) {
        chatBox.innerHTML = `<div class="bg-indigo-900/20 p-3 rounded-xl border border-indigo-500/20 text-indigo-200 text-xs text-center">✨ Halo Rifqy! AI Assistant siap membantu. Ketik sesuatu di bawah.</div>`;
        return;
    }
    history.forEach(chat => appendMessage(chat.role, chat.text, false));
}

function clearAIChat() {
    if(confirm("Yakin ingin menghapus semua memori percakapan AI?")) {
        localStorage.removeItem('rifqy_ai_history');
        loadChatHistory();
    }
}

function appendMessage(role, text, isNew = true) {
    const chatBox = document.getElementById('aiChatBox');
    const isAI = role === 'ai';
    
    // Simpan ke LocalStorage agar tidak hilang saat di-refresh
    if(isNew) {
        const history = JSON.parse(localStorage.getItem('rifqy_ai_history') || "[]");
        history.push({ role, text });
        localStorage.setItem('rifqy_ai_history', JSON.stringify(history));
    }

    const html = isAI ? `
        <div class="flex justify-start animate-fade-in">
            <div class="bg-slate-800 text-indigo-50 text-sm py-3 px-4 rounded-2xl rounded-tl-none border border-indigo-500/30 max-w-[90%] shadow-lg">
                <div class="flex justify-between items-center mb-2 border-b border-white/10 pb-2">
                    <strong class="text-indigo-400 text-xs flex items-center gap-1">✨ Gemini AI</strong>
                    <button onclick="copyAiText(this)" class="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition text-slate-300">Copy</button>
                </div>
                <div class="leading-relaxed whitespace-pre-wrap">${text}</div>
            </div>
        </div>` : `
        <div class="flex justify-end animate-fade-in">
            <div class="bg-indigo-600 text-white text-sm py-2 px-4 rounded-2xl rounded-tr-none max-w-[85%] shadow-md whitespace-pre-wrap border border-indigo-500">${text}</div>
        </div>`;

    chatBox.innerHTML += html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function copyAiText(btn) {
    const text = btn.parentElement.nextElementSibling.innerText;
    navigator.clipboard.writeText(text);
    btn.innerText = "Copied!";
    setTimeout(() => btn.innerText = "Copy", 2000);
}

async function askGemini() {
    const input = document.getElementById('aiInput');
    const tone = document.getElementById('aiTone').value;
    const chatBox = document.getElementById('aiChatBox');
    const rawPrompt = input.value.trim();

    if(!rawPrompt) return;

    appendMessage('user', rawPrompt);
    input.value = "";
    
    const loadingId = "load-" + Date.now();
    chatBox.innerHTML += `
        <div id="${loadingId}" class="flex justify-start animate-fade-in">
            <div class="bg-slate-800 text-indigo-300 text-xs py-2 px-4 rounded-full animate-pulse border border-slate-700 shadow-sm flex items-center gap-2">
                <svg class="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                Sedang berpikir...
            </div>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    // Modifikasi prompt untuk memasukkan nada/gaya bicara
    const finalPrompt = `Jawab dengan gaya bahasa yang ${tone}. Pertanyaan/Perintah dari user: ${rawPrompt}`;

    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptText: finalPrompt })
        });
        
        const data = await res.json();
        document.getElementById(loadingId)?.remove();

        // FIX BUG [object Object]: Pastikan error berbentuk teks
        if (data.error) {
            const errorMsg = typeof data.error === 'object' ? (data.error.message || JSON.stringify(data.error)) : data.error;
            throw new Error(errorMsg);
        }

        let aiResponse = data.candidates[0].content.parts[0].text;
        
        // Membersihkan markdown bold Google agar tampil rapi di HTML
        aiResponse = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 

        appendMessage('ai', aiResponse);

    } catch(e) {
        document.getElementById(loadingId)?.remove();
        chatBox.innerHTML += `
            <div class="flex justify-center my-2 animate-fade-in">
                <div class="bg-red-900/40 text-red-400 text-xs px-4 py-2 rounded-lg border border-red-500/30 flex items-center gap-2 shadow-sm">
                    <span>⚠️ Error: ${e.message}</span>
                </div>
            </div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
