import { Navigation } from 'react-native-navigation';
import { Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const startPrivateView = () => {
    Promise.all([
        Icon.getImageSource("md-add", 30),
        Icon.getImageSource("md-log-out", 30)
    ]).then(sources => {
        Navigation.startSingleScreenApp({
            screen: {
                screen: "mini-wallfer.PostsListScreen",
                title: "Listado de posts",
                navigatorButtons: {
                    rightButtons: [
                        {
                            icon: sources[0],
                            title: "Nuevo Post",
                            id: "newPost"
                        },
                        {
                            icon: sources[1],
                            title: "Salir",
                            id: "logout"
                        }
                    ]
                }
            }
        }).catch(err => console.log(err));
    });
};

export const startLoginView = function () {
    Navigation.startSingleScreenApp({
        screen: {
            screen: "mini-wallfer.AuthScreen",
            title: "Login"
        }
    }).catch(err => console.log(err))
};