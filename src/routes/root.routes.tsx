import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import {LocaleProvider} from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import Entry from './index';


moment.locale('zh-cn');

const RouterConfig = ({ history }: any): React.ReactNode => {
  
  return (
    <Router history={history}>
      <LocaleProvider locale={zh_CN}>
        <Switch>
          <Route  path="/" component={ Entry }/>
        </Switch>
      </LocaleProvider>
    </Router>
  );
}
 
export default RouterConfig