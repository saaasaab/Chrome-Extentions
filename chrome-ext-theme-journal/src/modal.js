// This will create a popup modal when clicking on a link with a data attribute of `data-modal-event`.
// The attribute's value will correspond to the class of the modal you want to show. For instance, if there is a modal
// that holds artist pictures, create a div with a class of `js-modal--artist-pictures` and put `artist-pictures` as the
// data attribute's value.


const addOpenModalListener = function (element) {
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
};

const addSubmitRemoveListener = function (element){
    let buttons = element.querySelectorAll('.button');
    buttons.forEach((button)=>{
        button.addEventListener("click", function (e) {
            removeGoal(button.dataset.removeGoal);

        })
    })
    element.addEventListener("click", function (e) {
        if (element.getAttribute("data-modal-event")) {
            // Add the visible class for both the mobile and desktop versions
            document
                .querySelectorAll(`.js-modal--${element.dataset.removeGoal}`)
                .forEach((el) => {
                    el.classList.add("modal--visible");
                });
            // Hide the body's scroll bar, so only the modal's scroll is shown. Also helps to ensure mobile scrolling is on correct element
            document.querySelector("body").classList.add("no-scroll--modal");
        }
    });
}


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
    });
};



window.addEventListener("DOMContentLoaded", () => {
    // Open the modal when the element has a `data-modal-event` attr
    document
        .querySelectorAll("[data-modal-event]")
        .forEach(addOpenModalListener);
    // Close the modal when the user clicks the close button or somewhere outside of the main modal content
    document.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);

    document.querySelectorAll(".delete-modal-wrapper").forEach(addSubmitRemoveListener);


    
});
