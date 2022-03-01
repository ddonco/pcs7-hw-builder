<script lang="ts">
import { defineComponent } from "vue";
import ColumnNameConfig from "/@/components/ColumnNameConfig.vue";
import IOTypeIdentifier from "/@/components/IOTypeIdentifier.vue";
import IOAddressStart from "../components/IOAddressStart.vue";

export default defineComponent({
  name: "BuildHW",
  components: {
    ColumnNameConfig,
    IOTypeIdentifier,
    IOAddressStart,
  },
  methods: {
    filePathChange: function (event: any) {
      let filePath = event.target.files[0].path;
      window.api.send("toMain", { assignedIoFilePath: filePath });
    },
    parseIoClick: function (event: any) {
      window.api.send("toMain", { parseIoFilePath: true });
    },
    groupIOAddressChange: function (event: any) {
      console.log(event.target.checked);
    },
  },
  // mounted() {
  //   this.$nextTick(function () {
  //     window.api.receive("fromMain", (data: any) => {
  //       console.log(`Received "${data}" from main process`);
  //     });
  //     window.api.send("toMain", "right back at cha");
  //   });
  // },
});
</script>

<template>
  <div class="px-2 w-full">
    <div class="flex flex-row pt-2 items-center cursor-default">
      <div class="w-52 font-semibold">I/O Assignment List:</div>
      <input
        class="block w-full text-sm text-gray-900 bg-gray-50 rounded border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
        aria-describedby="file_path_help"
        id="file_path"
        type="file"
        v-on:change="filePathChange"
      />
    </div>
    <div class="flex flex-row pt-4">
      <div class="w-full divide-y divide-gray-500 cursor-default font-semibold">
        <div>Column Names</div>
        <div></div>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="w-full">
        <div class="flex pt-1 text-center divide-x divide-gray-500">
          <ColumnNameConfig :columnName="'Tag Name'" :columnId="'tagName'" />
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
    <div class="flex flex-row pt-6 cursor-default">
      <div class="w-full divide-y divide-gray-500 cursor-default font-semibold">
        <div>I/O Type Identifiers</div>
        <div></div>
      </div>
    </div>
    <div class="flex flex-row">
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
    <div class="flex flex-row pt-6 cursor-default">
      <div class="w-full divide-y divide-gray-500 cursor-default font-semibold">
        <div>Parse Assigned IO</div>
        <div>
          <div class="pt-2 w-full text-center">
            <button
              type="button"
              class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              v-on:click="parseIoClick"
            >
              Parse IO
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-row pt-2 cursor-default">
      <div class="w-full divide-y divide-gray-500 cursor-default font-semibold">
        <div>Module Address Configuration</div>
        <div></div>
      </div>
    </div>
    <div class="flex flex-row">
      <div class="w-full cursor-default">
        <p class="text-xs text-gray-500">
          Specify start address for each I/O type. I/O addresses can optionally
          be grouped, such that DI, DO, AI, and AO addresses are grouped into
          disticnt address ranges.
        </p>
        <div class="flex items-center text-sm">
          <div class="pr-2">Group I/O Addresses by Type</div>
          <div>
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
    <div class="flex flex-row pt-6 cursor-default">
      <div class="w-full divide-y divide-gray-500 cursor-default font-semibold">
        <div>Generate HW Config</div>
        <div>
          <div class="pt-4 w-full text-center">
            <button
              type="button"
              class="w-40 text-blue-700 hover:text-white border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-blue-500 dark:text-blue-500 dark:hover:text-white dark:hover:bg-blue-600 dark:focus:ring-blue-800"
            >
              Generate HW
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
