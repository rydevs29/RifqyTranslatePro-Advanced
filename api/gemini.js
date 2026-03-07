// File: api/gemini.js (VERSI PERBAIKAN)

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
        // PERBAIKAN: Menggunakan v1beta (angka 1) dan endpoint yang benar
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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

        // Cek jika ada error dari Google (seperti model not found atau salah versi)
        if (data.error) {
            console.error("Google API Error:", data.error);
            return res.status(data.error.code || 400).json({ 
                error: data.error.message 
            });
        }

        res.status(200).json(data);

    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ error: "Gagal terhubung ke Gemini AI. Cek koneksi atau API Key." });
    }
}
