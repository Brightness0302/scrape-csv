import { toast } from "react-toastify";

export const showToast = (msg: string, alertType: string) => {
    if (alertType === "error") {
        toast.error(msg);
    } else if (alertType === "success") {
        toast.success(msg);
    } else if (alertType === "warning") {
        toast.warn(msg);
    } else if (alertType === "info") {
        toast.info(msg);
    } else if (alertType === "danger") {
        toast.error(msg);
    } else {
        toast(msg);
    }
};
