import "babel-polyfill";
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import dva from 'dva'
import '@/assets/less/variable.less';
import '@/assets/less/mixin.less';

import registerModels from './models';
import router from 'routes/root.routes';
import * as serviceWorker from './serviceWorker';
// 1. 初始化
const app = dva({
    initialState: {},
    onError(e){
        console.log('dva_onError', e);// eslint-disable-line
    }
})

// 3. 注册数据模型Model
registerModels(app);

// 4. 注册路由Router
app.router(router);

// 5. start 
app.start('#root')

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.

serviceWorker.unregister();
