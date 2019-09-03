import React from 'react'
import { connect } from 'dva';
import { connectSate } from '../../models/connect';
import { Form, Input, Button, Upload, message, Icon, Row, Col } from 'antd'
import { uploadImgUrl } from 'server/urlconfig'

// style 
import style from './edit.less';

const { TextArea } = Input

// header
const Header: React.FC<any> = (props) => {
  return(<header className={style.headerWrap}>
    <h3 className={style.left}>{props.bid? 'book Edit' : 'book Add'} </h3>
  </header>)
}
// book edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleUplodChange, bookPic, uploadLoading, handleSubmit, addLoading, bid, goBack } = props
  const { getFieldDecorator } = props.form;
  const formItemLayout = {
    labelCol: {
      xs: { span: 3 },
      sm: { span: 3 },
    },
    wrapperCol: {
      xs: { span: 12 },
      sm: { span: 6 },
    },
  };
  const handlebeforeUpload = (file: any) =>  {
    const is3M = file.size / 1024 / 1024 < 3
    !is3M && message.error('图片大小不能超过3M')
    return is3M
  }
  const valiDateForm: ()=> void = ()=> {
    props.form.validateFields((err: any, fieldValue: any) => {
      !err && handleSubmit(fieldValue)
    })
  }
  const uploadButton = (
    <div>
      <Icon type={uploadLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return(<Form {...formItemLayout} className={style.bookMainWrap}>
    <Form.Item label="Book Title">
      {getFieldDecorator('bookTitle', {
        rules: [{
          required: true,
          message: '请填写book title',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="Book Author">
      {getFieldDecorator('bookAuthor', {
        rules: [{
          required: true,
          message: '请填写书籍作者',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="PDF 链接">
      {getFieldDecorator('bookpdfUrl', {
        rules: [{
          required: true,
          message: '请填写书籍的pdf链接',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="kindle 链接">
      {getFieldDecorator('bookdlUrl', {
        rules: [{
          required: true,
          message: '请填写书籍的kindle链接',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="Book Img">
      {getFieldDecorator('bookPic', {
        getValueFromEvent:(file: any) => {
          const res = file.fileList[0].response
          if(res && res.code === 200) return res.data.url
        },
        rules: [{
          required: true,
          message: '请上传book 图片',
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
        {bookPic ? <img src={bookPic} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      )} 
    </Form.Item>
    <Form.Item label="书籍描述" wrapperCol= {{xs: {span: 12}, sm: {span: 12}}}>
      {getFieldDecorator('bookDes', {
        rules: [{
          required: true,
          message: '请填写书籍描述',
        },],
      })(<TextArea rows={3} />)} 
    </Form.Item>
    <Row>
      <Col offset={3}>
        <Button type="primary" loading={addLoading} onClick={valiDateForm}>
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
  name: 'bookFrom',
  mapPropsToFields(props: any) {
    return{
      bookTitle: Form.createFormField({
        value: props.bookTitle
      }),
      bookPic: Form.createFormField({
        value: props.bookPic
      }),
      bookpdfUrl: Form.createFormField({
        value: props.bookpdfUrl
      }),
      bookdlUrl: Form.createFormField({
        value: props.bookdlUrl
      }),
      bookDes: Form.createFormField({
        value: props.bookDes
      }),
      bookAuthor: Form.createFormField({
        value: props.bookAuthor
      }),
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeBookForm(value) 
  }
})(EditForm)


interface bookAddParamsType {
  bookPic: string,
  bookTitle: string
}
interface bookStateType {
  uploadLoading: boolean,
  bid: string
}
class BookEdit extends React.Component<any, bookStateType>{
  public readonly state: Readonly<bookStateType> = {
    uploadLoading: false,
    bid: ''
  }
  public UNSAFE_componentWillMount() {
    // console.log('>> props', this.props)
    this.props.dispatch({
      type: 'bookModel/clearEditParams'
    })
    const bid = this.props.match.params._bid
    bid && this.getBookById(bid)
    this.setState({
      bid
    })
  }
  public goBack: ()=> void = () => {
   this.props.history.push('/main/booklist')
  }
  public getBookById(bookId: string) {
    this.props.dispatch({
      type: 'bookModel/getBookById',
      payload: {bookId}
    })
  }
  public handChangeBookForm: (value: any) => void = (value) => {
    // console.log('>> change value', value)
    const {dispatch} = this.props
    dispatch({
      type: 'bookModel/changeEditParams',
      payload: value
    })
  }
  public handleSubmit: (params: bookAddParamsType) => void = (params) => {
    const {dispatch} = this.props
    const {bid} = this.state
    dispatch({
      type: bid? 'bookModel/updateBook' :'bookModel/addBook',
      payload: Object.assign({bookId: bid}, params) ,
      cb: ()=>{
        this.goBack()
      }
    })
  }
  public handleUplodChange:(info: any) => void = (info) => {
    if(info.file.status === 'uploading') {
      this.setState({
        uploadLoading: true
      })
    }else if(info.file.status === 'done') {
      const res = info.file.response
      let bookPic = ''
      if(res.code === 200 ){
        message.success('～～ 图片上传成功！！')
        bookPic = res.data.url
      }else {
        message.error('~~ 服务器异常, 请稍后再试！！')
      }
      this.setState({
        uploadLoading: false
      })
      this.props.dispatch({
        type: 'bookModel/changeEditParams',
        payload: {
          bookPic          
        }
      })
    }
  }
  render (): React.ReactNode {
    return (<div className={style.editWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        {...this.props.bookModel.editParams}
        bid = {this.state.bid}
        goBack = {this.goBack}
        addLoading = {this.props.bookModel.addLoading}
        uploadLoading = {this.state.uploadLoading}
        handChangeBookForm = {this.handChangeBookForm}
        handleUplodChange={ this.handleUplodChange }
        handleSubmit = { this.handleSubmit }
      ></CEditForm>
    </div>)
  }
}

export default connect(({bookModel}: connectSate) => ({
  bookModel
}))(BookEdit)
