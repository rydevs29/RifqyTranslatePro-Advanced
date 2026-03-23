export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

    const { promptText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: "API Key Gemini belum di-set di pengaturan Vercel!" });
    }

    try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ contents: [{ parts: [{ text: promptText }] }] })
        });

        const data = await response.json();

        // Fix anti [object Object]
        if (!response.ok) {
            const errorStr = data.error?.message || "Kesalahan pada server Google API.";
            return res.status(response.status).json({ error: errorStr });
        }

        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: "Koneksi ke server Vercel gagal: " + error.message });
    }
}
