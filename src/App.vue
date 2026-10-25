<script setup>
  import { ref, onMounted, watch } from "vue";

  import Table from "./components/Table.vue";
  import Graph from "./components/Graph.vue";
  import Calendar from "./components/Calendar.vue";

  const URL = ref(localStorage.getItem("URL"));

  watch(URL, (newURL) => {
    localStorage.setItem("URL", newURL);
  })

  const injections = ref();
  const tests = ref();

  const recipients = ref([]);
  const focusedRecipient = ref(localStorage.getItem("recipient"))

  const activeData = ref({'uuid': [], 'date': ''});

  watch(focusedRecipient, (newRecipient) => {
    localStorage.setItem("recipient", newRecipient);
  })

  onMounted(() => {
        watch(() => injections.value, () => {
          recipients.value = Array.from( new Set( injections.value.map(a => a.recipient)));
          // console.log(Array.from( new Set( injections.value.map(a => a.ester) ) ))
        })
        watch(() => tests.value, () => {
          // console.log(Array.from( new Set( tests.value.map(a => a.test) ) ))
          // console.log(Array.from( new Set( tests.value.map(a => a.unit) ) ))
        })
    })
</script>

<template>

  <div>{{ activeData }}</div>

  <div class="inputDiv">
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
  </div>

  <div class="inputDiv">
    <select v-model="focusedRecipient">
      <option v-for="name in recipients" :value="name">
        {{ name }}
      </option>
    </select>
  </div>
    
  <Graph :recipient="focusedRecipient" :injectionsData="injections" :testsData="tests"></Graph>

  <div id="dataView">
    <Calendar :recipient="focusedRecipient" :injectionsData="injections" :testsData="tests" :activeData="activeData" @activeData="(data) => activeData = data"></Calendar>

    <Table :recipient="focusedRecipient" :URL="URL" :path="'injections'" id="injectionsTable" @update="callback => injections = callback"></Table>
  
    <Table :recipient="focusedRecipient" :URL="URL" :path="'tests'" id="testsTable" @update="callback => tests = callback"></Table>
  </div>
</template>

<style>

  #dataView {
    width: 100%;
    height: 100%;
    overflow: hidden;

    display: flex;

    justify-content: space-between;

    gap: 10px;
  }

  #calendar {
    flex-grow: 1;
  }

  #injectionsTable {
    flex-grow: 2;
  }
  
  #testsTable {
    flex-grow: 2;
  }

  .inputDiv {
    padding: 2px;
  }

  input, select {
    width: 100%;
    height: 100%;
    border: none;
    border-radius: 5px;
    box-sizing: border-box;

    padding: 2px 5px 2px 5px;

    color: var(--ctp-macchiato-text);
    background-color: var(--ctp-macchiato-surface0);
  }

  input::-webkit-input-placeholder, select::-webkit-input-placeholder {
    color: var(--ctp-macchiato-subtext0);
  }

</style>
