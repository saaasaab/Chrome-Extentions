try {
    // GLOBAL VARIABLES 
    let originalDocumentSize = document.body.offsetHeight;
    let scale = .09;
    function distroyMiniMapFromDOM() {
        try {
            let minimapWrapper = document.querySelector(".minimap-wrap");
            if (minimapWrapper) {
                minimapWrapper.remove();
            }
        } catch (error) {

        }

    }

    // function takeScreenshot() {
    //     console.log(`true`, true)
    //     html2canvas(document.body).then(function (canvas) {

    //         console.log(`canvas`, canvas)
    //         return canvas
    //     });
    // }



    function createMiniMap() {

        let wrap = document.createElement('div');
        let container = document.createElement('div');
        let clicker = document.createElement('div');
        let closeButton = document.createElement('div');

        // Get background darkness

        let bodyBackgroundColor = document.body.style.backgroundColor || "rgb(255,255,255)";

        let rgb = bodyBackgroundColor.match(/\d+/g);
        let darnessSum = 0;

        for (let i in rgb) {
            darnessSum += +rgb[i]; // Forces the rgb value to be a number
        }

        let lightMode = true;
        if (darnessSum < 200) {
            lightMode = false;
        }


        let clone = document.querySelector('body').cloneNode(true);

        let allCloneScripts = clone.querySelectorAll('script');
        // let allCloneStyles = clone.querySelectorAll('style');
        let allCloneImages = clone.querySelectorAll('img');
        let allCloneVideos = clone.querySelectorAll('video');
        let allCloneSGVs = clone.querySelectorAll('svg');
        // let allCloneLinks = clone.querySelectorAll('a');

        allCloneSGVs.forEach((el) => { el.style.height = "100% !important" })
        allCloneScripts.forEach((el) => { el.remove() })
        // allCloneStyles.forEach((el) => { el.remove() })
        if (allCloneImages.length > 20) {
            // allCloneImages.forEach((el) => { el.remove() })
        }
        allCloneVideos.forEach((el) => { el.remove() })
        // allCloneLinks.forEach((el) => { el.remove() })

        let documentHeight = document.documentElement.scrollHeight

        let windowH = window.innerHeight;
        let windowW = window.innerWidth;

        let pageAspectRatio = documentHeight / windowW;

        container.innerHTML = clone.innerHTML;
        container.className = "minimap-container";
        container.style.height = `${documentHeight}px`;
        container.style.width = `${windowW}px`;


        clicker.className = "minimap-clicker";
        clicker.style.height = `${windowH}px`;
        clicker.style.width = `${windowW}px`;

        wrap.className = "minimap-wrap";
        wrap.style.backgroundColor = lightMode ? "#e9e9e9e9" : "rgb(104, 104, 104, .7)"
        wrap.style.width = `${scale * windowW}px`;

        closeButton.className = "minimap-close-button";
        closeButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="white" viewBox="0 0 24 24" stroke="black" stroke-width="2">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`;

        wrap.appendChild(container);
        wrap.appendChild(clicker);
        wrap.appendChild(closeButton);

        try {
            document.body.appendChild(wrap);
        } catch (error) {

        }

        addMinMapClick()
    }

    function addMinMapClick() {

        let minimapWrapper = document.querySelector(".minimap-wrap");
        let minimapContainer = document.querySelector(".minimap-container");
        let minimapClicker = document.querySelector(".minimap-clicker");
        let minimapCloseButton = document.querySelector('.minimap-close-button')

        document.addEventListener("scroll", (e) => {


            let documentHeight = document.documentElement.scrollHeight

            let windowH = window.innerHeight;
            let windowW = window.innerWidth;

            let windowRatio = windowH / windowW;

            let windowScrollY = window.pageYOffset
            const mmHeight = minimapContainer.getBoundingClientRect().height


            minimapClicker.style.height = `${windowRatio * windowW}px`;
            minimapClicker.style.top = `${windowScrollY / documentHeight * mmHeight}px`;
        });



        minimapCloseButton.addEventListener('click', (e) => {
            minimapWrapper.remove()
        })


        minimapContainer.addEventListener('click', (e) => {
            let windowW = window.innerWidth;
            let windowH = window.innerHeight;

            let scale = 0.09;

            let mmHeight = e.path[0].offsetHeight * scale;

            let htmlElement = document.documentElement;
            let bodyElement = document.body;
            let documentHeight = Math.max(
                htmlElement.clientHeight, htmlElement.scrollHeight, htmlElement.offsetHeight,
                bodyElement.scrollHeight, bodyElement.offsetHeight
            );


            let rect = e.path[0].getBoundingClientRect()
            let clickY = e.clientY - rect.top;


            let jumpToPoint = (clickY) / (mmHeight) * documentHeight - windowH / 2;

            // console.log(`clickY`, clickY)
            // console.log(`mmHeight`, mmHeight)
            // console.log(`windowH`, windowH)
            // console.log(`documentHeight`, documentHeight)
            // console.log(`jumpToPoint`, jumpToPoint)

            window.scrollTo({
                top: jumpToPoint,
                left: 0,
                behavior: 'smooth'
            });
        })
    }



    try {
        // create an Observer instance


        const resizeObserver = new ResizeObserver((entries) => {


            if (Math.abs(originalDocumentSize - document.body.offsetHeight) > 1000) {
                originalDocumentSize = document.body.offsetHeight;
                distroyMiniMapFromDOM();
                createMiniMap()


            }
        })

        // start observing a DOM node
        resizeObserver.observe(document.body)

    } catch (error) {

    }


    if (!document.querySelector(".minimap-wrap")) {
        createMiniMap()
    }



} catch (error) {
    console.log(`error`, error)
}
