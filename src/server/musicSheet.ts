import Reuqest from '../utils/request'
import { apiUrl } from '../server/urlconfig'

export const AddApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/sheet/add`, params)
}

export const GetApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/sheet/get`, params)
}

export const UpdateApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/sheet/update`, params)
}

export const FindByIdApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/sheet/getById`, params)
}

export const DeleteApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/sheet/delete`, params)
}