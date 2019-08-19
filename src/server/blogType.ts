
import Reuqest from '../utils/request'
import { apiUrl } from '../server/urlconfig'

export const AddApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/add`, params)
}

export const GetApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/get`, params)
}

export const UpdateApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/update`, params)
}

export const FindByIdApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/getById`, params)
}

export const DeleteApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/delete`, params)
}