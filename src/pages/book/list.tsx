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


export interface bookStateType {
  tableColumns: any[]
}

class BookList extends React.Component<any, bookStateType> {
  public readonly state: Readonly<bookStateType> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'updated_time',
      key: 'updated_time',
      render: (text: string) => {
        return <span>{text.substring(0, 10)}</span> 
      }
    }, {
      title: 'id',
      dataIndex: 'bookId',
      key: 'bookId'
    }, {
      title: '书籍作者',
      dataIndex: 'bookAuthor',
      key: 'bookAuthor'
    }, {
      title: '标题',
      dataIndex: 'bookTitle',
      key: 'bookTitle'
    }, {
      title: '图片预览',
      dataIndex: 'bookPic',
      key: 'bookPic',
      render: (text: string) => (<img src={text} alt='book' style={{width: "100px"}}></img>)
    },{
      title: '操作',
      dataIndex: 'action',
      render: (_: any, record:any) => {
        return (<>
          <Popconfirm title="确认删除本条数据吗？" onConfirm = {()=> this.handleDelete(record.bookId)} okText="Yes" cancelText="No">
            <span style={{color: '#f5222d', cursor: 'pointer'}}>Delete</span>
          </Popconfirm>
          <Button icon="edit" type="link" onClick= {()=> this.goEdit(record.bookId)}></Button>
        </>)
      }
    }]
  }
  public componentDidMount() {
    const {dispatch} = this.props
    dispatch({
      type: 'bookModel/getBookList'
    })
  }
  public goEdit  = (bookId?: string): void =>{
    const pathname = bookId ? `/main/bookEdit/${bookId}` : '/main/bookAdd'
    this.props.history.push({
      pathname,
    })
  }
  public handleDelete = (bookId: string) => {
    const { dispatch } = this.props
    dispatch({
      type: 'bookModel/deleteBook',
      payload: {
        bookId
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
        listData = {this.props.bookModel.listData}
        listLoading = {this.props.bookModel.listLoading}
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}


export default connect(({bookModel}: connectSate) => ({
  bookModel
}))(BookList)
