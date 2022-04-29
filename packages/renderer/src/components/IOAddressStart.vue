<script lang="ts">
import { defineComponent } from "vue";
import { useStore } from "/@/store/index";

export default defineComponent({
  props: {
    ioType: String,
  },
  methods: {
    addressChange: function (event: any) {
      console.log(this.address);
    },
  },
  computed: {
    address: function () {
      const store = useStore();
      let startAddresses = store.state.startAddress;
      return startAddresses[String(this.ioType).toLowerCase()];
    },
  },
});
</script>

<template>
  <div class="flex flex-row pt-2">
    <div class="group cursor-default relative inline-block w-22 pr-2">
      {{ ioType }} Start:
    </div>
    <input
      class="w-20 pr-2 text-right rounded border border-gray-300"
      type="text"
      v-model="address"
      v-on:change="addressChange"
    />
  </div>
</template>
