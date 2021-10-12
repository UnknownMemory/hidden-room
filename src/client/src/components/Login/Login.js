import React, {useContext, useReducer, useEffect} from 'react';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import Cookies from 'js-cookie';

import UserContext from '../../contexts/UserContext';
import LoginReducer from './LoginReducer';
import AuthService from '../../services/AuthService';

const Login = () => {
    const initState = {
        username: '',
        password: '',
        error: '',
    };

    const user = useContext(UserContext);

    const [state, dispatch] = useReducer(LoginReducer, initState);

    useEffect(() => {
        document.title = 'Login / Hidden Room';
    }, []);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('username', state.username);
        formdata.append('password', state.password);

        let response = await AuthService.Login(formdata);
        if(response['non_field_errors']){
            dispatch({type: 'error', error: response['non_field_errors'][0]})
            return;
        }
        Cookies.set('auth_token', response['token']);
        user.getUserDetail();
    };

    return (
        <Container className="d-flex justify-content-center align-items-center h-100" fluid>
            <Row>
                <Col className="text-center main-title">
                    <h1>Hidden Room</h1>
                    <h2>Login</h2>
                    <Form className="text-left" onSubmit={onSubmit}>
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
                            Login
                        </Button>
                        <Form.Text className="d-inline ml-2 error">
                                {state.error === true ? '' : state.error}
                        </Form.Text>
                        <div className="mt-2">
                            <p className="d-inline">Don't have an account?</p>
                            <Link className="ml-1" to="/register">Register</Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
