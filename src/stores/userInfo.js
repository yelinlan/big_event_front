import {defineStore} from "pinia";
import {ref} from "vue";

export let useUserInfoStore = defineStore('userInfo', () => {

    let user = ref({});
    let setUser = (p) => {
        user.value = p
    };
    let removeUser = () => {
        user.value = {}
    };

    return {user, setUser, removeUser}
}, {persist: true});

