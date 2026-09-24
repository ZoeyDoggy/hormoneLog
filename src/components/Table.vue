<script setup>
    import { ref } from "vue";

    const props = defineProps(['URL', 'path']);

    const result = ref();

    console.log(props.path)

    fetch(`${props.URL}/${props.path}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => {
    response.json()
        .then((response) => {
            console.log(response.message)
            result.value = response.message;
        })
    })
</script>



<template>

    <div>tests</div>

    <table>
        <thead>
        <tr>
            
            <template v-for="item in Object.keys(result[0])">
            <th  v-if="item != 'uuid'">{{ item }}</th>
            </template>

        </tr>
        </thead>
        <tbody>
        
        <tr v-for="row in result">
            <template v-for="(data, key) in row">
            <td v-if="key != 'uuid'">{{ data }}</td>
            </template>
            <td><input type="button" value="edit"></td>
            <td><input type="button" value="delete"></td>
        </tr>

        <tr>
            <template v-for="(item, key) in result[0]">
            <td v-if="key != 'uuid'">
                <input :placeholder="key">
            </td>
            </template>
            <td><input type="button" value="submit"></td>
        </tr>

        </tbody>
    </table>

</template>



<style scoped>

    table {
        border-color: red;
        border-style: solid;
    }
</style>