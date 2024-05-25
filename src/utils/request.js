import axios from "axios";
import {ElMessage} from 'element-plus'
import {useTokenStore} from "@/stores/token.js";
// login中导入router的方法,不适用因为这里不是vue 组合式,.而是js;所以只能直接导入
import router from "@/router/index.js";


const baseURL = "/api";
let instance = axios.create({
    baseURL: baseURL
});

instance.interceptors.response.use(
    response => {
        if (response.data.code === 0) {
            return response.data;
        }
        ElMessage.error(response.data.message ? response.data.message : "服务异常")
        return Promise.reject(response.data);
    }
    , err => {
        if (err.response.status === 401) {
            // 拦截未登录的用户
            ElMessage.error("请先登录！")
            router.push("/login")
        } else {
            ElMessage.error("服务异常")
        }
        return Promise.reject(err);
    }
)

instance.interceptors.request.use(
    config => {
        let store = useTokenStore();
        if (store.token) {
            config.headers.Authorization = store.token;
        }
        return config;
    }
    , err => {
        alert("请求异常")
        return Promise.reject(err);
    }
)

export default instance