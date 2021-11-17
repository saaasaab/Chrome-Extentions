import React, { useState, useEffect } from 'react';
import "../styles/login.css";
import axios from 'axios';
import { saveToLocal } from '../utils/utils';
function Login({ submitForm, setLoggedIn, loggedIn, createNewAccount }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [mainLogin, setMainLogin] = useState(true);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [registerUser, setRegisterUser] = useState(false);



    const getActiveGoals = (id) => {
        axios.post('http://localhost:3001/all-goals-by-id',
            {
                "username": username,
                "user_id": id
            }
        ).then((response) => {

            submitForm(response.data);
        })
    }
    const handlePasscodeReset = (e) => {
        setMainLogin(false);
        setRegisterUser(false);
        e.preventDefault();
        e.target.reset();
    }

    const handleCreateAccount = (e) => {
        setMainLogin(false);
        setRegisterUser(false);

        e.preventDefault();

        axios.post('http://localhost:3001/create-account',
            {
                "username": username,
                "password": password
            }
        ).then((response) => {

            console.log(`response.data`, response.data)
            if (response.data.added == true) {
                // Get user idp

                saveToLocal("user_id", response.data.id)
                // SUCCESS! Your account is now active.
                // getActiveGoals(response.data)
                createNewAccount(response.data)
                // // setIncomingGoalFormData(true);
                // setUsername("");
                // setPassword("");
                setLoggedIn(true);
            }
            else {
                // Handle no login
            }

        })


        e.target.reset();
    }
    const handleSubmit = (e) => {

        e.preventDefault();

        // setOpenLogin(!openLogin);
        axios.post('http://localhost:3001/login',
            {
                "username": username,
                "password": password
            }
        ).then((response) => {
            saveToLocal("user_id", response.data)

            if (response.data !== -1) {
                getActiveGoals(response.data)
                // setIncomingGoalFormData(true);
                setUsername("");
                setPassword("");
                setLoggedIn(true);
            }
            else {
                // Handle no login
            }

        })

        e.target.reset();

    }
    const reSetUsername = (e) => {
        setUsername(e.target.value)
    }

    const reSetPassword = (e) => {
        setPassword(e.target.value)
    }


    useEffect(() => {
        if (loggedIn) {
            // setUsername(false);
            // setPassword(false);
            // setMainLogin(false);

        }
    }, [loggedIn])

    return (
        <section className="login-modal">

            {
                mainLogin ?
                    <>
                        <div className="login-welcome">Login</div>
                        <div className="login-welcome-subtext">Sign into your account</div>

                        <form className={"login-form"} onSubmit={e => { handleSubmit(e) }} autoComplete="off">
                            <input
                                className="login-input"
                                name="username"
                                placeholder='Username'
                                required
                                value={username}
                                onChange={(e) => reSetUsername(e)}
                                autoComplete="off"
                            />

                            <input
                                className="login-input"
                                name="password"
                                type="password"
                                placeholder='Password'
                                required
                                value={password}
                                onChange={(e) => reSetPassword(e)}
                            />
                            <input
                                className="login-submit"
                                type='submit'
                                value='Login'
                            />
                        </form>

                        <div className="forgot-password" onClick={e => {
                            setForgotPassword(true);
                            setMainLogin(false);
                            setRegisterUser(false);

                        }}>
                            I forgot my password
                        </div>

                        <button className="register-new-account" onClick={e => {
                            setRegisterUser(true);
                            setForgotPassword(false);
                            setMainLogin(false);
                        }}>
                            Register New Account
                        </button>
                    </> : <></>}

            {forgotPassword ?
                <>
                    <div className="login-welcome">Password Reset</div>
                    <div className="login-welcome-subtext">It's ok, not everyone can remember the same password they use for everything else</div>

                    <form className={"login-form"} onSubmit={e => { handlePasscodeReset(e) }} autoComplete="off">
                        <input
                            className="login-input"
                            name="Email"
                            placeholder='Email'
                            required
                            value={username}
                            onChange={(e) => reSetUsername(e)}
                            autoComplete="off"
                        />

                        <input
                            className="login-submit"
                            type='submit'
                            value='Reset Password'
                        />
                    </form>
                </> : <></>}

            {registerUser ?
                <>
                    <div className="login-welcome">Welcome</div>
                    <div className="login-welcome-subtext">Create a New Account</div>

                    <form className={"login-form"} onSubmit={e => { handleCreateAccount(e) }} autoComplete="off">
                        <input
                            className="login-input"
                            name="username"
                            placeholder='Username'
                            required
                            value={username}
                            onChange={(e) => reSetUsername(e)}
                            autoComplete="off"
                        />

                        <input
                            className="login-input"
                            name="password"
                            type="password"
                            placeholder='Password'
                            required
                            value={password}
                            onChange={(e) => reSetPassword(e)}
                        />
                        <input
                            className="login-submit"
                            type='submit'
                            value='Create Account'
                        />
                    </form>
                </> :
                <></>}
            {/* 
            {loggedIn ? <>
                <button className="register-new-account" onClick={e => {
                    setLoggedIn(false)
                        }}>
                            Logout
                        </button>
            </> : <></>} */}

        </section>
    )
}

export default Login
