import React from "react";
import Image from "../../components/image/image";
import useLang from "../../hooks/language";
import {
  PLUS_ICONS,
  P_CLOSE_ICONS,
  VIDEO_P_BACKGROUND,
} from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import { Typography } from "@material-ui/core";
import { useTheme } from "react-jss";

// MUI Icon
import ControlPointRoundedIcon from "@material-ui/icons/ControlPointRounded";
import Icon from "../../components/image/icon";

const PlaceholerComponent = (props) => {
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();
  const { width, height, style, placeholderText, bulkMessage, ...otherProps } = props;

  return (
    <>
      {mobileView ? (
        <div className="col-12">
          <div className="position-relative d-flex justify-content-center">
            <Image
              src={VIDEO_P_BACKGROUND}
              width={width || "100%"}
              height={height || "100%"}
              style={style}
              alt="background-placeholder"
            />
            {/* <Icon
              icon={`${VIDEO_P_BACKGROUND}#background-placeholder`}
              color={theme.palette.l_light_grey3}
              size={20}
              viewBox="0 0 340 340" 
            /> */}

            <div className="text-center mv_set_mid_poAbs">
              {/* <Image src={PLUS_ICONS} width={66} /> */}
              <div className="txt-book fntSz14 bold">{lang.placeholderText}</div>
            </div>
          </div>
        </div>
      ) : (
        <div style={bulkMessage ? { width: 'unset' } : {}} className="h-100 dv_purchase_dialog dv_media_container cursorPtr d-flex justify-content-center align-items-center">
          <div className="d-flex justify-content-center flex-column align-items-center" >
            <ControlPointRoundedIcon
              style={{ fontSize: '10vh', opacity: '0.5' }}
              className="text-muted"
            />
            <p className="dv_appTxtClr_web fntSz14">{props.placeholderText ? placeholderText : lang.videoPhotos}</p>
          </div>
          {/* <Typography
            variant="body2"
            className="font-weight-bold text-center type_pos"
            style={{ fontSize: '2.5vh' }}
          >
          </Typography> */}
        </div>
      )}
    </>
  );
};

export default PlaceholerComponent;
