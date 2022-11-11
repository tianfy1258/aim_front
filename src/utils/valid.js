import {useStore} from "../pinia";
const store = useStore();

export const isValid = (auth) => {
    let user = store.user;
    if (auth.indexOf(user.user_auth) > -1) {
        return true;
    }
    return false;
}
