// chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
//     let url = tabs[0].url;
//     // use `url` here inside the callback because it's asynchronous!
//     console.log(`url`, url);
// });

const baseNetflix = 'https://www.netflix.com/watch';

function netflixBinge(tabId, changeInfo, tab){
    // read changeInfo data and do something with it (like read the url)
    if (changeInfo.url && changeInfo.url.includes(baseNetflix)) {
        // do something here
        console.log(`url`, changeInfo.url, changeInfo);
    }
    else{
        console.log(`tab`, tab)
    }
}

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    netflixBinge(tabId, changeInfo, tab)
});



chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    netflixBinge(tabId, changeInfo, tab)
});



// const params = window.location.search
// const pathname = window.location.pathname

// const movieID = pathname.split('/')[2];

// fetch(`https://www.netflix.com/nq/website/memberapi/vf9f926cd/metadata?movieid=${movieID}`, {
//     "headers": {
  
//     },
//     "body": null,
//     "method": "GET"
//   }).then(function(response) {
//         return response.json();
//       })
//       .then(function(data) {
      
//         console.log(data);
//       })



