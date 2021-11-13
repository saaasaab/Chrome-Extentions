import React, { useState } from 'react';
import "../styles/login.css";

function Login( { submitForm }) {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    const handleSubmit = (e) => {

        e.preventDefault();
        submitForm([username,password]);
        // submitNewGoalForm([verb, number, noun, duration]);
        // setIncomingGoalFormData(true);
        setUsername("");
        setPassword("");

        e.target.reset()

    }
    const reSetUsername = (e) => {
        setUsername(e.target.value)
    }

    const reSetPassword = (e) => {
        setPassword(e.target.value)
    }


    return (
        <section className="login-modal">
            <div className="login-welcome">Sign in</div>
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
                    value='Enter'
                />


            </form>

        </section>
    )
}

export default Login
