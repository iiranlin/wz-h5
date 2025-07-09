const state = {
  materiaList: null,
  interfaceMateriaList: null,
  sendGoods:{},
  historyList: sessionStorage.getItem('historyList') || [],
  goodsSelect:[],
  editSendGoods:{}
};

const mutations = {
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
  },
  SET_GOODS_LIST:(state,goodsList)=>{
    state.sendGoods = goodsList
  },
  SET_HISTORY_LIST:(state, historyList)=>{
    sessionStorage.setItem('historyList', historyList)
    state.historyList = historyList
  },
  SET_INTERFACE_MATERIA_LIST:(state, interfaceMateriaList)=>{
    sessionStorage.setItem('interfaceMateriaList', interfaceMateriaList)
    state.interfaceMateriaList = interfaceMateriaList
  },
  SET_GOODS_SELECT:(state,goodsSelect)=>{
    state.goodsSelect = goodsSelect
  },
  SET_EDIT_GOODS_SELECT:(state,editSendGoods)=>{
    state.editSendGoods = editSendGoods
  },

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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
