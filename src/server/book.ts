import Reuqest from '../utils/request'
import { apiUrl } from '../server/urlconfig'

export const AddApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/book/add`, params)
}

export const GetApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/book/get`, params)
}

export const UpdateApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/book/update`, params)
}

export const FindByIdApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/book/getById`, params)
}

export const DeleteApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/book/delete`, params)
}