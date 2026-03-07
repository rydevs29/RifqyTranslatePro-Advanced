// File: api/gemini.js

export default async function handler(req, res) {
    // Pastikan ini adalah request POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { promptText } = req.body;
    
    // Mengambil API Key dari Vercel Environment Variables
    const apiKey = process.env.GEMINI_API_KEY;

    // Jika API Key belum dipasang di Vercel
    if (!apiKey) {
        return res.status(500).json({ 
            error: "API Key Gemini tidak ditemukan. Pastikan sudah di-set di Vercel Environment Variables." 
        });
    }

    try {
        // Melakukan request ke server Google Gemini
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
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

        // Cek jika Google mengembalikan error (misal key salah atau limit)
        if (data.error) {
            return res.status(400).json({ error: data.error.message });
        }

        // Kirim hasil sukses kembali ke Frontend (rifqy-ai-core.js)
        res.status(200).json(data);

    } catch (error) {
        console.error("Error dari API:", error);
        res.status(500).json({ error: "Gagal terhubung ke server Google Gemini." });
    }
}
