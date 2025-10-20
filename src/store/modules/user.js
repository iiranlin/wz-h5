import { authInfo, getLoginSelectUser } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
import { logout } from '@/api/blcd-base/auth'
import { setUserInfo } from '@/utils/user-info'


const user = {
  state: {
    token: getToken(),
    userInfo: {},
    roles: false,
    selectProjectDialog: false,
    selectProjectUserData: []
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
    },
    SET_SELECT_PROJECT_DIALOG: (state, selectProjectDialog) => {
      state.selectProjectDialog = selectProjectDialog
    },
    SET_SELECT_PROJECT_USER_DATA: (state, selectProjectUserData) => {
      state.selectProjectUserData = selectProjectUserData
    }
  },
  actions: {
    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        authInfo().then(res => {
          if (res.success) {
            const user = res.data;
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
    },
    // 获取登录账号下相同标段的账号
    GetSameProjectUser({ commit, state }) {
      return new Promise((resolve, reject) => {
        getLoginSelectUser().then(res => {
          if (res.success) {
            const userData = res.data;

            commit('SET_SELECT_PROJECT_USER_DATA', userData);

            resolve(res)
          }
        }).catch(error => {
            reject(error)
        })
      })
    },
    // 退出系统
    LogOut({ commit, state }) {
      return new Promise(async(resolve, reject) => {
        logout().then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', null)
          removeToken()
          resolve()
        })
      })
    },
  }
}

export default user
