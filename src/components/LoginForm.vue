<template>
  <div class="login-form-flex">
    <div class="login-form-warp">
      <el-form ref="formRef"
               :rules="rules"
               label-position="top"
               :model="form"
               size="large"
               label-width="auto"
               class="login-form"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"
                    clearable
                    ref="usernameInputRef"
                    placeholder="请输入用户名">
            <template #prefix>
              <el-icon class="el-input__icon">
                <avatar/>
              </el-icon>
            </template>

          </el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password"
                    show-password
                    ref="passwordInputRef"
                    @keyup.enter="onSubmit(formRef)"
                    v-model="form.password" placeholder="请输入密码">

            <template #prefix>
              <el-icon class="el-input__icon">
                <lock/>
              </el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="login-button" type="primary" @click="onSubmit(formRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script setup>
import {reactive, ref} from "vue";
import {Avatar, Lock} from "@element-plus/icons-vue";
import {ElMessage} from "element-plus";
import {request} from "../network/request";
import {useRoute, useRouter} from 'vue-router'
import {useStore} from '../pinia/index'

const store = useStore()
const $route = useRoute()
const $router = useRouter()


const props = defineProps({
  isManager: {
    type: Boolean,
    required: true,
    default: false,
  }
})

let form = reactive({
  username: "root",
  password: "123456",
})
const rules = reactive({
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'change',
    },
  ]
})
const formRef = ref(null);
const usernameInputRef = ref(null);
const passwordInputRef = ref(null);
// 防止短时间内多次点击登录按钮
let isLoginButtonValid = ref(true);
const emit = defineEmits(["isLoading"]);


const onSubmit = (formRef) => {
  console.log(props.isManager, props);
  if (!formRef || !isLoginButtonValid.value) return
  formRef.validate((valid) => {
    if (valid) {
      emit("isLoading", true);
      isLoginButtonValid.value = false;
      form.isManager = props.isManager;
      request({
        url: "login",
        method: "POST",
        data: form,
      }).then((res) => {
        store.$patch({user: res.user});
        localStorage.setItem("token", res.token);
        localStorage.setItem("token_time", new Date().getTime().toString());
        $router.push("/main").finally(() => {
          ElMessage({
            type: "success",
            message: "登录成功",
          });
        });
      }).catch((err) => {
        isLoginButtonValid.value = true;
        emit("isLoading", false);
      })


    } else {
      passwordInputRef.value.clear()
      return false
    }
  })
}
</script>

<style scoped>

.login-form-flex {
  display: flex;
  justify-content: center;
  align-items: center;

}

.login-form-warp {
  /*border: 1px rgb(64, 84, 204) solid;*/
  height: 350px;
  width: 450px;
  display: flex;
  align-items: center;

}

.login-form {
  /*border:1px red solid;*/
  width: 100%;
  flex-grow: 1;

}

.login-button {
  margin-left: 0px;
  width: 450px;
  margin-top: 30px;
}

</style>
