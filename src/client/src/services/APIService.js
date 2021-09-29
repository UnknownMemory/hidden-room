import Cookies from 'js-cookie';

class APIService {
    constructor(){
        this.url = `${process.env.API_URL}/api/v1`;
    }
    
    async Get(url, headers={}){
        let response = await fetch(url, {headers: headers, method: 'GET'})
                             .then(res => res.json())
                             .catch(err => console.error(err))
        return response;
    }

    async getFriendProfile(id){
        let response = await this.Get(`${this.url}/account/friend/${id}/detail/`, {Authorization: `Token ${Cookies.get('auth_token')}`});
        return response;
    }

    async checkEmail(email){
        let response = await this.Get(`${this.url}/account/check/email/?email=${email}`);
        return response;
    }

    async checkUsername(username){
        let response = await this.Get(`${this.url}/account/check/username/?username=${username}`);
        return response;
    }

    async getChatroom(roomID){
        let response = await this.Get(`${this.url}/chat/private-chatrooms/${roomID}/`, {Authorization: `Token ${Cookies.get('auth_token')}`});
        return response;
    }

    async getChatrooms(){
        let response = await this.Get(`${this.url}/chat/private-chatrooms/`, {Authorization: `Token ${Cookies.get('auth_token')}`});
        return response;
    }

    async getUserDetail(){
        let response = await this.Get(`${this.url}/account/me/detail/`, {Authorization: `Token ${Cookies.get('auth_token')}`});
        return response;
    }

    async getCurrentUser(){
        let response = await this.Get(`${this.url}/account/me/`, {Authorization: `Token ${Cookies.get('auth_token')}`});
        return response;
    }

    async Register(data) {
        let response = await fetch(`${this.url}/account/create/`, {body: data, method: 'POST'})
                             .then(() => true)
                             .catch(err => Error(err));
        return response;
    };
}

export default new APIService;