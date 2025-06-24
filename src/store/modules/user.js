import { authInfo } from '@/api/login'
import { getToken } from '@/utils/auth'
import { setUserInfo } from '@/utils/user-info'

const user = {
  state: {
    token: getToken(),
    userInfo: {},
    roles: false
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER_INFO: (state, userInfo) => {
        state.userInfo = userInfo
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },
  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        authInfo().then(res => {
          if (res.success) {
            const user = res.data;
            console.log(1)
            commit('SET_ROLES', true)
            commit('SET_USER_INFO', user)
            sessionStorage.setItem("rank", user.rank);
            sessionStorage.setItem("username", user.username);
            setUserInfo(user)
            resolve(res)
          }
        }).catch(error => {
            reject(error)
        })
      })
    }
  }
}

export default user
