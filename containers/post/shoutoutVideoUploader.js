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
import VideocamIcon from '@material-ui/icons/Videocam';

// MUI Icon
import ControlPointRoundedIcon from "@material-ui/icons/ControlPointRounded";
import Icon from "../../components/image/icon";

const PlaceholerComponent = (props) => {
  const {
    width,
    height,
    ...otherProps
  } = props
  const theme = useTheme();
  const [lang] = useLang();
  const [mobileView] = isMobile();

  return (
    <>
      {mobileView ? (
        <div className="position-relative">
          <VideocamIcon style={{
            border: `1.5px dotted ${theme.palette.l_base}`,
            padding: '17px',
            width: `${width}`,
            height: `${height}`,
            // background: '#f4f1f1',
            color:' var(--l_app_text) ',
            borderRadius: "10px",
          }} />
        </div>
      ) : (
        <div className="dv_img_placeholder dv_media_container cursorPtr">
          <ControlPointRoundedIcon
            style={{ fontSize: 59 }}
            className="plus_ico_pos"
          />
          <Typography
            variant="body2"
            className="font-weight-bold text-center type_pos"
          >
            {lang.video_photos}
          </Typography>
        </div>
      )}
    </>
  );
};

export default PlaceholerComponent;
