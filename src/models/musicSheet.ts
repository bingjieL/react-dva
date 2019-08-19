import { Effect, Reducer } from './connect';
import { AddApi, GetApi, UpdateApi, FindByIdApi, DeleteApi} from '@/server/musicSheet.ts'
import { message } from 'antd';

export interface musicSheetStateType {
  listData: Array<any>,
  listLoading: boolean,
  addLoading: boolean,
  editParams: {
    sheetTitle: string,
    sheetTag: string,
    sheetUrl: string,
    sheetImg: string,
    sheetDes: string,
    musicSheetAuthor: string,
    sheetId?: string,
    [key: string]: any
  }
}

export interface musicSheetType<T> {
  namespace: string,
  state: T,
  effects: {
    getMusicSheetList: Effect,
    deleteMusicSheet: Effect, 
    getMusicSheetById: Effect,
    addMusicSheet: Effect,
    updateMusicSheet: Effect
  },
  reducers: {
    changeListLoading: Reducer,
    changeListData: Reducer,
    changeEditParams: Reducer,
    clearEditParams: Reducer,
    changeAddLoading: Reducer,
  }
}

const musicSheetModel: musicSheetType<musicSheetStateType> = {
  namespace: 'musicSheetModel',
  state: {
    listData: [],
    listLoading: false,
    addLoading: false,
    editParams: {
      sheetTitle: '',
      sheetTag: '',
      sheetUrl: '',
      sheetImg: '',
      sheetDes: '',
      musicSheetAuthor: '',
    }
  },
  effects: {
    *getMusicSheetList(_, {put,call}) {
      yield put({type: 'changeListLoading'})
      const res = yield call(GetApi, {})
      // console.log('>>> music sheet listData', res)
      yield put({type: 'changeListLoading'})
      if(res.data.code !== 200 ) return
      yield put({
        type: 'changeListData',
        payload: res.data.data.rows.map((item: any, index: number) => {item.key = index; return item})
      })
    },
    *deleteMusicSheet({payload}, {put ,call}) {
      const res = yield call(DeleteApi, payload) 
      if(res.data.code !== 200) return
      message.success('~~ 歌单删除成功')
      yield put({type: 'getMusicSheetList'})
    },
    *getMusicSheetById({payload}, {put, call}) { 
      const res = yield call(FindByIdApi, payload)
      if(res.data.code !== 200) return 
      yield put({
        type: 'changeEditParams',
        payload: res.data.data
      })
    },
    *addMusicSheet({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.musicSheetModel.editParams)
      const res = yield call(AddApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 歌单添加成功')
      cb && cb()
    },
    *updateMusicSheet({ cb }, {put, call, select}) {
      yield put({type: 'changeAddLoading'})
      const editParams = yield select(state => state.musicSheetModel.editParams)
      const res = yield call(UpdateApi, editParams) 
      yield put({type: 'changeAddLoading'})
      if(res.data.code !== 200) return
      message.success('～～ 歌单编辑成功')
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

export default musicSheetModel;