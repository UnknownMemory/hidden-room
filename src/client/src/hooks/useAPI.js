import {useState, useRef} from 'react';

const useAPI = () => {
    const source = `${process.env.REACT_APP_API_URL}/api/v1`;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const status = useRef(null);

    const request = async (method, url, body = null, headers = {}) => {
        setIsLoading(true);
        try {
            const res = await fetch(source + url, {body, headers: headers, method: method});
            const data = await res.json();
            status.current = res;
            return data;
        } catch(error) {
            setError("Failed to send request");
        } finally {
            setIsLoading(false);
        }
    };

    const HTTPMethod = {
        get: (url, body = null, headers = {}) => request('GET', url, body, headers),
        post: (url, body = null, headers = {}) => request('POST', url, body, headers),
        patch: (url, body = null, headers = {}) => request('PATCH', url, body, headers),
        delete: (url, body = null, headers = {}) => request('DELETE', url, body, headers),
    }

    return {...HTTPMethod, isLoading, status, error}
};

export default useAPI;
