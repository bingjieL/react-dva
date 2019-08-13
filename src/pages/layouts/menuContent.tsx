import React from 'react';
import { connect } from 'dva';
import { Menu, Icon, Switch} from 'antd';
import * as style from './menuContent.less'
import { connectSate } from 'models/connect';
import Logo from 'assets/images/logo.png'
import { Link } from 'dva/router';

const SubMenu = Menu.SubMenu;

interface Istate {
  theme: "light" | "dark" | undefined
}

class MenuContent extends React.Component<any,Istate> {
  public readonly state: Readonly<Istate> = {
    theme: 'dark'
  }
  public toggleCollapsed = (): void => {
    this.props.dispatch({type: 'globalData/dealFold', payload:{} })
  }
  public handleChangeTheme = (theme: boolean) => {
    this.setState({
      theme: theme ? 'dark' : 'light',
    });
  }
  render() {
    const {dataSource} = this.props
    // console.log('---> chilrenopenkey', this.props.defaultOpenKeys)
    return (
      <div className={style.menu}>
        <div className={ this.state.theme === 'light'? style.titleLight : style.titleDark}>
          {
            this.props.globalData.collapsed?(
              <h3>JAY</h3> 
            ):(<>
              <img className= {style.titleLogo} src={Logo} alt="logo"/>
              <h3>JAY</h3>
            </>)
          } 
        </div>
        <div
          onClick={this.toggleCollapsed} 
          className={style.foldBtn}>
          <Icon type={this.props.globalData.collapsed ? 'menu-unfold' : 'menu-fold'} />
        </div>
        <div className = {style.switch}>
          <div className = {style.swichTitle}> 切换主题 </div>
          <Switch
            checked={this.state.theme === 'dark'}
            onChange={this.handleChangeTheme}
            checkedChildren="Dark"
            unCheckedChildren="Light"
          />
        </div>
        <Menu
          openKeys = {this.props.defaultOpenKeys}
          selectedKeys={[this.props.defaultSelectedKeys]}
          mode="inline"
          onOpenChange={this.props.handleOpenChange}
          theme={this.state.theme}
          inlineCollapsed={this.props.globalData.collapsed}>
          {
            dataSource.map((item: any, index: number) => 
              item.routes ? 
              <SubMenu key={item.key} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>}>
                {
                  item.routes.map((subitem: any, subindex: number) => 
                    <Menu.Item key={subitem.key}><Link to={subitem.path}>{subitem.name}</Link></Menu.Item>
                  )
                }
              </SubMenu>:
              <Menu.Item key={item.key}>
                <Link to={item.path}>
                  <Icon type={item.icon} /><span>{item.name}</span> 
                </Link>
              </Menu.Item>
            )
          }
        </Menu>
        
      </div>
    )
  }
}


export default connect(({ globalData}: connectSate) => {
  return {
    globalData
  }
})(MenuContent);