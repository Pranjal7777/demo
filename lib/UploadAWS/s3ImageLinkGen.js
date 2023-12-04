import { textencode } from "../textEncodeDecode";

const viewUnitConvert = (vwOrvh = '') => {
    if (vwOrvh.includes('vw')) {
        return parseInt((window.innerWidth / 100) * parseInt(vwOrvh));
    }
    if (vwOrvh.includes('vh')) {
        return parseInt((window.innerHeight / 100) * parseInt(vwOrvh));
    }
}

export const s3ImageLinkGen = (baseImgURL = "https://photo.testbombshellsite.com", publicId, quality, width, height, blur) => {
    const s3Options = { "bucket": "bombshellcreator-images", "key": publicId, "edits": { "resize": {}, "jpeg": { "quality": 80, "progressive": true, "mozjpeg": true } } };
    if (quality) {
        s3Options.edits.jpeg.quality = +quality;
    }
    if (width) {
        if (+width) s3Options.edits.resize.width = +width;
        else if (width?.includes('v') && typeof window !== 'undefined') {
            let widthVw = viewUnitConvert(width);
            s3Options.edits.resize.width = +widthVw;
        }
    };
    if (height) {
        if (+height) s3Options.edits.resize.height = +height;
        else if (height?.includes('v') && typeof window !== 'undefined') {
            let heightVh = viewUnitConvert(height);
            s3Options.edits.resize.height = +heightVh;
        }
    };
    if (blur) {
        s3Options.edits.jpeg.quality = 1;
        s3Options.edits.blur = +blur;
    };
    const url = `${baseImgURL}/${textencode(JSON.stringify(s3Options))}`;
    return url;
}