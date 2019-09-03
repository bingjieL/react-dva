
export const isProduct: boolean = process.env.NODE_ENV === 'production' ? true : false

export const apiUrl: string =  isProduct ?  'https://api.8bjl.cn': 'http://10.63.3.156:3030';

export const uploadImgUrl: string = `${apiUrl}/api/upFiles`



//  dev    http://10.63.5.246:3030