import React from 'react';
import '../styles/modal.css';

function Modal() {
    const addOpenModalListener = function (element) {
        console.log(`element`, element)
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
        });
    };


    document.querySelectorAll("[data-modal-event]").forEach(addOpenModalListener);
    // Close the modal when the user clicks the close button or somewhere outside of the main modal content
    document.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);

    // Emptying out the modal's src tag if it is using the dynamic loading method
    // This will also cause video playback to stop upon modal close, which is a desired outcome, rather than have multiple videos playing sound, hidden in the background
    const modalEmbeddedSrc = document.querySelector(".modal-embed-src");
    if (modalEmbeddedSrc) {
        modalEmbeddedSrc.src = "";
    }


    return (
        <section className="section__modal">
            <div className="modal__wrapper js-modal--placeholder">
                <div className="modal__overflow-wrapper">
                    <div className="modal__content">
                        <div className="modal__close">
                            <img
                                src="https://brandlive-upload.s3-us-west-2.amazonaws.com/1676/documents/fwtty4e03m/closeicon--black.svg"
                                className="modal__close--icon"
                                alt="Close This Modal"
                            />
                        </div>
                        <h1>Modal Number One</h1>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Modal



//  < main className="section__main" >
//   < !--Normal loading modal-- >
//   <h1 data-modal-event="placeholder">Click Me</h1>

//   <!--Dynamically loading modal-- >
//     <h1 data-modal-event="lorem-ipsum" data-url="">Lorem</h1>
// </main >
