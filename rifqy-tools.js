// ==========================================
// TAB 3 & 4: CYBER TOOLS & MEDIA EXPORT
// ==========================================

function togglePwd() {
    document.getElementById('cyberPassword').classList.toggle('hidden', document.getElementById('cyberMode').value !== 'stegano');
}

function runCyber(action) {
    let mode = document.getElementById('cyberMode').value;
    let txt = document.getElementById('cyberInput').value;
    let pwd = document.getElementById('cyberPassword').value;
    let out = document.getElementById('cyberOutput');

    try {
        if(mode === 'hex') {
            out.value = action==='encode' ? txt.split('').map(c => c.charCodeAt(0).toString(16).padStart(2,'0')).join(' ') : txt.split(' ').map(h => String.fromCharCode(parseInt(h,16))).join('');
        } else if(mode === 'base64') {
            out.value = action==='encode' ? btoa(unescape(encodeURIComponent(txt))) : decodeURIComponent(escape(atob(txt)));
        } else if(mode === 'stegano') {
            if(!pwd) return alert("Password AES wajib diisi!");
            if(action === 'encode') { out.value = CryptoJS.AES.encrypt(txt, pwd).toString(); }
            else { 
                let dec = CryptoJS.AES.decrypt(txt, pwd).toString(CryptoJS.enc.Utf8);
                out.value = dec || "Password Salah/Data Rusak!";
            }
        }
    } catch(e) { out.value = "Format Error!"; }
}

async function exportToImage() {
    const text = document.getElementById('txtOutput').value;
    if(!text) return alert("Teks kosong!");
    const div = document.createElement('div');
    div.innerHTML = `<div style="background: linear-gradient(to right, #0f172a, #000); padding: 30px; color: white; border: 2px solid #3b82f6; border-radius: 10px; width: 400px; text-align: center;"><h2>RifqyTranslatePro</h2><p style="font-size:24px; margin-top:10px;">${text}</p></div>`;
    document.body.appendChild(div);
    const canvas = await html2canvas(div);
    const a = document.createElement('a'); a.href = canvas.toDataURL(); a.download = 'RifqyCard.png'; a.click();
    div.remove();
}

document.getElementById('fileInput').addEventListener('change', (e) => {
    document.getElementById('filePreview').innerHTML = `<p class="text-blue-400 font-bold mt-2">📄 ${e.target.files[0].name}</p>`;
});
