
import { Effect, Reducer, connectSate } from './connect'
import { ApiLogin } from '../server/user';
import { routerRedux } from 'dva/router'

export interface userDataType {
  title: string;
  userId?: string;
  imgUrl?: string;
  isLogin: boolean;
  token?: string;
}
export interface UserStateType {
  loginLoading: boolean;
  userData: userDataType;
  userMsg: {password: string, userName: string}
}


export interface UserType {
  namespace: string,
  state: UserStateType,
  reducers?: {
    resetUserMsg: Reducer,
    changeUserMsg: Reducer,
    changeUserData: Reducer,
    changeLoginLoading: Reducer,
  },
  effects?: {
    apiLogin: Effect,
    getUserLocal: Effect
  }
  subscriptions?:{}
}


const User:UserType  = {
  namespace: 'userModel',
  state: {
    loginLoading: false,
    userData: {
      title: 'admin',
      isLogin: false,
    },
    userMsg: {
      userName:'',
      password: ''
    }
  },
  effects: {
    *apiLogin({payload}, {put, call, select}) {
      yield put({
        type: 'changeLoginLoading',
        payload : {
          loading: true
        }
      }) 
      const login_res =  yield call(ApiLogin, payload)
      yield put({
        type: 'changeLoginLoading',
        payload : {
          loading: false
        }
      }) 
      if(login_res.status === 200 && login_res.data.code === 200) {
          let data = login_res.data.data
          let userData =  {
            title: data.userName,
            isLogin: true,
            token: data.token,
          }
          yield put({
            type: 'changeUserData',
            payload: userData
          })
          const {indexPath} = yield select((state: connectSate) => state.globalData)
          window.localStorage.setItem('bj_blog_userData', JSON.stringify(userData))
          yield put(routerRedux.push(indexPath)) 
          yield put({
            type: 'resetUserMsg'
          })
      }
    },
    *getUserLocal({cb}, { put }) {
      let userData = localStorage.getItem('bj_blog_userData')
      if(!userData || !JSON.parse(userData) ) {
        cb && cb()
      }
      yield put({
        type: 'changeUserData',
        payload: userData? JSON.parse(userData): {title: '未登陆', isLogin: false}
      })
    }
  },
  reducers: {
    resetUserMsg(state) {
      return Object.assign(state, {userMsg:{}})
    },
    changeUserMsg(state, { payload }) {
      let userMsg = Object.assign(state.userMsg, payload)
      return{
        ...state,
        userMsg
      }
    },
    changeUserData(state, { payload }) {
      return{
        ...state,
        userData: payload
      }
    },
    changeLoginLoading(state, { payload }) {
      console.log('>>> loading', payload)
      return {
        ...state,
        loginLoading: payload.loading
      }
    }
  }
}

export default User

