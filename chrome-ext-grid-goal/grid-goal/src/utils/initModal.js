export const addOpenModalListener = function (element) {
    let classes = [...element.classList];
    if (!(classes.includes("open-modal-added"))) {
        element.classList.add('open-modal-added');
        element.addEventListener("click", function (e) {

            // alternate way to populate modal, dynamically loading the src tag:
            // data-url='' in the html element being clicked on, same one with 'data-modal-event', just add this additional data-url attribute
            // and class='modal-embed-src' plus an empty src tag: src='' in the modal content
            // this is primarily used for modals with pdfs, videos, or any slow loading content
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
    }
};
export const addCloseModalListener = function (element) {
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
    });
};
