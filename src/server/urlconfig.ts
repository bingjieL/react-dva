
export const isProduct: boolean = process.env.NODE_ENV === 'production' ? true : false

export const apiUrl: string =  isProduct ?  'http://api.8bjl.cn': 'http://localhost:3030';

export const uploadImgUrl: string = `${apiUrl}/api/upFiles`



//  dev    http://10.63.5.246:3030