import BannerList  from 'pages/banner/list'
import BannerEdit  from 'pages/banner/edit'
import BlogList from 'pages/blog/list'
import BlogEdit from 'pages/blog/edit'
import BookList from 'pages/book/list'
import BookEdit from 'pages/book/edit'
import hotSwiperList from 'pages/hotSwiper/list'
import hotSwiperEdit from 'pages/hotSwiper/edit'
import musicSheetList from 'pages/musicSheet/list'
import musicSheetEdit from 'pages/musicSheet/edit'
import blogTypeList from 'pages/blogType/list'
import blogTypeEdit from 'pages/blogType/edit'


export interface RouteType {
  path: string,
  component: any,
  name: string,
  key: string,
  parentKey?: string,
  hidden?: boolean
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
  name: 'banner配置',
  title: 'banner配置',
  icon: 'picture',
  path: '/main/bannerlist',
  key: '01',
  authority:[2,3],
  routes:[{
    key: '011',
    name: 'banner 列表',
    path: '/main/bannerlist',
    component: BannerList,
  },{
    key: '012',
    name: 'banner 添加',
    path:'/main/bannerAdd',
    component: BannerEdit,
  },{
    key: '013',
    name: 'banner 编辑',
    path:'/main/bannerEdit/:_bid',
    component: BannerEdit,
    hidden: true
  },]
},{
  name: '博客列表',
  title: '博客列表',
  icon: 'form',
  path: '/main/bloglist',
  key: '02',
  authority:[2,3],
  routes:[{
    key: '021',
    name: '博客列表',
    path: '/main/bloglist',
    component: BlogList,
  },{
    key: '022',
    name: '博客添加',
    path:'/main/blogAdd',
    component: BlogEdit,
  },{
    key: '023',
    name: '博客编辑',
    path:'/main/blogEdit/:_bid',
    component: BlogEdit,
    hidden: true,
  },]
},{
  name: '书籍列表',
  title: '书籍列表',
  icon: 'book',
  path: '/main/booklist',
  key: '03',
  authority:[2,3],
  routes:[{
    key: '031',
    name: '书籍列表',
    path: '/main/booklist',
    component: BookList,
  },{
    key: '032',
    name: '书籍添加',
    path:'/main/bookAdd',
    component: BookEdit,
  },{
    key: '033',
    name: '书籍编辑',
    path:'/main/bookEdit/:_bid',
    component: BookEdit,
    hidden: true,
  },]
},{
  name: '首页轮播',
  title: '首页轮播',
  icon: 'file-image',
  path: '/main/hotSwiperlist',
  key: '04',
  authority:[2,3],
  routes:[{
    key: '041',
    name: '轮播列表',
    path: '/main/hotSwiperlist',
    component: hotSwiperList,
  },{
    key: '042',
    name: '轮播添加',
    path:'/main/hotSwiperAdd',
    component: hotSwiperEdit,
  },{
    key: '043',
    name: '轮播编辑',
    path:'/main/hotSwiperEdit/:_bid',
    component: hotSwiperEdit,
    hidden: true,
  },]
},{
  name: '音乐列表',
  title: '音乐列表',
  icon: 'medium',
  path: '/main/musicSheetlist',
  key: '05',
  authority:[2,3],
  routes:[{
    key: '051',
    name: '歌单列表',
    path: '/main/musicSheetlist',
    component: musicSheetList,
  },{
    key: '052',
    name: '歌单添加',
    path:'/main/musicSheetAdd',
    component: musicSheetEdit,
  },{
    key: '053',
    name: '歌单编辑',
    path:'/main/musicSheetEdit/:_bid',
    component: musicSheetEdit,
    hidden: true,
  },]
},{
  name: '博客类型',
  title: '博客类型',
  icon: 'setting',
  path: '/main/musicSheetlist',
  key: '06',
  authority:[2,3],
  routes:[{
    key: '061',
    name: 'Blog List',
    path: '/main/blogTypelist',
    component: blogTypeList,
  },{
    key: '062',
    name: 'Blog Add',
    path:'/main/blogTypeAdd',
    component: blogTypeEdit,
  },{
    key: '063',
    name: 'Blog Edit',
    path:'/main/blogTypeEdit/:_bid',
    component: blogTypeEdit,
    hidden: true,
  },]
},]


