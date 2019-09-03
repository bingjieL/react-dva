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

class BlogTypeList extends React.Component<any, Istate>{
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
      dataIndex: 'blogTypeId',
      key: 'blogTypeId'
    }, {
      title: '标题',
      dataIndex: 'blogTypeTitle',
      key: 'blogTypeTitle'
    }, {
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.blogTypeId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d', cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.blogTypeId)}></Button>
        </>)
      }
    }]
  }
  public UNSAFE_componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'blogTypeModel/getBlogTypeList',
      payload: this.props.blogTypeModel.params
    })
  }
  public goEdit  = (blogTypeId?: string): void =>{
    const pathname = blogTypeId ? `/main/blogTypeEdit/${blogTypeId}` : '/main/blogTypeAdd'
    this.props.history.push({
      pathname,
    })
  }
  public handleDelete = (blogTypeId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'blogTypeModel/deleteBlogType',
      payload: {
        blogTypeId
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
        listData = {this.props.blogTypeModel.listData}
        loading = {this.props.blogTypeModel.loading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}

export default connect(({globalData, blogTypeModel}: connectSate) => ({
  globalData,
  blogTypeModel
}))(BlogTypeList)
