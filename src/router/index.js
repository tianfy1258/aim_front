import {createRouter, createWebHistory} from 'vue-router';
import {request} from "../network/request";

const LoginPage = () => import('@/views/LoginPage');
const MainPage = () => import('@/views/MainPage');
const InfoDatasetPage = () => import('../views/InfoDatasetPage')
const UploadPage = () => import('../views/UploadMainPage')
const InfoModelPage = () => import('../views/InfoModelPage')
const InterpreterMainPage = () => import('../views/InterpreterMainPage')

const routes = [
  {path: '/', name: "", redirect: "/login"},
  {path: '/login', name: "login", component: LoginPage},
  {
    path: "/main", name: "main", meta: {title: "首页"}, component: MainPage, redirect: "/main/datasets",
    children: [
      {path: 'datasets', name: "datasets", meta: {title: "数据集列表"}, component: InfoDatasetPage},
      {path: 'upload', name: 'upload', meta: {title: '文件上传'}, component: UploadPage},
      {path: 'models', name: "models", meta: {title: '模型列表'}, component: InfoModelPage},
      {path: 'dashboard', name: "dashboard", meta: {title: '仪表盘',keepAlive:true}, component: InterpreterMainPage}

    ]
  },
];

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHistory(),
  routes, // `routes: routes` 的缩写
})

router.beforeEach((to, from, next) => {
  // 判断是否含有token
  let token = localStorage.getItem("token");
  const token_time = localStorage.getItem("token_time");
  if (new Date().getTime() - new Date(Number(token_time)) > 2 * 3600 * 1000) {
    token = null
  }
  if (token) {
    request({
      url: "validToken",
      method: "POST",
      data: {
        token: token,
      }
    })
      // token 有效
      .then((res) => {
        // 如果目的地是登录,跳转到主界面。否则不做理会
        if (to.name === "login") {
          next("/main");
        } else {
          next()
        }
      })
      // token 无效
      .catch((err) => {
        next("/login");
        // 清除token
        localStorage.removeItem("token");
        localStorage.removeItem("VUE_STORE");
        localStorage.removeItem("token_time");
      });
  } else {
    if (to.name !== "login") {
      next("/login")
    } else next();
  }
});
export default router;
