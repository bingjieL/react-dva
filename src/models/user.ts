
import { Effect, Reducer, connectSate } from './connect'
import { ApiLogin } from '../server/user';
import { routerRedux } from 'dva/router'

export interface userDataType {
  title: string,
  userId?: string,
  imgUrl?: string,
  isLogin: boolean,
  
}
export interface UserStateType {
  userData: userDataType;
  userMsg: {password: string, userName: string}
}


export interface UserType {
  namespace: string,
  state: UserStateType,
  reducers?: {
    resetUserMsg: Reducer,
    changeUserMsg: Reducer,
    changeUserData: Reducer
  },
  effects?: {
    apiLogin: Effect,
    getUserLocal: Effect
  }
  subscriptions?:{}
}


const User:UserType  = {
  namespace: 'user',
  state: {
    userData: {
      title: 'admin',
      isLogin: false,
    },
    userMsg: {
      userName:'admin',
      password: 'admin'
    }
  },
  effects: {
    *apiLogin({payload}, {put, call, select}) {
      const login_res =  yield call(ApiLogin, payload)
      console.log('login_res', login_res)
      if(login_res.status === 200 && login_res.data.code === 200) {
          let data = login_res.data.data
          let userData =  {
            title: data.userName,
            isLogin: true
          }
          yield put({
            type: 'changeUserData',
            payload: userData
          })
          const {indexPath} = yield select((state: connectSate) => state.globalData)
          window.localStorage.setItem('userData', JSON.stringify(userData))
          yield put(routerRedux.push(indexPath)) 
          yield put({
            type: 'resetUserMsg'
          })
      }
    },
    *getUserLocal({cb}, { put }) {
      let userData = localStorage.getItem('userData')
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
    }
  }
}

export default User

