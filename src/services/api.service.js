import { AXIOS } from "../axios";
import { TokenService } from "./token.service";

const ApiService = {
  setHeader() {
    if (AXIOS && AXIOS.defaults) {
      AXIOS.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${TokenService.getToken()}`;
      //Vue.$jsonApi.headers.Authorization = `Bearer ${TokenService.getToken()}`;
      AXIOS.defaults.headers.post.Authorization = `Bearer ${TokenService.getToken()}`;
      AXIOS.defaults.headers.delete.Authorization = `Bearer ${TokenService.getToken()}`;
      AXIOS.defaults.headers.get.Authorization = `Bearer ${TokenService.getToken()}`;
    }
  },

  removeHeader() {
    AXIOS.defaults.headers.common = {};
    //Vue.$jsonApi.headers.Authorization = null;
    AXIOS.defaults.headers.post.Authorization = null;
    AXIOS.defaults.headers.delete.Authorization = null;
    AXIOS.defaults.headers.get.Authorization = null;
  },

  get(resource) {
    return AXIOS.get(resource);
  },

  post(resource, data) {
    return AXIOS.post(resource, data);
  },

  put(resource, data) {
    return AXIOS.put(resource, data);
  },

  delete(resource) {
    return AXIOS.delete(resource);
  },

  /**
   * Perform a custom Axios request.
   *
   * data is an object containing the following properties:
   *  - method
   *  - url
   *  - data ... request payload
   *  - auth (optional)
   *    - username
   *    - password
   **/
  customRequest(data) {
    return AXIOS(data);
  }
};

export default ApiService;
