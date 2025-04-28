
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
console.log(savedList);


function checkLocal(){

if(localCHs.length < 2){
    document.getElementById('btnUpMovs').style.display = "block";
    document.getElementById('btnUpChs').style.display = "block";
    
    if (savedList.length < 2){
        document.getElementById('btnUp').style.display = "none";
    } else {
        document.getElementById('btnUp').style.display = "block";
    }
    
    document.getElementById('btnDown').style.display = "none";
    document.getElementById('btnRm').style.display = "none";

    channels = localCHs;
 }else{
    channels = JSON.parse(localStorage.getItem('localCHs'));
    document.getElementById('btnDown').style.display = "block";
    document.getElementById('btnRm').style.display = "block";
    document.getElementById('btnUpMovs').style.display = "block";
    document.getElementById('btnUpChs').style.display = "block";
    document.getElementById('btnUp').style.display = "block";
    
 }
}

checkLocal();

function saveList(){
    localStorage.setItem('savedList', JSON.stringify(channels));
    savedList = JSON.parse(localStorage.getItem('savedList'));
    console.log("Local Save List");
    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('btnUp').style.display = "block";
    
}
function upSomething(){
    console.log("Loading Something ....");
    channels = savedList;
    selectCH(channels);
    document.getElementById('btnDown').style.display = "block";
    document.getElementById('btnRm').style.display = "block";
    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('btnDel').innerHTML = "Del";

    document.getElementById('labelTest').innerHTML = "";
    document.getElementById('labelTop').innerHTML = "Local List Added";
}

function downCHs() {
    
    const originalData = channels;
    
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([JSON.stringify(originalData, null, 2)], {
        type: "text/plain"
    }));
    
    if (channels[0].name == "Select Channel"){
        console.log("Saving Channels List");
        a.setAttribute("download", "chs.txt");
    }else if (channels[0].name == "Select Movie"){
        console.log("Saving Movies List");
        a.setAttribute("download", "movs.txt");
    }else{
        console.log("Saving File List")
        a.setAttribute("download", "list_metv.txt");
    }

    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    console.log("List Downloaded");
    
}

function upMovs(){
    document.getElementById('labelTop').innerHTML = "Movies Added";
    fetch("https://appjava.github.io/metv/src/movs.txt")
    .then((res) => res.text())
    .then((text) => {
        localStorage.setItem('localCHs', text);
        channels = JSON.parse(localStorage.getItem('localCHs'));
        selectCH(channels);
        document.getElementById('btnDown').style.display = "block";
        document.getElementById('btnRm').style.display = "block";
        document.getElementById('labelTest').innerHTML = "";
    }).catch((e) => console.error(e));
    document.getElementById('btnDel').innerHTML = "Del Mov";
}

function upChs(){
    document.getElementById('labelTop').innerHTML = "Channels Added";
    fetch("https://appjava.github.io/metv/src/chs.txt")
    .then((res) => res.text())
    .then((text) => {
        localStorage.setItem('localCHs', text);
        channels = JSON.parse(localStorage.getItem('localCHs'));
        selectCH(channels);
        document.getElementById('btnDown').style.display = "block";
        document.getElementById('btnRm').style.display = "block";
        document.getElementById('labelTest').innerHTML = "";
    }).catch((e) => console.error(e));
    document.getElementById('btnDel').innerHTML = "Del Ch";
}

let select = document.getElementById("channel-select");
var ch = '';

let selectCH = (channels) => {
    document.getElementById('btnDel').style.display = "none";
    return (select.innerHTML = channels
      .map((x) => {
        let { id, name} = x;
        return `
        <option value="${id}">${name}</option>
        `;
    })
    .join(""));
}

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

function clearList(){
    channels = [];
    selectCH(channels);
    ch = "";
    localStorage.setItem('localCHs', JSON.stringify(channels));
    let localCurrent = JSON.parse(localStorage.getItem('localCHs'));
    document.getElementById('btnDel').innerHTML = "Del Item";
    if (localCurrent.length < 2){
        document.getElementById('btnDown').style.display = "none";
        document.getElementById('btnRm').style.display = "none";
        localCHs = [{
            id:     "ch0",
            name:   "Load or Test Something",
            link:   "",
        }];
        channels = localCHs;
        localStorage.setItem('localCHs', JSON.stringify(channels));
        selectCH(channels);
    }
}

function delCH(){
    let search = channels.find((x) => x.id === ch);
    channels.splice(channels.indexOf(search), 1);
    document.getElementById('labelTop').innerHTML = search.name.toUpperCase() +" "+ "Deleted";
    selectCH(channels);
    ch = "";
    playCH(ch);
    localStorage.setItem('localCHs', JSON.stringify(channels));
    let localCurrent = JSON.parse(localStorage.getItem('localCHs'));
    if (localCurrent.length < 2){
        document.getElementById('btnDown').style.display = "none";
        document.getElementById('btnRm').style.display = "none";
        localCHs = [{
            id:     "ch0",
            name:   "Load or Test Something",
            link:   "",
        }];
        channels = localCHs;
        localStorage.setItem('localCHs', JSON.stringify(channels));
        selectCH(channels);
    }
    
}

function addCH(){
    if (channels[0].name == "Load or Test Something"){
        console.log("Change Channel 0");
        channels[0].name = "Select One";
    }

    let chName = document.getElementById("nameCh").value;
    let linkCH = document.getElementById("inCh").value;

    if (linkCH.includes("http") && chName != ""){
        var lonChannels = channels.length;
        let chAdd = "ch" + (lonChannels);
        
        var chToAdd = {
            id:     chAdd,
            name:   chName,
            link:   linkCH,
        };
        channels.push(chToAdd);
        document.getElementById("nameCh").value = "";
        document.getElementById('inCh').value = "";
        
        document.getElementById('btnDown').style.display = "block";
        document.getElementById('btnRm').style.display = "block";
        selectCH(channels);
        ch = "";
        document.getElementById('labelTest').innerHTML = chName + " " + "Added to list";
        document.getElementById('labelTop').innerHTML = "";
        localStorage.setItem('localCHs', JSON.stringify(channels));
    } else {
        document.getElementById('labelTest').innerHTML = "Please enter a Name and Valid Url";
    }
}

function testCH(){
    
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
    playCH(search.link);
}

function playCH(ch){
    if (ch.includes("mp4")){
        video.src = ch;
        video.play();
    }else {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = ch;
            video.play();
          } else if (Hls.isSupported()) {
            var hls = new Hls();
            hls.loadSource(ch);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED,function() {
                video.play();
            });
          }
    }

}



