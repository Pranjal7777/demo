import React, { useRef, useState } from "react";
import { IMAGE_TYPE } from "../../lib/config";
import { open_drawer } from "../../lib/global";

const ImagePicker = (props) => {
  const file = useRef(null);
  const [fileObject, setFileObject] = useState({});

  const performClick = () => {
    file.current.click();
  };

  const fileSelect = (e) => {
    const file = e && e.target.files;
    // console.log("fneif", typeof e.target.files, e.target.files);
    if (file && file[0]) {
      const fileUrl = URL.createObjectURL(file[0]);
      open_drawer(
        "ImageCropper",
        {
          cropRoundImg: props.cropRoundImg,
          file: file,
          currentImg: fileUrl,
          handleUploadMedia: props.onChange,
          onClose: props.handleClose,
          aspectRatio: props.aspectRatio,
        },
        "top"
      );
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={file}
        className="form-input"
        style={{ display: "none" }}
        onChange={fileSelect}
        accept={props.accept || IMAGE_TYPE}
        disabled={props.disabledField}
      />
      <div onClick={performClick} className={props.className || ""}>
        {props.render() && props.render()}
      </div>
    </div>
  );
};

export default ImagePicker;
