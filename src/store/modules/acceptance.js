
const acceptance = {
    state: {
      activeTab: ""
    },
    mutations: {
      setActiveTab(state, tab) {
       state.activeTab = tab;
      }

    },
    actions: {
      updateActiveTab({ commit }, tab) {
        commit('setActiveTab', tab);
      }
    },
}
export default acceptance