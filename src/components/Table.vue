<script setup>
    import { ref, watch } from "vue";

    const props = defineProps(['URL', 'path']);
    console.log(props.path)

    const result = ref([{}]);

    const params = ref(new URLSearchParams());

    const inputType = ref({
        'time': 'datetime-local',
        'concentration': 'number',
        'dose': 'number',
        'value': 'number',
    });

    pullData();

    function pullData() {
        result.value = [{}];

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
    }

    function updateParams(key, value) {
        
        //convert human readable time to unix as seconds
        if (key == 'time') {
            value = new Date(value).getTime();
        }
        params.value.set(key, value)
    }

    function postObject () {

        console.log(params.value.toString());

        fetch(`${props.URL}/${props.path}?${params.value.toString()}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        }
        })
        .then((response) => {
            response.json()
                .then((response) => {
                    console.log(response.message)
                    pullData();
            })
        })

        params.value = new URLSearchParams();
    }
</script>

<template>
    <div>
       <table>
            <thead>
                <tr>
                    <template v-for="item in Object.keys(result[0])">
                        <th  v-if="item != 'uuid'" :class="`${item}Column`">{{ item }}</th>
                    </template>
        
                </tr>
            </thead>

            <tbody>
           
                <tr v-for="row in result" :key="row.uuid">
                    <template v-for="(data, key) in row">
                        <td v-if="key != 'uuid' && key != 'time'">{{ data }}</td>
                        <td v-if="key == 'time'">{{ new Date(data).toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>
                    </template>
                    <td><input type="button" value="edit"></td>
                    <td><input type="button" value="delete"></td>
                </tr>
        
                <tr>
                    <template v-for="(item, key) in result[0]">
                        <td v-if="key != 'uuid'">
                            <div>
                                <input :type="inputType[key]" :placeholder="key" :value="params.get(key)" @change="event => updateParams(key, event.target.value)">
                            </div>
                        </td>
                    </template>
                    <td>
                        <input type="button" value="submit" @click="postObject">
                    </td>
                </tr>
    
            </tbody>
        </table>
        

        {{ params }}
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
    .timeColumn {
        width: 160px;
    }
</style>