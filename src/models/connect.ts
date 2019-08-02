import { GlobalStateType } from './globalData'
import { UserStateType } from './user'
import { bannerModelStateType } from './banner'
import { EffectsCommandMap } from 'dva'

export interface connectSate {
  globalData: GlobalStateType,
  user: UserStateType,
  bannerModel: bannerModelStateType
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

