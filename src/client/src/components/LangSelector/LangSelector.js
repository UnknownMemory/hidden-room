import React from 'react';
import {Form} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const LangSelector = () => {
    const { i18n } = useTranslation();

    const changLang = (lang) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('lang', lang);
        return;
    }

    return (
        <Form.Group controlId="lang">
            <Form.Control as="select" defaultValue="en" onChange={(e) => changLang(e.target.value)} value={localStorage.getItem('lang')}>
                <option value="en">EN</option>
                <option value="fr">FR</option>
            </Form.Control>
        </Form.Group>
    );
};

export default LangSelector;
