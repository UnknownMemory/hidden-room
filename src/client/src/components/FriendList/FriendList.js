import React, {useReducer, useEffect} from 'react';
import {Col, Navbar, Nav} from 'react-bootstrap';
import {useTranslation} from 'react-i18next';
import Cookies from 'js-cookie';

import Card from '../Card/Card';
import AddFriend from '../AddFriend/AddFriend';
import FriendListReducer from './FriendListReducer';
import {useSwipeable} from 'react-swipeable';
import useDocumentTitle from '../../hooks/useDocumentTitle';
import useAPI from '../../hooks/useAPI';

const FriendList = () => {
    const {t, i18n} = useTranslation();
    useDocumentTitle(`${t('common.friends')} / Hidden Room`);

    const {get, isLoading, status} = new useAPI();
    const initState = {
        isOpen: false,
        friends: [],
        pillsFriend: 'friends',
    };

    const [state, dispatch] = useReducer(FriendListReducer, initState);

    const handleSelect = (eventKey) => {
        dispatch({type: 'pills_friend', pillsFriend: eventKey});
        getFriends();
    };

    const getFriends = async () => {
        const token = Cookies.get('auth_token');
        const response = await get('/account/friends/', null, {Authorization: `Token ${token}`});
        if (status.current.ok) {
            dispatch({type: 'get_friend', friends: response});
        }
    };

    const friends = state.friends.map((friend) => {
        if (state.pillsFriend.toUpperCase() == friend.relationship) {
            return <Card friend={friend} key={friend.id} getFriends={getFriends}></Card>;
        } else {
            return;
        }
    });

    useEffect(() => {
        getFriends();
    }, []);

    const handlers = useSwipeable({
        onSwipedLeft: () => {
            dispatch({type: 'isOpen'});
        },
    });

    return (
        <Col md="10" xs="12" className={`friend-list h-100 bg-dark ${state.isOpen ? 'open' : ''}`} {...handlers}>
            <Navbar bg="dark" variant="dark" className="justify-content-between align-items-center">
                <Navbar.Brand className="d-none d-sm-block">{t('common.friends')}</Navbar.Brand>
                <Nav variant="pills" defaultActiveKey="friends" onSelect={handleSelect}>
                    <Nav.Item>
                        <Nav.Link eventKey="friends">{t('common.friends')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="pending">{t('relationship.pending')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="blocked">{t('relationship.blocked')}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="add_friend">{t('relationship.addFriend.title')}</Nav.Link>
                    </Nav.Item>
                </Nav>
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
            <ul className="friends-list list-unstyled">
                {state.pillsFriend == 'add_friend' ? <AddFriend /> : friends}
            </ul>
        </Col>
    );
};

export default FriendList;
