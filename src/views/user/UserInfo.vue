<script setup>

import {ref} from "vue";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {userInfoService, userUpdateService} from "@/api/user.js";
import {ElMessage} from "element-plus";

let userInfoStore = useUserInfoStore();
let userInfo = ref({
  username: userInfoStore.user.username,
  nickname: userInfoStore.user.nickname,
  email: userInfoStore.user.email
});

const updateUser = async () => {
  let result = await userUpdateService(userInfo.value);
  ElMessage.success(result.message ? result.message : "修改成功")
  let userResult = await userInfoService();
  userInfoStore.setUser(userResult.data)
}

let rules = ref({
  nickname: [
    {required: true, message: "请输入昵称", trigger: "blur"},
    {pattern: /^\S{2,10}$/, message: "长度为2-10位非空字符", trigger: "blur"}
  ],
  email: [
    {required: true, message: "请输入邮箱", trigger: "blur"},
    {type: 'email', message: "邮箱格式不正确", trigger: "blur"}
  ]
});

</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>基本资料</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-form :model="userInfo" :rules="rules" label-width="100px" size="large">
          <el-form-item label="登录名称">
            <el-input v-model="userInfo.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input v-model="userInfo.nickname"></el-input>
          </el-form-item>
          <el-form-item label="用户邮箱" prop="email">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="updateUser">提交修改</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>
