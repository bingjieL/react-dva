
import { Effect, connectSate, Reducer } from './connect'
import { routerRedux } from 'dva/router';

export interface GlobalStateType {
  collapsed: boolean;
  indexPath: string
}

export interface GlobalDataType {
  namespace: string,
  state: GlobalStateType,
  reducers?: {
    modifyCollapsed: Reducer
  },
  effects?: {
    dealFold: Effect,
    handleGo: Effect
  }
  subscriptions?:{}
}


const globalData:GlobalDataType  = {
  namespace: 'globalData',
  state: {
    collapsed: false,
    indexPath: '/main/bannerlist',
  },
  effects: {
    *dealFold(_,{select, put}) {
     const { collapsed } = yield select((state: connectSate) => state.globalData)
     yield put({
       type: 'modifyCollapsed',
       payload: {collapsed: !collapsed}
     })
    },
    *handleGo({payload}, {put}) {
      yield put(routerRedux.push(payload))
    }
  },
  reducers: {
    modifyCollapsed( state, params) {
      return {
        ...state,
        ...params.payload
      }
    }
  }
}

export default globalData

