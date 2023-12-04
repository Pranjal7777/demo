import dynamic from "next/dynamic";
import React from "react";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import Icon from "../image/icon";
import { more_symbol } from "../../lib/config/homepage";
const MaterialMenu = dynamic(() => import("./materialMenu")); //split material menu into separate components

export default function MenuModel(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const [mobileView] = isMobile();

  const [select, setSelect] = React.useState(props.selected);

  const handleClick = (event) => {
    props.handleOpenMenu && props.handleOpenMenu(true);
    setAnchorEl(event.currentTarget || null);
  };

  const handleChange = (event) => {
    const { items } = props;
    setAnchorEl(null);
    setSelect(items[event] || select);
    return props.handleChange(items[event] || select);
  };
  return (
    <div
      className={props.className}
      style={!mobileView ? { cursor: "pointer" } : {}}
    >
      <div
        aria-controls="fade-menu"
        onClick={handleClick}
        className="cursorPtr hover_bgClr mx-1"
        style={{ borderRadius: "10px" }}
      >
        <Icon
          icon={`${more_symbol}#_Icons_Close_Copy_4`}
          color={
            props.iconColorWhite
              ? theme.palette.l_app_bg
              : theme.palette.l_app_text
          }
          hoverColor='var(--l_base)'
          // style={{filter:"drop-shadow(rgba(0, 0, 0, 0.9) 0px 0px 3px)"}}
          size={mobileView ? (props.imageWidth ? props.imageWidth : 23) : 2.6}
          unit={mobileView ? "px" : "vw"}
          viewBox="0 0 52 52"
          class={props.className}
        />
      </div>
      {!!anchorEl && <MaterialMenu {...props} anchorEl={anchorEl} setAnchorEl={setAnchorEl} handleChange={handleChange} theme={theme} />}
      <style jsx>
        {`
          :global(.MuiList-padding) {
            padding-top: 0px !important;
            padding-bottom: 0px !important;
          }
        `}
      </style>
    </div>
  );
}

