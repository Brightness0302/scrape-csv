import { useState } from "react";

import { ToastContainer } from "react-toastify";
import "./App.css";

import Category from "./components/pages/Category";
import Cost from "./components/pages/Cost";
import LoadingSpinnerContainer from "./components/LoadingSpinnerContainer";

function App() {
    //loading is status of progress, if loading is true, it means it is progressing now and if it is false, it means it had finished progressing.
    const [loading, setLoading] = useState(false);

    return (
        <>
            <div className="App">
                <Category loading={loading} setLoading={setLoading} />
                <div className="divider"></div>
                <Cost loading={loading} setLoading={setLoading} />
            </div>
            <ToastContainer />
            {loading && <LoadingSpinnerContainer />}
        </>
    );
}

export default App;
