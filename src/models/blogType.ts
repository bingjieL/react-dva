import { Reducer, Effect } from './connect';
import { GetApi, DeleteApi, AddApi, FindByIdApi, UpdateApi } from 'server/blogType'
import { message } from 'antd';

export interface blogTypeModelStateType {
  listData: Array<any>,
  loading: boolean,
  params: any,
  addLoading: boolean,
  editParams: {blogTypeTile: string,blogTypeImg: string}
}

export interface blogTypeModelType<T> {
  namespace: string,
  state: T,
  effects?: {
    getBlogTypeList: Effect,
    deleteBlogType: Effect,
    addBlogType: Effect,
    getBlogTypeById: Effect,
    editBlogType: Effect
  },
  reducers?: {
    setlistData: Reducer,
    changeloading: Reducer,
    changeEditLoading: Reducer,
    changeEditParams: Reducer,
    clearEditParams: Reducer
  }
}


const blogTypeModel: blogTypeModelType<blogTypeModelStateType> = {
  namespace: 'blogTypeModel',
  state: {
    listData: [],
    loading: false,
    params: {},
    addLoading: false,
    editParams: {
      blogTypeTile: '',
      blogTypeImg: '',
    }
  },
  effects: {
    *getBlogTypeList({ payload }, {put, call}) {
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
    *deleteBlogType({payload}, {put, call}) {
      const res =  yield call(DeleteApi, payload)
      if(res.data.code !== 200) return
      message.success('～～ blogType删除成功')
      yield put({
        type: 'getBlogTypeList',
        payload: {}
      })
    },
    *addBlogType({payload, cb}, {put, call}) {
      yield put({
        type: 'changeEditLoading'
      })
      const res =  yield call(AddApi, payload)
      yield put({
        type: 'changeEditLoading'
      })
      if(res.data.code !== 200) return
      message.success('～～ blogType 添加成功')
      yield put({
        type: 'clearEditParams'
      })
      cb && cb()
    },
    *editBlogType({payload, cb}, {put, call}) {
      yield put({
        type: 'changeEditLoading'
      })
      const res =  yield call(UpdateApi, payload)
      yield put({
        type: 'changeEditLoading'
      })
      if(res.data.code !== 200) return
      message.success('～～ blogType 编辑成功')
      yield put({
        type: 'clearEditParams'
      })
      cb && cb()
    },
    *getBlogTypeById({payload}, {put, call}) {
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

export default blogTypeModel