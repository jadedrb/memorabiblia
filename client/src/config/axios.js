import axios from 'axios'

const baseURL = window.location.hostname.includes("localhost") 
    ? 
    "http://localhost:8080" 
    : 
    process.env.REACT_APP_API

const axiosConfig = () => axios.create({
    baseURL,
    headers: {
        token: localStorage.getItem("token")
    }
})

export default axiosConfig;