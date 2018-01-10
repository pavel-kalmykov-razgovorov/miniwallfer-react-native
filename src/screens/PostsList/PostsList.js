import React, {Component} from "react";
import {Alert, AsyncStorage, FlatList, StyleSheet, Text, View} from "react-native";
import axios from "axios"
import ListItem from "../../components/ListItem/ListItem";
import {startLoginView} from "../ScreensControl/screensControl";

class PostsListScreen extends Component {
    state = {
        posts: null,
        error: null,
    };

    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent)
    }

    onNavigatorEvent = event => {
        if (event.type === "NavBarButtonPress") {
            if (event.id === "newPost") {
                this.props.navigator.push({
                    screen: "mini-wallfer.PostFormScreen",
                    title: "Nuevo Post",
                    passProps: {
                        createPostHandler: this.createPostHandler
                    }
                });
            } else if (event.id === "logout") {
                AsyncStorage.clear();
                axios.defaults.headers.common['Authorization'] = null;
                startLoginView();
            }
        }
    };

    componentDidMount() {
        axios.get("/posts?start=0&size=0")
            .then(res => {
                const posts = res.data._embedded.reverse();
                for (let post of posts) post.key = post.id;
                this.setState({posts});
            })
            .catch(err => {
                console.log(err);
                this.setState({error: err});
            });
    }

    createPostHandler = text => {
        AsyncStorage.getItem("userId")
            .then(userId => {
                return axios.post(`/users/${userId}/posts`, {text})
            })
            .then(res => {
                console.log(res);
                const createdPost = res.data._embedded;
                createdPost.key = createdPost.id;
                this.setState(prevState => {
                    return {
                        ...prevState,
                        posts: [createdPost, ...prevState.posts]
                    };
                });
                this.props.navigator.pop();
            })
            .catch(err => {
                console.log(err);
                Alert.alert("Error", `No se ha podido crear el post (${err.message})`)
            })
    };

    editPostHandler = (postId, text) => {
        AsyncStorage.getItem("userId")
            .then(userId => {
                return axios.put(`/users/${userId}/posts/${postId}`, {text})
            })
            .then(res => {
                console.log(res);
                const editedPost = res.data._embedded;
                editedPost.key = editedPost.id;
                this.setState(prevState => {
                    return {
                        ...prevState,
                        posts: prevState.posts.map(post => post.id !== editedPost.id ? post : editedPost)
                    };
                });
                this.props.navigator.pop();
            })
            .catch(err => {
                console.log(err);
                Alert.alert("Error", `No se ha podido editar el post (${err.message})`)
            })
    };

    deletePostHandler = postId => {
        AsyncStorage.getItem("userId")
            .then(userId => {
                return axios.delete(`/users/${userId}/posts/${postId}`)
            })
            .then(res => {
                if (res.status === 204) {
                    this.setState(prevState => {
                        return {
                            ...prevState,
                            posts: prevState.posts.filter(post => post.id !== postId)
                        };
                    });
                } else Alert.alert("Error", "No se ha podido borrar el post. Probablemente ya estuviera borrado");
            })
            .catch(err => {
                console.log(err);
                Alert.alert("Error", `No se ha podido borrar (${err.response.status === 404 ? "no se ha encontrado el post" : err.message})`)
            });
    };

    onEditPressed = (postId, text) => {
        this.props.navigator.push({
            screen: "mini-wallfer.PostFormScreen",
            title: "Editar Post",
            passProps: {
                postId,
                text,
                editPostHandler: this.editPostHandler
            }
        });
    };

    render() {
        let list = null;
        if (!this.state.posts) {
            if (this.state.error) {
                list = <View style={styles.noDataContainer}>
                    <Text>Ha habido un error:</Text>
                    <Text>{this.state.error.response.data.message}</Text>
                </View>;
            } else {
                list = <View style={styles.noDataContainer}>
                    <Text>Recuperando datos...</Text>
                </View>;
            }
        } else if (this.state.posts.length === 0) {
            list = <View style={styles.noDataContainer}>
                <Text>No hay posts. ¿Por qué no creas uno? :)</Text>
            </View>;
        } else {
            list = <FlatList
                style={styles.listContainer}
                data={this.state.posts}
                renderItem={info => {
                    return <ListItem
                        post={info.item}
                        onEditPressed={() => this.onEditPressed(info.item.id, info.item.text)}
                        onDeletePressed={() => this.deletePostHandler(info.item.id)}
                    />;
                }}
            />;
        }
        return list
    }
}

const styles = StyleSheet.create({
    noDataContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center"
    },
    listContainer: {
        width: "100%"
    }
});

export default PostsListScreen;