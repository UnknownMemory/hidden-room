import Cookies from 'js-cookie';
import Request from '../utils/request';

class APIService {
    constructor(){
        this.url = `${process.env.API_URL}/api/v1`;
    }

    get Token() {
        return Cookies.get('auth_token');
    }

    async getOldMessages(url){
        let response = await Request(url, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async getFriendProfile(id){
        let response = await Request(`${this.url}/account/friend/${id}/detail/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async checkEmail(email){
        let response = await Request(`${this.url}/account/check/email/?email=${email}`);
        return response;
    }

    async checkUsername(username){
        let response = await Request(`${this.url}/account/check/username/?username=${username}`);
        return response;
    }

    async getChatroom(roomID){
        let response = await Request(`${this.url}/chat/private-chatrooms/${roomID}/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async getChatrooms(){
        let response = await Request(`${this.url}/chat/private-chatrooms/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async getUserDetail(){
        let response = await Request(`${this.url}/account/me/detail/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async getCurrentUser(){
        let response = await Request(`${this.url}/account/me/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async getFriends(){
        let response = await Request(`${this.url}/account/friends/`, null, {Authorization: `Token ${this.Token}`});
        return response;
    }

    async Register(data) {
        let response = await Request(`${this.url}/account/create/`, data, {}, 'POST');
        return response;
    };

    async Login(data){
        let response = await Request(`${this.url}/auth/`, data, {}, 'POST')
        return response;
    }

    async AddFriendRequest(data){
        let response = await Request(`${this.url}/account/friends/add/`, data, {Authorization: `Token ${this.Token}`}, 'POST')
        return response;
    }

    async AcceptFriend(id, data){
        let response = await Request(`${this.url}/account/friends/${id}/update/`, data, {Authorization: `Token ${this.Token}`}, 'PATCH')
        return response;
    }

    async DeleteFriend(id){
        let response = await Request(`${this.url}/account/friends/${id}/`, null, {Authorization: `Token ${this.Token}`}, 'DELETE')
        return response;
    }

    async UpdateAccount(id, data){
        let response = await Request(`${this.url}/account/me/update/${id}/`, data, {Authorization: `Token ${this.Token}`}, 'PATCH')
        return response;
    }

}

export default new APIService;