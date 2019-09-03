import React from 'react'
import { connect } from 'dva';
import { connectSate } from '../../models/connect';
import { Table, Popconfirm, Button } from 'antd'

// style 
import style from './list.less'

// table component
const ListTable: React.FC<any> = (props) => {
  const { tableColumns, listData, listLoading} = props
  return(<>
      <Table loading={listLoading} columns={tableColumns} dataSource={listData} />
    </>)
}


export interface hotSwiperStateType {
  tableColumns: any[]
}

class HotSwiperList extends React.Component<any, hotSwiperStateType> {
  public readonly state: Readonly<hotSwiperStateType> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'updated_time',
      key: 'updated_time',
      render: (text: string) => {
        return <span>{text.substring(0, 10)}</span> 
      }
    }, {
      title: 'id',
      dataIndex: 'hotId',
      key: 'hotId'
    },{
      title: '标题',
      dataIndex: 'hotTitle',
      key: 'hotTitle'
    }, {
      title: '图片预览',
      dataIndex: 'hotImg',
      key: 'hotImg',
      render: (text: string) => (<img src={text} alt='hotSwiper' style={{width: "100px"}}></img>)
    },{
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.hotId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d', cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.hotId)}></Button>
        </>)
      }
    }]
  }
  public UNSAFE_componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'hotSwiperModel/getHotSwiperList'
    })
  }
  public goEdit  = (hotId?: string): void =>{
    const pathname = hotId ? `/main/hotSwiperEdit/${hotId}` : '/main/hotSwiperAdd'
    this.props.history.push({
      pathname,
    })
  }
  public handleDelete = (hotId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'hotSwiperModel/deleteHotSwiper',
      payload: {
        hotId
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
        listData = {this.props.hotSwiperModel.listData}
        listLoading = {this.props.hotSwiperModel.listLoading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}


export default connect(({hotSwiperModel}: connectSate) => ({
  hotSwiperModel
}))(HotSwiperList)
