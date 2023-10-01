import axios from 'axios';
import { API_URL } from '../lib/constants';

export const axiosClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
