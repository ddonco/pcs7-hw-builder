<script lang="ts">
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  components: {
    HelloWorld
  },
  mounted() {
    (this as any).$nextTick(function() {
      window.api.receive("fromMain", (data:any) => {
        console.log(`Received ${data} from main process`);
      });
      window.api.send("toMain", "parse IO");
    })
  },
}
</script>

<template>
  <img alt="Vue logo" src="../assets/logo.svg" width="150" />
  <HelloWorld msg="Hello Vue 3 + Vite" />
</template>