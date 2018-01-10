import {Navigation} from "react-native-navigation";
import {Provider} from "react-redux";
import axios from 'axios'
import {AsyncStorage} from "react-native"

import AuthScreen from "./src/screens/Auth/Auth";
import PostsListScreen from "./src/screens/PostsList/PostsList";
import PostFormScreen from "./src/screens/PostForm/PostForm";
import configureStore from "./src/store/configureStore";
import { startLoginView, startPrivateView } from "./src/screens/ScreensControl/screensControl";

/*
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    console.log(config);
    return config;
}, function (error) {
    // Do something with request error
    return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
    // Do something with response data
    console.log(response);
    return response;
}, function (error) {
    // Do something with response error
    return Promise.reject(error);
});*/

axios.defaults.baseURL = 'http://mini-wallfer.herokuapp.com';
AsyncStorage.getItem("token").then(token => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
});
axios.defaults.headers.post['Content-Type'] = 'application/json';

const store = configureStore();

// Register Screens
Navigation.registerComponent("mini-wallfer.AuthScreen", () => AuthScreen, store, Provider);
Navigation.registerComponent("mini-wallfer.PostsListScreen", () => PostsListScreen, store, Provider);
Navigation.registerComponent("mini-wallfer.PostFormScreen", () => PostFormScreen, store, Provider);

// Start a App
AsyncStorage.getItem("userId").then(userId => {
    if (userId) {
        startPrivateView();
    } else {
        startLoginView();
    }
});
