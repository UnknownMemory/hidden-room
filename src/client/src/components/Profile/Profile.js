import React, {useContext, useReducer, useEffect} from 'react';
import {Button, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {BsGearFill, BsArrowBarRight} from 'react-icons/bs';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';
import 'holderjs';

import UserSettings from '../UserSettings/UserSettings';

import UserContext from '../../contexts/UserContext';
import ProfileReducer from './ProfileReducer';

const Profile = () => {
    const {t, i18n} = useTranslation();
    const initState = {
        modal: false,
    };

    const user = useContext(UserContext);

    const logout = () => {
        Cookies.remove('auth_token');
        window.location.href = '/login';
    };

    const handleModal = () => {
        if (state.modal) {
            dispatch({type: 'modal', modal: false});
        } else {
            dispatch({type: 'modal', modal: true});
        }
    };

    const [state, dispatch] = useReducer(ProfileReducer, initState);

    useEffect(() => {
        user.getUserDetail();
    }, [state.modal]);

    return (
        <div className="user-profile">
            <div className="avatar">
                <img width="36" height="36" className="mr-3" src="holder.js/36x36" />
            </div>
            <div className="username">{user.user.username}</div>
            <div className="options">
                <OverlayTrigger placement="top" overlay={<Tooltip>{t('settings.title')}</Tooltip>}>
                    <Button variant="hidden-profile" onClick={handleModal}>
                        <BsGearFill size={18} />
                    </Button>
                </OverlayTrigger>
                <OverlayTrigger placement="top" overlay={<Tooltip>{t('profile.logOut')}</Tooltip>}>
                    <Button variant="hidden-profile" onClick={logout}>
                        <BsArrowBarRight size={18} />
                    </Button>
                </OverlayTrigger>
            </div>
            {state.modal ? <UserSettings show={state.modal} handleModal={handleModal} /> : null}
        </div>
    );
};

export default Profile;
