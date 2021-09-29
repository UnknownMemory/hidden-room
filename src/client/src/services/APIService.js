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
        let response = await Request(`${this.url}/account/friend/${id}/detail/`, {Authorization: `Token ${this.Token}`});
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

    async Register(data) {
        let response = await Request(`${this.url}/account/create/`, data, {}, 'POST');
        return response;
    };
}

export default new APIService;