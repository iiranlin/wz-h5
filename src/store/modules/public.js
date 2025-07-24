const state = {
  materiaList: [],
  interfaceMateriaList: [],
  historyList: JSON.parse(localStorage.getItem('historyList')) || {},
  sendGoods:{},
  goodsSelect:[],
  editSendGoods:{},
  editGoods:{},
  historyData: {},
  scrollPosition: 0
};

const mutations = {
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
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
    state.scrollPosition = scrollPosition
  }
};

const actions = {
  setMateriaList({ commit }, data) {
    commit('SET_MATERIA_LIST', data)
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
