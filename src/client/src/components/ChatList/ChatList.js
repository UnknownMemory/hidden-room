import React, {useContext, useState, useEffect, useReducer, useCallback} from 'react';
import {Col, Media, Navbar} from 'react-bootstrap';
import {BsFillPersonFill} from 'react-icons/bs';
import {useHistory} from 'react-router-dom';
import Cookies from 'js-cookie';
import ChatService from '../../services/ChatService';
import 'holderjs';

import Profile from '../Profile/Profile';

import ChatListReducer from './ChatListReducer';
import UserContext from '../../contexts/UserContext';

const ChatList = () => {
    const Chat = new ChatService();
    const user = useContext(UserContext);
    const initState = {
        rooms: [],
    };

    const [state, dispatch] = useReducer(ChatListReducer, initState);

    const history = useHistory();
    const toRoom = useCallback((id) => history.push(`/app/room/${id}`), [history]);

    const getChatrooms = async () => {
        const response = await Chat.getChatrooms();
        dispatch({type: 'get_rooms', rooms: response});
    };

    const rooms = state.rooms.map((room) => {
        return (
            <Media as="li" key={room.chatroom_id} onClick={() => toRoom(room.chatroom_id)}>
                <Media.Body>
                    <h6>{user.user.username == room.user1 ? room.user2 : room.user1}</h6>
                </Media.Body>
            </Media>
        );
    });

    useEffect(() => {
        getChatrooms();
    }, []);

    return (
        <Col md="2" xs="9" className="chats h-100">
            <Navbar variant="dark" className="justify-content-between align-items-center">
                <Navbar.Brand>Messages</Navbar.Brand>
            </Navbar>
            <ul className="chat-list list-unstyled">
                <Media as="li" onClick={() => toRoom('me')}>
                    <Media.Body>
                        <BsFillPersonFill size={20} />
                        <h6>Friends</h6>
                    </Media.Body>
                </Media>
                {rooms}
            </ul>
            <Profile />
        </Col>
    );
};

export default ChatList;
