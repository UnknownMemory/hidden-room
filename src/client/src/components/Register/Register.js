import React, {useReducer, useEffect} from 'react';
import {BrowserRouter as Router, Switch, Route, Link, Redirect} from 'react-router-dom';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';
import {useDebouncedCallback} from 'use-debounce';

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

        let res = await fetch(`${process.env.API_URL}/api/v1/account/create/`, {
            body: formdata,
            method: 'POST',
        });

        if (res.ok) {
            console.log('Registered');
        } else {
            let error = await res.json();
            console.log(error);
        }
    };

    useEffect(() => {
        document.title = 'Register / Hidden Room';
    }, []);

    const checkEmail = useDebouncedCallback(async (dispatch) => {
        await fetch(`${process.env.API_URL}/api/v1/account/check/email/?email=${state.email}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                dispatch({type: 'error', errorType: 'email', error: data});
            });
    }, 800);

    const checkUsername = useDebouncedCallback(async (dispatch) => {
        await fetch(`${process.env.API_URL}/api/v1/account/check/username/?username=${state.username}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((data) => {
                dispatch({type: 'error', errorType: 'username', error: data});
            });
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
