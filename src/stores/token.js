import {defineStore} from "pinia";
import {ref} from "vue";

export let useTokenStore = defineStore('token', () => {

    let token = ref('');
    let setToken = (p) => {
        token.value = p
    };
    let removeToken = () => {
        token.value = ''
    };

    return {token, setToken, removeToken}
}, {persist: true});

