import React from 'react'
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'
import style from './braftEditor.less'
import { uploadImgUrl } from 'server/urlconfig'

const MyBraftEditor: React.FC<any> = (props:any) => {
  const uploadFn = (param: any) => {
    const serverURL = uploadImgUrl
    const xhr = new XMLHttpRequest()
    const fd = new FormData()
    const successFn = (even: any) => {
      // 假设服务端直接返回文件上传后的地址
      // 上传成功后调用param.success并传入上传后的文件地址
      const res = JSON.parse(xhr.response)
      console.log('---> response', even, JSON.parse(xhr.response))
      param.success({
        url: res.data.url,
      })
    }
    const progressFn = (event: any) => {
      // 上传进度发生变化时调用param.progress
      param.progress(event.loaded / event.total * 100)
    }
    const errorFn = (response: any) => {
      // 上传发生错误时调用param.error
      param.error({
        msg: 'unable to upload.'
      })
    }
    xhr.upload.addEventListener("progress", progressFn, false)
    xhr.addEventListener("load", successFn, false)
    xhr.addEventListener("error", errorFn, false)
    xhr.addEventListener("abort", errorFn, false)
    fd.append('file', param.file)
    xhr.open('POST', serverURL, true)
    xhr.send(fd)
  }
  const media: any = {
    validateFn: (file: any) => {
        return file.size < 1024 * 1024 * 5
    },
    uploadFn: uploadFn,
    accepts: {
      image: 'image/png,image/jpeg,image/gif,image/webp,image/apng,image/svg',
      video: false,
      audio: false
    }
  }
  // const value = BraftEditor.createEditorState(props.value)
  return (
      <BraftEditor
        placeholder='～～ 请填写博客内容'
        className={style.editorWrap}
        // defaultValue = {value}
        // value = {value}
        media = {media}
        // onChange={this.handleEditorChange}
      ></BraftEditor>
  )
}
 

export default  MyBraftEditor