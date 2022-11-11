import {request} from "./request";
import {useRouter} from "vue-router";

export function validToken() {
  return request({
    url: "validToken",
    method: "POST",
    data: {
      token: localStorage.getItem("token"),
    }
  }).catch((err) => {
    useRouter().replace("/login");
  });
}
