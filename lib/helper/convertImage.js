export const convertImage = ({ src, webp = false, compress = false }) => {
    if (src) {
        let newUrl = src;

        if (compress) {
            let imageUrl = src.split("/");
            let index = imageUrl.indexOf("upload");
            imageUrl.splice(index + 1, 0, "w_300/q_auto");
            newUrl = imageUrl.join("/");
        }
        let img = newUrl.split(".");
        img[img.length - 1] = webp ? "webp" : "png";

        // console.log("sdsdsdasd", img.join());
        return img.join(".");
    } else {
        return "";
    }
};