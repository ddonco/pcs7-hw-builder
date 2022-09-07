import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";

export interface State {
  ioFilePath: string;
  driveFilePath: string;
  columnNames: { [type: string]: string };
  headers: string[];
  typeIdentifiers: { [type: string]: string[] };
  startAddress: { [type: string]: number };
  hardwareInfo: { [type: string]: number };
  driveInfo: { [type: string]: number };
  groupIOAddresses: boolean;
  enableAllChannels: boolean;
  pips: { [type: string]: number };
  logs: string[];
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
  state: {
    ioFilePath: "",
    driveFilePath: "",
    columnNames: {
      tagName: "",
      description: "",
      rack: "",
      slot: "",
      channel: "",
      ipAddress: "",
      nodeAddress: "",
      ioType: "",
      driveType: "",
      ampRating: "",
    },
    headers: [],
    typeIdentifiers: {
      di: [],
      do: [],
      ai: [],
      ao: [],
      vfd: [],
      fvnr: [],
      fvr: [],
    },
    startAddress: {
      di: 0,
      do: 0,
      ai: 512,
      ao: 512,
      drive: 1000,
      node: 1,
      iosubsys: 100,
    },
    hardwareInfo: {},
    driveInfo: {},
    groupIOAddresses: false,
    enableAllChannels: false,
    pips: {
      analogPIP: 3,
      digitalPIP: 4,
      drivePIP: 4,
    },
    logs: [],
  },
  mutations: {
    SET_IOFILE_PATH(state, filePath) {
      if (filePath) state.ioFilePath = filePath;
    },
    SET_DRIVEFILE_PATH(state, filePath) {
      if (filePath) state.driveFilePath = filePath;
    },
    ASSIGN_COLUMN(state, [column, header]: string[]) {
      if (
        column === "tagName" ||
        column === "description" ||
        column === "rack" ||
        column === "slot" ||
        column === "channel" ||
        column === "ipAddress" ||
        column === "nodeAddress" ||
        column === "ioType" ||
        column === "driveType" ||
        column === "ampRating"
      ) {
        state.columnNames[column] = header;
      }
    },
    SET_HEADERS(state, headers: string[]) {
      if (headers) {
        state.headers = headers;
      }
    },
    SET_TYPE_IDENTIFIERS(state, [ioType, identifiers]) {
      if (ioType === "DI") {
        state.typeIdentifiers.di = identifiers;
      }
      if (ioType === "DO") {
        state.typeIdentifiers.do = identifiers;
      }
      if (ioType === "AI") {
        state.typeIdentifiers.ai = identifiers;
      }
      if (ioType === "AO") {
        state.typeIdentifiers.ao = identifiers;
      }
      if (ioType === "VFD") {
        state.typeIdentifiers.vfd = identifiers;
      }
      if (ioType === "FVNR") {
        state.typeIdentifiers.fvnr = identifiers;
      }
      if (ioType === "FVR") {
        state.typeIdentifiers.fvr = identifiers;
      }
    },
    SET_HARDWARE_INFO(state, hardwareInfo: {}) {
      state.hardwareInfo = hardwareInfo;
    },
    SET_DRIVE_INFO(state, driveInfo: {}) {
      state.driveInfo = driveInfo;
    },
    SET_INDIVIDUAL_ADDRESS(state, [type, address]) {
      state.startAddress[type] = address;
    },
    SET_START_ADDRESSES(state, addresses) {
      state.startAddress = addresses;
    },
    SET_GROUP_IO_ADDRESSES(state, groupIOAddresses) {
      state.groupIOAddresses = groupIOAddresses;
    },
    SET_ENABLE_ALL_CHANNELS(state, enableAllChannels) {
      state.enableAllChannels = enableAllChannels;
    },
    SET_PIP(state, [pip, value]) {
      state.pips[pip] = value;
    },
    SET_LOGS(state, logs: any) {
      state.logs = logs["logs"];
    },
  },
  actions: {
    setIoFilePath({ commit }, filePath) {
      commit("SET_IOFILE_PATH", filePath);
    },
    setDriveFilePath({ commit }, filePath) {
      commit("SET_DRIVEFILE_PATH", filePath);
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
    setDriveInfo({ commit }, driveInfo) {
      commit("SET_DRIVE_INFO", driveInfo);
    },
    setIndividualAddress({ commit }, [type, address]) {
      commit("SET_INDIVIDUAL_ADDRESS", [type, address]);
    },
    setStartAddresses({ commit }, groupAddresses) {
      commit("SET_START_ADDRESSES", groupAddresses);
    },
    setGroupIOAddresses({ commit }, groupIOAddresses) {
      commit("SET_GROUP_IO_ADDRESSES", groupIOAddresses);
    },
    setEnableAllChannels({ commit }, enableAllChannels) {
      commit("SET_ENABLE_ALL_CHANNELS", enableAllChannels);
    },
    setPIP({ commit }, [pip, value]) {
      commit("SET_PIP", [pip, value]);
    },
    setLogs({ commit }, logs) {
      commit("SET_LOGS", logs);
    },
  },
});

export function useStore() {
  return baseUseStore(key);
}
