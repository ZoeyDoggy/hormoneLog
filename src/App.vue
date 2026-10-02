<script setup>
  import { ref, onMounted, watch } from "vue";

  import Table from "./components/Table.vue";
  import Graph from "./components/Graph.vue";

  const URL = ref(localStorage.getItem("URL"));

  watch(URL, (newURL) => {
    localStorage.setItem("URL", newURL);
  })

  const injections = ref();
  const tests = ref();

  const recipients = ref([]);
  const focusedRecipient = ref(localStorage.getItem("recipient"))

  watch(focusedRecipient, (newRecipient) => {
    localStorage.setItem("recipient", newRecipient);
  })

  onMounted(() => {
        watch(() => injections.value, () => {
          recipients.value = Array.from( new Set( injections.value.map(a => a.recipient)));
          console.log(Array.from( new Set( injections.value.map(a => a.ester) ) ))
        })
        watch(() => tests.value, () => {
          console.log(Array.from( new Set( tests.value.map(a => a.test) ) ))
          console.log(Array.from( new Set( tests.value.map(a => a.unit) ) ))
        })
    })
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

    <div>Selected: {{ focusedRecipient }}</div>

    <select v-model="focusedRecipient">
      <option v-for="name in recipients" :value="name">
        {{ name }}
      </option>
    </select>
    
    <Graph :recipient="focusedRecipient" :injectionsData="injections" :testsData="tests"></Graph>

  <div style="display: flex;">
    <Table :recipient="focusedRecipient" :URL="URL" :path="'injections'" id="injectionsTable" @update="callback => injections = callback"></Table>
  
    <Table :recipient="focusedRecipient" :URL="URL" :path="'tests'" id="testsTable" @update="callback => tests = callback"></Table>
  </div>
</template>

<style scoped>

#injectionsTable {
  width: 60%;
  background-color: var(--ctp-mocha-base);
}
#testsTable {
  width: 40%;
}

</style>
