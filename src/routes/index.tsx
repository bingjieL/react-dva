import React from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';

import Main from 'pages/layouts/index';
import Login from 'pages/login';
import { connectSate } from '../models/connect';



class RouterConfig extends  React.Component<any, any>{
  public UNSAFE_componentDidMount () {
    // console.log('--->this.props.userData', this.props.userData)
  }
  public UNSAFE_componentWillMount() {
    const { dispatch } = this.props
    let userData = localStorage.getItem('userData')
    // console.log('>>> userData', userData)
    dispatch({
      type: 'userModel/changeUserData',
      payload: userData? JSON.parse(userData): {title: '未登陆', isLogin: false}
    })
  }
  render():React.ReactNode {
    // console.log('>>> this.props.userData', this.props.userData)
    return (
        <>
          <Switch>
            <Route  path="/main" component={ Main }/>
            <Route  path="/login" component={ Login } />
            {
              !this.props.userData.isLogin
              ? <Redirect to='/login'></Redirect>
              : <Redirect to={this.props.indexPath}></Redirect>
              // <Redirect to={this.props.indexPath}></Redirect> :
            }
          </Switch>
        </>
    );
  }
}

export default connect(({userModel, globalData}:connectSate)=>({
  userData: userModel.userData,
  indexPath: globalData.indexPath
}))(RouterConfig)  