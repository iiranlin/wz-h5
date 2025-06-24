const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  getKeepPages:state=>state.keepPages.keepPages,
}
export default getters
