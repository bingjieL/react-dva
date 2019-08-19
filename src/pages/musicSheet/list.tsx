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


export interface musicSheetStateType {
  tableColumns: any[]
}

class MusicSheetList extends React.Component<any, musicSheetStateType> {
  public readonly state: Readonly<musicSheetStateType> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'updated_time',
      key: 'updated_time',
      render: (text: string) => {
        return <span>{text.substring(0, 10)}</span> 
      }
    }, {
      title: 'id',
      dataIndex: 'sheetId',
      key: 'sheetId'
    }, {
      title: '歌单描述',
      dataIndex: 'sheetDes',
      key: 'sheetDes'
    },{
      title: '歌单链接',
      dataIndex: 'sheetUrl',
      key: 'sheetUrl',
      render: (text: string) => <a href={text} target="_blank" rel="noopener noreferrer">预览歌单</a>
    }, {
      title: '标题',
      dataIndex: 'sheetTitle',
      key: 'sheetTitle'
    }, {
      title: '图片预览',
      dataIndex: 'sheetImg',
      key: 'sheetImg',
      render: (text: string) => (<img src={text} alt='musicSheet' style={{width: "100px"}}></img>)
    },{
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.sheetId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d', cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.sheetId)}></Button>
        </>)
      }
    }]
  }
  public componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'musicSheetModel/getMusicSheetList'
    })
  }
  public goEdit  = (sheetId?: string): void =>{
    const pathname = sheetId ? `/main/musicSheetEdit/${sheetId}` : '/main/musicSheetAdd'
    this.props.history.push({
      pathname,
    })
  }
  public handleDelete = (sheetId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'musicSheetModel/deleteMusicSheet',
      payload: {
        sheetId
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
        listData = {this.props.musicSheetModel.listData}
        listLoading = {this.props.musicSheetModel.listLoading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}


export default connect(({musicSheetModel}: connectSate) => ({
  musicSheetModel
}))(MusicSheetList)
