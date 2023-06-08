import axios from 'axios'

const urlServidor = 'http://44.200.16.50:3000/api';
// const urlServidor = 'http://127.0.0.1:3000/api';

export const http = () => {

    let access_token = localStorage.getItem('access_token');

    const interceptor = axios.create({
        baseURL: urlServidor,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer '+access_token
        },
        timeout: 30000
    })

    // errores
    interceptor.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            if(error.response.status === 401){
                localStorage.removeItem("access_token")
                window.location.href = "/login"
            }

            return Promise.reject(error)
        }
    )

    return interceptor;
}
