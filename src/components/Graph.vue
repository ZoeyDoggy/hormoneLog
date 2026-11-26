<script setup>

    import { useTemplateRef, onMounted, watch, ref } from 'vue'
    import * as Plot from "@observablehq/plot";
    import Plotly from 'plotly.js-dist-min'
    import { flavors } from "@catppuccin/palette";
    import {
        e2multidose3C,
        e2ssAverage3C,
        fillCurve,
        fillMenstrualCycleCurve,
        fillTargetRange,
        availableUnits,
        PKFunctions,
        PKParameters,
        PKRandomFunctions,
        terminalEliminationTime3C
    } from '../models.js';
    import { RotateCcw } from '@lucide/vue';

    const props = defineProps(['injectionsData', 'testsData', 'recipient']);

    const emit = defineEmits(['activeData'])

    const timeStart = ref(0);
    const timeEnd = ref(Date.now());

    const viewStart = ref(Number(localStorage.getItem("viewStart")));
    const viewEnd = ref(Number(localStorage.getItem("viewEnd")));

    const renderTime = ref([]);


    onMounted(() => {

        watch(() => props.injectionsData, () => {
            //console.log(props.injectionsData);
            plot();
        })
        watch(() => props.testsData, () => {
            //console.log(props.testsData);
            plot();
        })
        watch(() => props.recipient, () => {
            //console.log(props.testsData);
            plot();
        })

        watch(() => props.activeData, (newFocus, oldFocus) => {

            console.log(newFocus);
            console.log(oldFocus);
        })

    })

    function getHighestQuote(quotes, limit) {
        let winner = null;
        let winningQuote = null;
        for (let {E2, Time} of quotes) {
            if (Time > limit)
            continue;
            if (winningQuote === null || winningQuote < Time) {
            winner = E2;
            winningQuote = Time;
            }
        }
        return winner;
    }

    function updateActiveData(target, event) {

        if(target != null) {

            const dateString = new Date(target.time).toLocaleDateString(undefined, {year: "numeric",month: "numeric",day: "numeric",});

            emit('activeData', {'uuid': [{'uuid': target.uuid, 'type': target.ester, 'date': dateString}], 'date': dateString})
        } else {
            console.log('deselect');
            emit('activeData', {'uuid': [], 'date': ''})
        }
    }

    function plot() {

        renderTime.value = [];
        renderTime.value.push(performance.now())

        if (props.injectionsData == undefined || props.testsData == undefined || props.injectionsData.length <= 1 || props.testsData.length <= 1) {
            return;
        }

        const timeValues = props.injectionsData.map(a => a.time).concat(props.testsData.map(a => a.time));
        timeStart.value = Math.min(...timeValues);
        // timeEnd.value = Math.max(...timeValues);

        if (viewStart.value == undefined || viewEnd.value == undefined) {

            viewStart.value = timeStart.value;
            viewEnd.value = timeEnd.value;
        }

        let doses = [];
        let times = [];
        let models = [];

        let conversionFactor = 1;

        let modelLookup = [];
        modelLookup['Valerate'] = 'EV im';
        modelLookup['Enanthate'] = 'EEn im';

        let epoch = props.injectionsData[0].time;
        let interval = ((Date.now() - epoch)) / 1000 / 86400;

        for (const injection of props.injectionsData) {

            if (injection.recipient == props.recipient) {

                doses.push(injection.dose * parseInt(injection.concentration))
                times.push((injection.time - epoch)/86400/1000);
                models.push(modelLookup[injection.ester.trim()]);
                
            }
        }
        
        renderTime.value.push(performance.now() - renderTime.value[0])

        let customDoseCurve = fillCurve(t => e2multidose3C(t, doses, times, models, conversionFactor, false, false), 0, interval, 25000);

        renderTime.value.push(performance.now() - renderTime.value[0])

        for (let i = 0; i < customDoseCurve.length; i++) {

            customDoseCurve[i].Time = epoch + Math.round(customDoseCurve[i].Time * 86400) * 1000;
        }

        let targetRange = fillTargetRange(0, interval, conversionFactor);

        for (let i = 0; i < targetRange.length; i++) {
            targetRange[i].time = epoch + Math.round(targetRange[i].time * 86400) * 1000;
        }

        const injectionArray = props.injectionsData.filter((object) => 
                        object.recipient == props.recipient && 
                        object.time >= viewStart.value && 
                        object.time <= viewEnd.value);


        for (const item of injectionArray) {
            item['E2'] = getHighestQuote(customDoseCurve, item.time);
        }

        renderTime.value.push(performance.now() - renderTime.value[0])

        var filteredCurve = customDoseCurve.filter((data) => 
            data.Time >= viewStart.value && 
            data.Time <= viewEnd.value);

        var estradiolCurve = {
            x: filteredCurve.map(a => a.Time),
            y: filteredCurve.map(a => a.E2),
            type: 'scatter',
            name: 'Estimated Estradiol Levels', 
            line: {
                color: flavors.macchiato.colors.text.hex,
                width: 1
            },
        };

        var filteredEstradiol = props.testsData.filter((object) => 
            object.test == 'Estradiol' && 
            object.recipient == props.recipient && 
            object.time >= viewStart.value && 
            object.time <= viewEnd.value);

        var estradiolLevels = {
            x: filteredEstradiol.map(a => a.time),
            y: filteredEstradiol.map(a => a.value),
            mode: 'markers',
            type: 'scatter',
            name: 'Estradiol Labs', 
            marker: {
                color: flavors.macchiato.colors.red.hex,
                size: 5
            }
        };

        var filteredTestosterone = props.testsData.filter((object) => 
            object.test == 'Testosterone' && 
            object.recipient == props.recipient && 
            object.time >= viewStart.value && 
            object.time <= viewEnd.value);

            console.log(filteredEstradiol);

        var testosteroneLevels = {
            x: filteredTestosterone.map(a => a.time),
            y: filteredTestosterone.map(a => a.value),
            mode: 'markers',
            type: 'scatter',
            name: 'Testosterone Labs', 
                        marker: {
                color: flavors.macchiato.colors.blue.hex,
                size: 5
            }
        };

        var data = [estradiolCurve, estradiolLevels, testosteroneLevels];

        var layout = {
            title: {
            },

            showlegend: true,

            margin: {
                l: 50,
                r: 80,
                t: 40,
                b: 40,
            },

            paper_bgcolor: flavors.macchiato.colors.crust.hex,
            plot_bgcolor: flavors.macchiato.colors.crust.hex,

            font: {
                color: flavors.macchiato.colors.text.hex
            },

            xaxis: {
                autorange: true,
                range: [],
                rangeselector: {buttons: [
                    {
                    count: 1,
                    label: '1m',
                    step: 'month',
                    stepmode: 'backward'
                    },
                    {
                    count: 6,
                    label: '6m',
                    step: 'month',
                    stepmode: 'backward'
                    },
                    {step: 'all'}
                ]},
                rangeslider: {range: []},
                type: 'date'
            }
        };

        Plotly.newPlot('plotlyDiv', data, layout, 
        {
            scrollZoom: false, 
            displayModeBar: false, 
            displayLogo: false, 
            responsive: true
        });  

        renderTime.value.push(performance.now() - renderTime.value[0])
    }

</script>

<template>

    <div id="graphWindow" class="surface">
        <p>{{ renderTime }}</p>
        <div id="plotlyDiv"></div>
    </div>
</template>

<style>

    #graphWindow {
        width: 100%;

        padding-bottom: 0;
    }
</style>