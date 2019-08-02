import React from 'react';
import { connect } from 'dva';
import { connectSate } from '../../models/connect';

class BannerEdit extends React.Component<any, any>{
  public readonly state: Readonly<any> = {

  }
  render (): React.ReactNode {
    return (<div>
      <h3> banner edit</h3>
    </div>)
  }
}

export default connect(({globalData}: connectSate) => ({
  globalData
}))(BannerEdit)