import axios from 'axios'

const DEVELOPMENT = window.location.hostname.includes("localhost")

const axiosConfig = () => axios.create({
    baseURL: DEVELOPMENT ? "http://localhost:8080" : process.env.REACT_APP_API,
    headers: {
        token: localStorage.getItem("token")
    }
})

export default axiosConfig;