import Cookies from 'js-cookie';

class APIService {
    constructor(){
        this.url = process.env.API_URL;
    }

    static Error(err) {
        console.error(err);
    }

    async getCurrentUser(){
        let response = await fetch(`${process.env.API_URL}/api/v1/account/me/`, {
                                headers: {Authorization: `Token ${Cookies.get('auth_token')}`},
                                method: 'GET',
                            })
                       .then(res => {return res.json()})
                       .catch(err => Error(err));

        return response;
    }

    async Register(data) {
        let response = await fetch(`${process.env.API_URL}/api/v1/account/create/`, {body: data, method: 'POST'})
                             .then(() => true)
                             .catch(err => Error(err));
        return response;
    };
}

export default new APIService;