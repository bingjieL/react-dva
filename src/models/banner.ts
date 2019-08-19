import { Reducer, Effect } from './connect';
import { GetApi, DeleteApi, AddApi, FindByIdApi, UpdateApi } from 'server/banner'
import { message } from 'antd';

export interface bannerModelStateType {
  listData: Array<any>,
  loading: boolean,
  params: any,
  addLoading: boolean,
  editParams: {bannerTile: string,bannerImg: string}
}

export interface bannerModelType<T> {
  namespace: string,
  state: T,
  effects?: {
    getBannerList: Effect,
    deleteBanner: Effect,
    addBanner: Effect,
    getBannerById: Effect,
    editBanner: Effect
  },
  reducers?: {
    setlistData: Reducer,
    changeloading: Reducer,
    changeEditLoading: Reducer,
    changeEditParams: Reducer,
    clearEditParams: Reducer
  }
}


const bannerModel: bannerModelType<bannerModelStateType> = {
  namespace: 'bannerModel',
  state: {
    listData: [],
    loading: false,
    params: {},
    addLoading: false,
    editParams: {
      bannerTile: '',
      bannerImg: '',
    }
  },
  effects: {
    *getBannerList({ payload }, {put, call}) {
      yield put({
        type: 'changeloading'
      })
      const res = yield call(GetApi, payload)
      yield put({
        type: 'changeloading'
      })
      if(res.data.code !== 200) return
      yield put({
        type: 'setlistData',
        payload: res.data.data.rows.map((item: any ,index: number)=>{item.key = index; return item}  )
      })
     
    },
    *deleteBanner({payload}, {put, call}) {
      const res =  yield call(DeleteApi, payload)
      if(res.data.code !== 200) return
      message.success('～～ banner删除成功')
      yield put({
        type: 'getBannerList',
        payload: {}
      })
    },
    *addBanner({payload, cb}, {put, call}) {
      yield put({
        type: 'changeEditLoading'
      })
      const res =  yield call(AddApi, payload)
      yield put({
        type: 'changeEditLoading'
      })
      if(res.data.code !== 200) return
      message.success('～～ banner 添加成功')
      yield put({
        type: 'clearEditParams'
      })
      cb && cb()
    },
    *editBanner({payload, cb}, {put, call}) {
      yield put({
        type: 'changeEditLoading'
      })
      const res =  yield call(UpdateApi, payload)
      yield put({
        type: 'changeEditLoading'
      })
      if(res.data.code !== 200) return
      message.success('～～ banner 编辑成功')
      yield put({
        type: 'clearEditParams'
      })
      cb && cb()
    },
    *getBannerById({payload}, {put, call}) {
      const res = yield call(FindByIdApi, payload)
      if(res.data.code === 200) {
        yield put({
          type: 'changeEditParams',
          payload: res.data.data
        })
      }
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
    },
    changeEditLoading(state,) {
      const addLoading = !state.addLoading
      return{
        ...state,
        addLoading
      }
    },
    changeEditParams(state, {payload}) {
      return {
        ...state,
        editParams: Object.assign(state.editParams,payload)
      }
    },
    clearEditParams(state) {
      return {
        ...state,
        editParams:{}
      }
    }
  }
  
}

export default bannerModel