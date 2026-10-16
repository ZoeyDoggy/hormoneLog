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
    import { RotateCcw } from '@lucide/vue';

    const props = defineProps(['injectionsData', 'testsData', 'recipient']);

    const graphDiv = useTemplateRef('graphDiv');
    const smallGraph = useTemplateRef('smallGraph');

    const timeStart = ref(0);
    const timeEnd = ref(Date.now());

    const viewStart = ref(Number(localStorage.getItem("viewStart")));
    const viewEnd = ref(Number(localStorage.getItem("viewEnd")));

    const frameLeft = ref();
    const frameTop = ref();
    const frameWidth = ref();
    const frameHeight = ref();

    function timeRange(event) {

        if (event.target.id == 'viewStart') {

            viewStart.value = event.target.value;
            localStorage.setItem("viewStart", viewStart.value);
        } else {

            viewEnd.value = event.target.value;
            localStorage.setItem("viewEnd", viewEnd.value);
        }
        plot();
    }

    function resetView() {
        viewStart.value = timeStart.value;
        localStorage.setItem("viewStart", viewStart.value);
        viewEnd.value = timeEnd.value;
        localStorage.setItem("viewEnd", viewEnd.value);

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
                Plot.frame(),
                Plot.axisY({anchor: "left", tickSpacing: 50}),
                Plot.axisY({anchor: "right", tickSpacing: 50}),

                Plot.ruleX([Number(viewStart.value), Number(viewEnd.value)], {stroke: 'none'}),
                Plot.ruleY([-50, 800], {stroke: 'none'}),

                Plot.line(customDoseCurve.filter((data) => 
                        data.Time >= viewStart.value && 
                        data.Time <= viewEnd.value), {
                    x: 'Time',
                    y: 'E2',
                    r: 1,
                    stroke: flavors.macchiato.colors.text.hex,
                    channels: {name: "Time"},
                    className: "customLine",
                    tip: true
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

                // Plot.areaY(targetRange, {
                //     x: 'time', y1: 'lower', y2: 'upper',
                //     fill: 'orange',
                //     fillOpacity: 0.15
                // }),
                Plot.text(['WPATH target range'], {
                    x: Number(viewEnd.value), y: 150 * conversionFactor, rotate: 90,
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
                Plot.frame({stroke: 'none', className: 'smallGraphFrame'}),
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

        const frameObject = smallCanvas.getElementsByClassName("smallGraphFrame")[0];
        frameLeft.value = Number(frameObject.getAttribute('x'));
        frameTop.value = Number(frameObject.getAttribute('y'));

        frameWidth.value = Number(frameObject.getAttribute('width'));
        frameHeight.value = Number(frameObject.getAttribute('height'));

        smallCanvas.appendChild(createRegion(
            frameLeft.value, 
            frameTop.value, 
            convertRange( viewStart.value, [ timeStart.value, timeEnd.value ], [ frameLeft.value, frameLeft.value + frameWidth.value ] ) - frameLeft.value, 
            frameHeight.value
        ));

        smallCanvas.appendChild(createRegion(
            convertRange( viewEnd.value, [ timeStart.value, timeEnd.value ], [ frameLeft.value, frameLeft.value + frameWidth.value ] ), 
            frameTop.value, 
            frameWidth.value - convertRange( viewEnd.value, [ timeStart.value, timeEnd.value ], [ frameLeft.value, frameLeft.value + frameWidth .value] ) + frameLeft.value, 
            frameHeight.value
        ));

        smallGraph.value.innerHTML = '';
        smallGraph.value.appendChild(smallCanvas);
    }

    function createRegion(x, y, w, h) {
        let region = document.createElementNS('http://www.w3.org/2000/svg','rect');

        region.setAttribute('x',x);
        region.setAttribute('y',y);
        region.setAttribute('height',h);
        region.setAttribute('width', w);

        region.setAttribute('class', 'rangeFill');

        return region;
    }

    function convertRange( value, r1, r2 ) { 
        return ( value - r1[ 0 ] ) * ( r2[ 1 ] - r2[ 0 ] ) / ( r1[ 1 ] - r1[ 0 ] ) + r2[ 0 ];
    }
</script>

<template>

    <div id="graphWindow">
        <div ref="graphDiv" id="graph"></div>
        <div id="rangeSelector">
            <div ref="smallGraph" id="smallGraph"></div>
            <div id="rangeContainer">
                <input class="rangeSlider" type="range" id="viewStart" name="viewStart" :min="timeStart" :max="timeEnd" :value="viewStart" @input="event => timeRange(event)"/>
                <input class="rangeSlider" type="range" id="viewEnd" name="viewEnd" :min="timeStart" :max="timeEnd" :value="viewEnd" @input="event => timeRange(event)"/>
            </div>
        </div>
        
        <!-- <button @click="resetView"><RotateCcw /></button> -->


        
    </div>
</template>

<style>

    #rangeSelector {
        position: relative;
        height: 110px;
    }

    #smallGraph {
        position: absolute;
        height: 100%;
        width: 100%;
    }

    #graphWindow {
        background-color: var(--ctp-macchiato-crust);
    }

    #rangeContainer {
        position: absolute;
        left: v-bind(frameLeft-5 + 'px');
        top: v-bind(frameTop + 'px');
        width: v-bind(frameWidth+10 + 'px');
        height: v-bind(frameHeight + 'px');
    }
    
    .rangeFill {
        fill: var(--ctp-macchiato-base);
        stroke: var(--ctp-macchiato-base);
        rx: 5px;
        opacity: 0.7;
    }

    .rangeSlider {
        position: absolute;
        pointer-events: none;
        width: 100%;
        margin: 0px;
    }

    input[type=range] {
        -webkit-appearance: none; /* Hides the slider so that custom slider can be made */
        width: 100%; /* Specific width is required for Firefox. */
        background: transparent; /* Otherwise white in Chrome */
    }

    input[type=range]::-webkit-slider-thumb {
        -webkit-appearance: none;
    }

    input[type=range]:focus {
        outline: none; /* Removes the blue border. You should probably do some kind of focus styling for accessibility reasons though. */
    }

    input[type=range]::-ms-track {
        width: 100%;
        cursor: pointer;

        /* Hides the slider so custom styles can be added */
        background: transparent; 
        border-color: transparent;
        color: transparent;
    }

    input[type=range]::-webkit-slider-thumb {
        pointer-events: auto;
        -webkit-appearance: none;
        left: -10px;
        height: v-bind(frameHeight + 'px');
        width: 6px;
        border-radius: 3px;
        background: var(--ctp-macchiato-rosewater);
        cursor: pointer;
        margin-top: 0px; /* You need to specify a margin in Chrome, but in Firefox and IE it is automatic */
        box-sizing: content-box;

        outline: 0px solid var(--ctp-macchiato-lavender);

        transition-property: outline;
        transition-duration: .2s;
        transition-delay: 0s;
    }

    input[type=range]::-webkit-slider-thumb:hover, input[type=range]::-webkit-slider-thumb:active {
        outline: 3px solid var(--ctp-macchiato-lavender);
    }
</style>