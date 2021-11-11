const UserSettingsReducer = (state, action) => {
    switch (action.type) {
        case 'detail':
            return {
                ...state,
                detail: action.detail,
            };

        case 'modify':
            return {
                ...state,
                modify: action.modify,
            };

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
        
        case 'isPasswordMatching': {
            return {
                ...state,
                isPasswordMatching: action.isPasswordMatching,
            };
        }
    }
};

export default UserSettingsReducer;
