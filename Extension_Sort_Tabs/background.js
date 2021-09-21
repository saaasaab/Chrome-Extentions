// GET ALL THE TABS IN THE ACTIVE WINDOW

// console.log("Sorting Tabs");
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let click = 0;
let testing = true;
chrome.browserAction.onClicked.addListener(function () {
    // chrome.tabs.create({ url: 'https://gridgoal.com' });
    // To you who sees this, I hope you have a great day. 
    let tabLinks = []
    click++;
    let activeWindow = 0;
    // chrome.windows.getCurrent(function(w) {
    //     activeWindow = w.id;

    // });

    // chrome.tabs.query({ }, function (tabs) {
    //     tabs.forEach((tb, i) => {

    //         chrome.tabs.move(tb.id, { index: i , windowId: activeWindow});
    //     });
    // })

    chrome.tabs.query({ currentWindow: true }, function (tabs) {
        const numTabs = tabs.length;

        tabs.forEach(tb => {
            tabLinks.push([tb.index, tb.id, tb.favIconUrl || ""]);
        });

        tabLinks.sort((a, b) => a[2].localeCompare(b[2]));

        if (click % 2 == 0 && testing) {
            // Randomize the order of the tabs if testing is enabled.
            tabs.forEach(tb => {
                let rand = getRandomInt(numTabs)
                chrome.tabs.move(tb.id, { index: rand });
            });
        }
        else {
            // Sort the tabLinks based on favIconUrl
            for (let i = 0; i < tabLinks.length; i++) {
                tabs.forEach(tb => {
                    if (tabLinks[i][1] == tb.id)
                        chrome.tabs.move(tb.id, { index: i})
                });
            }
        }
    });
})