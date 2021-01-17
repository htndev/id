import { CLIENTS } from './constants';
import { AllowedRedirectProps } from '@/common/constants';
import axios from 'axios';
import { createProvider } from '@/apollo';

type IpType = { ip: string };

class Api {
  private ipServiceLocator = axios.create({
    baseURL: 'https://www.cloudflare.com/cdn-cgi/trace'
  });
  private apollo = createProvider();

  constructor() {
    this.ipServiceLocator.interceptors.response.use((value: any) => {
      return value.data
        .match(/[a-zA-Z0-9_]+=.*/gi)
        ?.map((prop: string) => prop.split('='))
        .reduce((acc: {}, [key, value]: [string, string | number]) => ({ ...acc, [key]: value }), {});
    });
  }

  async getIp(): Promise<IpType> {
    const response = (await this.ipServiceLocator.get('/')) as any;
    return response as IpType;
  }

  async isAuthorized(): Promise<any> {
    const response = await this.apollo.defaultClient.query({
      query: require('../graphql/IsAuthorized.gql')
    });

    return response.data.isAuthorized.isAuthorized;
  }

  redirectTo(to: AllowedRedirectProps = AllowedRedirectProps.Player) {
    if (Object.values(AllowedRedirectProps).includes(to)) {
      window.location.replace(CLIENTS[to as AllowedRedirectProps]);
      return;
    }

    window.location.replace(CLIENTS.homepage);
  }
}

export const API = new Api();
