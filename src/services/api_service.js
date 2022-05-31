import axios from 'axios'
import router from '@/router'

const apiCall = () => {

    let instance = axios.create({
        baseURL: 'https://localhost:44369/api/',
        timeout: 1000
    })

    instance.interceptors.request.use(
    
        function (config) {
            // Add JWT token before request is sent
            const currentUser = JSON.parse(localStorage.getItem('currentUser'))
            config.headers.Authorization =  currentUser ? `Bearer ${currentUser.token}` : ''
            return config
        }, 
        
        function (error) {
            // Do something with request error
            return Promise.reject(error)
        }
    
    );
    
    instance.interceptors.response.use(
        
        function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            return response;
        }, 
        
        function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            console.log(error.response.status)
            if (error.response.status === 401) {
                alert("Session Expired!")
                localStorage.removeItem('currentUser')
                router.push("/login")
            }
            return Promise.reject(error)
        }
    
    );

    return instance

}

export default apiCall()


  