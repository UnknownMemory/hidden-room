import React, {useReducer, useEffect, useContext, useRef} from 'react';
import {Col, Navbar, InputGroup, Button, FormControl} from 'react-bootstrap';
import {useSwipeable} from 'react-swipeable';
import PropTypes from 'prop-types';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

import Message from '../Message/Message';

import UserContext from '../../contexts/UserContext';
import ChatReducer from './ChatReducer';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useAPI from '../../hooks/useAPI';

const Chat = (props) => {
    const {t, i18n} = useTranslation();
    const {get, status} = new useAPI();
    const token = Cookies.get('auth_token');
    
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

    useDocumentTitle(state.room ? `${state.room.user2} & ${state.room.user1} / Hidden Room` : 'Hidden Room');

    const getChatrooms = async () => {
        let response = await get(`/chat/private-chatrooms/${props.roomID}/`, null, {Authorization: `Token ${token}`});
        if(status.current.ok){
            dispatch({type: 'get_room', room: response});
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

    const scrollEvent = async () => {
        if (messagesDiv.current.scrollTop <= 0 && state.next != null) {
            const messages = await get(state.next, null, {Authorization: `Token ${this.token}`});

            dispatch({type: 'messages', messages: [...messages.results.reverse(), ...state.messages]});
            dispatch({type: 'next', next: messages.next});
            document.querySelectorAll('.message')[20].scrollIntoView();
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

        get(`/chat/room/${props.roomID}/messages/`, null, {Authorization: `Token ${token}`}).then((res) => {
            dispatch({type: 'messages', messages: res.results.reverse()});
            dispatch({type: 'next', next: res.next});
            document.querySelector('.messages').scrollTo(0, document.querySelector('.messages').scrollHeight);
        });

        const protocolWS = window.location.protocol == 'https:' ? 'wss' : 'ws';
        ws.current = new WebSocket(
            `${protocolWS}://${process.env.REACT_APP_SOCKET_URL}/chat/${props.roomID}/?token=${Cookies.get('auth_token')}`
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
                    placeholder={t('chat.form.placeholder')}
                    onChange={(e) => dispatch({type: 'message', field: 'message', message: e.currentTarget.value})}
                    aria-label="Message"
                    aria-describedby="message-input"
                    value={state.message}
                />
                <InputGroup.Append>
                    <Button variant="hidden" onClick={sendMessage}>
                        {t('common.form.send')}
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
