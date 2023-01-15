const dateControl = document.querySelector('input[type="date"]');
dateControl.value = '2017-06-01';
console.log(dateControl.value); // prints "2017-06-01"
console.log(dateControl.valueAsNumber); // prints 1496275200000, 

let messageIndex;
try {
    messageIndex = JSON.parse(new URLSearchParams(location.search).get('index'));
} catch (e) {}

// simplify the displayed URL in the address bar

let deMoElement = document.querySelector('.de-mo-quote');
const deMoQuoteIndex = messageIndex ?? Math.floor(Math.random() * demotivationalQuotes.length)
deMoElement.textContent = demotivationalQuotes[deMoQuoteIndex]