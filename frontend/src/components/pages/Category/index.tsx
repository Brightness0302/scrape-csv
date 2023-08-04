import React, { useState, useRef, useCallback, useEffect } from "react";

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
    const [fileName, setFileName] = useState("Choose File");
    const [uploadFile, setUploadFile] = useState<File>();
    const [progress, setProgress] = useState(0);
    const [Totalprogress, setTotalProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const getAllRows = async () => {
        const type = "1";
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
                await showAlert(`${count} Successfully`, "success");
            } else {
                await showAlert(`${count} Failed`, "error");
            }
            setLoading(false);
            setUploadFile(undefined);
        } catch (err) {
            setLoading(false);
            setUploadFile(undefined);
            showAlert(`File Processing Failed`, "error");
            console.log(err);
        }
    };

    const handleFileUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            if (!event.target.files || event.target.files.length === 0) return;
            const file = event.target.files[0];
            setUploadFile(file);
            if (loading === false) {
                setLoading(true);
            }
        },
        [loading]
    );

    const fetchData = useCallback(async () => {
        if (uploadFile) {
            const type = "1";
            const formData = new FormData();
            formData.append("file", uploadFile);
            formData.append("type", type);

            setFileName(uploadFile.name);

            const config = {
                headers: {
                    "content-type": "multipart/form-data",
                },
                onUploadProgress: (progressEvent: any) => {
                    const percentage = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
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
                setUploadFile(undefined);
                console.error(error);
                if ((error as ErrorResponse)?.response?.status === 404) {
                    showAlert(`Upload failed.`, "error");
                }
            }
        }
    }, [uploadFile]);

    useEffect(() => {
        console.log("upload", loading);
        console.log("Category");
        fetchData();
    }, [loading]);

    return (
        <div className="Row_Panel">
            <h1>Category Export</h1>
            <label
                htmlFor="file-upload1"
                className="custom-file-upload"
                onClick={() => {
                    setProgress(0);
                    setTotalProgress(0);
                    if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                    }
                }}
            >
                {fileName}
            </label>
            <input
                id="file-upload1"
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={(e) => {
                    // setLoading(true);
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
