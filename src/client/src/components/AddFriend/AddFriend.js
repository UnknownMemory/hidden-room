import React, {useReducer} from 'react';
import {Form, InputGroup, Button} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

import AddFriendReducer from './AddFriendReducer';
import useAPI from '../../hooks/useAPI';

const AddFriend = () => {
    const {t, i18n} = useTranslation();
    const token = Cookies.get('auth_token');

    const {post} = new useAPI();
    const [state, dispatch] = useReducer(AddFriendReducer, {username: ''});

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('username', state.username);

        await post('/account/friends/add/', formdata, {Authorization: `Token ${token}`});
        return;
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Label>{t('relationship.addFriend.description')}</Form.Label>
            <InputGroup>
                <Form.Control
                    type="text"
                    placeholder={t('common.form.username')}
                    onChange={(e) => dispatch({type: 'username', username: e.currentTarget.value})}
                />
                <InputGroup.Append>
                    <Button variant="hidden" type="submit">
                        {t('relationship.addFriend.sendRequest')}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
};

export default AddFriend;
