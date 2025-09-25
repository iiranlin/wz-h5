import router from "./router"
import store from "./store"
import { getToken, setToken } from "@/utils/auth"
import { isAndroid } from "@/utils"


const whiteList = ["", "/deviceDetail"] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  if(to.query.TokenKey){
    setToken(to.query.TokenKey)
  }
  if (isAndroid()) {
    // 路由文件里有的路由在beforeEnter中重新设置了meta.title, 增加计时器确保传给安卓的是最新值。
    setTimeout(() => {
      let title = to.meta.title
      Android.sendMenuTitle(title)
    }, 100)
  }
  if (whiteList.indexOf(to.path) !== -1) {
    next()
  } else {
    const hasToken = getToken()
    if (hasToken) {
      const hasRoles = store.getters.roles
      if (hasRoles) {
        next();
      } else {
        try {
          await store.dispatch("GetInfo")
          next({ ...to, replace: true })
        } catch (error) {
          console.error(error)
        }
      }
    } else {
      try {
        next({ ...to, replace: true })
      } catch (error) {
        console.error(error)
      }
    }
  }
});
