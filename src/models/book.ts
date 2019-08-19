import { Effect, Reducer } from './connect';
import { AddApi, GetApi, UpdateApi, FindByIdApi, DeleteApi} from '@/server/book.ts'
import { message } from 'antd';

export interface bookStateType {
  listData: Array<any>,
  listLoading: boolean,
  addLoading: boolean,
  editParams: {
    bookTitle: string,
    bookpdfUrl: string,
    bookdlUrl: string,
    bookPic: string,
    bookDes: string,
    bookAuthor: string,
    bookId?: string,
    [key: string]: any
  }
}

export interface bookType<T> {
  namespace: string,
  state: T,
  effects: {
    getBookList: Effect,
    deleteBook: Effect, 
    getBookById: Effect,
    addBook: Effect,
    updateBook: Effect
  },
  reducers: {
    changeListLoading: Reducer,
    changeListData: Reducer,
    changeEditParams: Reducer,
    clearEditParams: Reducer,
    changeAddLoading: Reducer,
  }
}

const bookModel: bookType<bookStateType> = {
  namespace: 'bookModel',
  state: {
    listData: [],
    listLoading: false,
    addLoading: false,
    editParams: {
      bookTitle: '',
      bookpdfUrl: '',
      bookdlUrl: '',
      bookPic: '',
      bookDes: '',
      bookAuthor: '',
    }
  },
  effects: {
    *getBookList(_, {put,call}) {
      yield put({type: 'changeListLoading'})
      const res = yield call(GetApi, {})
      yield put({type: 'changeListLoading'})
      if(res.data.code !== 200 ) return
      yield put({
        type: 'changeListData',
        payload: res.data.data.rows.map((item: any, index: number) => {item.key = index; return item})
      })
    },
    *deleteBook({payload}, {put ,call}) {
      const res = yield call(DeleteApi, payload) 
      if(res.data.code !== 200) return
      message.success('~~ 书籍删除成功')
      yield put({type: 'getBookList'})
    },
    *getBookById({payload}, {put, call}) { 
      const res = yield call(FindByIdApi, payload)
      if(res.data.code !== 200) return 
      yield put({
        type: 'changeEditParams',
        payload: res.data.data
      })
    },
    *addBook({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.bookModel.editParams)
      const res = yield call(AddApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 书籍添加成功')
      cb && cb()
    },
    *updateBook({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.bookModel.editParams)
      const res = yield call(UpdateApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 书籍编辑成功')
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

export default bookModel;