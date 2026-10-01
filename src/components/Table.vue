<script setup>
    import { ref, watch } from "vue";

    const emit = defineEmits(['update'])

    import { SquarePen, Save, Trash, X, Check } from '@lucide/vue';

    const props = defineProps(['URL', 'path']);

    const result = ref([{}]);

    const postParams = ref(new URLSearchParams());
    const putParams = ref(new URLSearchParams());

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
    }

    function updatePutParams(key, value) {
        
        //convert human readable time to unix as seconds
        if (key == 'time') {
            value = new Date(value).getTime();
        }
        putParams.value.set(key, value)
    }

    function postObject () {

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

    function putObject () {

        focusRow.value = '';

        fetch(`${props.URL}/${props.path}?${putParams.value.toString()}`, {
        method: "PUT",
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

        putParams.value = new URLSearchParams();
    }

    function deleteObject () {
        focusRow.value = '';

        fetch(`${props.URL}/${props.path}?uuid=${putParams.value.get('uuid')}`, {
        method: "DELETE",
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

        putParams.value = new URLSearchParams();
    }

    function formatInput(key, data) {

        if (key == 'time') {
            var now = new Date(parseInt(data));
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            return now.toISOString().slice(0,16);
        } else {
            if (data == 'null') {
                return '';
            } else {
                return data;
            }
        }
    }

    function formatData(key, data) {
        if (key == 'time') {
            return new Date(data).toLocaleString("en-US", { year: 'numeric', month: '2-digit', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        } else {
            return data;
        }
    }

    watch(focusRow, (newX) => {

        if (newX != '') {
            const array = result.value.find((element) => element.uuid == newX)
            for (const item in array) {

                if (item == 'time') {
                    array[item] = new Date(array[item]).getTime();
                }
                if (array[item] != 'null' && array[item] != null) {
                    putParams.value.set(item, array[item])
                }
            }
        } else {
            putParams.value = new URLSearchParams()
        }
    })

    watch(result, (newResult) => {

        emit('update', newResult);
    })
</script>

<template>
    <table>
        <thead>
            <tr>
                <template v-for="item in Object.keys(result[0])">
                    <th  v-if="item != 'uuid'" :class="`${item}Column`">{{ item }}</th>
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
        </thead>

        <tbody>
        
            <tr v-for="row in result" :key="row.uuid">
                <template v-for="(data, key) in row">

                    <template v-if="key != 'uuid'">
                        <td v-if="focusRow != row.uuid">{{ formatData(key, data) }}</td>
                        <td v-else><input :type="inputType[key]" :placeholder="key" :value="formatInput(key, putParams.get(key))" @change="event => updatePutParams(key, event.target.value)"></td>
                    </template>

                </template>
                
                <td v-if="focusRow != row.uuid"><button id="rowEdit" @click="focusRow = row.uuid"><SquarePen /></button></td>
                <template v-else>
                    <td><button @click="putObject"><Save /></button></td>
                    <td><button @click="deleteObject"><Trash /></button></td>
                    <td><button @click="focusRow = ''"><X /></button></td>
                </template>
                    
            </tr>

        </tbody>
    </table>
</template>



<style scoped>

    #rowSave, #rowConfirm, #rowCancel {
        visibility: hidden;
        width: 0;
    }
    tr {
        height: 20px;
    }

    table {
        width: 100%;
        height: fit-content;
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