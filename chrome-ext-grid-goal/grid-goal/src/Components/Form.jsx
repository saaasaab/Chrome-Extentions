import React from 'react'
import { useState } from 'react';
import addIcon from '../assets/add-amount.png';

function Form({ submitForm }) {


    const [fieldValue, setFieldValue] = useState('ADD AMOUNT');


    const handleSubmit = (e) => {
        e.preventDefault();
        e.target[1].value=""
        // e.current.value = ""
        console.log(fieldValue)
        submitForm(fieldValue);
    }

    const reSetNumber = (e) => {
        let text = ""
        text = e.target.value
        setFieldValue(text)
        
    }


    return (
        <>

            <div className="add-amount-container">
                <form className={"form-inline"} onSubmit={e => { handleSubmit(e) }}>
                    <div className={"add-amount-field"}>
                     
                        <input
                        className="submit-button plus-icon"
                        type='submit'
                        value=' '
                    />
                        <input
                            className="text-input"
                            name="number"
                            placeholder='ADD AMOUNT'
                            required
                            
                            onChange={e => reSetNumber(e)}
                        />
                    </div>
                    
                </form>

            </div>


        </>
    )

}

export default Form;