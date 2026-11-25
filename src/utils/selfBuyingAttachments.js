// 与自购物资核备附件对照表保持一致，编辑页和详情页共用附件名称及必填规则。
export const PURCHASE_METHODS = ['公开招标', '邀请招标', '竞争性谈判', '单一来源采购', '询价采购', '协议招标', '战略采购'];

const tenderDocumentMethods = ['公开招标', '竞争性谈判'];
const evaluationMethods = ['公开招标', '邀请招标', '竞争性谈判', '单一来源采购', '询价采购'];

export const PURCHASE_FILE_ATTACHMENTS = [
  { key: 'registration', label: '采购文件审查登记表', requiredMethods: 'all' },
  { key: 'bidDocument', label: '招标文件（含技术规格书）', requiredMethods: tenderDocumentMethods },
  { key: 'registrationAttach', label: '核备附件（支持多个）', requiredMethods: [] },
];

export const PURCHASE_CONTRACT_ATTACHMENTS = [
  { key: 'scheme', label: '采购方案或招标计划', requiredMethods: 'all' },
  { key: 'schemeApproval', label: '采购方案（计划）批复（施工单位上级管理部门）', requiredMethods: 'all' },
  { key: 'gyszlzscns', label: '供应商质量终身责任制承诺书', requiredMethods: 'all', legacy: true, businessType: '02' },
  { key: 'htfbsmj', label: '合同副本', requiredMethods: 'all', legacy: true, businessType: '01' },
  { key: 'briberyCrimeQuery', label: '行贿犯罪查询', requiredMethods: 'all' },
  { key: 'tenderAnnouncement', label: '招标公告网页版', requiredMethods: ['公开招标'] },
  { key: 'bidDocument', label: '报审后招标文件（含技术规格书）', requiredMethods: tenderDocumentMethods },
  { key: 'bidEvaluationReport', label: '评标报告', requiredMethods: evaluationMethods },
  { key: 'bidCandidateWeb', label: '中标候选人公示网页版', requiredMethods: ['公开招标'] },
  { key: 'bidResultAnnouncement', label: '中标结果公示', requiredMethods: ['公开招标'] },
  { key: 'acceptance', label: '中标通知书/成交通知书', requiredMethods: evaluationMethods },
  { key: 'bidCopy', label: '中标人的投标文件副本', requiredMethods: evaluationMethods },
  { key: 'technicalReviewMinutes', label: '技术规格书审查会议纪要（如有）', requiredMethods: [] },
  { key: 'purchaseMinutes', label: '采购会议纪要（如有）', requiredMethods: [] },
  { key: 'bidAddendum', label: '招标文件答疑、补遗（如有）', requiredMethods: [] },
  { key: 'hthbfj', label: '核备附件（支持多个）', requiredMethods: [], legacy: true, businessType: '03' },
];

export function isAttachmentRequired(attachment, purchaseMethod) {
  return attachment.requiredMethods === 'all' || attachment.requiredMethods.includes(purchaseMethod);
}

function parseJson(value) {
  if (typeof value !== 'string') return value;
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function parseAttachmentList(value) {
  const list = parseJson(value);
  return Array.isArray(list) ? list : [];
}

export function clearDraftEmptyPlaceholders(params) {
  Object.keys(params).forEach(key => {
    if (params[key] === '""') {
      params[key] = '';
    }
  });
}

export function parseAttachmentObject(value) {
  const files = parseJson(value);
  return files && typeof files === 'object' && !Array.isArray(files) ? files : {};
}

export function createContractAttachmentFiles(value) {
  // 保留接口返回的未知附件分类，编辑时不丢弃其他端保存的数据。
  const files = { ...parseAttachmentObject(value) };
  PURCHASE_CONTRACT_ATTACHMENTS.filter(item => !item.legacy).forEach(item => {
    files[item.key] = parseAttachmentList(files[item.key]);
  });
  return files;
}

export function getContractAttachmentSections(data) {
  const legacyFiles = parseAttachmentObject(data.files);
  const additionalFiles = parseAttachmentObject(data.attachFiles ?? data.fileList);
  return PURCHASE_CONTRACT_ATTACHMENTS.map(item => ({
    ...item,
    required: isAttachmentRequired(item, data.purchaseMethod),
    files: parseAttachmentList(item.legacy
      ? (data[item.key] === undefined ? legacyFiles[item.key] : data[item.key])
      : additionalFiles[item.key]),
  }));
}
