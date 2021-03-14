import React, { Component } from 'react';
import { Redirect } from "react-router-dom";
import Aux from '../../hoc/hocComp';
import Cookies from 'js-cookie';

class AppWrapper extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            projects: []
        };
    }

    render(){

        if(/* Not logged in */false) {
            return (
                <div>
                    <Redirect to="/login" />
                </div>
            )
        }
        else {
            return(
                <Aux>

                </Aux>
            );
        }

    }
}

export default AppWrapper;