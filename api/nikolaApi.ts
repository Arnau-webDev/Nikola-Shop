import axios from 'axios';

const nikolaApi = axios.create({
	baseURL: '/api'
});

export default nikolaApi;