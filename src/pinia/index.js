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
      }
    },
    actions: {
      ADD_ITEM_DATASET(item) {
        this.datasetList.push(item);
      },
      REMOVE_ITEM_DATASET(item) {
        this.datasetList = this.datasetList.filter(x => x.task_id !== item.task_id);
      },
      ADD_ITEM_MODEL(item) {
        this.modelList.push(item);
      },
      REMOVE_ITEM_MODEL(item) {
        this.modelList = this.modelList.filter(x => x.task_id !== item.task_id);
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
