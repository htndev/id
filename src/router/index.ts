import Vue from 'vue';
import { I18N } from '@/plugins/i18n';
import VueRouter, { RouteConfig } from 'vue-router';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/:locale',
    component: {
      template: '<router-view></router-view>'
    },
    beforeEnter: I18N.beforeEnter,
    children: [
      {
        name: 'Home',
        path: '',
        redirect: 'signin',
        meta: {
          path: 'signin'
        }
      },
      {
        name: 'SignIn',
        path: 'signin',
        component: () => import(/* webpackChunkName: "sign in" */ '../views/SignIn.vue'),
        meta: {
          path: 'signin'
        }
      },
      {
        name: 'Sign up',
        path: 'signup',
        component: () => import(/* webpackChunkName: "sign up" */ '../views/SignUp.vue'),
        meta: {
          path: 'signup'
        }
      },
      {
        name: 'Forgot password',
        path: 'forgot-password',
        component: () => import(/* webpackChunkName: "forgot password" */ '../views/ForgotPassword.vue'),
        meta: {
          path: 'forgot-password'
        }
      },
      {
        name: 'Password Recovery',
        path: 'recover/:token',
        component: () => import(/* webpackChunkName: "password recovery" */ '../views/NewPassword.vue'),
        meta: {
          path: 'recover'
        }
      },
      {
        name: 'Email Confirmation',
        path: 'confirm/:token',
        component: () => import(/* webpackChunkName: "email confirmation" */ '../views/EmailConfirmation.vue'),
        meta: {
          path: 'confirm'
        }
      }
    ]
  },
  {
    path: '*',
    redirect: I18N.toDefaultRoute()
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

export default router;
