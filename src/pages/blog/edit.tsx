import React from 'react';
import { connect } from 'dva';
import { connectSate } from 'models/connect';
import {uploadImgUrl} from 'server/urlconfig'
import { message, Icon, Form, Input, Upload, Row, Col, Button, Select} from 'antd'
import BraftEditor from 'braft-editor'

// style
import style from './edit.less'

// component
import MyBraftEditor from 'components/braftEditor'

const { Option } = Select;
const { TextArea } = Input;

// header
const Header: React.FC<any> = (props) => {
  return(<header className={style.headerWrap}>
    <h3 className={style.left}>{props.bid? 'blog Edit' : 'blog Add'} </h3>
  </header>)
}
//edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleUplodChange, blogImg, uploadLoading, saveEditData, editLoading, bid, goBack, typeList} = props
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 3 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
  };
  const handlebeforeUpload = (file: any) =>  {
    const is3M = file.size / 1024 / 1024 < 3
    !is3M && message.error('图片大小不能超过3M')
    return is3M
  }
  const valiDateForm: (type: string)=> void = (type)=> {
    // console.log('>>> type', type)
    props.form.validateFields((err: any, fieldValue: any) => {
      !err && saveEditData(fieldValue, type)
    })
  }
  const uploadButton = (
    <div>
      <Icon type={uploadLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return(<Form {...formItemLayout} className={style.blogMainWrap}>
    <Form.Item label="Blog Title">
      {getFieldDecorator('blogTitle', {
        rules: [{
          required: true,
          message: '请填写banner title',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="Blog Type">
      {getFieldDecorator('blog_type_id', {
          rules: [{
            required: true,
            message: '请选择博客类型',
          },]
        })(<Select>
          {typeList.map((item: any, index: number) => <Option key={index} value={item.blogTypeId}>{item.blogTypeTitle}</Option>)}
      </Select>)}
    </Form.Item>
    <Form.Item label="Blog Img">
      {getFieldDecorator('blogImg', {
        getValueFromEvent:(file: any) => {
          const res = file.fileList[0].response
          if(res && res.code === 200) return res.data.url
        },
        rules: [{
          required: true,
          message: '请上传blog 图片',
        },],
      })(
        <Upload
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        action={uploadImgUrl}
        beforeUpload={handlebeforeUpload}
        onChange={handleUplodChange}
      >
        {blogImg ? <img src={blogImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      )} 
    </Form.Item>
    <Form.Item label="Blog des"  wrapperCol= {{xs: {span: 12}, sm: {span: 12}}}>
    {getFieldDecorator('blogDes', {
        rules: [{
          required: true,
          message: '请填写博客概括',
        },]
      })(<TextArea rows={3} />)}
    </Form.Item>
    <Form.Item label="Blog Content"  wrapperCol= {{xs: {span: 18}, sm: {span: 18}}}>
      {getFieldDecorator('blogContent', {
          validateTrigger: 'onBlur',
          // getValueFromEvent: (value: any) => {
          //   if (value.isEmpty()) return null
          //   return value.toHTML()
          // },
          rules: [{
            required: true,
            message: '请填写博客内容',
            validator: (_: any, value: any, callback: any) => {
              if (value.isEmpty()) {
                callback('请输入正文内容')
              } else {
                callback()
              }
            }
          },]
        })(
          // 采用组件方式引入不能够触发Form的anchangeValue方法 所以采用函数
          MyBraftEditor({valiDateForm})
        )}
    </Form.Item>
    <Row>
      <Col offset={3}>
        <Button type="primary" loading={editLoading} onClick={ () => valiDateForm('update')}>
           {bid? '保存' : '立即创建'} 
        </Button>
        <Button style={{marginLeft: '50px'}} onClick={ goBack }>
            返回
        </Button>
      </Col>
    </Row>
  </Form>)
}
const CEditForm = Form.create({
  name: 'bannerFrom',
  mapPropsToFields(props: any) {
    return{
      blogTitle: Form.createFormField({
        value: props.blogTitle
      }),
      blogImg: Form.createFormField({
        value: props.blogImg
      }),
      blogDes: Form.createFormField({
        value: props.blogDes
      }),
      blog_type_id: Form.createFormField({
        value: props.blog_type_id
      }),
      blogContent: Form.createFormField({
        value: BraftEditor.createEditorState(props.blogContent) 
      })
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeBannerForm(value) 
  }
})(EditForm)





interface blogStateType {
  bid: string,
  uploadLoading: boolean,
}

class BlogEdit extends React.Component<any, blogStateType>{
  public readonly state: Readonly<blogStateType> = {
    bid: '',
    uploadLoading: false
  }
  public handChangeBannerForm = (value :any) =>  {
    const { dispatch} = this.props
    // delete value.blogContent
    if(JSON.stringify(value) === '{}') return
    dispatch({
      type: 'blogModel/changeEditData',
      payload: value
    })
  }
  public getBlogDetail = (blogId: string) => {
    const {dispatch} = this.props
    dispatch({
      type: 'blogModel/getBlogDetail',
      payload: {blogId}
    })
  }
  public componentWillMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'blogModel/clearEditData'
    })
    dispatch({
      type: 'blogModel/getTypeList'
    })
    const bid = this.props.match.params._bid
    this.setState({
      bid
    })
    bid && this.getBlogDetail(bid)
  }
  public goBack = ()=> {
    this.props.history.push('/main/bloglist')
  }
  public handleUplodChange:(info: any) => void = (info) => {
    if(info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true
      })
    }else if(info.file.status === 'done') {
      const res = info.file.response
      let blogImg = ''
      
      if(res.code === 200 ){
        message.success('～～ 图片上传成功！！')
        blogImg = res.data.url
      }else {
        message.error('~~ 服务器异常, 请稍后再试！！')
      }
      this.setState({
        uploadLoading: false
      })
      this.props.dispatch({
        type: 'blogModel/changeEditData',
        payload: {
          blogImg          
        }
      })
    }
  }
  public saveEditData = (editData: any, type: string)=> {
    const {bid} = this.state
    const {dispatch} = this.props
    dispatch({
      type: 'blogModel/changeEditData',
      payload: editData
    })
    bid && dispatch({
      type: 'blogModel/updateBlog',
      cb:() => {
        type === 'update' && this.goBack()
      }
    })
    !bid && dispatch({
      type: 'blogModel/addBlog',
      cb:(blogId?: string) => {
        if(blogId){
          this.setState({
            bid: blogId
          })
        }
        type === 'update' && this.goBack()
      }
    })
  }
  
  render(): React.ReactNode{
    return (<div className={style.blogWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        {...this.props.blogModel.editData}
        bid = {this.state.bid}
        typeList = {this.props.blogModel.typeList}
        uploadLoading = {this.state.uploadLoading}
        editLoading = {this.props.blogModel.editLoading}
        goBack = {this.goBack}
        saveEditData = {this.saveEditData}
        handleUplodChange = {this.handleUplodChange}
        handChangeBannerForm = {this.handChangeBannerForm}
      ></CEditForm>
    </div>)
  }
}

export default connect(({globalData, blogModel}: connectSate) => ({
  blogModel,
  globalData
}))(BlogEdit)