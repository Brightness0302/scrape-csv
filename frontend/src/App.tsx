import React, { useRef, useState } from "react";
import { ToastContainer } from "react-toastify";
import axios from "axios";
import "./App.css";
import { setAlert } from "./actions/alert";
import "react-toastify/dist/ReactToastify.css";

function App() {
    const [file1, setFile1] = useState("Choose File");
    const [progress1, setProgress1] = useState(0);
    const [Totalprogress1, setTotalProgress1] = useState(0);
    const fileInputRef1 = useRef<HTMLInputElement>(null);

    const [file2, setFile2] = useState("Choose File");
    const [progress2, setProgress2] = useState(0);
    const [Totalprogress2, setTotalProgress2] = useState(0);
    const fileInputRef2 = useRef<HTMLInputElement>(null);
    const getAllRows = async (type: string) => {
        let count = 0;
        try {
            console.log(1);
            const resCount = await axios.post(
                "http://localhost:5000/getCount",
                { type: type }
            );
            count = resCount.data.length;
            for (let index = 0; index < count; index++) {
                const resRow = await axios.post(
                    `http://localhost:5000/getRow/${index}`,
                    { type: type }
                );
                if (resRow.status === 200) {
                    const percentage = Math.round(((index + 1) / count) * 100);
                    if (type === "1") {
                        setTotalProgress1(percentage);
                        setAlert(`${index + 1} successful!`, `success`);
                    }
                    if (type === "2") {
                        setTotalProgress2(percentage);
                        setAlert(`${index + 1} successful!`, `success`);
                    }
                } else if (resRow.status === 500) {
                    setAlert(`Server Failed`, `danger`);
                } else {
                    setAlert(`${index + 1} failed!`, `warning`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleFileUpload = async (
        event: React.ChangeEvent<HTMLInputElement>,
        type: string
    ) => {
        console.log(type);
        if (!event.target.files || event.target.files.length === 0) return;
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("type", type);

        if (type === "1") setFile1(file.name);
        if (type === "2") setFile2(file.name);

        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent: any) => {
                const percentage = Math.round(
                    (progressEvent.loaded / progressEvent.total) * 100
                );
                if (type === "1") setProgress1(percentage);
                else if (type === "2") setProgress2(percentage);
            },
        };

        try {
            const response = await axios.post(
                "http://localhost:5000/upload",
                formData,
                config
            );
            setTimeout(function () {
                if (type === "1") getAllRows("1");
                if (type === "2") getAllRows("2");
            }, 2000);
            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <>
            <div className="App">
                <div className="Row_Panel">
                    <h1>Category Export</h1>
                    <label
                        htmlFor="file-upload1"
                        className="custom-file-upload"
                        onClick={() => {
                            setProgress1(0);
                            setTotalProgress1(0);
                            if (fileInputRef1.current) {
                                fileInputRef1.current.value = "";
                            }
                        }}
                    >
                        {file1}
                    </label>
                    <input
                        id="file-upload1"
                        ref={fileInputRef1}
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                            console.log(1);
                            handleFileUpload(e, "1");
                        }}
                        hidden
                    />
                    <div className="ProgressBar">
                        <p>Uploading</p>
                        <div className="progress">
                            <progress value={progress1} max="100" />
                            <p>{progress1}%</p>
                        </div>
                    </div>
                    <div className="ProgressBar">
                        <p>Process:</p>
                        <div className="progress">
                            <progress value={Totalprogress1} max={"100"} />
                            <p>{Totalprogress1}%</p>
                        </div>
                    </div>
                </div>
                <div className="divider"></div>
                <div className="Row_Panel">
                    <h1>Cost Export</h1>
                    <label
                        htmlFor="file-upload2"
                        className="custom-file-upload"
                        onClick={() => {
                            setProgress2(0);
                            setTotalProgress2(0);
                            if (fileInputRef2.current) {
                                fileInputRef2.current.value = "";
                            }
                        }}
                    >
                        {file2}
                    </label>
                    <input
                        id="file-upload2"
                        ref={fileInputRef2}
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                            handleFileUpload(e, "2");
                        }}
                        hidden
                    />
                    <div className="ProgressBar">
                        <p>Uploading</p>
                        <div className="progress">
                            <progress value={progress2} max="100" />
                            <p>{progress2}%</p>
                        </div>
                    </div>
                    <div className="ProgressBar">
                        <p>Process:</p>
                        <div className="progress">
                            <progress value={Totalprogress2} max={"100"} />
                            <p>{Totalprogress2}%</p>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </>
    );
}

export default App;
