import Cookies from 'js-cookie';
import Request from '../utils/request';

class UserService {
    constructor(){
        this.url = `${process.env.REACT_APP_API_URL}/api/v1`;
        this.token = Cookies.get('auth_token');
    }

    async getUserDetail(){
        let response = await Request(`${this.url}/account/me/detail/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

    async getCurrentUser(){
        let response = await Request(`${this.url}/account/me/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

    async getFriends(){
        let response = await Request(`${this.url}/account/friends/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

    async AddFriendRequest(data){
        let response = await Request(`${this.url}/account/friends/add/`, data, {Authorization: `Token ${this.token}`}, 'POST')
        return response;
    }

    async AcceptFriend(id, data){
        let response = await Request(`${this.url}/account/friends/${id}/update/`, data, {Authorization: `Token ${this.token}`}, 'PATCH')
        return response;
    }

    async DeleteFriend(id){
        let response = await Request(`${this.url}/account/friends/${id}/`, null, {Authorization: `Token ${this.token}`}, 'DELETE')
        return response;
    }

    async UpdateAccount(id, data){
        let response = await Request(`${this.url}/account/me/update/${id}/`, data, {Authorization: `Token ${this.token}`}, 'PATCH')
        return response;
    }

    async getFriendProfile(id){
        let response = await Request(`${this.url}/account/friend/${id}/detail/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

}

export default UserService;