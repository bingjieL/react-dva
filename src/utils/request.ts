import axios, { AxiosError, AxiosResponse, AxiosInstance} from 'axios';
import { message } from 'antd';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

axiosInstance.interceptors.response.use(
  respone => {
    if(respone.data.code !== 200) {
      message.error(respone.data.message);
    }
    return respone
  },
  err => {
    message.error('～ 服务异常,请稍后再试 ～');
    return Promise.reject(err)
  }
)
class Reuqest {
  private axiosInstance: any = axiosInstance
  public get(url: string, params?: any, headers?: any) {
    return new Promise((resolve, reject) => {
      this.axiosInstance.get(url, { params, headers })
      .then((res: AxiosResponse) => {
        resolve(res.data)
      })
      .catch((err: AxiosError) => {
        reject(err)
      })
    })
  }
  public post(url: string, data?: any, headers?: any) {
    return new Promise(( resolve, reject) => {
      this.axiosInstance.post(url, data, {headers})
      .then((res: AxiosResponse) => {
        resolve(res)
      })
      .catch((err: AxiosError) => {
        reject(err)
      })
    })
  }
}
export default new Reuqest()