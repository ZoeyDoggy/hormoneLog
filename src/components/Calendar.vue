<script setup>
    import { ref, watch, onMounted, useTemplateRef } from "vue";
    import { SquarePen, Save, Trash, X, Check } from '@lucide/vue';

    const props = defineProps(['injectionsData', 'testsData', 'recipient', 'activeData']);

    const emit = defineEmits(['activeData'])
    const itemRefs = useTemplateRef('items');

    var exampleYear = {};

    exampleYear.year = 2026;
    exampleYear.months = [];
    exampleYear.total = 0;

    for (let i = 0; i < 12; i++) {
        let monthObject = {};

        monthObject.month = (new Date(exampleYear.year, i)).toLocaleString('default', { month: 'long' });
        monthObject.numberOfDays = 32 - new Date(exampleYear.year, i, 32).getDate();
        // monthObject.startName = new Date(exampleYear.year, i).toLocaleString('default', { weekday: 'long' });
        monthObject.startNum = new Date(exampleYear.year, i, 1).getDay();
        
        exampleYear.months[i] = monthObject;
        exampleYear.total += monthObject.numberOfDays;

    }

    exampleYear.start = exampleYear.months[0].startNum;

    const dateLookup = ref([]);

    onMounted(() => {

        watch(() => props.injectionsData, () => {
            
            for (const data of props.injectionsData) {
                if (props.recipient.includes(data.recipient) || props.recipient.includes('All')) {
                    
                    const date = new Date(data.time);
                    dateLookup.value.push({'date': date.toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",}), 'uuid': data.uuid, 'type': data.ester})
                }
            }
        })
        watch(() => props.testsData, () => {

            for (const data of props.testsData) {
                if (props.recipient.includes(data.recipient) || props.recipient.includes('All')) {
                    
                    const date = new Date(data.time);
                    dateLookup.value.push({'date': date.toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",}), 'uuid': data.uuid, 'type': data.test})
                }
            }
        })
        watch(() => props.recipient, () => {
            dateLookup.value = [];

            for (const data of props.injectionsData) {
                if (props.recipient.includes(data.recipient) || props.recipient.includes('All')) {
                    
                    const date = new Date(data.time);
                    dateLookup.value.push({'date': date.toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",}), 'uuid': data.uuid, 'type': data.ester})
                }
            }

            for (const data of props.testsData) {
                if (props.recipient.includes(data.recipient) || props.recipient.includes('All')) {
                    
                    const date = new Date(data.time);
                    dateLookup.value.push({'date': date.toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",}), 'uuid': data.uuid, 'type': data.test})
                }
            }
        })

        watch(() => props.activeData, (newFocus, oldFocus) => {

            if(oldFocus.date) {
                if(itemRefs.value.find((element) => element.id == oldFocus.date)) {
                    itemRefs.value.find((element) => element.id == oldFocus.date).classList.remove("focusedData");
                }
            }

            if (newFocus.date) {

                const element = itemRefs.value.find((element) => element.id == newFocus.date);

                if(element) {
                    element.classList.add("focusedData");

                    element.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                        inline: "nearest"
                    });
                }
            }
        })
    })

    function updateActiveData(day) {

        if(props.activeData.date === day) {
            emit('activeData', {'uuid': [], 'date': ''})
        } else {
            emit('activeData', {'uuid': dateLookup.value.filter((element) => element.date == day), 'date': day})
        }
    }
</script>

<template>

    <div id="calendar" class="surface">
        <div>{{ exampleYear.year }}</div>
        <div class="month" v-for="(month, monthIndex) in exampleYear.months">

            <h3>{{ month.month }}</h3>
            
            <div class="dateGrid">
                <div class="dateSquare hoverInteract" 
                    ref="items"
                    :id="`${monthIndex+1}/${dayIndex+1}/${exampleYear.year}`"
                    v-for="(day, dayIndex) in month.numberOfDays" 
                    v-bind:style= "[dayIndex === 0 ? {'grid-column-start': month.startNum + 1} : {'grid-column-start': '0'}]" 
                    @click="updateActiveData(`${monthIndex+1}/${dayIndex+1}/${exampleYear.year}`)"
                    >
                    
                    <template v-if="dateLookup.find((element) => element.date == `${monthIndex+1}/${dayIndex+1}/${exampleYear.year}`)">
                        <div>
                            <p>{{ day }}</p>
                        </div>
                        <template v-for="data in dateLookup.filter((element) => element.date == `${monthIndex+1}/${dayIndex+1}/${exampleYear.year}`)">
                            <div class="indicator" v-bind:class="data.type" v-bind:id="data.uuid">
                                <p v-if="data.type.includes('Estradiol') || data.type.includes('Testosterone')">{{ data.type.substring(0, 1) }}</p>
                                <p v-else-if="data.type.includes('Enanthate')">een</p>
                                <p v-else-if="data.type.includes('Valerate')">ev</p>
                            </div>
                        </template>
                    </template>
                    <template v-else>
                        <div>
                            <p>{{ day }}</p>
                        </div>
                        
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>



<style scoped>
    #calendar {
        overflow-y: scroll;

        display: flex;
        flex-direction: column;

        min-width: 250px;
        max-width: 325px;
    }

    .dateGrid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 1fr;

        .dateSquare {
            position: relative;
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            grid-template-rows: repeat(2, 1fr);

            gap: 3px;

            height: inherit;
            overflow: hidden;

            border: .5px solid var(--ctp-mocha-overlay2);
        }
    }

    p {
        margin: 0;
    }

    .dateGrid::before {
        content: '';
        width: 0;
        padding-bottom: 100%;
        grid-row: 1 / 1;
        grid-column: 1 / 1;
    }

    .month {
        display: flex;
        flex-direction: column;
        width: inherit;
    }

    .dateSquare div {
        width: 100%;
        height: 100%;
        border: none;

        display: flex;
        justify-content: center;
        align-items: center;

        border-radius: 5px;

        overflow: hidden;
        text-align: start;
        text-overflow: clip;
    }

    .Enanthate {
        background-color: var(--ctp-mocha-mauve);
        color: var(--ctp-mocha-crust);
        font-size: 8pt;
    }

    .Valerate {
        background-color: var(--ctp-mocha-red);
        color: var(--ctp-mocha-crust);
        font-size: 8pt;
    }

    .Estradiol {
        background-color: var(--ctp-mocha-red);
        color: var(--ctp-mocha-crust);
        font-size: 8pt;
    }

    .Testosterone {
        background-color: var(--ctp-mocha-blue);
        color: var(--ctp-mocha-crust);
        font-size: 8pt;
    }
</style>