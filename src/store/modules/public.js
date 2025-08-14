const state = {
  //计划管理
  demandPlanningInfo: {}, //编辑页主信息
  materiaList: [], //编辑页选中的物资数据
  interfaceMateriaList: [], //编辑页回显的物资原始数据
  materiaData: {}, //编辑页单个物资编辑的数据
  historyData: {}, //编辑页物资收货信息
  historyList: JSON.parse(localStorage.getItem('historyList')) || {}, //历史记录前端自己存的暂时不用了

  sendGoods:{},
  goodsSelect:[],
  editSendGoods:{},
  editGoods:{},

  InboundInformation: {},
  selectStoreData: [],

  GoodsReceiptInfo: {},

  shipmentsInfo: {},

  selectGoodData: [],
  selectGoodDataEdit: [],

  //滚动条回到原来位置
  scrollPosition: {},

  // 需求库存
  outboundData:{},   // 物资存储数据
  outboundFormData:{},  // 页面存储数据
  outboundFileList:[], //页面上传的领料单
  outboundList:[],
  outboundInfo:{}
  
};

const mutations = {
  SET_INBOUND_INFORMATION: (state, inboundInformation) => {
    state.InboundInformation = inboundInformation;
  },
  SET_GOODS_RECEIPT_INFO: (state, goodsReceiptInfo) => {
    state.GoodsReceiptInfo = goodsReceiptInfo;
  },
  SET_SHIPMENTS_INFO: (state, shipmentsInfo) => {
    state.shipmentsInfo = shipmentsInfo;
  },
  SET_SELECTSTOREDATA: (state, selectStoreData) => {
    state.selectStoreData = selectStoreData;
  },
  SET_DEMAND_PLANNING_INFO: (state, demandPlanningInfo) => {
    state.demandPlanningInfo = demandPlanningInfo;
  },
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
  },
  SET_SELECTGOODDATA: (state, selectGoodData) => {
    state.selectGoodData = selectGoodData;
  },
  SET_SELECTGOODDATA_EDIT: (state, selectGoodDataEdit) => {
    state.selectGoodDataEdit = selectGoodDataEdit;
  },
  SET_GOODS_LIST:(state,goodsList)=>{
    state.sendGoods = goodsList
  },
  SET_HISTORY_LIST:(state, historyList)=>{
    let object = JSON.parse(localStorage.getItem('historyList')) || historyList
    if(object){
      for (const key in object) {
        if (Object.hasOwnProperty.call(object, key)) {
          object[key].push(...(historyList[key] || []))
          object[key] = Array.from(new Set(object[key]))
          if(object[key].length > 4){
            object[key] = object[key].slice(-5)
          }
        }
      }
    }
    localStorage.setItem('historyList', JSON.stringify(object))
    state.historyList = object
  },
  SET_INTERFACE_MATERIA_LIST:(state, interfaceMateriaList)=>{
    state.interfaceMateriaList = interfaceMateriaList
  },
  SET_GOODS_SELECT:(state,goodsSelect)=>{
    state.goodsSelect = goodsSelect
  },
  SET_EDIT_GOODS_SELECT:(state,editSendGoods)=>{
    state.editSendGoods = editSendGoods
  },
  SET_EDIT_GOODS:(state,editGoods)=>{
    state.editGoods = editGoods
  },
  SET_HISTORY_DATA:(state, historyData)=>{
    state.historyData = historyData
  },
  SET_SCROLL_POSITION(state, scrollPosition) {
    const inData = state.scrollPosition
    state.scrollPosition = {...inData, ...scrollPosition}
  },
  SET_MATERIA_DATA:(state, materiaData)=>{
    state.materiaData = materiaData
  },
  SET_OUTBOUND_DATA:(state, outboundData)=>{
    state.outboundData = outboundData
  },
  SET_OUTBOUND_FORM_DATA:(state, outboundFormData)=>{
    state.outboundFormData = outboundFormData
  },
  SET_OUTBOUND_FILELIST:(state, outboundFileList)=>{
    state.outboundFileList = outboundFileList
  },
  SET_OUTBOUND_LIST:(state, outboundList)=>{
    state.outboundList = outboundList
  },
  SET_OUTBOUND_INFO:(state, outboundInfo)=>{
    state.outboundInfo = outboundInfo
  },
  
  
};

const actions = {
  setInboundInformation({ commit }, data) {
    commit('SET_INBOUND_INFORMATION', data)
  },
  setGoodsReceiptInfo({ commit }, data) {
    commit('SET_GOODS_RECEIPT_INFO', data)
  },
  setShipmentsInfo({ commit }, data) {
    commit('SET_SHIPMENTS_INFO', data)
  },
  setDemandPlanningInfo({ commit }, data) {
    commit('SET_DEMAND_PLANNING_INFO', data)
  },
  setMateriaList({ commit }, data) {
    commit('SET_MATERIA_LIST', data)
  },
  setSelectStoreData({ commit }, data) {
    commit('SET_SELECTSTOREDATA', data)
  },
  setSelectGoodData({ commit }, data) {
    commit('SET_SELECTGOODDATA', data)
  },
  setSelectGoodDataEdit({ commit }, data) {
    commit('SET_SELECTGOODDATA_EDIT', data)
  },
  setInterfaceMateriaList({ commit }, data) {
    commit('SET_INTERFACE_MATERIA_LIST', data)
  },
  setGoodsList({commit},data){
    commit('SET_GOODS_LIST', data)
  },
  setHistoryList({commit}, data){
    commit('SET_HISTORY_LIST', data)
  },
  setGoodsSelect({commit}, data){
    commit('SET_GOODS_SELECT', data)
  },
  
  setEditSendGoods({commit}, data){
    commit('SET_EDIT_GOODS_SELECT', data)
  },
   setEditGoods({commit}, data){
    commit('SET_EDIT_GOODS', data)
  },
  setHistoryData({commit}, data){
    commit('SET_HISTORY_DATA', data)
  },
  setScrollPosition({commit}, data){
    commit('SET_SCROLL_POSITION', data)
  },
  setMateriaData({commit}, data){
    commit('SET_MATERIA_DATA', data)
  },
  setOutboundData({commit}, data){
    commit('SET_OUTBOUND_DATA', data)
  },
  setOutboundFormData({commit}, data){
    commit('SET_OUTBOUND_FORM_DATA', data)
  },
  setoutboundFileList({commit}, data){
    commit('SET_OUTBOUND_FILELIST', data)
  },
  setOutboundList({commit}, data){
    commit('SET_OUTBOUND_LIST', data)
  },
  setOutboundInfo({commit}, data){
    commit('SET_OUTBOUND_INFO', data)
  }
  
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
