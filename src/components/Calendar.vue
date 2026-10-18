<script setup>
    import { ref, watch, onMounted } from "vue";
    import { SquarePen, Save, Trash, X, Check } from '@lucide/vue';

    const props = defineProps(['injectionsData', 'testsData', 'recipient']);

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
                if (props.recipient.includes(data.recipient)) {
                    
                    const date = new Date(data.time);
                    dateLookup.value.push({'date': date.toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",}), 'uuid': data.uuid})
                }
            }
            console.log(dateLookup.value);
            console.log(dateLookup.value.find((element) => element.date == '1/1/2024').uuid)
        })
        watch(() => props.testsData, () => {
        })
        watch(() => props.recipient, () => {
        })
    })
</script>

<template>

    <div id="calendar">
        <div>Calendar</div>
        <div class="month" v-for="(month, monthIndex) in exampleYear.months">

            <h3>{{ month.month }}</h3>
            
            <div class="dateGrid">
                <div class="dateSquare" v-for="(day, dayIndex) in month.numberOfDays" v-bind:style= "[dayIndex === 0 ? {'grid-column-start': month.startNum + 1} : {'grid-column-start': '0'}]">
                    

                    <template v-if="dateLookup.find((element) => element.date.includes(`${monthIndex+1}/${dayIndex+1}/${exampleYear.year}`))">
                        <div class="indicator">
                            <p>{{ day }}</p>
                        </div>
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
    }

    .dateGrid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);

        .dateSquare {
            aspect-ratio: 1;
            display: flex;
            justify-content: center;
            align-items: center;

            border: 1px solid var(--ctp-mocha-overlay2);
        }
    }
    .month:nth-child(even) div p {
        color: var(--ctp-mocha-overlay2);
    }

    .indicator {
        background-color: var(--ctp-mocha-lavender);
        width: 50%;
        height: 50%;
        border: none;

        display: flex;
        justify-content: center;
        align-items: center;

        p {
            color: var(--ctp-mocha-crust);
        }
    }
</style>