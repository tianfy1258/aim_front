import {defineStore} from 'pinia'
import pinia from "./store";
export const useStore = () => {
    return defineStore('global', {
        state: () => {
            return {
                user: {
                    username: "",
                }

            }
        }
    })(pinia)
}
