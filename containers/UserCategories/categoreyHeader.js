import React from "react";
import FigureImage from "../../components/image/figure-image";
import Image from "../../components/image/image";
import Wrapper from "../../hoc/Wrapper";
import * as config from "../../lib/config";
import Router from "next/router";
import { authenticate, open_drawer } from "../../lib/global";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";

const CategoreyHeader = (props) => {
  const theme = useTheme();

  const handleNavigationMenu = () => {
    open_drawer(
      "SideNavMenu",
      { paperClass: "backNavMenu", setActiveState: props?.setActiveState, ...props },
      "right"
    );
  };

  return (
    <Wrapper>
      <div className="categoreyHeader align-items-center col-12 d-flex">
        <div className="col">
          <Image
            fclassname="mb-0"
            src={config.LOGO}
            width={110}
            height={44}
            alt="logoUser"
            onClick={() => props.gotoTop()}
          />
        </div>
        <div className="col-auto pr-0">
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
        </div>
        <div className="col-auto pl-1 pr-0">
          <Icon
            icon={`${config.HUMBERGER_ICON}#humberger_menu`}
            color={theme.type === "light" ? "#000" : "#fff"}
            width={24}
            height={22}
            alt="humnerger_menu"
            onClick={() => {
              handleNavigationMenu();
            }}
            style={{ marginLeft: "10px" }}
            viewBox="0 0 22.003 14.669"
          />
        </div>
      </div>
      <style jsx>{`
        .categoreyHeader {
          position: sticky;
          top: 0;
          z-index: 15;
          background: ${theme.background};
          height: 70px;
        }
      `}</style>
    </Wrapper>
  );
};

export default CategoreyHeader;
