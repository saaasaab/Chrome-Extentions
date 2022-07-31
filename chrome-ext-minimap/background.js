
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./minimap.js", ]
        })
            .then(() => {
        
            })
            .catch(err => console.log(err));


        chrome.scripting.insertCSS({
            target: { tabId: tabId },
            files: ["./minimap.css"]
        })
            .then(() => {
           
            })
            .catch(err => console.log(err));
    }
});
