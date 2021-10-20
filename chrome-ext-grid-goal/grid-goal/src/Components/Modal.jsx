import React, { useState } from 'react';
import '../styles/modal.css';

function Modal({ submitNewGoalForm }) {
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
        });
    };


    document.querySelectorAll("[data-modal-event]").forEach(addOpenModalListener);
    // Close the modal when the user clicks the close button or somewhere outside of the main modal content
    document.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);


    const [verb, setVerb] = useState("");
    const [number, setNumber] = useState("");
    const [noun, setNoun] = useState("");



    const handleSubmit = (e) => {

        e.preventDefault();
        

        
        submitNewGoalForm([verb, number, noun]);
        setVerb("")
        setNumber("")
        setNoun("")
        e.target.reset()
        console.log(e.target)
        document.querySelectorAll(".modal--visible").forEach((el) => {
            el.classList.remove("modal--visible");
        });
    }

    const reSetVerb = (e) => {
        setVerb(e.target.value)
    }

    const reSetNumber = (e) => {
        setNumber(e.target.value)
    }

    const reSetNoun = (e) => {
        setNoun(e.target.value)
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

                        <h1>Own Your 2021</h1>
                        <form className={"new-goal-form"} onSubmit={e => { handleSubmit(e) }}>
                            <div className={"input-row"}>
                                <input
                                    className="text-input"
                                    name="verb"
                                    placeholder='Verb'
                                    required
                                    value={verb}
                                    onChange={e => reSetVerb(e)}
                                />
                                <input
                                    className="text-input"
                                    name="number"
                                    placeholder='Number'
                                    required
                                    value={number}
                                    onChange={e => reSetNumber(e)}
                                />
                                <input
                                    className="text-input"
                                    name="noun"
                                    placeholder='Noun'
                                    required
                                    value={noun}
                                    onChange={e => reSetNoun(e)}
                                />
                            </div>
                            <input
                                className="submit-button"
                                type='submit'
                                value='Create Goal Sheet'
                            />
                        </form>
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
