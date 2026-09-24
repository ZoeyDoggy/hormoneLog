<script setup>
  import { ref, watch } from "vue";

  import Table from "./components/Table.vue";

  const URL = ref(localStorage.getItem("URL"));

  watch(URL, (newURL) => {
    localStorage.setItem("URL", newURL);
  })
</script>

<template>

  <Table :URL="URL" :path="'injections'"></Table>
  <Table :URL="URL" :path="'tests'"></Table>

  <input
    type="url"
    name="url"
    id="url"
    placeholder="http://localhost:3000"
    pattern="http://.*"
    size="30"
    required 
    :value="URL"
    @change="event => URL = event.target.value"/>
</template>

<style scoped>

</style>
