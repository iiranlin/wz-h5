const state = {
  materiaList: null,
  sendGoods:{},
  historyList: sessionStorage.getItem('historyList') || []
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
  }
};

const actions = {
  setMateriaList({ commit }, data) {
    commit('SET_MATERIA_LIST', data)
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
