import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  ioFilePath: string;
  driveFilePath: string;
  ioColumnNames: {
    tagName: string;
    description: string;
    rack: string;
    slot: string;
    channel: string;
    ioType: string;
  };
  driveColumnNames: {
    tagName: string;
    description: string;
    driveType: string;
    currentRating: string;
  };
  headers: string[];
  ioTypeIdentifiers: {
    di: string[];
    do: string[];
    ai: string[];
    ao: string[];
  };
  driveTypeIdentifiers: {
    drive: string[];
  };
  startAddress: { [type: string]: number };
  hardwareInfo: { [type: string]: number };
  logs: string[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    ioFilePath: "",
    driveFilePath: "",
    ioColumnNames: {
      tagName: "",
      description: "",
      rack: "",
      slot: "",
      channel: "",
      ioType: "",
    },
    driveColumnNames: {
      tagName: "",
      description: "",
      driveType: "",
      currentRating: "",
    },
    headers: [],
    ioTypeIdentifiers: {
      di: [],
      do: [],
      ai: [],
      ao: [],
    },
    driveTypeIdentifiers: {
      drive: [],
    },
    startAddress: {
      di: 0,
      do: 0,
      ai: 512,
      ao: 512,
    },
    hardwareInfo: {},
    logs: [],
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
    SET_TYPE_IDENTIFIERS(state, [ioType, identifiers]) {
      if (ioType === "DI") {
        state.ioTypeIdentifiers.di = identifiers;
      }
      if (ioType === "DO") {
        state.ioTypeIdentifiers.do = identifiers;
      }
      if (ioType === "AI") {
        state.ioTypeIdentifiers.ai = identifiers;
      }
      if (ioType === "AO") {
        state.ioTypeIdentifiers.ao = identifiers;
      }
    },
    SET_HARDWARE_INFO(state, hardwareInfo: {}) {
      state.hardwareInfo = hardwareInfo;
    },
    SET_START_ADDRESSES(state, addresses: {}) {
      state.startAddress = addresses;
    },
    SET_LOGS(state, logs: any) {
      state.logs = logs["logs"];
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
      commit("SET_HEADERS", headers);
    },
    setTypeIdentifiers({ commit }, [ioType, identifiers]) {
      commit("SET_TYPE_IDENTIFIERS", [ioType, identifiers]);
    },
    setHardwareInfo({ commit }, hardwareInfo) {
      commit("SET_HARDWARE_INFO", hardwareInfo);
    },
    setStartAddresses({ commit }, groupedAddresses) {
      commit("SET_START_ADDRESSES", groupedAddresses);
    },
    setLogs({ commit }, logs) {
      commit("SET_LOGS", logs);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
