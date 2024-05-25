/*
* 快速开始：有现成main.js模板
* https://element-plus.org/zh-CN/guide/quickstart.html
*
* */
import {createApp} from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from "@/router/index.js";
import {createPinia} from "pinia";
import {createPersistedState} from "pinia-persistedstate-plugin";
import locale from 'element-plus/dist/locale/zh-cn.js'

const app = createApp(App)

let pinia = createPinia();
let persistedState = createPersistedState();
pinia.use(persistedState)
app.use(pinia)
app.use(router)
app.use(ElementPlus, {locale})
app.mount('#app')