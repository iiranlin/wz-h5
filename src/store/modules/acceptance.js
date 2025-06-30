
const acceptance = {
    state: {
      activeTab: ""
    },
    mutations: {
      setActiveTab(state, tab) {
       console.log(tab,"tab")
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