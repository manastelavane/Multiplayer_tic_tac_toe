import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('profile')) {
    req.headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem('profile')).token}`;
  }
  return req;
});
//user related api calls
export const signIn = (formData) => API.post('/user/signin', formData);
export const signUp = (formData) => API.post('/user/signup', formData);

export const createroom = (formData) => API.post('/rooms/createroom', formData);
export const getroom = (id) => API.get(`/rooms/getroom/${id}`);
export const getallrooms = (username) => API.get(`/rooms/getallrooms?username=${username}`);