import React, { useState, useEffect } from 'react'
import Login from './Login';
import axios from 'axios';
import { saveToLocal } from "../utils/utils";

// import Axios from 'Ax'
function Navbar({ setIncomingGoalsDBData, setGoalsDBData, setLoggedIn, loggedIn, setRunModals }) {
    const [openLogin, setOpenLogin] = useState(false);
    const [openUser, setOpenUser] = useState(false);

    const submitForm = (e) => {
        setOpenLogin(!openLogin);
        setGoalsDBData(e);
        setIncomingGoalsDBData(true);
    }

    const createNewAccount = (e) => {
        setOpenLogin(!openLogin);
        setGoalsDBData([]);
        setIncomingGoalsDBData(true);
        setRunModals(true);
    }



    return (
        <div className="navbar">
            <div className="logo">Grid Goal</div>

            <div className="rest-of-navbar"></div>
            {loggedIn ? <div className="login-icon" onClick={() => {
                setOpenLogin(!openLogin);
            }
            }></div> : <div className="user-profile" onClick={() => {
                setOpenUser(!openUser);
            }
            }></div>}


            {openLogin ?
                <Login submitForm={submitForm} setLoggedIn={setLoggedIn} loggedIn={loggedIn} createNewAccount={createNewAccount}/>
                : <></>
            }

        </div>
    )
}

export default Navbar
