<script setup>

    import { useTemplateRef, onMounted, watch } from 'vue'
    import * as Plot from "@observablehq/plot";
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
                Plot.ruleX([1769053620000]),
                Plot.frame(),

                Plot.dot(props.injectionsData, {
                    x: "time", 
                    y: "dose",
                    r: 1,
                    fill: 'yellow',
                }),

                Plot.dot(props.testsData.filter((object) => object.test == 'Estradiol' && object.recipient == props.recipient), {
                    x: "time", 
                    y: "value",
                    r: 3,
                    fill: '#FF5C74',
                    fillOpacity: 0.35,
                    stroke: '#FF5C74',
                }),

                Plot.dot(props.testsData.filter((object) => object.test == 'Testosterone' && object.recipient == props.recipient), {
                    x: "time", 
                    y: "value",
                    r: 3,
                    fill: '#4D75FF',
                    fillOpacity: 0.35,
                    stroke: '#4D75FF',
                }),

                Plot.line(customDoseCurve, {
                    x: 'Time',
                    y: 'E2',
                    r: 1,
                    stroke: '#FFE6E9',
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
    }
</script>

<template>
    <div ref="graphDiv" id="graph"></div>
    <div id="rangeSelector">
        <p>start</p>
        <input
            id="dateStart"
            type="date"
        >
        <p>end</p>
        <input
            id="dateEnd"
            type="date"
        >
        <button>reset</button>
    </div>
</template>

<style scoped>
    #rangeSelector {
        display: flex;
        height: 20px;
    }
</style>