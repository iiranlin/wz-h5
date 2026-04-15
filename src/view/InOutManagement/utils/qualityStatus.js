export function resolveDefaultRadioByTotals(item = {}) {
  const currentRadio = item.defaultRadio;

  if (currentRadio === '1' || currentRadio === '2') {
    return currentRadio;
  }

  const putTotal = Number(item.putTotal) || 0;
  const storeTotal = Number(item.storeTotal) || 0;
  const refundZjTotal = Number(item.refundZjTotal) || 0;

  // 兼容驳回回填场景：接口已带退货数量，但上游可能仍把 storeTotal 回填成 putTotal。
  if (refundZjTotal > 0 && refundZjTotal === putTotal && (storeTotal === 0 || storeTotal === putTotal)) {
    return '2';
  }

  if (storeTotal > 0 && storeTotal === putTotal && refundZjTotal === 0) {
    return '1';
  }

  return '';
}
