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
    dispatch({
      type: 'user/getUserLocal'
    })
  }
  render():React.ReactNode {
    return (
        <>
          <Switch>
            <Route  path="/main" component={ Main }/>
            <Route  path="/login" component={ Login } />
            {
              !this.props.userData.isLogin && <Redirect to='/login'></Redirect>
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