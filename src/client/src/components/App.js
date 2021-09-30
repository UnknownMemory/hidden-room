import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';

import PrivateRoute from './CustomRoute/PrivateRoute';
import PublicRoute from './CustomRoute/PublicRoute';

import Login from './Login/Login';
import Register from './Register/Register';
import Main from './Main/Main';
import NotFound from './NotFound/NotFound';
import UserContext from '../contexts/UserContext';
import UserService from '../services/UserService';

const App = () => {
    const [user, setUser] = useState({});

    const getUserDetail = async () => {
        const currentUser = await UserService.getCurrentUser();
        setUser(currentUser);
    };

    useEffect(() => {
        getUserDetail();
    }, []);

    return (
        <UserContext.Provider value={{user: user, getUserDetail: getUserDetail}}>
            <Router>
                <Switch>
                    <Route exact path="/" render={() => <Redirect to="/login" />} />
                    <PublicRoute exact restricted="false" path="/login" component={Login} />
                    <PublicRoute exact restricted="false" path="/register" component={Register} />
                    <PrivateRoute exact restricted="true" path="/app/room/:id(\d+|me)" component={Main} />
                    <Route exact path="*" component={NotFound} />
                </Switch>
            </Router>
        </UserContext.Provider>
    );
};

export default App;
