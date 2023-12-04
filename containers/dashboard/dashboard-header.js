import Router from "next/router";
import React, { useState } from "react";
import FigureImage from "../../components/image/figure-image";
import Icon from "../../components/image/icon";
import Image from "../../components/image/image";
import useProfileData from "../../hooks/useProfileData";
import * as config from "../../lib/config";
import { authenticate, open_drawer } from "../../lib/global";
import { getCookie } from "../../lib/session";
import { useTheme } from "react-jss";

export default function DashboardHeader(props) {
  const [profile] = useProfileData();
  const [auth] = useState(getCookie("auth"));
  const { creatorDashboard } = props;
  const theme = useTheme();

  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      {
        paperClass: "backNavMenu",
        setActiveState: props.setActiveState,
        ...props,
      },
      "right"
    );
    // open_drawer(
    //   "SideNavMenu",
    //   { setActiveState: props.setActiveState },
    //   "right"
    // );
  };

  return (
    <div className={`mv_header ${props.className}`}>
      <div className="col-12">
        <div className="row">
          <div className="container">
            <div className="row justify-content-between align-items-center py-3">
              <div className="col-auto d-flex align-items-center">
                {creatorDashboard ? (
                  ""
                ) : (
                  <Icon
                    icon={`${config.backArrow}#left_back_arrow`}
                    color={theme.type === "light" ? "#000" : "#fff"}
                    width={24}
                    height={22}
                    className="mr-3"
                    onClick={() => {
                      Router.back();
                    }}
                  />
                )}
                <p className="fntSz22 txt-heavy m-0 sectionHeadingMobile">Dashboard</p>
              </div>
              <div className="col-auto">
                <div className="row m-0">
                  {!props.isSharedProfile && (
                    <Icon
                      icon={`${config.NOTIFICATION_ICON}#notification`}
                      color={theme.type === "light" ? "#000" : "#fff"}
                      width={24}
                      height={22}
                      onClick={() =>
                        authenticate().then(() => {
                          Router.push("/notification");
                        })
                      }
                    />
                  )}

                  <Icon
                    icon={`${config.HUMBERGER_ICON}#humberger_menu`}
                    color={theme.type === "light" ? "#000" : "#fff"}
                    width={24}
                    height={22}
                    alt="humnerger_menu"
                    onClick={() => {
                      auth ? handleNavigationMenu() : authenticate().then();
                    }}
                    style={{ marginLeft: "10px" }}
                    viewBox="0 0 22.003 14.669"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
