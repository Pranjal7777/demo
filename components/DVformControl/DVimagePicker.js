import React, { useState } from "react";
import ImagePicker from "../formControl/imagePicker";
import Image from "../image/image";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { APP_NAME } from "../../lib/appName";
import Icon from "../image/icon";
import { desktopIcon } from "../../lib/config/placeholder";
import { report_img_picker } from "../../lib/config";
const DVimagePicker = (props) => {
  const { setStap, signUpdata = {}, isAgency, agencySignup } = props;
  const [file, setFile] = useState(props.signUpdata?.pic || {});
  const [Register] = useForm();
  const [lang] = useLang();
  const { setPic } = props;

  const onImageChange = (file, url) => {
    setFile({
      file,
      url,
    });
    setPic({
      file,
      url,
    });
  };

 
  return (
    <div className="col-12 text-center p-0">
      {/* <div> */}
      {/* <div className="w-330 mx-auto content-secion"> */}
      <ImagePicker
        aspectRatio={1 / 1}
        cropRoundImg={false}
        onChange={onImageChange}
        disabledField={props.disabledField}
        render={() => {
          return (
            // <form className="mb-3">
            <form>
              <figure className="position-relative">
                <p className="signIn__txt cursorPtr text-left fntSz11 mb-3 light_app_text" >{lang.coverImageText + APP_NAME}</p>
                <div className="col-auto px-0 text-left d-flex align-items-center">
                  {file.url ? <Image
                    alt="profile-placeholder"
                    src={file.url}
                    // className={file.url ? "mb-2" : ""}
                    className="cursorPtr text-left rounded"
                    width={70}
                    height={70}
                  /> : 
                  <Icon
                    icon={report_img_picker + "#add-image"}
                    width={70}
                    height={70}
                    class='cursorPtr'
                    viewBox="0 0 100 100"
                  />
                  }
                  <span className="ml-3">
                    {props.dvCreatorSignup
                      ? <h6
                        className="cursorPtr text-left">{lang.upload}</h6>
                      : ""
                    }
                    <div className="fntSz11 signIn__txt my-2 light_app_text">{lang.supportImgUpload}</div>
                  </span>
                </div>

              </figure>
            </form>
          );
        }}
      />
      {/* </div> */}
      {/* </div> */}
    </div>
  );
};

export default React.memo(DVimagePicker);
