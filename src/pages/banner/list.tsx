import React from 'react';
import { connect } from 'dva';
import { Button, Table } from 'antd';
import { connectSate } from '../../models/connect';
import style from './list.less'


const ListTable: React.FC<any> = (props) => {
  const { tableColumns, listData} = props
  return(<>
      <Table columns={tableColumns} dataSource={listData} />
    </>)
}

interface Istate {
  tableColumns : Array<any>
}

class BannerList extends React.Component<Istate, any>{
  public readonly state: Readonly<any> = {
    tableColumns:[{
      title: '日期',
      dataIndex: 'date',
      key: 'date'
    }, {
      title: 'id',
      dataIndex: 'id',
      key: 'id'
    }]
  }
  render(): React.ReactNode {
    return (<div>
      <header className={style.header}>
        <div className={style.left}></div>
        <div className={style.right}>
          <Button type="primary">添加</Button>
        </div>
      </header>
      <div className="main">
        {/* 表格列表 */}
        <ListTable 
        tableColumns={this.state.tableColumns}></ListTable>
      </div>
    </div>)
  }
}

export default connect(({globalData, bannerModel}: connectSate) => ({
  globalData,
  bannerModel
}))(BannerList)
