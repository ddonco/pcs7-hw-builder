<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    ioType: String,
    examples: String,
  },
  setup() {
    return {
      identifiers: "",
    };
  },
  methods: {
    identifierChange: function (event: any) {
      console.log(this.identifiers);
    },
  },
});
</script>

<template>
  <div class="flex flex-row pt-2">
    <div class="group cursor-default relative inline-block w-10 pr-2">
      {{ ioType }}:
      <div
        class="opacity-0 w-40 bg-gray-600 text-white text-center text-xs rounded-lg py-1 absolute z-10 group-hover:opacity-100 bottom-full -left-1/2 ml-14 px-1 pointer-events-none"
      >
        Examples: {{ examples }}
        <svg
          class="absolute text-black h-2 w-full left-0 top-full"
          x="0px"
          y="0px"
          viewBox="0 0 255 255"
          xml:space="preserve"
        >
          <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
        </svg>
      </div>
    </div>
    <input
      class="xs:w-full sm:w-full md:w-140 lg:w-140 xl:w-140 2xl:w-140 rounded border border-gray-300"
      type="text"
      v-model="identifiers"
      v-on:change="identifierChange"
    />
  </div>
</template>
