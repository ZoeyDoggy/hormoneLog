<script setup>
  import { ref, watch } from "vue";

  import Table from "./components/Table.vue";

  const URL = ref(localStorage.getItem("URL"));

  watch(URL, (newURL) => {
    localStorage.setItem("URL", newURL);
  })

  const injections = ref();
  const tests = ref();
</script>

<template>

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
    

  <div style="display: flex;">
    <Table :URL="URL" :path="'injections'" id="injectionsTable" @update="callback => injections = callback"></Table>
  
    <Table :URL="URL" :path="'tests'" id="testsTable" @update="callback => tests = callback"></Table>
  </div>
</template>

<style scoped>

#injectionsTable {
  width: 60%;
}
#testsTable {
  width: 40%;
}

</style>
