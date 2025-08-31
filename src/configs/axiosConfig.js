import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_API_BASE_URL,
    headers:{
        'Content-Type':'application/json'
    }
});

api.interceptors.request.use(
    config => {
        const token = Cookies.get('token');
        if (usuario) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject(error)
);
export default api;