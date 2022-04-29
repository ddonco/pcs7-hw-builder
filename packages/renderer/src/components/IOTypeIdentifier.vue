<script lang="ts">
import { isFunctionType } from "@vue/compiler-core";
import { defineComponent } from "vue";
import { useStore } from "/@/store/index";

export default defineComponent({
  props: {
    ioType: String,
    examples: String,
  },
  setup() {
    const store = useStore();
    const identifierChange = (event: any, ioType: string | undefined) => {
      const identifiers = event.target.value.split(",");
      store.dispatch("setTypeIdentifiers", [ioType, identifiers]);
    };
    return {
      identifiers: "",
      identifierChange,
    };
  },
});
</script>

<template>
  <div class="flex flex-row pt-2">
    <div class="group cursor-default relative inline-block w-12 pr-2">
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
      spellcheck="false"
      v-model="identifiers"
      v-on:input="identifierChange($event, ioType)"
    />
  </div>
</template>
