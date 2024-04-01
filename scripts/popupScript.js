
function modifyList(stations) {
    const list = document.getElementById("stationList")
    let htmlAdd = ""
    for (let i = 0; i < stations.length; i++) {
        htmlAdd += "<li>" + stations[i] + "</li>"
    }
    list.innerHTML = htmlAdd
}


function onButtonClick() {
    fetch("http://212.132.100.244:8080/api/data/stations")
        .then(response => response.json())  
        .then(dataFromServer => {modifyList(dataFromServer)})
        .catch(error => console.error('Error fetching data:', error));
}



document.getElementById("stationButton").addEventListener("click", onButtonClick);

