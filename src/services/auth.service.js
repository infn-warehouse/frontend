import { TokenService } from "./token.service";
import ApiService from "./api.service";
import store from "@/store";

async function login(email, password) {
  const requestData = {
    url: "login",
    method: "post",
    headers: { "Content-Type": "application/json" },
    //withCredentials: true,
    data: {
      email: email,
      password: password
    }
  };
  try {
    const response = await ApiService.customRequest(requestData);
    TokenService.saveToken(response.data);
    ApiService.setHeader();
    store.commit("status/setLogged", true);
    return response.data;
  } catch (error) {
    console.log(error);
    return {error};
  }
}

function logout() {
  TokenService.removeToken();
  ApiService.removeHeader();
  store.commit("status/setLogged", false);
}

export const AuthService = {
  login,
  logout
};
