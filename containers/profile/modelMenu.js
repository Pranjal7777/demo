import React, { useEffect } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import Fade from "@material-ui/core/Fade";
import * as config from "../../lib/config";
import isMobile from "../../hooks/isMobile";
import { useTheme } from "react-jss";
import Icon from "../../components/image/icon";
import { makeStyles } from "@material-ui/core/styles";
import { authenticate, open_dialog, open_drawer } from "../../lib/global";

const useStyles = makeStyles((theme) => ({
  gutters: {
    background: "#000",
    color: "#fff",
  },
  menu: {
    "& .MuiPaper-root": {
      backgroundColor: "#000",
      color: "#fff",
    },
  },
}));

export default function MenuModelShoutout(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const theme = useTheme();
  const [mobileView] = isMobile();

  const [select, setSelect] = React.useState(props.selected);
  const classes = useStyles();

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

  const handleSharePost = () => {
    mobileView
      ? open_drawer(
          "SHARE_ITEMS",
          {
            back: () => close_drawer(),
          },
          "bottom"
        )
      : open_dialog("SHARE_ITEMS", {
          theme: theme,
          back: () => close_dialog("SHARE_ITEMS"),
        });
  };

  return (
    <div
      className={props.className}
      style={!mobileView ? { cursor: "pointer" } : {}}
    >
      <div
        aria-controls="fade-menu"
        onClick={handleClick}
        className="cursorPtr"
      >
        <Icon
          icon={`${config.moreOption_icon}#moreOptions`}
          width={45}
          height={45}
          alt="moreOption"
          class="cursor-pointer"
        />
      </div>
      <Menu
        elevation={2}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        id="fade-menu"
        TransitionComponent={Fade}
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={() => {
          setAnchorEl(null);
          props.handleOpenMenu && props.handleOpenMenu(false);
        }}
        className={classes.menu}
      >
        {props.items.map((data, index) => (
          <MenuItem
            onClick={() =>
              authenticate().then(() => {
                data.label == "Share" ? handleSharePost() : data.label == "Delete" ? props?.deleteShoutoutOrder() : "";
              })
            }
            // onClick={() => handleChange(index)}
            className={classes.gutters}
            key={index}
          >
            {data.label}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
}
