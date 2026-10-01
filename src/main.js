import { createApp } from 'vue'
import App from './App.vue'

import "./style.css";

createApp(App).mount('#app')

const input = ``;

import { parse } from 'csv-parse/browser/esm/sync'

function bodgeUpload( ) {
    const rawRecords = parse(input);
    console.log( rawRecords)

    var keys = [];

    for(const record in rawRecords) {
        if (record == 0) {
            keys = rawRecords[record];
        } else {
            const postParams = new URLSearchParams();

            for (const item in rawRecords[record]) {
                postParams.set(keys[item], rawRecords[record][item])
            }
            console.log(postParams.toString())

            fetch(`https://oak.frolicing.space:9100/injections?${postParams.toString()}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                }
                })
                .then((response) => {
                    response.json()
                        .then((response) => {
                            console.log(response.message)
                    })
            })
        }
    }

    console.log(keys);
}