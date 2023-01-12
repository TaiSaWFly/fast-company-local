import axios from "axios";
import localStorageService from "./localStorage.service";
import config from "../config.json";

const httpAuth = axios.create({
    baseURL: config.apiEndpoint + "/auth/",
    params: {
        key: process.env.REACT_APP_FIREBASE_KEY
    }
});

const authService = {
    async register(payload) {
        const { data } = await httpAuth.post("signUp", payload);
        return data;
    },
    async login({ email, password }) {
        const { data } = await httpAuth.post("signInWithPassword", {
            email,
            password,
            returnSecureToken: true
        });
        return data;
    },
    async refresh() {
        const { data } = await httpAuth.post("token", {
            grant_type: "refresh_token",
            refresh_token: localStorageService.getRefreshToken()
        });
        return data;
    }
};

export default authService;
