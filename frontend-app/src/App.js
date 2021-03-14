import './App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import Cookies from 'js-cookie';

import HomePage from './pages/Home';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import AppWrapper from './components/AppWrapper/AppWrapper';

function App() {

    let appContent = 
            <Router>
                <Switch>
                    <Route exact path="/">
                        <HomePage />
                    </Route>
                    <Route path="/login">
                        <LoginPage />
                    </Route>
                    <Route path="/register">
                        <RegisterPage />
                    </Route>
                    <Route path='/home'>
                        <AppWrapper />
                    </Route>
                </Switch>
            </Router>;

    return (
        <div>
            {appContent}
        </div>
    );

}

export default App;
