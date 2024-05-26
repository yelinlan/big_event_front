import request from "@/utils/request.js";


export const userRegisterService = (registerData) => {
    let params = new URLSearchParams();
    for (const key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('user/register', params)
}

export const userLoginService = (registerData) => {
    let params = new URLSearchParams();
    for (const key in registerData) {
        params.append(key, registerData[key]);
    }
    return request.post('user/login', params)
}

export const userInfoService = () => {
    return request.get('user/userInfo')
}
export const userLogoutService = () => {
    return request.get('user/logout')
}
export const userUpdateService = (params) => {
    return request.put('user/update', params)
}
export const userUpdateAvatarService = (params) => {
    return request.patch('user/updateAvatar?avatarUrl=' + params)
}
export const userUpdatePwdService = (params) => {
    return request.patch('user/updatePwd', params)
}
export const userCaptchaService = () => {
    return request.get('user/captcha')
}

export const userPublicKeyService = (username) => {
    return request.get('user/rsa?username='+username)
}