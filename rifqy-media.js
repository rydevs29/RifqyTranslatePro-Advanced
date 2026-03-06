// ==========================================
// MODULE 2: MEDIA & EXPORT
// File: rifqy-media.js
// ==========================================

// FITUR: Text-to-Image (Vocab Card)
async function exportToImage() {
    const text = document.getElementById('txtOutput').value;
    if (!text || text === "Menerjemahkan...") return alert("Terjemahkan teks dulu!");

    // Buat elemen card virtual secara dinamis
    const card = document.createElement('div');
    card.innerHTML = `
        <div style="background: linear-gradient(135deg, #1e293b, #000000); padding: 40px; border-radius: 20px; color: white; font-family: 'Outfit', sans-serif; width: 400px; text-align: center; border: 2px solid #3b82f6;">
            <h2 style="color: #60a5fa; font-size: 14px; margin-bottom: 20px; letter-spacing: 2px;">RIFQY TRANSLATE PRO</h2>
            <p style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">${text}</p>
            <p style="font-size: 12px; color: #94a3b8;">Created by RifqyDev</p>
        </div>
    `;
    document.body.appendChild(card); // Tempel ke body sementara

    // Render jadi gambar
    try {
        const canvas = await html2canvas(card, { backgroundColor: null });
        const link = document.createElement('a');
        link.download = 'Rifqy-VocabCard.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
    } catch (e) {
        alert("Gagal membuat gambar.");
    } finally {
        card.remove(); // Hapus elemen virtual
    }
}

// FITUR: Voice Transformation (Voice Changer)
function speakTextWithVoice(pitch = 1, rate = 1) {
    const text = document.getElementById('txtOutput').value;
    const lang = document.getElementById('valTxtTgt').value;
    if(!text) return;

    window.speechSynthesis.cancel(); // Stop suara sebelumnya
    const msg = new SpeechSynthesisUtterance(text);
    
    // Setel bahasa (Contoh: en-US, id-ID, ja-JP)
    const langMap = { 'en': 'en-US', 'id': 'id-ID', 'ja': 'ja-JP', 'ko': 'ko-KR' };
    msg.lang = langMap[lang] || 'en-US';
    
    // Manipulasi Suara (Robot / Chipmunk / Deep)
    msg.pitch = pitch; // 0.1 (berat/deep) sampai 2.0 (melengking)
    msg.rate = rate;   // 0.5 (lambat) sampai 2.0 (cepat)
    
    window.speechSynthesis.speak(msg);
}

// FITUR: Floating PiP Text (Picture in Picture API)
async function togglePiP() {
    const outputEl = document.getElementById('txtOutput');
    if (!('documentPictureInPicture' in window)) {
        return alert("Browser kamu belum mendukung API PiP Text. Coba pakai Chrome versi terbaru!");
    }
    
    try {
        const pipWindow = await documentPictureInPicture.requestWindow({ width: 300, height: 200 });
        // Pindahkan teks ke jendela melayang
        pipWindow.document.body.innerHTML = `
            <div style="background: #0f172a; color: #bae6fd; font-family: sans-serif; padding: 20px; height: 100vh; overflow-y: auto;">
                <strong>Hasil Terjemahan:</strong><br><br>
                ${outputEl.value}
            </div>
        `;
    } catch (e) {
        console.error("PiP Error:", e);
    }
}
