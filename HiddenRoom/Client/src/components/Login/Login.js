import React from 'react';
import {Container, Form, Button, Row, Col} from 'react-bootstrap';

const Login = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center h-100" fluid>
            <Row>
                <Col className="text-center main-title">
                    <h1>Hidden Room</h1>
                    <h2>Login</h2>
                    <Form className="text-left">
                        <Form.Group controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" required />
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control type="password" required />
                            <a className="mt-2" href="#">
                                Forgot your password?
                            </a>
                        </Form.Group>
                        <Button variant="hidden" type="submit">
                            Login
                        </Button>
                        <p className="mt-2">
                            Don't have an account?
                            <span>
                                <a href="/register"> Register</a>
                            </span>
                        </p>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;