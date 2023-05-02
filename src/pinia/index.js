import {defineStore} from 'pinia'
import pinia from "./store";

export const useStore = () => {
  return defineStore('global', {
    state: () => {
      return {
        user: {
          username: "",
        },
        logout: false,
        datasetList: [
        ],
        modelList: [],
        tensorSpace:{
          input:{
            type:"image",
            value: null,
          },
          output:{
            type:"image",
            value: null,
          }
        },
        captureValid: false,
      }
    },
    actions: {
      SET_TENSORSPACE_STATE(value) {
        this.tensorSpace = value;
      },
      REMOVE_TENSORSPACE_STATE() {
        this.tensorSpace = {};
      },
      CAPTURE_VALID() {
        this.captureValid = true;
      },
      CAPTURE_INVALID() {
        this.captureValid = false;
      },

      LOGOUT() {
        this.logout = true;
      },
      LOGIN() {
        this.logout = false;
      },
    },
  })(pinia)
}
