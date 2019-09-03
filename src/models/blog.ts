import { Reducer, Effect } from './connect';
import { GetApi, AddApi, GetBlogTypeApi, UpdateApi, FindByIdApi, DeleteApi} from '../server/blog'
import { message } from 'antd';
export interface blogModelStateType {
  listLoading: boolean,
  editLoading: boolean,
  listData: any[],
  searchParams: {
    pageNumber: number,
    pageSize: number
  },
  editData: {
    blogContent: string,
    blogDes: string,
    blogTitle: string,
    blogImg: string,
    blog_type_id: string,
    blogId?: string
    [key: string]: any
  },
  typeList: Array<any>,
}


export interface  blogModelType<T> {
  namespace: string,
  state: T
  effects: {
    getBlogList: Effect,
    getTypeList: Effect,
    getBlogDetail: Effect,
    updateBlog: Effect,
    addBlog: Effect,
    deleteBlog: Effect,
  },
  reducers: {
    changeListData: Reducer,
    changeListLoading: Reducer,
    changePageSize: Reducer,
    changeEditData: Reducer,
    changeTypeList: Reducer,
    changeEditLoading: Reducer,
    clearEditData: Reducer,
  }
}

const BanenrModel: blogModelType<blogModelStateType> = {
  namespace: 'blogModel',
  state: {
    listLoading: false,
    editLoading: false,
    listData: [],
    searchParams: {
      pageNumber: 1,
      pageSize: 5
    },
    editData: {
      blogContent: '',
      blogDes: '',
      blogTitle: '',
      blogImg: '',
      blog_type_id: '',
    },
    typeList: []
  },
  effects: {
    *getBlogList(_, {put, call, select}) {
      yield put({type: 'changeListLoading'})
      const {searchParams} = yield select(state => state.blogModel)
      const res = yield call(GetApi,searchParams)
      yield put({type: 'changeListLoading'})
      if(res.data.code !== 200) return
      const  _data = res.data.data
      _data.rows =  _data.rows.map((item: any, index: number) => {item.key = index; return item})
      yield put({
        type: 'changeListData',
        payload: _data
      })
    },
    *getTypeList(_, {put, call}) {
      const res =  yield call(GetBlogTypeApi, {})
      if(res.data.code !== 200) return
      yield put({
        type: 'changeTypeList',
        payload: res.data.data.rows
      })
    },
    *getBlogDetail({payload, cb}, {put, call}) {
      const res = yield call(FindByIdApi, payload)
      console.log('>>> byId blog Detail', res)
      if(res.data.code !== 200) return
      yield put({
        type: 'changeEditData',
        payload: res.data.data
      })
      cb && cb(res.data.data.blogImg)
    },
    *updateBlog({cb}, {put, call, select}) {
      const payload = yield select(state => state.blogModel.editData)
      yield put({type: 'changeEditLoading'})
      const res = yield call(UpdateApi, payload)
      yield put({type: 'changeEditLoading'})
      if(res.data.code !== 200) return
      message.success('~~ 博客修改成功')
      cb && cb()
    },
    *addBlog({cb}, {put, call, select}) {
      const payload = yield select(state => state.blogModel.editData)
      yield put({type: 'changeEditLoading'})
      const res = yield call(AddApi, payload)
      yield put({type: 'changeEditLoading'})
      if(res.data.code !== 200) return
      message.success('~~ 博客添加成功')
      cb && cb()
    },
    *deleteBlog({payload}, {put, call, select}) {
      const res = yield call(DeleteApi, payload)
      if(res.data.code !== 200) return
      message.success('~~ 博客删除成功')
      const {searchParams} = yield select(state => state.blogModel)
      yield put({
        type: 'getBlogList',
        payload: searchParams
      })
    }
  },
  reducers: {
    changeListData(state, { payload }) {
      return {
        ...state,
        listData: payload
      }
    },
    changePageSize(state, { payload }) {
      return {
        ...state,
        searchParams: Object.assign(state.searchParams, payload)
      }
    },
    changeListLoading(state) {
      const listLoading = !state.listLoading
      return {
        ...state,
        listLoading
      }
    },
    changeEditLoading(state) {
      const editLoading = !state.editLoading
      return {
        ...state,
        editLoading
      }
    },
    changeEditData(state, {payload}) {
      return {
        ...state,
        editData: Object.assign(state.editData, payload)
      }
    },
    changeTypeList(state, {payload}) {
      return {
        ...state,
        typeList: payload
      }
    },
    clearEditData(state) {
      return {
        ...state,
        editData: {}
      }
    }
  }
}

export default BanenrModel
