import Reuqest from 'utils/request'
import { apiUrl } from 'server/urlconfig'


export const AddApi = (params: any) => {
  return Reuqest.post(`${apiUrl}/api/banner/add`, params)
}

export const GetApi = (params: any) => {
  return Reuqest.post(`${apiUrl}/api/banner/get`, params)
}

export const UpdateApi = (params: any) => {
  return Reuqest.post(`${apiUrl}/api/banner/update`, params)
}

export const FindByIdApi = (params: any) => {
  return Reuqest.post(`${apiUrl}/api/banner/getById`, params)
}

export const DeleteApi = (params: any) => {
  return Reuqest.post(`${apiUrl}/api/banner/delete`, params)
}