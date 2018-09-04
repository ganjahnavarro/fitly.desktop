import { hashHistory } from 'react-router'

import Fetch from './Fetch'
import Alert from './Alert'

let Auth = {};

Auth.login = (userName, password) => {
    if (userName && password) {
        const data = { userName, password };
        Fetch.post("login", data, (user) => {
            if (user) {
                Auth.user = user;
                hashHistory.push("/home");
            } else {
                Alert.error("Invalid username and/or password.");
            }
        });
    } else {
        Alert.error("Username and password is required.");
    }
};

Auth.logout = () => {
    Auth.user = undefined;
};

Auth.isAdmin = () => {
    return Auth.user && Auth.user.type === "ADMIN";
};

module.exports = Auth;
