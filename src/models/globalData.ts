
import { Effect, connectSate, Reducer } from './connect'

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
    dealFold: Effect
  }
  subscriptions?:{}
}


const globalData:GlobalDataType  = {
  namespace: 'globalData',
  state: {
    collapsed: false,
    indexPath: '/main/bannerList',
  },
  effects: {
    *dealFold(_,{select, put}) {
     const { collapsed } = yield select((state: connectSate) => state.globalData)
     yield put({
       type: 'modifyCollapsed',
       payload: {collapsed: !collapsed}
     })
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

