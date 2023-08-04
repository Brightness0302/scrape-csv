import Swal from "sweetalert2";

export const showAlert = async (msg: string, alertType: string) => {
    if (alertType === "error") {
        await Swal.fire("Error", msg, "error");
    } else if (alertType === "success") {
        await Swal.fire("Success", msg, "success");
    } else if (alertType === "warning") {
        await Swal.fire("Warning", msg, "warning");
    } else if (alertType === "info") {
        await Swal.fire("Info", msg, "info");
    } else if (alertType === "danger") {
        await Swal.fire("Error", msg, "error");
    } else {
        await Swal.fire("Success", msg, "success");
    }
};
