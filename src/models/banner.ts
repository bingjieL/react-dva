import { Reducer, Effect } from './connect';
import { GetApi } from 'server/banner'

export interface bannerModelStateType {
  listData: Array<any>,
  loading: boolean,
  params: any
}

export interface bannerModelType<T> {
  namespace: string,
  state: T,
  effects?: {
    getBannerList: Effect
  },
  reducers?: {
    setlistData: Reducer,
    changeloading: Reducer
  }
}


const bannerModel: bannerModelType<bannerModelStateType> = {
  namespace: 'bannerModel',
  state: {
    listData: [],
    loading: false,
    params: {}
  },
  effects: {
    *getBannerList({ payload }, {put, call}) {
      yield put({
        type: 'changeloading'
      })
      const bannerRes = yield call(GetApi, payload)
      yield put({
        type: 'setlistData',
        payload: bannerRes.data.data.rows.map((item: any ,index: number)=>{item.key = index; return item}  )
      })
      yield put({
        type: 'changeloading'
      })
    }
  },
  reducers: {
    setlistData(state, {payload}) {
      return {
        ...state,
        listData: payload
      };
    },
    changeloading(state, { payload }) {
      const loading = !state.loading
      return {
        ...state,
        loading
      }
    }
  }
  
}

export default bannerModel