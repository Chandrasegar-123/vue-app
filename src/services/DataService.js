import axios from 'axios';

const API_URL = 'https://jsonplaceholder.typicode.com/comments';

export default {
  fetchData() {
    return axios.get(API_URL);
  }
};