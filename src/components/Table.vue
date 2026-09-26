<script setup>
    import { ref, watch } from "vue";

    import { SquarePen, Save, Trash, X, Check } from '@lucide/vue';

    const props = defineProps(['URL', 'path']);

    const result = ref([{}]);

    const postParams = ref(new URLSearchParams());

    const focusRow = ref();

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

    function updatePostParams(key, value) {
        
        //convert human readable time to unix as seconds
        if (key == 'time') {
            value = new Date(value).getTime();
        }
        postParams.value.set(key, value)

        console.log(postParams.value.toString())
    }

    function postObject () {

        console.log(postParams.value.toString());

        fetch(`${props.URL}/${props.path}?${postParams.value.toString()}`, {
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

        postParams.value = new URLSearchParams();
    }

    function formatInputDate(date) {
        var now = new Date(date);
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0,16);
    }
</script>

<template>
    <div>
        {{ focusRow }}
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
                        <template v-if="focusRow != row.uuid">
                        
                            <td v-if="key != 'uuid' && key != 'time'">{{ data }}</td>
                            <td v-if="key == 'time'">{{ new Date(data).toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' }) }}</td>

                        </template>
                        <template v-else>
                            <td v-if="key != 'uuid' && key != 'time'"><input :type="inputType[key]" :placeholder="key" :value="data"></td>
                            <td v-if="key == 'time'"><input :type="inputType[key]" :placeholder="key" :value="formatInputDate(data)"></td>
                        </template>
                    </template>

                    
                        <td v-if="focusRow != row.uuid"><button id="rowEdit" @click="focusRow = row.uuid"><SquarePen /></button></td>
                        <template v-else>
                            <td><button><Save /></button></td>
                            <td><button><Trash /></button></td>
                            <td><button @click="focusRow = ''"><X /></button></td>
                        </template>
                        
                    

                </tr>
        
                <tr>
                    <template v-for="(item, key) in result[0]">
                        <td v-if="key != 'uuid'">
                            <div>
                                <input :type="inputType[key]" :placeholder="key" :value="postParams.get(key)" @change="event => updatePostParams(key, event.target.value)">
                            </div>
                        </td>
                    </template>
                    <td>
                        <input type="button" value="submit" @click="postObject">
                    </td>
                </tr>
    
            </tbody>
        </table>
    </div>
</template>



<style scoped>

    #rowSave, #rowConfirm, #rowCancel {
        visibility: hidden;
        width: 0;
    }

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