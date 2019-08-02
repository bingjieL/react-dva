import React from 'react';
import { connect } from 'dva';
import { connectSate } from '../../models/connect';

class BlogList extends React.Component<any, any>{
  public readonly state: Readonly<any> = {

  }
  render(): React.ReactNode{
    return (<div>
      <h3>blog List</h3>
    </div>)
  }
}

export default connect(({globalData}: connectSate) => ({
  globalData
}))(BlogList)