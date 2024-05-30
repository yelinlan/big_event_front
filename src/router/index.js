import {createRouter, createWebHistory} from 'vue-router'
import Login from "@/views/Login.vue";
import Layout from "@/views/Layout.vue";
import ArticleCategory from "@/views/article/ArticleCategory.vue";
import ArticleManage from "@/views/article/ArticleManage.vue";
import UserInfo from "@/views/user/UserInfo.vue";
import UserAvatar from "@/views/user/UserAvatar.vue";
import UserResetPassword from "@/views/user/UserResetPassword.vue";
import LogPage from "@/views/log/logPage.vue";


let routers = [
    {path: "/login", component: Login},
    {
        path: "/",
        component: Layout,
        redirect: "/article/manage",
        children: [
            {path: "/user/info", component: UserInfo},
            {path: "/user/avatar", component: UserAvatar},
            {path: "/user/resetPassword", component: UserResetPassword},
            {path: "/article/category", component: ArticleCategory},
            {path: "/article/manage", component: ArticleManage},
            {path: "/log/page", component: LogPage},
        ]
    }
];

let router = createRouter({
    routes: routers,
    history: createWebHistory()
});

export default router;