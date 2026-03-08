// File: api/gemini.js (ULTIMATE SPEED 2.0 FLASH)
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { promptText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY belum diset di environment variable." });
    }

    if (!promptText) {
        return res.status(400).json({ error: "Prompt text tidak boleh kosong." });
    }

    try {
        // Gunakan model yang stabil (1.5-flash) terlebih dahulu
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            // Jika gagal, coba fallback ke model lain
            console.log("Fallback ke model lain...");
            const fallbackUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
            const fbRes = await fetch(fallbackUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
            });
            const fbData = await fbRes.json();
            return res.status(fbRes.status).json(fbData);
        }

        res.status(response.status).json(data);
    } catch (error) {
        console.error("Error di server Gemini:", error);
        res.status(500).json({ error: "Gagal terhubung ke Gemini AI." });
    }
}
