import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Upload, message, Icon, Row, Col } from 'antd'
import { connectSate } from '../../models/connect';
import { uploadImgUrl } from 'server/urlconfig'

import style from './edit.less';

// header
const Header: React.FC<any> = (props) => {
  return(<header className={style.headerWrap}>
    <h3 className={style.left}>{props.bid? 'banner Edit' : 'banner Add'} </h3>
  </header>)
}
// banner edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleUplodChange, bannerImg, uploadLoading, handleSubmit, addLoading, bid, goBack } = props
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
      console.log(err,fieldValue)
      !err && handleSubmit(fieldValue)
    })
  }

  const uploadButton = (
    <div>
      <Icon type={uploadLoading ? 'loading' : 'plus'} />
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return(<Form {...formItemLayout} className={style.bannerMainWrap}>
    <Form.Item label="Banner Title">
      {getFieldDecorator('bannerTitle', {
        rules: [{
          required: true,
          message: '请填写banner title',
        },],
      })(<Input />)} 
    </Form.Item>
    <Form.Item label="Banner Img">
      {getFieldDecorator('bannerImg', {
        getValueFromEvent:(file: any) => {
          const res = file.fileList[0].response
          if(res && res.code === 200) return res.data.url
        },
        rules: [{
          required: true,
          message: '请上传banner 图片',
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
        {bannerImg ? <img src={bannerImg} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
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
    {/* </Form.Item> */}
  </Form>)
}
const CEditForm = Form.create({
  name: 'bannerFrom',
  mapPropsToFields(props: any) {
    return{
      bannerTitle: Form.createFormField({
        value: props.bannerTitle
      }),
      bannerImg: Form.createFormField({
        value: props.bannerImg
      })
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeBannerForm(value) 
  }
})(EditForm)


interface bannerAddParamsType {
  bannerImg: string,
  bannerTitle: string
}
interface bannerStateType {
  uploadLoading: boolean,
  bid: string
}
class BannerEdit extends React.Component<any, bannerStateType>{
  public readonly state: Readonly<bannerStateType> = {
    uploadLoading: false,
    bid: ''
  }
  public componentWillMount() {
    // console.log('>> props', this.props)
    this.props.dispatch({
      type: 'bannerModel/clearEditParams'
    })
    const bid = this.props.match.params._bid
    bid && this.getBannerById(bid)
    this.setState({
      bid
    })
  }
  public goBack: ()=> void = () => {
   this.props.history.push('/main/bannerlist')
  }
  public getBannerById(bannerId: string) {
    this.props.dispatch({
      type: 'bannerModel/getBannerById',
      payload: {bannerId}
    })
  }
  public handChangeBannerForm: (value: any) => void = (value) => {
    // console.log('>> change value', value)
    const {dispatch} = this.props
    dispatch({
      type: 'bannerModel/changeEditParams',
      payload: value
    })
  }
  public handleSubmit: (params: bannerAddParamsType) => void = (params) => {
    const {dispatch} = this.props
    const {bid} = this.state
    dispatch({
      type: bid? 'bannerModel/editBanner' :'bannerModel/addBanner',
      payload: Object.assign({bannerId: bid}, params) ,
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
      let bannerImg = ''
      if(res.code === 200 ){
        message.success('～～ 图片上传成功！！')
        bannerImg = res.data.url
      }else {
        message.error('~~ 服务器异常, 请稍后再试！！')
      }
      this.setState({
        uploadLoading: false
      })
      this.props.dispatch({
        type: 'bannerModel/changeEditParams',
        payload: {
          bannerImg          
        }
      })
    }
  }
  render (): React.ReactNode {
    return (<div className={style.editWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        bid = {this.state.bid}
        goBack = {this.goBack}
        addLoading = {this.props.bannerModel.addLoading}
        uploadLoading = {this.state.uploadLoading}
        bannerImg = { this.props.bannerModel.editParams.bannerImg }
        bannerTitle = { this.props.bannerModel.editParams.bannerTitle}
        handChangeBannerForm = {this.handChangeBannerForm}
        handleUplodChange={ this.handleUplodChange }
        handleSubmit = { this.handleSubmit }
      ></CEditForm>
    </div>)
  }
}

export default connect(({globalData, bannerModel, }: connectSate) => ({
  globalData,
  bannerModel
}))(BannerEdit)