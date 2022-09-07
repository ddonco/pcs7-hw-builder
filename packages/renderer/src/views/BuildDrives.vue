<script lang="ts">
import { useStore } from "/@/store/index";
import ProjectTitle from "/@/components/ProjectTitle.vue";
import ColumnNameConfig from "/@/components/ColumnNameConfig.vue";
import IOTypeIdentifier from "/@/components/IOTypeIdentifier.vue";
import IOAddressStart from "../components/IOAddressStart.vue";
import ProcImagePartition from "../components/ProcImagePartition.vue";

export default {
  name: "BuildDrives",
  components: {
    ProjectTitle,
    ColumnNameConfig,
    IOTypeIdentifier,
    IOAddressStart,
    ProcImagePartition,
  },
  setup() {
    const store = useStore();

    const setDriveFilePath = (event: any, filePath: string) => {
      store.dispatch("setDriveFilePath", filePath);
    };

    const parseHeaders = (event: any) => {
      if (store.state.driveFilePath) {
        window.api.send("toMain", {
          assignedDriveFilePath: store.state.driveFilePath,
        });
        window.api.receive("fromMain", (data: any) => {
          store.dispatch("setHeaders", data.parsedHeaders);
        });
      }
    };

    // const parseDrives = (event: any) => {
    //   let parserInputs = {
    //     filePath: store.state.driveFilePath,
    //     columnNames: store.state.columnNames,
    //     identifiers: store.state.typeIdentifiers,
    //   };
    //   window.api.send("toMain", {
    //     parseDrives: true,
    //     payload: JSON.stringify(parserInputs),
    //   });
    //   window.api.receive("fromMain", (data: any) => {
    //     store.dispatch("setDriveInfo", data.parseDrives);
    //   });
    // };

    const getGroupedAddresses = (grouped: boolean) => {
      let groupedAddresses = {};
      if (grouped) {
        groupedAddresses = {
          drive: store.state.hardwareInfo.driveTotalBytes,
        };
      } else {
        groupedAddresses = {
          drive: 1000,
        };
      }
      store.dispatch("setStartAddresses", groupedAddresses);
    };

    const generateDriveConfig = (event: any) => {
      const builderInputs = {
        filePath: store.state.driveFilePath,
        columnNames: store.state.columnNames,
        identifiers: store.state.typeIdentifiers,
        startAddress: store.state.startAddress,
      };
      window.api.send("toMain", {
        generateDriveConfig: true,
        payload: JSON.stringify(builderInputs),
      });
    };
    return {
      setDriveFilePath,
      parseHeaders,
      getGroupedAddresses,
      generateDriveConfig,
      driveFilePath: "",
    };
  },
  methods: {
    filePathChange: function (event: any) {
      let filePath = event.target.files[0].path;
      if (filePath) {
        this.driveFilePath = filePath;
        this.setDriveFilePath(event, filePath);
      }
    },
    clearInput: function (event: any) {
      (this.$refs["driveFilePath"] as HTMLInputElement).value = "";
    },
  },
};
</script>

<template>
  <div class="px-2 w-full">
    <div class="flex flex-row h-min">
      <ProjectTitle :projectType="'drive'" />
    </div>
    <div class="flex pl-2 bg-gray-100">
      <div class="text-3xl self-center">1.</div>
      <div class="flex flex-row pt-4 pb-2 pl-2 cursor-default">
        <div class="w-38 h-min font-semibold">Motor List:</div>
        <input
          id="file_path"
          ref="driveFilePath"
          once
          class="block w-100 h-min text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_path_help"
          type="file"
          v-on:click="clearInput"
          v-on:change="filePathChange"
        />
        <button
          class="h-7 mx-2 px-2 font-medium text-sm text-gray-900 bg-white rounded border border-gray-400 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
          v-on:click="parseHeaders"
        >
          Parse Headers
        </button>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-50">
      <div class="text-3xl self-start">2.</div>
      <div class="w-full">
        <div class="flex flex-row pt-2 pl-2">
          <div
            class="w-full divide-y divide-gray-500 cursor-default font-semibold"
          >
            <div>Column Names</div>
            <div></div>
          </div>
        </div>
        <div class="flex flex-row pb-4">
          <div class="w-full">
            <div class="flex pt-1 text-center divide-x divide-gray-500">
              <ColumnNameConfig
                :column-name="'Tag Name'"
                :column-id="'tagName'"
              />
              <ColumnNameConfig
                :column-name="'IP Address'"
                :column-id="'ipAddress'"
              />
              <ColumnNameConfig
                :column-name="'Node Address'"
                :column-id="'nodeAddress'"
              />
              <ColumnNameConfig
                :column-name="'Drive Type'"
                :column-id="'driveType'"
              />
              <ColumnNameConfig
                :column-name="'Amp Rating'"
                :column-id="'ampRating'"
              />
            </div>
          </div>
        </div>
        <div class="flex flex-row pt-2 pl-2 cursor-default">
          <div
            class="w-full divide-y divide-gray-500 cursor-default font-semibold"
          >
            <div>Drive Type Identifiers</div>
            <div></div>
          </div>
        </div>
        <div class="flex flex-row pb-4 pl-2">
          <div class="w-full cursor-default">
            <p class="text-xs text-gray-500">
              Enter comma separated list of Drive type identifiers.
            </p>
            <IOTypeIdentifier :io-type="'VFD'" :examples="'VFD,VFD FS'" />
            <IOTypeIdentifier :io-type="'FVNR'" :examples="'FVNR'" />
            <IOTypeIdentifier :io-type="'FVR'" :examples="'FVR'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-100">
      <div class="text-3xl self-start">3.</div>
      <div>
        <div class="flex flex-row w-full pt-2 pl-2 cursor-default">
          <div
            class="w-full divide-y divide-gray-500 cursor-default font-semibold"
          >
            <div>Drive Address Configuration</div>
            <div></div>
          </div>
        </div>
        <div class="flex flex-row pb-4 pl-2 pr-2">
          <div class="w-full cursor-default">
            <p class="text-xs text-gray-500">
              Specify starting point for drive addresses.
            </p>
            <IOAddressStart :io-type="'Drive'" />
            <IOAddressStart :io-type="'Node'" />
            <IOAddressStart :io-type="'IOSubSys'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-200">
      <div class="text-3xl self-start">4.</div>
      <div class="flex flex-row w-full pt-2 pb-2 pl-2 cursor-default">
        <div
          class="w-full divide-y divide-gray-500 cursor-default font-semibold"
        >
          <div>Generate Drives HW Config</div>
          <div>
            <ProcImagePartition :pip-type="'Drive'" />
            <div class="pt-4 w-full text-center">
              <button
                type="button"
                class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                v-on:click="generateDriveConfig"
              >
                Generate Drives
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
