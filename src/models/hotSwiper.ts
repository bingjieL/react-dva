import { Effect, Reducer } from './connect';
import { AddApi, GetApi, UpdateApi, FindByIdApi, DeleteApi} from '../server/hotSwiper'
import { message } from 'antd';

export interface hotSwiperStateType {
  listData: Array<any>,
  listLoading: boolean,
  addLoading: boolean,
  editParams: {
    hotTitle: string,
    hotUrl: string,
    hotImg: string,
    hotId?: string,
    [key: string]: any
  }
}

export interface hotSwiperType<T> {
  namespace: string,
  state: T,
  effects: {
    getHotSwiperList: Effect,
    deleteHotSwiper: Effect, 
    getHotSwiperById: Effect,
    addHotSwiper: Effect,
    updateHotSwiper: Effect
  },
  reducers: {
    changeListLoading: Reducer,
    changeListData: Reducer,
    changeEditParams: Reducer,
    clearEditParams: Reducer,
    changeAddLoading: Reducer,
  }
}

const hotSwiperModel: hotSwiperType<hotSwiperStateType> = {
  namespace: 'hotSwiperModel',
  state: {
    listData: [],
    listLoading: false,
    addLoading: false,
    editParams: {
      hotTitle: '',
      hotUrl: '',
      hotImg: '',
    }
  },
  effects: {
    *getHotSwiperList(_, {put,call}) {
      yield put({type: 'changeListLoading'})
      const res = yield call(GetApi, {})
      // console.log('>>> hotswiper listData', res)
      yield put({type: 'changeListLoading'})
      if(res.data.code !== 200 ) return
      yield put({
        type: 'changeListData',
        payload: res.data.data.rows.map((item: any, index: number) => {item.key = index; return item})
      })
    },
    *deleteHotSwiper({payload}, {put ,call}) {
      const res = yield call(DeleteApi, payload) 
      if(res.data.code !== 200) return
      message.success('~~ 首页轮播删除成功')
      yield put({type: 'getHotSwiperList'})
    },
    *getHotSwiperById({payload}, {put, call}) { 
      const res = yield call(FindByIdApi, payload)
      if(res.data.code !== 200) return 
      yield put({
        type: 'changeEditParams',
        payload: res.data.data
      })
    },
    *addHotSwiper({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.hotSwiperModel.editParams)
      const res = yield call(AddApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 首页轮播添加成功')
      cb && cb()
    },
    *updateHotSwiper({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.hotSwiperModel.editParams)
      const res = yield call(UpdateApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 首页轮播编辑成功')
      cb && cb()
    }
  },
  reducers: {
    changeListData(state, {payload}) {
      return {
        ...state,
        listData: payload
      }
    },
    changeListLoading(state) {
      const listLoading = !state.listLoading
      return {
        ...state,
        listLoading
      }
    },
    changeAddLoading(state) {
      const addLoading = !state.addLoading
      return {
        ...state,
        addLoading
      }
    },
    changeEditParams(state, {payload}) {
      return {
        ...state,
        editParams: Object.assign(state.editParams, payload)
      }
    },
    clearEditParams(state) {
      return {
        ...state,
        editParams: {}
      }
    }
  }
}

export default hotSwiperModel;