const express = require('express');
const cors = require('cors');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const results = [];
let count = 0;

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
    const res = await axios.post('https://reqres.in/api/users/', {
        ...arr,
    })
    if (res.status !== 201) {
        return null;
    }
    return res.data;
}

app.post('/getCount', async (req, res) => {
    res.json({length: results.length});
});

app.post('/getRow', async (req, res) => {
    if (count>=results.length) {
        res.status(404);
        return;
    }
    const data = await sendRow(results[count]);
    if (!res.headersSent) {
        res.json(data)
    }
    count++;
});

app.post('/getRow/:index', async (req, res) => {
    const index = req.params.index;
    
    const data = await sendRow(results[index]);
    if (!res.headersSent) {
        res.json(data)
    }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
