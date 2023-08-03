import React, { useState, useRef, useCallback } from "react";

import api from "../../../utils/api";

import { showToast } from "../../../actions/toast";
import { showAlert } from "../../../actions/sweetalert";

interface ICategoryProps {
    loading: Boolean;
    setLoading: Function;
}

interface ErrorResponse {
    response: {
        status: number;
    };
}

const index: React.FC<ICategoryProps> = ({ loading, setLoading }) => {
    const [file, setFile] = useState("Choose File");
    const [progress, setProgress] = useState(0);
    const [Totalprogress, setTotalProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAllRows = async () => {
        const type = "2";
        let count = 0;
        try {
            console.log(1);
            const resCount = await api.post("/getCount", { type: type });
            count = resCount.data.length;
            let index;
            for (index = 0; index < count; index++) {
                const resRow = await api.post(`/getRow/${index}`, {
                    type: type,
                });
                if (resRow.status === 200) {
                    const percentage = Math.round(
                        ((index + resRow.data.count) / count) * 100
                    );
                    setTotalProgress(percentage);
                    showToast(
                        `${index + 1} ~ ${
                            index + resRow.data.count
                        } successful!`,
                        resRow.data !== null ? `success` : `warning`
                    );
                } else if (resRow.status === 500) {
                    showToast(`Server Failed`, `danger`);
                } else {
                    showToast(`${index + 1} failed!`, `warning`);
                }
                index += resRow.data.count - 1;
            }
            console.log(index);
            if (index >= count) {
                showAlert(`${count} Successfully`, "success");
            } else {
                showAlert(`${count} Failed`, "error");
            }
            setLoading(false);
        } catch (err) {
            setLoading(false);
            showAlert(`File Processing Failed`, "error");
            console.log(err);
        }
    };

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const type = "2";
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            const formData = new FormData();
            formData.append("file", file);
            formData.append("type", type);

            setFile(file.name);

            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: any) => {
                    const percentage = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    // if (type === "1" && percentage === 100)
                    //     showToast(`Uploaded CSV successfully.`, `success`);
                    // if (type === "2" && percentage === 100)
                    //     showToast(`Uploaded CSV successfully.`, `success`);
                    setProgress(percentage);
                },
                onError: (error: any) => {
                    showAlert(`Upload failed.`, "error");
                    console.error("Upload failed:", error);
                },
            };

            try {
                const response = await api.post("/upload", formData, config);
                setTimeout(function () {
                    getAllRows();
                }, 2000);
                if (response?.status === 200) {
                    showToast(`Uploaded CSV successfully.`, `success`);
                }
                console.log(response.data);
            } catch (error) {
                setLoading(false);
                console.error(error);
                if ((error as ErrorResponse)?.response?.status === 404) {
                    showAlert(`Upload failed.`, "error");
                }
            }
        },
        [loading]
    );

    return (
        <div className="Row_Panel">
            <h1>Cost Export</h1>
            <label
                htmlFor="file-upload2"
                className="custom-file-upload"
                onClick={() => {
                    setProgress(0);
                    setTotalProgress(0);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }}
            >
                {file}
            </label>
            <input
                id="file-upload2"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                    setLoading(true);
                    handleFileUpload(e);
                }}
                hidden
            />
            <div className="ProgressBar">
                <p>Uploading</p>
                <div className="progress">
                    <progress value={progress} max="100" />
                    <p>{progress}%</p>
                </div>
            </div>
            <div className="ProgressBar">
                <p>Process:</p>
                <div className="progress">
                    <progress value={Totalprogress} max={"100"} />
                    <p>{Totalprogress}%</p>
                </div>
            </div>
        </div>
    );
};

export default index;
