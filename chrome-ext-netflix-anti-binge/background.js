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

let dataPulled = {};
let currentPage = "";


// executeScript runs this code inside the tab
function inContent1(expiration) {
    function convertSecondsToTimeString(seconds) {
        const hours = Math.floor(seconds / (60 * 60));
        const minutes = Math.floor((seconds - (hours * 60 * 60)) / 60);
        const secs = seconds - (hours * 60 * 60) - (minutes * 60);

        let timeString = "";
        if (hours > 0) {
            timeString = hours + " hour" + (hours > 1 ? "s" : "") + " " + minutes + " minute" + (minutes > 1 ? "s" : "") + " " + secs + " second" + (secs > 1 ? "s" : "");
        }
        else if (minutes > 0) {
            timeString = minutes + " minute" + (minutes > 1 ? "s" : "") + " " + secs + " second" + (secs > 1 ? "s" : "");
        }
        else {
            timeString = secs + " second" + (secs > 1 ? "s" : "");
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
            // console.log(`el`, el)
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
    font-size: 5rem;
    display: flex;
    justify-content: center;
    align-items: center;
}
.nab-bottom-text #time-left{
    margin: 0;
}

#timer {
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

#progress {
    stroke: #141414;
    stroke-dasharray: 282.74;
    stroke-dashoffset: 282.74;
    transform: rotate(-90deg);
    transform-origin: 50% 50%;
    transition: stroke-dashoffset 1s linear;
    stroke-width: 11px;
}

#bg-circle {
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
            <div id="timer">
                <svg viewBox="0 0 100 100">
                    <circle id="bg-circle" cx="50" cy="50" r="45"></circle>
                    <circle id="progress" cx="50" cy="50" r="45"></circle>
                </svg>

                <svg id='nab-lock-icon' width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2 21C1.45 21 0.979333 20.8043 0.588 20.413C0.196 20.021 0 19.55 0 19V9C0 8.45 0.196 7.979 0.588 7.587C0.979333 7.19567 1.45 7 2 7H3V5C3 3.61667 3.48767 2.43733 4.463 1.462C5.43767 0.487333 6.61667 0 8 0C9.38333 0 10.5627 0.487333 11.538 1.462C12.5127 2.43733 13 3.61667 13 5V7H14C14.55 7 15.021 7.19567 15.413 7.587C15.8043 7.979 16 8.45 16 9V19C16 19.55 15.8043 20.021 15.413 20.413C15.021 20.8043 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.021 15.8043 9.413 15.413C9.80433 15.021 10 14.55 10 14C10 13.45 9.80433 12.979 9.413 12.587C9.021 12.1957 8.55 12 8 12C7.45 12 6.97933 12.1957 6.588 12.587C6.196 12.979 6 13.45 6 14C6 14.55 6.196 15.021 6.588 15.413C6.97933 15.8043 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"/>
                </svg>
            </div>

        </div>
        <div class="nab-bottom-text">
            <p id="time-left"></p>
        </div>
</div>`;



    waitForElement("video", (waitedEl)=>{
        waitedEl.pause();
        el.innerHTML = html;

        const progress = document.getElementById("progress");
        const timeLeft = document.getElementById("time-left");
    
        // set the countdown time in seconds
        const now = new Date().getTime();
        const countdownTime = 18 * 60 * 60;
    
        let currentTime = Math.round((expiration - now) / 1000);
    
        // update the timer every second
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

    if (currentStored && '__expiration' in currentStored) {
        // console.log(`There is something stored`)
        // console.log(`_expiration`, _expiration)=
        const [tab] = await chrome.tabs.query({ active: true});

        await chrome.scripting.executeScript({
            args: [currentStored.__expiration],
            target: { tabId: tab.id },
            func: inContent1,
        });

        pulledData = false;

        // This is where we block off?
    }
    else {
        // console.log('Adding the new key now');
        setStorageItem(nextKey, {}, 18);
    }

}

chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo, tab) {

    // console.log({ tabId, changeInfo, tab })
    if (currentPage !== changeInfo.url) {
        pulledData = false;
    }

    currentPage = changeInfo.url;
 
    if (changeInfo.status && changeInfo.status === "loading") {
        pulledData = false;

        // console.log(`SETTING TO FALSE`)
    }

    if (changeInfo.url && changeInfo.url.includes('netflix.com/')) {
        async () => {
            const allLocalStorage = await chrome.storage.local.get();

            Object.keys(allLocalStorage).forEach(bingeBlocker => {
                // REMOVE The blocker
                if (bingeBlocker.__expiration < new Date().getTime()) {
                    chrome.storage.local.remove(bingeBlocker);
                }
            })
        }
    }
    // Check if we're on netflix
    if (changeInfo.url && changeInfo.url.includes('netflix.com/watch')) {
        // Check if the page is watched
        chrome.webRequest.onCompleted.addListener(
            // Listen for the member api code

            // ************ This is preventing the lock on reload.
            (details) => {
                // console.log(`details`, details)
                if (pulledData) return;

                fetch(details.url)
                    .then(response => response.json())
                    .then(data => netflixBinge(data))
                    .catch((e) => console.log(e));

                pulledData = true;
            },
            { urls: ["https://www.netflix.com/**/website/memberapi/**/metadata*"] }
        );
    }
});







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

    // if (str) {
    //     const item = JSON.parse(str);

    //     if (item.__expiration && item.__expiration < Date.now()) {
    //         removeStorageItem(key);
    //         return null;
    //     } else {
    //         return item.item;
    //     }
    // } else {
    //     return null;
    // }
}




const EXAMPLE = {
    "version": "2.1",
    "trackIds": {
        "nextEpisode": 200257858,
        "episodeSelector": 200257859
    },
    "video": {
        "title": "Altered Carbon",
        "synopsis": "After 250 years on ice, a prisoner returns to life in a new body with one chance to win his freedom: by solving a mind-bending murder.",
        "rating": "TV-MA",
        "artwork": [
            {
                "w": 1280,
                "h": 720,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABU8sPXAqoyAt5xMAfRBuSAQ-Wnsv7aM5TDCQpePrrsLQZghDRp8JYnEkYWiTiBNXXPu0kZSF_8dDlktdOkZ5ZC3KS02BeT6nhKrJ7D75u9d2LQixBYmVgDeDlzg2mzPBtPkrag.webp?r=261"
            },
            {
                "w": 1280,
                "h": 720,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/6gmvu2hxdfnQ55LZZjyzYR4kzGk/AAAABU8sPXAqoyAt5xMAfRBuSAQ-Wnsv7aM5TDCQpePrrsLQZghDRp8JYnEkYWiTiBNXXPu0kZSF_8dDlktdOkZ5ZC3KS02BeT6nhKrJ7D75u9d2LQixBYmVgDeDlzg2mzPBtPkrag.webp?r=261"
            }
        ],
        "boxart": [
            {
                "w": 426,
                "h": 607,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABVUEDgRkTZxs8nVf_jBXtimZW0KZQka1-Ch-Gc3QHamxmD691005Oj4uPZx_MG7aG22mREWQv8_sF9qtOL6yMKgcPZJJfravF1Nsg8I43bsIeI1i51Wr2Urwv1PDqYX8t2bUnA.jpg?r=937"
            },
            {
                "w": 284,
                "h": 405,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/WNk1mr9x_Cd_2itp6pUM7-lXMJg/AAAABRiZtF5tEYZwqTwmWH20WZfroL_HAZtVnwSUngIzBFnOV-wOgDDejB32BvRhf19KeGLcFBkUycRw78ApuFvVOl_jMdHoK5jlCyU23Xy-dG6Te1rJIKzyDfFC_MY8iBG-oKC0YA.jpg?r=937"
            }
        ],
        "storyart": [
            {
                "w": 1280,
                "h": 720,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABbV-3hRiXwFGMCQBAk2Ui8CE_neL73k4GdGrGGLfDCrlbh6l5y8ykvnsKfyy7tXlK3taBIcw98WQeLel-P5drnzZ86-od_LNE35G.webp?r=7f8"
            },
            {
                "w": 1920,
                "h": 1080,
                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/E8vDc_W8CLv7-yMQu8KMEC7Rrr8/AAAABTRvfrNOjsLXCS9Xhiqv1J1R9gcc8QWJXDpGWMZWum_Apn_zBGRqtgf5-eY7P6z2bsY7llamF5GIIMYwddNe5X7OTYnlo5RP3QK0.webp?r=7f8"
            }
        ],
        "type": "show",
        "unifiedEntityId": "Video:80097140",
        "id": 80097140,
        "userRating": {
            "matchScore": null,
            "tooNewForMatchScore": true,
            "type": "thumb",
            "userRating": 0
        },
        "skipMarkers": {
            "credit": {
                "start": null,
                "end": null
            },
            "recap": {
                "start": null,
                "end": null
            },
            "content": []
        },
        "currentEpisode": 80186761,
        "hiddenEpisodeNumbers": false,
        "requiresAdultVerification": false,
        "requiresPin": false,
        "requiresPreReleasePin": false,
        "seasons": [
            {
                "year": 2018,
                "shortName": "S1",
                "longName": "Season 1",
                "hiddenEpisodeNumbers": false,
                "title": "Season 1",
                "id": 80097907,
                "seq": 1,
                "episodes": [
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "Waking up in a new body 250 years after his death, Takeshi Kovacs discovers he's been resurrected to help a titan of industry solve his own murder.",
                        "episodeId": 80097693,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3374,
                        "runtime": 3550,
                        "displayRuntime": 3550,
                        "watchedToEndOffset": 3265,
                        "autoplayable": true,
                        "title": "Out of the Past",
                        "id": 80097693,
                        "bookmark": {
                            "watchedDate": 1674372474592,
                            "offset": 3371
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 0,
                                "end": 0
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABW2mrlbo1YXXjWKc6Ka6AF4o1KQ2uV8pX6SMzXdnTHiUztyGoA_89lPepiQqj6tg_zk7lbVBeFW4tAUIaIKfPDk_gFhwWWnhMb3bw_8YEzeSgRg1KJvICBYI.webp?r=ce8"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABW8dJ2dtc-KjGc0PqrilTQwEYYKsRL9aJ3krB2f_POeSCCUAc5D__pXWqM9aCne5InLbLLtds4bMouhxLKgzMXIReGTfTkFrJFQjBg9Kexp3KPJLfnVxoRHvzg.webp?r=ce8"
                            }
                        ],
                        "seq": 1,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "While Kovacs tracks down a man who sent Bancroft a death threat, Lt. Ortega bends the rules to keep tabs on his whereabouts.",
                        "episodeId": 80097694,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3220,
                        "runtime": 3427,
                        "displayRuntime": 3427,
                        "watchedToEndOffset": 3191,
                        "autoplayable": true,
                        "title": "Fallen Angel",
                        "id": 80097694,
                        "bookmark": {
                            "watchedDate": 1674535476347,
                            "offset": 3230
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5923,
                                "end": 29196
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABcFHPKeHyIfkbdCT4B_ipX_GkFd3USycnO3RxTBvUUVySEBbrUn5Irny6MA9OIfflpR2QRGidWkR8b_3WwlH00ZtsLadskKcrXGJQmLAwNctSHt9lOlTqBpH.webp?r=1f4"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABYjDZvTUN6bjw8LJqAuJeZyeegezOMX91DsvT6yzg6ZfrH17uyelHxXhYtXNfKRw2RaXtE0FBJVrlwHZdRHzUhUzKe-0fH2QCioTE5wLUNc5Nvbjiyp1mMHPFg.webp?r=1f4"
                            }
                        ],
                        "seq": 2,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "Kovacs recruits an unlikely partner to watch his back during a banquet at the Bancroft home, where Ortega oversees the night's grisly entertainment.",
                        "episodeId": 80097695,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2874,
                        "runtime": 3083,
                        "displayRuntime": 3083,
                        "watchedToEndOffset": 2851,
                        "autoplayable": true,
                        "title": "In a Lonely Place",
                        "id": 80097695,
                        "bookmark": {
                            "watchedDate": 1674538312797,
                            "offset": 2875
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5840,
                                "end": 30322
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABU6ZFmh991YuxBlOxhT3w-x6OFcIUB3JeY7YJ8J5slaJ_rfyyEpn71PggGu9OOE_tupgCPZ6Lorh43y1hVU9Zu9mK0o5dLoS__UPTs3gI3nmnCz4VlMJ95d3.webp?r=6c9"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABeSpBtHwK7DdCmHoGL3bJCisNsKw4Ew_Z6rk4Pv6kKpAXhJL_aC8iKOvla87j_0ybKZrLt7uyQvWaib9aTVxo0q0bTe0FCybeaVJBufwQk4iI5PLAJ0wD7TRMg.webp?r=6c9"
                            }
                        ],
                        "seq": 3,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "Tortured by his captor, Kovacs taps into his Envoy training to survive. Ortega springs a surprise on her family for Día de los Muertos.",
                        "episodeId": 80097696,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2782,
                        "runtime": 2993,
                        "displayRuntime": 2993,
                        "watchedToEndOffset": 2760,
                        "autoplayable": true,
                        "title": "Force of Evil",
                        "id": 80097696,
                        "bookmark": {
                            "watchedDate": 1674539908765,
                            "offset": 2789
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5881,
                                "end": 29280
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABTnOHqZpx9jktecG1o9yxX2Ym6bucftqv_yNRBOod21heRQj7mAdydbAbcSOVtrHLBymcazGKKT_eeozllPR82i7PEb3VXV7vwjJMvmUzUMWyLfQb0IX5JWR.webp?r=f24"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABRAZPIxVUktaHBXLVMrCwmhU6KVBtuLgMHKhbI1nKrgIIpy26snOVGDJUyKioxe91EycSzTX_V64J2u5BD00-d-orYkBM9SAZFxyxR2EQlPAUxdyATApYDAoiQ.webp?r=f24"
                            }
                        ],
                        "seq": 4,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "After learning his sleeve's identity, Kovacs demands the full story from Ortega. A tip from Poe leads to a major breakthrough in the Bancroft case.",
                        "episodeId": 80097697,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3035,
                        "runtime": 3247,
                        "displayRuntime": 3247,
                        "watchedToEndOffset": 3001,
                        "autoplayable": true,
                        "title": "The Wrong Man",
                        "id": 80097697,
                        "bookmark": {
                            "watchedDate": 1674542091404,
                            "offset": 3037
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5881,
                                "end": 30614
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABaX_31vW4OxIGqw_riiYfRDYYLpP-qACwBxYaektuZofocv1sMxxXQppH95OigWrygTmpfJkjX41lZwJlyEXRtvQqPYymf9r2ms7k5vfly_ODMkTDtDdCkrd.webp?r=f2e"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABQXd_AI48w4Jfpt7L3f2LBWx2qZGC6gGHLLy6S8kW3mSZG9b_q0IWd56aRsM7h5ZvumbCfq_OfOXuLCyS-eC4UaPC5u0BdLOAjCCvXqrF2SHNY7-WnsZHaGneg.webp?r=f2e"
                            }
                        ],
                        "seq": 5,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "With Ortega's fate hanging in the balance, Kovacs drops a bombshell on the Bancrofts. Later, he comes face to face with an unsettling opponent.",
                        "episodeId": 80097698,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2577,
                        "runtime": 2787,
                        "displayRuntime": 2787,
                        "watchedToEndOffset": 2554,
                        "autoplayable": true,
                        "title": "Man with My Face",
                        "id": 80097698,
                        "bookmark": {
                            "watchedDate": 1674543570785,
                            "offset": 2586
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5840,
                                "end": 29989
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABSCiQMVnKHsaZErOEkAxCUT9Usw-WbKAprzx9QHaYs-OYg58OVH8pcfyaf_Ek0qXkNLYQThD10PFvuA5MB5a0yOQ9la8KnxtAk0uEPO0EKTp0Bhw30roGnie.webp?r=016"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbkvQATUQnk0fFUyRl3KwtkFO-PhOwpQ4CqCeh6AAeLWimDMCSqYoHQubhjfYXXqMXbDK2RzQnquD_5F7f0iOUx6j5XlchzQ5Mq0Oi1_Oc3Juq4yiHHEPH2Nrw.webp?r=016"
                            }
                        ],
                        "seq": 6,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "As Kovacs reconnects with a figure from his past, his tangled history with the Protectorate, the Uprising and Quell plays out in flashbacks.",
                        "episodeId": 80097699,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3826,
                        "runtime": 4034,
                        "displayRuntime": 4034,
                        "watchedToEndOffset": 3791,
                        "autoplayable": true,
                        "title": "Nora Inu",
                        "id": 80097699,
                        "bookmark": {
                            "watchedDate": 1674546144456,
                            "offset": 3830
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5881,
                                "end": 28988
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABStN3KHKJ7uE01yEQ5wkoAs7gvHI2kmEpo8_w0Dj2kcVPqLlSaOpHgZnNy25wU5U0ndlJNPG-SCJu6wrzJAlXrpIg30OXtLSuMksCk5x23QG5W1zKcKGmtpC.webp?r=606"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABQaftyKhV06l0Vr-0kajBjc6Ns_AaQ6xu2ioJ16Bt5NgPmEeEv2RWTNXb7g9oQEEw5uR9P86uOPqshBstMvPgIAHH0GmkDDuhPJoOnBs4ugFgPJNwcyMVumv8g.webp?r=606"
                            }
                        ],
                        "seq": 7,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "His world rocked, Kovacs requests a dipper to help him sew up the Bancroft case quickly. Ortega races to identify the mystery woman from Fight Drome.",
                        "episodeId": 80098000,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2936,
                        "runtime": 3145,
                        "displayRuntime": 3145,
                        "watchedToEndOffset": 2911,
                        "autoplayable": true,
                        "title": "Clash by Night",
                        "id": 80098000,
                        "bookmark": {
                            "watchedDate": 1674547105632,
                            "offset": 2938
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5923,
                                "end": 29117
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABb7ncMWXNG36e1CTRjGAlbOeJt-oFazc6SnuevkK2Z-MiKkMhqcRVLGXILGHfCE7TfDRnEBhuK5wjTSvbVsXIHKv38sq-lc9pE1b9cpQ9omImB5--JrjzOCo.webp?r=7b7"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABYCEnhbIR5xhJDtYyQ4stgdgZ_3Mc9iH7HlXmX5uRudareLj0_w-lW1Z5TCwT8RZ2OP2bJv_mJwCbpwoF6xVKufIazYnaPyPlv6Vb0bGhUwS_T3bcaNtjWoIZQ.webp?r=7b7"
                            }
                        ],
                        "seq": 8,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "After a devastating rampage, Kovacs and his allies hatch a bold -- and very risky -- scheme to infiltrate Head in the Clouds.",
                        "episodeId": 80098001,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3016,
                        "runtime": 3225,
                        "displayRuntime": 3225,
                        "watchedToEndOffset": 2990,
                        "autoplayable": true,
                        "title": "Rage in Heaven",
                        "id": 80098001,
                        "bookmark": {
                            "watchedDate": 1674548881608,
                            "offset": 3021
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 5923,
                                "end": 29613
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABfsCLwIlfFQ5CqEHseETgXQi7rrHooxCegHV8nfAM2F0Lzlu3le2b8rSVmW20mWQEu5DrmRwo3MotQcu2oYdbVWpjFezZQwJeVvNGk4Z-adJUiqDghFF0Iy-.webp?r=a8e"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABT6ilyQ3MoFaiAMJ24YeOSu4ktd6nUi8IkJo4mXcZodG46XwmHLQ4Ee-ssENetTybtw7RDcWhChc8cxyroG2n89Zvj5NUmY17AwB0-oL8jqla4ag4aO0ZNFpcQ.webp?r=a8e"
                            }
                        ],
                        "seq": 9,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1517558400000,
                        "end": 1898409600000,
                        "synopsis": "As a cornered Kovacs braces for a final showdown in the sky, a new hero emerges and more buried secrets come to light.",
                        "episodeId": 80098002,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2900,
                        "runtime": 3071,
                        "displayRuntime": 3071,
                        "watchedToEndOffset": 2797,
                        "autoplayable": true,
                        "title": "The Killers",
                        "id": 80098002,
                        "bookmark": {
                            "watchedDate": 1674550643716,
                            "offset": 2910
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6257,
                                "end": 104188
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABdsC7MOgIca0GpYE5LTkJ-8EiueDc5P5c63Gka3eXcFOtILEnp0m5aE5BPteEX6LOAhurF0taGkTcW7LKKkGku9e6hgF7TP5q13hP7wgjPnaY-_rIrMbKqGG.webp?r=ded"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABa5nBgfqIylicA1adMtSO8PrlX1mcciXlLWt0TC8mbhCn7ItZy7vgvFgL7q0wNDVuAOmJYWRnRzJO_ZDLomUr8qUr_qHGjIsU8dD1mjIAW92Mwgvhf0H9LqndA.webp?r=ded"
                            }
                        ],
                        "seq": 10,
                        "hiddenEpisodeNumbers": false
                    }
                ]
            },
            {
                "year": 2020,
                "shortName": "S2",
                "longName": "Season 2",
                "hiddenEpisodeNumbers": false,
                "title": "Season 2",
                "id": 80186672,
                "seq": 2,
                "episodes": [
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "Thirty years after the Bancroft case, a Meth tracks down Kovacs to offer him a job, a high-tech sleeve and a chance to see Quellcrist Falconer again.",
                        "episodeId": 80186761,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2550,
                        "runtime": 2713,
                        "displayRuntime": 2713,
                        "watchedToEndOffset": 2447,
                        "autoplayable": true,
                        "title": "Phantom Lady",
                        "id": 80186761,
                        "bookmark": {
                            "watchedDate": 1674789726108,
                            "offset": 926
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6235,
                                "end": 106484
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbpsLmjSGK9jQkgl9dj3AmUH0vxxUR_l12bfTuTbmD9JGzzJorFpXsePLf2d_Zz20BRhAy2p0Rc_HAfwQOrxpkERUxCDs4ONpc6u0Egq-L32xK5WyspHOwTM.webp?r=3be"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABYa7z73vbX0wvZTJHJ_M8A7CKfqPHgFO01Fm4WcyhOQUxmDDx3YlfQOPK9IUshsSGWPtQ3zZl3lPGFWn4RQANOu8SXD1OZYOIgEDXRVdZkjmJFpQRx7XeINN5A.webp?r=3be"
                            }
                        ],
                        "seq": 1,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "As Col. Carrera takes charge of the murder investigation, Kovacs sets out to find Axley's bounty hunter, and Poe's memory glitches worsen.",
                        "episodeId": 80991851,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2613,
                        "runtime": 2809,
                        "displayRuntime": 2809,
                        "watchedToEndOffset": 2585,
                        "autoplayable": true,
                        "title": "Payment Deferred",
                        "id": 80991851,
                        "bookmark": {
                            "watchedDate": 1582870787883,
                            "offset": 2619
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6652,
                                "end": 34034
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABfcuYAlvBp5ZPiNt1_D8U7-y9hlNbn2E-UVQWzm7ai00obUw_E8_C6pek1xM7wrdIVGF9VzYjoUIKfEDfwl5w4z1fN90GSYHKeS4YN7nfCXVdDvezfRcbH0G.webp?r=579"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABZeZiDdxT4e44Sy3XIx-UwQ1_iLSGmw1MsppJmvYQBHLWACqkZRstDglFJe592OOAVtFDHNBCq2XMeEiT-nepZCvVSbwxy8xmWuAz8iYgYXDxZGZboefAU21vA.webp?r=579"
                            }
                        ],
                        "seq": 2,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "Kovacs contends with ghosts from his past as he's tortured by Carrera. Poe seeks help from a fellow AI. Trepp gets a lead on the man she's after.",
                        "episodeId": 80991852,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2999,
                        "runtime": 3197,
                        "displayRuntime": 3197,
                        "watchedToEndOffset": 2966,
                        "autoplayable": true,
                        "title": "Nightmare Alley",
                        "id": 80991852,
                        "bookmark": {
                            "watchedDate": 1582951516964,
                            "offset": 3003
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 37037
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbfo7f1XJaqC329cygfpYKnB7bDoxrdxfBWRvVZsVX-dR7EEmvlkwHaZ8327jNlMU910baSqbNb6BF74y0WVb3lIsIYPV1c07axXguX0KcnrSaZOGzDiAjtj.webp?r=088"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABScjXSkW_cGFNCtnBUTqTCOLFk3dpwhilyIWUKVOxkCK-z_szzdp0az66QlKGqeRs8dG8H6TCZK68drk7TYR_806sNaaLRD2ZZobgx_HEcEGYhzoU5q_blQlbg.webp?r=088"
                            }
                        ],
                        "seq": 3,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "While the planet celebrates Harlan's Day, Kovacs hatches an escape plan, Quell pieces together fragments of her life, and Poe faces a reckoning.",
                        "episodeId": 80991853,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 3177,
                        "runtime": 3373,
                        "displayRuntime": 3373,
                        "watchedToEndOffset": 3139,
                        "autoplayable": true,
                        "title": "Shadow of a Doubt",
                        "id": 80991853,
                        "bookmark": {
                            "watchedDate": 1582955377205,
                            "offset": 3178
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 34054
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABclhPuWgE347FHCPc2p9gfU4l0g4DeWFFTYDRWLwo6-P8hLiylVkn0IMtinsfG7RitKgsnSXvdjsrG_FqjDtttOnguQ2_UsPLP1o-Zu2Topn25nXjyhMbTmA.webp?r=eef"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABZNUUvmojkoJEwNpy2UOFZTDI71zgd2N-Kmnnnh9vZJLPPln155JVABMz5GTDrncNwU-BMkBv5GOLyMjv7iUaG47BjMoHwaLflo97wjxhwhvd69G_o_nWzuMRw.webp?r=eef"
                            }
                        ],
                        "seq": 4,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "Carrera sends his secret weapon on a deadly mission. Kovacs and Trepp smuggle Quell out of the city. Poe takes a risky trip into virtual reality.",
                        "episodeId": 80991854,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2826,
                        "runtime": 3023,
                        "displayRuntime": 3023,
                        "watchedToEndOffset": 2796,
                        "autoplayable": true,
                        "title": "I Wake Up Screaming",
                        "id": 80991854,
                        "bookmark": {
                            "watchedDate": 1582956290201,
                            "offset": 2827
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 34034
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABWKFgNqLtFDJAG1ESOfXmO8wACCLO4X7Lr-4asb560Nsc4l7gu0LVGdoMmKcxwTyvBVIZJ4cX104sQwAZ0kwZwjH1XtQGwmTLxiv4IkHsehrxVifX5FD-ovY.webp?r=e0e"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABdpl1A-_kiMVfjTAVzEqJyuGPLRHLvjmj4TyAIEsDa6D8kzcdVi2alb6pZJXs8LBwLz4HVGaFjLBW3Afi_F7z7zpzjG3P3MOBCt7HaRgQUW9rpN5hEXUTCQqmw.webp?r=e0e"
                            }
                        ],
                        "seq": 5,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "As Quell reconnects to her past at Stronghold, she leads the clone into an underground chamber teeming with secrets. Gov. Harlan shows her true colors.",
                        "episodeId": 80991855,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2403,
                        "runtime": 2599,
                        "displayRuntime": 2599,
                        "watchedToEndOffset": 2374,
                        "autoplayable": true,
                        "title": "Bury Me Dead",
                        "id": 80991855,
                        "bookmark": {
                            "watchedDate": 1582957204723,
                            "offset": 2406
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 34034
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABbII1D3zBFuS3qyATySI5j9UfOBOUtY99ai-WMI2fq2YYoYaXLAQOJn6u_Qf8_tdyOMTfBkm24FUvpmdMrUxasQJosIlYhqR_xYSuGJ6VNHT5NwFLYAo3nvM.webp?r=a7e"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABdPZ1cW6OgJgo1Q0wVKRsqApRxTfCEJzCPNHVda91vkQ4R6fyyuUpiiZ-rU5hePDH5C8IYGaNSWVmkz0fH8dKjGUe5jDF6GTs3X2W0gKQtbsC5zQEwX2TPADug.webp?r=a7e"
                            }
                        ],
                        "seq": 6,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "When Quell's sleeve begins to shut down, Poe and Ms. Dig send her into VR, where Kovacs finally learns the truth about her deadly rampages.",
                        "episodeId": 80991856,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2723,
                        "runtime": 2919,
                        "displayRuntime": 2919,
                        "watchedToEndOffset": 2693,
                        "autoplayable": true,
                        "title": "Experiment Perilous",
                        "id": 80991856,
                        "bookmark": {
                            "watchedDate": 1582958677616,
                            "offset": 2730
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 34034
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABUstEHvjtK71Y8nY30vtEFOKJUMsEIfJCxgPK6iRhCrTVE_jgaEBVOo4wU6Ho7pk_UdC4NxKmDFi8JsNntu6yoNEBqMbLjQZryo2DRhQ4jtnpTOfdOujuYUl.webp?r=c65"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABWeO1bHqc9vDC7Uwgu1jMWR7jhB6npHYnrTFEzwJrAWp4vnUM_soFsPNJ_hr2KT4ITFNQm2eg5dhqbxyv3DFj5Ju_hnpf3xfSLpOsWTtisDxOOKicioQyGWNyQ.webp?r=c65"
                            }
                        ],
                        "seq": 7,
                        "hiddenEpisodeNumbers": false
                    },
                    {
                        "start": 1582790400000,
                        "end": 1898409600000,
                        "synopsis": "With the fate of the whole planet on the line, Kovacs, Quell and team race to find Konrad Harlan and stop a catastrophic blast of Angelfire.",
                        "episodeId": 80991857,
                        "requiresAdultVerification": false,
                        "requiresPin": false,
                        "requiresPreReleasePin": false,
                        "creditsOffset": 2994,
                        "runtime": 3159,
                        "displayRuntime": 3159,
                        "watchedToEndOffset": 2895,
                        "autoplayable": true,
                        "title": "Broken Angels",
                        "id": 80991857,
                        "bookmark": {
                            "watchedDate": 1582960108777,
                            "offset": 2997
                        },
                        "skipMarkers": {
                            "credit": {
                                "start": 6632,
                                "end": 103898
                            },
                            "recap": {
                                "start": 0,
                                "end": 0
                            },
                            "content": []
                        },
                        "hd": true,
                        "thumbs": [
                            {
                                "w": 350,
                                "h": 197,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABR6nj_nznuNYQF3-F5lkq7PD_5QZL4Ac0ZnDQ129mVWCFwqNckQOo2DlVK-Fiv22OK0-kFNx7eFQ2JJ6DelYdIaGsxwnOmkNR0bSCVuj5jTIrUdVQiyLuoOz.webp?r=f09"
                            }
                        ],
                        "stills": [
                            {
                                "w": 1920,
                                "h": 1080,
                                "url": "https://occ-0-2872-1007.1.nflxso.net/dnm/api/v6/9pS1daC2n6UGc3dUogvWIPMR_OU/AAAABehzAaNP6GGW24LjcB8G95qmNNCDvCegW5YZ3q4_FIIWJhN_KtrWxNbRFsxf5ZMgJ9uyp7zNGX2hEW58G_V6gyXrZOxSDbjBdJ5g-liOY8hcdC4ZtOrVSnQJAg.webp?r=f09"
                            }
                        ],
                        "seq": 8,
                        "hiddenEpisodeNumbers": false
                    }
                ]
            }
        ],
        "merchedVideoId": null,
        "cinematch": {
            "type": "predicted",
            "value": "3.0"
        },
        "taglineMessage": {
            "tagline": "",
            "classification": "REGULAR"
        },
        "liveEvent": {
            "hasLiveEvent": false,
            "liveEventStartDate": 0,
            "liveEventEndDate": 0
        }
    }
}


// declare module namespace {

//     export interface TrackIds {
//         nextEpisode: number;
//         episodeSelector: number;
//     }

//     export interface Artwork {
//         w: number;
//         h: number;
//         url: string;
//     }

//     export interface Boxart {
//         w: number;
//         h: number;
//         url: string;
//     }

//     export interface Storyart {
//         w: number;
//         h: number;
//         url: string;
//     }

//     export interface UserRating {
//         matchScore?: any;
//         tooNewForMatchScore: boolean;
//         type: string;
//         userRating: number;
//     }

//     export interface Credit {
//         start?: any;
//         end?: any;
//     }

//     export interface Recap {
//         start?: any;
//         end?: any;
//     }

//     export interface SkipMarkers {
//         credit: Credit;
//         recap: Recap;
//         content: any[];
//     }

//     export interface Bookmark {
//         watchedDate: any;
//         offset: number;
//     }

//     export interface Credit2 {
//         start: number;
//         end: number;
//     }

//     export interface Recap2 {
//         start: number;
//         end: number;
//     }

//     export interface SkipMarkers2 {
//         credit: Credit2;
//         recap: Recap2;
//         content: any[];
//     }

//     export interface Thumb {
//         w: number;
//         h: number;
//         url: string;
//     }

//     export interface Still {
//         w: number;
//         h: number;
//         url: string;
//     }

//     export interface Episode {
//         start: any;
//         end: any;
//         synopsis: string;
//         episodeId: number;
//         requiresAdultVerification: boolean;
//         requiresPin: boolean;
//         requiresPreReleasePin: boolean;
//         creditsOffset: number;
//         runtime: number;
//         displayRuntime: number;
//         watchedToEndOffset: number;
//         autoplayable: boolean;
//         title: string;
//         id: number;
//         bookmark: Bookmark;
//         skipMarkers: SkipMarkers2;
//         hd: boolean;
//         thumbs: Thumb[];
//         stills: Still[];
//         seq: number;
//         hiddenEpisodeNumbers: boolean;
//     }

//     export interface Season {
//         year: number;
//         shortName: string;
//         longName: string;
//         hiddenEpisodeNumbers: boolean;
//         title: string;
//         id: number;
//         seq: number;
//         episodes: Episode[];
//     }

//     export interface Cinematch {
//         type: string;
//         value: string;
//     }

//     export interface TaglineMessage {
//         tagline: string;
//         classification: string;
//     }

//     export interface LiveEvent {
//         hasLiveEvent: boolean;
//         liveEventStartDate: number;
//         liveEventEndDate: number;
//     }

//     export interface Video {
//         title: string;
//         synopsis: string;
//         rating: string;
//         artwork: Artwork[];
//         boxart: Boxart[];
//         storyart: Storyart[];
//         type: string;
//         unifiedEntityId: string;
//         id: number;
//         userRating: UserRating;
//         skipMarkers: SkipMarkers;
//         currentEpisode: number;
//         hiddenEpisodeNumbers: boolean;
//         requiresAdultVerification: boolean;
//         requiresPin: boolean;
//         requiresPreReleasePin: boolean;
//         seasons: Season[];
//         merchedVideoId?: any;
//         cinematch: Cinematch;
//         taglineMessage: TaglineMessage;
//         liveEvent: LiveEvent;
//     }

//     export interface RootObject {
//         version: string;
//         trackIds: TrackIds;
//         video: Video;
//     }

// }


