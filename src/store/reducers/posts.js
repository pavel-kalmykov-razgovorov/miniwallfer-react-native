/**
 * Intenté añadir Redux a la aplicación pero me quedé sin tiempo :(
 */
import {CREATE_POST, DELETE_POST, EDIT_POST, GET_POSTS, SET_POST_ERROR} from "../actions/actionTypes";

const initialState = {
    posts: null,
    error: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: action.places
            };
        case CREATE_POST:
            return {
                ...state,
                posts: [action.post, ...state.posts]
            };
        case EDIT_POST:
            return {
                ...state,
                posts: state.posts.map(post => post.id !== action.post.id ? post : action.post)
            };
        case DELETE_POST:
            return {
                ...state,
                posts: state.posts.filter(post => post.id !== action.postId)
            };
        case SET_POST_ERROR:
            return {
                ...state,
                error: action.error
            };
        default:
            return state;
    }
};

export default reducer;