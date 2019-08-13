import React from 'react';
import { connect } from 'dva';
import { Button, Table } from 'antd';
import { connectSate } from '../../models/connect';
import style from './list.less'


const ListTable: React.FC<any> = (props) => {
  const { tableColumns, listData, loading} = props
  return(<>
      <Table loading={loading} columns={tableColumns} dataSource={listData} />
    </>)
}

interface Istate {
  tableColumns : Array<any>
}

class BannerList extends React.Component<any, Istate>{
  public readonly state: Readonly<any> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'updated_time',
      key: 'updated_time',
      render: (text: string) => {
        return <span>{text.substring(0, 10)}</span> 
      }
    }, {
      title: 'id',
      dataIndex: 'bannerId',
      key: 'bannerId'
    }, {
      title: '标题',
      dataIndex: 'bannerTitle',
      key: 'bannerTitle'
    }, {
      title: '图片预览',
      dataIndex: 'bannerImg',
      key: 'bannerImg',
      render: (text: string) => (<img src={text} style={{width: "100px"}}></img>)
    },{
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Button icon="delete" type="link"></Button>
          <Button icon="edit" type="link"></Button>
        </>)
      }
    }]
  }
  public componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'bannerModel/getBannerList',
      payload: this.props.bannerModel.params
    })
  }
  public goEdit  = (): void =>{
    
    this.props.history.push({
      pathname: '/main/bannerEdit',
      state: {}
    })
  }
  render(): React.ReactNode {
    return (<div className={style.listWrap}>
      <header className={style.header}>
        <div className={style.left}></div>
        <div className={style.right}>
          <Button type="primary" onClick={this.goEdit}>添加</Button>
        </div>
      </header>
      <div className="main">
        {/* 表格列表 */}
        <ListTable 
        listData = {this.props.bannerModel.listData}
        loading = {this.props.bannerModel.loading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}

export default connect(({globalData, bannerModel}: connectSate) => ({
  globalData,
  bannerModel
}))(BannerList)
