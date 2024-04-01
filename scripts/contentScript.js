console.log("start up at bahn.de");

needsRefresh = false;

const outerDetailsClass = "db-web-dropdown-outer-container reise-details";

const toHTMLtext = (plainText) => {
    return plainText.replace(/ü/g, '%C3%BC')
                    .replace(/ /g, '%20')
                    .replace(/Ä/g, '%C3%84')
                    .replace(/Ö/g, '%C3%96')
                    .replace(/Ü/g, '%C3%9C')
                    .replace(/ä/g, '%C3%A4')
                    .replace(/ö/g, '%C3%B6')
                    .replace(/ß/g, '%C3%9F')
}

const generateUrl = (change) => {
    // let url = "http://192.168.178.45:8080/api/extension/connectionProbability?"
    let url = "http://212.132.100.244:8080/api/extension/connectionProbability?"
    console.log(change.station + "-> " + toHTMLtext(change.station))
    url += "station=" + toHTMLtext(change.station);
    url += "&trainNumArr=" + change.aliasArr;
    url += "&opArr=" + change.operatorArr;
    url += "&timeArr=" + change.timeArr;
    url += "&trainNumDep=" + change.aliasDep;
    url += "&opDep=" + change.operatorDep;
    url += "&timeDep=" + change.timeDep;
    return url;
}

// allTrainChanges[i].station = journey.allStations[2*i + 1]
//allTrainChanges[i].operatorArr = journey.trainOps[i]
//allTrainChanges[i].operatorDep = journey.trainOps[i + 1]
//allTrainChanges[i].aliasArr = journey.trainAlias[i]
//allTrainChanges[i].aliasDep = journey.trainAlias[i + 1]
//allTrainChanges[i].timeArr = journey.arrivalTimes[i]
//allTrainChanges[i].timeDep = journey.departureTimes[i + 1]

const getTrainCount = (element) => (element.getElementsByClassName("db-web-button test-db-web-button db-web-button--type-secondary db-web-button--size-small zuginformationsbutton verbindungs-transfer__meldungen--zuginformationsbutton").length)

const getAllStations = (element) => {
    stationsHTML = element.getElementsByClassName("db-web-link__text test-link__text");

    

    let realcount = 0;
    for (let i = 0; i < stationsHTML.length; i++) {
        if (stationsHTML[i].getElementsByClassName("priorisierte-meldung__wrapper-text").length === 0) realcount++;
    }
    const stations = new Array(realcount)
    let index = 0;
    for (let i = 0; i < stations.length; i++) {
        if (stationsHTML[i].getElementsByClassName("priorisierte-meldung__wrapper-text").length === 0)
        { 
            stations[index] = stationsHTML[i].textContent;
            index++;
        }
    }

    // const stations = new Array(stationsHTML.length);
    return stations;
}

const getAllDepartureTimes = (element) => {
    departuresHTML = element.getElementsByClassName("verbindungs-halt__zeit-abfahrt")
    const departures = new Array(departuresHTML.length)
    for (let i = 0; i < departures.length; i++) {
        departures[i] = departuresHTML[i].textContent
    }
    return departures;
}
const getAllArrivalTimes = (element) => {
    arrivalsHTML = element.getElementsByClassName("verbindungs-halt__zeit-ankunft")
    const arrivals = new Array(arrivalsHTML.length)
    for (let i = 0; i < arrivals.length; i++) {
        arrivals[i] = arrivalsHTML[i].textContent
    }
    return arrivals;
}

const getAllLineNames = (element) => {
    LineNamesHTML = element.getElementsByClassName("test-transport-chip hydrated")
    const LineNames = new Array(LineNamesHTML.length)
    for (let i = 0; i < LineNames.length; i++) {
        LineNames[i] = LineNamesHTML[i].getAttribute("transport-text")
    }
    return LineNames;
}

const getAllTrainOperators = (linesNames) => {
    const ops = new Array(linesNames.length)
    for (let i = 0; i < ops.length; i++) {
        ops[i] = linesNames[i].split(" ")[0];
    }
    return ops
}

const getAllTrainAlias = (linesNames) => {
    const alias = new Array(linesNames.length)
    for (let i = 0; i < alias.length; i++) {
        alias[i] = linesNames[i].split(" ")[1];
    }
    return alias
}

const getJourneyInfo = (element) => {
    const trainCount = getTrainCount(element);
    console.log("train count: " + trainCount);
    const allStations = getAllStations(element);
    const departureTimes = getAllDepartureTimes(element);
    const arrivalTimes = getAllArrivalTimes(element);
    const allLineNames = getAllLineNames(element);
    if (allLineNames.length === 0) needsRefresh = true;
    const trainOps = getAllTrainOperators(allLineNames);
    const trainAlias = getAllTrainAlias(allLineNames);
    const journeyInfo = {
        trainCount: trainCount,
        allStations: allStations,
        departureTimes: departureTimes,
        arrivalTimes: arrivalTimes,
        trainOps: trainOps,
        trainAlias: trainAlias
    };
    return journeyInfo;
}

const getAllTrainChanges = (journey) => {

    const allTrainChanges = new Array(journey.trainCount - 1)

    for (let i = 0; i < journey.trainCount - 1; i++) {
        allTrainChanges[i] = {}
        allTrainChanges[i].station = journey.allStations[2*i + 1]
        allTrainChanges[i].operatorArr = journey.trainOps[i]
        allTrainChanges[i].operatorDep = journey.trainOps[i + 1]
        allTrainChanges[i].aliasArr = journey.trainAlias[i]
        allTrainChanges[i].aliasDep = journey.trainAlias[i + 1]
        allTrainChanges[i].timeArr = journey.arrivalTimes[i]
        allTrainChanges[i].timeDep = journey.departureTimes[i + 1]
    }
    return allTrainChanges;
}

function getColor(percent) {
    let hue = 0;
    let lightness = 50;
    if (percent > 0.95) {
        hue = 120;
        lightness = 45;
    }
    else if (percent > 0.9) {
        hue = 84;
        lightness = 40;
    }
    else if (percent > 0.85) {
        hue = 68;
        lightness = 40;
    }
    else if (percent > 0.80) {
        hue = 63;
        lightness = 35;
    }
    else if (percent > 0.70) {
        hue = 40;
        lightness = 40;
    }
    else if (percent > 0.50) {
        hue = 1;
        lightness = 50;
    }
    else {
        hue = 1;
        lightness = 30;
    }
    return `hsl(${hue}, 100%, ${lightness}%)`;
      
}


const injectInChange = (result, changeElement) => {
    console.log(result)
    console.log(changeElement.textContent)
    console.log("NEXT")
    if (result.summary.all_connections === 0) 
    {
        changeElement.innerHTML = "<p>(Bahnify Extension) Not enough data</p>" + changeElement.innerHTML;
        return;
    }
    changeElement.style.fontSize = "18px"
    changeElement.style.color = getColor(1 - (Number(result.summary.missed_connecting_train) +  Number(result.summary.canceled_connecting_train)) / result.summary.all_connections)
    
    changeElement.innerHTML = "<p>(Bahnify Extension) " + (100 - ((Number(result.summary.missed_connecting_train) +  Number(result.summary.canceled_connecting_train) )/ result.summary.all_connections) * 100).toFixed(1) + "% Umstiegserfolg bei "
                                 + result.summary.all_connections + " vergangenen Umstiegen. </p><p>" + result.summary.missed_connecting_train + " Anschlusszüge verpasst - " + result.summary.canceled_connecting_train + " entfallen</p> " + 
                                 "Insgesamt hat diese Verbindung " + (Number(result.summary.canceled_arriving_train) + Number(result.summary.canceled_connecting_train) + Number(result.summary.missed_connecting_train)) + " mal an " + result.summary.all_planned_journeys + 
                                 " Tagen nicht wie geplant funktioniert (inkl. entfallene Ankünfte)."
}

const injectInStations = (result, element, changeNum) => {
    stationContainers = element.getElementsByClassName("verbindungs-halt-bahnhofsinfos")

    let arrivingInfos = "<p>Pünktlichkeit " + String((result.arriving.punctuality * 100).toFixed(1)) + "% " + "bei " + String(result.arriving.trainCount) + " Zügen. ";
    arrivingInfos +=    String(Number(result.arriving.averageDelay).toFixed(1)) + " min durchschnittliche Verspätung. " + result.arriving.canceled + " mal entfallen.</p>"
    if (result.arriving.alias == null) arrivingInfos = "<p>(Bahnify) Keine Daten</p>"

    let departingInfos = "<p></p><p>Pünktlichkeit " + String((result.departing.punctuality * 100).toFixed(1)) + "% " + "bei " + String(result.departing.trainCount) + " Zügen. ";
    departingInfos +=    String(Number(result.departing.averageDelay).toFixed(1)) + " min durchschnittliche Verspätung. " + result.departing.canceled + " mal entfallen.</p>"
    if (result.departing.alias == null) departingInfos = "<p></p><p>(Bahnify) Keine Daten</p>"

    stationContainers[changeNum * 2 + 1].innerHTML += arrivingInfos;
    stationContainers[changeNum * 2 + 1].style.color = getColor(result.arriving.punctuality)
    stationContainers[changeNum * 2 + 2].innerHTML += departingInfos;
    stationContainers[changeNum * 2 + 2].style.color = getColor(result.departing.punctuality)

}

const addCopyrightDisclaimer = (element) => {

    const endElement = element.getElementsByClassName("ReiseDetailsActions reise-details__actions")

    if (endElement[0].innerHTML.includes("bahnifyDisclaimer")) return;
    endElement[0].innerHTML += "<p id=\"bahnifyDisclaimer\" style=\"font-size: 12px\">Die Reisedetails wurden durch die Browsererweiterung \"Bahnify\" verändert. Die hinzugefügten Statistiken wurden " + 
                         "aus den Fahrplan- und Fahrplanänderungsdaten der Timetables API des API Marketplace der Deutschen Bahn erzeugt. Die Daten der Timetables API unterliegen der <a style=\"color: red;\" href=\"https://creativecommons.org/licenses/by/4.0/\" target=\"_blank\">" + 
                         "Creative Commons Attribution 4.0 International (CC BY 4.0)</a> Lizenz. Um eine effiziente Speicherung und einen schnellen Zugriff zu ermöglichen, "+
                         "wurden die Daten in ein stark reduziertes Format gebracht. Dieser veränderte Datensatz weist Schwächen auf: Alternativzüge werden in den Statistiken nicht berücksichtigt. Wenn "+
                         "die Weiterfahrt eines Zuges ausfällt, so kann auch dessen Ankunft als entfallen in die Statistik einfließen. "+
                         "Die Richtigkeit der anderen erzeugten Statistiken kann ebenfalls nicht garantiert werden. Bei Verbindungen, bei denen der Umstieg über Mitternacht geht, kann " +
                         "zurzeit keine Statistik erzeugt werden. Bahnify speichert keine Nutzungsdaten.</p>"
}

const modifyDetailsPage = (element) => {
    const journey = getJourneyInfo(element);
    if (needsRefresh) return;
    const allTrainChanges = getAllTrainChanges(journey);
    addCopyrightDisclaimer(element);
    const allChangeElements = element.getElementsByClassName("verbindungs-fussweg__distanz");

    for (let i = 0; i < allTrainChanges.length; i++) {
        if (allChangeElements[i].textContent.startsWith("(Bahnify Extension)")) continue;
        const url = generateUrl(allTrainChanges[i]);
        console.log(url)
        chrome.runtime.sendMessage(url, function(response) {
            // Antwort vom Background-Service verarbeiten
            injectInChange(response, allChangeElements[i])
            injectInStations(response, element, i)
          })
    }


}

async function elementChangeHandler(elements) {
    console.log("element Change Handler called");
    for (let i = 0; i < elements.length; i++) {
        console.log("page " + (i + 1))
        modifyDetailsPage(elements[i])
    }
}

function waitForElementToDisplay(selector, callback, checkFrequencyInMs, timeoutInMs) {
    const startTime = Date.now();
    const last = 0;
    (function loopSearch(lastLength) {
        elements = document.getElementsByClassName(selector);
      if (elements.length > lastLength || needsRefresh) {
        needsRefresh = false;
        callback(elements);
      }
      lastLength = elements.length;
      setTimeout(function () {
        if (timeoutInMs && Date.now() - startTime > timeoutInMs) return;
        loopSearch(lastLength);
      }, checkFrequencyInMs);
      
    })(last);
}

waitForElementToDisplay(outerDetailsClass, elementChangeHandler, 40, 10000000);