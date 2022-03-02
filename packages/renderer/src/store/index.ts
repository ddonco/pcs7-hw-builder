import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  ioFilePath: string;
  ioColumnNames: {
    tagName: string;
    description: string;
    rack: string;
    slot: string;
    channel: string;
    ioType: string;
  };
  headers: string[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    ioFilePath: "",
    ioColumnNames: {
      tagName: "",
      description: "",
      rack: "",
      slot: "",
      channel: "",
      ioType: "",
    },
    headers: [],
  },
  mutations: {
    SET_FILE_PATH(state, filePath) {
      if (filePath) state.ioFilePath = filePath;
    },
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
    SET_HEADERS(state, headers: string[]) {
      if (headers) {
        state.headers = headers;
      }
    },
  },
  actions: {
    setFilePath({ commit }, filePath) {
      commit("SET_FILE_PATH", filePath);
    },
    assignColumnHeader({ commit }, [column, header]) {
      commit("ASSIGN_COLUMN", [column, header]);
    },
    setHeaders({ commit }, headers) {
      console.log(`commit: ${headers}`);
      commit("SET_HEADERS", headers);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
