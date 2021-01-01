import React from 'react';
import './Login.css';
import { Link } from "react-router-dom";

const login = ( props ) => {

    return (
        <div className="Login window">
            
            <div className="button-back"><Link to="/">Back to HomePage</Link></div>
            
            <h1 className="text-center">Login Page</h1>

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
                    <small>Otherwise you can register <Link to="/register">here</Link></small>
                </p>
            </div>

        </div>
    )

};

export default login;