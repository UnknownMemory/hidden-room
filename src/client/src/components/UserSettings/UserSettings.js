import React, {useEffect, useReducer} from 'react';
import {useDebouncedCallback} from 'use-debounce';
import {Modal, Button, Form, InputGroup} from 'react-bootstrap';
import {BsPencil} from 'react-icons/bs';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

import UserSettingsReducer from './UserSettingsReducer';
import passwordChecker from '../../utils/passwordChecker';
import useAPI from '../../hooks/useAPI';

const UserSettings = (props) => {
    const {t} = useTranslation();
    const {get, patch, status} = new useAPI();
    const token = Cookies.get('auth_token');

    const initState = {
        detail: false,
        modify: {
            username: true,
            email: true,
        },
        username: '',
        email: '',
        newPassword: '',
        confirmPassword: '',
        isPasswordValid: false,
        isPasswordMatching: false,
        error: {},
    };

    const [state, dispatch] = useReducer(UserSettingsReducer, initState);

    const getDetail = async () => {
        let response = await get('/account/me/detail/', null, {Authorization: `Token ${token}`});
        if (status.current.ok) {
            dispatch({type: 'detail', detail: response});
        }
    };

    const checkPassword = useDebouncedCallback(async (dispatch) => {
        const isPasswordValid = passwordChecker(state.newPassword);
        if (isPasswordValid) {
            dispatch({type: 'error', errorType: 'newPassword', error: 'input-valid'});
            dispatch({type: 'isPasswordValid', isPasswordValid: true});
        } else {
            dispatch({type: 'error', errorType: 'newPassword', error: 'input-error'});
            dispatch({type: 'isPasswordValid', isPasswordValid: false});
        }
    }, 800);

    const passwordMatch = useDebouncedCallback(async (dispatch) => {
        if (state.newPassword === state.confirmPassword) {
            dispatch({type: 'error', errorType: 'confirmPassword', error: 'input-valid'});
            dispatch({type: 'isPasswordMatching', isPasswordMatching: true});
        } else {
            dispatch({type: 'error', errorType: 'confirmPassword', error: 'input-error'});
            dispatch({type: 'isPasswordMatching', isPasswordMatching: false});
        }
    }, 800);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        if (!state.modify.username && state.username !== state.detail.username && state.username) {
            formdata.append('username', state.username);
        }
        if (!state.modify.email && state.email !== state.detail.email && state.email) {
            formdata.append('email', state.email);
        }

        if (state.isPasswordValid && state.isPasswordMatching) {
            formdata.append('password', state.newPassword);
            formdata.append('confirm_password', state.confirmPassword);
        }

        await patch(`/account/me/update/${state.detail.id}/`, formdata, {Authorization: `Token ${token}`});
        props.handleModal();
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <Modal show={props.show} onHide={props.handleModal}>
            <Modal.Header closeButton>
                <Modal.Title>{t('settings.title')}</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>{t('common.form.username')}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="text"
                                defaultValue={state.detail.username}
                                readOnly={state.modify.username}
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'username', payload: e.currentTarget.value})
                                }
                                required
                            />
                            <InputGroup.Append>
                                <Button
                                    variant="hidden"
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: 'modify',
                                            modify: {username: false, email: state.modify.email},
                                        })
                                    }>
                                    <BsPencil />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>{t('common.form.email')}</Form.Label>
                        <InputGroup>
                            <Form.Control
                                type="email"
                                defaultValue={state.detail.email}
                                readOnly={state.modify.email}
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'email', payload: e.currentTarget.value})
                                }
                                required
                            />
                            <InputGroup.Append>
                                <Button
                                    variant="hidden"
                                    type="button"
                                    onClick={() =>
                                        dispatch({
                                            type: 'modify',
                                            modify: {email: false, username: state.modify.username},
                                        })
                                    }>
                                    <BsPencil />
                                </Button>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>{t('settings.form.newPassword')}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={t('settings.form.newPassword')}
                            onChange={(e) => {
                                dispatch({type: 'change', field: 'newPassword', payload: e.currentTarget.value});
                                checkPassword(dispatch);
                            }}
                            className={state.newPassword.length > 0 ? state.error.newPassword : ''}
                        />
                    </Form.Group>

                    <Form.Group controlId="confirm_password">
                        <Form.Label>{t('settings.form.confirmNewPassword')}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={t('settings.form.confirmNewPassword')}
                            onChange={(e) => {
                                dispatch({type: 'change', field: 'confirmPassword', payload: e.currentTarget.value});
                                passwordMatch(dispatch);
                            }}
                            className={state.confirmPassword.length > 0 ? state.error.confirmPassword : ''}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="hidden" onClick={props.handleModal}>
                    {t('settings.modal.close')}
                </Button>
                <Button
                    variant="hidden"
                    onClick={onSubmit}
                    disabled={
                        state.username || state.email || (state.isPasswordValid && state.isPasswordMatching)
                            ? false
                            : true
                    }>
                    {t('settings.modal.saveChanges')}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

UserSettings.propTypes = {
    show: PropTypes.bool,
    handleModal: PropTypes.func,
};

export default UserSettings;
