import React from 'react';
// react 提供专门为服务端渲染设计的router
import { StaticRouter } from 'react-router-dom';
import { Provider, useStaticRendering } from 'mobx-react';
import App from './views/App';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider } from 'material-ui/styles';
import { createStoreMap } from './store/store';

// 使用静态渲染
// 让mobx在服务端渲染的时候不会重复数据变换
// mobx是一个active的框架，每一次数据变换会造成其他方法的调用
// 比如computed里面的方法，服务端渲染的时候,正常使用客户端代码做的时候，
// 会出现一个bug，他的一次渲染会导致 computed 会执行相当多的次数，如果更改的变量比较多，
// 会造成重复引用，重复调用的问题,可能会导致内存溢出
useStaticRendering(true);

export default (stores, routerContext, sheetsRegistry, generateClassName, theme, url) => (
    // Provider的store在服务端渲染的时候重新生成
    // 服务端渲染的时候会有不同的请求进来，我们不可能在不同请求时使用同一个store
    // 一个store第一次请求的时候可能初始化一些数据了，而第二次请求的时候又初始化另一份数据
    // 会造成数据的频繁更改，所以需要重新生成，从外面传入store

    // context 是服务端渲染的时候传给staticRouter的对象，静态渲染的时候对这个对象进行一些操作，返回给我们一些有用的信息
    // localtion 是现在这个请求的url，从外面传入
    <Provider {...stores}>
        <StaticRouter context={routerContext} location={url}>
            <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
                <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
                    <App />
                </MuiThemeProvider>
            </JssProvider>
        </StaticRouter>
    </Provider>
);

export { createStoreMap };
