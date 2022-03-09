import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import MovementsList from '../views/MovementsList.vue'
import MovementDetails from '../views/MovementDetails.vue'
import Profile from '../views/Profile.vue'
import Restricted from '../views/Restricted.vue'
import defineAbilitiesFor from '@/abilities'
import store from "@/store";
import ApiService from "@/services/api.service";
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
    path: '/profile',
    name: 'Profile',
    component: Profile
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

  const loggedIn = localStorage.getItem("jwt");

  if (loggedIn) ApiService.setHeader();
  if (loggedIn) store.commit("status/setLogged", true);

  router.app.$ability(defineAbilitiesFor());

  const publicPages = ["Login","Restricted"];
  const authRequired = !publicPages.includes(to.name);

  if (!authRequired) {
    next();
  } else if (!loggedIn) {
    return next({ name: "Login" });
  } else if (!router.app.$can("route", to.name)) {
    next("/restricted");
  } else {
    next();
  }
});

export default router
