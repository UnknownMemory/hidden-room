import React, {useReducer, useContext, useEffect} from 'react';
import {Media, Button, Figure} from 'react-bootstrap';
import {BsX, BsCheck} from 'react-icons/bs';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
import 'holderjs';

import UserContext from '../../contexts/UserContext';
import CardReducer from './CardReducer';
import APIService from '../../services/APIService';

const Card = (props) => {
    const user = useContext(UserContext);
    const initState = {
        profile: null,
    };

    const [state, dispatch] = useReducer(CardReducer, initState);

    const getProfile = async (props) => {
        const id = props.friend.user_id == user.id ? props.friend.user_id : props.friend.user2_id;
        const response = await APIService.getFriendProfile(id);
   
        dispatch({type: 'profile', profile: response});
    };

    const deleteFriend = async (props) => {
        await fetch(`${process.env.API_URL}/api/v1/account/friends/${props.friend.id}/`, {
            method: 'DELETE',
            headers: {Authorization: `Token ${Cookies.get('auth_token')}`},
        });
        props.getFriends();
    };

    const addFriend = async (props) => {
        let formdata = new FormData();
        formdata.append('user_id', props.friend.user_id);
        formdata.append('user2_id', props.friend.user2_id);
        formdata.append('relationship', 'FRIENDS');

        await fetch(`${process.env.API_URL}/api/v1/account/friends/${props.friend.id}/update/`, {
            method: 'PATCH',
            headers: {Authorization: `Token ${Cookies.get('auth_token')}`},
            body: formdata,
        });
        props.getFriends();
    };

    const options = (props) => {
        if (props.friend.relationship == 'PENDING') {
            return (
                <div>
                    {props.friend.user_id != user.user.id ? (
                        <Button variant="hidden-option" onClick={() => addFriend(props)}>
                            <BsCheck size={20} />
                        </Button>
                    ) : (
                        ''
                    )}

                    <Button variant="hidden-option" onClick={() => deleteFriend(props)}>
                        <BsX size={20} />
                    </Button>
                </div>
            );
        }
    };

    useEffect(() => {
        getProfile(props);
    }, []);

    return (
        <Media as="li">
            <Media.Body>
                <h6>{state.profile ? state.profile.username : null}</h6>
                <div className="options">{options(props)}</div>
            </Media.Body>
        </Media>
    );
};

Card.propTypes = {
    friend: PropTypes.shape({
        id: PropTypes.number,
        relationship: PropTypes.string,
        user_id: PropTypes.number,
        user2_id: PropTypes.number,
    }),

    getFriends: PropTypes.func,
};

export default Card;
