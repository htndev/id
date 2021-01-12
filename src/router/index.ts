import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    name: 'Home',
    path: '/',
    redirect: '/signin'
  },
  {
    name: 'SignIn',
    path: '/signin',
    component: () => import(/* webpackChunkName: "sign in" */ '../views/SignIn.vue')
  },
  {
    name: 'Sign up',
    path: '/signup',
    component: () => import(/* webpackChunkName: "sign up" */ '../views/SignUp.vue')
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
