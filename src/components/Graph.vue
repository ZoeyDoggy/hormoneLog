<script setup>

    import { useTemplateRef, onMounted, watch, ref } from 'vue'
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

        let customDoseCurve = fillCurve(t => e2multidose3C(t, doses, times, models, conversionFactor, false, false), 0, interval, 5000);

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

        var estradiolCurve = {
            x: customDoseCurve.map(a => a.Time),
            y: customDoseCurve.map(a => a.E2),
            type: 'scatter',
            name: 'Estimated Estradiol Levels', 
            line: {
                color: flavors.macchiato.colors.text.hex,
                width: 1
            },
        };

        var filteredEstradiol = props.testsData.filter((object) => object.test == 'Estradiol' && object.recipient == props.recipient);

        var estradiolLevels = {
            x: filteredEstradiol.map(a => a.time),
            y: filteredEstradiol.map(a => a.value),
            customdata: filteredEstradiol.map(a => a.uuid),
            mode: 'markers',
            type: 'scatter',
            name: 'Estradiol Labs', 
            marker: {
                color: `rgb(${flavors.macchiato.colors.red.rgb.r}, ${flavors.macchiato.colors.red.rgb.g}, ${flavors.macchiato.colors.red.rgb.b}, 0.4)`,
                size: 5,
                line: {
                    color: flavors.macchiato.colors.red.hex,
                    width: 1
                }
            }
        };

        var filteredTestosterone = props.testsData.filter((object) => object.test == 'Testosterone' && object.recipient == props.recipient);

        var testosteroneLevels = {
            x: filteredTestosterone.map(a => a.time),
            y: filteredTestosterone.map(a => a.value),
            customdata: filteredTestosterone.map(a => a.uuid),
            mode: 'markers',
            type: 'scatter',
            name: 'Testosterone Labs', 
            marker: {
                color: `rgb(${flavors.macchiato.colors.blue.rgb.r}, ${flavors.macchiato.colors.blue.rgb.g}, ${flavors.macchiato.colors.blue.rgb.b}, 0.4)`,
                size: 5,
                line: {
                    color: flavors.macchiato.colors.blue.hex,
                    width: 1
                }
            }
        };

        var data = [estradiolCurve, estradiolLevels, testosteroneLevels];

        var layout = {
            title: {
            },

            showlegend: true,
            legend: {
                "orientation": "h",
                x: 0,
                y: 1.2
            },

            margin: {
                l: 40,
                r: 30,
                t: 30,
                b: 20,
            },

            paper_bgcolor: flavors.macchiato.colors.crust.hex,
            plot_bgcolor: flavors.macchiato.colors.crust.hex,

            font: {
                color: flavors.macchiato.colors.text.hex
            },

            xaxis: {
                autorange: true,
                range: [],
                // rangeselector: {buttons: [
                //     {
                //     count: 1,
                //     label: '1m',
                //     step: 'month',
                //     stepmode: 'backward'
                //     },
                //     {
                //     count: 6,
                //     label: '6m',
                //     step: 'month',
                //     stepmode: 'backward'
                //     },
                //     {step: 'all'}
                // ]},
                rangeslider: {range: []},
                type: 'date',
            },

            shapes: [
                //should auto scale to top of graph
                {
                    type: 'rect',
                    xref: 'x',
                    yref: 'paper',
                    x0: customDoseCurve[customDoseCurve.length-1].Time,
                    y0: 0,
                    x1: customDoseCurve[customDoseCurve.length-1].Time,
                    y1: 1,
                    line: {
                        color: flavors.macchiato.colors.mauve.hex,
                        width: 2
                    },
                    label: {
                        text: `E2: ${Math.round(customDoseCurve[customDoseCurve.length-1].E2)}`,
                        font: { size: 8, color: flavors.macchiato.colors.mauve.hex },
                        textposition: 'top center',
                        textangle: 0,
                        yanchor: 'bottom',
                    },
                },
            ],
        };

        Plotly.newPlot('plotlyDiv', data, layout, 
        {
            scrollZoom: false, 
            displayModeBar: false, 
            displayLogo: false, 
            responsive: true
        });  

        document.getElementById('plotlyDiv').on('plotly_click', function(data){
            console.log(data.points[0].customdata);
            // var pts = '';
            // for(var i=0; i < data.points.length; i++){
            //     pts = 'x = '+data.points[i].x +'\ny = '+
            //         data.points[i].y.toPrecision(4) + '\n\n';
            //         alert();
            //         console.log(data.points[i])
            // }
            // alert('Closest point clicked:\n\n'+pts);
            
        });

        renderTime.value.push(performance.now() - renderTime.value[0])
    }

</script>

<template>

    <div id="graphWindow" class="surface">
        <!-- <p>{{ renderTime }}</p> -->
        <div id="plotlyDiv"></div>
    </div>
</template>

<style>

    #graphWindow {
        width: 100%;

        padding-bottom: 0;
    }
</style>