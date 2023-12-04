import React, { useState } from "react";
import Button from "../../../components/button/button";
import Image from "../../../components/image/image";
import {
  IMAGE_TYPE,
  POSTING_PLACEHOLDER,
  THUMB_CREATION,
} from "../../../lib/config";
import { useTheme } from "react-jss";
import useLang from "../../../hooks/language";
import isMobile from "../../../hooks/isMobile";
import { close_dialog, close_drawer } from "../../../lib/global";

const ThumnailSelection = (props) => {
  const theme = useTheme();
  const { title, onClose, onchange, thumb = [], onThumSelect, crmKeyname = "" } = props;
  const [selected, setSelected] = useState({
    index: props.selectedThumb,
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [lang] = useLang();
  const [mobileView] = isMobile();
  
  const thumbNailSubmitHandler = () => {
    mobileView ? (onClose() || close_drawer("thumbSelectore")) : close_dialog("thumbSelectore");
    onThumSelect(selected.thumb, selected.index, crmKeyname);
  }

  const getProfileCard = (index, image) => {
    return (
      <div
        key={index}
        className="col-4 px-2 mb-2 cursorPtr"
        onClick={() => setSelected({ index, thumb: image })}
      >
        <div className="position-relative">
          {selected.index == index && (
            <div className="overlay-selected">
              <Image src={THUMB_CREATION} />
            </div>
          )}
          <Image
            className="w-100 object-fit image-card"
            height="100%"
            width="100%"
            src={image}
          />
        </div>
      </div>
    );
  };

  const onImageChange = async (r, event) => {
    event.preventDefault();
    const file = event.target.files[0];
    if (!file) {
      return;
    }
    let fileUrl = "";
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      fileUrl = reader.result;
      setThumbnail(fileUrl);
    };
  };

  return (
    <div className="btmModal ">
      <div className="modal-dialog rounded h-100">
        <div className="modal-content h-100 pt-4 pb-4" id="signInContent">
          <div className="col-12 w-330 mx-auto h-100 d-flex flex-column">
            <h5 className="mb-3 pr-0 mr-0 mw-100 text-center appTextColor">
              {lang.chooseCoverPic}
            </h5>
            <div className="row h-100 mb-3 overflow-auto thumbselection-drawer">
              {thumb.map((image, index) => {
                return getProfileCard(index, image);
              })}
              {thumbnail ? (
                <div
                  key={4}
                  className="col-4 px-2 mb-2"
                  onClick={() =>
                    setSelected({
                      index: 4,
                      thumb: thumbnail,
                    })
                  }
                >
                  <div className="position-relative">
                    {selected.index === 4 && (
                      <div className="overlay-selected">
                        <Image src={THUMB_CREATION} />
                      </div>
                    )}
                    <Image
                      className="w-100 object-fit image-card"
                      height="100%"
                      width="100%"
                      src={thumbnail}
                    />
                  </div>
                </div>
              ) : null}
              <div className="col-4 px-2 mb-2" style={{ cursor: "pointer" }}>
                <div
                  className="mv_upload_thumbnail_img no-drag"
                  key="placeholder"
                >
                  <input
                    type="file"
                    id="icon-button-file"
                    accept={IMAGE_TYPE}
                    onChange={(e) => {
                      // e.preventDefault();
                      const el = document.getElementById(
                        "icon-button-file" + 4
                      );
                      onImageChange(4, e);
                    }}
                    className="d-none"
                  />
                  <label htmlFor="icon-button-file">
                    <Image
                      src={POSTING_PLACEHOLDER}
                      className="img_upld_icons"
                      alt="posting-placeholder"
                    />
                  </label>
                </div>
              </div>
            </div>
            <div>
              <Button
                onClick={thumbNailSubmitHandler}
                type="button"
                cssStyles={theme.blueButton}
                id="crtr_login_signup_modal3"
              >
                {lang.save}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThumnailSelection;
