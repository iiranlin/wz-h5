import request from "@/utils/request";
const VUE_APP_PRODMGR_INV = process.env.VUE_APP_PRODMGR_INV;

//授权设备新增
export function create(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/invAuthorizedDevices/create`,
    method: "post",
    data,
  });
}
// 授权设备申请
export function apply(data) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/invAuthorizedDevices/apply`,
    method: "post",
    data,
  });
}

// 根据设备编号获取详情数据
export function getDetail(params) {
  return request({
    url: `${VUE_APP_PRODMGR_INV}/invAuthorizedDevices/getAuthorizationDetail`,
    method: "get",
    params,
  });
}
