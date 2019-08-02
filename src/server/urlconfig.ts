
export const isProduct: boolean = process.env.NODE_ENV === 'production' ? true : false

export const apiUrl: string =  isProduct ?  'http://api.8bjl.cn': 'http://api.8bjl.cn';



