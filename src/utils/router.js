const STORAGE_KEY = 'APP_ROUTE_STACK';

// 读取栈
function getStack() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

// 写入栈
function setStack(stack) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stack));
  } catch (e) {
    // 忽略
  }
}

/**
 * 压栈：保存一个路由记录
 */
export function pushRoute(route) {
  const stack = getStack();

  const record = {
    fullPath: route.fullPath,
    name: route.name,
    query: route.query,
    params: route.params,
    timestamp: Date.now()
  };

  stack.push(record);
  setStack(stack);
}

/**
 * 出栈：取出上一条路由记录
 */
export function popRoute() {
  const stack = getStack();
  const record = stack.pop();
  setStack(stack);
  return record;
}

/**
 * 调试用：获取当前栈
 */
export function getRouteStack() {
  return getStack();
}

/**
 * 清空栈
 */
export function clearRouteStack() {
  setStack([]);
}

/**
 * 根据路由名字找到对应索引及值
 * @param {string} name  
 * @returns { index : number, record:Object}
 */
export function findLastByNameWithIndex (name) {
  const stack = getStack();

  for (let i = stack.length - 1; i >= 0; i--) {
    const item = stack[i];
    if (item.name === name) {
      return { index: i, record: item };
    }
  }

  return null;
}