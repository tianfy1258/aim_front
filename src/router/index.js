import {createRouter, createWebHistory} from 'vue-router';
import {request} from "../network/request";

const LoginPage = () => import('@/views/LoginPage');
const MainPage = () => import('@/views/MainPage');
const InfoDatasetPage = () => import('../views/InfoDatasetPage')
const UploadPage = () => import('../views/UploadMainPage')
const InfoModelPage = () => import('../views/InfoModelPage')
const InterpreterMainPage = () => import('../views/InterpreterMainPage')
const CoverageMainPage = () => import('../views/CoverageMainPage')
const TensorSpaceMainPage = () => import('../views/TensorSpaceMainView')
const DatasetTaskCreatePage = () => import('../views/DatasetTaskCreatePage')
const DatasetTaskListPage = () => import('../views/DatasetTaskListPage')
const ModelTaskCreatePage = () => import('../views/ModelTaskCreatePage')
const ModelTaskListPage = () => import('../views/ModelTaskListPage')


const routes = [
  {path: '/', name: "", redirect: "/login"},
  {path: '/login', name: "login", component: LoginPage},
  {
    path: "/main", name: "main", meta: {title: "首页"}, component: MainPage, redirect: "/main/datasets",
    children: [
      {path: 'datasets', name: "datasets", meta: {title: "数据集列表"}, component: InfoDatasetPage},
      {path: 'upload', name: 'upload', meta: {title: '文件上传'}, component: UploadPage},
      {path: 'models', name: "models", meta: {title: '模型列表'}, component: InfoModelPage},
      {path: 'datasetTaskCreate', name: "datasetTaskCreate", meta: {title: '发起任务'}, component: DatasetTaskCreatePage},
      {path: 'datasetTaskList', name: "datasetTaskList", meta: {title: '任务查看'}, component: DatasetTaskListPage},
      {path: 'datasetTaskConfig', name: "datasetTaskConfig", meta: {title: '任务配置'}, component: InfoModelPage},
      {path: 'modelTaskCreate', name: "modelTaskCreate", meta: {title: '发起任务'}, component: ModelTaskCreatePage},
      {path: 'modelTaskList', name: "modelTaskList", meta: {title: '任务查看'}, component: ModelTaskListPage},
      {path: 'modelTaskConfig', name: "modelTaskConfig", meta: {title: '任务配置'}, component: InfoModelPage},
      {path: 'interpreter', name: "interpreter", meta: {title: '可解释性分析',keepAlive:true}, component: InterpreterMainPage},
      {path: 'coverage', name: "coverage", meta: {title: '覆盖测试',keepAlive:true}, component: CoverageMainPage},
      {path: 'tensorSpace', name: "tensorSpace", meta: {title: '可视化展示',keepAlive:true}, component: TensorSpaceMainPage}

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
