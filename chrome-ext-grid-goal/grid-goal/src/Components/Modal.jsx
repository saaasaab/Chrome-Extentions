import React, { useState } from 'react';
import '../styles/modal.css';

function Modal({ submitNewGoalForm, setIncomingGoalFormData }) {

    const [verb, setVerb] = useState("");
    const [number, setNumber] = useState("");
    const [noun, setNoun] = useState("");
    const [duration, setDuration] = useState("");



    const handleSubmit = (e) => {

        e.preventDefault();
        submitNewGoalForm([verb, number, noun, duration]);
        setIncomingGoalFormData(true);
        setVerb("")
        setNumber("")
        setNoun("")
        setDuration("")
        e.target.reset()

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

    const reSetDuration = (e) => {
        setDuration(e.target.value)
    }


    return (
        <section className="section__modal">
            <div className="modal__wrapper js-modal--new-grid-goal">
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
                                    pattern="[+-]?\d+(?:[.,]\d+)?"
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

                                <select className="text-input"
                                        name="duration"
                                        placeholder='Duration'
                                        pattern="[+-]?\d+(?:[.,]\d+)?"
                                        required
                                        value={duration}
                                        onChange={e => reSetDuration(e)}>
                                    <option value="1">1 Day</option>
                                    <option value="7">7 Days</option>
                                </select>


                                {/* <input
                                    className="text-input"
                                    name="duration"
                                    placeholder='Duration'
                                    pattern="[+-]?\d+(?:[.,]\d+)?"
                                    required
                                    value={duration}
                                    onChange={e => reSetDuration(e)}
                                /> */}
                            </div>
                            <input
                                className="submit-button"
                                type='submit'
                                value='Create Goal Sheet'
                            />
                        </form>
                        <h1 className="preview-text">{verb!=""?verb: "_____"} {number!=""?number: "_____"} {noun!=""?noun: "_____"} in {duration!=""?duration: "_____"} {duration>1?"days":"day"}</h1>

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
