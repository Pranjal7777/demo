import React, { useState } from "react";
import Button from "../../../components/button/button";
import ImagePicker from "../../../components/formControl/imagePicker";
import Image from "../../../components/image/image";
import useLang from "../../../hooks/language";
import useForm from "../../../hooks/useForm";
import { ProfilePlaceholder } from "../../../lib/config";
import { useTheme } from "react-jss";

const ProfilePic = (props) => {
  const { setStap, signUpdata = {} } = props;
  const [file, setFile] = useState(props.signUpdata || {});
  const [Register] = useForm();
  const [lang] = useLang();
  const theme = useTheme();

  const onImageChange = (file, url) => {
    setFile({
      file,
      url,
    });
  };

  return (
    <div>
      <div className="w-330 mx-auto content-secion pb-3">
        <div className="col-12 text-center">
          <ImagePicker
            onChange={onImageChange}
            aspectRatio={1 / 1}
            cropRoundImg={false}
            render={() => {
              return (
                <form className="mb-4">
                  <figure>
                    <Image
                      alt="profile-placeholder"
                      src={file.url || ProfilePlaceholder}
                      className={file.url ? "profile-rounded object-fit" : ""}
                      width={155}
                      height={155}
                      id
                    />
                  </figure>
                  <div className="txt-book fntSz16 pointer">
                    {!file.url ? lang.upload : lang.change}
                  </div>
                </form>
              );
            }}
          ></ImagePicker>
        </div>
      </div>
      <div className="posBtm">
        <Button
          disabled={!file.url}
          type="button"
          onClick={() => setStap(file)}
          cssStyles={theme.blueButton}
          id="scr6"
        >
          {lang.next}
        </Button>
      </div>
    </div>
  );
};

export default React.memo(ProfilePic);
