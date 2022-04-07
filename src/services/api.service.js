import { AXIOS, CancelToken } from "../axios";
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
  },

  download(url, progressCb, endCb) {
    let cancel;
    
    let config = {
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      }),
      
      responseType: "blob", // important

      onDownloadProgress: e => {
        if (!progressCb) return;
        const {loaded, total} = e;
        // Use the local progress event
        if (e.lengthComputable) {
            let progress = loaded / total * 100;
            progressCb(progress);
        }
      }
    };

    (async() => {
      try {
        const { status, data } = await AXIOS.get(url, config);
        endCb(status, data);
      }
      catch (e) {
        endCb(-1);
      }
    })();

    return cancel;
  },

  upload(url, formData, progressCb, endCb) {
    let cancel;
    
    let config = {
      // Note that contentType is set to multipart/form-data
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      
      cancelToken: new CancelToken(function executor(c) {
        // An executor function receives a cancel function as a parameter
        cancel = c;
      }),
      
      // Listen for the onUploadProgress event
      onUploadProgress: e => {
        if (!progressCb) return;
        const {loaded, total} = e;
        // Use the local progress event
        if (e.lengthComputable) {
            let progress = loaded / total * 100;
            progressCb(progress);
        }
      }
    };

    (async() => {
      try {
        const { status } = await AXIOS.put(url, formData, config);
        endCb(status);
      }
      catch (e) {
        endCb(-1);
      }
    })();

    return cancel;
  }
};

export default ApiService;
