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
    <h3 className={style.left}>{props.bid? 'musicSheet Edit' : 'musicSheet Add'} </h3>
  </header>)
}
// musicSheet edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleUplodChange, sheetImg, uploadLoading, handleSubmit, addLoading, bid, goBack } = props
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
  return(<Form {...formItemLayout} className={style.musicSheetMainWrap}>
    <Form.Item label="歌单标题">
      {getFieldDecorator('sheetTitle', {
        rules: [{
          required: true,
          message: '请填写歌单标题',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="歌单标签">
      {getFieldDecorator('sheetTag', {
        rules: [{
          required: true,
          message: '请填写歌单标签',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="歌单链接">
      {getFieldDecorator('sheetUrl', {
        rules: [{
          required: true,
          message: '请填写歌单链接',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="MusicSheet Img">
      {getFieldDecorator('sheetImg', {
        getValueFromEvent:(file: any) => {
          const res = file.fileList[0].response
          if(res && res.code === 200) return res.data.url
        },
        rules: [{
          required: true,
          message: '请上传musicSheet 图片',
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
        {sheetImg ? <img src={sheetImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      )} 
    </Form.Item>
    <Form.Item label="歌单描述" wrapperCol= {{xs: {span: 12}, sm: {span: 12}}}>
      {getFieldDecorator('sheetDes', {
        rules: [{
          required: true,
          message: '请填写歌单描述',
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
  name: 'musicSheetFrom',
  mapPropsToFields(props: any) {
    return{
      sheetTitle: Form.createFormField({
        value: props.sheetTitle
      }),
      sheetImg: Form.createFormField({
        value: props.sheetImg
      }),
      sheetTag: Form.createFormField({
        value: props.sheetTag
      }),
      sheetUrl: Form.createFormField({
        value: props.sheetUrl
      }),
      sheetDes: Form.createFormField({
        value: props.sheetDes
      }),
      musicSheetAuthor: Form.createFormField({
        value: props.musicSheetAuthor
      }),
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeMusicSheetForm(value) 
  }
})(EditForm)


interface musicSheetAddParamsType {
  sheetImg: string,
  sheetTitle: string
}
interface musicSheetStateType {
  uploadLoading: boolean,
  bid: string
}
class MusicSheetEdit extends React.Component<any, musicSheetStateType>{
  public readonly state: Readonly<musicSheetStateType> = {
    uploadLoading: false,
    bid: ''
  }
  public UNSAFE_componentWillMount() {
    // console.log('>> props', this.props)
    this.props.dispatch({
      type: 'musicSheetModel/clearEditParams'
    })
    const bid = this.props.match.params._bid
    bid && this.getMusicSheetById(bid)
    this.setState({
      bid
    })
  }
  public goBack: ()=> void = () => {
   this.props.history.push('/main/musicSheetlist')
  }
  public getMusicSheetById(sheetId: string) {
    this.props.dispatch({
      type: 'musicSheetModel/getMusicSheetById',
      payload: {sheetId}
    })
  }
  public handChangeMusicSheetForm: (value: any) => void = (value) => {
    // console.log('>> change value', value)
    const {dispatch} = this.props
    dispatch({
      type: 'musicSheetModel/changeEditParams',
      payload: value
    })
  }
  public handleSubmit: (params: musicSheetAddParamsType) => void = (params) => {
    const {dispatch} = this.props
    const {bid} = this.state
    dispatch({
      type: bid? 'musicSheetModel/updateMusicSheet' :'musicSheetModel/addMusicSheet',
      payload: Object.assign({sheetId: bid}, params) ,
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
      let sheetImg = ''
      if(res.code === 200 ){
        message.success('～～ 图片上传成功！！')
        sheetImg = res.data.url
      }else {
        message.error('~~ 服务器异常, 请稍后再试！！')
      }
      this.setState({
        uploadLoading: false
      })
      this.props.dispatch({
        type: 'musicSheetModel/changeEditParams',
        payload: {
          sheetImg          
        }
      })
    }
  }
  render (): React.ReactNode {
    return (<div className={style.editWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        {...this.props.musicSheetModel.editParams}
        bid = {this.state.bid}
        goBack = {this.goBack}
        addLoading = {this.props.musicSheetModel.addLoading}
        uploadLoading = {this.state.uploadLoading}
        handChangeMusicSheetForm = {this.handChangeMusicSheetForm}
        handleUplodChange={ this.handleUplodChange }
        handleSubmit = { this.handleSubmit }
      ></CEditForm>
    </div>)
  }
}

export default connect(({musicSheetModel}: connectSate) => ({
  musicSheetModel
}))(MusicSheetEdit)
