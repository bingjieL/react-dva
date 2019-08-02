import { Reducer, Effect } from './connect';
import { GetApi } from 'server/banner'

export interface bannerModelStateType {
  listData: Array<any>,
  loading: boolean
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
  namespace: 'bananerModel',
  state: {
    listData: [],
    loading: false,
  },
  effects: {
    *getBannerList({ payload }, {put, call}) {
      yield call(GetApi, payload)
    }
  },
  reducers: {
    setlistData(state, {payload}) {
      return state;
    },
    changeloading(state, { payload }) {
      console.log('---> state', )
      return {
        ...state
      }
    }
  }
  
}

export default bannerModel