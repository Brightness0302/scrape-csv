import Swal from "sweetalert2";

export const showAlert = (msg: string, alertType: string) => {
    if (alertType === "error") {
        Swal.fire("Error", msg, "error");
    } else if (alertType === "success") {
        Swal.fire("Success", msg, "success");
    } else if (alertType === "warning") {
        Swal.fire("Warning", msg, "warning");
    } else if (alertType === "info") {
        Swal.fire("Info", msg, "info");
    } else if (alertType === "danger") {
        Swal.fire("Error", msg, "error");
    } else {
        Swal.fire("Success", msg, "success");
    }
};
