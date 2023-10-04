import axios from 'axios';

const instance = axios.create(
    {
        // baseURL: 'http://202.63.220.170:3443/',
        baseURL: process.env.REACT_APP_SERVER,
        timeout: 3000
    }
)

export default instance;