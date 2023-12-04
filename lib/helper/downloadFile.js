import { APP_NAME } from "../appName";

export const downloadFile = (url, extension, fileName = "") => {
    fetch(url)
        .then((resp) => resp.blob())
        .then((blob) => {

            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.style.display = "none";
            a.href = url;
            fileName.length
                ? a.download = `${fileName}`
                : a.download = `${APP_NAME}_${new Date()}.${extension}`;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch((e) => {
            console.error("error", e);
        });
};