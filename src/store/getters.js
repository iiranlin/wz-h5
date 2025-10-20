const getters = {
  token: state => state.user.token,
  roles: state => state.user.roles,
  userInfo: state => state.user.userInfo,
  permission_routes: state => state.permission.routes,
  getKeepPages:state=>state.keepPages.keepPages,
  activeTab:state=>state.acceptance.activeTab,
  selectProjectDialog: state => state.user.selectProjectDialog,
  selectProjectUserData: state => state.user.selectProjectUserData,
}
export default getters
