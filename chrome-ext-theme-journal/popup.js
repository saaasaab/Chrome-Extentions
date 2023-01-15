
function processForm() {
    const checked = document.querySelector('input[name=activity]:checked')
    const description = document.querySelector('input[name=activity-description]')

    console.log(description.value)
    // activities.1;

    if (!checked) {
        return
    }
    let newActiveActivity = checked.id;
    let activeActivities = Object.keys(activities).filter(activity => activity == newActiveActivity);
    if (activeActivities.length > 0) {
        newActiveActivity += `-${activeActivities.length}`
    }
    let activityIcon = document.querySelector(`label[for=${checked.id}] img`)
    activities[newActiveActivity] = {
        title: description.value,
        icon: activityIcon.src
    }

    activeStates[newActiveActivity] = emptyMonth()
    createHeaderContent();
    // SAVE TO LOCAL
    saveInLocal('active-states-hl', JSON.stringify(activeStates));
    saveInLocal('dc-active-activities', JSON.stringify(activities));

    // Remove the visible class for both the mobile and desktop versions
    document.querySelectorAll(".modal--visible").forEach((el) => {
        el.classList.remove("modal--visible");
    });
    // Reveal the body's scroll bar
    document.querySelector("body").classList.remove("no-scroll--modal");
}

function removeGoal(action) {

    if (String(action).toLowerCase() == 'true') {
        delete activities[activityToRemove]
        delete activeStates[activityToRemove]

        let activeActivity = Object.keys(activities)[0];
        saveInLocal('active-activity', activeActivity)


        createHeaderContent();

        let activityText = document.querySelector('.daily-activities-text');
        activityText.innerHTML = activities[activeActivity].title
        setTextSize(activityText, activities[activeActivity].title)


        // SAVE TO LOCAL
        saveInLocal('active-states-hl', JSON.stringify(activeStates));
        saveInLocal('dc-active-activities', JSON.stringify(activities));

        //Refresh the pages icons 
        let pageContent = document.querySelector(".calendar-content")
        pageContent.innerHTML = ""
        // clearBadges()
        createPageContent(activeStates)
        // Remove the modal
    }

    // Remove the visible class for both the mobile and desktop versions
    document.querySelectorAll(".modal--visible").forEach((el) => {
        el.classList.remove("modal--visible");
    });
    // Reveal the body's scroll bar
    document.querySelector("body").classList.remove("no-scroll--modal");
}

function emptyMonth() {
    return Array.apply(null, Array(31)).map(Number.prototype.valueOf, 0)
}

function preventAddingFutureDates(clickIndex) {
    // on day click check if the day index is greater than todays index
    let now = new Date();
    let start = new Date(now.getFullYear(), 0, 0);
    let diff = now - start;
    let oneDay = 1000 * 60 * 60 * 24;
    let todayIndex = Math.floor(diff / oneDay);
    let limitLow = 20;
    let limitHigh = 1;

    if (clickIndex - limitHigh > todayIndex || clickIndex < todayIndex - limitLow) {
        return false
    }
    return true
}
function createActiveStates(activityKeys) {
    actives = {}
    activityKeys.forEach((activity) => {
        actives[activity] = emptyMonth()
    })
    return actives
}
function saveInLocal(stateTitle, stateValues) {
    // Save it using the Chrome extension storage API.
    // chrome.storage.sync.set({ 'foo': 'hello', 'bar': 'hi' }, function () {
    //   console.log('Settings saved');
    // });
    window.localStorage.setItem(stateTitle, stateValues);
}
function setTextSize(element, text) {
    let textLength = text.length;
    let fontSize = interpolate(textLength, 1, 50, 50, 20);
    element.style.fontSize = `${fontSize}px`;
}
function interpolate(x, in_min, in_max, out_min, out_max) {
    return (x - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function createPageContent(activeStates) {
    // create all the columns

    let pageContent = document.querySelector(".calendar-content")

    for (let i = 0; i < 31; i++) {
        let dayContainer = document.createElement("div");
        dayContainer.classList.add("day-container");

        let dayNumber = document.createElement("div");
        dayNumber.classList.add("day-number");
        dayNumber.innerHTML = i + 1;


        let dayActivities = document.createElement("div");
        dayActivities.classList.add("day-activities");
        for (let dayAct = 0; dayAct < 5; dayAct++) {


            let individualAct = document.createElement("div");
            individualAct.classList.add("individual-act");


            let label = document.createElement("label");
            let check = document.createElement("INPUT");
            check.setAttribute("type", "checkbox");
            check.classList.add("act-checkbox");



            let actNumber = document.createElement("div");
            actNumber.classList.add("act-amount");


            let actImage = document.createElement("img");
            actImage.classList.add("act-image");
            let actnums = ['10,000', "2-2.5L", "8h", "1", ""];
            let actsrcs = ["steps", "water", "sleep", "shakes", "meditate"];

            check.setAttribute("data-act-day", `${actsrcs[dayAct]}-${i}`);
            actImage.src = `./icons/${actsrcs[dayAct]}.png`;
            actNumber.innerHTML = actnums[dayAct];

            label.appendChild(check);

            individualAct.appendChild(label);
            individualAct.appendChild(actNumber);
            individualAct.appendChild(actImage);

            dayActivities.appendChild(individualAct);


        }

        dayContainer.appendChild(dayNumber);
        dayContainer.appendChild(dayActivities);

        if (pageContent) {
            pageContent.appendChild(dayContainer);
        }
    }

    let allRadioButtons = document.querySelectorAll('.act-checkbox');

    allRadioButtons.forEach(radioButton => {
        let actDay = radioButton.dataset.actDay;
        let actDayParts = actDay.split('-');
        radioButton.checked= activeStates[actDayParts[0]][actDayParts[1]];

        radioButton.addEventListener("click", () => {
            let checked = radioButton.checked;    
            activeStates[actDayParts[0]][actDayParts[1]] = 1  * checked;

            saveInLocal('active-states-hl', JSON.stringify(activeStates));
            let audio = document.getElementById("audio");
            audio.play();

        })
    })
  
}
function createHeaderContent() {
    let header = document.querySelector(".header-container");
    if (!header) {
        return
    }
    header.innerHTML = "";
    activityKeys = Object.keys(activities);
    for (let i = 0; i < activityKeys.length; i++) {
        let topImageContainer = document.createElement("div");
        let topImage = document.createElement("img");
        topImageContainer.className = "daily-activity-icon-container"
        topImage.className = "daily-activity-icon";
        topImage.src = activities[activityKeys[i]].icon
        if (activityKeys[i] == activeActivity) {
            topImageContainer.classList.toggle('active-click');
        }
        topImageContainer.addEventListener('long-press', function (e) {
            let deleteModal = document.querySelector('.delete-modal-wrapper');
            deleteModal.classList.toggle('modal--visible');

            activityToRemove = activityKeys[i];
            // Hide the body's scroll bar, so only the modal's scroll is shown. Also helps to ensure mobile scrolling is on correct element
            document.querySelector("body").classList.add("no-scroll--modal");
            e.preventDefault();
            // e.target.setAttribute('data-editing', 'true');
        });
        topImageContainer.addEventListener('click', (e) => {
            let activityText = document.querySelector('.daily-activities-text');
            activityText.innerHTML = activities[activityKeys[i]].title
            setTextSize(activityText, activities[activityKeys[i]].title)
            let activeActivityIcons = document.querySelectorAll(".active-click");
            saveInLocal('active-activity', activityKeys[i])
            activeActivityIcons.forEach((element) => {
                element.classList.remove("active-click");
            })
            topImageContainer.classList.toggle('active-click');
            activeActivity = activityKeys[i];
            //Refresh the pages icons 
            let pageContent = document.querySelector(".calendar-content")
            pageContent.innerHTML = ""
            // clearBadges()
            createPageContent(activeStates)
        })
        topImageContainer.appendChild(topImage)
        if (header) {
            header.appendChild(topImageContainer)
        }
    }
}
function getCurrentDate() {
    let dateObj = new Date();
    let month = dateObj.getUTCMonth() + 1; //months from 1-12
    let day = dateObj.getUTCDate();
    let year = dateObj.getUTCFullYear();
    return year + "/" + month + "/" + day;
}
function clearBadges() {
    let badges = document.querySelectorAll(".badge");
    badges.forEach((badge) => {
        badge.style.filter = "brightness(100%)"
    })
}
const allActivities = {
    "steps": {
        id: "steps",
        icon: "./icons/steps.png",
    },
    "water": {
        id: "water",
        icon: "./icons/water.png",
    },
    "sleep": {
        id: "sleep",
        icon: "./icons/sleep.png",
    },
    "shakes": {
        id: "shakes",
        icon: "./icons/shakes.png",
    },
    "meditation": {
        id: "meditation",
        icon: "./icons/meditate.png",
    },
}


let dayBegan = window.localStorage.getItem("start-day-hl");

if (!dayBegan) {
    dayBegan = getCurrentDate();
    saveInLocal('start-day-hl', dayBegan)
}
let activeStates = JSON.parse(window.localStorage.getItem('active-states-hl')) || createActiveStates(["steps", "water", "sleep", "shakes", "meditate"]);
saveInLocal('active-states-hl', JSON.stringify(activeStates))
// saveInLocal('active-activity', activeActivity);

let activityToRemove = '';

window.addEventListener('load', (event) => {
    /* Builds the badges in the main content*/
    // Add the text to the text box
    // CHECK IF I AM ON MY PAGE

    // Potentially use this for the title?
    // let activityText = document.querySelector('.daily-activities-text');

    // if (activityText) {
    //     activityText.innerHTML = activities[activeActivity].title;
    //     setTextSize(activityText, activities[activeActivity].title)
    // }

    createPageContent(activeStates)

    // createHeaderContent();
    // let form = document.getElementById("process-form-button");
    // if (form) {
    //     form.addEventListener("click", processForm);
    // }
});
