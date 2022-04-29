<script lang="ts">
import { useStore } from "/@/store/index";
import ColumnNameConfig from "/@/components/ColumnNameConfig.vue";
import IOTypeIdentifier from "/@/components/IOTypeIdentifier.vue";
import IOAddressStart from "../components/IOAddressStart.vue";

export default {
  name: "BuildDrives",
  components: {
    ColumnNameConfig,
    IOTypeIdentifier,
    IOAddressStart,
  },
  setup() {
    const store = useStore();

    const setDriveFilePath = (event: any, filePath: string) => {
      store.dispatch("setDriveFilePath", filePath);
    };

    const parseHeaders = (event: any) => {
      if (store.state.ioFilePath) {
        window.api.send("toMain", {
          assignedIoFilePath: store.state.ioFilePath,
        });
        window.api.receive("fromMain", (data: any) => {
          store.dispatch("setHeaders", data.parsedHeaders);
        });
      }
    };

    const parseAssignedIO = (event: any) => {
      let parserInputs = {
        filePath: store.state.ioFilePath,
        columnNames: store.state.ioColumnNames,
        identifiers: store.state.ioTypeIdentifiers,
      };
      window.api.send("toMain", {
        parseAssignedIo: true,
        payload: JSON.stringify(parserInputs),
      });
      window.api.receive("fromMain", (data: any) => {
        store.dispatch("setHardwareInfo", data.parseAssignedIo);
      });
    };

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

    const generateHwConfig = (event: any) => {
      if (Object.keys(store.state.hardwareInfo).length > 0) {
        window.api.send("toMain", {
          generateHwConfig: JSON.stringify(store.state.startAddress),
        });
      }
    };
    return {
      setDriveFilePath,
      parseHeaders,
      parseAssignedIO,
      getGroupedAddresses,
      generateHwConfig,
      ioFilePath: "",
    };
  },
  methods: {
    filePathChange: function (event: any) {
      let filePath = event.target.files[0].path;
      if (filePath) {
        this.ioFilePath = filePath;
        this.setDriveFilePath(event, filePath);
      }
    },
    clearInput: function (event: any) {
      (this.$refs["ioFilePath"] as HTMLInputElement).value = "";
    },
  },
};
</script>

<template>
  <div class="px-2 w-full">
    <div class="flex pl-2 bg-gray-100">
      <div class="text-3xl self-center">1.</div>
      <div class="flex flex-row pt-4 pb-2 pl-2 cursor-default">
        <div class="w-38 h-min font-semibold">Motor List:</div>
        <input
          once
          class="block w-100 h-min text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          aria-describedby="file_path_help"
          id="file_path"
          ref="ioFilePath"
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
      <div class="text-3xl self-center">2.</div>
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
                :columnName="'Tag Name'"
                :columnId="'tagName'"
              />
              <ColumnNameConfig
                :columnName="'Description'"
                :columnId="'description'"
              />
              <ColumnNameConfig
                :columnName="'Drive Type'"
                :columnId="'driveType'"
              />
              <ColumnNameConfig
                :columnName="'Amp Rating'"
                :columnId="'ampRating'"
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
            <IOTypeIdentifier :ioType="'VFD'" :examples="'VFD,VFD FS'" />
            <IOTypeIdentifier :ioType="'FVRN'" :examples="'FVRN'" />
            <IOTypeIdentifier :ioType="'FVR'" :examples="'FVR'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-100">
      <div class="text-3xl self-center">3.</div>
      <div class="flex flex-row w-full pt-2 pb-2 pl-2 cursor-default">
        <div
          class="w-full divide-y divide-gray-500 cursor-default font-semibold"
        >
          <div>Parse Motor List</div>
          <div>
            <div class="pt-2 w-full text-center">
              <button
                type="button"
                class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                v-on:click="parseAssignedIO"
              >
                Parse Motors
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-200">
      <div class="text-3xl self-center">4.</div>
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
            <IOAddressStart :ioType="'Drive'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-emerald-300">
      <div class="text-3xl self-center">5.</div>
      <div class="flex flex-row w-full pt-2 pb-2 pl-2 cursor-default">
        <div
          class="w-full divide-y divide-gray-500 cursor-default font-semibold"
        >
          <div>Generate Drives HW Config</div>
          <div>
            <div class="pt-4 w-full text-center">
              <button
                type="button"
                class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                v-on:click="generateHwConfig"
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
