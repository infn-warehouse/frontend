import axios from "axios";

export const AXIOS = axios.create({
  baseURL: `${process.env.VUE_APP_ENDPOINT_API_URI}`,
  defaults: {
    headers: {
      common: { Accept: "application/json" }
    }
  }
});

export const CancelToken=axios.CancelToken;