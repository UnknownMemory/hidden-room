import React, {useReducer} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Container, Form, Button, Row, Col, Spinner} from 'react-bootstrap';
import {useDebouncedCallback} from 'use-debounce';
import { useTranslation } from 'react-i18next';

import LangSelector from '../LangSelector/LangSelector';

import RegisterReducer from './RegisterReducer';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import passwordChecker from '../../utils/passwordChecker';
import useAPI from '../../hooks/useAPI';

const Register = () => {
    const {t, i18n} = useTranslation();
    const {get, post, isLoading, status} = useAPI();

    useDocumentTitle(`${t('register.title')} / Hidden Room`);
    
    let history = useHistory();

    const initState = {
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        error: {},
        isPasswordValid: false,
        isEmailValid: false,
        isUsernameValid: false,
        isPasswordMatching: false
    };

    const [state, dispatch] = useReducer(RegisterReducer, initState);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('username', state.username);
        formdata.append('password', state.password);
        formdata.append('confirm_password', state.confirm_password);
        formdata.append('email', state.email);

        await post('/account/create/', formdata)
        if(status.current.ok){;
            return history.push('/register/success');
        }
        return;
    };

    const checkPassword = useDebouncedCallback(async (dispatch) => {
        const isPasswordValid = passwordChecker(state.password);
        if (isPasswordValid) {
            dispatch({type: 'error', errorType: 'password', error: 'input-valid'});
            dispatch({type: 'isPasswordValid', isPasswordValid: true});
        } else {
            dispatch({type: 'error', errorType: 'password', error: 'input-error'});
            dispatch({type: 'isPasswordValid', isPasswordValid: false});
        }
    }, 800);

    const checkEmail = useDebouncedCallback(async (dispatch) => {
        const response = await get(`/account/check/email/?email=${state.email}`);
        dispatch({type: 'error', errorType: 'email', error: response});
        if(response != true){
            dispatch({type: 'isEmailValid', isEmailValid: false});
        } else {
            dispatch({type: 'isEmailValid', isEmailValid: true});
        }
    }, 800);

    const checkUsername = useDebouncedCallback(async (dispatch) => {
        const response = await get(`/account/check/username/?username=${state.username}`);
        dispatch({type: 'error', errorType: 'username', error: response});
        if(response != true){
            dispatch({type: 'isUsernameValid', isUsernameValid: false});
        } else {
            dispatch({type: 'isUsernameValid', isUsernameValid: true});
        }
    }, 800);

    const passwordMatch = useDebouncedCallback(async (dispatch) => {
        if (state.password === state.confirm_password) {
            dispatch({type: 'error', errorType: 'confirm_password', error: 'input-valid'});
            dispatch({type: 'isPasswordMatching', isPasswordMatching: true});
        } else {
            dispatch({type: 'error', errorType: 'confirm_password', error: 'input-error'});
            dispatch({type: 'isPasswordMatching', isPasswordMatching: false});
        }
    }, 800);

    return (
        <Container className="h-100" fluid>
            <Row className="h-100 justify-content-center">
                <Col xl={3} lg={4} md={6} className="text-center main-title align-self-center">
                    <h1>Hidden Room</h1>
                    <h2>{t('register.description')}</h2>
                    <Form className="text-left" onSubmit={onSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>{t('common.form.email')}</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'email', payload: e.currentTarget.value});
                                    checkEmail(dispatch);
                                }}
                                type="email"
                                className={state.email.length > 0 ? (state.isEmailValid ? 'input-valid' : 'input-error') : ''}
                                required
                            />
                            <Form.Text className="error">
                                {state.error.email === true ? '' : state.error.email}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="username">
                            <Form.Label>{t('common.form.username')}</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'username', payload: e.currentTarget.value});
                                    checkUsername(dispatch);
                                }}
                                type="username"
                                className={state.username.length > 0 ? (state.isUsernameValid ? 'input-valid' : 'input-error') : ''}
                                required
                            />
                            <Form.Text className="error">
                                {state.error.username === true ? '' : state.error.username}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>{t('common.form.password')}</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'password', payload: e.currentTarget.value})
                                    checkPassword(dispatch);
                                    }
                                }
                                type="password"
                                className={state.password.length > 0 ? state.error.password : ''}
                                required
                            />
                            <Form.Text muted>
                                {t('register.passwordValidation')}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="confirm_password">
                            <Form.Label>{t('register.confirmPassword')}</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'confirm_password', payload: e.currentTarget.value});
                                    passwordMatch(dispatch);
                                }}
                                type="password"
                                className={state.confirm_password.length > 0 ? state.error.confirm_password : ''}
                                required
                            />
                        </Form.Group>

                        <Button variant="hidden" type="submit" disabled={state.isPasswordValid && state.isEmailValid && state.isUsernameValid && state.isPasswordMatching ? false : true}>
                        {isLoading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />: <span>{t('register.title')}</span>}
                        </Button>
                        <div className="mt-2">
                            <p className="d-inline">{t('register.accountExist')}</p>
                            <Link className="ml-1" to="/login">
                                {t('login.title')}
                            </Link>
                        </div>
                    </Form>
                </Col>
                <Col className="lang-select position-absolute" lg={1} md={2} sm={2} xs={4}>
                    <LangSelector></LangSelector>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
