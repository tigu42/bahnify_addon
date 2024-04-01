
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    fetch(request)
      .then(response => response.json())  
      .then(dataFromServer => {sendResponse(dataFromServer)})
      .catch(error => console.error('Error fetching data:', error));
    return true;
  }
);

