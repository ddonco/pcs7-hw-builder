<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from '/@/store/index'

export default defineComponent({
  name: "ColumnNameSelect",
  props: {
    columnId: String,
    columnHeaders: Array
  },
  setup() {
    const store = useStore()
    const selectedColumnChange = (event: any, column: any, headers: any) => {
      let nameIndex = event.target.options.selectedIndex - 1
      let columnHeader = headers[nameIndex]
      store.dispatch("assignColumnHeader", [column, columnHeader])
    }

    return {
      selectedColumnChange,
    }
  },
  methods: {
  },
})
</script>

<template>
  <select class="cursor-pointer bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded focus:ring-blue-500 focus:border-blue-500 block w-full dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    v-on:change="selectedColumnChange($event, columnId, columnHeaders)">
    <option disabled selected class="text-gray-300">--select--</option>
    <option v-for="(col, index) in columnHeaders" :key="index">
      <option class="text-center">{{col}}</option>
    </option>
  </select>
</template>