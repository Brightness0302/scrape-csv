const express = require('express');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const app = express();
const port = 3000;

const results = [];

fs.createReadStream('sample.csv')
    .pipe(csv())
    .on('data', (data) => {
        var arr = [];
        for (var x in data) {
            arr.push(data[x]);
        }
        if (!arr.includes("")) {
            results.push({metabaseId: arr[0], siteId: arr[1], skuId: arr[2], level1: arr[3], level2: arr[4], level3: arr[5], level4: arr[6], lastUpdated: Date.now()});
        }
    })
    .on('end', () => {
        // console.log(results);
    });

async function sendRow(arr) {
    return await axios.post('https://reqres.in/api/users/', {
            ...arr,
        })
}

app.get('/', async (req, res) => {
    for (var i=0;i<results.length;i++) {
        res.send(await sendRow(results[i]));
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
