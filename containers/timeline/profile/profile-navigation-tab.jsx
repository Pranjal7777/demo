import React from "react";
import Icon from "../../../components/image/icon";
import * as config from "../../../lib/config";
import { useTheme } from "react-jss";

export default function ProfileNavigationTab(props) {
  const theme = useTheme();
  const { tabType } = props;

  return (
    <div className="col-12 mb-4">
      <div className="row dv_base_bg_dark_color py-2">
        <div className="container">
          <ul
            className="nav nav-pills nav-justified dv_profileUL"
            role="tablist"
          >
            <li className="nav-item">
              <a
                className="nav-link active"
                data-toggle="pill"
                href="#home"
                role="tab"
                onClick={() => {
                  // console.log("Profile Navigation");
                  props.setActiveState("grid_post");
                }}
              >
                <Icon
                  icon={`${config.GRID_ICON}#Group_131998`}
                  color={tabType === "grid_post" ? theme.l_base : "#4E586E"}
                  size={tabType === "grid_post" ? 23 : 21}
                />
              </a>
            </li>

            <li className="nav-item" value="image">
              <a
                className="nav-link"
                data-toggle="pill"
                href="#menu1"
                onClick={() => {
                  // console.log("Profile Navigation");
                  props.setActiveState("image_post");
                }}
              >
                <Icon
                  icon={`${config.IMAGE_ICON}#image`}
                  color={tabType === "image_post" ? theme.l_base : "#fff"}
                  size={tabType === "image_post" ? 29 : 26}
                />
              </a>
            </li>

            <li className="nav-item" value="video">
              <a
                className="nav-link"
                data-toggle="pill"
                href="#menu2"
                onClick={() => {
                  // console.log("Profile Navigation");
                  props.setActiveState("video_post");
                }}
              >
                <Icon
                  icon={`${config.VIDEO_ICON}#video`}
                  color={tabType === "video_post" ? theme.l_base : "#fff"}
                  size={tabType === "video_post" ? 29 : 27}

                />
              </a>
            </li>

            <li className="nav-item">
              <a
                className="nav-link"
                data-toggle="pill"
                href="#menu3"
                onClick={() => {
                  // console.log("Profile Navigation");
                  props.setActiveState("lock_post");
                }}
              >
                <Icon
                  icon={`${config.LOCK_ICON}#lock`}
                  color={tabType === "lock_post" ? theme.l_base : "#fff"}
                  size={tabType === "lock_post" ? 30 : 27}
                />
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
