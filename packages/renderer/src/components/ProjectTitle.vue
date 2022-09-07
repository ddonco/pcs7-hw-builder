<script lang="ts">
import { useStore } from "/@/store/index";

export default {
  name: "ProjectTitle",
  props: {
    projectType: {
      type: String,
      default: "io",
    },
  },
  computed: {
    title: function () {
      const store = useStore();
      if (this.projectType === "io") {
        return store.state.ioFilePath;
      }
      if (this.projectType === "drive") {
        return store.state.driveFilePath;
      }
      return "";
    },
  },
};
</script>

<template>
  <div class="px-2 w-full divide-y divide-gray-500 cursor-default">
    <div>
      <h3 class="text-sm">Active Project: {{ title }}</h3>
    </div>
    <div></div>
  </div>
</template>
