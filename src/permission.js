import router from "./router"
import store from "./store"
import { getToken, setToken } from "@/utils/auth"
import { isAndroid } from "@/utils"
import { popRoute,pushRoute } from "@/utils/router"


const whiteList = ["", "/deviceDetail"] // no redirect whitelist

// 标记当前这次跳转是不是“自定义后退”
let isGoingBack = false;

// 对外暴露一个“智能返回”方法，供页面调用
export function smartBack() {
  const last = popRoute();

  if (last && (last.fullPath || last.name)) {
    // 告诉守卫：这次是后退，不要再把当前页压栈
    isGoingBack = true;

    if (last.fullPath) {
      router.push(last.fullPath);
    } else {
      router.push({
        name: last.name,
        query: last.query,
        params: last.params
      });
    }
  } else {
    // 栈空了，兜底，比如首页
    router.push("/");
  }
}

router.beforeEach(async (to, from, next) => {
  // =========👉 路由栈维护逻辑（核心） 👈=========
  // 第一次进入应用，from.name 通常是 undefined，跳过
  if (from.name && !isGoingBack) {
    // 可以用 meta 控制某些页面不进栈：meta: { saveToStack: false }
    if (!from.meta || from.meta.saveToStack !== false) {
      pushRoute(from);
    }
  }
  // 每次导航结束前，重置标记
  isGoingBack = false;
  // ============================================
  if(to.query.TokenKey){
    setToken(to.query.TokenKey)
  }
  let title = to.meta.title
  document.title = title
  if (isAndroid()) {
    // 路由文件里有的路由在beforeEnter中重新设置了meta.title, 增加计时器确保传给安卓的是最新值。
    setTimeout(() => {
      Android.sendMenuTitle(to.meta.title)
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
