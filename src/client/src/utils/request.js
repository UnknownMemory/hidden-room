const Request = async (url, body = null, headers = {}, method = 'GET') => {
    let response = await fetch(url, {body, headers: headers, method: method})
        .then((res) => res.json())
        .catch((err) => console.error(err));
    return response;
};

export default Request;
