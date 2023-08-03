const http = require("http");
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const csv = require("csv-parser");
const axios = require("axios");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 5000;

app.use(express.json());
app.use(cors());

const results1 = [];
const results2 = [];
let count = 0;

const CSVTOJSON1 = (fileName, type = 1) => {
    results1.splice(0, results1.length);
    fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) => {
            var arr = [];
            for (var x in data) {
                arr.push(data[x]);
            }
            if (!arr.includes("")) {
                let metabaseId;
                let siteId;
                let skuId = arr[2];
                let isoCode;
                switch (arr[1]) {
                    case "United Kingdom":
                        siteId = 10;
                        isoCode = "GB";
                        metabaseId = "UK";
                        break;
                    case "Belgium":
                        siteId = 60;
                        isoCode = "BE";
                        metabaseId = "EU";
                        break;
                    case "Netherlands":
                        siteId = 40;
                        isoCode = "NL";
                        metabaseId = "EU";
                        break;
                    case "Ireland":
                        siteId = 30;
                        isoCode = "IE";
                        metabaseId = "EU";
                        break;
                    default:
                        siteId = 10;
                        isoCode = "GB";
                        metabaseId = "UK";
                }
                skuId = skuId.padStart(6, "0");
                results1.push({
                    metabaseId: `hbi|${metabaseId}|${isoCode}|${skuId}`,
                    siteId: siteId,
                    skuId: skuId,
                    level1: arr[13],
                    level2: arr[14],
                    level3: arr[15],
                    level4: arr[16],
                    isoCode: isoCode,
                    lastUpdated: Date.now(),
                });
            }
        })
        .on("end", () => {
            console.log("1:", results1.length);
        });
};

const CSVTOJSON2 = (fileName, type = 2) => {
    results2.splice(0, results2.length);
    fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) => {
            var arr = [];
            for (var x in data) {
                arr.push(data[x]);
            }
            if (!arr.includes("")) {
                results2.push({
                    metabaseId: arr[0],
                    siteId: arr[1],
                    skuId: arr[2],
                    cost: arr[3],
                    lastUpdated: Date.now(),
                });
            }
        })
        .on("end", () => {
            console.log("2:", results2.length);
        });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + path.extname(file.originalname)
        );
    },
});

const upload = multer({
    storage: storage,
});

async function sendRow1(arr) {
    try {
        const res = await axios.post("https://reqres.in/api/users/", {
            ...arr,
        });
        return res.data;
    } catch (err) {
        return err;
    }
}

async function sendRow2(arr) {
    try {
        const res = await axios.post(
            "https://jsonplaceholder.typicode.com/todos/",
            {
                ...arr,
            }
        );
        return res.data;
    } catch (err) {
        return err;
    }
}

app.post("/getCount", async (req, res) => {
    const { type } = req.body;
    if (type === "1") res.json({ length: results1.length });
    if (type === "2") res.json({ length: results2.length });
});

app.post("/getRow", async (req, res) => {
    if (count >= results1.length) {
        res.status(404);
        return;
    }
    const data = await sendRow(results1[count]);
    if (!res.headersSent) {
        res.json(data);
    }
    count++;
});

app.post("/getRow/:index", async (req, res) => {
    const index = req.params.index;
    const { type } = req.body;
    const limit = 51200;

    let data = [];
    let count = 0;
    if (type === "1") {
        const request_data = [];
        let i;
        for (i = index; i < results1.length; i++) {
            request_data.push(results1[i]);
            const payloadSize = Buffer.byteLength(JSON.stringify(request_data));
            if (payloadSize > limit) break;
        }
        count = i - index;
        data = await sendRow1({ data: request_data });
        if (data.response?.status && data.response?.status !== 200)
            res.status(data.response?.status).send();
    } else if (type === "2") {
        const request_data = [];
        let i;
        for (i = index; i < results2.length; i++) {
            request_data.push(results2[i]);
            const payloadSize = Buffer.byteLength(JSON.stringify(request_data));
            if (payloadSize > limit) break;
        }
        count = i - index;
        data = await sendRow2({ data: request_data });
        if (data.response?.status && data.response?.status !== 200)
            res.status(data.response?.status).send();
    }
    if (!res.headersSent) {
        res.json({
            result: data,
            count: count,
        });
    }
});

app.post("/upload", upload.single("file"), (req, res) => {
    const { type } = req.body;
    console.log("CSVTOJSON");
    if (type === "1") CSVTOJSON1(req.file.path);
    else if (type === "2") CSVTOJSON2(req.file.path);
    res.send("File uploaded successfully");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
