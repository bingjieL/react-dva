import React from 'react'
import { connect } from 'dva';
import { connectSate } from '../../models/connect';
import { Form, Input, Button, Upload, message, Icon, Row, Col } from 'antd'
import { uploadImgUrl } from 'server/urlconfig'

// style 
import style from './edit.less';

// header
const Header: React.FC<any> = (props) => {
  return(<header className={style.headerWrap}>
    <h3 className={style.left}>{props.bid? 'hotSwiper Edit' : 'hotSwiper Add'} </h3>
  </header>)
}
// hotSwiper edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleUplodChange, hotImg, uploadLoading, handleSubmit, addLoading, bid, goBack } = props
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
  return(<Form {...formItemLayout} className={style.hotSwiperMainWrap}>
    <Form.Item label="HotSwiper Title">
      {getFieldDecorator('hotTitle', {
        rules: [{
          required: true,
          message: '请填写hotSwiper title',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="github 链接">
      {getFieldDecorator('hotUrl', {
        rules: [{
          required: true,
          message: '请填写关联的github链接',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="HotSwiper Img">
      {getFieldDecorator('hotImg', {
        getValueFromEvent:(file: any) => {
          const res = file.fileList[0].response
          if(res && res.code === 200) return res.data.url
        },
        rules: [{
          required: true,
          message: '请上传hotSwiper 图片',
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
        {hotImg ? <img src={hotImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
      </Upload>
      )} 
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
  name: 'hotSwiperFrom',
  mapPropsToFields(props: any) {
    return{
      hotTitle: Form.createFormField({
        value: props.hotTitle
      }),
      hotImg: Form.createFormField({
        value: props.hotImg
      }),
      hotUrl: Form.createFormField({
        value: props.hotUrl
      }),
      hotSwiperdlUrl: Form.createFormField({
        value: props.hotSwiperdlUrl
      }),
      hotSwiperDes: Form.createFormField({
        value: props.hotSwiperDes
      }),
      hotSwiperAuthor: Form.createFormField({
        value: props.hotSwiperAuthor
      }),
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeHotSwiperForm(value) 
  }
})(EditForm)


interface hotSwiperAddParamsType {
  hotImg: string,
  hotTitle: string
}
interface hotSwiperStateType {
  uploadLoading: boolean,
  bid: string
}
class HotSwiperEdit extends React.Component<any, hotSwiperStateType>{
  public readonly state: Readonly<hotSwiperStateType> = {
    uploadLoading: false,
    bid: ''
  }
  public componentWillMount() {
    // console.log('>> props', this.props)
    this.props.dispatch({
      type: 'hotSwiperModel/clearEditParams'
    })
    const bid = this.props.match.params._bid
    bid && this.getHotSwiperById(bid)
    this.setState({
      bid
    })
  }
  public goBack: ()=> void = () => {
   this.props.history.push('/main/hotSwiperlist')
  }
  public getHotSwiperById(hotId: string) {
    this.props.dispatch({
      type: 'hotSwiperModel/getHotSwiperById',
      payload: {hotId}
    })
  }
  public handChangeHotSwiperForm: (value: any) => void = (value) => {
    // console.log('>> change value', value)
    const {dispatch} = this.props
    dispatch({
      type: 'hotSwiperModel/changeEditParams',
      payload: value
    })
  }
  public handleSubmit: (params: hotSwiperAddParamsType) => void = (params) => {
    const {dispatch} = this.props
    const {bid} = this.state
    dispatch({
      type: bid? 'hotSwiperModel/updateHotSwiper' :'hotSwiperModel/addHotSwiper',
      payload: Object.assign({hotId: bid}, params) ,
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
      let hotImg = ''
      if(res.code === 200 ){
        message.success('～～ 图片上传成功！！')
        hotImg = res.data.url
      }else {
        message.error('~~ 服务器异常, 请稍后再试！！')
      }
      this.setState({
        uploadLoading: false
      })
      this.props.dispatch({
        type: 'hotSwiperModel/changeEditParams',
        payload: {
          hotImg          
        }
      })
    }
  }
  render (): React.ReactNode {
    return (<div className={style.editWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        {...this.props.hotSwiperModel.editParams}
        bid = {this.state.bid}
        goBack = {this.goBack}
        addLoading = {this.props.hotSwiperModel.addLoading}
        uploadLoading = {this.state.uploadLoading}
        handChangeHotSwiperForm = {this.handChangeHotSwiperForm}
        handleUplodChange={ this.handleUplodChange }
        handleSubmit = { this.handleSubmit }
      ></CEditForm>
    </div>)
  }
}

export default connect(({hotSwiperModel}: connectSate) => ({
  hotSwiperModel
}))(HotSwiperEdit)
