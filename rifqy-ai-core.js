document.addEventListener('DOMContentLoaded', loadChatHistory);

function loadChatHistory() {
    const history = JSON.parse(localStorage.getItem('rifqy_ai') || "[]");
    const chatBox = document.getElementById('aiChatBox');
    chatBox.innerHTML = "";
    if(history.length === 0) return chatBox.innerHTML = `<div class="bg-indigo-900/30 p-3 rounded-xl border border-indigo-500/30 text-indigo-300 text-xs text-center">🤖 Gemini Siap Membantu!</div>`;
    history.forEach(chat => appendMessage(chat.role, chat.text, false));
}

function clearAIChat() {
    if(confirm("Hapus history chat AI?")) { localStorage.removeItem('rifqy_ai'); loadChatHistory(); }
}

function appendMessage(role, text, isNew = true) {
    const chatBox = document.getElementById('aiChatBox');
    if(isNew) {
        const history = JSON.parse(localStorage.getItem('rifqy_ai') || "[]");
        history.push({ role, text });
        localStorage.setItem('rifqy_ai', JSON.stringify(history));
    }

    const html = role === 'ai' ? `
        <div class="flex justify-start">
            <div class="bg-slate-800 text-indigo-50 text-xs py-3 px-4 rounded-2xl rounded-tl-none border border-indigo-500/30 max-w-[90%] shadow-lg">
                <div class="flex justify-between mb-2 border-b border-slate-600 pb-1">
                    <strong class="text-indigo-400">✨ Gemini</strong>
                    <button onclick="copyAiText(this)" class="text-[9px] bg-slate-700 px-2 rounded">Copy</button>
                </div>
                <div class="leading-relaxed">${text}</div>
            </div>
        </div>` : `
        <div class="flex justify-end">
            <div class="bg-indigo-600 text-white text-xs py-2 px-4 rounded-2xl rounded-tr-none max-w-[85%]">${text}</div>
        </div>`;
    chatBox.innerHTML += html;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function copyAiText(btn) {
    navigator.clipboard.writeText(btn.parentElement.nextElementSibling.innerText);
    btn.innerText = "Copied!"; setTimeout(() => btn.innerText = "Copy", 2000);
}

function kirimKeSmartAI(sourceId) {
    let text = document.getElementById(sourceId).value;
    if(!text || text === "...") return alert("Belum ada teks!");
    goTab('ai');
    document.getElementById('aiInput').value = `Bedah kalimat ini: "${text}"`;
    askGemini();
}

async function askGemini() {
    const input = document.getElementById('aiInput');
    const tone = document.getElementById('aiTone').value;
    const chatBox = document.getElementById('aiChatBox');
    const prompt = input.value.trim();

    if(!prompt) return;
    appendMessage('user', prompt);
    input.value = "";
    
    const loadId = "load-" + Date.now();
    chatBox.innerHTML += `<div id="${loadId}" class="text-indigo-400 text-[10px] animate-pulse">Mengetik...</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    const finalPrompt = `Jawab dengan gaya ${tone}. Pertanyaan: ${prompt}`;

    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ promptText: finalPrompt })
        });
        const data = await res.json();
        document.getElementById(loadId)?.remove();

        // FIX [object Object]
        if (data.error) throw new Error(typeof data.error === 'object' ? data.error.message : data.error);

        let aiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>'); 
        appendMessage('ai', aiResponse);
    } catch(e) {
        document.getElementById(loadId)?.remove();
        chatBox.innerHTML += `<div class="bg-red-900/40 text-red-400 text-[10px] p-2 rounded">⚠️ Error: ${e.message}</div>`;
    }
}
