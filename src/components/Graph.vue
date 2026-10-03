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

    const timeStart = ref(0);
    const timeEnd = ref(Date.now());
    

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

        for (const injection of props.injectionsData.filter((data) => data.time >= timeStart.value && data.time <= timeEnd.value)) {

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

                Plot.dot(props.injectionsData, {
                    x: "time", 
                    y: "dose",
                    r: 1,
                    fill: 'yellow',
                }),

                Plot.dot(props.testsData.filter((object) => 
                        object.test == 'Estradiol' && 
                        object.recipient == props.recipient && 
                        object.time >= timeStart.value && 
                        object.time <= timeEnd.value), {
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
                        object.time >= timeStart.value && 
                        object.time <= timeEnd.value), {
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

    #graph {
        background-color: var(--ctp-macchiato-crust);
    }

    #rangeSelector {
        display: flex;
        height: 20px;
    }
</style>