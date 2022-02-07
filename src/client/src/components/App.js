import React, {useState, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import Cookies from 'js-cookie';

import PrivateRoute from './CustomRoute/PrivateRoute';
import PublicRoute from './CustomRoute/PublicRoute';

import Login from './Login/Login';
import Register from './Register/Register';
import Registered from './Registered/Registered';
import Main from './Main/Main';
import NotFound from './NotFound/NotFound';
import UserContext from '../contexts/UserContext';
import useAPI from '../hooks/useAPI';

const App = () => {
    const {get, status} = new useAPI();
    const token = Cookies.get('auth_token');
    const [user, setUser] = useState({});

    const getUserDetail = async () => {
        const currentUser = await get('/account/me/', null, {Authorization: `Token ${token}`});
        if(status.current.ok){
            setUser(currentUser);
        }
 
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
                    <PublicRoute exact restricted="false" path="/register/success" component={Registered} />
                    <PrivateRoute exact restricted="true" path="/app/room/:id(\d+|me)" component={Main} />
                    <Route exact path="*" component={NotFound} />
                </Switch>
            </Router>
        </UserContext.Provider>
    );
};

export default App;
