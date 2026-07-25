import axios from "axios";

const api = axios.create({
    baseURL: "https://sajins.pythonanywhere.com/api/"
});

export default api;