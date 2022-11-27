import axios from "axios";
// 响应错误
import {ElMessage} from "element-plus";

const MODE = import.meta.env.MODE

export const BASE_URL = MODE === "development" ? "http://localhost:8000/" : "";

axios.defaults.withCredentials = true;
// 创建实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
});


// 发送成功
const requestSuccessHandler = (config) => {
  let token = localStorage.getItem("token")
  if (token) {
    config.headers.token = token;
  }
  return config;
};

// 发送失败
const requestFailureHandler = (err) => {
  return Promise.reject(err);
};

const SUCCESS_CODE = 200;
const ERROR_CODE = 400;
const INVALID_CODE = 401;
const RETRY_CODE = 402;

// 响应成功
const responseSuccessHandler = (res) => {
  const {code, error_message, duration} = res.data;
  if (code === ERROR_CODE || code === INVALID_CODE) {
    if (error_message) {
      ElMessage({
        message: `${error_message}`,
        grouping: true,
        type: 'error',
        duration: duration ?? 3000,
      });
    }
    return Promise.reject(res.data);
  }
  if (code === RETRY_CODE) {
    return Promise.reject(res.data);
  }
  return res.data;
};

const responseFailureHandler = (err) => {
  if (err.response) {
    ElMessage({
      message: `网络错误，错误代码: ${err.response.status}`,
      grouping: true,
      type: 'error',

    })
  } else {
    console.log(err);
    ElMessage({
      message: "网络请求未响应!",
      grouping: true,
      type: 'error',
    })
  }
  return Promise.reject(err);

};


// // 设置拦截器
axiosInstance.interceptors.request.use(requestSuccessHandler, requestFailureHandler);
axiosInstance.interceptors.response.use(responseSuccessHandler, responseFailureHandler);

// 提供使用的request方法
export function request(config) {
  return new Promise(((resolve, reject) => {
    axiosInstance(config).then(res => {

      resolve(res);
    }).catch(err => {

      reject(err)
    }).finally(() => {
    });
  }));
}
