import React, {Component} from "react";
import {ScrollView, StyleSheet, Text, View} from "react-native";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import validate from "../../utility/validation";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";

class PostForm extends Component {
    state = {
        controls: {
            postText: {
                value: this.props.text || "",
                valid: false,
                validationRules: {
                    minLength: 10,
                    maxLength: 249,
                },
                touched: false
            }
        },
        error: null
    };

    updateInputState = (key, value) => {
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(
                            value,
                            prevState.controls[key].validationRules,
                            null
                        ),
                        touched: true
                    }
                }
            };
        });
    };

    render() {
        let error = null;
        if (this.state.error) {
            error = <View style={styles.noDataContainer}>
                <Text>Ha habido un error:</Text>
                <Text>{this.state.error.response.data.message}</Text>
            </View>;
        }
        let submitButton = null;
        let action = null;
        if (this.props.createPostHandler) {
            action = "¿Quieres crear un nuevo post?";
            submitButton = <ButtonWithBackground
                color="#29aaf4"
                onPress={() => this.props.createPostHandler(this.state.controls.postText.value)}
                disabled={
                    !this.state.controls.postText.valid ||
                    this.state.error
                }
            >
                Crear
            </ButtonWithBackground>;
        } else {
            action = "¿Quieres cambiar algo de tu post?";
            submitButton = <ButtonWithBackground
                color="#29aaf4"
                onPress={() => this.props.editPostHandler(this.props.postId, this.state.controls.postText.value)}
                disabled={
                    !this.state.controls.postText.valid ||
                    this.state.error
                }
            >
                Editar
            </ButtonWithBackground>;
        }
        return <ScrollView>
            <View style={styles.container}>
                <HeadingText>{action}</HeadingText>
                <DefaultInput
                    placeholder="Di algo bonito"
                    style={styles.input}
                    value={this.state.controls.postText.value}
                    onChangeText={val => this.updateInputState("postText", val)}
                    valid={this.state.controls.postText.valid}
                    touched={this.state.controls.postText.touched}
                    multiline={true}
                    numberOfLines={5}
                />
                {submitButton}
                {error}
            </View>
        </ScrollView>;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        justifyContent: "flex-start",
        marginTop: 50,
    },
    input: {
        width: "80%",
        padding: 10,
        textAlign: "center"
    }
});

export default PostForm