<script lang="ts">
export default {
  name: "NavSideBar",
};
</script>

<template>
  <div>
    <aside
      class="flex flex-col w-max items-center bg-white text-gray-700 shadow h-full"
    >
      <!-- Side Nav Bar-->
      <ul>
        <!-- Items Section -->
        <li class="hover:bg-gray-100">
          <router-link to="/">
            <a
              href="."
              class="h-16 px-4 flex justify-center items-center w-full"
            >
              Build HW
            </a>
          </router-link>
        </li>

        <li class="hover:bg-gray-100">
          <router-link to="/build-drives">
            <a
              href="."
              class="h-16 px-4 flex justify-center items-center w-full"
            >
              Build Drives
            </a>
          </router-link>
        </li>

        <li class="hover:bg-gray-100">
          <router-link to="/hw-selection">
            <a
              href="."
              class="h-16 px-4 flex justify-center items-center w-full"
            >
              HW Selection
            </a>
          </router-link>
        </li>

        <li class="hover:bg-gray-100">
          <router-link to="/assign-io">
            <a
              href="."
              class="h-16 px-4 flex justify-center items-center w-full"
            >
              Assign IO
            </a>
          </router-link>
        </li>

        <li class="hover:bg-gray-100">
          <router-link to="/logs">
            <a
              href="."
              class="h-16 px-4 flex justify-center items-center w-full"
            >
              Logs
            </a>
          </router-link>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style>
.active {
  @apply text-orange-500;
}
</style>
