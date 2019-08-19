import Reuqest from '../utils/request'
import { apiUrl } from '../server/urlconfig'

export const AddApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/hotSwiper/add`, params)
}

export const GetApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/hotSwiper/get`, params)
}

export const UpdateApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/hotSwiper/update`, params)
}

export const FindByIdApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/hotSwiper/getById`, params)
}

export const DeleteApi = (params: object) => {
  return Reuqest.post(`${apiUrl}/api/hotSwiper/delete`, params)
}
