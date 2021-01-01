import React from 'react';
import './Home.css';
import { Link } from "react-router-dom";

const home = ( props ) => {

    return (
        <div className="Home window">
            
            <h1 className="text-center">Welcome</h1>

            <div>
                <p className="text-center">If you already have an accout, click here</p>
                <div className="text-center"><Link to="/login">Click here to login</Link></div>
            </div>

            <div>
                <p className="text-center">Otherwise you can register here</p>
                <div className="text-center"><Link to="/register">Click here to register</Link></div>
            </div>
            
        </div>
    )

};

export default home;