import React, { useState, useEffect } from 'react'
import Login from './Login';
import { addOpenModalListener, addCloseModalListener } from "../utils/initModal";

function Navbar() {
    const [openLogin, setOpenLogin] = useState(false);
    const [closeLogin, setCloseLogin] = useState(true);
    const [runModals, setRunModals] = useState(false);


    // useEffect(() => {
    //     const navbar = document.querySelector('.navbar');
    //     navbar.querySelectorAll("[data-modal-event]").forEach(addOpenModalListener);
    //     // Close the modal when the user clicks the close button or somewhere outside of the main modal content
    //     navbar.querySelectorAll(".modal__wrapper").forEach(addCloseModalListener);
    //     // }
    //     console.log(navbar)
    //     setRunModals(false);
    // }, [runModals])


    return (
        <div className="navbar">
            <div className="logo">Grid Goal</div>

            <div className="rest-of-navbar"></div>
            <div className="user-profile" onClick={() => {
                setOpenLogin(!openLogin);
                setRunModals(true);
            }
            }></div>

            {openLogin ?
                <Login />
                : <></>
            }

        </div>
    )
}

export default Navbar
