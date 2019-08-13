import React from 'react';
import { connect } from 'dva';
import { Switch ,Route, Redirect} from 'dva/router';
import { Menu, Dropdown, Modal } from 'antd';
import { connectSate } from 'models/connect';
import DocumentTitle from 'react-document-title';
import style from './index.less';
import MenuContent from '@/pages/layouts/menuContent.tsx'
import { IRouter, IRouterType, RouteType } from 'utils/router.config';
import HeaderImg from 'assets/images/header.jpeg';
import Nopermission from 'pages/403'
import NoPage from 'pages/404'

const { confirm } = Modal;

const MyHeader: React.FC<any> = props=> {
  const {userMenuData, userData ,go} = props
  const handleGo = (value: any) => {
    const { key } = value
    switch (key) {
      case "loginOut":
        confirm({
          title: '登出提示',
          content: '点击确认将退出登陆！',
          onOk: ()=> {
            go('/login')
          }
        });
        break;
      default:
        break;
    }
  }
  const Menus: React.ReactNode = (
    <Menu onClick={handleGo}>
      {
        userMenuData.map((item: userMenuDataType) => (
          <Menu.Item key={item.key}>{item.title}</Menu.Item>
        ))
      }
    </Menu>
  )
  return(
    <>
      <div className={style.headerLeft}></div>
      <div className={style.headerRight}>
        <Dropdown overlay={Menus} placement="bottomRight">
          <div className={style.userWrap}>
           <figure className={style.userImg}>
            <img src={HeaderImg} alt='头像'/>
           </figure>
           <h3 className={style.userTitle}>{userData.title}</h3>
          </div>
        </Dropdown>
      </div>
    </>
  )
}


interface IState {
  title: string,
  IRouter: IRouterType<RouteType>[],
  defaultOpenKeys: string[],
  width: string,
  smalWidth: string,
  userMenuData: userMenuDataType[]
}

interface userMenuDataType {
  title: string,
  key: string
}

class Layout extends React.Component<any, IState> {
  public routes: RouteType[] = []
  public readonly state: Readonly<IState> = {
    title: '我是主页面',
    IRouter,
    defaultOpenKeys: [],
    width: '220px',
    smalWidth: '80px',
    userMenuData: [{
      title: '退出登陆',
      key: 'loginOut'
    }, {
      title: '修改密码',
      key: 'changePw'
    }]
  }
  public componentWillMount() {
    this.getRenderRoute()  
    const speRoute = this.getSpeRoute()
    const defaultOpenKeys =  [speRoute.parentKey?speRoute.parentKey:'']
    this.handleOpenChange(defaultOpenKeys, true)
  }

  public handleGo = (pathName: string):void => {
    this.props.history.push(pathName)
  }
  public getRenderRoute = ()=> {
    const routes = this.state.IRouter.reduce((pre: RouteType[], next:IRouterType<RouteType> )=>{
      if (next.routes && next.routes.length > 0) {
        next.routes.forEach((item:RouteType)=>{
          pre.push(Object.assign({parentKey: next.key,key:item.key}, item))
        })
      }else {
        const { path, component, name, key} = next
        pre.push({path, component, name, parentKey: key,key: key})
      }
      return pre
    },[]);
    this.routes = routes.flat()
  }
  
  public getSpeRoute = () => {
    const pathName = this.props.location.pathname
    const speRoute = this.routes.filter(route =>route.path === pathName)[0]
    return speRoute
  }
  public handleOpenChange =  (openKeys: string[], load: boolean) => {
    const lastOpenKey = openKeys.find(key => this.state.defaultOpenKeys.indexOf(key) === -1)
    this.setState({
      defaultOpenKeys:  load ? openKeys : (lastOpenKey? [lastOpenKey] : [])  
    })
  }


  render(): React.ReactNode {    
    const speRoute = this.getSpeRoute()
    const defaultSelectedKeys = speRoute && speRoute.key 
    return (
      <DocumentTitle title={this.state.title}>
        <div className={style.indexWrap}>
          {/* 侧边栏 导航 */}
          <aside className={style.aside} style={{width: this.props.globalData.collapsed ? this.state.smalWidth : this.state.width}}>
            <MenuContent
              smalWidth = {this.state.smalWidth}
              width = {this.state.width}
              dataSource = {this.state.IRouter}
              handleOpenChange = {this.handleOpenChange}
              defaultOpenKeys = {this.state.defaultOpenKeys}
              defaultSelectedKeys = {defaultSelectedKeys}
            />
          </aside>
          {/* 主要内容 */}
          <div className={style.main}>
              <header className={style.header}>
                <MyHeader 
                  userMenuData={this.state.userMenuData} 
                  go={this.handleGo} 
                  userData = {this.props.userData}>
                </MyHeader>
              </header>
              <main className={style.routeMain}>
                <Switch>
                  {this.routes.map((item) =>
                    <Route exact path={item.path} key={item.path} component={item.component}/>
                  )}
                  {
                    !this.props.userData.isLogin && <Redirect to='/login' />
                  }
                  <Route  path="/403" component={ Nopermission } />
                  <Route  path="/404" component={ NoPage } />
                  <Route  path="*" component={ NoPage } />
                </Switch>
              </main>
          </div>
        </div>
        
      </DocumentTitle>
    )
  }
}


  export default connect(({ globalData, user }: connectSate) => ({
    globalData,
    userData: user.userData
  }))(Layout)