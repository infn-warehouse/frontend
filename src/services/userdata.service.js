import Vue from 'vue'
import ApiService from "./api.service";
import _ from "lodash";

const UserDataService = {
  async getUserData() {
    const requestData = {
      url: "userdata",
      method: "get",
    };
    try {
      const response = await ApiService.customRequest(requestData);
      if (response.data.errors)
        return {error: response.data.errors};
      return response.data;
    } catch (error) {
      return {error};
    }
  },
};

export default UserDataService;
