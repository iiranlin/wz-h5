// 与 PC 端保持一致，兼容后端新旧退回状态。
export function isRollbackStatus(status) {
  return status === 'back' || String(status) === '7'
}

export function formatWorkflowMessage(record) {
  const message = typeof record.message === 'string' ? record.message : ''
  return isRollbackStatus(record.status)
    ? message.replace(/^退回上一步\s*[:：]\s*/, '') : message
}
