import axios, { AxiosResponse } from 'axios';

interface AppRequest {
  path: string;
  data?: any;
  id?: number;
  headers?: any;
  responseType?: string;
}

axios.interceptors.request.use(
  async (config: any) => {
    if (typeof window !== 'undefined') {
    const userData = JSON.parse(window.localStorage.getItem('userData') || "{}");

    if (!config.url?.includes("/login/token"))
      if (userData?.token) {
        config.headers = {
          ...config.headers,
          'CSRFToken': userData.token
        };
      }

    if (userData?.username) {
      config.headers = {
        ...config.headers,
        'userName': userData.username
      };
    }

    if (userData?.csll) {
      config.headers = {
        ...config.headers,
        'csll': userData.csll
      };
    }
  }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);


export class APIRequest {
  static async post(request: AppRequest): Promise<AxiosResponse<any>> {
    const url = request.path;

    const res = axios.request({
      url: url,
      method: 'POST',
      ...(request.data && { data: request.data }),
      ...(request.headers && { headers: request.headers })
    });

    return res;
  }

  static async get(request: AppRequest): Promise<AxiosResponse<any>> {
    const url = request.path;
    const res = await axios.request({
      url,
      ...(request.headers && { headers: request.headers }),
      ...(request.responseType && { responseType: request.responseType })
    });

return res;
  }
}
