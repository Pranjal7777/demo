import React from "react";
import Wrapper from "../../hoc/Wrapper";
import NotificationDrawer from "../../components/DropdownMenu/notificationDrawer";
import {
  LOGO,
  NOTIFICATION_ICON,
  NOTIFICATION_ICON_Blue,
} from "../../lib/config";
import { authenticate } from "../../lib/global";
import Router from "next/router";
import { getCookie } from "../../lib/session";
import Image from "../../components/image/image";

export default function OtherProfileHeader(props) {
  const auth = getCookie("auth");

  return (
    <Wrapper>
      <div className="col-12 p-0 d-flex align-items-center dv__header">
        <div className="websiteContainer">
          <div className="row m-0 align-items-center justify-content-between">
            <div className="col-auto order-1 order-md-1 mb-3 mb-md-0 p-0">
              <Image
                src={LOGO}
                className="logoImg"
                onClick={() =>
                  authenticate().then(() => {
                    props.setActiveState && props.setActiveState("timeline");
                    Router.push("/");
                  })
                }
              />
            </div>
            <div className="col-auto order-2 order-md-2">
              <div className="row align-items-center">
                <div className="col-auto">
                  {auth ? (
                    <NotificationDrawer
                      button={<div className="dv__notification__icon"></div>}
                    />
                  ) : (
                    <div
                      className="dv__notification__icon"
                      onClick={() =>
                        authenticate().then(() => { }).catch(err => console.log(err))
                      }
                    ></div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx>
        {`
          .dv__notification__icon {
            background: url(${NOTIFICATION_ICON}#notification);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }

          :global(.active-notification .dv__notification__icon) {
            background: url(${NOTIFICATION_ICON_Blue}#notification_icon);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
          .dv__notification__icon:hover {
            background: url(${NOTIFICATION_ICON_Blue}#notification_icon);
            background-size: contain;
            background-repeat: no-repeat;
            background-position: center;
          }
        `}
      </style>
    </Wrapper >
  );
}
