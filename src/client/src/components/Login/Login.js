import React, {useContext, useReducer} from 'react';
import {Container, Form, Button, Row, Col, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

import LangSelector from '../LangSelector/LangSelector';

import UserContext from '../../contexts/UserContext';
import LoginReducer from './LoginReducer';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useAPI from '../../hooks/useAPI';

const Login = () => {
    const {t} = useTranslation();
    const {post, isLoading, status, error} = useAPI();
    useDocumentTitle(`${t('login.title')} / Hidden Room`);

    const initState = {
        username: '',
        password: '',
        error: '',
    };

    const user = useContext(UserContext);

    const [state, dispatch] = useReducer(LoginReducer, initState);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('username', state.username);
        formdata.append('password', state.password);

        const response = await post('/auth/', formdata);

        if (status.current.ok) {
            Cookies.set('auth_token', response['token']);
            user.getUserDetail();
        } else if (response['non_field_errors']) {
            dispatch({type: 'error', error: response['non_field_errors'][0]});
            return;
        }
    };
    return (
        <Container className="h-100" fluid>
            <Row className="h-100 justify-content-center">
                <Col xl={3} lg={4} md={6} className="text-center main-title align-self-center">
                    <h1>Hidden Room</h1>
                    <h2>{t('login.title')}</h2>
                    <Form className="text-left" onSubmit={onSubmit}>
                        {error && <Form.Text className="error">{error}</Form.Text>}
                        <Form.Group controlId="username">
                            <Form.Label>{t('common.form.username')}</Form.Label>
                            <Form.Control
                                type="username"
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'username', payload: e.currentTarget.value})
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>{t('common.form.password')}</Form.Label>
                            <Form.Control
                                type="password"
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'password', payload: e.currentTarget.value})
                                }
                                required
                            />
                        </Form.Group>
                        <Button variant="hidden" type="submit">
                            {isLoading ? (
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                            ) : (
                                <span>{t('login.title')}</span>
                            )}
                        </Button>
                        <Form.Text className="d-inline ml-2 error">{state.error === true ? '' : state.error}</Form.Text>
                        <div className="mt-2">
                            <p className="d-inline">{t('login.noAccount')}</p>
                            <Link className="ml-1" to="/register">
                                {t('register.title')}
                            </Link>
                        </div>
                    </Form>
                </Col>
                <Col className="lang-select position-absolute" md={1}>
                    <LangSelector></LangSelector>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
