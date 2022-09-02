import axios from "axios";

function apis(history = null) {

    const API_URL = process.env.REACT_APP_ENDPOINT;

    let headers = {};
    headers["Access-Control-Allow-Origin"] = '*';
    headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";
    headers["Access-Control-Allow-Headers"] = "Origin, X-Requested-With, Content-Type, Accept";

    if (localStorage.access_token) {
        headers.Authorization = `Bearer ${localStorage.access_token}`;
    }

    const axiosInstance = axios.create({
        baseURL: API_URL,
        headers,
        crossDomain: true,
    });

    axiosInstance.interceptors.request.use(async config => {

        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }

        return config;
    },
        error => Promise.reject(error)
    );

    axiosInstance.interceptors.response.use(
        (response) =>
            new Promise((resolve, reject) => {
                resolve(response);
            }),
        async (error) => {
            if (!error.response) {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }

            if (error.response.status === 401) {
                logoutHandle(history);
            } else {
                return new Promise((resolve, reject) => {
                    reject(error);
                });
            }
        }
    );

    return axiosInstance;

}

function logoutHandle(history = null) {

    localStorage.removeItem("user");
    localStorage.removeItem("expiryDate");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");

    if (history) {
        history.push("/");
    } else {
        window.location = "/";
    }

}

export default apis;