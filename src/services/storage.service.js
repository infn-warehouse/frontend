const MODE_KEY = "mode";

const StorageService = {
  getMode() {
    return localStorage.getItem(MODE_KEY);
  },

  setMode(mode) {
    localStorage.setItem(MODE_KEY, mode);
  },

  removeMode() {
    localStorage.removeItem(MODE_KEY);
  },
};

export default StorageService;
