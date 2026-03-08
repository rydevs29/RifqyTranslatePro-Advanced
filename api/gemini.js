// File: api/gemini.js (ULTIMATE SPEED 2.0 FLASH)
export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { promptText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    try {
        // Kita gunakan endpoint v1beta karena model 2.0 masih dalam tahap pengembangan/terbaru
        // Nama model: gemini-2.0-flash-exp (Experimental) atau gemini-2.0-flash
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Jika 2.0-flash-exp tidak ditemukan, kita fallback (cadangan) ke 1.5-flash
            console.log("Mencoba fallback ke model 1.5-flash...");
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
            const fbRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });
            const fbData = await fbRes.json();
            return res.status(fbRes.status).json(fbData);
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Gagal terhubung ke Gemini AI. Cek konfigurasi Vercel." });
    }
}
