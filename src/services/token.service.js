import moment from "moment";
const TOKEN_KEY = "jwt";

const TokenService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  saveToken(accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  getPayload() {
    const token = TokenService.getToken();
    const payload = token ? token.split(".")[1] : null;
    const res = payload ? JSON.parse(atob(payload)) : "";
    return res;
  },
  isTokenValid() {
    let isValid = false;
    const token = TokenService.getToken();
    if (token) {
      const payload = TokenService.getPayload();

      // NOW
      const now = moment();

      // REMOTE EXPIRATION TIME
      const expirationTime = moment(payload.exp * 1000);

      // MINUTES TO EXPIRATION TIME
      const diff = expirationTime.diff(now, "minutes");
      isValid = diff > 0;
    }
    return isValid;
  },
  getUserId() {
    const t = this.getPayload();
    return t.id;
  },
  getVersion() {
    const t = this.getPayload();
    return t.version;
  }
};

export default TokenService;
