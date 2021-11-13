import React, { useState, useEffect } from 'react'
import Login from './Login';
import axios from 'axios';
import { saveToLocal } from "../utils/utils";

// import Axios from 'Ax'
function Navbar( {setIncomingGoalsDBData, setGoalsDBData} ) {
    const [openLogin, setOpenLogin] = useState(false);

    const  submitForm = (e) =>{
        setOpenLogin(!openLogin);

        axios.post('http://localhost:3001/login', 
            {
                "username": e[0],
                "password": e[1]
            }
          
        ).then((response) => {
            // For some reason, "setGoalsDBData" has to come before "setIncomingGoalsDBData"
            setGoalsDBData(response.data);
            setIncomingGoalsDBData(true);
        })
    }



    return (
        <div className="navbar">
            <div className="logo">Grid Goal</div>

            <div className="rest-of-navbar"></div>
            <div className="user-profile" onClick={() => {
                setOpenLogin(!openLogin);
            }
            }></div>

            {openLogin ?
                <Login  submitForm={ submitForm} />
                : <></>
            }

        </div>
    )
}

export default Navbar
