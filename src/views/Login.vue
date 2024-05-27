<script setup>
import {Key, Lock, User} from "@element-plus/icons-vue"
import {ref} from "vue";
import {userCaptchaService, userLoginService, userPublicKeyService, userRegisterService} from "@/api/user.js";
import {ElMessage} from 'element-plus'
import {useRouter} from "vue-router";
import {useTokenStore} from "@/stores/token.js";
import JSEncrypt from "jsencrypt";
import {snowflake} from "@/utils/snowId.js";

const isRegister = ref(false);
let registerData = ref({
  username: "",
  password: "",
  rePassword: "",
  code: "",
  randKey: ""
});

const captcha = ref('');

const userCaptcha = async () => {
  registerData.value.randKey = snowflake.generate();
  let result = await userCaptchaService(registerData.value.randKey);
  captcha.value = result.data
}

userCaptcha();

const flushCaptcha = () => {
  userCaptcha()
}

const checkRePassword = (rule, value, callback) => {
  if (value === "") {
    callback(new Error('请再次输入密码'))
  } else if (value !== registerData.value.password) {
    callback(new Error('两次密码不一致'))
  } else {
    callback()
  }
}

let rules = ref({
  username: [
    {required: true, message: "请输入用户名", trigger: "blur"},
    {min: 5, max: 16, message: "长度为5-16位非空字符", trigger: "blur"}
  ],
  password: [
    {required: true, message: "请输入密码", trigger: "blur"},
    {min: 5, max: 16, message: "长度为5-16位非空字符", trigger: "blur"}
  ],
  code: [
    {required: true, message: "请输入验证码", trigger: "blur"},
    {min: 5, max: 5, message: "长度为5位非空字符", trigger: "blur"}
  ],
  rePassword: [{
    validator: checkRePassword, trigger: "blur"
  }]
});

const register = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      const jsEncrypt = new JSEncrypt();
      jsEncrypt.setPublicKey("MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCUT7QkKAk1NHGE0S5eZHir4kvCjGBilXQK2pnAmzuRXi4Byt4Qn1j0zFGpUHr1qH3/VSKMDk77Sx+/UPlsczelzT+oNmmFeY/GbZObIma5caQRnzMMXCsvhhyT2fnb9eMA6IZe+y7ZRRRakhu9BQOrGhdXp3I0eZghMJ7Fe1RE8QIDAQAB");
      const pwd = jsEncrypt.encrypt(registerData.value.password);
      const username = jsEncrypt.encrypt(registerData.value.username);
      let result = await userRegisterService({
        username: username,
        password: pwd,
      });
      ElMessage.success(result.message ? result.message : "注册成功")
      isRegister.value = false;
    }
  })
}

let router = useRouter()
let tokenStore = useTokenStore();
const loginForm = ref()
const registerForm = ref()
const login = async (formEl) => {
  if (!formEl) return
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let publicKey = await userPublicKeyService(registerData.value.randKey);
      if (publicKey.code === 0) {
        const jsEncrypt = new JSEncrypt();
        jsEncrypt.setPublicKey(publicKey.data);
        const pwd = jsEncrypt.encrypt(registerData.value.password);
        const username = jsEncrypt.encrypt(registerData.value.username);
        let result = await userLoginService({
          username: username,
          password: pwd,
          code: registerData.value.code,
          randKey: registerData.value.randKey
        });
        ElMessage.success(result.message ? result.message : "登录成功")
        tokenStore.setToken(result.data)
        await router.push("/")
      }
    }
  })
}

const clear = () => {
  registerData.value = {
    username: "",
    password: "",
    rePassword: ""
  }
}

</script>

<template>
  <el-row class="login-page">
    <el-col :span="12" class="bg"></el-col>
    <el-col :span="6" :offset="3" class="form">
      <!-- 注册表单 -->
      <el-form ref="registerForm" size="large" autocomplete="on" v-if="isRegister" :model="registerData" :rules="rules">
        <el-form-item>
          <h1>注册</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入密码" v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="rePassword">
          <el-input :prefix-icon="Lock" type="password" placeholder="请输入再次密码" v-model="registerData.rePassword"
          ></el-input>
        </el-form-item>
        <!-- 注册按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="register(registerForm)">
            注册
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = false;clear()">
            ← 返回
          </el-link>
        </el-form-item>
      </el-form>

      <!-- 登录表单 -->
      <el-form ref="loginForm" size="large" autocomplete="off" :model="registerData" :rules="rules" v-else>
        <el-form-item>
          <h1>登录</h1>
        </el-form-item>
        <el-form-item prop="username">
          <el-input :prefix-icon="User" placeholder="请输入用户名" v-model="registerData.username"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input name="password" :prefix-icon="Lock" type="password" placeholder="请输入密码"
                    v-model="registerData.password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="code" class="flex">
          <div class="flex">
            <el-input name="code" :prefix-icon="Key" type="text" placeholder="请输入验证码"
                      v-model="registerData.code" style="width: 50%"
            ></el-input>
            <el-image style="width: 40%" :src="captcha" @click="flushCaptcha"/>
          </div>
        </el-form-item>
        <el-form-item class="flex">
          <div class="flex">
            <el-checkbox>记住我</el-checkbox>
            <el-link type="primary" :underline="false">忘记密码？</el-link>
          </div>
        </el-form-item>
        <!-- 登录按钮 -->
        <el-form-item>
          <el-button class="button" type="primary" auto-insert-space @click="login(loginForm)">
            登录
          </el-button>
        </el-form-item>
        <el-form-item class="flex">
          <el-link type="info" :underline="false" @click="isRegister = true;clear()">
            注册 →
          </el-link>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<style lang="scss" scoped>
/* 样式 */
.login-page {
  height: 100vh;
  background-color: #fff;

  .bg {
    background: url('@/assets/logo2.png') no-repeat 60% center / 240px auto,
    url('@/assets/login_bg.jpg') no-repeat center / cover;
    border-radius: 0 20px 20px 0;
  }

  .form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    user-select: none;

    .title {
      margin: 0 auto;
    }

    .button {
      width: 100%;
    }

    .flex {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }
  }
}
</style>