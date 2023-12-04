import React, { useEffect, useRef, useState } from "react";
import { creatorSearch } from "../../../services/assets";
import {
  INFO,
  defaultCurrency,
  defaultCurrencyCode,
  PROFILE_INACTIVE_ICON,
  EMPTY_PROFILE,
  IMAGE_TYPE,
} from "../../../lib/config";
import Router, { useRouter } from "next/router";
import {
  close_drawer,
  drawerToast,
  open_drawer,
  open_dialog,
  startLoader,
  stopLoader,
  close_dialog,
} from "../../../lib/global";
import { getCookiees } from "../../../lib/session";
import { generaeVideThumb } from "../../../lib/image-video-operation";
import { createPopper } from "@popperjs/core";
import { css } from "emotion";
import { uploadPost } from "../../../lib/postingTask";
import isMobile from "../../../hooks/isMobile";
import useLang from "../../../hooks/language";
import dynamic from "next/dynamic";
import Button from "../../../components/button/button";
import { useTheme } from "react-jss";
import { useSelector } from "react-redux"

import CustomHead from "../../../components/html/head";
import Wrapper from "../../../components/wrapper/wrapper";
import { ValidateTwoDecimalNumber } from "../../../lib/validation/validation";
import { getHashtagAPI } from "../../../services/hashtag";
import { Avatar, Paper } from "@material-ui/core";
const Header = dynamic(() => import("../../../components/header/header"), { ssr: false });
const PlaceholerComponent = dynamic(() => import("../../../containers/post/placeholderContainer"), { ssr: false });
const ImageContainer = dynamic(() => import("../../../containers/post/imageContainer"), { ssr: false });
const Image = dynamic(() => import("../../../components/image/image"), { ssr: false });
const Switch = dynamic(() => import("../../../components/formControl/switch"), { ssr: false });
const VideoContainer = dynamic(() => import("../../../containers/post/videoContainer"), { ssr: false });
const TextAreaContainer = dynamic(() => import("../../../containers/post/textAreaContainer"), { ssr: false });
const RadioButtonsGroup = dynamic(() => import("../../../components/radio-button/radio-button-group"), { ssr: false });
const Img = dynamic(() => import("../../../components/ui/Img/Img"), { ssr: false });
const DvHeader = dynamic(() => import("../../../containers/DvHeader/DvHeader"), { ssr: false });
const CancelIcon = dynamic(() => import("@material-ui/icons/Cancel"), { ssr: false });

const TextBulkMessage = (props) => {
  const theme = useTheme();
  const params = useRouter();
  const { query = {} } = params;

  const [mobileView] = isMobile();
  const [lang] = useLang();
  const { tab = "timeline" } = query;
  const [textPost, setTextPost] = useState('')
  const [textAlignPicker, setTextAlignPicker] = useState(false)
  const [textAlign, setTextAlign] = useState("left")

  const [textColor, setTextColor] = useState('#fff')
  // const [bgColor, setBgColor] = useState(textPostBGColorList[0])
  const [bgColor, setBgColor] = useState("#003973")
  const [colorPicker, setColorPicker] = useState(false)
  const [fontStylePicker, setFontStylePicker] = useState(false)
  const [font, setFont] = useState()

  useEffect(() => {
    if (textPost) {
      props.setIsDataValid(true)
      props.setTextData({
        text: textPost,
        bgColor,
        textStyle: font,
        color: textColor,
        textAlign
      })
    }
    else {
      props.setIsDataValid(false)
    }

  }, [textPost, bgColor, textColor, font, textAlign])

  const handleTexPostChange = (text) => {
    if (text.length <= 300) {
      setTextPost(text)
    }
    return;
  }

  const handleColorPicker = () => {
    setColorPicker(!colorPicker);
    setFontStylePicker(false)
    setTextAlignPicker(false)
  }

  const handleTextStyleChange = () => {
    setFontStylePicker(!fontStylePicker);
    setColorPicker(false)
    setTextAlignPicker(false)
  }

  const handleTextAlignPicker = () => {
    setTextAlignPicker(!textAlignPicker)
    setFontStylePicker(false)
    setColorPicker(false)
  }

  const validaPosting = () => {
    const {
      postType,
    } = postingData;

    if (textPost != '') {
      if (postType == 2 || postType == 3) {
        return setIsValid(true)
      }
      else {
        return setIsValid(true)
      }
    }
    return setIsValid(true);
  };

  const TxtAreaContainer = () => {
    return (
      <TextAreaContainer
        paddingLeft={'0px'}
        paddingRight={'0px'}
        textPost={textPost}
        bgColor={bgColor}
        setBgColor={setBgColor}
        font={font}
        textColor={textColor}
        setFont={setFont}
        colorPicker={colorPicker}
        handleColorPicker={handleColorPicker}
        fontStylePicker={fontStylePicker}
        handleTexPostChange={handleTexPostChange}
        handleTextStyleChange={handleTextStyleChange}
        onClick={setColorPicker}
        textAlignPicker={textAlignPicker}
        handleTextAlignPicker={handleTextAlignPicker}
        textAlign={textAlign}
        setTextAlign={setTextAlign}
      />
    )
  }

  return (
    <>
      {mobileView ? (
        <>
          <div style={{ paddingTop: '20px' }}>
            <div className="col-12">
              <form>
                <div className="mb-4 mt-2">
                  {TxtAreaContainer()}
                </div>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className='col-12 px-1 pr-1'>
          <form>
            <div style={{ height: '100%' }} className="mb-4 mt-2">
              {TxtAreaContainer()}
            </div>
          </form>
        </div>
      )}
      <style jsx>{`
        :global(.MuiAvatar-colorDefault, .hashtags) {
          font-family: cursive;
          font-size: x-large;
          background-color: ${theme.appColor};
          color: ${theme.background};
        }
      `}</style>
    </>
  );
};

export default TextBulkMessage;
