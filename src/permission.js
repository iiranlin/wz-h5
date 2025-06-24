import router from "./router"
import store from "./store"
import { getToken, setToken } from "@/utils/auth"

function isAndroid() {
  let userAgent = navigator.userAgent
  return /Android|adr/gi.test(userAgent)
}

const whiteList = [""] // no redirect whitelist
router.beforeEach(async (to, from, next) => {
  if(to.query.TokenKey){
    setToken(to.query.TokenKey)
  }
  if (isAndroid()) {
    let title = to.meta.title
    Android.sendMenuTitle(title)
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
