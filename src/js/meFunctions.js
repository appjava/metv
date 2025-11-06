
console.log("Welcome You!!");

var video = document.getElementById('video');
var channels = [];
var localCHs = JSON.parse(localStorage.getItem('localCHs')) || [{
    id:     "ch0",
    name:   "Load or Test Something",
    link:   ""
}];

var savedList = JSON.parse(localStorage.getItem('savedList')) || [{
    id:     "ch0",
    name:   "Saved List",
    link:   ""
}];
//console.log(savedList);

// Inicializa channels con localCHs o el valor por defecto
var channels = JSON.parse(localStorage.getItem('localCHs')) || [{
    id: "ch0",
    name: "Load or Test Something",
    link: ""
}];

// Llama a la función para inicializar IDs, guardar y renderizar la lista
updateAndRenderChannels();


/*function checkLocal(){

if(localCHs.length < 2){
    //document.getElementById('btnUpMovs').style.display = "block";
    document.getElementById('btnUpChs').style.display = "block";
    document.getElementById('btnUpList').style.display = "block";
    
    document.getElementById('btnDown').style.display = "none";
    document.getElementById('btnRm').style.display = "none";
    document.getElementById('btnExp').style.display = "none";

    channels = localCHs;
 }else{
    channels = JSON.parse(localStorage.getItem('localCHs'));
    document.getElementById('btnDown').style.display = "block";
    document.getElementById('btnRm').style.display = "block";
    document.getElementById('btnExp').style.display = "block";
    //document.getElementById('btnUpMovs').style.display = "block";
    document.getElementById('btnUpList').style.display = "block";
    document.getElementById('btnUpChs').style.display = "block";
    document.getElementById('btnUp').style.display = "block";
    
 }

 if (savedList.length < 2){
    document.getElementById('btnUp').style.display = "none";
    } else {
    document.getElementById('btnUp').style.display = "block";
}
}*/

//checkLocal();

function saveList(){
    localStorage.setItem('savedList', JSON.stringify(channels));
    savedList = JSON.parse(localStorage.getItem('savedList'));
    console.log("Local Save List");
    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('labelTop').innerHTML = "List saved";
    document.getElementById('btnUp').style.display = "block";
    
}
function upSaved(){
    console.log("Loading saved list ....");
    channels = JSON.parse(localStorage.getItem('savedList'));
    selectCH(channels);
    document.getElementById('btnDown').style.display = "block";
    document.getElementById('btnRm').style.display = "block";
    document.getElementById('btnExp').style.display = "block";
    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('btnDel').innerHTML = "Del Item";

    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('labelTop').innerHTML = "Saved List Added";
}

function downCHs() {
    const originalData = channels; // channels ya tiene los IDs reasignados y está limpia

    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 2)], {
        type: "text/plain"
    }));

    let nameList = prompt('Nombre del archivo para la lista (ej: MiLista)?');
    let nameListSaved = nameList ? nameList + ".txt" : "list_metv.txt"; // Nombre por defecto si no se ingresa nada

    a.setAttribute("download", nameListSaved);

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("List Downloaded");
}
function upList() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert("Por favor, selecciona un archivo.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const text = e.target.result;
            let loadedChannels = JSON.parse(text);

            // Asegúrate de que los canales cargados sean un array
            if (Array.isArray(loadedChannels)) {
                channels = loadedChannels;
                updateAndRenderChannels(); // Reasigna IDs, guarda y renderiza
                document.getElementById('labelTop').innerHTML = "List Loaded Added";
                document.getElementById('labelTest').innerHTML = ""; // Limpiar mensaje de prueba
                document.getElementById('labelTest').style.color = "gray";
            } else {
                alert("El archivo cargado no tiene un formato JSON de lista de canales válido.");
            }
        } catch (error) {
            console.error("Error al parsear el archivo JSON:", error);
            alert("Error al cargar la lista. Asegúrate de que el archivo sea un JSON válido.");
        }
    };

    reader.onerror = function(e) {
        console.error("Error al leer el archivo", e);
        alert("Error al leer el archivo.");
    };

    reader.readAsText(file);
}
function upMovs() {
    document.getElementById('labelTop').innerHTML = "Movies Added";
    fetch("https://appjava.github.io/metv/src/movs.txt")
        .then((res) => res.text())
        .then((text) => {
            localStorage.setItem('localCHs', text);
            channels = JSON.parse(localStorage.getItem('localCHs'));
            updateAndRenderChannels(); // Llama aquí
        })
        .catch((e) => console.error(e));
    document.getElementById('btnDel').innerHTML = "Del Mov"; // Esto parece ser un texto estático, ¿quizás debería ser dinámico?
}

function upChs() {
    document.getElementById('labelTop').innerHTML = "Default Channels Added";
    fetch("https://appjava.github.io/metv/src/chs.txt")
        .then((res) => res.text())
        .then((text) => {
            localStorage.setItem('localCHs', text);
            channels = JSON.parse(localStorage.getItem('localCHs'));
            updateAndRenderChannels(); // Llama aquí
        })
        .catch((e) => console.error(e));
    document.getElementById('btnDel').innerHTML = "Del Ch"; // Esto también
}

let select = document.getElementById("channel-select");
var ch = '';

let selectCH = (channelsToDisplay) => {
    // Si la función updateAndRenderChannels se encarga de todo el rendering,
    // esta función selectCH podría simplemente llamar a updateAndRenderChannels
    // o ser más ligera si solo necesitas actualizar el <select> en ciertos casos.
    // Para simplificar, haremos que selectCH solo renderice, y updateAndRenderChannels
    // se encargue de la lógica de IDs y guardado.

    // La lógica de display "none" para btnDel la moveremos a updateAndRenderChannels
    // para que sea consistente después de cualquier cambio en la lista.
    // document.getElementById('btnDel').style.display = "none";

    if (select) {
        select.innerHTML = channelsToDisplay
            .map((x) => `<option value="${x.id}">${x.name}</option>`)
            .join("");
    }

    // Si hay un canal seleccionado, asegúrate de que se mantenga seleccionado
    if (ch && select.querySelector(`option[value="${ch}"]`)) {
        select.value = ch;
    } else if (channelsToDisplay.length > 0) {
        select.value = channelsToDisplay[0].id; // Selecciona el primero por defecto
        ch = channelsToDisplay[0].id; // Actualiza la variable 'ch'
    } else {
        ch = ""; // No hay canales
    }
};

function played(){
    const channelSelected = document.getElementById('channel-select').value;
    const ch = channelSelected;
    
    if (channelSelected != "ch0"){
        changeCH(ch);
        document.getElementById('btnDel').style.display = "block";
    }else{
        changeCH(ch);
        document.getElementById('btnDel').style.display = "none";
    }
}

selectCH(channels);

function clearList() {
    channels = [{
        id: "ch0",
        name: "Load or Test Something",
        link: ""
    }]; // Deja el placeholder inicial si lo usas
    ch = "";
    updateAndRenderChannels(); // Reasigna IDs (solo ch0), guarda y renderiza
    document.getElementById('labelTop').innerHTML = "List Cleared";
    playCH(""); // Detiene la reproducción
}

function delCH() {
    let search = channels.find((x) => x.id === ch); // Encuentra el canal a eliminar
    if (search) {
        // Filtra la lista para eliminar el canal
        channels = channels.filter((item) => item.id !== ch);

        // Opcional: Mostrar el nombre del canal eliminado
        document.getElementById('labelTop').innerHTML = search.name.toUpperCase() + " " + "Deleted";

        // Vuelve a generar los IDs y actualiza el almacenamiento local y la interfaz
        updateAndRenderChannels();
        ch = ""; // Resetea la selección actual
        playCH(""); // Detiene la reproducción o reproduce un canal por defecto si es necesario
    }
}
function updateAndRenderChannels() {
    // 1. Reasignar IDs secuencialmente
    channels = channels.map((channel, index) => {
        return {
            ...channel,
            id: "ch" + index // Reasigna IDs desde "ch0", "ch1", etc.
        };
    });

    // 2. Guardar la lista actualizada en localStorage
    localStorage.setItem('localCHs', JSON.stringify(channels));

    // 3. Actualizar el selector de canales en la interfaz de usuario
    let select = document.getElementById("channel-select");
    if (select) {
        select.innerHTML = channels
            .map((x) => `<option value="${x.id}">${x.name}</option>`)
            .join("");
    }

    // 4. Actualizar el estado de los botones (Down, Rm, Exp) basado en la longitud de la lista
    // (Asegúrate de tener esta lógica también en clearList y addCH)
    const localCurrent = JSON.parse(localStorage.getItem('localCHs'));
    if (localCurrent.length < 2) { // Si solo hay un elemento (o menos, como "Load or Test Something")
        document.getElementById('btnDown').style.display = "none";
        document.getElementById('btnRm').style.display = "none";
        document.getElementById('btnExp').style.display = "none";
        // Si tienes un canal por defecto como "Load or Test Something", asegúrate de que no se pueda eliminar si es el único.
        document.getElementById('btnDel').style.display = "none";

        document.getElementById('btnUpChs').style.display = "block";
        document.getElementById('btnUpList').style.display = "block";
    } else {
        document.getElementById('btnDown').style.display = "block";
        document.getElementById('btnRm').style.display = "block";
        document.getElementById('btnExp').style.display = "block";
        document.getElementById('btnDel').style.display = "block"; // Permite eliminar si hay más de 1
        document.getElementById('btnUp').style.display = "block";

        document.getElementById('btnUpList').style.display = "block";
        document.getElementById('btnUpChs').style.display = "block";
    }

    // Asegúrate de que el primer elemento (si existe y es el placeholder) no se pueda seleccionar para eliminar
    if (channels.length > 0 && channels[0].id === "ch0" && channels[0].name === "Load or Test Something") {
        document.getElementById('btnDel').style.display = "none";
    }
    if (savedList.length < 2){
        document.getElementById('btnUp').style.display = "none";
        } else {
        document.getElementById('btnUp').style.display = "block";
    }
}

function addCH() {
    if (channels[0].name == "Load or Test Something") {
        console.log("Change Channel 0");
        channels[0].name = "Select Something"; // O simplemente eliminar este placeholder si ya no es necesario
    }

    let chName = document.getElementById("nameCh").value;
    let linkCH = document.getElementById("inCh").value;

    if (linkCH.includes("http") && chName !== "") {
        // No necesitas lonChannels ni chAdd aquí porque updateAndRenderChannels los reasignará.
        let chToAdd = {
            id: "temp_id", // Un ID temporal, será reasignado
            name: chName,
            link: linkCH,
        };
        channels.push(chToAdd);

        document.getElementById("nameCh").value = "";
        document.getElementById('inCh').value = "";

        // Llama a la nueva función para reasignar IDs, guardar y renderizar
        updateAndRenderChannels();

        // Muestra mensaje de éxito
        document.getElementById('labelTest').innerHTML = chName + " " + "Added to list";
        document.getElementById('labelTop').innerHTML = "";
        document.getElementById('labelTest').style.color = "gray"; // Restablece color si se cambió
    } else {
        document.getElementById('labelTest').innerHTML = "Please enter a Name and Valid Url";
        document.getElementById('labelTest').style.color = "red";
    }
}

function testCH(){
    document.getElementById('labelTest').style.color = "yellow";
    document.getElementById('labelTop').innerHTML = "";
    ch = document.getElementById('inCh').value;
    if (ch.includes("http")){
        document.getElementById('labelTest').innerHTML = "Testing ...";
        playCH(ch);
        selectCH(channels); 
    } else {
        document.getElementById('labelTest').innerHTML = "Please enter a valid url";
    }
    
}

function changeCH(){
    document.getElementById('inCh').value = "";
    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('labelTop').innerHTML = "";
    ch = document.getElementById('channel-select').value;
    let search = channels.find((x) => x.id === ch)
    console.log(search.link);
    playCH(search.link);
    document.getElementById('labelTest').innerHTML = search.link;
    document.getElementById('labelTest').style.color = "gray";
}

// Guarda las instancias de los reproductores globalmente para poder destruirlas
window.hlsPlayer = null;
window.mpegtsPlayer = null;

function playCH(ch) {
    // --- 1. Limpiar reproductores y video anteriores ---
    console.log("Limpiando reproductor anterior...");
    if (window.hlsPlayer) {
        window.hlsPlayer.destroy();
        window.hlsPlayer = null;
    }
    if (window.mpegtsPlayer) {
        window.mpegtsPlayer.destroy();
        window.mpegtsPlayer = null;
    }
    video.src = ""; // Detiene y limpia la fuente del video

    // Si no hay canal, no hacemos nada más
    if (!ch) {
        return;
    }

    // --- 2. Configurar la URL final y determinar el tipo de stream ---
    const proxyCORSUrl = "https://cors-proxy.cooks.fyi/";
    const proxyBaseUrl = "https://meprox.onrender.com/proxy?url=";
    let finalUrl = ch;
    let isHttpStream = ch.startsWith("http://");

    if (isHttpStream) {
        finalUrl = proxyBaseUrl + encodeURIComponent(ch);
        //finalUrl = ch;
    }
    if (ch.includes("pluto.tv")){
        finalUrl = proxyCORSUrl + ch;
        console.log("finallUrl: ");
        console.log(finalUrl);
    }

    // --- 3. Lógica de selección de reproductor ---

    // CASO 1: Es un archivo MP4 (tiene prioridad)
    if (ch.includes(".mp4")) {
        console.log("Tipo detectado: MP4. Reproduciendo directamente.");
        video.src = finalUrl;
        video.play().catch(e => console.error("Error al reproducir MP4:", e));
        return;
    }

    // CASO 2: Es un stream HTTP (no .mp4), usamos mpegts.js
    if (isHttpStream) {
        console.log("Tipo detectado: HTTP Stream. Usando mpegts.js.");
        if (mpegts.isSupported()) {
            const player = mpegts.createPlayer({
                type: 'mse',
                isLive: true,
                url: finalUrl
            });
            window.mpegtsPlayer = player;
            player.attachMediaElement(video);
            player.load();
            player.play().catch(e => console.error("Error al reproducir con mpegts.js:", e));
        } else {
            console.error("mpegts.js no es soportado en este navegador.");
        }
        return;
    }
    
    // CASO 3: Es un stream HTTPS (no .mp4), usamos hls.js
    if (!isHttpStream) {
        console.log("Tipo detectado: HTTPS Stream. Usando hls.js.");
        if (Hls.isSupported()) {
            const hls = new Hls();
            window.hlsPlayer = hls;
            hls.loadSource(finalUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function() {
                video.play().catch(e => console.error("Error al reproducir con hls.js:", e));
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    console.error('Error fatal de HLS:', data.type, data.details);
                }
            });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Soporte HLS nativo para Safari
            video.src = finalUrl;
            video.addEventListener('loadedmetadata', () => video.play());
        } else {
             console.error("HLS no es soportado en este navegador.");
        }
        return;
    }
}



