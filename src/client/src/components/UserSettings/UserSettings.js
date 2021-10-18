import React, {useEffect, useReducer} from 'react';
import {Modal, Button, Form, InputGroup, Tooltip, OverlayTrigger} from 'react-bootstrap';
import {BsPencil} from 'react-icons/bs';
import PropTypes from 'prop-types';
import {isMobile} from 'react-device-detect';

import UserService from '../../services/UserService';
import UserSettingsReducer from './UserSettingsReducer';

const UserSettings = (props) => {
    const UserAPI = new UserService();
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
    };

    const [state, dispatch] = useReducer(UserSettingsReducer, initState);

    const getDetail = async () => {
        let response = await UserAPI.getUserDetail();
        dispatch({type: 'detail', detail: response});
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const formdata = new FormData();
        if (!state.modify.username && state.username !== state.detail.username && state.username) {
            formdata.append('username', state.username);
        }
        if (!state.modify.email && state.email !== state.detail.email && state.email) {
            formdata.append('email', state.email);
        }

        //formdata.append('password', state.newPassword);
        //formdata.append('confirm_password', state.confirmNewPassword);

        await UserAPI.UpdateAccount(state.detail.id, formdata);
        props.handleModal();
    };

    useEffect(() => {
        getDetail();
    }, []);

    return (
        <Modal show={props.show} onHide={props.handleModal}>
            <Modal.Header closeButton>
                <Modal.Title>Settings</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Form>
                    <Form.Group controlId="username">
                        <Form.Label>Usermame</Form.Label>
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
                                <OverlayTrigger show={isMobile ? false : true} trigger="hover" placement="right" overlay={<Tooltip>Modify</Tooltip>}>
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
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label>Email address</Form.Label>
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
                                <OverlayTrigger show={isMobile ? false : true} trigger="hover" placement="right" overlay={<Tooltip>Modify</Tooltip>}>
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
                                </OverlayTrigger>
                            </InputGroup.Append>
                        </InputGroup>
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Current Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="New password"
                            onChange={(e) =>
                                dispatch({type: 'change', field: 'newPassword', payload: e.currentTarget.value})
                            }
                        />
                    </Form.Group>

                    <Form.Group controlId="confirm_password">
                        <Form.Label>New Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            onChange={(e) =>
                                dispatch({type: 'change', field: 'confirmPassword', payload: e.currentTarget.value})
                            }
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>

            <Modal.Footer>
                <Button variant="hidden" onClick={props.handleModal}>
                    Close
                </Button>
                <Button
                    variant="hidden"
                    onClick={onSubmit}
                    disabled={state.modify.username && state.modify.email ? true : false}>
                    Save changes
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
