// ==========================================
// MODULE 1: CYBERSECURITY & PRIVACY
// File: rifqy-security.js
// ==========================================

// FITUR: Encrypted Secret Note (Steganografi AES-256)
// Menggunakan library CryptoJS yang sudah ada di HTML
function encryptSecretNote(text, password) {
    if (!text || !password) return alert("Teks dan Password wajib diisi!");
    const encrypted = CryptoJS.AES.encrypt(text, password).toString();
    document.getElementById('cyberOutput').value = `[RIFQY-SECURE-NOTE]\n${encrypted}`;
    alert("Pesan berhasil dienkripsi!");
}

function decryptSecretNote(encryptedText, password) {
    try {
        const cleanText = encryptedText.replace('[RIFQY-SECURE-NOTE]\n', '');
        const decrypted = CryptoJS.AES.decrypt(cleanText, password);
        const originalText = decrypted.toString(CryptoJS.enc.Utf8);
        if (!originalText) throw new Error("Password salah");
        document.getElementById('cyberOutput').value = originalText;
    } catch (e) {
        alert("Gagal dekripsi! Password salah atau data rusak.");
    }
}

// FITUR: Translation "Time Machine" (Undo/Redo Input)
let timeMachineLog = [];
document.addEventListener('DOMContentLoaded', () => {
    const inputEl = document.getElementById('txtInput');
    if(inputEl) {
        inputEl.addEventListener('input', (e) => {
            // Simpan setiap 10 karakter perubahan untuk mencegah lag
            if(e.target.value.length % 10 === 0) {
                timeMachineLog.push(e.target.value);
                if(timeMachineLog.length > 5) timeMachineLog.shift(); // Max 5 snapshot
            }
        });
    }
});

function undoText() {
    if(timeMachineLog.length > 0) {
        document.getElementById('txtInput').value = timeMachineLog.pop();
    } else {
        alert("Tidak ada riwayat ketikan (Time Machine kosong).");
    }
}

// Update fungsi runCyber() di script.js lama agar bisa memanggil Steganografi ini
// Tambahkan kondisi if(mode === 'stegano') memanggil encryptSecretNote / decryptSecretNote
