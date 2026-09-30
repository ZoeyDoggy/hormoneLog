import { createApp } from 'vue'
import App from './App.vue'

import "./style.css";

createApp(App).mount('#app')

const input = `time,ester,concentration,dose,site,recipient,vial,notes
1691172600000,Valerate,20,0.25,Right,Violet,EV-01,
1691506920000,Valerate,20,0.175,Left,Violet,,
1691946780000,Valerate,20,0.175,Right,Violet,,
1692803700000,Valerate,20,0.175,Left,Violet,,
1692812160000,Valerate,20,0.3,Right,Violet,,
1693367100000,Valerate,20,0.2,Right,Violet,,
1693849560000,Valerate,20,0.2,Left,Violet,,
1694294820000,Valerate,20,0.25,Right,Violet,,
1694707980000,Valerate,20,0.25,Left,Violet,,
1695142200000,Valerate,20,0.24,Right,Violet,,
1695664920000,Valerate,20,0.27,Left,Violet,,
1696125840000,Valerate,20,0.34,Right,Violet,,
1696522560000,Valerate,20,0.34,Left,Violet,,
1696948980000,Valerate,20,0.34,Right,Violet,,
1697389320000,Valerate,20,0.23,Left,Violet,,
1697848920000,Valerate,20,0.2,Right,Violet,,
1698373980000,Valerate,20,0.2,Right,Violet,,
1698884040000,Valerate,20,0.21,Left,Violet,,
1699409160000,Valerate,20,0.195,Right,Violet,,
1699896420000,Valerate,20,0.21,Left,Violet,,
1700266620000,Valerate,20,0.19,Right,Violet,,
1700706420000,Valerate,20,0.2,Left,Violet,,
1701132060000,Valerate,20,0.2,Right,Violet,,
1701575100000,Valerate,20,0.2,Left,Violet,,
1701904380000,Valerate,20,0.2,Right,Chayton,EV-02,
1702134660000,Valerate,20,0.2,Right,Violet,EV-03,
1702344900000,Valerate,20,0.2,Right,Chayton,EV-03,
1702701180000,Valerate,20,0.16,Left,Violet,EV-03,
1702867680000,Valerate,20,0.21,Right,Chayton,EV-03,
1703187180000,Valerate,20,0.2,Right,Violet,EV-03,
1703295240000,Valerate,20,0.205,Right,Chayton,EV-03,
1703638980000,Valerate,20,0.2,Left,Violet,EV-03,
1703724960000,Valerate,20,0.2,Right,Chayton,EV-03,
1704152820000,Valerate,20,0.2,Right,Violet,EV-03,
1704152820000,Valerate,20,0.18,Right,Chayton,EV-03,
1704689760000,Valerate,20,0.2,Left,Chayton,EV-03,
1704689760000,Valerate,20,0.2,Left,Violet,EV-03,
1705362180000,Valerate,20,0.2,Right,Violet,EV-03,
1705362180000,Valerate,20,0.2,Right,Chayton,EV-03,
1705860840000,Valerate,20,0.2,Left,Violet,EV-03,
1705860900000,Valerate,20,0.2,Right,Chayton,EV-03,
1706322780000,Valerate,20,0.2,Right,Chayton,EV-03,
1706322780000,Valerate,20,0.2,Left,Violet,EV-04,
1706843640000,Valerate,20,0.2,Right,Violet,EV-04,
1706843640000,Valerate,20,0.2,Right,Chayton,EV-04,
1707443700000,Valerate,20,0.19,Left,Violet,EV-04,
1707443700000,Valerate,20,0.2,Right,Chayton,EV-04,
1708045200000,Valerate,20,0.2,Right,Chayton,EV-04,
1708002000000,Valerate,20,0.19,Right,Violet,EV-04,
1708653780000,Valerate,20,0.2,Left,Violet,EV-04,
1708653780000,Valerate,20,0.2,Right,Chayton,EV-04,
1709175240000,Valerate,20,0.2,Right,Violet,EV-04,
1709175240000,Valerate,20,0.18,Left,Chayton,EV-04,
1709860800000,Valerate,20,0.2,Left,Violet,EV-04,
1709860860000,Valerate,20,0.2,Right,Chayton,EV-04,
1711072800000,Valerate,20,0.2,Left,Violet,EV-04,
1711072800000,Valerate,20,0.2,Right,Chayton,EV-04,
1711077060000,Valerate,20,0.2,Right,Violet,EV-04,
1711077060000,Valerate,20,0.2,Right,Chayton,EV-04,
1711591200000,Valerate,20,0.18,Right,Chayton,EV-04,
1711591260000,Valerate,20,0.2,Left,Violet,EV-05,
1712251800000,Valerate,20,0.18,Left,Violet,EV-05,
1712251800000,Valerate,20,0.2,Right,Chayton,EV-05,
1712717340000,Valerate,20,0.2,Right,Violet,EV-05,
1712717340000,Valerate,20,0.19,Right,Chayton,EV-05,
1713319260000,Valerate,20,0.2,Left,Violet,EV-05,
1713319260000,Valerate,20,0.2,Right,Chayton,EV-05,
1713841200000,Valerate,20,0.2,Left,Violet,EV-05,
1713841200000,Valerate,20,0.2,Right,Chayton,EV-05,
1714364880000,Valerate,20,0.19,Right,Violet,EV-05,
1714364880000,Valerate,20,0.19,Right,Chayton,EV-05,
1715828400000,Valerate,20,0.2,Left,Violet,EV-05,
1715828400000,Valerate,20,0.2,Left,Chayton,EV-05,
1715397240000,Valerate,20,0.16,Right,Violet,EV-05,
1715397240000,Valerate,20,0.19,Right,Chayton,EV-05,
1715882580000,Enanthate ,50,0.15,Left,Avery,RAE-01,
1715882580000,Valerate,20,0.2,Left,Violet,EV-05,
1715882640000,Valerate,20,0.2,Right,Chayton,EV-05,
1716347100000,Valerate,20,0.2,Right,Chayton,EV-05,
1716347100000,Valerate,20,0.2,Right,Violet,EV-06,
1717044840000,Valerate,20,0.2,Left,Violet,,
1717044840000,Valerate,20,0.2,Right,Chayton,,
1717561560000,Valerate,20,0.2,Right,Violet,,
1717561620000,Valerate,20,0.2,Right,Chayton,,
1717641060000,Enanthate ,50,0.12,Left,Avery,RAE-01,
1718077260000,Valerate,20,0.2,Left,Violet,,
1718077260000,Valerate,20,0.19,Right,Chayton,,
1718565420000,Enanthate ,50,0.14,Right,Avery,RAE-01,
1718680380000,Valerate,20,0.2,Left,Violet,,
1718680380000,Valerate,20,0.2,Right,Chayton,,
1719206280000,Valerate,20,0.2,Right,Violet,,
1719206280000,Valerate,20,0.2,Right,Chayton,,
1719543600000,Valerate,20,0.2,Left,Violet,,
1719543600000,Enanthate ,50,0.15,Left,Avery,RAE-01,
1720075380000,Valerate,20,0.2,Right,Violet,,
1720497600000,Enanthate ,50,0.15,Right,Avery,RAE-01,
1720588080000,Valerate,20,0.2,Right,Violet,,
1721103840000,Valerate,20,0.2,Left,Violet,,
1721103840000,Valerate,20,0.2,Right,Chayton,,
1721445060000,Enanthate ,50,0.15,Left,Avery,RAE-01,
1721795580000,Valerate,20,0.2,Right,Chayton,,
1721795580000,Valerate,20,0.12,Left,Violet,,
1722119340000,Enanthate ,50,0.17,Right,Avery,RAE-01,
1722119340000,Valerate,20,0.21,Right,Violet,,
1722651120000,Valerate,20,0.2,Left,Violet,,
1723171800000,Valerate,20,0.2,Right,Violet,,
1723180980000,Valerate,20,0.2,Right,Chayton,,
1723603740000,Valerate,20,0.2,Left,Violet,,
1723872900000,Enanthate ,50,0.16,Right,Avery,RAE-01,
1724119140000,Valerate,20,0.2,Right,Violet,,
1724640420000,Valerate,20,0.2,Left,Violet,,
1724723340000,Enanthate ,50,0.175,Left,Avery,RAE-01,
1725168240000,Valerate,20,0.2,Left,Violet,,
1725168300000,Valerate,20,0.2,Right,Chayton,,
1725591480000,Valerate,20,0.2,Left,Violet,,
1725591540000,Enanthate ,50,0.15,Right,Avery,RAE-01,
1726025100000,Valerate,20,0.2,Left,Violet,,
1726459380000,Valerate,20,0.2,Right,Violet,,
1726459440000,Valerate,20,0.2,Right,Chayton,,
1726459440000,Enanthate ,50,0.16,Left,Avery,RAE-01,
1726891800000,Valerate,20,0.2,Left,Violet,,
1727310360000,Valerate,20,0.2,Right,Violet,,
1727310360000,Enanthate ,50,0.16,Right,Avery,RAE-01,
1727760180000,Valerate,20,0.2,Left,Violet,,
1728182520000,Valerate,20,0.2,Right,Violet,,
1728182520000,Enanthate ,50,0.16,Left,Avery,RAE-01,
1729057680000,Valerate,20,0.2,Right,Violet,,
1729057680000,Enanthate ,50,0.16,Right,Avery,RAE-01,
1729563300000,Valerate,20,0.2,Left,Violet,,
1729994100000,Valerate,20,0.19,Right,Violet,,
1729994100000,Enanthate ,50,0.16,Left,Avery,RAE-01,
1730432700000,Valerate,20,0.25,Left,Violet,,
1730881620000,Enanthate ,50,0.2,Right,Violet,RAE-01,
1730881680000,Enanthate ,50,0.16,Right,Avery,RAE-01,
1731733560000,Enanthate ,50,0.15,Left,Avery,RAE-01,
1731733920000,Enanthate ,50,0.15,Left,Violet,RAE-01,
1732597020000,Enanthate ,50,0.165,Right,Violet,RAE-01,
1732597080000,Enanthate ,50,0.165,Right,Avery,RAE-01,
1733452860000,Enanthate ,50,0.17,Left,Avery,RAE-01,
1733452860000,Enanthate ,50,0.16,Left,Violet,RAE-01,
1734140700000,Enanthate ,50,0.1,Right,Violet,RAE-01,
1734140700000,Enanthate ,50,0.1,Right,Avery,RAE-01,
1734754560000,Enanthate ,50,0.115,Left,Violet,RAE-01,
1734754560000,Enanthate ,50,0.12,Left,Avery,RAE-01,
1735521840000,Enanthate ,50,0.1,Right,Violet,RAE-01,
1735786920000,Enanthate ,50,0.35,Right,Evie,RAE-01,
1735786980000,Enanthate ,50,0.2,Left,Avery,RAE-01,
1735787280000,Enanthate ,50,0.1,Left,Violet,RAE-01,
1736401140000,Enanthate ,50,0.1,Right,Violet,RAE-01,
1736401200000,Enanthate ,50,0.15,Right,Avery,RAE-01,
1736401200000,Enanthate ,50,0.2,Left,Evie,RAE-01,
1737056760000,Enanthate ,50,0.1,Left,Violet,RAE-01,
1737056760000,Enanthate ,50,0.15,Left,Avery,RAE-01,
1737056820000,Enanthate ,40,0.2,Right,Evie,TEA-01,
1737606240000,Enanthate ,40,0.1,Right,Violet,TEA-01,
1737606240000,Enanthate ,40,0.15,Right,Avery,TEA-01,
1738304880000,Enanthate ,40,0.2,Right,Avery,TEA-01,
1738903440000,Enanthate ,40,0.1,Left,Violet,TEA-01,
1738903500000,Enanthate ,40,0.15,Left,Avery,TEA-01,`;

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