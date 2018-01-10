import React, {Component} from "react";
import {
    Alert, AsyncStorage, Dimensions, ImageBackground, Keyboard, KeyboardAvoidingView, Linking, StyleSheet, Text,
    TouchableWithoutFeedback, View
} from "react-native";
import {connect} from "react-redux";

import DefaultInput from "../../components/UI/DefaultInput/DefaultInput";
import HeadingText from "../../components/UI/HeadingText/HeadingText";
import MainText from "../../components/UI/MainText/MainText";
import ButtonWithBackground from "../../components/UI/ButtonWithBackground/ButtonWithBackground";
import backgroundImage from "../../assets/background.jpg";
import validate from "../../utility/validation";
import {tryAuth} from "../../store/actions/index";
import axios from "axios";
import {startPrivateView} from "../ScreensControl/screensControl";

class AuthScreen extends Component {
    state = {
        viewMode: Dimensions.get("window").height > 500 ? "portrait" : "landscape",
        authMode: "login",
        controls: {
            username: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: 1,
                },
                touched: false
            },
            password: {
                value: "",
                valid: false,
                validationRules: {
                    minLength: 6
                },
                touched: false
            },
            confirmPassword: {
                value: "",
                valid: false,
                validationRules: {
                    equalTo: "password"
                },
                touched: false
            }
        },
        error: null
    };

    constructor(props) {
        super(props);
        Dimensions.addEventListener("change", this.updateStyles);
    }

    componentWillUnmount() {
        Dimensions.removeEventListener("change", this.updateStyles);
    }

    switchAuthModeHandler = () => {
        Alert.alert("Aviso", "No he tenido tiempo de implementar el registro. " +
            "Ve a mini-wallfer.herokuapp.com y crea uno desde Swagger", [
            {text: "Cancelar"},
            {
                text: "Crear en Swagger",
                onPress: () => Linking.openURL("http://mini-wallfer.herokuapp.com/api-docs/#/Authentication/saveUser")
            },
        ])
        /*this.setState(prevState => {
            return {
                authMode: prevState.authMode === "login" ? "signup" : "login"
            };
        });*/
    };

    updateStyles = dims => {
        this.setState({
            viewMode: dims.window.height > 500 ? "portrait" : "landscape"
        });
    };

    loginHandler = () => {
        const authData = {
            username: this.state.controls.username.value,
            password: this.state.controls.password.value
        };
        let token = null;
        this.props.onLogin(authData);
        axios.post("/login", authData)
            .then(res => {
                token = res.data.token;
                return AsyncStorage.setItem("token", token, err => console.log(err));
            })
            .then(() => {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                return axios.get("/users?start=0&size=0");
            })
            .then(res => {
                const users = res.data._embedded;
                const me = users.filter(user => user.username === authData.username).shift();
                if (me) {
                    return AsyncStorage.setItem("userId", String(me.id), err => console.log(err));
                } else return Promise.reject(new Error("Unable to find myself"));
            })
            .then(() => startPrivateView())
            .catch(err => {
                this.setState({error: err});
                console.log(err);
            });
    };

    updateInputState = (key, value) => {
        let connectedValue = {};
        if (this.state.controls[key].validationRules.equalTo) {
            const equalControl = this.state.controls[key].validationRules.equalTo;
            const equalValue = this.state.controls[equalControl].value;
            connectedValue = {
                ...connectedValue,
                equalTo: equalValue
            };
        }
        if (key === "password") {
            connectedValue = {
                ...connectedValue,
                equalTo: value
            };
        }
        this.setState(prevState => {
            return {
                controls: {
                    ...prevState.controls,
                    confirmPassword: {
                        ...prevState.controls.confirmPassword,
                        valid:
                            key === "password"
                                ? validate(
                                prevState.controls.confirmPassword.value,
                                prevState.controls.confirmPassword.validationRules,
                                connectedValue
                                )
                                : prevState.controls.confirmPassword.valid
                    },
                    [key]: {
                        ...prevState.controls[key],
                        value: value,
                        valid: validate(
                            value,
                            prevState.controls[key].validationRules,
                            connectedValue
                        ),
                        touched: true
                    }
                }
            };
        });
    };

    render() {
        let headingText = null;
        let confirmPasswordControl = null;
        let errorMessage = null;
        if (this.state.error) {
            console.log(this.state.error);
            errorMessage = <View style={styles.errorContainer}>
                <Text style={styles.errorText}>No hemos podido conectarnos:</Text>
                <Text style={styles.errorText}>{this.state.error.response.data.message}</Text>
            </View>;
        }

        if (this.state.viewMode === "portrait") {
            headingText = (
                <MainText>
                    <HeadingText>Bienvenido a Mini-Wallfer</HeadingText>
                </MainText>
            );
        }
        if (this.state.authMode === "signup") {
            confirmPasswordControl = (
                <View
                    style={
                        this.state.viewMode === "portrait"
                            ? styles.portraitPasswordWrapper
                            : styles.landscapePasswordWrapper
                    }
                >
                    <DefaultInput
                        placeholder="Confirmar Contraseña"
                        style={styles.input}
                        value={this.state.controls.confirmPassword.value}
                        onChangeText={val => this.updateInputState("confirmPassword", val)}
                        valid={this.state.controls.confirmPassword.valid}
                        touched={this.state.controls.confirmPassword.touched}
                        secureTextEntry
                    />
                </View>
            );
        }
        return (
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <KeyboardAvoidingView style={styles.container} behavior="padding">
                    {headingText}
                    <ButtonWithBackground
                        color="#29aaf4"
                        onPress={this.switchAuthModeHandler}
                    >
                        Ir al {this.state.authMode === "login" ? "Registro" : "Login"}
                    </ButtonWithBackground>
                    {errorMessage}
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View style={styles.inputContainer}>
                            <DefaultInput
                                placeholder="Usuario"
                                style={styles.input}
                                value={this.state.controls.username.value}
                                onChangeText={val => this.updateInputState("username", val)}
                                valid={this.state.controls.username.valid}
                                touched={this.state.controls.username.touched}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="email-address"
                            />
                            <View
                                style={
                                    this.state.viewMode === "portrait" ||
                                    this.state.authMode === "login"
                                        ? styles.portraitPasswordContainer
                                        : styles.landscapePasswordContainer
                                }
                            >
                                <View
                                    style={
                                        this.state.viewMode === "portrait" ||
                                        this.state.authMode === "login"
                                            ? styles.portraitPasswordWrapper
                                            : styles.landscapePasswordWrapper
                                    }
                                >
                                    <DefaultInput
                                        placeholder="Contraseña"
                                        style={styles.input}
                                        value={this.state.controls.password.value}
                                        onChangeText={val => this.updateInputState("password", val)}
                                        valid={this.state.controls.password.valid}
                                        touched={this.state.controls.password.touched}
                                        secureTextEntry
                                    />
                                </View>
                                {confirmPasswordControl}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                    <ButtonWithBackground
                        color="#29aaf4"
                        onPress={this.loginHandler}
                        disabled={
                            this.state.authMode === "signup" && !this.state.controls.confirmPassword.valid ||
                            !this.state.controls.username.valid ||
                            !this.state.controls.password.valid
                        }
                    >
                        Entrar
                    </ButtonWithBackground>
                </KeyboardAvoidingView>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 14
    },
    backgroundImage: {
        width: "100%",
        flex: 1
    },
    inputContainer: {
        width: "80%"
    },
    input: {
        backgroundColor: "#eee",
        borderColor: "#bbb"
    },
    landscapePasswordContainer: {
        flexDirection: "row",
        justifyContent: "space-between"
    },
    portraitPasswordContainer: {
        flexDirection: "column",
        justifyContent: "flex-start"
    },
    landscapePasswordWrapper: {
        width: "45%"
    },
    portraitPasswordWrapper: {
        width: "100%"
    },
    errorContainer: {
        backgroundColor: "red",
        padding: 6,
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10
    },
    errorText: {
        textAlign: "center"
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onLogin: authData => dispatch(tryAuth(authData))
    };
};

export default connect(null, mapDispatchToProps)(AuthScreen);
