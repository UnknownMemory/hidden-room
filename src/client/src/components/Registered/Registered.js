import React from 'react';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';

const Registered = () => {
    const {t} = useTranslation();
    return (
        <div className="d-flex justify-content-center align-items-center h-100">
            <div>{t('registered.message')}</div>
            <Link className="ml-1" to="/login">{t('login.title')}</Link>
        </div>
    );
};

export default Registered;
