const getters = {
  permission_routes: state => state.permission.routes,
  userInfo: state => state.auth.userInfo,
  getKeepPages:state=>state.keepPages.keepPages,
}
export default getters
