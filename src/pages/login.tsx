import React from 'react';
import { connect } from 'dva';
import style from 'pages/login.less';
import DocumentTitle from 'react-document-title';
import { Form, Icon, Input, Button } from 'antd';
import { connectSate } from '../models/connect';

interface Istate {
  documenttitle: string
}
interface FormProps {
  userName: string, password: string, form?: any,handleLogin:(fieldsValue: any)=>void, handChangeUserMsg:(value: any) => void
}


const LoginForm: React.FC<FormProps> = (props) => {
  const { getFieldDecorator } = props.form;
  const handleLogin: ()=> void = () => {
    props.form.validateFields((err: any, fieldsValue: any) => {
     !err && props.handleLogin(fieldsValue)
    })
  }
  return(<>
    <Form  className="login-form">
      <Form.Item>
        {getFieldDecorator('userName', {
          rules: [{ required: true, message: '请输入账号' }],
        })(
          <Input
            prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
            placeholder="Username"
          />,
        )}
      </Form.Item>
      <Form.Item>
        {getFieldDecorator('password', {
          rules: [{ required: true, message: '请输入密码' }],
        })(
          <Input
            prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
            type="password"
            placeholder="Password"
          />,
        )}
      </Form.Item>
      <Form.Item>
        <Button type="primary" onClick={handleLogin} style={{width: '100%'}}>
          登陆
        </Button>
      </Form.Item>
    </Form>
  </>)
}
 
const CloginForm =  Form.create({ 
  name: 'Login',
  onFieldsChange(props, changedFields) {
    // console.log(changedFields)
  },
  mapPropsToFields(props: any) {
    return {
      userName: Form.createFormField({
        value: props.userName
      }),
      password: Form.createFormField({
        value: props.password
      })
    }
  },
  onValuesChange(props: any, value) {
    props.handChangeUserMsg(value) 
  }
})(LoginForm)

class Login extends React.Component<any, Istate> {
  public readonly state: Readonly<Istate>= {
    documenttitle: '登陆-JAY-CMS'
  }
  public handleLogin = (fieldsValue: any):void => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/apiLogin',
      payload: fieldsValue
    })
  }
  public handChangeUserMsg = (value: any): void => {
    console.log('---> value', value)
    const { dispatch } = this.props
    dispatch({
      type: 'user/changeUserMsg',
      payload: value
    })
  }
  render(): React.ReactNode {

    return (<DocumentTitle title={this.state.documenttitle}>
      <section className={style.loginWrap}>
        <div className={style.login}>
          <header className={style.header}>
            <Icon type="login" /> <span> 欢迎登陆</span>
          </header>
          <div className={style.form}>
            <CloginForm
              {...this.props.userMsg}
              handleLogin = {this.handleLogin}
              handChangeUserMsg = {this.handChangeUserMsg}
            ></CloginForm>
          </div>
        </div>
      </section>
    </DocumentTitle>
    )
  }
}


export default connect(({user}: connectSate)=>({
  userData: user.userData,
  userMsg: user.userMsg
}))(Login) 