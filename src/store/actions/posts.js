/**
 * Intenté añadir Redux a la aplicación pero me quedé sin tiempo :(
 */
import {CREATE_POST, DELETE_POST, EDIT_POST, GET_POSTS, SET_POST_ERROR} from "./actionTypes";
import axios from "axios"

export const getPosts = () => {
    return dispatch => {
        axios.get("/posts?start=0&size=0")
            .then(res => {
                const posts = res.data._embedded;
                posts.forEach(post => post.key = post.id);
                return {
                    type: GET_POSTS,
                    posts
                }
            });
    };
};

export const createPost = text => {
    return dispatch => {
        axios.post(`/users/1/posts`, {text})
            .then(res => {
                return {
                    type: CREATE_POST,
                    post: res.data._embedded
                };
            });
    };
};

export const editPost = (postId, text) => {
    return dispatch => {
        axios.put(`/users/1/posts/${postId}`, {text})
            .then(res => {
                return {
                    type: EDIT_POST,
                    post: res.data._embedded
                };
            });
    };
};

export const deletePost = postId => {
    return dispatch => {
        axios.delete(`/users/1/posts/${postId}`)
            .then(res => {
                return {
                    type: DELETE_POST,
                    postId
                };
            })
    };
};

export const setPostError = (error) => {
    return {
        type: SET_POST_ERROR,
        error
    }
};