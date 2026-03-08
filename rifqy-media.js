// Setup Worker untuk PDF.js
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

async function processMedia() {
    const fileInput = document.getElementById('mediaInput');
    const action = document.getElementById('mediaAction').value;
    const status = document.getElementById('mediaStatus');
    
    if (!fileInput.files[0]) {
        alert("Harap pilih file Gambar atau PDF terlebih dahulu!");
        return;
    }

    const file = fileInput.files[0];
    const fileType = file.type;
    
    status.classList.remove('hidden');
    
    try {
        let extractedText = "";

        // JIKA FILE PDF
        if (fileType === "application/pdf") {
            status.innerText = "Mengekstrak teks dari PDF...";
            const arrayBuffer = await file.arrayBuffer();
            const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
            
            // Mengambil teks dari halaman pertama
            const page = await pdf.getPage(1);
            const textContent = await page.getTextContent();
            extractedText = textContent.items.map(item => item.str).join(' ');
            
        } 
        // JIKA FILE GAMBAR
        else if (fileType.startsWith("image/")) {
            status.innerText = "Membaca gambar (OCR)...";
            const result = await Tesseract.recognize(file, 'eng+ind');
            extractedText = result.data.text;
        } 
        else {
            throw new Error("Format file tidak didukung. Gunakan JPG, PNG, atau PDF.");
        }

        if(!extractedText.trim()) throw new Error("Tidak ada teks yang dapat dibaca pada file ini.");

        status.innerText = "Selesai! Meneruskan data...";
        
        // Eksekusi berdasarkan pilihan Dropdown
        setTimeout(() => {
            status.classList.add('hidden');
            if (action === 'translate') {
                goTab('text');
                document.getElementById('inputText').value = extractedText;
                // Jika kamu punya fungsi translate, panggil di sini
            } else if (action === 'gemini') {
                goTab('ai');
                document.getElementById('aiInput').value = `Tolong perbaiki ejaan teks ini, rapikan formatnya, dan buatkan ringkasannya:\n\n"${extractedText}"`;
                askGemini(); // Panggil fungsi dari rifqy-ai-core.js
            }
        }, 800);

    } catch(e) { 
        alert("Gagal memproses file: " + e.message); 
        status.classList.add('hidden');
    }
}
