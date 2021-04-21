import axios, { AxiosError, AxiosResponse, AxiosInstance} from 'axios';
import { message } from 'antd';
import { routerRedux } from 'dva/router';
import { store } from '../index';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

axiosInstance.interceptors.request.use(
  config => {
    const userData = window.localStorage.getItem('bj_blog_userData')
    const token = userData
    ? `Bearer ${JSON.parse(userData).token}`
    : '' 
    config.headers.Authorization = token
    return config;
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
    const { response } = err;
    if (err && err instanceof Object && err.response) {
      if (response.status === 401) {
        message.error('～ 登陆状态已过期, 请重新登陆！ ～');
        window.localStorage.removeItem('bj_blog_userData');
        store.dispatch({
          type: 'userModel/changeUserData',
          payload: {title: '未登陆', isLogin: false}
        })
        const timer = setTimeout(() => {
          // routerRedux.push('/login')
          // clearTimeout(timer)
        }, 500);
      } else {
        message.error('～ 服务异常,请稍后再试 ～');
      }
    } else {
      message.error('～ 服务异常,请稍后再试 ～');
    }
    console.log('err', err, response)
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
