import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import MovementsList from '../views/MovementsList.vue'
import MovementDetails from '../views/MovementDetails.vue'
import ItemsList from '../views/ItemsList.vue'
import ItemDetails from '../views/ItemDetails.vue'
import OperationsList from '../views/OperationsList.vue'
import MonthlyCostsList from '../views/MonthlyCostsList.vue'
import Profile from '../views/Profile.vue'
import Registration from '../views/Registration.vue'
import UploadTest from '../views/UploadTest.vue'
import FillTest from '../views/FillTest.vue'
import FileDetails from '../views/FileDetails.vue'
import Restricted from '../views/Restricted.vue'
import MainMenu from '../views/MainMenu.vue'
import defineAbilitiesFor from '@/abilities'
import store from "@/store";
import ApiService from "@/services/api.service";
import TokenService from "@/services/token.service";
import StorageService from "@/services/storage.service";
import i18n from "@/i18n";

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/restricted',
    name: 'Restricted',
    component: Restricted
  },
  {
    path: '/choose',
    name: 'MainMenu',
    component: MainMenu
  },
  {
    path: '/registration',
    name: 'Registration',
    component: Registration,
    props: (route) => ({
      ...route.params
    })    
  },
  {
    path: '/',
    name: 'Root',
    component: Registration
  },
  {
    path: '/movements',
    name: 'Movements',
    component: MovementsList
  },
  {
    path: '/movements/:id',
    name: 'MovementDetails',
    component: MovementDetails,
    props: true
  },
  {
    path: '/items',
    name: 'Items',
    component: ItemsList
  },
  {
    path: '/items/:id',
    name: 'ItemDetails',
    component: ItemDetails,
    props: true
  },
  {
    path: '/operations',
    name: 'Operations',
    component: OperationsList
  },
  {
    path: '/stats',
    name: 'Stats',
    component: MonthlyCostsList
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile
  },
  {
    path: '/upload',
    name: 'UploadTest',
    component: UploadTest
  },
  {
    path: '/fill',
    name: 'FillTest',
    component: FillTest
  },
  {
    path: '/files/:id',
    name: 'FileDetails',
    component: FileDetails,
    props: true
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach(async (to, from, next) => {
  if (!localStorage.locale) localStorage.locale = "en";
  i18n.locale = localStorage.locale;

  let loggedIn = TokenService.getToken()!=null;
  if (loggedIn) {
    if (!TokenService.isTokenValid()) {
      TokenService.removeToken();
      loggedIn=false;
      store.commit("status/setExpiredFlag", true);
    }
  }

  if (loggedIn) ApiService.setHeader();
  store.commit("status/setLogged", loggedIn);

  router.app.$ability(defineAbilitiesFor());

  if (!loggedIn)
    StorageService.removeMode();
  let mode = StorageService.getMode();
  store.commit("info/setAppMode", mode);

  const publicPages = ["Login","Restricted"];
  const authRequired = !publicPages.includes(to.name);

  if (!authRequired) {
    next();
  } else if (!loggedIn) {
    return next({ name: "Login" });
  } else if (mode==null && to.name!="MainMenu") {
    return next({ name: "MainMenu" });
  } else if (!router.app.$can("route", to.name)) {
    next("/restricted");
  } else {
    next();
  }
});

export default router
