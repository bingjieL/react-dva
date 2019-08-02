import Reuqest from 'utils/request'
import { apiUrl } from 'server/urlconfig'

export const ApiLogin = (params: any) => Reuqest.post(`${apiUrl}/api/users/login`, params)