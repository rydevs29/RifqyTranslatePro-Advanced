// ==========================================
// MODULE 3: SMART UTILS & EDUCATION
// File: rifqy-smart.js
// ==========================================

// FITUR: Snippet Manager (Simpan ke Favorit)
let favoriteSnippets = JSON.parse(localStorage.getItem('rifqy_snippets')) || [];

function saveToSnippet() {
    const text = document.getElementById('txtOutput').value;
    if(!text) return;
    
    const title = prompt("Beri nama folder/snippet ini (misal: Tugas B.Inggris):", "Snippet Baru");
    if(title) {
        favoriteSnippets.push({ title, content: text });
        localStorage.setItem('rifqy_snippets', JSON.stringify(favoriteSnippets));
        alert(`Disimpan ke folder: ${title}`);
    }
}

// FITUR: Smart Currency & Unit Converter
// Berjalan otomatis saat mendeteksi angka + satuan di input teks
function detectAndConvert(text) {
    let convertedText = text;
    
    // Deteksi USD ke IDR (Asumsi 1 USD = Rp 15.000)
    const usdRegex = /\$([0-9,.]+)/g;
    convertedText = convertedText.replace(usdRegex, (match, p1) => {
        let val = parseFloat(p1.replace(/,/g, ''));
        return `${match} (Rp ${(val * 15000).toLocaleString('id-ID')})`;
    });

    // Deteksi Miles ke KM
    const milesRegex = /([0-9,.]+)\s*miles?/gi;
    convertedText = convertedText.replace(milesRegex, (match, p1) => {
        let val = parseFloat(p1.replace(/,/g, ''));
        return `${match} (${(val * 1.60934).toFixed(2)} km)`;
    });

    return convertedText;
}

// FITUR: Education Mode (Word of the Day)
const wordsOfTheDay = [
    { word: "Resilience", meaning: "Ketahanan / Kemampuan bangkit dari kegagalan" },
    { word: "Ubiquitous", meaning: "Ada di mana-mana / Sering ditemukan" },
    { word: "Ephemeral", meaning: "Berumur pendek / Tidak kekal" }
];

function showWordOfTheDay() {
    const today = new Date().getDay(); // 0-6
    const wordObj = wordsOfTheDay[today % wordsOfTheDay.length];
    
    // Tampilkan di konsol atau buat elemen notifikasi kecil
    console.log(`💡 Word of the Day: ${wordObj.word} - ${wordObj.meaning}`);
}

// Panggil Word of the day saat aplikasi pertama kali dimuat
document.addEventListener('DOMContentLoaded', showWordOfTheDay);
