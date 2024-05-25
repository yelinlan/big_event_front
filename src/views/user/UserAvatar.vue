<script setup>

import {Plus, Upload} from "@element-plus/icons-vue";
import {useTokenStore} from "@/stores/token.js";
import {useUserInfoStore} from "@/stores/userInfo.js";
import {ref} from "vue";
import {ElMessage} from "element-plus";
import {userInfoService, userUpdateAvatarService} from "@/api/user.js";
import avatar from "@/assets/avatar.jpg"

let infoStore = useUserInfoStore();
let tokenStore = useTokenStore();
let imgUrl = ref(infoStore.user.userPic);
const uploadSuccess = (result) => {
  imgUrl.value = result.data;
}

let uploadRef = ref();

const updateAvatar = async () => {
  let result = await userUpdateAvatarService(imgUrl.value);
  ElMessage.success(result.message ? result.message : "头像更新成功")
  let userResult = await userInfoService();
  infoStore.setUser(userResult.data)
}
</script>
<template>
  <el-card class="page-container">
    <template #header>
      <div class="header">
        <span>更换头像</span>
      </div>
    </template>
    <el-row>
      <el-col :span="12">
        <el-upload
            ref="uploadRef"
            class="avatar-uploader"
            :show-file-list="false"
            :auto-upload="true"
            action="/api/upload"
            name="file"
            :headers="{'Authorization':tokenStore.token}"
            :on-success="uploadSuccess"
        >
          <el-image v-if="imgUrl" :src="imgUrl" class="avatar"/>
          <el-image v-else :src="avatar" width="278"/>
        </el-upload>
        <br/>
        <el-button type="primary" :icon="Plus" size="large" @click="uploadRef.$el.querySelector('input').click()">
          选择图片
        </el-button>
        <el-button type="success" :icon="Upload" size="large" @click="updateAvatar">
          上传头像
        </el-button>
      </el-col>
    </el-row>
  </el-card>
</template>
<style lang="scss" scoped>
  :deep(.avatar-uploader) {
    .avatar {
      width: 278px;
      height: 278px;
      display: block;
    }

    .el-upload {
      border: 1px dashed var(--el-border-color);
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
    }

    .el-upload:hover {
      border-color: var(--el-color-primary);
    }

    .el-icon.avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 278px;
      height: 278px;
      text-align: center;
    }
  }
</style>