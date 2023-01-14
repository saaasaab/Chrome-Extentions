chrome.action.onClicked.addListener(function (tab) {
  chrome.tabs.create({
    url: 'popup.html',
    selected: true,
  })
})
