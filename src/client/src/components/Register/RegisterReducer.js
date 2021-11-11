const RegisterReducer = (state, action) => {
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
                error: {...state.error, [action.errorType]: action.error},
            };
        }

        case 'isPasswordValid': {
            return {
                ...state,
                isPasswordValid: action.isPasswordValid,
            };
        }

        case 'isEmailValid': {
            return {
                ...state,
                isEmailValid: action.isEmailValid,
            };
        }

        case 'isUsernameValid': {
            return {
                ...state,
                isUsernameValid: action.isUsernameValid,
            };
        }

        case 'isPasswordMatching': {
            return {
                ...state,
                isPasswordMatching: action.isPasswordMatching,
            };
        }
    }
};

export default RegisterReducer;
