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

const CSVTOJSON = (fileName, type) => {
    if (type === 1) {
        results1.splice(0, results1.length);
    }
    if (type === 2) {
        results2.splice(0, results2.length);
    }
    fs.createReadStream(fileName)
        .pipe(csv())
        .on("data", (data) => {
            var arr = [];
            for (var x in data) {
                arr.push(data[x]);
            }
            if (!arr.includes("")) {
                if (type === 1) {
                    results1.push({
                        metabaseId: arr[0],
                        siteId: arr[1],
                        skuId: arr[2],
                        level1: arr[3],
                        level2: arr[4],
                        level3: arr[5],
                        level4: arr[6],
                        isoCode: arr[7],
                        lastUpdated: Date.now(),
                    });
                }
                if (type === 2) {
                    results2.push({
                        metabaseId: arr[0],
                        siteId: arr[1],
                        skuId: arr[2],
                        level1: arr[3],
                        level2: arr[4],
                        level3: arr[5],
                        level4: arr[6],
                        isoCode: arr[7],
                        lastUpdated: Date.now(),
                    });
                }
            }
        })
        .on("end", () => {
            if (type === 1) {
                console.log("1:", results1.length);
            }
            if (type === 2) {
                console.log("2:", results2.length);
            }
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
        return null;
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
        return null;
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

    let data;
    if (type === "1") data = await sendRow1(results1[index]);
    if (type === "2") data = await sendRow2(results2[index]);
    if (!res.headersSent) {
        res.json(data);
    }
});

app.post("/upload", upload.single("file"), (req, res) => {
    const { type } = req.body;
    console.log("CSVTOJSON");
    if (type === "1") CSVTOJSON(req.file.path, 1);
    else if (type === "2") CSVTOJSON(req.file.path, 2);
    res.send("File uploaded successfully");
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
