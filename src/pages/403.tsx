
import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'dva';
import { connectSate } from '../models/connect';


interface Istate {

}

class Nopermisson extends React.Component<any, Istate> {
  public readonly state: Readonly<Istate> = {
    
  }
  public goHome = () => {
    this.props.history.push({pathname: this.props.globalData.indexPath})
  }
  public render(): React.ReactNode {
    return(<Result
      status="403"
      title="403"
      subTitle="Sorry, you are not authorized to access this page."
      extra={<Button type="primary" onClick={this.goHome}>Back Home</Button>}
    />)
  }
}
export default connect(({globalData}: connectSate) => ({
  globalData
}))(Nopermisson);