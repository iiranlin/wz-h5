const state = {
  materiaList: null,
};

const mutations = {
  SET_MATERIA_LIST: (state, materiaList) => {
    state.materiaList = materiaList;
  },
};

const actions = {
  setMateriaList({ commit }, data) {
    commit('SET_MATERIA_LIST', data)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
