const state = {
  materiaList: null,
  interfaceMateriaList: null,
  sendGoods:{},
  historyList: JSON.parse(sessionStorage.getItem('historyList')) || {}
};

const mutations = {
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
  },
  SET_GOODS_LIST:(state,goodsList)=>{
    state.sendGoods = goodsList
  },
  SET_HISTORY_LIST:(state, historyList)=>{
    sessionStorage.setItem('historyList', JSON.stringify(historyList))
    state.historyList = historyList
  },
  SET_INTERFACE_MATERIA_LIST:(state, interfaceMateriaList)=>{
    sessionStorage.setItem('interfaceMateriaList', interfaceMateriaList)
    state.interfaceMateriaList = interfaceMateriaList
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
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
