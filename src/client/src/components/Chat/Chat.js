import React, {useReducer, useEffect, useContext, useRef} from 'react';
import {Col, Navbar, Nav, InputGroup, Button, FormControl} from 'react-bootstrap';
import {useSwipeable} from 'react-swipeable';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';

import Message from '../Message/Message';

import UserContext from '../../contexts/UserContext';
import ChatReducer from './ChatReducer';

const Chat = (props) => {
    let ws = useRef();
    let messagesDiv = useRef();

    const user = useContext(UserContext);
    const initState = {
        room: null,
        message: '',
        messages: [],
        next: null,
        isOpen: false,
    };

    const [state, dispatch] = useReducer(ChatReducer, initState);

    const getOldMessages = async (url) => {
        let res = await fetch(url, {
            method: 'GET',
            headers: {Authorization: `Token ${Cookies.get('auth_token')}`},
        });

        let response = await res.json();
        return response;
    };

    const getChatrooms = async () => {
        let res = await fetch(`${process.env.API_URL}/api/v1/chat/private-chatrooms/${props.roomID}/`, {
            method: 'GET',
            headers: {Authorization: `Token ${Cookies.get('auth_token')}`},
        });

        if (res.ok) {
            let response = await res.json();
            dispatch({type: 'get_room', room: response});
        } else {
            let error = await res.json();
            console.log(error);
        }
    };

    const sendMessage = () => {
        const date = Date.now() / 1000;
        ws.current.send(
            JSON.stringify({
                message: state.message,
                created_at: date,
            })
        );
        dispatch({type: 'message', message: ''});
    };

    const scrollEvent = () => {
        if (messagesDiv.current.scrollTop <= 0 && state.next != null) {
            getOldMessages(state.next).then((res) => {
                dispatch({type: 'messages', messages: [...res.results.reverse(), ...state.messages]});
                dispatch({type: 'next', next: res.next});
                document.querySelectorAll('.message')[20].scrollIntoView();
            });
        }
    };

    const msg = state.messages.map((message, i) => {
        return <Message key={i} message={message} />;
    });

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            dispatch({type: 'isOpen'});
        },
    });

    useEffect(() => {
        getChatrooms();
        getOldMessages(`${process.env.API_URL}/api/v1/chat/room/${props.roomID}/messages/`).then((res) => {
            dispatch({type: 'messages', messages: res.results.reverse()});
            dispatch({type: 'next', next: res.next});
            document.querySelector('.messages').scrollTo(0, document.querySelector('.messages').scrollHeight);
        });

        const protocolWS = window.location.protocol == 'https:' ? 'wss' : 'ws';
        ws.current = new WebSocket(
            `${protocolWS}://${process.env.SOCKET_URL}/chat/${props.roomID}/?token=${Cookies.get('auth_token')}`
        );

        return () => {
            ws.current.close();
            dispatch({type: 'next', next: null});
            dispatch({type: 'messages', messages: []});
        };
    }, [props.roomID]);

    useEffect(() => {
        if (!ws.current) {
            return;
        }

        ws.current.onmessage = (e) => {
            dispatch({type: 'messages', messages: [...state.messages, JSON.parse(e.data)]});
        };
    }, [state.messages]);

    return (
        <Col md="10" xs="12" className={`chat h-100 bg-dark ${state.isOpen ? 'open' : ''}`} {...handlers}>
            <Navbar bg="dark" variant="dark" className="justify-content-between align-items-center">
                <Navbar.Brand className="d-sm-block">
                    {state.room ? (user.user.username == state.room.user1 ? state.room.user2 : state.room.user1) : ''}
                </Navbar.Brand>
                <div className="mobile-menu d-block d-sm-none" onClick={() => dispatch({type: 'isOpen'})}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </div>
            </Navbar>
            <div className="messages" ref={messagesDiv} onScroll={scrollEvent}>
                {msg}
            </div>
            <InputGroup className="p-3">
                <FormControl
                    placeholder="Message"
                    onChange={(e) => dispatch({type: 'message', field: 'message', message: e.currentTarget.value})}
                    aria-label="Message"
                    aria-describedby="message-input"
                    value={state.message}
                />
                <InputGroup.Append>
                    <Button variant="hidden" onClick={sendMessage}>
                        Send
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Col>
    );
};

Chat.propTypes = {
    roomID: PropTypes.string,
};

export default Chat;
