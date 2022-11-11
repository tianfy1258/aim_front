import {createApp} from 'vue'
import './style.css'
import App from './App.vue'
import router from "./router"
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'animate.css';
import pinia from "./pinia/store.js"

const app = createApp(App)
app.use(pinia)
app.use(router)
app.use(ElementPlus)
app.mount('#app')
app.config.globalProperties.$unFocus = () => {
  // 用于强制失焦 => elementUI bug, 点击按钮后不失焦
  const button = document.createElement('button');
  button.style.position = 'fixed';
  button.style.opacity = "0";
  document.body.appendChild(button);
  button.focus();
  button.remove();
};
