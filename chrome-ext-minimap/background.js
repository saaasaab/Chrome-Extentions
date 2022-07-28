
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ["./minimap.js", ]
        })
            .then(() => {
                console.log(`Executing script`)
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








// if (chrome && chrome.tabs && chrome.tabs.onUpdated) {
//     chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
//         if (changeInfo.status == 'complete' && tab.active) {
//             console.log(`tab.active, tab`, tab.active, tab)
//             // do your things
//             createMiniMap()
//             addMinMapClick()

//         }
//     })
// }