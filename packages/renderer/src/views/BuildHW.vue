<script lang="ts">
import { defineComponent } from "vue";
import ColumnNameConfig from "/@/components/ColumnNameConfig.vue";
import IOTypeIdentifier from "/@/components/IOTypeIdentifier.vue";
import IOAddressStart from "../components/IOAddressStart.vue";
import ProcImagePartition from "../components/ProcImagePartition.vue";
import { useStore } from "/@/store/index";

export default defineComponent({
  name: "BuildHW",
  components: {
    ColumnNameConfig,
    IOTypeIdentifier,
    IOAddressStart,
    ProcImagePartition,
  },
  setup() {
    const store = useStore();

    const setIoFilePath = (event: any, filePath: string) => {
      store.dispatch("setIoFilePath", filePath);
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
        columnNames: store.state.columnNames,
        identifiers: store.state.typeIdentifiers,
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
          di: 0,
          do: store.state.hardwareInfo.diTotalBytes,
          ai: 512,
          ao: store.state.hardwareInfo.aiTotalBytes + 512,
        };
      } else {
        groupedAddresses = {
          di: 0,
          do: 0,
          ai: 512,
          ao: 512,
        };
      }
      store.dispatch("setStartAddresses", groupedAddresses);
    };

    const setEnableChannels = (enable: boolean) => {
      store.dispatch("setEnableAllChannels", enable);
    };

    const generateHwConfig = (event: any) => {
      if (Object.keys(store.state.hardwareInfo).length > 0) {
        window.api.send("toMain", {
          generateHwConfig: JSON.stringify(store.state.startAddress),
          buildOptions: JSON.stringify(""),
        });
      }
    };
    return {
      setIoFilePath,
      parseHeaders,
      parseAssignedIO,
      getGroupedAddresses,
      setEnableChannels,
      generateHwConfig,
      ioFilePath: "",
    };
  },
  methods: {
    filePathChange: function (event: any) {
      let filePath = event.target.files[0].path;
      if (filePath) {
        this.ioFilePath = filePath;
        this.setIoFilePath(event, filePath);
      }
    },
    clearInput: function (event: any) {
      (this.$refs["ioFilePath"] as HTMLInputElement).value = "";
    },
    groupIOAddressChange: function (event: any) {
      let grouped = event.target.checked;
      this.getGroupedAddresses(grouped);
    },
    enableAllChannels: function (event: any) {
      let enable = event.target.checked;
      this.setEnableChannels(enable);
    },
  },
});
</script>

<template>
  <div class="px-2 w-full">
    <div class="flex pl-2 bg-gray-100">
      <div class="text-3xl self-center">1.</div>
      <div class="flex flex-row pt-4 pb-2 pl-2 cursor-default">
        <div class="w-38 h-min font-semibold">I/O Assignment List:</div>
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
    <div class="flex pl-2 bg-purple-50">
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
                :columnName="'Tag Name'"
                :columnId="'tagName'"
              />
              <ColumnNameConfig
                :columnName="'Description'"
                :columnId="'description'"
              />
              <ColumnNameConfig :columnName="'I/O Type'" :columnId="'ioType'" />
              <ColumnNameConfig :columnName="'Rack'" :columnId="'rack'" />
              <ColumnNameConfig :columnName="'Slot'" :columnId="'slot'" />
              <ColumnNameConfig :columnName="'Channel'" :columnId="'channel'" />
            </div>
          </div>
        </div>
        <div class="flex flex-row pt-2 pl-2 cursor-default">
          <div
            class="w-full divide-y divide-gray-500 cursor-default font-semibold"
          >
            <div>I/O Type Identifiers</div>
            <div></div>
          </div>
        </div>
        <div class="flex flex-row pb-4 pl-2">
          <div class="w-full cursor-default">
            <p class="text-xs text-gray-500">
              Enter comma separated list of I/O type identifiers.
            </p>
            <IOTypeIdentifier
              :ioType="'DI'"
              :examples="'DI,Digital Input,DI Dry Contact'"
            />
            <IOTypeIdentifier
              :ioType="'DO'"
              :examples="'DO,Digital Output,DO High Side'"
            />
            <IOTypeIdentifier
              :ioType="'AI'"
              :examples="'AI,Analog Input,AI2,AI4'"
            />
            <IOTypeIdentifier :ioType="'AO'" :examples="'AO,Analog Output'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-purple-100">
      <div class="text-3xl self-start">3.</div>
      <div class="flex flex-row w-full pt-2 pb-2 pl-2 cursor-default">
        <div
          class="w-full divide-y divide-gray-500 cursor-default font-semibold"
        >
          <div>Parse Assigned IO</div>
          <div>
            <div class="pt-2 w-full text-center">
              <button
                type="button"
                class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                v-on:click="parseAssignedIO"
              >
                Parse IO
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-purple-200">
      <div class="text-3xl self-start">4.</div>
      <div>
        <div class="flex flex-row w-full pt-2 pl-2 cursor-default">
          <div
            class="w-full divide-y divide-gray-500 cursor-default font-semibold"
          >
            <div>Module Address Configuration</div>
            <div></div>
          </div>
        </div>
        <div class="flex flex-row pb-4 pl-2 pr-2">
          <div class="w-full cursor-default">
            <p class="text-xs text-gray-500">
              Specify start address for each I/O type. I/O addresses can
              optionally be grouped, such that DI, DO, AI, and AO addresses are
              grouped into disticnt address ranges.
            </p>
            <div class="flex items-center text-sm">
              <div class="pr-2">Group I/O Addresses by Type</div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="checked:bg-blue-500"
                  v-on:change="groupIOAddressChange"
                />
              </div>
            </div>
            <IOAddressStart :ioType="'DI'" />
            <IOAddressStart :ioType="'DO'" />
            <IOAddressStart :ioType="'AI'" />
            <IOAddressStart :ioType="'AO'" />
          </div>
        </div>
      </div>
    </div>
    <div class="flex pl-2 bg-purple-300">
      <div class="text-3xl self-start">5.</div>
      <div class="flex flex-row w-full pt-2 pb-2 pl-2 cursor-default">
        <div
          class="w-full divide-y divide-gray-500 cursor-default font-semibold"
        >
          <div>Generate HW Config</div>
          <div>
            <div class="flex items-center pt-2 text-sm font-normal">
              <div class="pr-2">Enable All Channels</div>
              <div class="flex items-center">
                <input
                  type="checkbox"
                  class="checked:bg-blue-500"
                  v-on:change="enableAllChannels"
                />
              </div>
            </div>
            <ProcImagePartition :pipType="'Digital'" />
            <ProcImagePartition :pipType="'Analog'" />
            <div class="pt-4 w-full text-center">
              <button
                type="button"
                class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                v-on:click="generateHwConfig"
              >
                Generate HW
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
