function modalMain() {
    function getState(key,obj){
        let size = Object.size(obj);
        let activityStates = pullFromLocal(key) || new Array(size).fill(-1);
        return activityStates
    }

    function saveInLocalSettings() {
        // Save it using the Chrome extension storage API.
        // chrome.storage.sync.set({ 'foo': 'hello', 'bar': 'hi' }, function () {
        //   console.log('Settings saved');
        // });
        window.localStorage.setItem('activity-states', activityStates);
        window.localStorage.setItem('zone-states', zoneStates);
    }

    function calculateDefaultXY(index, perRow) {
        let X = index % perRow;
        let Y = Math.floor(index / perRow);
        return { X, Y }
    }

    const addOpenModalListener = function (element) {
        element.addEventListener("click", function (e) {
            // alternate way to populate modal, dynamically loading the src tag:
            // data-url='' in the html element being clicked on, same one with 'data-modal-event', just add this additional data-url attribute
            // and class='modal-embed-src' plus an empty src tag: src='' in the modal content
            // this is primarily used for modals with pdfs, videos, or any slow loading content
            var url = element.dataset.url;
            if (url) {
                const modalEmbeddedSrc = document.querySelector(".modal-embed-src");
                if (modalEmbeddedSrc) {
                    modalEmbeddedSrc.src = url;
                }
            }

            if (element.getAttribute("data-modal-event")) {
                // Add the visible class for both the mobile and desktop versions
                document
                    .querySelectorAll(`.js-modal--${element.dataset.modalEvent}`)
                    .forEach((el) => {
                        el.classList.add("modal--visible");
                    });
                // Hide the body's scroll bar, so only the modal's scroll is shown. Also helps to ensure mobile scrolling is on correct element
                document.querySelector("body").classList.add("no-scroll--modal");
            }
        });
    };
    const addCloseModalListener = function (element) {
        element.addEventListener("click", function (e) {
            // If user is not clicking the close button or outside of the main modal, don't close the modal
            const eClassList = Array.from(e.target.classList);
            if (
                !eClassList.includes("modal__overflow-wrapper") &&
                !eClassList.includes("modal__close--icon")
            ) {
                return;
            }
            // Remove the visible class for both the mobile and desktop versions
            document.querySelectorAll(".modal--visible").forEach((el) => {
                el.classList.remove("modal--visible");
            });
            // Reveal the body's scroll bar
            document.querySelector("body").classList.remove("no-scroll--modal");
            // RESET DATA


            clearActivities();
            activityProps={}
            activityProps = createActivities(zoneStates)
            stage1 = true;
            stage2 = false;
            stage3 = false;
            stage4 = false;

            // activitySelector = document.querySelector(".activity-selector");
            

        });
    };
    function setActivityHover(i, iconsPerRow,leftValue, topValue,iconWidth,iconGap,isSet) {

        // set up the timer. Use element's position, 
        // Calculate the position of the time to be above the element
        let xBlock = i % iconsPerRow;
        let yBlock = Math.floor(i / iconsPerRow);
        let wBlock = cellWidth;
  
        
        let xdisplacement = interpolate(xBlock, 0, iconsPerRow - 1, 0, out_max);
        
        let timerPos = [
          leftValue, topValue
           
        ];
  
        let offset = [isSet?0:xdisplacement,-iconWidth];//[iconGroupOff[0],iconGroupOff[1]];

        let timeBlockTimer = document.querySelector('.modal-activity-selector');
        timeBlockTimer.style.display = "inline";
        timeBlockTimer.style.left = timerPos[0] + offset[0] + "px";
        timeBlockTimer.style.top = timerPos[1] + offset[1] + "px";
        timeBlockTimer.style.transition = "all .1s";

        timeBlockTimer.innerText = allActivities[i]["name"]
      }

    window.addEventListener("DOMContentLoaded", () => {
        // Open the modal when the element has a `data-modal-event` attr
        document
            .querySelectorAll("[data-modal-event]")
            .forEach(addOpenModalListener);
        // Close the modal when the user clicks the close button or somewhere outside of the main modal content
        document.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);

        // Emptying out the modal's src tag if it is using the dynamic loading method
        // This will also cause video playback to stop upon modal close, which is a desired outcome, rather than have multiple videos playing sound, hidden in the background
        // const modalEmbeddedSrc = document.querySelector(".modal-embed-src");
        // modalEmbeddedSrc.src = "";
    });


    // Creates the landing zones where the icons will be set to the color
    {/* <div class="landing-zone zone1"></div> */ }


    let zoneBoundries = []
    let zoneWidth = 40;
    let zoneGap = 5;
    let zoneOff = [50, 100];
 


    // Get the size of an object

    // let zoneStates = getState("zone-states",allZones)


    for (let i = 0; i < zoneStates.length; i++) {
        let landingZones = document.querySelector(".landing-zones");
        let landingZone = document.createElement('div');

        landingZone.classList.add("landing-zone");
        landingZone.classList.add("zone" + i);
        landingZone.style.width = zoneWidth + "px";
        landingZone.style.height = zoneWidth + "px";
        landingZone.style.top = zoneWidth * i + zoneGap * i + zoneOff[1] + "px";
        landingZone.style.left = zoneOff[0] + "px";
        landingZone.style.backgroundColor = allZones[i]["color"];

        landingZones.appendChild(landingZone);
        zoneBoundries.push([zoneOff[0], zoneWidth * i + zoneGap * i + zoneOff[1]])
    }


    // Create the icons
    {/* 
    <div class="movable-icon-container icon2">
        <img class="movable-icon" src="./icons/settings.png" />
    </div> 
*/}


    let iconWidth = 35;
    let iconGap = 20;
    let iconsPerRow = 4;
    let iconGroupOff = [150, 100];

    // let activityStates = getState("activity-states",allActivities)
   
    for (let i = 0; i < activityStates.length; i++) {
        let iconGroup = document.querySelector(".icon-group");

        let iconContainer = document.createElement('div');
        let icon = document.createElement('img');

        iconContainer.classList.add("movable-icon-container");
        iconContainer.classList.add("icon" + i);

        icon.classList.add("movable-icon");
        icon.src = allActivities[i]["src"] || './icons/settings.png';
        // icon.style.width = iconWidth + "px";
        // icon.style.height = iconWidth + "px";
        let { X, Y } = calculateDefaultXY(i, iconsPerRow);
        let leftValue;
        let topValue;
        let isSet = false;
        if (activityStates[i] == -1) {
            leftValue=iconGroupOff[0] + X * iconWidth + X * iconGap;
            topValue=iconGroupOff[1] + Y * iconWidth + Y * iconGap;
            iconContainer.style.left =  leftValue+ "px";
            iconContainer.style.top = topValue + "px";
        
        }

        else {
            leftValue=zoneBoundries[activityStates[i]][0] + 2.5 ;
            topValue=zoneBoundries[activityStates[i]][1] + 2.5;
            iconContainer.style.left =  leftValue+ "px";
            iconContainer.style.top = topValue + "px";
            isSet=true;
        }

        iconContainer.addEventListener("mouseover",(e)=>{
            setActivityHover(i, iconsPerRow, leftValue, topValue,iconWidth,iconGap,isSet);
        })

        iconContainer.appendChild(icon);
        iconGroup.appendChild(iconContainer);

    }


    // Make the DIV element draggable:

    let dragableIcons = document.querySelectorAll(".movable-icon-container");
    dragableIcons.forEach((dragableIcon, dragableIconIndex) => dragElement(dragableIcon, dragableIconIndex))

    function dragElement(elem, dragableIconIndex) {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        if (elem.querySelector(".movable-icon")) {
            // if present, the header is where you move the DIV from:
            elem.querySelector(".movable-icon").onmousedown = dragMouseDown;
        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elem.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;

            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elem.style.top = (elem.offsetTop - pos2) + "px";
            elem.style.left = (elem.offsetLeft - pos1) + "px";
        }

        function closeDragElement(e) {
            let reset = true;

            for (let i = 0; i < zoneBoundries.length; i++) {
                // console.log(elem.style.top > zoneBoundries[i][1] + "px",
                //     elem.style.top < zoneBoundries[i][1] + zoneWidth + "px",
                //     elem.style.left > zoneWidth + "px",
                //     elem.style.left < zoneWidth + zoneWidth + "px",
                //     +zoneStates[i] === -1);
         
                if (
                    elem.style.top > zoneBoundries[i][1] + "px" &&
                    elem.style.top < zoneBoundries[i][1] + zoneWidth + "px" &&
                    elem.style.left > zoneWidth + "px" &&
                    elem.style.left < zoneWidth + zoneWidth + "px" &&
                    +zoneStates[i] === -1 // This is the line that is causing the issue with swapping
                ) {

                    // set the element's new position:
                    reset = false;

                    elem.style.top = zoneBoundries[i][1] + 2.5 + "px";
                    elem.style.left = zoneBoundries[i][0] + 2.5 + "px";

                    zoneStates[i] = dragableIconIndex
                    activityStates[dragableIconIndex] = i

                    saveInLocalSettings();
                    break
                }
            }

            if (reset) {
                let { X, Y } = calculateDefaultXY(dragableIconIndex, iconsPerRow);
                // Reset icon's position to its original spot
                elem.style.left = iconGroupOff[0] + X * iconWidth + X * iconGap + "px";
                elem.style.top = iconGroupOff[1] + Y * iconWidth + Y * iconGap + "px";
                zoneStates[activityStates[dragableIconIndex]] = -1
                activityStates[dragableIconIndex] = -1;
                saveInLocalSettings();


            }
            // stop moving when mouse button is released:

            document.onmouseup = null;
            document.onmousemove = null;


        }
    }
}

modalMain();