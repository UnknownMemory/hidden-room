import Cookies from 'js-cookie';
import Request from '../utils/request';

class ChatService {
    constructor(){
        this.url = `${process.env.API_URL}/api/v1`;
        this.token = Cookies.get('auth_token');
    }

    async getOldMessages(url){
        let response = await Request(url, null, {Authorization: `Token ${this.token}`});
        return response;
    }

    async getChatroom(roomID){
        let response = await Request(`${this.url}/chat/private-chatrooms/${roomID}/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

    async getChatrooms(){
        let response = await Request(`${this.url}/chat/private-chatrooms/`, null, {Authorization: `Token ${this.token}`});
        return response;
    }

}

export default new ChatService;