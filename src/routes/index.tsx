import React from 'react';
import { Route, Switch, Redirect } from 'dva/router';
import { connect } from 'dva';

import Main from 'pages/layouts/index';
import Login from 'pages/login';
import { connectSate } from '../models/connect';



class RouterConfig extends  React.Component<any, any>{
  public componentDidMount () {
    // console.log('--->this.props.userData', this.props.userData)
  }
  public componentWillMount() {
    const { dispatch } = this.props
    let userData = localStorage.getItem('bj_blog_userData')
    console.log('>>> userData', userData)
    dispatch({
      type: 'userModel/changeUserData',
      payload: userData? JSON.parse(userData): {title: '未登陆', isLogin: false}
    })
  }
  render():React.ReactNode {
    return (
        <>
          <Switch>
            <Route  path="/main" component={ Main }/>
            <Route  path="/login" component={ Login } />
          </Switch>
        </>
    );
  }
}

export default connect(({userModel, globalData}:connectSate)=>({
  userData: userModel.userData,
  indexPath: globalData.indexPath
}))(RouterConfig)  