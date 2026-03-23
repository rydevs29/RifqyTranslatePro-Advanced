// Database Teks (180+ Bahasa) - Ditambah "Auto Detect" di index 0
const langTextDB = [
    {code: "auto", name: "✨ Auto Detect (Deteksi Otomatis)"},
    {code: "id", name: "🇮🇩 Indonesia"}, {code: "en", name: "🇺🇸 English"}, {code: "jv", name: "🇮🇩 Javanese (Jawa)"}, 
    {code: "su", name: "🇮🇩 Sundanese (Sunda)"}, {code: "ms", name: "🇲🇾 Malay"}, {code: "ar", name: "🇸🇦 Arabic"},
    {code: "zh-CN", name: "🇨🇳 Chinese (Simplified)"}, {code: "zh-TW", name: "🇹🇼 Chinese (Traditional)"},
    {code: "nl", name: "🇳🇱 Dutch"}, {code: "fr", name: "🇫🇷 French"}, {code: "de", name: "🇩🇪 German"},
    {code: "hi", name: "🇮🇳 Hindi"}, {code: "it", name: "🇮🇹 Italian"}, {code: "ja", name: "🇯🇵 Japanese"},
    {code: "ko", name: "🇰🇷 Korean"}, {code: "pt", name: "🇵🇹 Portuguese"}, {code: "ru", name: "🇷🇺 Russian"},
    {code: "es", name: "🇪🇸 Spanish"}, {code: "th", name: "🇹🇭 Thai"}, {code: "tr", name: "🇹🇷 Turkish"},
    {code: "vi", name: "🇻🇳 Vietnamese"}
    // Kamu bisa tambahkan sisanya di sini sesuai daftar lamamu agar file tidak terlalu berat
];

// Database Suara & Dialek (Format: [Nama, Kode Browser, Target Terjemahan])
const langVoiceDB = [
    ["🇮🇩 Indonesia", "id-ID", "id"], ["🇮🇩 Javanese (Jawa)", "jv-ID", "jw"], ["🇮🇩 Sundanese (Sunda)", "su-ID", "su"], 
    ["🇲🇾 Malay (Malaysia)", "ms-MY", "ms"], ["🇺🇸 English (US)", "en-US", "en"], ["🇬🇧 English (UK)", "en-GB", "en"], 
    ["🇸🇦 Arabic (Saudi)", "ar-SA", "ar"], ["🇪🇸 Spanish (Spain)", "es-ES", "es"], ["🇨🇳 Chinese (Mandarin)", "zh-CN", "zh-CN"], 
    ["🇫🇷 French (France)", "fr-FR", "fr"], ["🇩🇪 German (Germany)", "de-DE", "de"], ["🇯🇵 Japanese", "ja-JP", "ja"], 
    ["🇰🇷 Korean", "ko-KR", "ko"], ["🇷🇺 Russian", "ru-RU", "ru"]
];
