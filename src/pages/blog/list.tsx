import React from 'react';
import { connect } from 'dva';
import { connectSate } from '../../models/connect';
import { Button, Popconfirm, Table, Tag} from 'antd'
import style from './list.less'


const ListTable: React.FC<any> = (props) => {
  const { tableColumns, listData, loading, handleTableChange, pagination} = props
  return(<>
      <Table loading={loading} pagination = {pagination} onChange={handleTableChange}  columns={tableColumns} dataSource={listData.rows} />
    </>)
}

interface blogListStateType {
  tableColumns: Array<any>
}

class BlogList extends React.Component<any, blogListStateType>{
  public readonly state: Readonly<blogListStateType> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'updated_time',
      key: 'updated_time',
      width: 120,
      render: (text: string) => {
        return <span>{text.substring(0, 10)}</span> 
      }
    },{
      title: 'id',
      dataIndex: 'blogId',
      key: 'blogId'
    },{
      title: '状态',
      dataIndex: 'blogStatus',
      key: 'blogStatus',
      render:(text: number) => {
        return text === 1? (<Tag color="volcano">已发布</Tag>) : (<Tag color="cyan">已下架</Tag>)
      }
    },{
      title: '标题',
      dataIndex: 'blogTitle',
      width: 200,
      key: 'blogTitle'
    },{
      title: '类别',
      dataIndex: 'blog_type',
      key: 'blog_type',
      render:(_:any) => <span>{_.blogTypeTitle}</span>
    },{
      title: '热度',
      dataIndex: 'blogHot',
      key: 'blogHot'
    },{
      title: '简介',
      dataIndex: 'blogDes',
      key: 'blogDes'
    },{
      title: '操作',
      dataIndex: 'action',
      width: 200,
      render: (_: any, record:any) => {
        return (<>
          {
            record.blogStatus === 1 ? (
              <Button type="link" onClick= {()=> this.changeblogStatus(record.blogId, 2)}> 下架 </Button>
            ) : (
              <Button type="link" onClick= {()=> this.changeblogStatus(record.blogId, 1)}> 发布 </Button>
            )
          }
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.blogId)}></Button>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.blogId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d',cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
        </>)
      }
    }]
  }
  public goEdit = (blogId?: string) => {
    this.props.history.push({
      pathname: blogId ?`/main/blogEdit/${blogId}` : '/main/blogAdd'
    })
  }
  public changeblogStatus = (blogId: string, blogStatus: number) => {
    const { dispatch } = this.props
    dispatch({
      type: 'blogModel/changeBlogStatus',
      payload: {
        blogId,
        blogStatus
      }
    })
  }
  public handleDelete = (blogId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'blogModel/deleteBlog',
      payload: {
        blogId
      }
    })
  }
  public handleTableChange = (pagination: any) => {
    this.props.dispatch({
      type:'blogModel/changePageSize',
      payload: {pageNumber: pagination.current}
    })
    this.props.dispatch({
      type:'blogModel/getBlogList'
    })
  }
  public componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: 'blogModel/getBlogList'
    })
  }
  render(): React.ReactNode{
    const pagination = {
      total: this.props.blogModel.listData.count,
      pageSize: this.props.blogModel.searchParams.pageSize,
      current: this.props.blogModel.searchParams.pageNumber
    }
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
        pagination = {pagination}
        handleTableChange = {this.handleTableChange}
        listData = {this.props.blogModel.listData}
        loading = {this.props.blogModel.listLoading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}

export default connect(({globalData, blogModel}: connectSate) => ({
  globalData,
  blogModel,
}))(BlogList)