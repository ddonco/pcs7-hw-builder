<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "/@/store/index";

export default defineComponent({
  props: {
    pipType: String,
  },
  setup() {
    const store = useStore();
    const pipChange = (event: any, pipType: String) => {
      store.dispatch("setPIP", [
        String(pipType).toLowerCase() + "PIP",
        parseInt(event.target.value, 10),
      ]);
    };
    return { pipChange };
  },
  computed: {
    pip: function () {
      const store = useStore();
      let pips = store.state.pips;
      return pips[String(this.pipType).toLowerCase() + "PIP"];
    },
  },
});
</script>

<template>
  <div class="flex flex-row pt-2">
    <div
      class="group cursor-default relative inline-block w-30 pr-2 font-normal"
    >
      {{ pipType }} PIP:
    </div>
    <input
      class="w-20 pr-2 text-right rounded border border-gray-300"
      type="text"
      v-model="pip"
      v-on:change="pipChange($event, pipType)"
    />
  </div>
</template>
