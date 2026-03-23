// PDF.js Worker
const pdfjsLib = window['pdfjs-dist/build/pdf'];
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

// Media & Scanner
async function processMedia() {
    const fileInput = document.getElementById('mediaInput');
    const action = document.getElementById('mediaAction').value;
    const status = document.getElementById('mediaStatus');
    
    if (!fileInput.files[0]) return alert("Pilih file Gambar/PDF dulu!");
    const file = fileInput.files[0];
    status.classList.remove('hidden');
    
    try {
        let text = "";
        if (file.type === "application/pdf") {
            status.innerText = "Ekstrak teks PDF...";
            const pdf = await pdfjsLib.getDocument(await file.arrayBuffer()).promise;
            const page = await pdf.getPage(1);
            const content = await page.getTextContent();
            text = content.items.map(i => i.str).join(' ');
        } else if (file.type.startsWith("image/")) {
            status.innerText = "Scan OCR...";
            const result = await Tesseract.recognize(file, 'eng+ind');
            text = result.data.text;
        } else throw new Error("Format tidak valid.");

        if(!text.trim()) throw new Error("File kosong/tidak terbaca.");

        status.classList.add('hidden');
        if (action === 'translate') {
            goTab('text');
            document.getElementById('txtInput').value = text;
        } else {
            goTab('ai');
            document.getElementById('aiInput').value = `Ringkas dan terjemahkan dokumen ini: "${text}"`;
            askGemini();
        }
    } catch(e) { 
        alert(e.message); 
        status.classList.add('hidden');
    }
}

// Cyber Tools
function togglePwd() { document.getElementById('cyberPassword').classList.toggle('hidden', document.getElementById('cyberMode').value !== 'stegano'); }

function runCyber(action) {
    let mode = document.getElementById('cyberMode').value, txt = document.getElementById('cyberInput').value, pwd = document.getElementById('cyberPassword').value, out = document.getElementById('cyberOutput');
    try {
        if(mode === 'hex') out.value = action==='encode' ? txt.split('').map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ') : txt.split(' ').map(h => String.fromCharCode(parseInt(h,16))).join('');
        else if(mode === 'base64') out.value = action==='encode' ? btoa(unescape(encodeURIComponent(txt))) : decodeURIComponent(escape(atob(txt)));
        else if(mode === 'stegano') {
            if(!pwd) return alert("Password wajib!");
            out.value = action === 'encode' ? CryptoJS.AES.encrypt(txt, pwd).toString() : (CryptoJS.AES.decrypt(txt, pwd).toString(CryptoJS.enc.Utf8) || "Password Salah!");
        }
    } catch(e) { out.value = "Format Error!"; }
}
