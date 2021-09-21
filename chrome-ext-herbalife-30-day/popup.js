
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
    saveInLocal('active-activities', JSON.stringify(activities));

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
        saveInLocal('active-activities', JSON.stringify(activities));

        console.log(activities, activeStates)


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


    // todayIndex= 4

    // let offset=0;
    // if (todayIndex < limitLow && clickIndex > 365-clickIndex){
    //     offset =  365-clickIndex;
    // }

    // clickIndex = 365-clickIndex; 

    // console.log( clickIndex, todayIndex, offset)

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


        })
    })
    // currentActivity.forEach((monthStates, monthIndex) => {
    //     let monthCol = document.createElement("div");
    //     monthCol.classList.add("month-col");
    //     let monthName = document.createElement("div");
    //     monthName.classList.add("month-name");
    //     let dayNumbers = document.createElement("div")
    //     dayNumbers.classList.add("day-numbers");
    //     monthStates.forEach((dayStates, dayIndex) => {
    //         let dayNumber = document.createElement("div");
    //         dayNumber.classList.add(`day-number`);
    //         dayNumber.classList.add(`day${dayIndex + 1}`);
    //         dayNumber.setAttribute("data-month-index", monthIndex);
    //         dayNumber.setAttribute("data-day-index", dayIndex);
    //         let badge = document.createElement("img");
    //         badge.classList.add("badge");
    //         let badgeNumber = document.createElement("div");
    //         badgeNumber.classList.add("badge-number");
    //         if (dayStates == 1) {
    //             badge.style.filter = "brightness(150%)";
    //         }
    //         badge.src = "./icons/daybadge-off.png";
    //         badgeNumber.innerHTML = dayIndex + 1;
    //         dayNumber.appendChild(badge);
    //         dayNumber.appendChild(badgeNumber);
    //         dayNumbers.appendChild(dayNumber);
    //     });
    //     monthName.innerHTML = monthNames[monthIndex];
    //     monthCol.appendChild(monthName);
    //     monthCol.appendChild(dayNumbers);
    // if (pageContent) {
    //     pageContent.appendChild(monthCol);
    // }
    // <div class="month-col">
    //   <div class="month-name">Jan</div>
    //   <div class="day-numbers">
    //     <div class="day-number day1">
    //       <img class="badge" src="./icons/daybadge-off.png" />
    //       <div class="badge-number">1</div>
    //     </div>
    //   </div>
    // })
    //Adds the on click for badges
    // let badges = document.querySelectorAll(".day-number");
    // badges.forEach((badge, badgeIndex) => {
    //     badge.addEventListener("click", (e) => {
    //         if (preventAddingFutureDates(badgeIndex)) {

    //             let badgeImage = badge.querySelector('.badge');
    //             let monthIndex = badge.dataset.monthIndex;
    //             let dayIndex = badge.dataset.dayIndex;
    //             let badgeState = activeStates[activeActivity][monthIndex][dayIndex];

    //             badge.src = './icons/daybadge-off.png';

    //             if(badgeState == 0){
    //                 badgeImage.style.filter = "brightness(150%)";
    //                 let audio = document.getElementById("audio");
    //                 audio.play();
    //                 // WHAT MONTH IS IT?
    //                 activeStates[activeActivity][monthIndex][dayIndex] = 1

    //             }
    //             else{
    //                 badgeImage.style.filter = "brightness(100%)";
    //                 let audioLow = document.getElementById("audio-low");
    //                 audioLow.play();
    //                 activeStates[activeActivity][monthIndex][dayIndex] = 0;
    //             }

    //             console.log(activeStates)
    //             saveInLocal('active-states-hl', JSON.stringify(activeStates))
    //         }
    //     })
    // })
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
    // "yoga": {
    //     id: "yoga",
    //     icon: "./icons/sleep.png",
    // },
    // "running": {
    //     id: "running",
    //     icon: "./icons/sleep.png",
    // },
    // "biking": {
    //     id: "biking",
    //     icon: "./icons/sleep.png",
    // },
    // "weights": {
    //     id: "weights",
    //     icon: "./icons/sleep.png",
    // },
    // "stretching": {
    //     id: "stretching",
    //     icon: "./icons/sleep.png",
    // },
}
// const activities = JSON.parse(window.localStorage.getItem('active-activities')) || {
//     "jump-rope": {
//         title: "Read every day",
//         icon: "./icons/reading.png",
//     },
// }
// const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"]
// let activityKeys = Object.keys(activities);
// LOAD THE DAYS FROM STORAGE
// let activeActivity = window.localStorage.getItem('active-activity') || 'reading';

let dayBegan = window.localStorage.getItem("start-day");

if (!dayBegan) {
    dayBegan = getCurrentDate();
    saveInLocal('start-day', dayBegan)
}
let activeStates = JSON.parse(window.localStorage.getItem('active-states-hl')) || createActiveStates(["steps", "water", "sleep", "shakes", "meditate"]);
saveInLocal('active-states-hl', JSON.stringify(activeStates))
// saveInLocal('active-activity', activeActivity);

console.log(activeStates)
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
