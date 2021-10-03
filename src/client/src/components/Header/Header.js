import React, {useContext} from 'react';
import {Nav} from 'react-bootstrap';

import UserContext from '../../contexts/UserContext';

const Header = () => {
    const user = useContext(UserContext);
    const profile = user.user;

    return (
        <Nav>
            <a>{profile.username}</a>
        </Nav>
    );
};

export default Header;
