<script lang="ts">
import NavSideBar from "./components/NavSideBar.vue";
import ProjectTitle from "./components/ProjectTitle.vue";

export default {
  name: "App",
  components: {
    NavSideBar,
    ProjectTitle,
  },
};
</script>

<template>
  <div class="h-screen w-screen flex bg-gray-200 border-2">
    <!-- container -->
    <NavSideBar />
    <div class="flex flex-col w-full">
      <div class="flex flex-row h-min">
        <ProjectTitle />
      </div>
      <div class="flex flex-row h-full">
        <!-- content area -->
        <router-view />
      </div>
    </div>
  </div>
</template>
