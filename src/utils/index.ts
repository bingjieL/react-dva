


export const throttle =  (time: number, cb: (options?: any)=>void, options?: any) => {
  let timer: any = null
  return ()=> {
    if(timer) return
    timer = setTimeout(()=> {
      timer = null
      cb(options)
    }, time)
  }
}