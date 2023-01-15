chrome.runtime.onConnect.addListener(function(port){});

var k="";
window.onkeydown = function(event){

    data = {
        key:event.key,
        page: window.location.href

    }
    k = event.key;
    if (k == "CapsLock"){
        // chrome.tabs.executeScript( {
        //     code: "window.getSelection().toString();"
        // }, function(selection) {
        //     console.log( selection[0]);
        // });
        console.log("Enable Capslock")
        console.log( window.getSelection().toString());
    }
    // chrome.runtime.sendMessage(data);
}

window.onkeyup = function(event){

    data = {
        key:event.key,
        page: window.location.href
    }
    k = event.key;
    if (k == "CapsLock"){
        console.log("Undo the capslock")
        console.log( window.getSelection().toString());
    }
    // chrome.runtime.sendMessage(data);
}


