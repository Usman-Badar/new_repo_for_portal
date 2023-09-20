import axios from 'axios';

// let server = sessionStorage.getItem('IPv4') || '192.168.100.14';
// console.log('https://' + server + ':3443');
const instance = axios.create(
    {
        baseURL: process.env.REACT_APP_SERVER,
        // baseURL: 'http://202.63.220.170:3443/',
        // baseURL: 'http://' + window.location.host,
        // baseURL: 'http://192.168.21.152:8888',
    }
)

export default instance;