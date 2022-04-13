<script lang="ts">
import { useStore } from "/@/store/index";

export default {
  name: "Logs",
  mounted() {
    const store = useStore();

    this.$nextTick(function () {
      window.api.send("toMain", {
        updateLogs: true,
      });
      window.api.receive("fromMain", (data: any) => {
        store.dispatch("setLogs", data);
      });
    });
  },
  computed: {
    currentLogs: function () {
      const store = useStore();
      return store.state.logs;
    },
  },
};
</script>

<template>
  <div class="pl-2">
    <h3 class="text-lg font-bold">Application Logs</h3>
    <ul class="text-sm">
      <li class="mb-2" v-for="(log, index) in currentLogs" :key="index">
        {{ log }}
      </li>
    </ul>
  </div>
</template>
