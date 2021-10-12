import Request from '../utils/request';

class AuthService {
    constructor(){
        this.url = `${process.env.REACT_APP_API_URL}/api/v1`;
    }

    async checkEmail(email){
        let response = await Request(`${this.url}/account/check/email/?email=${email}`);
        return response;
    }

    async checkUsername(username){
        let response = await Request(`${this.url}/account/check/username/?username=${username}`);
        return response;
    }

    async Login(data){
        let response = await Request(`${this.url}/auth/`, data, {}, 'POST')
        return response;
    }

    async Register(data) {
        let response = await Request(`${this.url}/account/create/`, data, {}, 'POST');
        return response;
    };
}

export default new AuthService;