<script lang="ts">
import { defineComponent } from "vue";
import ColumnNameSelect from "./ColumnNameSelect.vue";

export default defineComponent({
  name: "ColumnNameConfig",
  props: {
    columnName: String,
    columnId: String,
  },
  components: {
    ColumnNameSelect,
  },
  data() {
    return {
      headers: ["TagID", "Service", "IO Type"],
    };
  },
});
</script>

<template>
  <div class="flex-col w-full px-2 cursor-default">
    <div class="flex-row">
      <h3>{{ columnName }}</h3>
    </div>
    <div class="flex-row">
      <ColumnNameSelect :columnId="columnId" :columnHeaders="headers" />
    </div>
  </div>
</template>
