import React, {Component} from "react";
import Icon from "react-native-vector-icons/Ionicons";
import {AsyncStorage, StyleSheet, Text, TouchableOpacity, View} from "react-native";

class ListItem extends Component {
    state = {
        userId: null
    };

    componentDidMount() {
        AsyncStorage.getItem("userId")
            .then(userId => this.setState({userId: Number(userId)}))
    }

    render() {
        let author = this.props.post.user._embedded;
        let actions = null;
        if (author.id === this.state.userId) {
            actions = <View style={styles.actionsContainer}>
                <TouchableOpacity onPress={this.props.onEditPressed}>
                    <Icon style={styles.actionsIcon} name={"md-create"} size={25} color={"blue"}/>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.props.onDeletePressed}>
                    <Icon style={styles.actionsIcon} name={"md-trash"} size={25} color={"red"}/>
                </TouchableOpacity>
            </View>;
        }
        return <View style={styles.listItem}>
            <View style={styles.postContainer}>
                <Text style={styles.authorText}>{`${author.firstName} ${author.lastName} (${author.username})`}</Text>
                <Text>{this.props.post.text}</Text>
            </View>
            {actions}
        </View>;
    }
}

const styles = StyleSheet.create({
    listItem: {
        width: "100%",
        marginBottom: 5,
        padding: 10,
        backgroundColor: "#eee",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    postContainer: {
        width: "75%"
    },
    authorText: {
        fontWeight: "bold"
    },
    actionsContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    },
    actionsIcon: {
        marginLeft: 20
    }
});

export default ListItem;
