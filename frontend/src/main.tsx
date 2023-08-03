import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
//Toast
import "react-toastify/dist/ReactToastify.css";
//SweetAlert2
import "sweetalert2/dist/sweetalert2.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
