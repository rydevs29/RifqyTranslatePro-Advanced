// File: api/gemini.js (VERSI FIX MODEL)

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { promptText } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ 
            error: "API Key Gemini tidak ditemukan di Environment Variables Vercel." 
        });
    }

    try {
        // PERBAIKAN: Menggunakan model "gemini-1.5-flash-latest" yang dijamin aktif
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptText }]
                }]
            })
        });

        const data = await response.json();

        // Tangkap error langsung dari response status HTTP Google
        if (!response.ok) {
            console.error("Google API Error:", data.error);
            return res.status(response.status).json({ 
                error: data.error?.message || "Model API tidak ditemukan atau salah versi." 
            });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Gagal terhubung ke Gemini AI. Cek koneksi Vercel kamu." });
    }
}
