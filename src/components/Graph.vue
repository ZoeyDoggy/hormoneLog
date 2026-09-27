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

    const graphDiv = useTemplateRef('graphDiv');

    function plot(log) {

        // if (log.length === 0) {
            
        //     return;
        // }

        // let doses = [];
        // let times = [];
        // let models = [];

        // let conversionFactor = 1;

        // let modelLookup = [];
        // modelLookup['Valerate'] = 'EV im';
        // modelLookup['Enanthate'] = 'EEn im';

        // let epoch = log[0].unixTime;
        // let interval = ((Date.now() - epoch)) / 1000 / 86400;

        // for (let row in log) {

        //     const rowObject = log[row];

        //     doses.push(rowObject.mlDose * parseInt(rowObject.concentration))
        //     times.push((rowObject.unixTime - epoch)/86400/1000);
        //     models.push(modelLookup[rowObject.ester]);
        // }

        // let customdoseCurve = fillCurve(t => e2multidose3C(t, doses, times, models, conversionFactor, false, false), 0, interval + 7, 2500);

        // for (let i = 0; i < customdoseCurve.length; i++) {

        //     customdoseCurve[i].Time = epoch + Math.round(customdoseCurve[i].Time * 86400) * 1000;
        // }

        // let targetRange = fillTargetRange(0, interval, conversionFactor);

        // for (let i = 0; i < targetRange.length; i++) {
        //     targetRange[i].time = epoch + Math.round(targetRange[i].time * 86400) * 1000;
        // }


        const plotCanvas = Plot.plot({
            x: {type: "utc", grid: true},
            width: 1500,
            marks: [
            Plot.ruleY([-20]),
            Plot.dot(filterByEster(log, 'Enanthate'), {
                x: "unixTime", 
                y: "mlDose",
                r: 2.5,
                fill: flavors.mocha.colors.mauve.hex,
            }),
            Plot.dot(filterByEster(log, 'Valerate'), {
                x: "unixTime", 
                y: "mlDose",
                r: 2.5,
                fill: flavors.mocha.colors.blue.hex,
            }),
            Plot.line(customdoseCurve, {
                x: 'Time',
                y: 'E2',
                r: 1,
                stroke: flavors.mocha.colors.yellow.hex,
            }),
            Plot.areaY(targetRange, {
                x: 'time', y1: 'lower', y2: 'upper',
                fill: flavors.mocha.colors.yellow.hex,
                fillOpacity: 0.15
            }),
            Plot.text(['WPATH target range'], {
                x: epoch + Math.round(interval * 86400) * 1000, y: 150 * conversionFactor, rotate: 90,
                fill: flavors.mocha.colors.yellow.hex,
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
</template>


<style scoped>
</style>