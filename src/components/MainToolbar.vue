<template>
  <div class="toolbar">
    <el-dropdown class="userDropdown"
                 trigger="click"
    >
      <div class="userDropdownContent">
        <el-icon style="margin-right: 5px; margin-top: 1px;vertical-align:middle;"
                 size="large">
          <user/>
        </el-icon>
        <span>欢迎，{{store.user.username}}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人信息</el-dropdown-item>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>

</template>

<script setup>
import {User} from '@element-plus/icons-vue'
import {request} from "../network/request";
import {validToken} from "../network/validToken";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";
import {useStore} from "../pinia/index.js";

const $router = useRouter();
const store = useStore();
const logout = () => {
  validToken().then((res) => {
    request({
      url: "logout",
      method: "get",
    }).then(res => {
      ElMessage({
        message: "已退出登录",
        grouping: true,
        type: 'info',
      });
      store.LOGOUT();
      localStorage.removeItem("token");
      localStorage.removeItem("VUE_STORE");
      localStorage.removeItem("token_time");
      $router.replace("/login");
    });
  });

}
</script>

<style scoped>

.userDropdown {
  /*border: #2c3e50 1px solid;*/
  width: inherit;
  height: inherit;
  justify-content: center;
  align-items: center;

}

.userDropdownContent {
  /*border: rgb(64, 84, 204) 1px solid;*/
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  height: 50px;
}
</style>
