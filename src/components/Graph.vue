<script setup>

    import { useTemplateRef, onMounted, watch, ref } from 'vue'
    import * as Plot from "@observablehq/plot";
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

    const props = defineProps(['injectionsData', 'testsData', 'recipient']);

    const graphDiv = useTemplateRef('graphDiv');
    const smallGraph = useTemplateRef('smallGraph');

    const selector = useTemplateRef('selector');

    const timeStart = ref(0);
    const timeEnd = ref(Date.now());

    const viewStart = ref();
    const viewEnd = ref();

    function timeRange(event) {

        if (event.target.id == 'viewStart') {
            viewStart.value = event.target.value;
        } else {
            viewEnd.value = event.target.value;
        }
        plot();
    }

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
    })

    function plot() {

        if (props.injectionsData == undefined || props.testsData == undefined || props.injectionsData.length <= 1 || props.testsData.length <= 1) {
            return;
        }

        const timeValues = props.injectionsData.map(a => a.time).concat(props.testsData.map(a => a.time));
        timeStart.value = Math.min(...timeValues);
        timeEnd.value = Math.max(...timeValues);

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

        for (const injection of props.injectionsData.filter((data) => data.time >= viewStart.value && data.time <= viewEnd.value)) {

            if (injection.recipient == props.recipient) {

                doses.push(injection.dose * parseInt(injection.concentration))
                times.push((injection.time - epoch)/86400/1000);
                models.push(modelLookup[injection.ester.trim()]);
                
            }
        }

        let customDoseCurve = fillCurve(t => e2multidose3C(t, doses, times, models, conversionFactor, false, false), 0, interval + 7, 2500);

        for (let i = 0; i < customDoseCurve.length; i++) {

            customDoseCurve[i].Time = epoch + Math.round(customDoseCurve[i].Time * 86400) * 1000;
        }

        let targetRange = fillTargetRange(0, interval, conversionFactor);

        for (let i = 0; i < targetRange.length; i++) {
            targetRange[i].time = epoch + Math.round(targetRange[i].time * 86400) * 1000;
        }


        const plotCanvas = Plot.plot({
            x: {type: "utc", grid: true},
            width: graphDiv.value.offsetWidth,

            marks: [
                // Plot.ruleY([-20]),
                Plot.frame(),
                Plot.axisY({anchor: "left", tickSpacing: 50}),
                Plot.axisY({anchor: "right", tickSpacing: 50}),

                Plot.dot(props.injectionsData, {
                    x: "time", 
                    y: "dose",
                    r: 1,
                    fill: 'yellow',
                }),

                Plot.dot(props.testsData.filter((object) => 
                        object.test == 'Estradiol' && 
                        object.recipient == props.recipient && 
                        object.time >= viewStart.value && 
                        object.time <= viewEnd.value), {
                    x: "time", 
                    y: "value",
                    r: 3,
                    fill: flavors.macchiato.colors.red.hex,
                    fillOpacity: 0.35,
                    stroke: flavors.macchiato.colors.red.hex,
                }),

                Plot.dot(props.testsData.filter((object) => 
                        object.test == 'Testosterone' && 
                        object.recipient == props.recipient && 
                        object.time >= viewStart.value && 
                        object.time <= viewEnd.value), {
                    x: "time", 
                    y: "value",
                    r: 3,
                    fill: flavors.macchiato.colors.blue.hex,
                    fillOpacity: 0.35,
                    stroke: flavors.macchiato.colors.blue.hex,
                }),

                Plot.line(customDoseCurve, {
                    x: 'Time',
                    y: 'E2',
                    r: 1,
                    stroke: flavors.macchiato.colors.text.hex,
                    channels: {name: "Time"},
                    className: "customLine",
                    tip: true
                }),
                
                Plot.areaY(targetRange, {
                    x: 'time', y1: 'lower', y2: 'upper',
                    fill: 'orange',
                    fillOpacity: 0.15
                }),
                Plot.text(['WPATH target range'], {
                    x: epoch + Math.round(interval * 86400) * 1000, y: 150 * conversionFactor, rotate: 90,
                    fill: 'white',
                    frameAnchor: 'middle', textAnchor: 'middle', lineAnchor: 'bottom'
                })
            ]
        })

        graphDiv.value.innerHTML = '';
        graphDiv.value.append(plotCanvas);

        const smallCanvas = Plot.plot({
            x: {type: "utc", grid: true},
            width: smallGraph.value.offsetWidth,
            height: '100',

            marks: [
                Plot.ruleX([timeStart.value], {stroke: 'none'}),
                Plot.ruleX([timeEnd.value], {stroke: 'none'}),
                Plot.axisY({label: "", labelArrow: "none", anchor: "left", ticks: 0}),
                Plot.axisY({label: "", labelArrow: "none", anchor: "right", ticks: 0}),

                Plot.line(customDoseCurve, {
                    x: 'Time',
                    y: 'E2',
                    r: 1,
                    stroke: flavors.macchiato.colors.text.hex,
                }),
            ]
        })

        // console.log(smallCanvas);
        // console.log(selector.value);
        smallCanvas.append(selector.value);
        // console.log(smallCanvas)
        smallGraph.value.innerHTML = '';
        smallGraph.value.append(smallCanvas);
    }
</script>

<template>

    <div id="graphWindow">
        <div ref="graphDiv" id="graph"></div>
        <div ref="smallGraph" id="smallGraph"></div>

        <div>{{ viewStart }}</div>
        <input class="rangeSlider" type="range" id="viewStart" name="viewStart" :min="timeStart" :max="timeEnd" :value="viewStart" @input="event => timeRange(event)"/>
        <label for="viewStart">viewStart</label>

        <div>{{ viewEnd }}</div>
        <input class="rangeSlider" type="range" id="viewEnd" name="viewEnd" :min="timeStart" :max="timeEnd" :value="viewEnd" @input="event => timeRange(event)"/>
        <label for="viewEnd">viewEnd</label>
    </div>
</template>

<style scoped>

    #graphWindow {
        background-color: var(--ctp-macchiato-crust);
    }

    .rangeSlider {
        width: 100%;
    }
</style>