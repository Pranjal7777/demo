import Image from "../image/image";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import React, { useState, useEffect } from "react";
import { useTheme } from "react-jss";
import { makeStyles } from "@material-ui/core/styles";
import Icon from "../image/icon";
import isMobile from "../../hooks/isMobile";
import { sharpCornerIcon, sharpCornerIconLight } from "../../lib/config";

const useStyles = makeStyles((theme) => ({
  iconRoot: {
    minWidth: "2.928vw",
  },
  menuLabel: {
    color: (props) => props.text,
    fontFamily: `"Roboto", sans-serif !important`,
    fontSize: "1.171vw",
    [theme.breakpoints.between('sm', 'md')]: {
      fontSize: 'calc(1.171vw + 3px)',
    }
  },

}));

const ProfileDropdownMenu = (props) => {
  const theme = useTheme();
  const { button, menuItems } = props;
  const classes = useStyles(theme);
  const [mobileView] = isMobile();
  let dropdownRef;

  useEffect(() => {
    dropdownRef = document.querySelector(".profile_btn");
    dropdownRef.addEventListener("click", handleClick);
    return () => {
      dropdownRef.removeEventListener("click", handleClick);
    };
  }, [])

  const handleClick = () => {
    dropdownRef.classList.toggle("display");
    const classBool = dropdownRef.classList.contains("display");
    props.handleArow(classBool);
  }

  return (
    <div>
      <div className="dropdown profileDropdown">
        <button
          className="btn profile_btn dropdown-toggle"
          type="button"
          id="dropdownMenu2"
          data-toggle="dropdown"
          style={{ display: "flex" }}
        >
          {button}
        </button>
        <div
          className="dropdown-menu profile_dropdown_menu "
          aria-labelledby="dropdownMenu2"
        >
          <div className="position-relative" style={{ zIndex: "999" }}>
            {theme.type == "light" ?
              <Image src={sharpCornerIconLight} className="ml-2 locPointer" alt="up arrow" width={15} height={15} />
              :
              <Icon
                icon={`${sharpCornerIcon}#sharpArrowIcon`}
                size={15}
                color={theme.background}
                viewBox="0 0 24 17"
                class="ml-2 locPointer"
              />}
            {menuItems &&
              menuItems.length &&
              menuItems.map((item, index) => (
                <button
                  className="dropdown-item"
                  type="button"
                  key={index}
                  onClick={() => item.onClick(item.label)}
                >
                  <ListItemIcon classes={{ root: classes.iconRoot }}>
                    {/* <Image
                      src={item.icon}
                      style={{
                        maxWidth: `${item.iconWidth}`,
                        maxHeight: `${item.iconHeight}`,
                      }}
                    /> */}

                    <Icon
                      icon={`${item.icon}#${item.id}`}
                      color={theme.type == "light" ? "black" : "white"}
                      width={mobileView ? 25 : item.iconWidth}
                      height={mobileView ? 25 : item.iconHeight}
                      unit={mobileView ? "px" : "vw"}
                    // viewBox="0 0 20.241 20.294"
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.label}
                    classes={{ primary: classes.menuLabel }}
                  />
                </button>
              ))}
          </div>
        </div>
      </div>
      <style jsx>
        {`
          :global(.profile_btn) {
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
          }
          :global(.profile_dropdown_menu) {
            background: ${theme.background};
            padding: 0 !important;
            top: 116% !important;
            right: -14px !important;
            left: unset !important;
            transform: unset !important;
            margin-top: 0.585vw;
          }
          :global(.profile_dropdown_menu .dropdown-item) {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px 16px;
          }
          :global(.profile_dropdown_menu .dropdown-item:hover) {
            background: ${theme.palette.l_base_o60} !important;
          }
          :global(.dropdown-toggle::after) {
            display: none;
          }

          :global(.locPointer) {
            position: absolute;
            z-index: -16;
            margin-top: ${theme.type == "light" ? "-6px" : "-13px"};
            right: 11px;
            top: -7px;
          }
          
        `}
      </style>
    </div>
  );
};

export default ProfileDropdownMenu;
