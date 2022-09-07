<script lang="ts">
import NavSideBar from "./components/NavSideBar.vue";

export default {
  name: "App",
  components: {
    NavSideBar,
  },
  // mounted() {
  //   this.$nextTick(function () {
  //     window.api.receive("fromMain", (data: any) => {
  //       console.log(`Received: ${JSON.stringify(data)}`);
  //     });
  //   });
  // },
};
</script>

<template>
  <div class="h-screen w-screen flex bg-white border-2">
    <!-- container -->
    <NavSideBar />
    <div class="flex flex-col w-full">
      <div class="flex flex-row h-full">
        <!-- content area -->
        <router-view />
      </div>
    </div>
  </div>
</template>
