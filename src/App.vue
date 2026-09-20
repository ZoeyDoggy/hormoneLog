<script setup>
  import { ref, watch } from "vue";

  const URL = ref(localStorage.getItem("URL"));

  watch(URL, (newURL) => {
    localStorage.setItem("URL", newURL);
  })

  console.log(`${URL.value}/injections`)
  fetch(`${URL.value}/injections`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => {
    response.json()
        .then((response) => {
            console.log(response)
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

  <div>
    <input type="datetime-local">

    <label for="ester-select">ester</label>
    <select name="pets" id="ester-select">
      <option value="dog">Valerate</option>
      <option value="cat">Enanthate</option>
    </select>

    <label for="concentration">concentration (mg/mL):</label>
    <input type="number" id="concentration" name="concentration" min="0" />

    <label for="dose">dose (mL):</label>
    <input type="number" id="dose" name="dose" min="0" />
    
    <label for="site">site:</label>
    <input type="text" id="site" name="site" />

    <label for="recipient">recipient:</label>
    <input type="text" id="recipient" name="recipient" />

    <label for="vial">vial ID:</label>
    <input type="text" id="vial" name="vial" />

    <label for="notes">notes:</label>
    <input type="text" id="notes" name="notes" />

    
    <form action="" method="get" class="form-example">
      <div class="form-example">
        <label for="name">Enter your name: </label>
        <input type="text" name="name" id="name" required />
      </div>
      <div class="form-example">
        <label for="email">Enter your email: </label>
        <input type="email" name="email" id="email" required />
      </div>
      <div class="form-example">
        <input type="submit" value="Subscribe!" />
      </div>
    </form>

  </div>
</template>

<style scoped></style>
