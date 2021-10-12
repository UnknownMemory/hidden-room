const LoginReducer = (state, action) => {
    switch (action.type) {
        case 'change': {
            return {
                ...state,
                [action.field]: action.payload,
            };
        }
        case 'error': {
            return {
                ...state,
                error: action.error,
            };
        }
    }
};

export default LoginReducer;
