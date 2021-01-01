import React from 'react';
import './Register.css';
import { Link } from "react-router-dom";

const register = ( props ) => {

    return (
        <div className="Register window">
            
            <div className="button-back"><Link to="/">Back to HomePage</Link></div>
            
            <h1 className="text-center">Register Page</h1>

            <br/>

            <div className="my-3 mx-auto">
                <div className="my-3">
                    <label className="d-block text-center" for="email">Email</label>
                    <input id="email" className="d-block mx-auto" type="text" placeholder="Email adress"/>
                </div>
                <div className="my-3">
                    <label className="d-block text-center" for="password">Password</label>
                    <input id="password" className="d-block mx-auto" type="password" placeholder="Password"/>
                </div>
            </div>

            <br/>

            <div>
                <p className="text-center mb-1">
                    <small>If you already have an account, you can log <Link to="/register">here</Link></small>
                </p>
            </div>

        </div>
    )

};

export default register;