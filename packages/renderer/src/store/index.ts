import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  ioColumnNames: {
    tagName: string;
    description: string;
    rack: string;
    slot: string;
    channel: string;
    ioType: string;
  };
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    ioColumnNames: {
      tagName: "",
      description: "",
      rack: "",
      slot: "",
      channel: "",
      ioType: "",
    },
  },
  mutations: {
    ASSIGN_COLUMN(state, [column, header]: string[]) {
      if (
        column === "tagName" ||
        column === "description" ||
        column === "rack" ||
        column === "slot" ||
        column === "channel" ||
        column === "ioType"
      ) {
        state.ioColumnNames[column] = header;
      }
    },
  },
  actions: {
    assignColumnHeader({ commit }, [column, header]) {
      commit("ASSIGN_COLUMN", [column, header]);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
