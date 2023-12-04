import React, { useState } from "react";
import ImagePicker from "../formControl/imagePicker";
import Image from "../image/image";
import useLang from "../../hooks/language";
import useForm from "../../hooks/useForm";
import { APP_NAME } from "../../lib/appName";
import Icon from "../image/icon";
import { desktopIcon } from "../../lib/config/placeholder";
import { report_img_picker } from "../../lib/config";
import { ADD_IMG } from "../../lib/config/profile";
const DvAgencyImagePicker = (props) => {
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
                {!isAgency && !agencySignup && <p className="signIn__txt cursorPtr text-left fntSz11 mb-3" style={{ color: '#8B8B8B' }}>{lang.coverImageText + APP_NAME}</p>}
                <div className="col-auto px-0 text-left d-flex">
                  {file.url ? <Image
                    alt="profile-placeholder"
                    src={file.url}
                    // className={file.url ? "mb-2" : ""}
                    className={`cursorPtr text-left ${props.className} `}
                    style={{ borderRadius: ` ${isAgency && "50%"}` }}
                    width={isAgency ? 90 : 70}
                    height={isAgency ? 90 : 70}
                  /> : !isAgency && !agencySignup ? <Icon
                    icon={`${desktopIcon}#Group_132962`}
                    alt="wallet_icon"
                    viewBox="0 0 90 90"
                    color={"var(--l_white)"}
                    className="cursorPtr text-left"
                    class="cursorPtr"
                    width={70}
                    height={70}
                  /> : agencySignup ? <img
                    src={ADD_IMG}
                    width="90"
                    height="90"
                  /> : <img
                    src={desktopIcon}
                    width="90"
                    height="90"
                    style={{ borderRadius: "50%" }}
                  />
                  }
                  {(!isAgency && !agencySignup) && <span className="ml-3">
                    {props.dvCreatorSignup
                      ? <h6
                        className="cursorPtr text-left">{lang.upload}</h6>
                      : ""
                    }
                    <div className="fntSz11 signIn__txt my-2" style={{ color: '#8B8B8B' }}>Supports jpg, png, jpeg (Max. 2mb)</div>
                  </span>}
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

export default React.memo(DvAgencyImagePicker);
