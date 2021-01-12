import Vue, { PluginObject } from 'vue';
import axios, { AxiosRequestConfig } from 'axios';

const config: AxiosRequestConfig = {};

const _axios = axios.create(config);

_axios.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

_axios.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const Plugin: PluginObject<AxiosRequestConfig> = {
  install(Vue) {
    (Vue as any).axios = _axios;
    (window as any).axios = _axios;
    Object.defineProperties(Vue.prototype, {
      axios: {
        get() {
          return _axios;
        }
      },
      $axios: {
        get() {
          return _axios;
        }
      }
    });
  }
};

Vue.use(Plugin);

export default Plugin;
