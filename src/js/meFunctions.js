console.log("Welcome You!!");

// ==========================================
// 1. CACHÉ DEL DOM (Optimización de Rendimiento)
// ==========================================
const DOM = {
    video: document.getElementById('video'),
    labelTop: document.getElementById('labelTop'),
    labelTest: document.getElementById('labelTest'),
    btnDown: document.getElementById('btnDown'),
    btnRm: document.getElementById('btnRm'),
    btnExp: document.getElementById('btnExp'),
    btnDel: document.getElementById('btnDel'),
    btnUp: document.getElementById('btnUp'),
    btnUpList: document.getElementById('btnUpList'),
    btnUpChs: document.getElementById('btnUpChs'),
    select: document.getElementById('channel-select'),
    inCh: document.getElementById('inCh'),
    nameCh: document.getElementById('nameCh'),
    fileInput: document.getElementById('fileInput')
};

// ==========================================
// 2. HELPERS (Funciones de ayuda para LocalStorage)
// ==========================================
function getLocalChannels() {
    try {
        const local = JSON.parse(localStorage.getItem('localCHs'));
        return (Array.isArray(local) && local.length > 0) ? local : getDefaultChannel();
    } catch {
        return getDefaultChannel();
    }
}

function getSavedList() {
    try {
        const saved = JSON.parse(localStorage.getItem('savedList'));
        return (Array.isArray(saved) && saved.length > 0) ? saved : getDefaultSavedList();
    } catch {
        return getDefaultSavedList();
    }
}

function saveLocalChannels(data) {
    localStorage.setItem('localCHs', JSON.stringify(data));
}

function getDefaultChannel() {
    return [{ id: "ch0", name: "Load or Test Something", link: "" }];
}

function getDefaultSavedList() {
    return [{ id: "ch0", name: "Saved List", link: "" }];
}

// ==========================================
// 3. ESTADO GLOBAL
// ==========================================
let channels = getLocalChannels();
let savedList = getSavedList();
let ch = '';

// Guarda las instancias de los reproductores globalmente
window.hlsPlayer = null;
window.mpegtsPlayer = null;

// Inicializamos la UI
updateAndRenderChannels();


// ==========================================
// 4. LÓGICA DE LISTAS GUARDADAS (Saved List)
// ==========================================
function saveList() {
    localStorage.setItem('savedList', JSON.stringify(channels));
    savedList = getSavedList();
    console.log("Local Save List");
    
    // Uso de textContent para prevenir XSS
    if(DOM.labelTest) DOM.labelTest.textContent = "";
    if(DOM.labelTop) DOM.labelTop.textContent = "List saved";
    if(DOM.btnUp) DOM.btnUp.style.display = "block";
}

function upSaved() {
    console.log("Loading saved list ....");
    channels = getSavedList();
    updateAndRenderChannels();
    
    if(DOM.btnDown) DOM.btnDown.style.display = "block";
    if(DOM.btnRm) DOM.btnRm.style.display = "block";
    if(DOM.btnExp) DOM.btnExp.style.display = "block";
    
    if(DOM.btnDel) DOM.btnDel.textContent = "Del Item";
    if(DOM.labelTest) DOM.labelTest.textContent = "";
    if(DOM.labelTop) DOM.labelTop.textContent = "Saved List Added";
}

// ==========================================
// 5. EXPORTACIÓN A M3U CON AUTO-NOMBRE
// ==========================================
function downCHs() {
    let m3uContent = "#EXTM3U\n";
    
    // Convertimos el array JSON a texto M3U estándar
    channels.forEach(canal => {
        // Opcional: Podrías ignorar el canal "ch0" si no quieres exportar el placeholder
        m3uContent += `#EXTINF:-1 tvg-id="${canal.id}", ${canal.name}\n${canal.link}\n`;
    });

    const blob = new Blob([m3uContent], { type: "audio/x-mpegurl" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    // Generar nombre automático basado en la hora (Ej: List_Saved_10-40-55.m3u)
    const now = new Date();
    const pad = (n) => n.toString().padStart(2, '0');
    const timeString = `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
    const filename = `List_Saved_${timeString}.m3u`;

    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(a.href); // Libera memoria
    
    console.log(`List Downloaded: ${filename}`);
}


// ==========================================
// 6. LECTURA Y CARGA DE ARCHIVOS (M3U / JSON)
// ==========================================
function parseM3U(text) {
    const lines = text.split('\n');
    const parsedChannels = [
        { id: "ch0", name: "Select Channel", link: "#" }
    ];
    let currentName = null;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        if (line.startsWith('#EXTINF:')) {
            const parts = line.split(',');
            currentName = parts[parts.length - 1].trim();
        } else if (!line.startsWith('#') && currentName) {
            parsedChannels.push({
                name: currentName,
                link: line
            });
            currentName = null;
        }
    }
    return parsedChannels;
}

function upList() {
    const file = DOM.fileInput.files[0];
    if (!file) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            let loadedChannels = [];

            if (text.includes('#EXTM3U') || text.includes('#EXTINF:')) {
                loadedChannels = parseM3U(text);
            } else {
                loadedChannels = JSON.parse(text);
            }

            if (Array.isArray(loadedChannels) && loadedChannels.length > 0) {
                channels = loadedChannels;
                updateAndRenderChannels();
                
                if(DOM.labelTop) DOM.labelTop.textContent = "List Loaded Added";
                if(DOM.labelTest) {
                    DOM.labelTest.textContent = "";
                    DOM.labelTest.style.color = "gray";
                }
            } else {
                alert("El archivo cargado está vacío o no tiene el formato correcto.");
            }
        } catch (error) {
            console.error("Error al parsear el archivo:", error);
            alert("Error al cargar la lista. Asegúrate de que sea un JSON o M3U válido.");
        }
    };

    reader.onerror = function(e) {
        console.error("Error al leer el archivo", e);
        alert("Error al leer el archivo.");
    };

    reader.readAsText(file);
}

// ==========================================
// 7. CARGA DE LISTAS REMOTAS (Async/Await)
// ==========================================
async function upMovs() {
    if(DOM.labelTop) DOM.labelTop.textContent = "Movies Added";
    try {
        const res = await fetch("https://appjava.github.io/metv/src/movs.txt");
        const text = await res.text();
        channels = JSON.parse(text);
        updateAndRenderChannels();
    } catch (e) {
        console.error("Error al cargar películas:", e);
    }
    if(DOM.btnDel) DOM.btnDel.textContent = "Del Mov";
}

async function upChs() {
    if(DOM.labelTop) DOM.labelTop.textContent = "Default Channels Added";
    try {
        const res = await fetch("https://appjava.github.io/metv/src/chs.txt");
        const text = await res.text();
        channels = JSON.parse(text);
        updateAndRenderChannels();
    } catch (e) {
        console.error("Error al cargar canales por defecto:", e);
    }
    if(DOM.btnDel) DOM.btnDel.textContent = "Del Ch";
}


// ==========================================
// 8. RENDERIZADO Y CONTROL DEL DOM (UI)
// ==========================================
function updateAndRenderChannels() {
    // 1. Reasignar IDs secuencialmente
    channels = channels.map((canal, index) => {
        return { ...canal, id: "ch" + index };
    });

    // 2. Guardar la lista actualizada
    saveLocalChannels(channels);

    // 3. Crear opciones de forma segura (Previene XSS)
    if (DOM.select) {
        // Guardamos el canal seleccionado actualmente para no perderlo
        const currentSelectedId = DOM.select.value;
        
        DOM.select.innerHTML = ""; // Limpiamos opciones
        
        channels.forEach(x => {
            const option = document.createElement("option");
            option.value = x.id;
            option.textContent = x.name; // SEGURO: Evita inyección HTML
            DOM.select.appendChild(option);
        });

        // Intentamos restaurar la selección
        if (currentSelectedId && DOM.select.querySelector(`option[value="${currentSelectedId}"]`)) {
            DOM.select.value = currentSelectedId;
        }
    }

    // 4. Actualizar botones según la longitud
    const localCurrent = getLocalChannels();
    if (localCurrent.length < 2) {
        if(DOM.btnDown) DOM.btnDown.style.display = "none";
        if(DOM.btnRm) DOM.btnRm.style.display = "none";
        if(DOM.btnExp) DOM.btnExp.style.display = "none";
        if(DOM.btnDel) DOM.btnDel.style.display = "none";
        if(DOM.btnUpChs) DOM.btnUpChs.style.display = "block";
        if(DOM.btnUpList) DOM.btnUpList.style.display = "block";
    } else {
        if(DOM.btnDown) DOM.btnDown.style.display = "block";
        if(DOM.btnRm) DOM.btnRm.style.display = "block";
        if(DOM.btnExp) DOM.btnExp.style.display = "block";
        if(DOM.btnDel) DOM.btnDel.style.display = "block";
        if(DOM.btnUp) DOM.btnUp.style.display = "block";
        if(DOM.btnUpList) DOM.btnUpList.style.display = "block";
        if(DOM.btnUpChs) DOM.btnUpChs.style.display = "block";
    }

    // Protecciones de Placeholders y SavedList
    if (channels.length > 0 && channels[0].id === "ch0" && channels[0].name === "Load or Test Something") {
        if(DOM.btnDel) DOM.btnDel.style.display = "none";
    }
    if (savedList.length < 2){
        if(DOM.btnUp) DOM.btnUp.style.display = "none";
    } else {
        if(DOM.btnUp) DOM.btnUp.style.display = "block";
    }
}

// ==========================================
// 9. CONTROLADORES DE EVENTOS DE CANALES
// ==========================================
function played() {
    if (!DOM.select) return;
    const channelSelected = DOM.select.value;
    ch = channelSelected;

    if (channelSelected !== "ch0"){
        changeCH();
        if(DOM.btnDel) DOM.btnDel.style.display = "block";
    } else {
        changeCH();
        if(DOM.btnDel) DOM.btnDel.style.display = "none";
    }
}

function clearList() {
    channels = getDefaultChannel();
    ch = "";
    updateAndRenderChannels();
    
    if(DOM.labelTop) DOM.labelTop.textContent = "List Cleared";
    playCH(""); // Detiene la reproducción
}

function delCH() {
    let search = channels.find((x) => x.id === ch);
    if (search) {
        channels = channels.filter((item) => item.id !== ch);
        if(DOM.labelTop) DOM.labelTop.textContent = search.name.toUpperCase() + " Deleted";
        
        updateAndRenderChannels();
        ch = "";
        playCH(""); 
    }
}

function addCH() {
    if (channels[0].name === "Load or Test Something") {
        channels[0].name = "Select Something"; 
    }

    let chName = DOM.nameCh.value;
    let linkCH = DOM.inCh.value;

    if (linkCH.includes("http") && chName.trim() !== "") {
        let chToAdd = {
            id: "temp_id",
            name: chName,
            link: linkCH,
        };
        channels.push(chToAdd);

        DOM.nameCh.value = "";
        DOM.inCh.value = "";

        updateAndRenderChannels();

        if(DOM.labelTest) {
            DOM.labelTest.textContent = chName + " Added to list";
            DOM.labelTest.style.color = "gray";
        }
        if(DOM.labelTop) DOM.labelTop.textContent = "";
    } else {
        if(DOM.labelTest) {
            DOM.labelTest.textContent = "Please enter a Name and Valid Url";
            DOM.labelTest.style.color = "red";
        }
    }
}

function testCH() {
    if(DOM.labelTest) DOM.labelTest.style.color = "yellow";
    if(DOM.labelTop) DOM.labelTop.textContent = "";
    
    ch = DOM.inCh.value;
    
    if (ch.includes("http")){
        if(DOM.labelTest) DOM.labelTest.textContent = "Testing...";
        playCH(ch);
    } else {
        if(DOM.labelTest) DOM.labelTest.textContent = "Please enter a valid url";
    }
}

function changeCH() {
    DOM.inCh.value = "";
    if(DOM.labelTest) DOM.labelTest.textContent = "";
    if(DOM.labelTop) DOM.labelTop.textContent = "";
    
    ch = DOM.select.value;
    let search = channels.find((x) => x.id === ch);
    
    if(search) {
        console.log("Playing:", search.link);
        playCH(search.link);
        if(DOM.labelTest) {
            DOM.labelTest.textContent = search.link;
            DOM.labelTest.style.color = "gray";
        }
    }
}

// ==========================================
// 10. LÓGICA DE REPRODUCCIÓN (Video Player)
// ==========================================
function playCH(channelLink) {
    console.log("Limpiando reproductor anterior...");
    
    if (window.hlsPlayer) {
        window.hlsPlayer.destroy();
        window.hlsPlayer = null;
    }
    if (window.mpegtsPlayer) {
        window.mpegtsPlayer.destroy();
        window.mpegtsPlayer = null;
    }
    DOM.video.src = ""; 

    if (!channelLink) return;

    // Uso de proxies
    const proxyCORSUrl = "https://cors-proxy.cooks.fyi/";
    const proxyBaseUrl = "https://meprox.onrender.com/proxy?url=";
    let finalUrl = channelLink;
    let isHttpStream = channelLink.startsWith("http://");

    if (isHttpStream) {
        finalUrl = proxyBaseUrl + encodeURIComponent(channelLink);
    }
    if (channelLink.includes("pluto.tv")){
        finalUrl = proxyCORSUrl + channelLink;
    }

    // CASO 1: MP4
    if (channelLink.includes(".mp4")) {
        console.log("Tipo detectado: MP4. Reproduciendo directamente.");
        DOM.video.src = finalUrl;
        DOM.video.play().catch(e => console.error("Error al reproducir MP4:", e));
        return;
    }

    // CASO 2: HTTP Stream -> mpegts.js
    if (isHttpStream) {
        console.log("Tipo detectado: HTTP Stream. Usando mpegts.js.");
        if (typeof mpegts !== 'undefined' && mpegts.isSupported()) {
            const player = mpegts.createPlayer({
                type: 'mse',
                isLive: true,
                url: finalUrl
            });
            window.mpegtsPlayer = player;
            player.attachMediaElement(DOM.video);
            player.load();
            player.play().catch(e => console.error("Error mpegts.js:", e));
        } else {
            console.error("mpegts.js no está definido o soportado.");
        }
        return;
    }

    // CASO 3: HTTPS Stream -> hls.js
    if (!isHttpStream) {
        console.log("Tipo detectado: HTTPS Stream. Usando hls.js.");
        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            const hls = new Hls();
            window.hlsPlayer = hls;
            hls.loadSource(finalUrl);
            hls.attachMedia(DOM.video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                DOM.video.play().catch(e => console.error("Error hls.js:", e));
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error('Error fatal de HLS:', data.type, data.details);
                }
            });
        } else if (DOM.video.canPlayType('application/vnd.apple.mpegurl')) {
            // Soporte HLS nativo para Safari (macOS/iOS)
            DOM.video.src = finalUrl;
            DOM.video.addEventListener('loadedmetadata', () => DOM.video.play());
        } else {
            console.error("HLS no es soportado en este navegador.");
        }
    }
}