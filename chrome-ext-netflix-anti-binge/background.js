/*
On install, it adds a listen.
On load it adds a listen.
Listen for Netflix

Get all the Binge Blockers from local storage
*/



// Get the current selector with example.video.currentEpisode
// Get the next episode by putting all the seasons.episodes in a list, find the next one labeled episodeId
// set a timer for 5 minutes to activate the lock
// on lock, add the current episode and the next episode to local storage with expiration date of 1-24 hours
// on load check the expiration of all locks and remove all that have expired.
// add option to change lock duration and to unlock ALL locks
// disable next button
// On disabled video, replace the page html with a LOCKED screen and a countdown.

// 1. Check page 


let pulledData = false;
let currentDetailsObj = {}
let currentPage = "";


// executeScript runs this code inside the tab
function inContent1(expiration) {
    function convertSecondsToTimeString(seconds) {
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
        const secs = seconds - (hours * 60 * 60) - (minutes * 60);
      
        const isPlural = (num)=>num > 1 ? "s" : "";
        let timeString = "";
        if (hours > 0) {
          timeString = `${hours} hour${isPlural(hours)} ${minutes} minute${isPlural(minutes)} ${secs} second${isPlural(secs)}`;
        }
        else if (minutes > 0) {
          timeString = `${minutes} minute${isPlural(minutes)} ${secs} second${isPlural(secs)}`;
        }
        else {
          timeString = `${secs} second${isPlural(secs)}`;
        }
        return timeString;
      }
    function waitForElement(selector, cb) {
        let timesRan = 0;
        const waitInterval = setInterval(() => {
            // Check that necessary element for injection exists
            let el = document.querySelector(selector);

            timesRan++;
            // Don't let this run over 100 times
            if (timesRan > 100) {
                clearInterval(waitInterval);
            }
            if (el) {
                clearInterval(waitInterval);

                cb(el);
            }
        }, 300);
    }


    const el = document.querySelector('body');

    const html = `
   
<style>
.nab-lock-screen {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 3rem;
    align-items: center;
    height: 100vh;
}

.nab-top-text,
.nab-bottom-text {
    font-size: 8rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.nab-bottom-text #nab-time-left{
    margin: 0;
}

#nab-timer {
    width: 200px;
    height: 200px;
    position: relative;
}

svg {
    width: 100%;
    height: 100%;
}

circle {
    fill: none;
    stroke: #E50914;
    stroke-width: 5px;
}

#nab-progress {
    stroke: #141414;
    stroke-dasharray: 282.74;
    stroke-dashoffset: 282.74;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1s linear;
    stroke-width: 11px;
}

#nab-bg-circle {
    fill: none;
   stroke: #E50914;
    stroke-width: 10px;
}
#nab-lock-icon{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    width: 50%;
    height: 50%;
    stroke: none;
    fill: #E50914;
}
</style>

<div class="nab-lock-screen">
    <div class="nab-top-text">Your show is locked for</div>
    <div class="nab-countdown">
        <div id="nab-timer">
            <svg viewBox="0 0 100 100">
                <circle id="nab-bg-circle" cx="50" cy="50" r="45"></circle>
                <circle id="nab-progress"  cx="50" cy="50" r="45"></circle>
            </svg>

            <svg id='nab-lock-icon' width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 21C1.45 21 0.979333 20.8043 0.588 20.413C0.196 20.021 0 19.55 0 19V9C0 8.45 0.196 7.979 0.588 7.587C0.979333 7.19567 1.45 7 2 7H3V5C3 3.61667 3.48767 2.43733 4.463 1.462C5.43767 0.487333 6.61667 0 8 0C9.38333 0 10.5627 0.487333 11.538 1.462C12.5127 2.43733 13 3.61667 13 5V7H14C14.55 7 15.021 7.19567 15.413 7.587C15.8043 7.979 16 8.45 16 9V19C16 19.55 15.8043 20.021 15.413 20.413C15.021 20.8043 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.021 15.8043 9.413 15.413C9.80433 15.021 10 14.55 10 14C10 13.45 9.80433 12.979 9.413 12.587C9.021 12.1957 8.55 12 8 12C7.45 12 6.97933 12.1957 6.588 12.587C6.196 12.979 6 13.45 6 14C6 14.55 6.196 15.021 6.588 15.413C6.97933 15.8043 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"/>
            </svg>
        </div>

    </div>
    <div class="nab-bottom-text">
        <p id="nab-time-left"></p>
    </div>
</div>`;



    waitForElement("video", (waitedEl) => {
        waitedEl.pause();
        el.innerHTML = html;

        const progress = document.getElementById("nab-progress" );
        const timeLeft = document.getElementById("nab-time-left");

        // set the countdown time in seconds
        const now = new Date().getTime();
        const countdownTime = 18 * 60 * 60;

        let currentTime = Math.round((expiration - now) / 1000);
        // update the nab-timer every second
        const updateTimer = setInterval(() => {
            currentTime--;
            timeLeft.innerHTML = convertSecondsToTimeString(currentTime);

            // calculate the stroke-dashoffset value
            const offset = (currentTime / countdownTime) * 282.74;
            progress.style.strokeDashoffset = offset;

            if (currentTime <= 0) {
                clearInterval(updateTimer);
                timeLeft.innerHTML = "Time's up!";
            }
        }, 1000);

    })
}


async function netflixBinge(data) {
    // Check local storage for current id

    console.log(`data`, data)
    const currentEpisodeID = data.video.currentEpisode;

    const seasons = data.video.seasons;
    if (!seasons) {
        return
    }

    const episodes = seasons.map(season =>
        season.episodes.map(ep => ep.episodeId)
    ).flat();

    const indexNextEpisode = episodes.indexOf(currentEpisodeID) + 1;
    if (indexNextEpisode >= episodes.length) return;
    const nextEpisodeID = episodes[indexNextEpisode];

    // Check if current ID Is part of existing binges. 

    const allLocalStorage = await chrome.storage.local.get();

    const currentKey = `nab-current-${currentEpisodeID}`;
    const nextKey = `nab-current-${nextEpisodeID}`;
    const currentStored = allLocalStorage[currentKey];
    const nextStored = allLocalStorage[nextKey];

    console.log(`currentStored`, currentStored)
    if (currentStored && '__expiration' in currentStored && currentStored.__expiration > new Date().getTime()) {
        console.log('Adding to local storage')
        const [tab] = await chrome.tabs.query({ active: true });

        await chrome.scripting.executeScript({
            args: [currentStored.__expiration],
            target: { tabId: tab.id },
            func: inContent1,
        });

        pulledData = false;
    }
    else {
        
        if(!nextStored) setStorageItem(nextKey, {}, 18);
    }
}


async function removeFromLocalStorage(){
    const allLocalStorage = await chrome.storage.local.get();
    Object.keys(allLocalStorage).forEach(bingeBlocker => {
        // REMOVE The blocker
        const now = new Date().getTime();
        const binge = allLocalStorage[bingeBlocker];
        if (binge.__expiration < now) {
            chrome.storage.local.remove(bingeBlocker);
        }
    })
}

let count = 0;

function callNetflixAPI(details){
    chrome.webRequest.onCompleted.removeListener(callNetflixAPI)
    if (pulledData) return;
    
    fetch(details.url)
        .then(response => response.json())
        .then(data => netflixBinge(data))
        .catch((e) => console.log(e));

    pulledData = true;
}

function listenForNetflixToLoad (tabId, changeInfo, tab){
    if (currentPage !== changeInfo.url) {
        pulledData = false;
    }

    currentPage = changeInfo.url;

    if (changeInfo.status && changeInfo.status === "loading") {
        pulledData = false;
    }

    if (changeInfo.url && changeInfo.url.includes('netflix.com/')) {
        removeFromLocalStorage()
    }

    // Check if we're on netflix
    if (changeInfo.url && changeInfo.url.includes('netflix.com/watch')) {
        // Check if the page is watched
        chrome.webRequest.onCompleted.addListener(
            // Listen for the member api code
            (details) => {       
                if(details.initiator.includes('chrome-extension://')) return
                if("documentId" in currentDetailsObj && currentDetailsObj.documentId === details.documentId ) return

                currentDetailsObj=details; 
                console.log(count, details)
                count++;
                callNetflixAPI(details);
            
            },
            { urls: ["https://www.netflix.com/**/website/memberapi/**/metadata*"] }
        );
    }
}

chrome.tabs.onUpdated.addListener(
    (tabId, changeInfo, tab)  => {
        listenForNetflixToLoad(tabId, changeInfo, tab) 
    }
);



function setStorageItem(key, item, expirationInHours) {
    const storeItem = {
        item: item
    };

    if (expirationInHours) {
        storeItem.__expiration = Date.now() + (expirationInHours * 60 * 60 * 1000);
    }

    chrome.storage.local.set({ [key]: storeItem }, () => { });
}

async function getStorageItem(key) {
    const str = await chrome.storage.local.get([key])
    return str
}

