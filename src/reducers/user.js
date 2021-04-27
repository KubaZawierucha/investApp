import { ACTION_TYPES } from "../actions/users";

const initialState = {
    list: []
}

export const user = (state = initialState, action) => {
    switch (action.type) {
        case ACTION_TYPES.FETCH_ALL:
            return {
                ...state,
                list: [...action.payload]
            };

        default: 
            return state;
    }
};