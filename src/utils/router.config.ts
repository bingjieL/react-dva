import BannerList  from 'pages/banner/list'
import BannerEdit  from 'pages/banner/edit'
import BlogList from 'pages/blog/list'
import BlogEdit from 'pages/blog/edit'



export interface RouteType {
  path: string,
  component: any,
  name: string,
  key: string,
  parentKey?: string
}

export interface IRouterType<T> {
  name: string,
  title: string,
  icon: string,
  key: string,
  authority: number[],
  path: string,
  routes?: Array<T>,
  component?: any,
}


export const IRouter: IRouterType<RouteType>[] = [{
  name: '首页轮播',
  title: '首页轮播',
  icon: 'picture',
  path: '/main/bannerlist',
  key: '01',
  authority:[2,3],
  routes:[{
    key: '011',
    name: 'banner List',
    path: '/main/bannerlist',
    component: BannerList,
  },{
    key: '012',
    name: 'banner Edit',
    path:'/main/bannerEdit',
    component: BannerEdit,
  },]
},{
  name: '博客列表',
  title: '博客列表',
  icon: 'form',
  path: '/main/blogList',
  key: '02',
  authority:[2,3],
  routes:[{
    key: '021',
    name: 'BlogList',
    path: '/main/blogList',
    component: BlogList,
  },{
    key: '022',
    name: 'BlogEdit',
    path:'/main/blogEdit',
    component: BlogEdit,
  },]
},{ 
  name: '列表3',
  title: '列表3',
  icon: 'dashboard',
  path: '/main/table',
  component: BannerList,
  key: '03',
  authority:[2,3]
}]


