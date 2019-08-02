
import React from 'react';
import { Button, Result } from 'antd';
import { connect } from 'dva';
import { connectSate } from '../models/connect';

interface Istate {

}

class NoPage extends React.Component<any, Istate> {
  public readonly state: Readonly<Istate> = {
    
  }
  public goHome = () => {
    this.props.history.push({pathname: this.props.globalData.indexPath})
  }
  public render(): React.ReactNode {
    return(<Result
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      extra={<Button type="primary">Back Home</Button>}
    />)
  }
}

export default connect(({globalData}: connectSate)=>({
  globalData 
}))(NoPage);