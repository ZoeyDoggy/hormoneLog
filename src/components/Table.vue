<script setup>
    import { ref, watch } from "vue";

    const props = defineProps(['URL', 'path']);
    console.log(props.path)

    const result = ref([{}]);

    const newEntry = ref({});

    const inputType = ref({
        'time': 'datetime-local',
        'concentration': 'number',
        'dose': 'number',
        'value': 'number',
    });

    fetch(`${props.URL}/${props.path}/`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    })
    .then((response) => {
    response.json()
        .then((response) => {
            //console.log(response.message)
            result.value = response.message;
        })
    })
    .catch((error) => {
        console.error(`onRejected function called: ${error.message}`);
    })
</script>

<template>
    <div>
       <table>
            <thead>
                <tr>
                    <template v-for="item in Object.keys(result[0])">
                        <th  v-if="item != 'uuid'">{{ item }}</th>
                    </template>
        
                </tr>
            </thead>

            <tbody>
           
                <tr v-for="row in result" :key="row.uuid">
                    <template v-for="(data, key) in row">
                        <td v-if="key != 'uuid'">{{ data }}</td>
                    </template>
                    <td><input type="button" value="edit"></td>
                    <td><input type="button" value="delete"></td>
                </tr>
        
                <tr>
                    <template v-for="(item, key) in result[0]">
                        <td v-if="key != 'uuid'">
                            <div>
                                <input :type="inputType[key]" :placeholder="key" :value="newEntry[key]" @change="event => newEntry[key] = event.target.value">
                            </div>
                        </td>
                    </template>
                    <td>
                        <input type="button" value="submit">
                    </td>
                </tr>
    
            </tbody>
        </table>
   
        <p>{{ newEntry }}</p>
    </div>
</template>



<style scoped>

    table {
        margin: 5px;
        table-layout: fixed;
        border-color: red;
        border-style: solid;
    }
    td {
        position: relative;
    }
    td div {
        position: absolute;
        display: inline-block;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }
    input {
        width: 100%;
        box-sizing: border-box;
    }
</style>