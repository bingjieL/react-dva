import React from 'react';
import { connect } from 'dva';
import { Button, Table, Popconfirm } from 'antd';
import { connectSate } from '../../models/connect';
import style from './list.less'

// table component
const ListTable: React.FC<any> = (props) => {
  const { tableColumns, listData, loading} = props
  return(<>
      <Table loading={loading} columns={tableColumns} dataSource={listData} />
    </>)
}


// state Type
interface Istate {
  tableColumns : Array<any>
}

class BannerList extends React.Component<any, Istate>{
  public readonly state: Readonly<Istate> = {
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
      render: (text: string) => (<img src={text} alt='banner' style={{width: "100px"}}></img>)
    },{
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.bannerId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d', cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.bannerId)}></Button>
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
  public goEdit  = (bannerId?: string): void =>{
    const pathname = bannerId ? `/main/bannerEdit/${bannerId}` : '/main/bannerAdd'
    this.props.history.push({
      pathname,
    })
  }
  public handleDelete = (bannerId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'bannerModel/deleteBanner',
      payload: {
        bannerId
      }
    })
  }
  render(): React.ReactNode {
    return (<div className={style.listWrap}>
      {/* 头部操作条 */}
      <header className={style.header}>
        <div className={style.left}></div>
        <div className={style.right}>
          <Button type="primary" onClick={() => this.goEdit()}>添加</Button>
        </div>
      </header>
      {/* 表格列表 */}
      <div className="main">
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
