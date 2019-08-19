
import { EffectsCommandMap } from 'dva'
import { GlobalStateType } from './globalData'
import { UserStateType } from './user'
import { bannerModelStateType } from './banner'
import { blogModelStateType } from './blog';
import { bookStateType } from './book';
import { hotSwiperStateType } from './hotSwiper';
import { musicSheetStateType } from './musicSheet';
import { blogTypeModelStateType } from './blogType';

export interface connectSate {
  globalData: GlobalStateType,
  userModel: UserStateType,
  bannerModel: bannerModelStateType,
  blogModel: blogModelStateType,
  bookModel: bookStateType,
  hotSwiperModel: hotSwiperStateType,
  musicSheetModel: musicSheetStateType,
  blogTypeModel: blogTypeModelStateType
}


export type Effect = (
  action: any,
  effects: EffectsCommandMap & { select: <T>(func: (state: connectSate) => T) => T },
) => void;

export type Reducer = <T = any>(state: any, params: any) => T

export type Dispatch = <P = any, C = (payload: P) => void>(action: {
  type: string;
  payload?: P;
  callback?: C;
  [key: string]: any; 
}) => any;

