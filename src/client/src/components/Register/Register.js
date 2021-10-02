import React, {useReducer, useEffect} from 'react';
import {BrowserRouter as Link} from 'react-router-dom';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';
import {useDebouncedCallback} from 'use-debounce';
import AuthService from '../../services/AuthService';

import RegisterReducer from './RegisterReducer';

const Register = () => {
    const initState = {
        email: '',
        username: '',
        password: '',
        confirm_password: '',
        error: {},
    };

    const [state, dispatch] = useReducer(RegisterReducer, initState);

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        formdata.append('username', state.username);
        formdata.append('password', state.password);
        formdata.append('confirm_password', state.confirm_password);
        formdata.append('email', state.email);

       await AuthService.Register(formdata);
       return;
    };

    useEffect(() => {
        document.title = 'Register / Hidden Room';
    }, []);

    const checkEmail = useDebouncedCallback(async (dispatch) => {
        const response = await AuthService.checkEmail(state.email);
        dispatch({type: 'error', errorType: 'email', error: response});
        
    }, 800);

    const checkUsername = useDebouncedCallback(async (dispatch) => {
        const response = await AuthService.checkUsername(state.username);
        dispatch({type: 'error', errorType: 'username', error: response});
    }, 800);
    
    return (
        <Container className="d-flex justify-content-center align-items-center h-100" fluid>
            <Row>
                <Col className="text-center main-title">
                    <h1>Hidden Room</h1>
                    <h2>Create an account</h2>
                    <Form className="text-left" onSubmit={onSubmit}>
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'email', payload: e.currentTarget.value});
                                    checkEmail(dispatch);
                                }}
                                type="email"
                                className={state.error.email !== true && state.email != '' ? 'input-error' : ''}
                                required
                            />
                            <Form.Text className="error">
                                {state.error.email === true ? '' : state.error.email}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="username">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                onChange={(e) => {
                                    dispatch({type: 'change', field: 'username', payload: e.currentTarget.value});
                                    checkUsername(dispatch);
                                }}
                                type="username"
                                className={state.error.username !== true && state.username != '' ? 'input-error' : ''}
                                required
                            />
                            <Form.Text className="error">
                                {state.error.username === true ? '' : state.error.username}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    dispatch({type: 'change', field: 'password', payload: e.currentTarget.value})
                                }
                                type="password"
                                required
                            />
                            <Form.Text muted>
                                Your password must be 8-20 characters long, contain letters and numbers, and must not
                                contain spaces, or emoji.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="confirm_password">
                            <Form.Label>Confirm Password</Form.Label>
                            <Form.Control
                                onChange={(e) =>
                                    dispatch({
                                        type: 'change',
                                        field: 'confirm_password',
                                        payload: e.currentTarget.value,
                                    })
                                }
                                type="password"
                                required
                            />
                        </Form.Group>

                        <Button variant="hidden" type="submit">
                            Register
                        </Button>
                        <p className="mt-2">
                            Already have an account?
                            <span>
                                <Link to="/login"> Login</Link>
                            </span>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
