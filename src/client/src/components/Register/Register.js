import React, {useReducer} from 'react';
import {Link, useHistory} from 'react-router-dom';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';
import {useDebouncedCallback} from 'use-debounce';

import RegisterReducer from './RegisterReducer';
import AuthService from '../../services/AuthService';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import passwordChecker from '../../utils/passwordChecker';

const Register = () => {
    useDocumentTitle('Register / Hidden Room');
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

        const res = await AuthService.Register(formdata);
        if(res.id){;
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
        const response = await AuthService.checkEmail(state.email);
        dispatch({type: 'error', errorType: 'email', error: response});
        if(response != true){
            dispatch({type: 'isEmailValid', isEmailValid: false});
        } else {
            dispatch({type: 'isEmailValid', isEmailValid: true});
        }
    }, 800);

    const checkUsername = useDebouncedCallback(async (dispatch) => {
        const response = await AuthService.checkUsername(state.username);
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
                                className={state.email.length > 0 ? (state.isEmailValid ? 'input-valid' : 'input-error') : ''}
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
                                className={state.username.length > 0 ? (state.isUsernameValid ? 'input-valid' : 'input-error') : ''}
                                required
                            />
                            <Form.Text className="error">
                                {state.error.username === true ? '' : state.error.username}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
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
                                Your password must be 8-20 characters long and contain at least one number.
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="confirm_password">
                            <Form.Label>Confirm Password</Form.Label>
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
                            Register
                        </Button>
                        <div className="mt-2">
                            <p className="d-inline">Already have an account?</p>
                            <Link className="ml-1" to="/login">
                                Login
                            </Link>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Register;
