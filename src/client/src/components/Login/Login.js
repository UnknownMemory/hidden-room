import React, {useContext, useReducer} from 'react';
import {Container, Form, Button, Row, Col, Spinner} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';

import UserContext from '../../contexts/UserContext';
import LoginReducer from './LoginReducer';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useAPI from '../../hooks/useAPI';

const Login = () => {
    const {post, isLoading, status, error} = useAPI();

    useDocumentTitle('Login / Hidden Room');
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
        <Container className="d-flex justify-content-center align-items-center h-100" fluid>
            <Row>
                <Col className="text-center main-title">
                    <h1>Hidden Room</h1>
                    <h2>Login</h2>
                    <Form className="text-left" onSubmit={onSubmit}>
                        {error ? <Form.Text className="error">{error}</Form.Text> : null}
                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="username"
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'username', payload: e.currentTarget.value})
                                }
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
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
                            ) : null}
                            Login
                        </Button>
                        <Form.Text className="d-inline ml-2 error">{state.error === true ? '' : state.error}</Form.Text>
                        <div className="mt-2">
                            <p className="d-inline">Don't have an account?</p>
                            <Link className="ml-1" to="/register">
                                Register
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
