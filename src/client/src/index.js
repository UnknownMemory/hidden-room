import React from 'react';
import {render} from 'react-dom';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';

import App from './components/App';
import './sass/style.scss';

render(
    <Router>
        <App />
    </Router>,
    document.getElementById('root')
);
