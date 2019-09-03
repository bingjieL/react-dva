import React from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Row, Col } from 'antd'
import { connectSate } from '../../models/connect';

import style from './edit.less';

// header
const Header: React.FC<any> = (props) => {
  return(<header className={style.headerWrap}>
    <h3 className={style.left}>{props.bid? 'blogType Edit' : 'blogType Add'} </h3>
  </header>)
}
// blogType edit Form
const EditForm: React.FC<any> = (props) => {
  const { handleSubmit, bid, goBack, addLoading } = props
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
  const valiDateForm: ()=> void = ()=> {
    props.form.validateFields((err: any, fieldValue: any) => {
      console.log(err,fieldValue)
      !err && handleSubmit(fieldValue)
    })
  }

  return(<Form {...formItemLayout} className={style.blogTypeMainWrap}>
    <Form.Item label="BlogType Title">
      {getFieldDecorator('blogTypeTitle', {
        rules: [{
          required: true,
          message: '请填写blogType title',
        },],
      })(<Input />)} 
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
  name: 'blogTypeFrom',
  mapPropsToFields(props: any) {
    return{
      blogTypeTitle: Form.createFormField({
        value: props.blogTypeTitle
      })
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeBlogTypeForm(value) 
  }
})(EditForm)


interface blogTypeAddParamsType {
  blogTypeImg: string,
  blogTypeTitle: string
}
interface blogTypeStateType {
  uploadLoading: boolean,
  bid: string
}
class BlogTypeEdit extends React.Component<any, blogTypeStateType>{
  public readonly state: Readonly<blogTypeStateType> = {
    uploadLoading: false,
    bid: ''
  }
  public UNSAFE_componentWillMount() {
    // console.log('>> props', this.props)
    this.props.dispatch({
      type: 'blogTypeModel/clearEditParams'
    })
    const bid = this.props.match.params._bid
    bid && this.getBlogTypeById(bid)
    this.setState({
      bid
    })
  }
  public goBack: ()=> void = () => {
   this.props.history.push('/main/blogTypelist')
  }
  public getBlogTypeById(blogTypeId: string) {
    this.props.dispatch({
      type: 'blogTypeModel/getBlogTypeById',
      payload: {blogTypeId}
    })
  }
  public handChangeBlogTypeForm: (value: any) => void = (value) => {
    // console.log('>> change value', value)
    const {dispatch} = this.props
    dispatch({
      type: 'blogTypeModel/changeEditParams',
      payload: value
    })
  }
  public handleSubmit: (params: blogTypeAddParamsType) => void = (params) => {
    const {dispatch} = this.props
    const {bid} = this.state
    dispatch({
      type: bid? 'blogTypeModel/editBlogType' :'blogTypeModel/addBlogType',
      payload: Object.assign({blogTypeId: bid}, params) ,
      cb: ()=>{
        this.goBack()
      }
    })
  }
  render (): React.ReactNode {
    return (<div className={style.editWrap}>
      <Header bid = {this.state.bid}></Header>
      <CEditForm
        bid = {this.state.bid}
        goBack = {this.goBack}
        addLoading = {this.props.blogTypeModel.addLoading}
        blogTypeTitle = { this.props.blogTypeModel.editParams.blogTypeTitle}
        handChangeBlogTypeForm = {this.handChangeBlogTypeForm}
        handleSubmit = { this.handleSubmit }
      ></CEditForm>
    </div>)
  }
}

export default connect(({globalData, blogTypeModel, }: connectSate) => ({
  globalData,
  blogTypeModel
}))(BlogTypeEdit)