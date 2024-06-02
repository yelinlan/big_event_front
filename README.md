# big_event
链接: https://pan.baidu.com/s/1ay2m8MIVGMATYfpMvilE7g 提取码: 3vgf 复制这段内容后打开百度网盘手机App，操作更方便哦
vue项目建立(人生苦短，我用webstorm。)
```
npm init  vue@latest
```

加入依赖
```
npm install element-plus --save         #饿了么UI 
npm install axios                       #类似hutool的HttpUtils 就一请求工具
npm install pinia                       #状态管理工具 用来放Token userInfo
npm install pinia-persistedstate-plugin #持久化pinia数据
npm install vue-router@4                #安装路由进行页面跳转


```
vue的富文本编辑器
```angular2html
vue-quill 
```

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```
项目结构
```
├─api               #业务请求接口
├─assets            #资源图片
├─components        
├─router            #路由
├─stores            #状态管理（就类似放到临时变量里，可以持久化）
├─utils             #axios请求返回封装（包含请求拦截器和响应拦截器）
└─views             #页面
    ├─article
    └─user
```
vite.config.js
```
包含
代理：用来开发阶段解决跨域
路径别名映射： .src =====> @
```
### 不包含
```
跨页面信息传递：父子通信
打包部署
nginx反向代理
```
