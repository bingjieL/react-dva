import Reuqest from '../utils/request'
import { apiUrl } from '../server/urlconfig'



export const GetBlogTypeApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blogType/get`, params)
}

export const AddApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/add`, params)
}

export const GetApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/get`, params)
}

export const UpdateApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/update`, params)
}

export const FindByIdApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/getById`, params)
}

export const DeleteApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/delete`, params)
}

export const ChangeStatusApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/blog/changeStatus`, params)

}