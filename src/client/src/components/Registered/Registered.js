import React from 'react';
import {Link} from 'react-router-dom';

const Registered = () => {
    return (
        <div className="d-flex justify-content-center align-items-center h-100" fluid>
            <div>You're now registered to Hidden Room.</div>
            <Link className="ml-1" to="/login">Login</Link>
        </div>
    );
};

export default Registered;
